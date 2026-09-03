/**
 * SEVAMITRA - A Cooperative Digital Platform for Household & Community Services
 * Smart India Hackathon 2026 | Problem Statement ID: SIH26089 | Team Techforge
 *
 * Full Production Architecture:
 * - Reactive Local & Realtime Event State
 * - Smart Matching Engine & Fair Rotation Algorithm
 * - 93% Transparent Worker Payout & 2% Welfare Fund
 * - Democratic Cooperative Governance (1 Worker 1 Vote)
 * - Razorpay Test Mode Payment Gateway with Audit Ledger
 * - Judge Evaluation Interactive Tour & Persona Switcher
 */

import React, { useState, useEffect } from 'react';
import { store, subscribeToStore } from './services/store';
import { Booking, UserRole } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { JudgeWalkthroughGuide } from './components/common/JudgeWalkthroughGuide';
import { RazorpayModal } from './components/common/RazorpayModal';
import { RatingModal } from './components/common/RatingModal';
import { AboutCooperative } from './components/common/AboutCooperative';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';

// Household Components
import { HouseholdDashboard } from './components/household/HouseholdDashboard';
import { ServiceBookingFlow } from './components/household/ServiceBookingFlow';
import { HouseholdBookings } from './components/household/HouseholdBookings';
import { HouseholdPayments } from './components/household/HouseholdPayments';

// Worker Components
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { WorkerRequests } from './components/worker/WorkerRequests';
import { WorkerEarnings } from './components/worker/WorkerEarnings';
import { WorkerGovernance } from './components/worker/WorkerGovernance';
import { WorkerGrievances } from './components/worker/WorkerGrievances';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminVerification } from './components/admin/AdminVerification';
import { AdminWorkers } from './components/admin/AdminWorkers';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminGovernance } from './components/admin/AdminGovernance';
import { AdminReports } from './components/admin/AdminReports';
import { AdminGrievances } from './components/admin/AdminGrievances';

