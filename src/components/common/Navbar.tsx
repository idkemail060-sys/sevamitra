/**
 * SEVAMITRA - Primary Navigation Bar
 * SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store } from '../../services/store';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ShieldCheck,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Wrench,
  Calendar,
  Vote,
  AlertCircle,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenJudgeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenJudgeGuide }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUser = store.getCurrentUser();

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'HOUSEHOLD') return '/household/dashboard';
    if (currentUser.role === 'WORKER') return '/worker/dashboard';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-7 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-xs"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-indigo-900 font-sans">
                    SEVAMITRA
                  </span>
                  <Badge variant="indigo" className="text-[10px] tracking-wider py-0 px-2 font-bold uppercase">
                    CO-OP PLATFORM
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Smart Worker Matching • SIH 2026
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('/')}
              className={`transition py-1 ${
                currentPath === '/' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/services')}
              className={`transition py-1 ${
                currentPath.includes('/services') ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'
              }`}
            >
              Find Services
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`transition py-1 ${
                currentPath === '/about' ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600'
              }`}
            >
              Cooperative Model
            </button>

            {currentUser && (
              <button
                onClick={() => handleNav(getDashboardPath())}
                className={`transition py-1 flex items-center gap-1.5 ${
                  currentPath.includes('/dashboard') || currentPath.includes(currentUser.role.toLowerCase())
                    ? 'text-indigo-600 font-semibold'
                    : 'hover:text-indigo-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {currentUser && <NotificationBell onNavigate={onNavigate} />}

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <button
                  onClick={() => handleNav(getDashboardPath())}
                  className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {currentUser.role === 'HOUSEHOLD' ? 'Household Account' : currentUser.role === 'WORKER' ? 'Co-op Worker' : 'Co-op Admin'}
                    </p>
                  </div>
                  <Avatar className="w-9 h-9 border border-border shadow-2xs">
                    <AvatarFallback className="bg-slate-100 text-slate-700 font-bold text-xs">
                      {currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNav('/login')}
                  className="text-xs font-semibold"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleNav('/register')}
                  className="text-xs font-semibold"
                >
                  Join Cooperative
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold px-2 mb-1">
            Menu Navigation
          </div>
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/services')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"
          >
            Services Catalog
          </button>
          <button
            onClick={() => handleNav('/about')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100"
          >
            About SevaMitra & Cooperative Model
          </button>

          {currentUser && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold px-2">
                Active Portal ({currentUser.role})
              </div>
              <button
                onClick={() => handleNav(getDashboardPath())}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenJudgeGuide();
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SIH Judge Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
