/**
 * SEVAMITRA - Admin Worker Directory & Profile Management
 * Section 14 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { getStoreState, store } from '../../services/store';
import {
  Users,
  Search,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Scale,
  Power,
  FileCheck2,
} from 'lucide-react';

export const AdminWorkers: React.FC = () => {
  const state = getStoreState();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredWorkers = state.workers.filter((w) => {
    const matchesSearch =
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.serviceAreas.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      w.cooperativeId.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || w.serviceCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Registered Cooperative Workers</h2>
          <p className="text-xs text-slate-500">
            Total of {state.workers.length} registered artisans across all Bangalore union chapters
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, area, ID..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none pl-8"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Gardening">Gardening</option>
          </select>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                    {w.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{w.fullName}</h4>
                    <span className="text-xs text-slate-500 font-medium block">
                      {w.serviceCategory} • {w.experienceYears} yrs
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    w.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : w.verificationStatus === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  ● {w.verificationStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Rating:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{w.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({w.ratingCount})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Jobs This Week:</span>
                  <span className="font-bold text-slate-900">{w.jobsThisWeek}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Lifetime Jobs:</span>
                  <span className="font-semibold text-slate-900">{w.totalCompletedJobs}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Availability:</span>
                  <span className={w.isAvailable ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {w.isAvailable ? 'Active Dispatch' : 'Off-Duty'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cooperative Society ID</span>
                <span className="font-mono font-semibold text-slate-800">{w.cooperativeId}</span>
                <p className="truncate text-slate-500">{w.cooperativeBranch}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
                {w.serviceAreas.join(', ')}
              </span>
              <button
                onClick={() => store.toggleWorkerAvailability(w.id)}
                className="text-emerald-700 font-semibold hover:underline text-[11px]"
              >
                Toggle Duty
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