export default function App() {
  // Reactive Store State sync
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setTick((t) => t + 1);
    });
    return () => unsubscribe();
  }, []);

  // Router State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [activeServiceCategory, setActiveServiceCategory] = useState<string>('Plumbing');

  // Modals State
  const [isJudgeGuideOpen, setIsJudgeGuideOpen] = useState(false);
  const [activePaymentBooking, setActivePaymentBooking] = useState<Booking | null>(null);
  const [activeRatingBooking, setActiveRatingBooking] = useState<Booking | null>(null);

  const currentUser = store.getCurrentUser();
  const state = store.getStoreState ? store.getStoreState() : null;

  // Real-time Event Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    const handleStoreEvent = (e: any) => {
      if (e?.detail?.message) {
        setToastMessage(e.detail.message);
        setTimeout(() => setToastMessage(null), 4000);
      }
    };
    window.addEventListener('sevamitra-event', handleStoreEvent);
    return () => window.removeEventListener('sevamitra-event', handleStoreEvent);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChanged = (newRole: UserRole) => {
    if (newRole === 'HOUSEHOLD') {
      setCurrentPath('/household/dashboard');
    } else if (newRole === 'WORKER') {
      setCurrentPath('/worker/dashboard');
    } else if (newRole === 'ADMIN') {
      setCurrentPath('/admin/dashboard');
    }
  };

  const handleInitiateBooking = (serviceCategory?: string) => {
    if (serviceCategory) {
      setActiveServiceCategory(serviceCategory);
    }
    setCurrentPath('/household/services');
  };

  // Determine pending counts for badges
  const pendingRequestsCount =
    currentUser && currentUser.role === 'WORKER' && state
      ? state.bookings.filter((b) => b.workerId === currentUser.id && b.status === 'REQUESTED').length
      : 0;

  const pendingVerificationCount =
    state ? state.workers.filter((w) => w.verificationStatus === 'PENDING').length : 0;

  const isDashboardView =
    currentPath.startsWith('/household') ||
    currentPath.startsWith('/worker') ||
    currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Persistent Top Persona Switcher for SIH Evaluators */}
      <DemoSwitcher
        onOpenJudgeGuide={() => setIsJudgeGuideOpen(true)}
        onRoleChanged={handleRoleChanged}
      />

      {/* 2. Global Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenJudgeGuide={() => setIsJudgeGuideOpen(true)}
      />

      {/* Realtime Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-right duration-200 max-w-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <p className="leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* 3. Main Body Content */}
      <div className="flex-1 flex flex-col">
        {isDashboardView && currentUser ? (
          /* Dashboard Layout with Role-based Sidebar */
          <div className="flex-1 max-w-7xl w-full mx-auto flex">
            <Sidebar
              role={currentUser.role}
              currentPath={currentPath}
              onNavigate={handleNavigate}
              pendingRequestsCount={pendingRequestsCount}
              pendingVerificationCount={pendingVerificationCount}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
              {/* HOUSEHOLD VIEWS */}
              {currentUser.role === 'HOUSEHOLD' && (
                <>
                  {currentPath === '/household/dashboard' && (
                    <HouseholdDashboard
                      onNavigate={handleNavigate}
                      onInitiateBooking={handleInitiateBooking}
                      onOpenPaymentModal={(b) => setActivePaymentBooking(b)}
                      onOpenRatingModal={(b) => setActiveRatingBooking(b)}
                    />
                  )}

                  {currentPath === '/household/services' && (
                    <ServiceBookingFlow
                      initialServiceCategory={activeServiceCategory}
                      onBookingCreated={() => handleNavigate('/household/bookings')}
                      onCancel={() => handleNavigate('/household/dashboard')}
                    />
                  )}

                  {currentPath === '/household/bookings' && (
                    <HouseholdBookings
                      onOpenPaymentModal={(b) => setActivePaymentBooking(b)}
                      onOpenRatingModal={(b) => setActiveRatingBooking(b)}
                      onInitiateNewBooking={() => handleInitiateBooking()}
                    />
                  )}

                  {currentPath === '/household/payments' && <HouseholdPayments />}

                  {(currentPath === '/household/profile' || currentPath === '/household/notifications') && (
                    <HouseholdDashboard
                      onNavigate={handleNavigate}
                      onInitiateBooking={handleInitiateBooking}
                      onOpenPaymentModal={(b) => setActivePaymentBooking(b)}
                      onOpenRatingModal={(b) => setActiveRatingBooking(b)}
                    />
                  )}
                </>
              )}

              {/* WORKER VIEWS */}
              {currentUser.role === 'WORKER' && (
                <>
                  {currentPath === '/worker/dashboard' && (
                    <WorkerDashboard onNavigate={handleNavigate} />
                  )}

                  {(currentPath === '/worker/requests' || currentPath === '/worker/bookings') && (
                    <WorkerRequests />
                  )}

                  {currentPath === '/worker/earnings' && <WorkerEarnings />}

                  {currentPath === '/worker/governance' && <WorkerGovernance />}

                  {currentPath === '/worker/grievances' && <WorkerGrievances />}

                  {(currentPath === '/worker/availability' || currentPath === '/worker/profile') && (
                    <WorkerDashboard onNavigate={handleNavigate} />
                  )}
                </>
              )}

              {/* ADMIN VIEWS */}
              {currentUser.role === 'ADMIN' && (
                <>
                  {currentPath === '/admin/dashboard' && (
                    <AdminDashboard onNavigate={handleNavigate} />
                  )}

                  {currentPath === '/admin/verification' && <AdminVerification />}

                  {currentPath === '/admin/workers' && <AdminWorkers />}

                  {currentPath === '/admin/settings' && <AdminSettings />}

                  {currentPath === '/admin/governance' && <AdminGovernance />}

                  {currentPath === '/admin/reports' && <AdminReports />}

                  {currentPath === '/admin/grievances' && <AdminGrievances />}

                  {(currentPath === '/admin/bookings' || currentPath === '/admin/payments') && (
                    <AdminReports />
                  )}
                </>
              )}
            </main>
          </div>
        ) : (
          /* Public / Marketing / Auth Views */
          <main className="flex-1">
            {currentPath === '/' && (
              <LandingPage
                onNavigate={handleNavigate}
                onOpenJudgeGuide={() => setIsJudgeGuideOpen(true)}
              />
            )}

            {currentPath === '/about' && <AboutCooperative />}

            {currentPath === '/services' && (
              <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <ServiceBookingFlow
                  initialServiceCategory="Plumbing"
                  onBookingCreated={() => handleNavigate('/household/bookings')}
                  onCancel={() => handleNavigate('/')}
                />
              </div>
            )}

            {(currentPath === '/login' || currentPath === '/register') && (
              <AuthPage
                initialMode={currentPath === '/login' ? 'login' : 'register'}
                onSuccess={handleRoleChanged}
                onNavigate={handleNavigate}
              />
            )}
          </main>
        )}
      </div>

      {/* Clean Minimalism System Status Footer (SIH 2026 Official) */}
      <footer className="h-10 bg-slate-900 text-slate-400 flex items-center justify-between px-4 sm:px-8 text-[10px] font-medium shrink-0 border-t border-slate-800 z-30">
        <div className="flex items-center gap-3 sm:gap-4 uppercase tracking-widest">
          <span className="font-bold text-slate-300">SIH-2026 OFFICIAL ENTRY</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:block"></span>
          <span className="hidden sm:inline">TEAM TECHFORGE</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SYSTEM ONLINE</span>
          </span>
          <span className="text-indigo-400 hidden md:inline">SANDBOX MODE ACTIVE</span>
          <span className="text-slate-500 font-mono hidden sm:inline">INDIA-NORTH-1</span>
        </div>
      </footer>

      {/* 4. Hackathon Judge Evaluation Guide Modal (Section 33) */}
      <JudgeWalkthroughGuide
        isOpen={isJudgeGuideOpen}
        onClose={() => setIsJudgeGuideOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 5. Razorpay Sandbox Test Payment Modal */}
      <RazorpayModal
        isOpen={!!activePaymentBooking}
        booking={activePaymentBooking}
        onClose={() => setActivePaymentBooking(null)}
        onPaymentSuccess={() => {
          // Stay on booking or refresh
        }}
      />

      {/* 6. Rating & Feedback Modal */}
      <RatingModal
        isOpen={!!activeRatingBooking}
        booking={activeRatingBooking}
        onClose={() => setActiveRatingBooking(null)}
        onRatingSubmitted={() => {
          // Refreshed
        }}
      />
    </div>
  );
}
