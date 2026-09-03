/**
 * SEVAMITRA - Admin Grievance Redressal & Resolution
 * Section 13 & 14 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { AlertCircle, CheckCircle2, Clock, ShieldCheck, FileText } from 'lucide-react';

export const AdminGrievances: React.FC = () => {
  const state = getStoreState();
  const [resolutionText, setResolutionText] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const handleResolve = (ticketId: string) => {
    if (!resolutionText.trim()) return;
    store.resolveGrievance(ticketId, resolutionText);
    setActiveTicketId(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Grievance Redressal Oversight</h2>
        <p className="text-xs text-slate-500">
          Independent society committee review for worker rights, disputes, and rating appeals
        </p>
      </div>

      <div className="space-y-4">
        {state.grievances.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600">{g.ticketCode}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    ● {g.status}
                  </span>
                  <span className="text-xs text-slate-400">Worker: {g.workerName}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">{g.subject}</h4>
              </div>

              <span className="text-xs text-slate-400">
                Filed on {new Date(g.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">Grievance Statement</span>
              <p className="leading-relaxed">"{g.description}"</p>
              {g.bookingId && (
                <span className="text-[11px] text-slate-500 block mt-1">Related Booking: {g.bookingId}</span>
              )}
            </div>

            {g.resolutionNotes ? (
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Committee Resolution Decision:</span>
                </span>
                <p className="text-emerald-900">{g.resolutionNotes}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Resolved on {new Date(g.updatedAt).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="pt-2">
                {activeTicketId === g.id ? (
                  <div className="space-y-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Committee Resolution & Action Taken
                    </label>
                    <textarea
                      rows={3}
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="e.g. Unfair 1-star rating scrubbed; customer cautioned regarding cooperative decorum..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveTicketId(null)}
                        className="px-3 py-1.5 rounded-lg border text-xs text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleResolve(g.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                      >
                        Submit Official Resolution
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveTicketId(g.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    Resolve Ticket
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
