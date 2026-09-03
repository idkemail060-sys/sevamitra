/**
 * SEVAMITRA - Service Booking Flow & Smart Matching Engine
 * Sections 7, 8, 9 | SIH26089 | Team Techforge
 *
 * Implements:
 * 1. Choose service
 * 2. Enter Locality / Pincode
 * 3. Describe task + preferred date/time
 * 4. Run Smart Matching Engine with Fair Rotation
 * 5. Show ranked workers with transparent explanations
 * 6. Book chosen worker with transparent fee preview
 */

import React, { useState, useMemo } from 'react';
import { INITIAL_SERVICES, store, getStoreState } from '../../services/store';
import { runSmartMatchingEngine, calculateTransparentFeeSplit } from '../../services/matchingEngine';
import { RankedWorkerCandidate } from '../../types';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Scale,
  Star,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Info,
  Sliders,
  Check,
} from 'lucide-react';

interface ServiceBookingFlowProps {
  initialServiceCategory?: string;
  onBookingCreated: (bookingId: string) => void;
  onCancel: () => void;
}

export const ServiceBookingFlow: React.FC<ServiceBookingFlowProps> = ({
  initialServiceCategory = 'Plumbing',
  onBookingCreated,
  onCancel,
}) => {
  const state = getStoreState();
  const currentUser = store.getCurrentUser();

  const [step, setStep] = useState<'DETAILS' | 'MATCHES' | 'CONFIRM'>('DETAILS');

  // Booking Form State
  const [selectedCategory, setSelectedCategory] = useState(initialServiceCategory);
  const [locality, setLocality] = useState(currentUser?.locality || 'Indiranagar');
  const [pincode, setPincode] = useState(currentUser?.pincode || '560038');
  const [taskDescription, setTaskDescription] = useState('Kitchen sink pipe leakage repair & tap washer check');
  const [address, setAddress] = useState('Flat 402, Green Glen Palms, 12th Main, Indiranagar');
  const [scheduledDate, setScheduledDate] = useState('2026-03-05');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('10:00 AM - 12:00 PM');

  // Sorting mode for match results
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'RATING' | 'FAIRNESS' | 'DISTANCE'>('RECOMMENDED');

  // Selected Worker for Confirmation
  const [selectedCandidate, setSelectedCandidate] = useState<RankedWorkerCandidate | null>(null);

  // Active Job Counts per worker
  const activeJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    state.bookings.forEach((b) => {
      if (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS') {
        counts[b.workerId] = (counts[b.workerId] || 0) + 1;
      }
    });
    return counts;
  }, [state.bookings]);

  // Compute Ranked Candidates using Smart Matching Engine
  const rankedCandidates = useMemo(() => {
    const results = runSmartMatchingEngine(
      state.workers,
      selectedCategory,
      locality,
      pincode,
      state.config,
      activeJobCounts
    );

    if (sortBy === 'RATING') {
      return [...results].sort((a, b) => b.worker.rating - a.worker.rating);
    } else if (sortBy === 'FAIRNESS') {
      return [...results].sort((a, b) => b.fairnessScore - a.fairnessScore);
    } else if (sortBy === 'DISTANCE') {
      return [...results].sort((a, b) => (b.localityMatch ? 1 : 0) - (a.localityMatch ? 1 : 0));
    }
    return results; // Default: RECOMMENDED (Combined finalRankScore)
  }, [state.workers, selectedCategory, locality, pincode, state.config, activeJobCounts, sortBy]);

  const activeService = INITIAL_SERVICES.find((s) => s.code === selectedCategory) || INITIAL_SERVICES[0];

  const feeSplit = useMemo(() => {
    return calculateTransparentFeeSplit(
      activeService.baseRate,
      state.config.platformFeePercent,
      state.config.cooperativeFundPercent
    );
  }, [activeService, state.config]);

  const handleProceedToMatches = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;
    setStep('MATCHES');
  };

  const handleSelectCandidate = (candidate: RankedWorkerCandidate) => {
    setSelectedCandidate(candidate);
    setStep('CONFIRM');
  };

  const handleCreateBooking = () => {
    if (!selectedCandidate) return;

    const newBooking = store.createBooking({
      householdId: currentUser?.id || 'u-ananya-sen',
      householdName: currentUser?.fullName || 'Ananya Sen',
      householdPhone: currentUser?.phone || '+91 99450 77112',
      householdAddress: address,
      worker: selectedCandidate.worker,
      serviceCategory: selectedCategory,
      serviceName: activeService.name,
      taskDescription,
      locality,
      pincode,
      scheduledDate,
      scheduledTimeSlot,
      quoteAmount: feeSplit.grossAmount,
      matchScore: selectedCandidate.matchScore,
      fairnessBonus: selectedCandidate.fairnessScore,
    });

    onBookingCreated(newBooking.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 'DETAILS' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 'DETAILS' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              1
            </span>
            <span>Task & Locality</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 'MATCHES' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 'MATCHES' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              2
            </span>
            <span>Smart Match Workers</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 'CONFIRM' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 'CONFIRM' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              3
            </span>
            <span>Fee Split & Confirm</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Task & Locality Details */}
      {step === 'DETAILS' && (
        <form onSubmit={handleProceedToMatches} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Configure Service Request</h3>
              <p className="text-xs text-slate-500">Provide location and timing to trigger the Smart Matching Engine</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          {/* Service Category Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">Service Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {INITIAL_SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedCategory(s.code)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition flex items-center gap-2 ${
                    selectedCategory === s.code
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Locality & Pincode (MVP Locality Model) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Locality / Neighborhood</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Indiranagar, Koramangala, Domlur..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none pl-8"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Pincode</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560038"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Specific Address Line */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Service Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment/House No, Building, Street, Landmark"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Describe the Task / Problem
            </label>
            <textarea
              required
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={3}
              placeholder="e.g., Kitchen pipe leakage under sink, water tripping MCB switch, balcony cleaning..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Preferred Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none pl-8"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
              <div className="relative">
                <select
                  value={scheduledTimeSlot}
                  onChange={(e) => setScheduledTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-white pl-8"
                >
                  <option>08:00 AM - 10:00 AM</option>
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 02:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 08:00 PM</option>
                </select>
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2"
          >
            <span>Run Smart Matching Engine</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* STEP 2: Smart Matching Results & Ranking (Clean Minimalism Layout) */}
      {step === 'MATCHES' && (
        <div className="space-y-4">
          {/* Header with Title and Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Smart Worker Matching</h1>
              <p className="text-sm text-slate-500">
                Showing ranked professionals for{' '}
                <span className="font-semibold text-indigo-600 underline">
                  {selectedCategory} in {locality}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-2xs">
                Fairness Score Enabled
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-medium">
                Nearby Workers Only
              </span>
            </div>
          </div>

          {/* Sort & Filter Tabs Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Ranked <strong className="text-slate-800 font-bold">{rankedCandidates.length} cooperative candidates</strong> by algorithmic fairness & proximity
            </div>

            {/* Sorting Tabs */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Sort:</span>
              <button
                type="button"
                onClick={() => setSortBy('RECOMMENDED')}
                className={`px-3 py-1 rounded-lg transition ${
                  sortBy === 'RECOMMENDED'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Recommended
              </button>
              <button
                type="button"
                onClick={() => setSortBy('RATING')}
                className={`px-3 py-1 rounded-lg transition ${
                  sortBy === 'RATING'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Rating
              </button>
              <button
                type="button"
                onClick={() => setSortBy('FAIRNESS')}
                className={`px-3 py-1 rounded-lg transition ${
                  sortBy === 'FAIRNESS'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Fairness Priority
              </button>
            </div>
          </div>

          {/* Informational Banner on Fair Rotation */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-950 flex items-start gap-3">
            <Scale className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-900">SevaMitra Fair Rotation Algorithm Active:</span>
              <p className="text-[11px] text-indigo-800/90 leading-relaxed">
                Rankings balance skill and proximity with workload fairness. Workers with fewer recent assignments receive priority rotation to distribute livelihood equitably.
              </p>
            </div>
          </div>

          {/* Worker Candidates List */}
          {rankedCandidates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-700">No verified workers found matching your exact filter.</p>
              <p className="text-xs text-slate-500">
                Only verified cooperative workers appear in matching results. Try widening your locality.
              </p>
              <button
                onClick={() => setStep('DETAILS')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Change Locality or Category
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rankedCandidates.map((candidate, idx) => {
                const w = candidate.worker;
                const isTop = idx === 0;

                return (
                  <div
                    key={w.id}
                    className={`bg-white p-5 rounded-2xl shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 relative ${
                      isTop
                        ? 'border-2 border-indigo-100 shadow-sm'
                        : 'border border-slate-200'
                    }`}
                  >
                    {isTop && (
                      <div className="hidden md:block absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-indigo-500 rounded-full" />
                    )}

                    {/* Left: Worker Profile Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-200 shrink-0">
                        {w.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-base">{w.fullName}</h3>
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {w.category} • {w.experienceYears} yrs exp • {candidate.distanceDescription}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="text-amber-500">★</span> {w.rating.toFixed(1)} Rating
                          </span>
                          <span className={`flex items-center gap-1 ${isTop ? 'text-indigo-600' : 'text-slate-500'}`}>
                            <span className={isTop ? 'text-indigo-500' : 'text-slate-400'}>●</span> {candidate.matchScore}% Match Score
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Fairness Index Pill & Select CTA */}
                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                      <div className={`text-right px-3 py-1.5 rounded-lg ${isTop ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isTop ? 'text-indigo-400' : 'text-slate-400'}`}>
                          Fairness Index
                        </p>
                        <p className={`text-sm font-bold ${isTop ? 'text-indigo-700' : 'text-slate-600'}`}>
                          {candidate.fairnessScore >= 80 ? 'HIGH PRIORITY' : candidate.fairnessScore >= 50 ? 'STANDARD' : 'ON ROTATION'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCandidate(candidate)}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                          isTop
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setStep('DETAILS')}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Task Details</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Transparent Fee Split & Final Confirmation */}
      {step === 'CONFIRM' && selectedCandidate && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 3 of 3</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Confirm Service Booking & Fee Breakdown</h3>
            <p className="text-xs text-slate-500">Review transparent pricing and schedule details before dispatch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Service Particulars</h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-900">{selectedCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Worker:</span>
                  <span className="font-semibold text-slate-900">{selectedCandidate.worker.fullName} ({selectedCandidate.worker.rating}★)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cooperative Society:</span>
                  <span className="font-semibold text-indigo-700">{selectedCandidate.worker.cooperativeBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-900">{scheduledDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Window:</span>
                  <span className="font-semibold text-slate-900">{scheduledTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">{address}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider block mb-1">Task Scope</span>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {taskDescription}
                </p>
              </div>
            </div>

            {/* Transparent Profit-Sharing Breakdown (Section 11) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900">
                  Transparent Fee Engine
                </h4>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">
                  Zero Hidden Margins
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-800 font-semibold text-sm">
                  <span>Customer Total Gross:</span>
                  <span className="font-mono">₹{feeSplit.grossAmount}.00</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Platform Operations Fee (5%):</span>
                  <span className="text-rose-600 font-mono">-₹{feeSplit.platformFee}.00</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Cooperative Worker Welfare Fund (2%):</span>
                  <span className="text-amber-600 font-mono">-₹{feeSplit.cooperativeFund}.00</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-indigo-900 text-base">
                  <span>Net Credited to Worker (93%):</span>
                  <span className="text-emerald-700 font-mono">₹{feeSplit.workerNetPayout}.00</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                Payment is only captured after service verification. Razorpay Test Mode available with simulated webhook triggers.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep('MATCHES')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Back to Matches
            </button>

            <button
              type="button"
              onClick={handleCreateBooking}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Confirm & Dispatch Request</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
