/**
 * SEVAMITRA - Worker Grievance Redressal & Support
 * Section 13 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  HelpCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const WorkerGrievances: React.FC = () => {
  const state = getStoreState();
  const currentWorker = state.workers.find((w) => w.id === state.currentUserId);

  const [isFiling, setIsFiling] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'PAYMENT_ISSUE' | 'CUSTOMER_BEHAVIOR' | 'UNFAIR_RATING' | 'TECHNICAL_ISSUE' | 'OTHER'>('PAYMENT_ISSUE');
  const [description, setDescription] = useState('');
  const [bookingId, setBookingId] = useState('');

  if (!currentWorker) return null;

  const workerGrievances = state.grievances.filter((g) => g.workerId === currentWorker.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    store.createGrievance({
      workerId: currentWorker.id,
      workerName: currentWorker.fullName,
      subject,
      category,
      description,
      bookingId: bookingId || undefined,
    });

    setSubject('');
    setDescription('');
    setBookingId('');
    setIsFiling(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Grievance Redressal Cell</h2>
          <p className="text-xs text-slate-500">
            Cooperative dispute resolution, unfair rating appeals, and payment inquiries
          </p>
        </div>

        <button
          onClick={() => setIsFiling(!isFiling)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isFiling ? 'Close Form' : 'File New Grievance'}</span>
        </button>
      </div>

      {/* Grievance Filing Form */}
      {isFiling && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-200"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Submit Grievance to Cooperative Society Admin</h3>
            <p className="text-xs text-slate-500">All submissions are reviewed by an independent committee</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Unfair 1-star rating appeal / Customer refused entry"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="PAYMENT_ISSUE">Payment / Fee Issue</option>
                <option value="CUSTOMER_BEHAVIOR">Customer Behavior</option>
                <option value="UNFAIR_RATING">Unfair Rating / Review Appeal</option>
                <option value="TECHNICAL_ISSUE">Technical App Glitch</option>
                <option value="OTHER">Other Dispute</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Related Booking Code / ID (Optional)
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="e.g. BK-26089-101"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details, timelines, customer remarks, and any supporting facts..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFiling(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Committee</span>
            </button>
          </div>
        </form>
      )}

      {/* Grievances List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Your Filed Grievances & Status</h3>

        {workerGrievances.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No grievances filed. Our cooperative mediator is available whenever you encounter an issue.
          </div>
        ) : (
          <div className="space-y-4">
            {workerGrievances.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{g.ticketCode}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.status === 'SUBMITTED'
                            ? 'bg-amber-100 text-amber-800'
                            : g.status === 'IN_REVIEW'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        ● {g.status}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {g.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{g.subject}</h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  "{g.description}"
                </p>

                {g.resolutionNotes && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Cooperative Resolution:</span>
                    </span>
                    <p className="text-emerald-900">{g.resolutionNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
