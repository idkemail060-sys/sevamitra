/**
 * SEVAMITRA - Household Payment Ledger & Receipts
 * Section 11 & 16 | SIH26089 | Team Techforge
 */

import React from 'react';
import { getStoreState } from '../../services/store';
import { Receipt, Download, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

export const HouseholdPayments: React.FC = () => {
  const state = getStoreState();

  const householdBookings = state.bookings.filter(
    (b) => b.householdId === state.currentUserId
  );

  const paymentTransactions = state.transactions.filter((tx) =>
    householdBookings.some((b) => b.id === tx.bookingId)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Payment History & Tax Invoices</h2>
        <p className="text-xs text-slate-500">
          All digital payments processed via Razorpay Test Sandbox with transparent cooperative splits
        </p>
      </div>

      {paymentTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No payment records found</h3>
          <p className="text-xs text-slate-500">
            Completed service payments will generate permanent cooperative audit receipts here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentTransactions.map((tx) => {
            const booking = householdBookings.find((b) => b.id === tx.bookingId);
            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {tx.transactionCode || tx.bookingCode}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ● {tx.paymentStatus || tx.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {booking?.serviceName || 'Household Service'}
                    </h4>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black text-slate-900">₹{tx.grossAmount}</span>
                    <span className="text-[11px] text-slate-500 block">
                      Paid via {tx.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Cooperative Fee Breakdown */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Transparent Cooperative Fee Distribution
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Gross Paid:</span>
                      <span className="font-bold text-slate-900">₹{tx.grossAmount}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Platform Operations (5%):</span>
                      <span className="font-medium text-rose-600">₹{tx.platformFee}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Worker Welfare Fund (2%):</span>
                      <span className="font-medium text-amber-600">₹{tx.cooperativeFund}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Worker Payout (93%):</span>
                      <span className="font-bold text-emerald-700">₹{tx.workerNetPayout || tx.workerEarnings}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Processed on {new Date(tx.createdAt || tx.timestamp).toLocaleString()}</span>
                  <span className="font-mono text-[10px]">Gateway ID: {tx.razorpayPaymentId || 'pay_test_sandboxed'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
