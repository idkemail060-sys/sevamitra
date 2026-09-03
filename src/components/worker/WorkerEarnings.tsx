/**
 * SEVAMITRA - Transparent Worker Earnings & Cooperative Ledger
 * Section 11 & 14 | SIH26089 | Team Techforge
 */

import React, { useState } from 'react';
import { store, getStoreState } from '../../services/store';
import {
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wallet,
  Building,
  Scale,
} from 'lucide-react';

export const WorkerEarnings: React.FC = () => {
  const state = getStoreState();
  const currentWorker = state.workers.find((w) => w.id === state.currentUserId);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  if (!currentWorker) return null;

  // Filter transactions for this worker
  const workerTransactions = state.transactions.filter(
    (tx) => tx.workerId === currentWorker.id
  );

  const capturedTransactions = workerTransactions.filter(
    (tx) => tx.paymentStatus === 'CAPTURED'
  );

  const totalGross = capturedTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const totalPlatformFee = capturedTransactions.reduce((sum, tx) => sum + tx.platformFee, 0);
  const totalCoopFund = capturedTransactions.reduce((sum, tx) => sum + tx.cooperativeFund, 0);
  const totalNet = capturedTransactions.reduce((sum, tx) => sum + tx.workerNetPayout, 0);

  // Traditional Corporate Gig Platform comparison (takes 30%)
  const corporateDeductions = Math.round(totalGross * 0.3);
  const corporateWorkerPayout = totalGross - corporateDeductions;
  const cooperativeExtraSaved = totalNet - corporateWorkerPayout;

  const handleSimulateWithdrawal = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transparent Earnings Ledger</h2>
          <p className="text-xs text-slate-500">
            Audit-grade itemized receipts • 93% direct worker payout • Zero hidden commissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateWithdrawal}
            disabled={isWithdrawing || totalNet === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            <span>{isWithdrawing ? 'Processing Payout...' : 'Instant Bank Payout'}</span>
          </button>
        </div>
      </div>

      {withdrawSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Payout of ₹{totalNet} transferred directly to registered Bank Account ending in 9402 via IMPS!</span>
        </div>
      )}

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Customer Gross
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">₹{totalGross}</span>
            <span className="text-[11px] text-slate-400">100%</span>
          </div>
          <p className="text-[10px] text-slate-400">Total invoice value paid by households</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Operations (5%)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 font-mono">₹{totalPlatformFee}</span>
            <span className="text-[11px] text-slate-400">5.0%</span>
          </div>
          <p className="text-[10px] text-slate-400">Server, hosting, SMS and payment gateway</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Cooperative Reserve (2%)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 font-mono">₹{totalCoopFund}</span>
            <span className="text-[11px] text-slate-400">2.0%</span>
          </div>
          <p className="text-[10px] text-slate-400">Worker health insurance & tool subsidies</p>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Your Net Credited (93%)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">₹{totalNet}</span>
            <span className="text-[11px] font-bold text-emerald-800">93.0%</span>
          </div>
          <p className="text-[10px] text-emerald-900">Withdrawable immediately to your bank</p>
        </div>
      </div>

      {/* Comparative Analysis: Cooperative vs Corporate Gig Platform */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Cooperative Advantage Analysis
            </span>
            <h3 className="text-lg font-bold">How Much More You Kept with SevaMitra</h3>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Extra Worker Livelihood Saved</span>
            <span className="text-2xl font-black text-emerald-400">+₹{cooperativeExtraSaved}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="flex justify-between font-bold text-slate-300">
              <span>Corporate Gig Model (30% Extraction)</span>
              <span className="text-rose-400">₹{corporateWorkerPayout} net</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <p className="text-[11px] text-slate-400">
              Corporate platforms deduct ~30% for executive salaries & venture capital investors.
            </p>
          </div>

          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/50 space-y-2">
            <div className="flex justify-between font-bold text-emerald-300">
              <span>SevaMitra Cooperative (93% Net Direct)</span>
              <span className="text-emerald-400 font-black">₹{totalNet} net</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '93%' }} />
            </div>
            <p className="text-[11px] text-emerald-200">
              Cooperative retains only 5% operations and 2% for your union’s welfare fund.
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Job-by-Job Transparent Audit Ledger</h3>
          <span className="text-xs text-slate-500">{capturedTransactions.length} Settled Transactions</span>
        </div>

        {capturedTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No completed paid jobs yet. Once a household pays via Razorpay Sandbox, the audit split appears here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Tx Code</th>
                  <th className="p-3.5">Customer / Service</th>
                  <th className="p-3.5">Customer Gross</th>
                  <th className="p-3.5">Platform Fee (5%)</th>
                  <th className="p-3.5">Coop Fund (2%)</th>
                  <th className="p-3.5 text-emerald-700 font-bold">Your Net (93%)</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {capturedTransactions.map((tx) => {
                  const booking = state.bookings.find((b) => b.id === tx.bookingId);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-[11px] text-slate-600 font-medium">
                        {tx.transactionCode}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{booking?.serviceName || 'Task'}</span>
                        <span className="text-slate-500 text-[11px]">{booking?.householdName}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900">₹{tx.grossAmount}</td>
                      <td className="p-3.5 font-mono text-rose-600">-₹{tx.platformFee}</td>
                      <td className="p-3.5 font-mono text-amber-600">-₹{tx.cooperativeFund}</td>
                      <td className="p-3.5 font-bold text-emerald-700 text-sm">₹{tx.workerNetPayout}</td>
                      <td className="p-3.5">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {tx.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
