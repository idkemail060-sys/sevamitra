/**
 * SEVAMITRA - Authentication & Registration
 * SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { UserRole } from '../../types';
import { store, getStoreState, INITIAL_SERVICES } from '../../services/store';
import {
  ShieldCheck,
  User,
  Wrench,
  Key,
  Mail,
  Phone,
  MapPin,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess: (role: UserRole) => void;
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigate,
}) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState<UserRole>('HOUSEHOLD');

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('demo1234');
  const [locality, setLocality] = useState('Indiranagar');
  const [pincode, setPincode] = useState('560038');

  // Worker specific fields
  const [serviceCategory, setServiceCategory] = useState('Plumbing');
  const [experienceYears, setExperienceYears] = useState(4);
  const [skills, setSkills] = useState('Pipe Fitting, Drainage, Tap Repair');
  const [serviceAreas, setServiceAreas] = useState('Indiranagar, Domlur, HAL');
  const [isCoopMember, setIsCoopMember] = useState(true);

  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  const handleFastDemoLogin = (userId: string, targetRole: UserRole) => {
    store.setCurrentUser(userId);
    onSuccess(targetRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Demo auto-login based on selected role
      if (role === 'HOUSEHOLD') {
        store.setCurrentUser('u-ananya-sen');
      } else if (role === 'WORKER') {
        store.setCurrentUser('w-arjun-patel');
      } else {
        store.setCurrentUser('u-admin-rajeshwari');
      }
      onSuccess(role);
    } else {
      // Registration
      if (role === 'WORKER') {
        // Register new worker with PENDING status (as specified in Section 5)
        const newWorkerId = `w-new-${Date.now()}`;
        const newWorker = {
          id: newWorkerId,
          email: email || `worker.${Date.now()}@sevamitra.coop`,
          phone: phone || '+91 98000 11111',
          fullName: fullName || 'New Worker Applicant',
          role: 'WORKER' as UserRole,
          locality,
          pincode,
          serviceCategory,
          skills: skills.split(',').map((s) => s.trim()),
          experienceYears,
          serviceAreas: serviceAreas.split(',').map((s) => s.trim()),
          primaryPincode: pincode,
          verificationStatus: 'PENDING' as const,
          verificationNotes: 'Applicant uploaded KYC documents awaiting cooperative admin verification',
          rating: 5.0,
          ratingCount: 0,
          totalCompletedJobs: 0,
          jobsThisWeek: 0,
          isAvailable: true,
          isCooperativeMember: isCoopMember,
          cooperativeId: `APPLICANT-2026-${Math.floor(100 + Math.random() * 900)}`,
          cooperativeBranch: 'Bangalore East Workers Union Society',
          kycDocumentType: 'AADHAAR & RESIDENCY_PROOF',
          kycDocumentUrl: '/assets/docs/applicant_kyc.pdf',
          createdAt: new Date().toISOString(),
        };

        const state = getStoreState();
        if (state) {
          state.workers.push(newWorker);
          state.notifications.unshift({
            id: `notif-${Date.now()}`,
            userId: 'u-admin-rajeshwari',
            title: 'New Worker Applicant',
            message: `${newWorker.fullName} registered for ${newWorker.serviceCategory} in ${locality} (Awaiting KYC verification)`,
            type: 'SYSTEM',
            linkTarget: '/admin/verification',
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }

        store.setCurrentUser(newWorkerId);
        setRegistrationSubmitted(true);
        setTimeout(() => {
          onSuccess('WORKER');
        }, 1800);
      } else {
        // Household registration
        const newUserId = `u-new-${Date.now()}`;
        const newUser = {
          id: newUserId,
          email: email || `user.${Date.now()}@example.com`,
          phone: phone || '+91 99000 22222',
          fullName: fullName || 'New Household Client',
          role: 'HOUSEHOLD' as UserRole,
          locality,
          pincode,
          createdAt: new Date().toISOString(),
        };

        const state = getStoreState();
        if (state) {
          state.users.push(newUser);
        }

        store.setCurrentUser(newUserId);
        onSuccess('HOUSEHOLD');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          {isLogin ? 'Welcome Back to SevaMitra' : 'Join the SevaMitra Cooperative'}
        </h2>
        <p className="text-xs text-slate-500">
          Cooperative Gig Services Platform for Household & Community Services
        </p>
      </div>

      {/* Fast Demo Persona Shortcut for Judges */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 mb-6 shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Judge One-Click Demo Access</span>
          </span>
          <span className="text-[10px] text-slate-400">Instant Role Switch</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleFastDemoLogin('u-ananya-sen', 'HOUSEHOLD')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition"
          >
            <span className="text-[11px] font-bold text-emerald-300 block">Household</span>
            <span className="text-[10px] text-slate-300 truncate block">Ananya Sen</span>
          </button>
          <button
            type="button"
            onClick={() => handleFastDemoLogin('w-arjun-patel', 'WORKER')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition"
          >
            <span className="text-[11px] font-bold text-teal-300 block">Worker</span>
            <span className="text-[10px] text-slate-300 truncate block">Arjun Patel</span>
          </button>
          <button
            type="button"
            onClick={() => handleFastDemoLogin('u-admin-rajeshwari', 'ADMIN')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition"
          >
            <span className="text-[11px] font-bold text-purple-300 block">Admin</span>
            <span className="text-[10px] text-slate-300 truncate block">Rajeshwari Rao</span>
          </button>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Toggle Login vs Register */}
        <div className="flex p-1 rounded-xl bg-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setRegistrationSubmitted(false);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setRegistrationSubmitted(false);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              !isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            New Registration
          </button>
        </div>

        {registrationSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border-2 border-amber-300 animate-in zoom-in-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Worker Registration Received!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your profile is registered with status <strong>PENDING</strong>. As specified in SIH Section 5,
              cooperative admins will review your KYC documents before you appear in customer matching.
            </p>
            <span className="inline-block text-[11px] font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              Redirecting to Worker Portal...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('HOUSEHOLD')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                    role === 'HOUSEHOLD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Household</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('WORKER')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                    role === 'WORKER'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                    role === 'ADMIN'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar / Smt. Meera"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Email or Phone</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or +91 98450..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none pl-8"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Password or OTP</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none pl-8 font-mono"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Locality</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Indiranagar"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 560038"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Additional Worker Registration Fields (Section 5) */}
            {!isLogin && role === 'WORKER' && (
              <div className="space-y-3 pt-3 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Worker Skill & Cooperative Profile</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Service Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Cooperative Status</label>
                    <select
                      value={isCoopMember ? 'YES' : 'NO'}
                      onChange={(e) => setIsCoopMember(e.target.value === 'YES')}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="YES">Enrolled Member</option>
                      <option value="NO">New Applicant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Pipe Fitting, Sanitary, Tank..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Service Areas / Neighborhoods
                  </label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    placeholder="Indiranagar, Domlur, HAL..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
                  ℹ️ New registrations enter <strong>PENDING</strong> review. Only <strong>VERIFIED</strong> workers appear in customer matching results.
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{isLogin ? `Log in as ${role}` : `Register as ${role}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
