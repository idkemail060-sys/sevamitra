/**
 * SEVAMITRA - Judge & Persona Quick-Switcher Banner
 * SIH26089 | Team Techforge | Smart India Hackathon 2026
 *
 * Enables judges and evaluators to seamlessly toggle between:
 * - Household (Ananya Sen)
 * - Worker (Arjun Patel - Plumber)
 * - Worker (Ramesh Kumar - Electrician)
 * - Worker (Sunita Verma - Cleaning)
 * - Admin (Rajeshwari Rao - Cooperative Admin)
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import {
  Users,
  ShieldCheck,
  Wrench,
  Sparkles,
  Zap,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface DemoSwitcherProps {
  onOpenJudgeGuide: () => void;
  onNavigate: (path: string) => void;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({ onOpenJudgeGuide, onNavigate }) => {
  const state = getStoreState();
  const currentUser = store.getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const personas = [
    {
      id: 'u-ananya-sen',
      name: 'Ananya Sen',
      role: 'HOUSEHOLD',
      roleLabel: 'Household Customer',
      tag: 'Customer in Indiranagar',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      activeColor: 'bg-indigo-600 text-white',
      destination: '/household/dashboard',
    },
    {
      id: 'w-arjun-patel',
      name: 'Arjun Patel',
      role: 'WORKER',
      roleLabel: 'Verified Worker',
      tag: 'Plumber (4.7★, 4 jobs this week)',
      icon: Wrench,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      activeColor: 'bg-emerald-600 text-white',
      destination: '/worker/dashboard',
    },
    {
      id: 'w-ramesh-kumar',
      name: 'Ramesh Kumar',
      role: 'WORKER',
      roleLabel: 'Verified Worker',
      tag: 'Electrician (4.8★, In-Progress job)',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      activeColor: 'bg-amber-600 text-white',
      destination: '/worker/dashboard',
    },
    {
      id: 'w-sunita-verma',
      name: 'Sunita Verma',
      role: 'WORKER',
      roleLabel: 'Verified Worker',
      tag: 'Cleaning Lead (4.9★, Top Rated)',
      icon: Sparkles,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      activeColor: 'bg-cyan-600 text-white',
      destination: '/worker/dashboard',
    },
    {
      id: 'u-admin-rajeshwari',
      name: 'Rajeshwari Rao',
      role: 'ADMIN',
      roleLabel: 'Cooperative Admin',
      tag: 'Karnataka State Gig Society',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      activeColor: 'bg-purple-600 text-white',
      destination: '/admin/dashboard',
    },
  ];

  const handleSelectPersona = (persona: (typeof personas)[0]) => {
    store.setCurrentUser(persona.id);
    onNavigate(persona.destination);
    setIsOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo bookings, votes, and grievances to initial SIH seed state?')) {
      store.resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      onNavigate('/household/dashboard');
    }
  };

  const activePersona = personas.find((p) => p.id === state.currentUserId) || personas[0];

  return (
    <div className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Hackathon ID Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-semibold tracking-wide text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SIH26089
          </span>
          <span className="hidden md:inline font-medium text-slate-300">
            Techforge • Cooperative Platform Demo
          </span>
        </div>

        {/* Current Active Persona & Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1 rounded-md border border-slate-700 transition"
              title="Switch demo user account"
            >
              <span className="text-slate-400 text-[11px] uppercase tracking-wider hidden sm:inline">
                Active User:
              </span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {currentUser?.fullName || 'Ananya Sen'}
              </span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-700 text-emerald-300 font-mono">
                {currentUser?.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-2 py-1 border-b border-slate-800 flex justify-between">
                  <span>Select Persona to Test</span>
                  <span className="text-emerald-400 font-normal">SIH Demo Mode</span>
                </div>
                <div className="space-y-1 mt-1">
                  {personas.map((p) => {
                    const isSelected = p.id === state.currentUserId;
                    const IconComp = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPersona(p)}
                        className={`w-full text-left px-2.5 py-2 rounded-md flex items-start gap-2.5 transition ${
                          isSelected
                            ? 'bg-emerald-900/60 border border-emerald-600 text-white'
                            : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs truncate">{p.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-slate-300">
                              {p.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{p.tag}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Guided Tour Modal Button */}
          <button
            onClick={onOpenJudgeGuide}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-2.5 sm:px-3 py-1 rounded-md shadow-sm transition text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Judge Guide</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetData}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 sm:px-2.5 py-1 rounded-md border border-slate-700 transition text-xs"
            title="Reset to fresh demo state"
          >
            <RotateCcw className={`w-3 h-3 ${resetSuccess ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden lg:inline">{resetSuccess ? 'Reset!' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
