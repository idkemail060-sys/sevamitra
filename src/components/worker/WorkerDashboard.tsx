/**
 * SEVAMITRA - Worker Dashboard
 * Section 10 & 14 | SIH26089 | Team Techforge
 */

import React from 'react';
import { store, getStoreState } from '../../services/store';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Star,
  ShieldCheck,
  Power,
  Scale,
  Vote,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileCheck2,
  Camera,
} from 'lucide-react';

interface WorkerDashboardProps {
  onNavigate: (path: string) => void;
  onOpenProfilePictureModal?: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onNavigate, onOpenProfilePictureModal }) => {
  const state = getStoreState();
  const currentWorker = state.workers.find((w) => w.id === state.currentUserId);

  if (!currentWorker) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-slate-600">Please switch to a worker persona to access this portal.</p>
        <button
          onClick={() => store.setCurrentUser('w-arjun-patel')}
          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Switch to Arjun Patel (Worker)
        </button>
      </div>
    );
  }

  // Filter worker's assigned bookings
  const workerBookings = state.bookings.filter((b) => b.workerId === currentWorker.id);

  const pendingRequests = workerBookings.filter((b) => b.status === 'REQUESTED');
  const activeJobs = workerBookings.filter(
    (b) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS'
  );
  const completedJobs = workerBookings.filter((b) => b.status === 'COMPLETED');

  // Calculate earnings
  const completedTransactions = state.transactions.filter(
    (tx) => tx.workerId === currentWorker.id && (tx.paymentStatus === 'CAPTURED' || tx.status === 'CAPTURED')
  );
  const totalNetEarnings = completedTransactions.reduce((sum, tx) => sum + (tx.workerNetPayout || tx.workerEarnings || 0), 0);

  const handleToggleAvailability = () => {
    store.toggleWorkerAvailability(currentWorker.id);
  };

  const handleUpdateStatus = (bookingId: string, status: any) => {
    store.updateBookingStatus(
      bookingId,
      status,
      currentWorker.fullName,
      `Status updated to ${status} by worker`
    );
  };

  return (
    <div className="space-y-6">
      {/* Verification Notice if Pending or Rejected (Section 5) */}
      {currentWorker.verificationStatus === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm">KYC Verification In Progress</span>
            <p className="leading-relaxed">
              Your cooperative membership and documents are under review by the Cooperative Admin Society.
              Once verified, you will appear in customer matching queues.
            </p>
          </div>
        </div>
      )}

      {/* Profile & Availability Hero Banner - Clean Minimalism Style */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md border-2 border-indigo-400/30 overflow-hidden">
                {currentWorker.avatarUrl ? (
                  <img
                    src={currentWorker.avatarUrl}
                    alt={currentWorker.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentWorker.fullName.charAt(0)
                )}
              </div>
              {onOpenProfilePictureModal && (
                <button
                  onClick={onOpenProfilePictureModal}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md border-2 border-slate-900 transition cursor-pointer"
                  title="Update Profile Photo (Camera / Upload)"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-white">{currentWorker.fullName}</h2>
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                    currentWorker.verificationStatus === 'VERIFIED'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  ● {currentWorker.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentWorker.serviceCategory} • {currentWorker.cooperativeBranch}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{currentWorker.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({currentWorker.ratingCount} reviews)</span>
                </span>
                <span>•</span>
                <span>ID: {currentWorker.cooperativeId}</span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div>
              <span className="text-[11px] text-slate-400 block">Dispatch Status</span>
              <span className="text-xs font-bold text-white">
                {currentWorker.isAvailable ? '🟢 Ready for Tasks' : '⚪ Off-Duty'}
              </span>
            </div>
            <button
              onClick={handleToggleAvailability}
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                currentWorker.isAvailable
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title="Toggle Availability"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fair Rotation Meter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="uppercase">Jobs This Week</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{currentWorker.jobsThisWeek}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {currentWorker.jobsThisWeek <= 5 ? 'High Fair Priority' : 'Normal Rotation'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Fair rotation prioritizes workers under weekly threshold to share platform income.
          </p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="uppercase">Job Requests</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">{pendingRequests.length}</span>
            {pendingRequests.length > 0 && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                Action Needed
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">Incoming bookings awaiting your response</p>
        </div>

        {/* Net Earnings */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="uppercase">Net Credited Earnings</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">₹{totalNetEarnings}</span>
            <span className="text-[11px] text-slate-500">93% Payout</span>
          </div>
          <p className="text-[10px] text-slate-400">Zero corporate middleman deductions</p>
        </div>

        {/* Total Lifetime Jobs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {currentWorker.totalCompletedJobs}
            </span>
            <span className="text-[11px] text-blue-700 font-semibold">100% Verified</span>
          </div>
          <p className="text-[10px] text-slate-400">All ratings logged on cooperative ledger</p>
        </div>
      </div>

      {/* Pending Job Requests Action Box (Section 10) */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span>Incoming Service Requests Requiring Action ({pendingRequests.length})</span>
            </h3>
            <button
              onClick={() => onNavigate('/worker/requests')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Open Requests Manager
            </button>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      NEW REQUEST • {b.bookingCode}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{b.serviceName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Customer Quote</span>
                    <span className="text-lg font-black text-slate-900">₹{b.quoteAmount}</span>
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      Your Net (93%): ₹{b.workerNetPayout}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase text-[10px]">Customer & Location</span>
                    <p className="font-bold text-slate-900">{b.householdName}</p>
                    <p className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.householdAddress}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase text-[10px]">Timing & Task</span>
                    <p className="text-slate-700 font-medium">
                      {b.scheduledDate} at {b.scheduledTimeSlot}
                    </p>
                    <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                      "{b.taskDescription}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                    className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    Decline Task
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Accept Job & Confirm Arrival
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Jobs in Progress Section */}
      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Active Jobs Scheduled / In Progress</h3>
          <div className="space-y-3">
            {activeJobs.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      ● {b.status}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{b.serviceName}</h4>
                    <p className="text-xs text-slate-500">
                      Customer: {b.householdName} ({b.householdPhone}) • {b.householdAddress}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">₹{b.workerNetPayout} Net</span>
                    <span className="text-[10px] text-slate-500 block">Gross: ₹{b.quoteAmount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500">
                    Scheduled: {b.scheduledDate} ({b.scheduledTimeSlot})
                  </span>

                  <div className="flex items-center gap-2">
                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition"
                      >
                        Start Service (Mark In Progress)
                      </button>
                    )}
                    {b.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                      >
                        Mark Completed & Request Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cooperative Quick Access Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div
          onClick={() => onNavigate('/worker/governance')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Vote className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition">
            Democratic Cooperative Governance
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Vote on open society policy proposals. 1 Worker = 1 Vote on platform fee splits and mutual aid funds.
          </p>
          <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1 pt-1">
            Cast Ballot →
          </span>
        </div>

        <div
          onClick={() => onNavigate('/worker/earnings')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
            Transparent Earnings Ledger
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect itemized job payouts, 5% operating deductions, 2% welfare allocations, and instant bank transfers.
          </p>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-1">
            View Ledger →
          </span>
        </div>
      </div>
    </div>
  );
};
