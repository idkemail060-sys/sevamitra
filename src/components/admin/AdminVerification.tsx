/**
 * SEVAMITRA - Admin Worker KYC Verification & Society Onboarding
 * Section 15 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { WorkerProfile } from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  X,
} from 'lucide-react';

export const AdminVerification: React.FC = () => {
  const state = getStoreState();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<WorkerProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

  const workers = state.workers.filter((w) => {
    if (filter === 'ALL') return true;
    return w.verificationStatus === filter;
  });

  const handleApprove = (workerId: string) => {
    store.verifyWorker(workerId, 'VERIFIED', 'Verified by Cooperative Admin after document review');
  };

  const handleReject = (workerId: string) => {
    if (!rejectReason.trim()) return;
    store.verifyWorker(workerId, 'REJECTED', rejectReason);
    setShowRejectInput(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Worker Verification & Society KYC</h2>
          <p className="text-xs text-slate-500">
            Review identity documents, verify cooperative affiliation, and authorize platform dispatch
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {(['PENDING', 'VERIFIED', 'REJECTED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl transition ${
                filter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab} ({state.workers.filter((w) => (tab === 'ALL' ? true : w.verificationStatus === tab)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Workers Verification Queue */}
      {workers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No worker profiles in this queue</h3>
          <p className="text-xs text-slate-500">All pending applications have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition ${
                worker.verificationStatus === 'PENDING'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-base border border-slate-200">
                    {worker.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">{worker.fullName}</h4>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          worker.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : worker.verificationStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        ● {worker.verificationStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Category: <span className="font-semibold text-slate-700">{worker.serviceCategory}</span> • Experience: {worker.experienceYears} Years
                    </p>
                    <p className="text-xs text-slate-500">
                      Cooperative Society ID: <span className="font-mono text-slate-700">{worker.cooperativeId}</span> ({worker.cooperativeBranch})
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-slate-500 block">Registered On</span>
                  <span className="font-medium text-slate-800">
                    {new Date(worker.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Middle: Skills & Areas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skills & Specializations</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {worker.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Service Neighborhoods</span>
                  <p className="text-slate-700 font-medium">{worker.serviceAreas.join(', ')}</p>
                  <p className="text-slate-400 text-[11px]">Pincode: {worker.primaryPincode}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Uploaded KYC Verification Documents</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-medium">{worker.kycDocumentType || 'Government ID & Proof'}</span>
                    <button
                      onClick={() => setPreviewDocModal(worker)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Proof</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  {worker.verificationNotes && (
                    <span className="italic">Note: {worker.verificationNotes}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {worker.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => handleApprove(worker.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                  )}

                  {worker.verificationStatus !== 'REJECTED' && (
                    <button
                      onClick={() => setShowRejectInput(worker.id)}
                      className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Reject Reason Sub-form */}
              {showRejectInput === worker.id && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2">
                  <span className="font-bold text-rose-800 block">Specify Rejection Reason:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Incomplete ID document / Invalid trade certificate..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-xs"
                    />
                    <button
                      onClick={() => handleReject(worker.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setShowRejectInput(null)}
                      className="px-2.5 py-1.5 bg-slate-200 text-slate-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Simulated Document Viewer Modal */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  KYC Verification Dossier: {previewDocModal.fullName}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{previewDocModal.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-mono text-emerald-700">{previewDocModal.kycDocumentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cooperative Society Registration:</span>
                <span className="font-semibold text-slate-800">{previewDocModal.cooperativeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Category:</span>
                <span className="font-semibold text-slate-800">{previewDocModal.serviceCategory}</span>
              </div>
            </div>

            {/* Document Mock Canvas */}
            <div className="h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 space-y-2 p-4 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
              <span className="font-semibold text-xs text-slate-800">
                Government Identity Proof & Cooperative Society Affiliation Certificate
              </span>
              <p className="text-[11px] text-slate-400">
                Digitally cryptographically signed by Bangalore East Workers Society
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  handleApprove(previewDocModal.id);
                  setPreviewDocModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Verify & Activate Worker
              </button>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
