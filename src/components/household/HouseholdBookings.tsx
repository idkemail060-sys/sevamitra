/**
 * SEVAMITRA - Household Bookings Management & Live Tracker
 * SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { Booking } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Star,
  ShieldCheck,
  Search,
  Sliders,
  Receipt,
} from 'lucide-react';

interface HouseholdBookingsProps {
  onOpenPaymentModal: (booking: Booking) => void;
  onOpenRatingModal: (booking: Booking) => void;
  onInitiateNewBooking: () => void;
}

export const HouseholdBookings: React.FC<HouseholdBookingsProps> = ({
  onOpenPaymentModal,
  onOpenRatingModal,
  onInitiateNewBooking,
}) => {
  const state = getStoreState();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const householdBookings = state.bookings.filter(
    (b) => b.householdId === state.currentUserId
  );

  const filteredBookings = householdBookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') {
      return b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS';
    }
    return b.status === filterStatus;
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this service request?')) {
      store.updateBookingStatus(bookingId, 'CANCELLED', 'Cancelled by household');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Service Bookings</h2>
          <p className="text-xs text-slate-500">
            Real-time status tracking, digital receipts, and cooperative feedback
          </p>
        </div>

        <button
          onClick={onInitiateNewBooking}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition self-start sm:self-auto"
        >
          + Request New Service
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterStatus === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Bookings' : tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No bookings found in this view</h3>
          <p className="text-xs text-slate-500">
            Select a service from our catalog to book a verified cooperative worker.
          </p>
          <button
            onClick={onInitiateNewBooking}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-500">{b.bookingCode}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'REQUESTED'
                        ? 'bg-amber-100 text-amber-800'
                        : b.status === 'ACCEPTED'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'IN_PROGRESS'
                        ? 'bg-purple-100 text-purple-800'
                        : b.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    ● {b.status}
                  </span>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs font-bold text-slate-900">{b.serviceName}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{b.scheduledDate} ({b.scheduledTimeSlot})</span>
                </div>
              </div>

              {/* Body Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Task Details */}
                <div className="md:col-span-2 space-y-1.5">
                  <span className="text-slate-400 text-[11px] font-semibold uppercase">Task Scope & Location</span>
                  <p className="text-slate-800 font-medium leading-relaxed">{b.taskDescription}</p>
                  <p className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.householdAddress}</span>
                  </p>
                </div>

                {/* Worker Particulars */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Assigned Worker</span>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{b.workerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-slate-500 text-[11px]">Phone: {b.workerPhone}</p>
                  <div className="pt-1 flex items-baseline justify-between">
                    <span className="text-slate-500 text-[11px]">Total Fee:</span>
                    <span className="text-sm font-black text-slate-900">₹{b.quoteAmount}</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  {b.status === 'REQUESTED' && 'Waiting for worker to accept the job request.'}
                  {b.status === 'ACCEPTED' && 'Worker has accepted and confirmed arrival time.'}
                  {b.status === 'IN_PROGRESS' && 'Worker is on site performing the service.'}
                  {b.status === 'COMPLETED' && 'Service completed. Thank you for supporting the cooperative!'}
                  {b.status === 'CANCELLED' && 'This request has been cancelled.'}
                </div>

                <div className="flex items-center gap-2">
                  {b.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                    >
                      Cancel Request
                    </button>
                  )}

                  {b.status === 'COMPLETED' && b.paymentStatus !== 'CAPTURED' && (
                    <button
                      onClick={() => onOpenPaymentModal(b)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay ₹{b.quoteAmount} via Razorpay Test</span>
                    </button>
                  )}

                  {b.status === 'COMPLETED' && b.paymentStatus === 'CAPTURED' && !b.ratingScore && (
                    <button
                      onClick={() => onOpenRatingModal(b)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Leave Review</span>
                    </button>
                  )}

                  {b.ratingScore && (
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>Rated {b.ratingScore}/5</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
