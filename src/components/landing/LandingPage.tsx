/**
 * SEVAMITRA - Startup-Grade Landing Page
 * SIH26089 | Team Techforge | Smart India Hackathon 2026
 *
 * Communicates:
 * "Workers are not just service providers. They are cooperative participants and beneficiaries."
 */

import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../../services/store';
import {
  ShieldCheck,
  Scale,
  Sparkles,
  Users,
  Vote,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Star,
  Award,
  ChevronRight,
  TrendingUp,
  Sliders,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenJudgeGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenJudgeGuide }) => {
  const [selectedPincode, setSelectedPincode] = useState('560038');
  const [selectedService, setSelectedService] = useState('Plumbing');

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* SIH Hackathon Official Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300 shadow-xs">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Smart India Hackathon 2026 • Problem Statement ID: SIH26089</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-sans">
              Fair Work. Trusted Services.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                Cooperative Growth.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              SevaMitra is a cooperative-owned digital platform connecting households with verified local
              service workers. We eliminate exploitative corporate commissions through transparent profit-sharing,
              smart fair-rotation matching, and democratic worker governance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/household/services')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 group"
              >
                <span>Find a Service (Smart Match)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => onNavigate('/register')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Join as a Worker</span>
              </button>

              <button
                onClick={onOpenJudgeGuide}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>SIH Judge Interactive Tour</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-200/80">
              <div className="space-y-0.5">
                <span className="text-2xl font-black text-slate-900">93%</span>
                <p className="text-xs text-slate-500 font-medium">Direct Worker Earnings</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl font-black text-emerald-700">Fair Rotation</span>
                <p className="text-xs text-slate-500 font-medium">Democratic Task Distribution</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl font-black text-slate-900">100%</span>
                <p className="text-xs text-slate-500 font-medium">Verified KYC Workers</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-2xl font-black text-emerald-700">1 Worker 1 Vote</span>
                <p className="text-xs text-slate-500 font-medium">Cooperative Governance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Catalog Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Verified Community Services
          </span>
          <h2 className="text-3xl font-bold text-slate-900">Explore Household & Community Services</h2>
          <p className="text-sm text-slate-600">
            Every service provider is background-checked, trained, and protected by their local cooperative society.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {INITIAL_SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={() => onNavigate('/household/services')}
              className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition">
                  {service.name.charAt(0)}
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">From ₹{service.baseRate}</span>
                <span className="text-emerald-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                  Book <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why SevaMitra: Cooperative Model vs Corporate Gig Platform */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-12 overflow-hidden relative shadow-xl">
          <div className="max-w-3xl space-y-4 mb-8">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              The Cooperative Difference
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why SevaMitra is Not Just Another Corporate Gig App
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional aggregators extract 20% to 30% from vulnerable blue-collar workers while treating them as
              disposable independent contractors without benefits or say. SevaMitra shifts ownership back to the workers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Corporate Gig Platform Column */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-rose-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-rose-300">Corporate Gig Model</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-semibold">
                  Extractive
                </span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>25% to 35% hidden commission deducted from each job</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Opaque black-box algorithm favors monopolized top profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Zero worker voice: unilateral account suspensions without recourse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Profits extracted by venture capital shareholders</span>
                </li>
              </ul>
            </div>

            {/* SevaMitra Cooperative Column */}
            <div className="bg-gradient-to-br from-emerald-950/70 to-slate-800 rounded-2xl p-6 border border-emerald-500/50 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-emerald-300">SevaMitra Cooperative</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-semibold">
                  Cooperative Owned
                </span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Only 5% platform fee + 2% worker welfare fund (93% net payout)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Fair Rotation Algorithm prevents task hoarding and shares gig volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1-Worker 1-Vote democratic governance on all platform fee rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Surplus reinvested into worker healthcare, tools, and accident insurance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Matching & Fair Rotation Deep-Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Smart Automation (SIH26089 Core Innovation)
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Smart Matching Engine with Fair Workload Rotation
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In typical platforms, a worker with a 4.9 rating gets 100% of jobs while capable workers with 4.7 ratings
              sit idle. SevaMitra dynamically blends Category Match (40%), Locality/Pincode Proximity (30%), Rating (15%),
              and Availability (15%) with an ethical <strong>Fairness Score</strong> based on weekly workload.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Sliders className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Configurable Backend Weights</span>
                  <p className="text-slate-500">Cooperative admins can tune matching factors dynamically via settings.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Fairness Bonus Factor</span>
                  <p className="text-slate-500">Under-allocated verified workers get priority queueing to ensure equal livelihood opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Demo Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Live Match Engine Preview (Indiranagar / 560038)
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Service: Plumbing
              </span>
            </div>

            <div className="space-y-3">
              {/* Candidate 1: Arjun Patel (Fairness Winner) */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      AP
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Arjun Patel</h4>
                      <span className="text-[11px] text-slate-500">4.7★ (38 reviews) • 4 jobs this week</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-700">95 Score</span>
                    <span className="block text-[10px] text-emerald-800 font-semibold">Rank #1 (Fair Boost)</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-900 bg-emerald-100/70 p-2 rounded-lg leading-relaxed">
                  ✓ Same Locality (560038) • ✓ High Rating • <strong>✓ Fair rotation priority (+20pts)</strong>
                </div>
              </div>

              {/* Candidate 2: Suresh Naik (High rating, high load) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs">
                      SN
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Suresh Naik</h4>
                      <span className="text-[11px] text-slate-500">4.8★ (90 reviews) • 18 jobs this week</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-700">86 Score</span>
                    <span className="block text-[10px] text-slate-500">Rank #2 (Load Cap)</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-slate-100 p-2 rounded-lg leading-relaxed">
                  ✓ Same Locality (Domlur) • Highly Rated • <em>Weekly capacity threshold reached</em>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/household/services')}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
            >
              Test Real Matching with Custom Locality & Service →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-3xl font-bold text-slate-900">How SevaMitra Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-base text-slate-900">1. Search by Locality & Task</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Household selects needed category and enters locality/pincode. Smart matching engine evaluates verified
              cooperative members and calculates fair scores.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-base text-slate-900">2. Real-Time Booking & Execution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Worker receives request, reviews scope, and accepts. Booking status updates in real-time across both
              dashboards from Requested → Accepted → In Progress → Completed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-base text-slate-900">3. Digital Pay & Cooperative Vote</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer settles payment via Razorpay Test mode. 93% credits directly to the worker’s account while 2%
              funds cooperative welfare. Workers participate in democratic voting on platform policies.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Community Voices</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Empowering Local Livelihoods</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "On corporate apps, they took 30% of my earnings and I had no say. In SevaMitra, I keep 93%, and our
              society recently voted on tool subsidies. It feels like our own company."
            </p>
            <div className="border-t border-slate-100 pt-2">
              <span className="font-bold text-xs text-slate-900 block">Ramesh Kumar</span>
              <span className="text-[11px] text-slate-500">Electrician, Koramangala (240+ jobs)</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Sunita Verma arrived right on time and cleaned our kitchen impeccably. Knowing my payment goes directly
              to her rather than an offshore corporate entity gives great peace of mind."
            </p>
            <div className="border-t border-slate-100 pt-2">
              <span className="font-bold text-xs text-slate-900 block">Ananya Sen</span>
              <span className="text-[11px] text-slate-500">Resident, Indiranagar</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The Fair Rotation algorithm gave me consistent jobs when I first joined, instead of sending everything to
              established senior workers. It’s truly democratic."
            </p>
            <div className="border-t border-slate-100 pt-2">
              <span className="font-bold text-xs text-slate-900 block">Arjun Patel</span>
              <span className="text-[11px] text-slate-500">Plumber, Bangalore East Union</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800">SevaMitra Cooperative Platform</span>
            <span>• SIH 2026 (SIH26089)</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/about')} className="hover:text-slate-800">
              Cooperative Model
            </button>
            <button onClick={() => onNavigate('/services')} className="hover:text-slate-800">
              Services
            </button>
            <button onClick={onOpenJudgeGuide} className="text-emerald-700 font-semibold hover:underline">
              Judge Walkthrough
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
