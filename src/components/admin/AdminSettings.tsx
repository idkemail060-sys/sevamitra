/**
 * SEVAMITRA - Admin Smart Matching Engine Settings & Fee Tuning
 * Section 8 & 14 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import { MatchingWeightsConfig } from '../../types';
import {
  Sliders,
  Scale,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const state = getStoreState();
  const [config, setConfig] = useState<MatchingWeightsConfig>({ ...state.config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateMatchingWeights(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaults: MatchingWeightsConfig = {
      categoryWeight: 0.4,
      localityWeight: 0.3,
      ratingWeight: 0.15,
      availabilityWeight: 0.15,
      fairnessWeight: 0.35,
      weeklyJobThreshold: 10,
      platformFeePercent: 5,
      cooperativeFundPercent: 2,
    };
    setConfig(defaults);
    store.updateMatchingWeights(defaults);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Smart Engine & Fee Settings</h2>
        <p className="text-xs text-slate-500">
          Tune matching algorithm factor weights, fair rotation priority, and transparent fee splits
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Platform engine configurations updated live across all active user sessions!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Module 1: Smart Matching Weights (Section 8) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Base Match Score Weights</h3>
              <p className="text-xs text-slate-500">Weights must reflect cooperative priorities (Category, Proximity, Rating, Readiness)</p>
            </div>
          </div>

          {/* Category Match Weight */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Category / Skill Match Weight:</span>
              <span className="text-emerald-700">{Math.round(config.categoryWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={config.categoryWeight}
              onChange={(e) => setConfig({ ...config, categoryWeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Locality Weight */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Locality / Proximity Weight:</span>
              <span className="text-emerald-700">{Math.round(config.localityWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={config.localityWeight}
              onChange={(e) => setConfig({ ...config, localityWeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Rating Weight */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Customer Rating Weight:</span>
              <span className="text-emerald-700">{Math.round(config.ratingWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.05"
              value={config.ratingWeight}
              onChange={(e) => setConfig({ ...config, ratingWeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Availability Weight */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Real-Time Availability Weight:</span>
              <span className="text-emerald-700">{Math.round(config.availabilityWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.05"
              value={config.availabilityWeight}
              onChange={(e) => setConfig({ ...config, availabilityWeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Module 2: Fair Rotation Algorithm (Section 8) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Fair Rotation & Anti-Monopoly Settings</h3>
              <p className="text-xs text-slate-500">Prevent a small elite of workers from hoarding all neighborhood bookings</p>
            </div>
          </div>

          {/* Fairness Weight */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Fairness Rotation Weight (Blended into Final Rank):</span>
              <span className="text-indigo-700 font-bold">{Math.round(config.fairnessWeight * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={config.fairnessWeight}
              onChange={(e) => setConfig({ ...config, fairnessWeight: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            <p className="text-[11px] text-slate-500">
              Higher fairness weight gives more priority to capable workers with fewer weekly tasks.
            </p>
          </div>

          {/* Weekly Job Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Weekly Job Threshold (Max target before load dampening):</span>
              <span className="text-indigo-700 font-mono">{config.weeklyJobThreshold} Jobs / Week</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={config.weeklyJobThreshold}
              onChange={(e) => setConfig({ ...config, weeklyJobThreshold: parseInt(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Module 3: Transparent Fee Engine (Section 11) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Cooperative Fee Distribution Split</h3>
              <p className="text-xs text-slate-500">Determines the split on each Razorpay customer transaction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Platform Operations Fee (%)</label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={config.platformFeePercent}
                onChange={(e) => setConfig({ ...config, platformFeePercent: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Cooperative server & gateway maintenance</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Worker Welfare Fund (%)</label>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={config.cooperativeFundPercent}
                onChange={(e) => setConfig({ ...config, cooperativeFundPercent: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Emergency grants & healthcare subsidies</span>
            </div>
          </div>

          {/* Resulting Net Payout Preview */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
            <span className="font-medium">Direct Worker Net Payout:</span>
            <span className="text-base font-black text-emerald-700">
              {(100 - config.platformFeePercent - config.cooperativeFundPercent).toFixed(1)}% Net
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            Save Platform Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
