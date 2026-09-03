/**
 * SEVAMITRA - Portal Sidebar Navigation
 * Problem Statement ID: SIH26089 | Team Techforge
 */

import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Search,
  Calendar,
  CreditCard,
  User,
  Vote,
  AlertCircle,
  FileCheck2,
  Clock,
  Settings,
  BarChart3,
  ShieldCheck,
  Bell,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  pendingRequestsCount?: number;
  pendingVerificationCount?: number;
}

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentPath,
  onNavigate,
  pendingRequestsCount = 0,
  pendingVerificationCount = 0,
}) => {
  const householdNav: NavItem[] = [
    { label: 'Dashboard', path: '/household/dashboard', icon: LayoutDashboard },
    { label: 'Find Service (Smart Match)', path: '/household/services', icon: Search, highlight: true },
    { label: 'My Bookings', path: '/household/bookings', icon: Calendar },
    { label: 'Payment History', path: '/household/payments', icon: CreditCard },
    { label: 'Household Profile', path: '/household/profile', icon: User },
    { label: 'Notifications', path: '/household/notifications', icon: Bell },
  ];

  const workerNav: NavItem[] = [
    { label: 'Dashboard Overview', path: '/worker/dashboard', icon: LayoutDashboard },
    {
      label: 'Job Requests',
      path: '/worker/requests',
      icon: Calendar,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      highlight: pendingRequestsCount > 0,
    },
    { label: 'Active & Past Jobs', path: '/worker/bookings', icon: Clock },
    { label: 'Transparent Earnings', path: '/worker/earnings', icon: CreditCard, highlight: true },
    { label: 'Availability & Area', path: '/worker/availability', icon: Settings },
    { label: 'Cooperative Governance', path: '/worker/governance', icon: Vote, highlight: true },
    { label: 'Grievance Redressal', path: '/worker/grievances', icon: AlertCircle },
    { label: 'Worker Profile & KYC', path: '/worker/profile', icon: User },
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
    {
      label: 'Worker Verification',
      path: '/admin/verification',
      icon: FileCheck2,
      badge: pendingVerificationCount > 0 ? `${pendingVerificationCount} New` : undefined,
      highlight: true,
    },
    { label: 'All Platform Workers', path: '/admin/workers', icon: User },
    { label: 'Bookings Oversight', path: '/admin/bookings', icon: Calendar },
    { label: 'Treasury & Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Governance Manager', path: '/admin/governance', icon: Vote },
    { label: 'Grievances Redressal', path: '/admin/grievances', icon: AlertCircle },
    { label: 'Cooperative Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Platform Engine Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems =
    role === 'HOUSEHOLD' ? householdNav : role === 'WORKER' ? workerNav : adminNav;

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-slate-200 min-h-[calc(100vh-5rem)] p-5 space-y-6">
      {/* Role Badge Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              role === 'ADMIN'
                ? 'bg-purple-600'
                : role === 'WORKER'
                ? 'bg-emerald-600'
                : 'bg-indigo-600'
            }`}
          />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {role === 'ADMIN'
              ? 'Cooperative Admin'
              : role === 'WORKER'
              ? 'Cooperative Worker'
              : 'Household Member'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-tight">
          {role === 'ADMIN'
            ? 'State Gig Society Oversight Portal'
            : role === 'WORKER'
            ? 'Cooperative Shareholder Dashboard'
            : 'Verified Community Client'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Co-op Governance Dark Banner (Clean Minimalism Design) */}
      <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 text-indigo-100">Co-op Governance</h4>
          <p className="text-[11px] text-indigo-200 mb-3 leading-relaxed">
            Active Proposal: Reduce platform fee to 4% for verified local workers.
          </p>
          <button
            onClick={() => onNavigate(role === 'WORKER' ? '/worker/governance' : role === 'ADMIN' ? '/admin/governance' : '/about')}
            className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-bold rounded-lg transition-colors uppercase tracking-widest cursor-pointer"
          >
            {role === 'WORKER' ? 'Vote Now' : 'View Policy'}
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-800 rounded-full opacity-50 pointer-events-none"></div>
      </div>

      {/* Cooperative Impact Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cooperative Impact</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Transparent Fee</span>
            <span className="font-bold text-emerald-600">5% FIXED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Worker Profit Share</span>
            <span className="font-bold text-slate-900">93%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Co-op Fund Share</span>
            <span className="font-bold text-slate-900">2%</span>
          </div>
        </div>
        <div className="pt-2.5 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 italic text-center leading-snug">
            "SevaMitra is owned by its workers, governed by its members."
          </p>
        </div>
      </div>
    </aside>
  );
};
