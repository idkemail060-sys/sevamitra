/**
 * SEVAMITRA - About & Cooperative Architecture
 * SIH26089 | Team Techforge | Smart India Hackathon 2026
 */

import React from 'react';
import {
  ShieldCheck,
  Scale,
  Sparkles,
  Users,
  Vote,
  Award,
  HeartHandshake,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export const AboutCooperative: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>Smart India Hackathon 2026 • SIH26089</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          The SevaMitra Cooperative Architecture
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          "A Cooperative Digital Platform for Household & Community Services"
          designed and developed by Team <strong>Techforge</strong>.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Fair Worker Opportunity & Rotation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike monopolistic gig algorithms that funnel 90% of requests to a narrow sliver of top accounts,
            our Fair Rotation Algorithm dynamically balances workload history, ensuring equal access to living-wage gigs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Transparent Profit-Sharing (93%)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminates traditional 25-35% corporate commissions. Exactly 93% of customer payment is credited to the worker.
            Only 5% covers operational infrastructure and 2% funds the Worker Emergency & Welfare corpus.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Vote className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Democratic Cooperative Governance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Workers are co-owners. All major policy decisions—platform fee splits, minimum rates, insurance allocations—are
            voted on democratically via one-worker-one-vote digital referendums.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Local Community First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Focused on hyperlocal trust in Indian residential neighborhoods. Verified KYC badges, transparent ratings,
            and respectful dispute redressal mechanisms ensure harmony between households and artisans.
          </p>
        </div>
      </div>

      {/* Techforge Hackathon Team Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Built for Smart India Hackathon 2026</h3>
            <p className="text-xs text-slate-400">Team Techforge • Problem Statement ID: SIH26089</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Technology Stack: React 18, TypeScript, Tailwind CSS, Supabase Realtime pub/sub architecture, PostgreSQL RLS,
          Razorpay Payment Sandbox, and Lucide React.
        </p>
      </div>
    </div>
  );
};
