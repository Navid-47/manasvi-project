import React, { useState, useEffect } from 'react';
import { getAllPayments } from '../../services/paymentService';
import { Download, Calendar, Filter, X, Check, AlertCircle, DollarSign, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentReports() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('All');
  const [toast, setToast] = useState(null);

  const allPayments = getAllPayments();

  const normalizedPayments = (allPayments || []).map((p) => ({
    id: p.id,
    bookingId: p.bookingId,
    customer: p.userEmail || p.customer || 'Customer',
    date: p.createdAt || p.date,
    amount: p.amount,
    status: p.status || 'Success',
    method: p.method || 'Card',
  }));

  const payments = normalizedPayments.filter((p) => {
    if (!p.date) return false;
    const d = new Date(p.date).setHours(0, 0, 0, 0);
    const afterFrom = from ? d >= new Date(from).setHours(0, 0, 0, 0) : true;
    const beforeTo = to ? d <= new Date(to).setHours(0, 0, 0, 0) : true;
    const matchesStatus = status === 'All' ? true : (p.status || 'Success') === status;
    return afterFrom && beforeTo && matchesStatus;
  });

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const count = payments.length;

  const statusCounts = normalizedPayments.reduce((acc, p) => {
    const key = p.status || 'Success';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const successCount = statusCounts.Success || 0;
  const failedCount = statusCounts.Failed || 0;
  const refundedCount = statusCounts.Refunded || 0;

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const setPreset = (preset) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (preset === 'today') {
      const d = today.toISOString().slice(0, 10);
      setFrom(d); setTo(d);
    } else if (preset === '7') {
      const d = new Date(); d.setDate(today.getDate() - 7);
      setFrom(d.toISOString().slice(0, 10)); setTo(today.toISOString().slice(0, 10));
    } else if (preset === '30') {
      const d = new Date(); d.setDate(today.getDate() - 30);
      setFrom(d.toISOString().slice(0, 10)); setTo(today.toISOString().slice(0, 10));
    } else if (preset === '90') {
      const d = new Date(); d.setDate(today.getDate() - 90);
      setFrom(d.toISOString().slice(0, 10)); setTo(today.toISOString().slice(0, 10));
    } else if (preset === 'month') {
      setFrom(startOfMonth.toISOString().slice(0, 10)); setTo(today.toISOString().slice(0, 10));
    }
  };

  const exportCsv = () => {
    const header = ['Payment ID', 'Booking ID', 'Customer', 'Status', 'Method', 'Date', 'Amount'];
    const rows = payments.map((p) => [
      p.id,
      p.bookingId || '',
      p.customer,
      p.status || 'Success',
      p.method || 'Card',
      p.date ? new Date(p.date).toLocaleDateString() : '',
      p.amount,
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${from || 'all'}-${to || 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ type: 'success', message: 'Report exported successfully' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-700 border-green-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Payment Reports</h1>
          <p className="text-text-secondary">Track revenue and payment status logs.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} disabled={payments.length === 0} className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-text-primary">₹{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Check size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-medium">Successful</p>
            <p className="text-2xl font-bold text-text-primary">{successCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-medium">Failed</p>
            <p className="text-2xl font-bold text-text-primary">{failedCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-medium">Refunded</p>
            <p className="text-2xl font-bold text-text-primary">{refundedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-brand" />
          <h3 className="font-semibold text-text-primary">Filter Reports</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary uppercase">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary uppercase">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary uppercase">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none text-sm h-[38px]">
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => { setFrom(''); setTo(''); setStatus('All'); }} className="px-4 py-2 bg-gray-100 text-text-secondary hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">Clear</button>
            <div className="flex-1"></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-medium text-text-secondary py-1.5">Quick Ranges:</span>
          <button onClick={() => setPreset('today')} className="px-3 py-1 bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-200 rounded-lg text-xs font-medium transition-all">Today</button>
          <button onClick={() => setPreset('7')} className="px-3 py-1 bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-200 rounded-lg text-xs font-medium transition-all">Last 7 Days</button>
          <button onClick={() => setPreset('30')} className="px-3 py-1 bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-200 rounded-lg text-xs font-medium transition-all">Last 30 Days</button>
          <button onClick={() => setPreset('month')} className="px-3 py-1 bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-200 rounded-lg text-xs font-medium transition-all">This Month</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                <th className="p-4">Payment ID</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-text-secondary text-sm">#{p.id}</td>
                  <td className="p-4 text-brand text-sm">{p.bookingId || '-'}</td>
                  <td className="p-4 text-text-primary font-medium">{p.customer}</td>
                  <td className="p-4 text-text-secondary text-sm">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>
                      {p.status || 'Success'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold text-text-primary">₹{(p.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">No payments found in the selected range.</td>
                </tr>
              )}
            </tbody>
            {payments.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-100">
                <tr>
                  <td colSpan="5" className="p-4 text-right font-bold text-text-primary">Total Amount</td>
                  <td className="p-4 text-right font-bold text-brand text-lg">₹{total.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-xl z-50 flex items-center gap-3 ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
              }`}
          >
            {toast.type === 'success' ? <Check size={20} className="text-green-400" /> : <X size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


