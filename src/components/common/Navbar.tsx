/**
 * SEVAMITRA - Primary Navigation Bar
 * SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store } from '../../services/store';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SevaMitraLogo } from './Logo';
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
  Camera,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenJudgeGuide: () => void;
  onOpenSupabaseModal?: () => void;
  onOpenProfilePictureModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenJudgeGuide,
  onOpenProfilePictureModal,
}) => {
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
          {/* Brand Logo with Redesigned SevaMitra Vector Emblem */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <SevaMitraLogo size="sm" showSubtitle={true} />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('/')}
              className={`transition py-1.5 cursor-pointer ${
                currentPath === '/' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-emerald-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/services')}
              className={`transition py-1.5 cursor-pointer ${
                currentPath.includes('/services') ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-emerald-700'
              }`}
            >
              Find Services
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`transition py-1.5 cursor-pointer flex items-center gap-1.5 ${
                currentPath === '/about' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : 'hover:text-emerald-700'
              }`}
            >
              <span>About Us</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Team</span>
            </button>

            {currentUser && (
              <button
                onClick={() => handleNav(getDashboardPath())}
                className={`transition py-1.5 flex items-center gap-1.5 cursor-pointer ${
                  currentPath.includes('/dashboard') || currentPath.includes(currentUser.role.toLowerCase())
                    ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                    : 'hover:text-indigo-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Area - Supabase button hidden from user view */}
          <div className="flex items-center gap-3">
            {currentUser && <NotificationBell onNavigate={onNavigate} />}

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <button
                  onClick={() => handleNav(getDashboardPath())}
                  className="text-right hidden sm:block group focus:outline-none cursor-pointer"
                  title="View Dashboard"
                >
                  <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {currentUser.role === 'HOUSEHOLD' ? 'Household Account' : currentUser.role === 'WORKER' ? 'Co-op Worker' : 'Co-op Admin'}
                  </p>
                </button>

                <div className="relative group">
                  <button
                    onClick={onOpenProfilePictureModal || (() => handleNav(getDashboardPath()))}
                    className="relative rounded-full focus:outline-none ring-2 ring-transparent hover:ring-emerald-500 transition cursor-pointer"
                    title="Change Profile Picture (Camera / Upload)"
                  >
                    <Avatar className="w-9 h-9 border border-slate-200 shadow-2xs">
                      {currentUser.avatarUrl ? (
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold text-xs">
                        {currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs border border-white">
                      <Camera className="w-2.5 h-2.5" />
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    store.setCurrentUser('');
                    handleNav('/login');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Sign out to Login Screen"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNav('/login')}
                  className="text-xs font-semibold cursor-pointer"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleNav('/login')}
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
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
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 flex items-center justify-between min-h-[44px]"
          >
            <span>About Us (Team Techforge)</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Team</span>
          </button>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold px-2">
                Active Portal ({currentUser.role})
              </div>
              <button
                onClick={() => handleNav(getDashboardPath())}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 flex items-center gap-2 min-h-[44px]"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>Go to Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenProfilePictureModal) onOpenProfilePictureModal();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 min-h-[44px]"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Update Profile Picture (Camera / Upload)</span>
              </button>
              <button
                onClick={() => {
                  store.setCurrentUser('');
                  handleNav('/login');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out to Login Screen</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => handleNav('/login')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2 min-h-[44px]"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Sign In / Enter Portal</span>
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
