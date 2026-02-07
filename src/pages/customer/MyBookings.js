import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllBookings, updateBooking } from '../../services/bookingService';
import { addAdminNotification } from '../../services/notificationService';
import {
  Calendar,
  MapPin,
  AlertCircle,
  FileText,
  Plane,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const all = getAllBookings();
    const email = user?.email;
    const userBookings = email ? all.filter((b) => b.userEmail === email) : all;
    const mapped = userBookings.map((b) => ({
      id: b.id,
      packageName: b.packageName || 'Travel Package',
      destination: b.destination || '',
      date: b.travelDate || (b.createdAt ? b.createdAt.slice(0, 10) : ''),
      status:
        b.status === 'Cancelled'
          ? 'Cancelled'
          : b.status === 'Confirmed'
            ? 'Completed'
            : 'Upcoming',
      refundRequested: !!b.refundRequested,
      refundStatus: b.refundStatus || null,
      daysUntil: (() => {
        const raw = b.travelDate || b.createdAt;
        if (!raw) return null;
        const tripDate = new Date(raw);
        if (Number.isNaN(tripDate.getTime())) return null;
        const dTrip = new Date(tripDate);
        const dNow = new Date();
        dTrip.setHours(0, 0, 0, 0);
        dNow.setHours(0, 0, 0, 0);
        return Math.round((dTrip.getTime() - dNow.getTime()) / (24 * 60 * 60 * 1000));
      })(),
    }));

    setRows(mapped);
  }, [user]);

  const hasData = useMemo(() => rows.length > 0, [rows]);

  const handleCancel = (id) => setConfirmId(id);
  const confirmCancel = () => {
    const bookingRow = rows.find((x) => x.id === confirmId) || null;

    setRows((r) =>
      r.map((x) =>
        x.id === confirmId ? { ...x, status: 'Cancelled', refundRequested: true } : x
      )
    );
    try {
      updateBooking(confirmId, {
        status: 'Cancelled',
        refundRequested: true,
        refundReason: refundReason.trim() || undefined,
      });

      try {
        const titleParts = [];
        titleParts.push(`Booking ${bookingRow?.id || confirmId} cancelled`);
        if (bookingRow?.destination) {
          titleParts.push(`• ${bookingRow.destination}`);
        }
        if (user?.email) {
          titleParts.push(`by ${user.email}`);
        }
        addAdminNotification(titleParts.join(' '));
      } catch {
        // ignore notification errors
      }
    } catch { }

    setToast({ type: 'success', message: 'Booking Cancelled Successfully' });
    setRefundReason('');
    setConfirmId(null);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">My Bookings</h1>
        <p className="text-text-secondary">Manage and view your travel reservations.</p>
      </div>

      {!hasData ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Plane size={32} />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No Bookings Yet</h3>
          <p className="text-text-secondary mb-6">You haven't booked any trips yet. Start your journey today!</p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-2 bg-brand text-white rounded-xl font-medium shadow-lg hover:bg-brand-dark transition-all"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                  <th className="p-4">Package Name</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Travel Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 font-medium text-text-primary">{row.packageName}</td>
                    <td className="p-4 text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} /> {row.destination}
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} /> {row.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                          {row.status}
                        </span>
                        {row.status === 'Upcoming' && typeof row.daysUntil === 'number' && row.daysUntil >= 0 && (
                          <span className="text-xs text-text-secondary flex items-center gap-1">
                            <Clock size={10} /> {row.daysUntil === 0 ? 'Today' : `In ${row.daysUntil} days`}
                          </span>
                        )}
                        {row.status === 'Cancelled' && row.refundRequested && (
                          <span className="text-xs text-orange-600 flex items-center gap-1">
                            <Info size={10} /> Refund requested
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/booking/${row.id}/invoice`)}
                          className="p-2 text-text-secondary hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <FileText size={18} />
                        </button>
                        {row.status === 'Upcoming' && (
                          <button
                            onClick={() => handleCancel(row.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      <AnimatePresence>
        {confirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                  <div className="p-2 bg-red-50 rounded-full">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Cancel Booking?</h3>
                </div>

                <p className="text-text-secondary mb-4">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                  Please provide a reason for the cancellation if you'd like to request a refund.
                </p>

                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for cancellation (optional)..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-sm min-h-[100px] mb-6"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-4 py-2 text-text-secondary hover:bg-gray-100 rounded-xl font-medium transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            {toast.type === 'success' ? <CheckCircle size={20} className="text-green-400" /> : <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}