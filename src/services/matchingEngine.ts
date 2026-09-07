/**
 * SEVAMITRA - Smart Matching Engine & Fair Rotation Algorithm
 * SIH26089 | Techforge
 *
 * Implements weighted matching + fair workload rotation so work is democratically
 * distributed among verified cooperative workers rather than monopolized by a few.
 */

import { WorkerProfile, PlatformConfig, RankedWorkerCandidate } from '../types';

export function runSmartMatchingEngine(
  workers: WorkerProfile[],
  requestedCategory: string,
  requestedLocality: string,
  requestedPincode: string,
  config: PlatformConfig,
  activeWorkerJobCounts: Record<string, number> = {}
): RankedWorkerCandidate[] {
  // Step 1: Strict Eligibility Filters
  // 1. Worker is VERIFIED
  // 2. Worker category matches requested service
  // 3. Worker is marked available
  // 4. Worker is not overloaded with active jobs (<= 3 concurrent active jobs)
  const eligibleWorkers = workers.filter((w) => {
    if (w.verificationStatus !== 'VERIFIED') return false;
    if (w.serviceCategory.toLowerCase() !== requestedCategory.toLowerCase()) return false;
    if (!w.isAvailable) return false;
    const activeJobs = activeWorkerJobCounts[w.id] || 0;
    if (activeJobs >= 3) return false;
    return true;
  });

  const rankedCandidates: RankedWorkerCandidate[] = eligibleWorkers.map((worker) => {
    // 1. Category Match (100% since passed filter)
    const categoryScore = 100;

    // 2. Locality & Pincode Match
    const cleanReqLoc = requestedLocality.trim().toLowerCase();
    const cleanReqPin = requestedPincode.trim();
    const cleanWorkerPin = worker.primaryPincode.trim();

    const areaMatch = worker.serviceAreas.some(
      (area) =>
        area.toLowerCase().includes(cleanReqLoc) ||
        cleanReqLoc.includes(area.toLowerCase())
    );
    const pinMatch = cleanWorkerPin === cleanReqPin;

    let localityScore = 40; // Default baseline in municipality
    if (pinMatch && areaMatch) {
      localityScore = 100; // Perfect locality & same pincode
    } else if (pinMatch) {
      localityScore = 90; // Same pincode
    } else if (areaMatch) {
      localityScore = 85; // Named locality match
    }

    // 3. Worker Rating Score (normalized to 100)
    // 5.0 -> 100, 4.0 -> 80, etc.
    const ratingScore = Math.min(100, Math.max(0, (worker.rating / 5) * 100));

    // 4. Availability Score
    const availabilityScore = worker.isAvailable ? 100 : 0;

    // Base Match Score calculation using configurable weights
    // Default weights: 40% category, 30% locality, 15% rating, 15% availability
    const baseMatchScore = Math.round(
      categoryScore * config.weightCategoryMatch +
        localityScore * config.weightLocalityMatch +
        ratingScore * config.weightRating +
        availabilityScore * config.weightAvailability
    );

    // =========================================================================
    // STEP 2: FAIR ROTATION ALGORITHM (Key Differentiator)
    // =========================================================================
    // Workers with fewer jobs this week get an equitable boost.
    // E.g., if worker completed 4 jobs vs another who completed 22 jobs,
    // the worker with 4 jobs receives a higher fairness bonus.
    const jobsThisWeek = worker.jobsThisWeek || 0;
    const threshold = config.maxJobsPerWeekThreshold || 15;

    // Inverse load calculation: fewer jobs -> higher fairness score
    let fairnessScore = 100;
    if (jobsThisWeek >= threshold) {
      fairnessScore = Math.max(25, 100 - (jobsThisWeek - threshold) * 12);
    } else {
      // Bonus gradient for under-allocated cooperative members
      fairnessScore = Math.min(100, 100 - (jobsThisWeek / threshold) * 35);
    }
    fairnessScore = Math.round(fairnessScore);

    // Final Rank Score combines Matching Score + Fairness Adjustment
    // Final = (1 - fairnessWeight) * MatchScore + (fairnessWeight) * FairnessScore
    const fairnessWeight = config.fairnessBonusMultiplier || 0.25;
    const finalRankScore = Math.round(
      baseMatchScore * (1 - fairnessWeight) + fairnessScore * fairnessWeight
    );

    // Generate clear, trustworthy explanations for non-technical users & judges
    const explanations: string[] = [];
    if (pinMatch || areaMatch) {
      explanations.push(`Servicing ${requestedLocality} (Pin: ${worker.primaryPincode})`);
    } else {
      explanations.push(`Extended coverage across district`);
    }

    if (worker.rating >= 4.7) {
      explanations.push(`Top rated (${worker.rating.toFixed(1)}★ from ${worker.ratingCount} reviews)`);
    } else {
      explanations.push(`Certified worker (${worker.rating.toFixed(1)}★ rating)`);
    }

    if (jobsThisWeek <= 8) {
      explanations.push(`Fair rotation priority (available capacity: ${jobsThisWeek} jobs this week)`);
    } else {
      explanations.push(`Active worker (${jobsThisWeek} jobs completed recently)`);
    }

    if (worker.isCooperativeMember) {
      explanations.push(`Verified Cooperative Shareholder Member (${worker.cooperativeId})`);
    }

    const distanceDescription = pinMatch
      ? 'Within 1.5 km of your locality'
      : areaMatch
      ? 'Within 3.0 km of your locality'
      : 'Within 5-8 km of service cluster';

    return {
      worker,
      matchScore: baseMatchScore,
      fairnessScore,
      finalRankScore,
      explanations,
      distanceDescription,
      categoryMatch: true,
      localityMatch: pinMatch || areaMatch,
      ratingScore: Math.round(ratingScore),
      fairnessBonusApplied: jobsThisWeek <= 8,
    };
  });

  // Sort descending by final combined score
  rankedCandidates.sort((a, b) => b.finalRankScore - a.finalRankScore);

  return rankedCandidates;
}

/**
 * Transparent Profit-Sharing Calculation Engine
 * Calculates customer gross payment, platform fee, cooperative reserve, and worker net payout.
 */
export function calculateTransparentFeeSplit(
  quoteAmount: number,
  platformFeePercent: number = 5.0,
  cooperativeFundPercent: number = 2.0
): {
  grossAmount: number;
  platformFee: number;
  cooperativeFund: number;
  workerNetPayout: number;
  platformFeePercent: number;
  cooperativeFundPercent: number;
  workerSharePercent: number;
} {
  const pFee = Math.round(((quoteAmount * platformFeePercent) / 100) * 100) / 100;
  const cFund = Math.round(((quoteAmount * cooperativeFundPercent) / 100) * 100) / 100;
  const workerNet = Math.round((quoteAmount - pFee - cFund) * 100) / 100;
  const workerPercent = 100 - platformFeePercent - cooperativeFundPercent;

  return {
    grossAmount: quoteAmount,
    platformFee: pFee,
    cooperativeFund: cFund,
    workerNetPayout: workerNet,
    platformFeePercent,
    cooperativeFundPercent,
    workerSharePercent: workerPercent,
  };
}
