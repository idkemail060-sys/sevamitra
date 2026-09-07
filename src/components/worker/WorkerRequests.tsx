/**
 * SEVAMITRA - Worker Job Requests Management
 * Section 10 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  ShieldCheck,
  Star,
  Sparkles,
  Phone,
} from 'lucide-react';

export const WorkerRequests: React.FC = () => {
  const state = getStoreState();
  const currentWorker = state.workers.find((w) => w.id === state.currentUserId);

  if (!currentWorker) return null;

  const workerBookings = state.bookings.filter((b) => b.workerId === currentWorker.id);
  const pendingRequests = workerBookings.filter((b) => b.status === 'REQUESTED');
  const pastRequests = workerBookings.filter((b) => b.status !== 'REQUESTED');

  const handleAction = (bookingId: string, status: 'ACCEPTED' | 'CANCELLED') => {
    store.updateBookingStatus(
      bookingId,
      status,
      status === 'ACCEPTED' ? 'Worker accepted task' : 'Worker declined due to schedule conflict'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Job Requests & Task Dispatch</h2>
        <p className="text-xs text-slate-500">
          Review incoming household tasks matched to you via our Fair Rotation Smart Engine
        </p>
      </div>

      {/* Pending Requests Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Pending Requests Awaiting Decision ({pendingRequests.length})</span>
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No pending task requests right now. Ensure your availability is turned ON.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      REQUEST CODE: {b.bookingCode}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">{b.serviceName}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Gross Quote</span>
                    <span className="text-xl font-black text-slate-900">₹{b.quoteAmount}</span>
                    <span className="text-xs font-bold text-emerald-700 block">
                      Your 93% Net Payout: ₹{b.workerNetPayout}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">
                      Household & Location
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{b.householdName}</p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{b.householdAddress}</span>
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.householdPhone}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">
                      Scheduled Window & Scope
                    </span>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{b.scheduledDate} ({b.scheduledTimeSlot})</span>
                    </div>
                    <p className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200">
                      "{b.taskDescription}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleAction(b.id, 'CANCELLED')}
                    className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    Decline Task
                  </button>
                  <button
                    onClick={() => handleAction(b.id, 'ACCEPTED')}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Job Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted & Historical Requests */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-slate-900">Task Activity History</h3>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {pastRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No past requests recorded.</div>
          ) : (
            pastRequests.map((b) => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{b.serviceName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'ACCEPTED'
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
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Customer: {b.householdName} • Date: {b.scheduledDate}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm">₹{b.workerNetPayout} Net</span>
                    <span className="text-[10px] text-slate-400 block">Gross ₹{b.quoteAmount}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
