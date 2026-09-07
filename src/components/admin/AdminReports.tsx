/**
 * SEVAMITRA - Cooperative Analytics, Reports & Financial Transparency
 * Section 14 & 18 | SIH26089 | Team Techforge
 */

import React from 'react';
import { getStoreState } from '../../services/store';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  ShieldCheck,
  Scale,
  Users,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const state = getStoreState();

  const capturedTransactions = state.transactions.filter((tx) => tx.paymentStatus === 'CAPTURED');
  const totalGmv = capturedTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
  const platformRevenue = capturedTransactions.reduce((sum, tx) => sum + tx.platformFee, 0);
  const welfareBalance = capturedTransactions.reduce((sum, tx) => sum + tx.cooperativeFund, 0);
  const workerPayouts = capturedTransactions.reduce((sum, tx) => sum + tx.workerNetPayout, 0);

  // Group by service category
  const categoryStats: Record<string, { count: number; gmv: number }> = {};
  state.bookings.forEach((b) => {
    if (!categoryStats[b.serviceCategory]) {
      categoryStats[b.serviceCategory] = { count: 0, gmv: 0 };
    }
    categoryStats[b.serviceCategory].count += 1;
    if (b.paymentStatus === 'CAPTURED') {
      categoryStats[b.serviceCategory].gmv += b.quoteAmount;
    }
  });

  const handleExportCSV = () => {
    const csvRows = [
      ['Transaction ID', 'Booking ID', 'Worker', 'Gross Amount', 'Platform Fee (5%)', 'Coop Fund (2%)', 'Worker Net (93%)', 'Status', 'Date'],
      ...capturedTransactions.map((tx) => [
        tx.transactionCode,
        tx.bookingId,
        tx.workerName,
        tx.grossAmount,
        tx.platformFee,
        tx.cooperativeFund,
        tx.workerNetPayout,
        tx.paymentStatus,
        tx.createdAt,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sevamitra_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cooperative Audit & Analytics Reports</h2>
          <p className="text-xs text-slate-500">
            Transparent reporting of marketplace economics, worker payouts, and emergency welfare reserves
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform GMV</span>
          <div className="text-2xl font-black text-slate-900">₹{totalGmv}</div>
          <span className="text-[10px] text-slate-500 block">Total citizen expenditure</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Disbursed to Workers (93%)</span>
          <div className="text-2xl font-black text-emerald-700">₹{workerPayouts}</div>
          <span className="text-[10px] text-emerald-900 block">Net worker earnings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Welfare Fund Reserve (2%)</span>
          <div className="text-2xl font-black text-amber-600">₹{welfareBalance}</div>
          <span className="text-[10px] text-amber-900 block">Health & emergency corpus</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Platform Cost (5%)</span>
          <div className="text-2xl font-black text-slate-900">₹{platformRevenue}</div>
          <span className="text-[10px] text-slate-500 block">Operations & server infra</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Service Category Distribution & Volume</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Total Tasks Booked</th>
                <th className="p-3">Settled GMV</th>
                <th className="p-3">Worker Share (93%)</th>
                <th className="p-3">Welfare Share (2%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(categoryStats).map(([cat, stats]) => (
                <tr key={cat} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{cat}</td>
                  <td className="p-3">{stats.count} bookings</td>
                  <td className="p-3 font-semibold text-slate-900">₹{stats.gmv}</td>
                  <td className="p-3 text-emerald-700 font-bold">₹{Math.round(stats.gmv * 0.93)}</td>
                  <td className="p-3 text-amber-600 font-medium">₹{Math.round(stats.gmv * 0.02)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
