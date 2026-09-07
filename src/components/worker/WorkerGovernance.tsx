/**
 * SEVAMITRA - Democratic Cooperative Governance
 * Section 12 | SIH26089 | Team Techforge
 *
 * "Workers are equal voting members. You own this platform."
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { GovernanceVoteChoice } from '../../types';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Calendar,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const WorkerGovernance: React.FC = () => {
  const state = getStoreState();
  const currentWorker = state.workers.find((w) => w.id === state.currentUserId);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  if (!currentWorker) return null;

  const handleCastVote = (proposalId: string, choice: GovernanceVoteChoice) => {
    store.castGovernanceVote(proposalId, currentWorker.id, choice);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Vote className="w-3.5 h-3.5" />
            <span>One Worker = One Vote Democratic Standard</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Cooperative Governance & Ballots
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlike corporate gig apps where opaque corporate boards set policies and cut rates unilaterally,
            SevaMitra is owned by you. Every registered cooperative worker votes on platform fees, welfare budgets,
            and baseline service rates.
          </p>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Active & Historical Policy Proposals</h3>
          <span className="text-xs text-slate-500 font-medium">
            {state.proposals.length} Cooperative Motions
          </span>
        </div>

        <div className="space-y-4">
          {state.proposals.map((proposal) => {
            const hasVoted = proposal.hasVotedUserIds.includes(currentWorker.id);
            const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
            const forPercent = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
            const againstPercent = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0;

            return (
              <div
                key={proposal.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Proposal Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {proposal.proposalCode}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">
                        {proposal.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          proposal.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : proposal.status === 'PASSED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        ● {proposal.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{proposal.title}</h4>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Voting ends: {new Date(proposal.votingDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Proposal Description */}
                <p className="text-xs text-slate-600 leading-relaxed">{proposal.description}</p>

                {/* Voting Results Bar */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span>FOR: {proposal.votesFor} ({forPercent}%)</span>
                    </span>
                    <span className="text-slate-500 font-normal">{totalVotes} Total Ballots Cast</span>
                    <span className="flex items-center gap-1.5 text-rose-700">
                      <span>AGAINST: {proposal.votesAgainst} ({againstPercent}%)</span>
                    </span>
                  </div>

                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${forPercent}%` }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${againstPercent}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Voting Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  {hasVoted ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Your Ballot Has Been Recorded in the Cooperative Ledger</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Cast your democratic ballot as an enrolled shareholder of {currentWorker.cooperativeBranch}:
                    </span>
                  )}

                  {!hasVoted && proposal.status === 'ACTIVE' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCastVote(proposal.id, 'FOR')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        Vote FOR (Yes)
                      </button>
                      <button
                        onClick={() => handleCastVote(proposal.id, 'AGAINST')}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        Vote AGAINST (No)
                      </button>
                      <button
                        onClick={() => handleCastVote(proposal.id, 'ABSTAIN')}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition"
                      >
                        Abstain
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
