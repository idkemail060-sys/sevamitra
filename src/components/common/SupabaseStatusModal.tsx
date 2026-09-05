import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  testSupabaseConnection,
  seedLocalDataToSupabase,
  getSupabaseSyncStatus,
  subscribeToSupabaseSync,
  SupabaseSyncStatus,
} from '../../services/supabaseService';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SUPABASE_SQL_SCRIPT = `-- =============================================================================
-- SEVAMITRA COOPERATIVE PLATFORM - DATABASE SCHEMA FOR SUPABASE
-- Project ID: kzplzrzhzbdkcgpccmjo
-- Execute in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. BOOKINGS TABLE (Stores all household service requests, lifecycle & ratings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    booking_code TEXT UNIQUE NOT NULL,
    household_id TEXT NOT NULL,
    household_name TEXT NOT NULL,
    household_phone TEXT,
    household_address TEXT,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    worker_phone TEXT,
    worker_avatar TEXT,
    service_category TEXT NOT NULL,
    service_name TEXT NOT NULL,
    task_description TEXT,
    locality TEXT,
    pincode TEXT,
    scheduled_date TEXT NOT NULL,
    scheduled_time_slot TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED',
    match_score NUMERIC DEFAULT 0,
    fairness_bonus NUMERIC DEFAULT 0,
    quote_amount NUMERIC NOT NULL DEFAULT 0,
    platform_fee NUMERIC NOT NULL DEFAULT 0,
    cooperative_fund NUMERIC NOT NULL DEFAULT 0,
    worker_net_payout NUMERIC NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    payment_id TEXT,
    razorpay_order_id TEXT,
    rating_score NUMERIC,
    review_comment TEXT,
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE (Households, Clients & Cooperative Administrators)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT,
    phone TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'HOUSEHOLD',
    locality TEXT,
    pincode TEXT,
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKERS TABLE (Cooperative Members & Verified Artisans)
CREATE TABLE IF NOT EXISTS public.workers (
    id TEXT PRIMARY KEY,
    email TEXT,
    phone TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'WORKER',
    service_category TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    experience_years NUMERIC DEFAULT 0,
    service_areas TEXT[] DEFAULT '{}',
    primary_pincode TEXT,
    locality TEXT,
    pincode TEXT,
    verification_status TEXT NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT,
    rating NUMERIC DEFAULT 5.0,
    rating_count INTEGER DEFAULT 0,
    total_completed_jobs INTEGER DEFAULT 0,
    jobs_this_week INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    is_cooperative_member BOOLEAN DEFAULT true,
    cooperative_id TEXT,
    cooperative_branch TEXT,
    kyc_document_type TEXT,
    kyc_document_url TEXT,
    bio TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PAYMENT TRANSACTIONS TABLE (Audit log of transparent payouts)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id TEXT PRIMARY KEY,
    transaction_code TEXT,
    booking_id TEXT,
    booking_code TEXT,
    household_name TEXT,
    worker_id TEXT,
    worker_name TEXT,
    service_name TEXT,
    gross_amount NUMERIC NOT NULL DEFAULT 0,
    platform_fee NUMERIC NOT NULL DEFAULT 0,
    cooperative_fund NUMERIC NOT NULL DEFAULT 0,
    worker_earnings NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'UPI / Razorpay',
    razorpay_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES FOR APP ACCESS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access on workers" ON public.workers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access on payment_transactions" ON public.payment_transactions FOR ALL USING (true) WITH CHECK (true);

-- 6. ENABLE REALTIME SYNC (Optional: Live multi-tab updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
END $$;
`;

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql'>('sql');
  const [syncStatus, setSyncStatus] = useState<SupabaseSyncStatus>(getSupabaseSyncStatus());
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSupabaseSync((st) => setSyncStatus(st));
    return () => unsub();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setActionMessage(null);
    try {
      const res = await testSupabaseConnection();
      if (res.ok) {
        setActionMessage({ type: 'success', text: res.message });
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setActionMessage(null);
    try {
      const res = await seedLocalDataToSupabase();
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Supabase Database Integration
                  <Badge variant={syncStatus.isConnected ? 'success' : 'warning'} className="text-[10px] py-0 px-2">
                    {syncStatus.isConnected ? 'Connected' : 'Setup Required'}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Project: <span className="font-mono text-slate-700 font-semibold">{syncStatus.projectId}</span>
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('sql')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              1. SQL Commands to Run
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              2. Connection & Sync
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {actionMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                actionMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              )}
              <div className="leading-relaxed">{actionMessage.text}</div>
            </div>
          )}

          {activeTab === 'sql' ? (
            <div className="space-y-4">
              {/* Steps guide */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  How to run this in your Supabase project:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>
                    Click the <strong>Copy SQL Script</strong> button below.
                  </li>
                  <li>
                    Open your Supabase project dashboard{' '}
                    <a
                      href={`https://supabase.com/dashboard/project/${syncStatus.projectId}/sql/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      (Direct link to SQL Editor <ExternalLink className="w-3 h-3 inline" />)
                    </a>
                    .
                  </li>
                  <li>
                    Paste the commands in the editor and click <strong>Run</strong>.
                  </li>
                  <li>
                    Done! The <strong>bookings</strong>, <strong>users</strong>, and <strong>workers</strong> tables will be ready.
                  </li>
                </ol>
              </div>

              {/* Code block with copy button */}
              <div className="relative rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 border border-slate-800">
                <div className="sticky top-0 right-0 flex justify-end mb-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopySql}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-xs gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
                  </Button>
                </div>
                <pre>{SUPABASE_SQL_SCRIPT}</pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Credentials status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                    Project ID
                  </span>
                  <span className="font-mono font-bold text-slate-800">{syncStatus.projectId}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                    Endpoint URL
                  </span>
                  <span className="font-mono text-slate-800 truncate block">{syncStatus.url}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Data Synchronization Operations</span>
                  {syncStatus.lastSyncedAt && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      Last synced: {new Date(syncStatus.lastSyncedAt).toLocaleTimeString()}
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The app automatically sends new bookings, status transitions, payments, ratings, and user registrations directly to Supabase. You can also manually test the connection or push existing sample data.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="text-xs gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSeedData}
                    disabled={isSeeding}
                    className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <ArrowRight className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                    {isSeeding ? 'Pushing Data...' : 'Push All Demo Data to Supabase'}
                  </Button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Realtime updates are enabled. Changes made in Supabase will automatically reflect in the application!
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
          {activeTab === 'sql' && (
            <Button size="sm" onClick={handleCopySql} className="gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy SQL Script'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
