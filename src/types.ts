/**
 * SEVAMITRA - TypeScript Domain Models & Types
 * Problem Statement ID: SIH26089 | Team Techforge
 */

export type UserRole = 'HOUSEHOLD' | 'WORKER' | 'ADMIN';

export type WorkerVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentStatus = 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export type GrievanceStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

export type GrievancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ProposalStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'IMPLEMENTED' | 'PASSED' | 'REJECTED';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  locality: string;
  pincode: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  baseRate: number; // in INR
  rateUnit: string;
  icon: string;
  popular?: boolean;
}

export interface WorkerProfile extends UserProfile {
  serviceCategory: string; // matches ServiceCategory.code
  skills: string[];
  experienceYears: number;
  serviceAreas: string[];
  primaryPincode: string;
  verificationStatus: WorkerVerificationStatus;
  verificationNotes?: string;
  rating: number;
  ratingCount: number;
  totalCompletedJobs: number;
  jobsThisWeek: number;
  isAvailable: boolean;
  isCooperativeMember: boolean;
  cooperativeId: string;
  cooperativeBranch: string;
  kycDocumentUrl?: string;
  kycDocumentType?: string;
  bio?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  householdId: string;
  householdName: string;
  householdPhone: string;
  householdAddress: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerAvatar?: string;
  serviceCategory: string;
  serviceName: string;
  taskDescription: string;
  locality: string;
  pincode: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  status: BookingStatus;
  matchScore: number;
  fairnessBonus: number;
  quoteAmount: number; // Gross payment (e.g. 500)
  platformFee: number; // e.g. 25
  cooperativeFund: number; // e.g. 10
  workerNetPayout: number; // e.g. 465
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  ratingScore?: number;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
  history: BookingStatusTransition[];
}

export interface BookingStatusTransition {
  fromStatus?: BookingStatus;
  toStatus: BookingStatus;
  timestamp: string;
  changedBy: string;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionCode?: string;
  bookingId: string;
  bookingCode: string;
  householdName: string;
  workerId?: string;
  workerName: string;
  serviceName: string;
  grossAmount: number;
  platformFee: number;
  cooperativeFund: number;
  workerEarnings: number;
  workerNetPayout?: number;
  paymentMethod: string;
  razorpayPaymentId: string;
  status: PaymentStatus;
  paymentStatus?: PaymentStatus;
  timestamp: string;
  createdAt?: string;
}

export interface WorkerEarningsSummary {
  todayJobs: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  lifetimeEarnings: number;
  totalCooperativeContributed: number;
  pendingPayout: number;
}

export type GovernanceVoteChoice = 'FOR' | 'AGAINST' | 'ABSTAIN' | 'YES' | 'NO';
export type GovernanceCategory =
  | 'PLATFORM_FEE'
  | 'EMERGENCY_FUND'
  | 'MINIMUM_RATES'
  | 'HEALTH_BENEFITS'
  | 'COOPERATIVE_POLICY'
  | 'PLATFORM_FEES'
  | 'WORKER_WELFARE'
  | 'COOP_POLICY'
  | 'EXPANSION';

export interface GovernanceProposal {
  id: string;
  proposalCode?: string;
  title: string;
  description: string;
  category: GovernanceCategory | string;
  proposedBy: string;
  startDate: string;
  endDate: string;
  votingDeadline?: string;
  status: ProposalStatus;
  yesVotes: number;
  noVotes: number;
  votesFor?: number;
  votesAgainst?: number;
  votesAbstain?: number;
  totalEligibleVoters: number;
  votedUserIds?: string[];
  hasVotedUserIds?: string[];
}

export interface GrievanceTicket {
  id: string;
  ticketId: string;
  ticketCode?: string;
  bookingId?: string;
  workerId: string;
  workerName: string;
  subject: string;
  category: any;
  description: string;
  priority?: GrievancePriority;
  status: GrievanceStatus | string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  adminResponse?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface MatchingWeightsConfig {
  categoryWeight: number;
  localityWeight: number;
  ratingWeight: number;
  availabilityWeight: number;
  fairnessWeight: number;
  weeklyJobThreshold: number;
  platformFeePercent: number;
  cooperativeFundPercent: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'GOVERNANCE' | 'GRIEVANCE' | 'SYSTEM';
  linkTarget?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PlatformConfig {
  platformFeePercent: number; // e.g. 5.0 (%)
  cooperativeFundPercent: number; // e.g. 2.0 (%)
  // Smart matching weights:
  weightCategoryMatch: number; // 0.40
  weightLocalityMatch: number; // 0.30
  weightRating: number; // 0.15
  weightAvailability: number; // 0.15
  // Fair rotation algorithm factors:
  fairnessBonusMultiplier: number; // 0.25
  maxJobsPerWeekThreshold: number; // 15
}

export interface RankedWorkerCandidate {
  worker: WorkerProfile;
  matchScore: number; // 0 - 100
  fairnessScore: number; // 0 - 100
  finalRankScore: number; // 0 - 100
  explanations: string[];
  distanceDescription: string;
  categoryMatch: boolean;
  localityMatch: boolean;
  ratingScore: number;
  fairnessBonusApplied: boolean;
}
