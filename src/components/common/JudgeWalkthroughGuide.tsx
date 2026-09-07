/**
 * SEVAMITRA - Judge Interactive Evaluation Guide
 * Section 33: HACKATHON DEMO MODE
 */

import React from 'react';
import { store } from '../../services/store';
import {
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Scale,
  CreditCard,
  Vote,
  FileCheck2,
} from 'lucide-react';

interface JudgeWalkthroughGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const JudgeWalkthroughGuide: React.FC<JudgeWalkthroughGuideProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Login as Household & Search Service',
      description: 'Logged in as Smt. Ananya Sen (Indiranagar, 560038). Open Services & choose Plumbing.',
      personaToSwitch: 'u-ananya-sen',
      targetPath: '/household/services',
      uspBadge: 'Smart Matching',
      icon: Sparkles,
    },
    {
      num: 2,
      title: 'Smart Matching & Fair Rotation Ranking',
      description:
        'See ranked workers (Arjun Patel, Suresh Naik). Notice how Arjun Patel receives Fair Rotation Priority because he has completed fewer jobs this week than Suresh Naik (4 vs 18 jobs), preventing task monopolization!',
      personaToSwitch: 'u-ananya-sen',
      targetPath: '/household/services',
      uspBadge: 'Fair Rotation Algorithm',
      icon: Scale,
    },
    {
      num: 3,
      title: 'Book Worker & Create Service Request',
      description: 'Confirm the booking with transparent fee preview. Real-time event dispatches request to Arjun Patel.',
      personaToSwitch: 'u-ananya-sen',
      targetPath: '/household/bookings',
      uspBadge: 'Transparent Pricing',
      icon: FileCheck2,
    },
    {
      num: 4,
      title: 'Switch to Worker (Arjun Patel) & Accept Job',
      description:
        'Worker views incoming request in his dashboard, reviews customer address & task notes, and clicks Accept.',
      personaToSwitch: 'w-arjun-patel',
      targetPath: '/worker/requests',
      uspBadge: 'Worker Dashboard',
      icon: ShieldCheck,
    },
    {
      num: 5,
      title: 'Real-Time Status & Lifecycle Execution',
      description: 'Worker marks booking "In Progress" and "Completed". Household dashboard updates instantly without page refresh.',
      personaToSwitch: 'w-arjun-patel',
      targetPath: '/worker/dashboard',
      uspBadge: 'Supabase Realtime PubSub',
      icon: Sparkles,
    },
    {
      num: 6,
      title: 'Razorpay Test Payment Checkout',
      description:
        'Switch to Household, click "Pay via Razorpay Test", enter test UPI/Card, verify server-side transaction and receive official invoice.',
      personaToSwitch: 'u-ananya-sen',
      targetPath: '/household/bookings',
      uspBadge: 'Razorpay Sandbox',
      icon: CreditCard,
    },
    {
      num: 7,
      title: 'Transparent Earnings Ledger & Cooperative Split',
      description:
        'Switch back to Arjun Patel: Worker sees exact gross (₹450), 5% platform fee (₹22.50), 2% cooperative reserve (₹9.00), and ₹418.50 net earnings.',
      personaToSwitch: 'w-arjun-patel',
      targetPath: '/worker/earnings',
      uspBadge: 'Zero Hidden Fees',
      icon: CreditCard,
    },
    {
      num: 8,
      title: 'Democratic Cooperative Governance Voting',
      description:
        'Open Proposal #2601 (Fee reduction from 5% to 4%). Cast vote as Arjun Patel. Test one-worker-one-vote validation.',
      personaToSwitch: 'w-arjun-patel',
      targetPath: '/worker/governance',
      uspBadge: 'Cooperative Ownership',
      icon: Vote,
    },
    {
      num: 9,
      title: 'Cooperative Admin KYC Verification',
      description:
        'Switch to Admin (Rajeshwari Rao). Review pending applicant Deepak Mali (Gardening in Whitefield), view uploaded documents, and approve his cooperative membership.',
      personaToSwitch: 'u-admin-rajeshwari',
      targetPath: '/admin/verification',
      uspBadge: 'KYC & Member Oversight',
      icon: ShieldCheck,
    },
    {
      num: 10,
      title: 'Admin Analytics & Dynamic Settings',
      description:
        'Inspect GMV, platform revenue, cooperative welfare balance, tuning weights for the Matching Engine, and resolving worker grievances.',
      personaToSwitch: 'u-admin-rajeshwari',
      targetPath: '/admin/dashboard',
      uspBadge: 'Platform Governance',
      icon: Scale,
    },
  ];

  const handleExecuteStep = (step: (typeof steps)[0]) => {
    store.setCurrentUser(step.personaToSwitch);
    onNavigate(step.targetPath);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                SIH26089 Hackathon Evaluator Tour
              </span>
              <span className="text-xs text-slate-400">Team Techforge</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>SevaMitra End-to-End Walkthrough</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Experience the complete cooperative gig platform workflow as outlined in Section 33.
              Click any step to automatically switch persona and jump to that screen.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-100">
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.num}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50 p-2.5 rounded-xl transition"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-300">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{step.title}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {step.uspBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteStep(step)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition shrink-0 self-end sm:self-center"
                >
                  <span>Test Step {step.num}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Cooperative Gig Services Platform for Household & Community Services</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
