import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllPayments } from '../../services/paymentService';
import { getAllBookings } from '../../services/bookingService';
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle
} from 'lucide-react';

export default function PaymentHistory() {
  const { user } = useAuth();

  const { rows, totalSpend } = useMemo(() => {
    const allPayments = getAllPayments();
    const allBookings = getAllBookings();
    const email = user?.email;

    let filtered = allPayments;
    if (email) {
      const bookingsById = new Map(
        allBookings.map((b) => [String(b.id), b])
      );
      filtered = allPayments.filter((p) => {
        const booking = bookingsById.get(String(p.bookingId));
        return booking && booking.userEmail === email;
      });
    }

    const mapped = filtered
      .map((p) => {
        const booking = allBookings.find((b) => String(b.id) === String(p.bookingId));
        const packageName = booking?.packageName || 'Travel Package';
        const amount = Number(p.amount) || 0;
        const date = p.createdAt ? p.createdAt.slice(0, 10) : '';
        const status = p.status || 'Success';
        return { id: p.id, packageName, amount, date, status };
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const total = mapped.reduce((sum, t) => sum + t.amount, 0);

    return { rows: mapped, totalSpend: total };
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-700 border-green-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Payment History</h1>
        <p className="text-text-secondary">Track your payment transactions and expenses.</p>
      </div>

      {/* Total Spend Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-text-secondary text-sm font-medium">Total Spend</p>
            <h3 className="text-2xl font-bold text-text-primary">₹{totalSpend.toLocaleString()}</h3>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-text-secondary">Based on successful payments</p>
        </div>
      </div>

      {/* Transactions Table */}
      {rows.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <CreditCard size={32} />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No Transactions Yet</h3>
          <p className="text-text-secondary">Your payment history will appear here once you make a booking.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Package Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-text-secondary">#{t.id}</td>
                    <td className="p-4 font-medium text-text-primary">{t.packageName}</td>
                    <td className="p-4 font-bold text-text-primary">₹{t.amount.toLocaleString()}</td>
                    <td className="p-4 text-text-secondary text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} /> {t.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(t.status)}`}>
                        {t.status === 'Success' && <CheckCircle size={10} />}
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}