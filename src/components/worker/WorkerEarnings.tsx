/**
 * SEVAMITRA - Transparent Worker Earnings & Cooperative Ledger
 * Section 11 & 14 | SIH26089 | Team Techforge
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown,
  X,
} from 'lucide-react';

const officialLogoImg = '/sevamitra_logo.png';

export const WorkerEarnings: React.FC = () => {
  const state = getStoreState();
  const currentWorker = state.workers.find((w) => w.id === state.currentUserId);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFormatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  /**
   * Helper: Generate structured CSV earnings report
   */
  const handleDownloadCSV = () => {
    setIsFormatDropdownOpen(false);
    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const csvRows: string[] = [
      '========================================================================================',
      'SEVAMITRA COOPERATIVE - WORKER EARNINGS & AUDIT SUMMARY STATEMENT',
      'Motto: "Together • Serve • Empower" | Problem Statement ID: SIH26089',
      'Issued by: SevaMitra Digital Cooperative Society (Dept. of CSE, AITR)',
      '========================================================================================',
      '',
      '--- COOPERATIVE WORKER PROFILE ---',
      `"Worker Name","${currentWorker.fullName}"`,
      `"Worker ID","${currentWorker.id}"`,
      `"Primary Trade / Skills","${currentWorker.skills.join(', ')}"`,
      `"Service Territory","${currentWorker.locality}, Bangalore (Pincode: ${currentWorker.pincode})"`,
      `"Cooperative Standing","Active Cooperative Member (Voting Equity Shareholder)"`,
      `"Member Rating","${currentWorker.rating} / 5.0 (${currentWorker.ratingCount || 0} verified reviews)"`,
      `"Payout Bank Account","State Bank of India (A/C ending in ••••9402 via IMPS)"`,
      `"Report Generation Date","${timestampStr}"`,
      '',
      '--- EXECUTIVE FINANCIAL SUMMARY (93% COOPERATIVE PAYOUT POLICY) ---',
      '"Metric Description","Amount (INR)","Percentage (%)","Cooperative Audit Notes"',
      `"Total Customer Gross Invoiced",${totalGross},"100.0%","100% of fair service fee collected from household"`,
      `"Platform Operations Fee",${totalPlatformFee},"5.0%","Low-overhead digital maintenance (Servers, SMS alerts, UPI fees)"`,
      `"Cooperative Mutual Aid Fund",${totalCoopFund},"2.0%","Community welfare (Worker health insurance & tool subsidies)"`,
      `"Worker Net Take-Home Payout",${totalNet},"93.0%","Directly credited to worker with zero corporate commissions"`,
      `"Traditional Corporate Gig Deductions (30%)",${corporateDeductions},"30.0%","Extractive commission taken by corporate monopolies"`,
      `"Cooperative Net Advantage (Extra Saved)",+${cooperativeExtraSaved},"+23.0%","Extra livelihood kept in worker hands through cooperative ownership"`,
      '',
      '--- ITEMIZED JOB-BY-JOB AUDIT LEDGER ---',
      '"Transaction Code","Date & Time","Service Task","Customer Household","Gross Invoiced (INR)","Platform Fee (5%) (INR)","Coop Reserve (2%) (INR)","Net Worker Credit (93%) (INR)","Payment Status","Payment Mode"',
    ];

    if (capturedTransactions.length === 0) {
      csvRows.push('"N/A","N/A","No settled transactions in this statement period","N/A",0,0,0,0,"PENDING","N/A"');
    } else {
      capturedTransactions.forEach((tx) => {
        const booking = state.bookings.find((b) => b.id === tx.bookingId);
        const txDate = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN') : '2026-09-05';
        const serviceName = booking?.serviceName ? `"${booking.serviceName.replace(/"/g, '""')}"` : '"General Service"';
        const householdName = booking?.householdName ? `"${booking.householdName.replace(/"/g, '""')}"` : '"Neighborhood Household"';
        csvRows.push(
          `"${tx.transactionCode}","${txDate}",${serviceName},${householdName},${tx.grossAmount},-${tx.platformFee},-${tx.cooperativeFund},${tx.workerNetPayout},"${tx.paymentStatus}","${tx.paymentMethod || 'UPI / Razorpay'}"`
        );
      });
    }

    csvRows.push('');
    csvRows.push('========================================================================================');
    csvRows.push('"DISCLAIMER: This electronic statement is generated pursuant to the SevaMitra Model Cooperative Bylaws."');
    csvRows.push('"All disbursements conform to Section 11 transparent pricing and Section 14 cooperative mutual aid rules."');
    csvRows.push('========================================================================================');

    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = currentWorker.fullName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `SevaMitra_Earnings_Report_${safeName}_${dateStr}.csv`;

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Report downloaded: ${fileName}`);
    setTimeout(() => setDownloadSuccessMessage(null), 5000);
  };

  /**
   * Helper: Generate and download formal printable HTML payslip/statement
   */
  const handleDownloadHTML = () => {
    setIsFormatDropdownOpen(false);
    const dateStr = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const rowsHtml = capturedTransactions.map((tx) => {
      const booking = state.bookings.find((b) => b.id === tx.bookingId);
      const txDate = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN') : '2026-09-05';
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 11px;">${tx.transactionCode}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${txDate}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${booking?.serviceName || 'Service'}</strong><br><span style="font-size: 11px; color: #64748b;">${booking?.householdName || ''}</span></td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">₹${tx.grossAmount}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #e11d48; text-align: right;">-₹${tx.platformFee}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #d97706; text-align: right;">-₹${tx.cooperativeFund}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #047857; font-weight: bold; font-size: 13px; text-align: right;">₹${tx.workerNetPayout}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span style="background: #dcfce7; color: #166534; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 9999px;">${tx.paymentStatus}</span></td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>SevaMitra Earnings Report - ${currentWorker.fullName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 32px; background: #f8fafc; color: #0f172a; }
          .container { max-width: 860px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 24px; }
          .logo-title { font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
          .logo-title span { color: #059669; }
          .tagline { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px; }
          .badge { background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
          .card-net { background: #ecfdf5; border-color: #6ee7b7; }
          .card-title { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .card-value { font-size: 22px; font-weight: 900; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
          @media print { body { background: white; padding: 0; } .container { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div class="logo-title">SEVA<span>MITRA</span> <span class="badge">COOPERATIVE</span></div>
              <div class="tagline">Together • Serve • Empower • SIH26089 • Team Techforge</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px; font-weight: bold;">WORKER EARNINGS STATEMENT</div>
              <div style="font-size: 11px; color: #64748b;">Generated on ${timestampStr}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 12px;">
            <div>
              <strong>Worker Name:</strong> ${currentWorker.fullName}<br>
              <strong>Worker ID:</strong> ${currentWorker.id}<br>
              <strong>Trade Skills:</strong> ${currentWorker.skills.join(', ')}
            </div>
            <div style="text-align: right;">
              <strong>Territory:</strong> ${currentWorker.locality}, Bangalore (${currentWorker.pincode})<br>
              <strong>Cooperative Payout Account:</strong> SBI A/C ending in ••••9402<br>
              <strong>Member Standing:</strong> Active Cooperative Member
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Customer Gross (100%)</div>
              <div class="card-value">₹${totalGross}</div>
            </div>
            <div class="card">
              <div class="card-title">Platform Operations (5%)</div>
              <div class="card-value" style="color: #e11d48;">-₹${totalPlatformFee}</div>
            </div>
            <div class="card">
              <div class="card-title">Coop Welfare (2%)</div>
              <div class="card-value" style="color: #d97706;">-₹${totalCoopFund}</div>
            </div>
            <div class="card card-net">
              <div class="card-title" style="color: #065f46;">Net Credited (93%)</div>
              <div class="card-value" style="color: #047857;">₹${totalNet}</div>
            </div>
          </div>

          <div style="background: #0f172a; color: white; padding: 14px 18px; border-radius: 12px; margin: 16px 0; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Cooperative Livelihood Advantage:</strong>
              <span style="color: #94a3b8; display: block; font-size: 11px;">Compared to standard 30% corporate gig deductions (₹${corporateDeductions}), you saved:</span>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #34d399;">+₹${cooperativeExtraSaved} extra</div>
          </div>

          <div style="font-size: 13px; font-weight: bold; margin-top: 24px;">Itemized Job Audit Ledger (${capturedTransactions.length} Settled Transactions)</div>
          <table>
            <thead>
              <tr>
                <th>Tx Code</th>
                <th>Date</th>
                <th>Service & Customer</th>
                <th style="text-align: right;">Gross (₹)</th>
                <th style="text-align: right;">5% Fee</th>
                <th style="text-align: right;">2% Fund</th>
                <th style="text-align: right;">Net (93%)</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #94a3b8;">No settled transactions available</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <strong>SevaMitra Worker Cooperative Society</strong><br>
              Audited by Cooperative Executive Committee • Problem Statement ID: SIH26089
            </div>
            <div style="text-align: right;">
              Status: <strong>Electronically Verified & Settled</strong><br>
              Direct IMPS Disbursement to Worker
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = currentWorker.fullName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `SevaMitra_Statement_${safeName}_${dateStr}.html`;

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Formal statement downloaded: ${fileName}`);
    setTimeout(() => setDownloadSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Download Report and Payout Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transparent Earnings Ledger</h2>
          <p className="text-xs text-slate-500">
            Audit-grade itemized receipts • 93% direct worker payout • Zero hidden commissions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 'Download Report' Button with Format Options */}
          <div className="relative" ref={dropdownRef}>
            <div className="inline-flex rounded-xl shadow-xs overflow-hidden border border-slate-300">
              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-2 cursor-pointer border-r border-slate-200"
                title="Download complete worker earnings summary as CSV spreadsheet"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Download Report</span>
              </button>
              <button
                onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                className="px-2 py-2.5 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer flex items-center justify-center"
                title="Choose download format"
                aria-label="Report format options"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isFormatDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Export Earnings Summary
                  </p>
                </div>

                <button
                  onClick={handleDownloadCSV}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/80 text-xs font-semibold text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block text-slate-900 font-bold">CSV Spreadsheet (.csv)</span>
                    <span className="text-[10px] text-slate-500">Universal format for Excel & Google Sheets</span>
                  </div>
                </button>

                <button
                  onClick={handleDownloadHTML}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/80 text-xs font-semibold text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="block text-slate-900 font-bold">Printable Statement (.html)</span>
                    <span className="text-[10px] text-slate-500">Official SevaMitra cooperative payslip</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFormatDropdownOpen(false);
                    setIsPreviewModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/80 text-xs font-semibold text-slate-700 flex items-center gap-2.5 transition cursor-pointer border-t border-slate-100"
                >
                  <Printer className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <span className="block text-slate-900 font-bold">Preview / Print Statement</span>
                    <span className="text-[10px] text-slate-500">View statement on screen with print option</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Instant Bank Payout */}
          <button
            onClick={handleSimulateWithdrawal}
            disabled={isWithdrawing || totalNet === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>{isWithdrawing ? 'Processing Payout...' : 'Instant Bank Payout'}</span>
          </button>
        </div>
      </div>

      {/* Download Success Toast Notification */}
      {downloadSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Payout Success Toast Notification */}
      {withdrawSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-300 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
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
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Job-by-Job Transparent Audit Ledger</h3>
            <span className="text-xs text-slate-500">{capturedTransactions.length} Settled Transactions</span>
          </div>

          {/* Additional Quick Download Button inside table toolbar */}
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download CSV</span>
          </button>
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

      {/* On-Screen Statement Preview & Print Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header Actions */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Official Worker Earnings Statement Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save CSV</span>
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Statement Document */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-white text-slate-900">
              {/* Logo & Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-emerald-600 pb-5 gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={officialLogoImg}
                    alt="SevaMitra App Icon"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-contain border border-slate-800 bg-[#062428] p-0.5 shadow-xs"
                  />
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      SEVA<span className="text-emerald-600">MITRA</span> COOPERATIVE
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Together • Serve • Empower • SIH26089
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Earnings Statement
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Generated: {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>

              {/* Worker Identity Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="text-slate-500">Worker Member:</p>
                  <p className="font-bold text-sm text-slate-900">{currentWorker.fullName}</p>
                  <p className="text-slate-600 font-mono text-[11px]">ID: {currentWorker.id}</p>
                  <p className="text-slate-600 mt-1">Skills: {currentWorker.skills.join(', ')}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-slate-500">Service Territory:</p>
                  <p className="font-semibold text-slate-900">{currentWorker.locality}, Bangalore ({currentWorker.pincode})</p>
                  <p className="text-slate-600 text-[11px] mt-1">Disbursement Account: SBI ending in ••••9402</p>
                  <p className="text-emerald-700 font-bold text-[11px]">93% Direct Payout Cooperative Policy</p>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Invoiced</span>
                  <span className="text-lg font-black text-slate-900">₹{totalGross}</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-500 block">Platform Fee (5%)</span>
                  <span className="text-lg font-black text-rose-700">-₹{totalPlatformFee}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-500 block">Coop Welfare (2%)</span>
                  <span className="text-lg font-black text-amber-700">-₹{totalCoopFund}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Net Credited (93%)</span>
                  <span className="text-lg font-black text-emerald-700">₹{totalNet}</span>
                </div>
              </div>

              {/* Cooperative Advantage Callout */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-400 block">Cooperative Livelihood Advantage</span>
                  <span className="text-[11px] text-slate-300">
                    Vs corporate gig monopolies taking 30% (₹{corporateDeductions})
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-400">+₹{cooperativeExtraSaved} Saved</span>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Tx Code</th>
                      <th className="p-2.5">Service</th>
                      <th className="p-2.5 text-right">Gross</th>
                      <th className="p-2.5 text-right">5% Fee</th>
                      <th className="p-2.5 text-right">2% Coop</th>
                      <th className="p-2.5 text-right font-bold text-emerald-800">Net (93%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {capturedTransactions.map((tx) => {
                      const booking = state.bookings.find((b) => b.id === tx.bookingId);
                      return (
                        <tr key={tx.id}>
                          <td className="p-2.5 font-mono text-[11px] text-slate-600">{tx.transactionCode}</td>
                          <td className="p-2.5">{booking?.serviceName || 'Service'}</td>
                          <td className="p-2.5 text-right font-semibold">₹{tx.grossAmount}</td>
                          <td className="p-2.5 text-right text-rose-600">-₹{tx.platformFee}</td>
                          <td className="p-2.5 text-right text-amber-600">-₹{tx.cooperativeFund}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-700">₹{tx.workerNetPayout}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Statement Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <span>Audited & verified by SevaMitra Cooperative Executive Council</span>
                <span className="font-semibold text-emerald-700">Status: Disbursed via Instant IMPS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

