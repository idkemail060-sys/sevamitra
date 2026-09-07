/**
 * SEVAMITRA - Admin Cooperative Governance Manager
 * Section 12 & 14 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { GovernanceCategory } from '../../types';
import { Vote, Plus, Calendar, CheckCircle2, Users, FileText } from 'lucide-react';

export const AdminGovernance: React.FC = () => {
  const state = getStoreState();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GovernanceCategory>('PLATFORM_FEE');
  const [deadlineDays, setDeadlineDays] = useState(14);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);

    store.createGovernanceProposal({
      title,
      description,
      category,
      votingDeadline: deadline.toISOString(),
    });

    setTitle('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cooperative Governance Administration</h2>
          <p className="text-xs text-slate-500">
            Publish democratic policy proposals for worker referendum voting
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Draft' : 'Draft New Ballot Proposal'}</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateProposal}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Draft New Cooperative Proposal</h3>
            <p className="text-xs text-slate-500">All verified workers will be notified and cast equal ballots</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Proposal Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Expand tool subsidy allocation from ₹2,000 to ₹3,500"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="PLATFORM_FEE">Platform Fee Changes</option>
                <option value="EMERGENCY_FUND">Emergency Relief & Welfare Fund</option>
                <option value="MINIMUM_RATES">Minimum Base Service Rates</option>
                <option value="HEALTH_BENEFITS">Worker Healthcare & Insurance</option>
                <option value="COOPERATIVE_POLICY">Cooperative Constitution / Bye-Laws</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Voting Period (Days)</label>
              <input
                type="number"
                min={3}
                max={30}
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Policy Text</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the policy change, economic rationale, and implementation schedule..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              Publish Proposal to Cooperative
            </button>
          </div>
        </form>
      )}

      {/* Proposals Overview */}
      <div className="space-y-4">
        {state.proposals.map((p) => {
          const totalVotes = p.votesFor + p.votesAgainst + p.votesAbstain;
          const forPct = totalVotes > 0 ? Math.round((p.votesFor / totalVotes) * 100) : 0;
          const againstPct = totalVotes > 0 ? Math.round((p.votesAgainst / totalVotes) * 100) : 0;

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600">{p.proposalCode}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ● {p.status}
                    </span>
                    <span className="text-xs text-slate-400">Category: {p.category}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{p.title}</h4>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{totalVotes}</span> worker ballots
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

              {/* Vote progress breakdown */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-emerald-700">FOR: {p.votesFor} ({forPct}%)</span>
                  <span className="text-rose-700">AGAINST: {p.votesAgainst} ({againstPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div style={{ width: `${forPct}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${againstPct}%` }} className="bg-rose-500 h-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
