/**
 * SEVAMITRA - Household Dashboard
 * Section 6 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState, INITIAL_SERVICES } from '../../services/store';
import { Booking } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Star,
  ShieldCheck,
  ArrowRight,
  Plus,
  Receipt,
  Heart,
  HelpCircle,
  Camera,
} from 'lucide-react';

interface HouseholdDashboardProps {
  onNavigate: (path: string) => void;
  onInitiateBooking: (serviceCategory?: string) => void;
  onOpenPaymentModal: (booking: Booking) => void;
  onOpenRatingModal: (booking: Booking) => void;
  onOpenProfilePictureModal?: () => void;
}

export const HouseholdDashboard: React.FC<HouseholdDashboardProps> = ({
  onNavigate,
  onInitiateBooking,
  onOpenPaymentModal,
  onOpenRatingModal,
  onOpenProfilePictureModal,
}) => {
  const state = getStoreState();
  const currentUser = store.getCurrentUser();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter household's bookings
  const householdBookings = state.bookings.filter(
    (b) => b.householdId === state.currentUserId
  );

  const activeBookings = householdBookings.filter(
    (b) => b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS'
  );

  const completedBookings = householdBookings.filter(
    (b) => b.status === 'COMPLETED'
  );

  // Total spent
  const totalSpent = householdBookings
    .filter((b) => b.paymentStatus === 'CAPTURED')
    .reduce((sum, b) => sum + b.quoteAmount, 0);

  // Filter services by search
  const filteredServices = INITIAL_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Clean Minimalism Dark Indigo Style */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-indigo-300 text-xs font-semibold border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Serving {currentUser?.locality || 'Indiranagar'}, Bangalore ({currentUser?.pincode || '560038'})</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Namaste, {currentUser?.fullName || 'Ananya Sen'}!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome to your cooperative gig platform. When you book on SevaMitra, 93% of your payment directly supports
              verified neighborhood artisans with fair wages and mutual aid security.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onInitiateBooking('Plumbing')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book New Service</span>
              </button>
              <button
                onClick={() => onNavigate('/household/bookings')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                Track Active Bookings ({activeBookings.length})
              </button>
            </div>
          </div>

          {/* Profile Avatar Card with Camera upload trigger */}
          <div className="shrink-0 flex items-center md:flex-col justify-between md:justify-center p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 gap-3">
            <div className="relative group">
              <Avatar className="w-16 h-16 border-2 border-emerald-400 shadow-lg">
                {currentUser?.avatarUrl ? (
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser?.fullName} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-emerald-700 text-white font-black text-xl">
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {onOpenProfilePictureModal && (
                <button
                  onClick={onOpenProfilePictureModal}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md border-2 border-slate-900 transition cursor-pointer"
                  title="Update Profile Picture (Camera / Upload)"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {onOpenProfilePictureModal && (
              <button
                onClick={onOpenProfilePictureModal}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Update Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle decorative background mark */}
        <div className="absolute right-4 -bottom-6 text-white/5 font-black text-9xl select-none pointer-events-none hidden md:block">
          SM
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Requests
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{activeBookings.length}</span>
            <span className="text-xs font-semibold text-indigo-600">In Motion</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Completed Services
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{completedBookings.length}</span>
            <span className="text-xs font-semibold text-slate-500">Verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Digital Spend
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{totalSpent}</span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">Captured</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Cooperative Impact
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600">₹{Math.round(totalSpent * 0.02)}</span>
            <span className="text-[11px] text-slate-400">Welfare Fund</span>
          </div>
        </div>
      </div>

      {/* Active Live Booking Tracker (Section 17 Realtime Updates) */}
      {activeBookings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Active Service Requests ({activeBookings.length})</span>
            </h3>
            <span className="text-xs text-emerald-700 font-medium">Auto-updating live</span>
          </div>

          <div className="space-y-3">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-emerald-500/60 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{b.bookingCode}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'REQUESTED'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'ACCEPTED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        ● {b.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{b.serviceName}</h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {b.scheduledDate}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {b.scheduledTimeSlot}
                    </span>
                  </div>
                </div>

                {/* Worker Details & Match explanation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                      {b.workerName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{b.workerName}</span>
                      <span className="text-slate-500 text-[11px]">Assigned Cooperative Professional • {b.workerPhone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 text-[11px] block">Agreed Quote</span>
                    <span className="text-base font-black text-slate-900">₹{b.quoteAmount}</span>
                  </div>
                </div>

                {/* Live Status Stepper */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                    <div className={`p-1.5 rounded-lg ${b.status ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                      1. REQUESTED
                    </div>
                    <div
                      className={`p-1.5 rounded-lg ${
                        b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      2. ACCEPTED
                    </div>
                    <div
                      className={`p-1.5 rounded-lg ${
                        b.status === 'IN_PROGRESS' || b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      3. IN PROGRESS
                    </div>
                    <div
                      className={`p-1.5 rounded-lg ${
                        b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      4. COMPLETED
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid with Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Book Household Services</h3>
            <p className="text-xs text-slate-500">Select any service to trigger our Smart Matching Engine</p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search electrician, plumbing, cleaning..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none pl-8"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onInitiateBooking(service.code)}
              className="bg-white border border-slate-200 rounded-2xl p-4.5 hover:border-indigo-300 hover:shadow-sm transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition">
                  {service.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                    {service.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">From ₹{service.baseRate}</span>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition">
                  Match →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Bookings & Feedback Section */}
      {completedBookings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Completed Services & Receipts</h3>
            <button
              onClick={() => onNavigate('/household/payments')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View Payment Ledger
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {completedBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{b.serviceName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Worker: <span className="font-medium text-slate-700">{b.workerName}</span> • Date: {b.scheduledDate}
                  </p>
                  <p className="text-xs text-slate-600 italic">"{b.taskDescription}"</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">₹{b.quoteAmount}</span>
                    <span className="block text-[10px] text-emerald-700 font-medium">
                      {b.paymentStatus === 'CAPTURED' ? 'Paid via Test Razorpay' : 'Payment Pending'}
                    </span>
                  </div>

                  {b.paymentStatus !== 'CAPTURED' ? (
                    <button
                      onClick={() => onOpenPaymentModal(b)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      Pay via Razorpay Test
                    </button>
                  ) : !b.ratingScore ? (
                    <button
                      onClick={() => onOpenRatingModal(b)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Rate Worker</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-amber-500 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{b.ratingScore}/5 Rated</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
