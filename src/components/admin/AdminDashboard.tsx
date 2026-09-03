/**
 * SEVAMITRA - Cooperative Admin Dashboard & Analytics
 * Section 14 | SIH26089 | Team Techforge
 */

import React from 'react';
import { store, getStoreState } from '../../services/store';
import {
  Users,
  FileCheck2,
  Calendar,
  CreditCard,
  Scale,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Vote,
  Settings,
  ArrowRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const state = getStoreState();

  // Metrics computation
  const totalWorkers = state.workers.length;
  const verifiedWorkers = state.workers.filter((w) => w.verificationStatus === 'VERIFIED').length;
  const pendingWorkers = state.workers.filter((w) => w.verificationStatus === 'PENDING').length;

  const totalBookings = state.bookings.length;
  const completedBookings = state.bookings.filter((b) => b.status === 'COMPLETED').length;
  const activeBookings = state.bookings.filter(
    (b) => b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS'
  ).length;

  // Financial calculations
  const capturedTransactions = state.transactions.filter((tx) => tx.paymentStatus === 'CAPTURED');
  const gmv = capturedTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const platformRevenue = capturedTransactions.reduce((sum, tx) => sum + tx.platformFee, 0);
  const cooperativeFund = capturedTransactions.reduce((sum, tx) => sum + tx.cooperativeFund, 0);
  const workerDisbursements = capturedTransactions.reduce((sum, tx) => sum + tx.workerNetPayout, 0);

  const pendingGrievances = state.grievances.filter((g) => g.status !== 'RESOLVED').length;

  return (
    <div className="space-y-8">
      {/* Header Banner - Clean Minimalism Style */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-semibold border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cooperative Society Executive Portal • SIH 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Karnataka Urban Gig Cooperative Society
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Democratic oversight of verified artisans, transparent treasury audit, and dynamic algorithmic fairness configuration.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('/admin/verification')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Verify Workers ({pendingWorkers})</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/settings')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Tune Fair Engine</span>
          </button>
        </div>
      </div>

      {/* Primary Key Performance Indicators (Section 14 & 18) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Gross Marketplace GMV
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{gmv}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              100%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Total consumer service volume</p>
        </div>

        {/* Worker Payouts (93%) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Worker Disbursements
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">₹{workerDisbursements}</span>
            <span className="text-[11px] font-bold text-emerald-800">93.0%</span>
          </div>
          <p className="text-[10px] text-slate-400">Directly credited to worker accounts</p>
        </div>

        {/* Cooperative Fund (2%) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Welfare Reserve Fund
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">₹{cooperativeFund}</span>
            <span className="text-[11px] font-bold text-amber-800">2.0%</span>
          </div>
          <p className="text-[10px] text-slate-400">Worker health insurance & tool grants</p>
        </div>

        {/* Platform Operations (5%) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Operations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{platformRevenue}</span>
            <span className="text-[11px] font-bold text-slate-600">5.0%</span>
          </div>
          <p className="text-[10px] text-slate-400">Zero corporate middleman profit</p>
        </div>
      </div>

      {/* Secondary Operational Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Verified Workers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-slate-900">{verifiedWorkers}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">of {totalWorkers} registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Pending KYC</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-bold text-amber-600">{pendingWorkers}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Awaiting society review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Bookings</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-slate-900">{activeBookings}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{completedBookings} completed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Grievances Open</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-xl font-bold text-rose-600">{pendingGrievances}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">In dispute resolution</span>
        </div>
      </div>

      {/* Urgent Action Needed: Pending Worker Verifications (Section 15) */}
      {pendingWorkers > 0 && (
        <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {pendingWorkers} Worker Applicants Pending Verification
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                As per SIH Section 5, only VERIFIED workers appear in customer matching results. Review KYC documents,
                verify cooperative society membership, and activate profiles.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/verification')}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition shrink-0"
          >
            Review Applications →
          </button>
        </div>
      )}

      {/* Quick Navigation Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('/admin/workers')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
            Worker Directory & Ratings
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect all {totalWorkers} platform artisans, ratings, weekly workload distribution, and active status.
          </p>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-1">
            Manage Directory →
          </span>
        </div>

        <div
          onClick={() => onNavigate('/admin/governance')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Vote className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition">
            Governance & Ballots
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Draft new proposals, monitor turnout, and certify transparent voting results across unions.
          </p>
          <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1 pt-1">
            Open Ballots →
          </span>
        </div>

        <div
          onClick={() => onNavigate('/admin/settings')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition">
            Matching Weights Engine
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fine-tune the weights for Category, Locality, Rating, Availability, and the Fair Rotation bonus.
          </p>
          <span className="text-xs font-semibold text-purple-700 flex items-center gap-1 pt-1">
            Configure Weights →
          </span>
        </div>
      </div>
    </div>
  );
};
