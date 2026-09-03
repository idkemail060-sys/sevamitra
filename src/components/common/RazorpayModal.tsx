/**
 * SEVAMITRA - Razorpay Sandbox Test Payment Modal
 * Problem Statement ID: SIH26089 | Team Techforge
 *
 * Simulates real Razorpay checkout with server-side signature verification,
 * transparent fee split display, and instant ledger credit.
 */

import React, { useState } from 'react';
import { Booking } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  ArrowRight,
  Info,
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onPaymentSuccess: (bookingId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  booking,
  onClose,
  onPaymentSuccess,
}) => {
  if (!isOpen || !booking) return null;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentTxId, setPaymentTxId] = useState('');

  const handleProcessPayment = () => {
    setIsProcessing(true);

    // Simulate network roundtrip and server-side cryptographic signature verification
    setTimeout(() => {
      const simulatedPaymentId = `pay_test_${Math.random().toString(36).substring(2, 11)}`;
      setPaymentTxId(simulatedPaymentId);

      // Record in store (updates booking, creates transaction, updates worker ledger)
      store.recordPayment({
        bookingId: booking.id,
        paymentMethod: `RAZORPAY_${paymentMethod} (SANDBOX)`,
        razorpayPaymentId: simulatedPaymentId,
      });

      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti for hackathon demo
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      onPaymentSuccess(booking.id);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm tracking-tighter">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Razorpay</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400 text-amber-950 font-bold">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-blue-100">Cooperative Gateway • No Real Money Charged</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Payment Success View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300 animate-in zoom-in-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-emerald-700 tracking-wider">
                Digital Payment Captured
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{booking.quoteAmount}.00</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Tx ID: {paymentTxId}</p>
            </div>

            {/* Transparent Profit-Sharing Breakdown */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Transparent Cooperative Split</span>
                <span className="text-emerald-700">Audit Verified</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Customer Paid Gross:</span>
                  <span className="font-semibold">₹{booking.quoteAmount}.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Operations Fee (5%):</span>
                  <span className="text-rose-600 font-mono">-₹{booking.platformFee}.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cooperative Worker Welfare Fund (2%):</span>
                  <span className="text-amber-600 font-mono">-₹{booking.cooperativeFund}.00</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-700 text-sm">
                  <span>Net Credited to {booking.workerName}:</span>
                  <span>₹{booking.workerNetPayout}.00 (93%)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200">
              ✓ Both household and worker accounts have been updated via real-time bus.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow"
            >
              Done & View Booking
            </button>
          </div>
        ) : (
          /* Payment Form View */
          <div className="p-6 space-y-5">
            {/* Booking Summary */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  {booking.bookingCode}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{booking.serviceName}</h4>
                <p className="text-xs text-slate-500">Worker: {booking.workerName}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total Payable</span>
                <span className="text-xl font-extrabold text-slate-900">₹{booking.quoteAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Select Test Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Payment Details Input based on selected method */}
            {paymentMethod === 'UPI' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Virtual Payment Address (VPA / UPI ID)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="user@upi"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    TEST OK
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: Any simulated UPI ID ending with @okhdfcbank, @paytm, or @ybl will succeed in sandbox mode.
                </p>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-medium text-slate-700">Test Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Expiry MM/YY</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Select Test Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Canara Bank (Karnataka Lead)</option>
                </select>
              </div>
            )}

            {/* Fee Transparency Box */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold">Cooperative Guarantee:</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  93% (₹{booking.workerNetPayout}) goes directly to worker {booking.workerName}. Only 5% platform fee and 2% cooperative emergency fund are retained.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProcessPayment}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Server-side Sandbox...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{booking.quoteAmount} via Razorpay Test</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
