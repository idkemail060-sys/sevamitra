/**
 * SEVAMITRA - About Us & Team Techforge
 * Problem Statement: SIH26089 | Smart India Hackathon 2026
 * Institution: Acropolis Institute of Technology and Research
 *
 * NOTE: Sensitive personal data (Mobile Numbers and Enrollment Numbers)
 * are masked/censored in strict accordance with the user instructions.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  Sparkles,
  Users,
  Vote,
  Award,
  HeartHandshake,
  Mail,
  Phone,
  GraduationCap,
  Building,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  Code2,
  Layers,
} from 'lucide-react';
import { SevaMitraLogo, SevaMitraOfficialBadge } from '../common/Logo';

interface TeamMember {
  role: 'Team Leader' | 'Team Member';
  name: string;
  enrlNoMasked: string;
  dept: string;
  yearOfStudy: number;
  semester: number;
  gender: 'Male' | 'Female';
  email: string;
  mobileMasked: string;
  specialty: string;
  avatarBg: string;
}

export const AboutUsPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Team data carefully retrieved from the uploaded image with sensitive info censored
  const teamMembers: TeamMember[] = [
    {
      role: 'Team Leader',
      name: 'Pranay Goswami',
      enrlNoMasked: '0827CS25••••',
      dept: 'CSE',
      yearOfStudy: 2,
      semester: 3,
      gender: 'Male',
      email: 'pranaygoswami250734@acropolis.in',
      mobileMasked: '+91 ••••• •6677',
      specialty: 'System Architecture, Full-Stack Design & Matching Engine',
      avatarBg: 'from-indigo-600 to-blue-700',
    },
    {
      role: 'Team Member',
      name: 'Ojas Singh Sisodiya',
      enrlNoMasked: '0827CS25••••',
      dept: 'CSE',
      yearOfStudy: 2,
      semester: 3,
      gender: 'Male',
      email: 'ojassisodiya251487@acropolis.in',
      mobileMasked: '+91 ••••• •6497',
      specialty: 'Backend Database, Supabase Realtime & Security Rules',
      avatarBg: 'from-emerald-600 to-teal-700',
    },
    {
      role: 'Team Member',
      name: 'Pali Bisen',
      enrlNoMasked: '0827CS25••••',
      dept: 'CSE',
      yearOfStudy: 2,
      semester: 3,
      gender: 'Female',
      email: 'palibisen250280@acropolis.in',
      mobileMasked: '+91 ••••• •0602',
      specialty: 'Worker Empowerment & Cooperative Governance Logic',
      avatarBg: 'from-rose-600 to-pink-700',
    },
    {
      role: 'Team Member',
      name: 'Nitya Jain',
      enrlNoMasked: '0827CS25••••',
      dept: 'CSE',
      yearOfStudy: 2,
      semester: 3,
      gender: 'Female',
      email: 'nityajain250316@acropolis.in',
      mobileMasked: '+91 ••••• •7948',
      specialty: 'Frontend UI/UX, Responsive Layouts & Accessibility',
      avatarBg: 'from-purple-600 to-indigo-700',
    },
    {
      role: 'Team Member',
      name: 'Anshika Rahangdale',
      enrlNoMasked: '0827CS25••••',
      dept: 'CSE',
      yearOfStudy: 2,
      semester: 3,
      gender: 'Female',
      email: 'anshikarahangdale250277@acropolis.in',
      mobileMasked: '+91 ••••• •8370',
      specialty: 'KYC Verification & Grievance Redressal Architecture',
      avatarBg: 'from-amber-600 to-orange-700',
    },
    {
      role: 'Team Member',
      name: 'Purva Bisen',
      enrlNoMasked: '0827CS25••••',
      dept: 'CSE',
      yearOfStudy: 2,
      semester: 3,
      gender: 'Female',
      email: 'purvabisen250393@acropolis.in',
      mobileMasked: '+91 ••••• •0296',
      specialty: 'Transparent Payment Engine & Razorpay Sandbox Integration',
      avatarBg: 'from-teal-600 to-emerald-700',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Header Banner */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-1">
          <SevaMitraOfficialBadge size="sm" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Smart India Hackathon 2026 • Problem ID: SIH26089</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          About Us & Team Techforge
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          We are <strong>Team Techforge</strong> from the <strong>Department of Computer Science & Engineering (CSE)</strong> at{' '}
          <strong>Acropolis Institute of Technology and Research</strong>. We built <strong>SevaMitra</strong>—a fair,
          transparent, worker-owned digital cooperative platform replacing exploitative gig monopolies.
        </p>

        {/* Institution & Team Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            Acropolis Institute of Technology and Research
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            B.Tech CSE • 2nd Year (Semester 3)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            6 Core Innovators
          </span>
        </div>
      </div>

      {/* 2. Privacy Censorship Compliance Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Privacy Masking Active
            </h3>
            <p className="text-xs text-amber-800/90 leading-relaxed mt-0.5">
              Personal contact numbers and university enrollment IDs are masked (<code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">••••</code>) to prevent unauthorized public disclosure.
            </p>
          </div>
        </div>

        {/* View Switcher: Cards vs Table */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-amber-200 shadow-2xs shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('CARDS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'CARDS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Card Profiles
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'TABLE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Roster Table
          </button>
        </div>
      </div>

      {/* 3. Team Roster (Cards or Table) */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-xs hover:shadow-md flex flex-col justify-between ${
                member.role === 'Team Leader'
                  ? 'border-indigo-300 ring-1 ring-indigo-200/70'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Avatar and Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.avatarBg} text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0`}
                    >
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-500">{member.dept} • Semester {member.semester}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      member.role === 'Team Leader'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                {/* Academic & Specialty Details */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-700">{member.dept} (Year {member.yearOfStudy})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Gender:</span>
                    <span className="font-semibold text-slate-700">{member.gender}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-500" />
                      Enrollment No:
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {member.enrlNoMasked}
                    </span>
                  </div>
                </div>

                {/* Contact Information with Privacy Masking */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <a
                      href={`mailto:${member.email}`}
                      className="truncate hover:text-indigo-600 transition"
                      title={member.email}
                    >
                      {member.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-mono text-slate-700">
                      {member.mobileMasked}
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                      Censored
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialization Note */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                {member.specialty}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Table View (Exactly matching the image's structure with responsive horizontal scroll) */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">
              Official Team Roster • SIH26089
            </h3>
            <span className="text-xs text-slate-500">
              Department of CSE • Acropolis Institute
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Role</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Name</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Enrl. No.</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Dept.</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Year</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Sem</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Gender</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Email ID</th>
                  <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Mobile No.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teamMembers.map((member, index) => (
                  <tr
                    key={member.name}
                    className={index % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/50 hover:bg-slate-100/60'}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                          member.role === 'Team Leader'
                            ? 'bg-indigo-100 text-indigo-800 font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {member.enrlNoMasked}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-medium">
                      {member.dept}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap text-center">
                      {member.yearOfStudy}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap text-center">
                      {member.semester}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {member.gender}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap text-[11px]">
                      <a href={`mailto:${member.email}`} className="text-indigo-600 hover:underline">
                        {member.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap text-[11px]">
                      <span className="text-slate-800 font-bold">{member.mobileMasked}</span>
                      <span className="ml-1.5 text-[9px] text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                        Masked
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Cooperative Platform Mission & Architecture */}
      <div className="border-t border-slate-200 pt-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Why We Built SevaMitra
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Addressing Problem Statement SIH26089 with democratic cooperative governance and fair worker compensation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">93% Worker Earnings</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traditional aggregators take 25% to 35% commission. SevaMitra keeps platform fees capped at 5% with 2% saved into a worker emergency welfare fund.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Vote className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">One Worker, One Vote</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Platform rules, minimum service rates, and dispute resolution guidelines are decided through transparent on-chain/digital cooperative referendums.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Fair Smart Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our matching algorithm incorporates a fairness bonus so that every verified worker gets an equal opportunity rather than funneling all jobs to a tiny elite.
            </p>
          </div>
        </div>

        {/* CTA Banner to Explore Platform */}
        {onNavigate && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold">
                Experience the Cooperative Platform
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Book a service, inspect worker compensation breakdowns, or explore cooperative governance votes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('/services')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center gap-1.5"
              >
                <span>Find Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
              >
                Sign In to Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
