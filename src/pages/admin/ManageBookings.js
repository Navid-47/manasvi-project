import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBooking } from '../../services/bookingService';
import { Search, Filter, MoreVertical, Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

function mapBookings(source) {
  return (source || []).map((b) => ({
    id: b.id,
    customer: b.customer || b.userEmail || 'Customer',
    destination: b.destination || b.packageName || '',
    amount: Number(b.amount) || 0,
    status: b.status || 'Pending',
    createdAt: b.createdAt || new Date().toISOString(),
  }));
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState(() => mapBookings(getAllBookings()));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // For drawer/modal
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // ID of booking with open menu

  // Close toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filtered = bookings.filter(b => {
    const matchesQuery = [b.id, b.customer, b.destination].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : b.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const sortComparator = (a, b) => {
    const av = a[orderBy];
    const bv = b[orderBy];
    let cmp = 0;
    if (orderBy === 'amount') {
      cmp = (av || 0) - (bv || 0);
    } else if (orderBy === 'createdAt') {
      cmp = new Date(av) - new Date(bv);
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return order === 'asc' ? cmp : -cmp;
  };

  const sorted = [...filtered].sort(sortComparator);
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paged = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(b => b.id));
  };

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const updateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try { updateBooking(id, { status: newStatus }); } catch { }
    setToast({ type: 'success', message: `Booking updated to ${newStatus}` });
    setActionMenuOpen(null);
  };

  const bulkUpdate = (newStatus) => {
    setBookings(prev => prev.map(b => selected.includes(b.id) ? { ...b, status: newStatus } : b));
    selected.forEach(id => {
      try { updateBooking(id, { status: newStatus }); } catch { }
    });
    setSelected([]);
    setToast({ type: 'success', message: `Updated ${selected.length} bookings to ${newStatus}` });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manage Bookings</h1>
          <p className="text-text-secondary">View and manage all customer bookings.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-text-secondary">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, Customer, or Destination..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'bg-white shadow text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <span className="text-xs font-semibold text-text-secondary">{selected.length} selected</span>
              <div className="flex gap-1">
                <button onClick={() => bulkUpdate('Confirmed')} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Mark Confirmed"><Check size={16} /></button>
                <button onClick={() => bulkUpdate('Cancelled')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Mark Cancelled"><X size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-brand focus:ring-brand" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">ID {orderBy === 'id' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('customer')}>
                  <div className="flex items-center gap-1">Customer {orderBy === 'customer' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('destination')}>
                  <div className="flex items-center gap-1">Destination {orderBy === 'destination' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</div>
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end gap-1">Amount {orderBy === 'amount' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center justify-end gap-1">Date {orderBy === 'createdAt' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</div>
                </th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand focus:ring-brand" checked={selected.includes(booking.id)} onChange={() => toggleSelect(booking.id)} />
                  </td>
                  <td className="p-4 font-medium text-text-primary">#{booking.id.slice(0, 8)}...</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs">
                        {booking.customer.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-text-primary">{booking.customer}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">{booking.destination}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-text-primary">₹{booking.amount.toLocaleString()}</td>
                  <td className="p-4 text-right text-text-secondary text-sm">{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === booking.id ? null : booking.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {actionMenuOpen === booking.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(null)}></div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                            >
                              <div className="p-1">
                                <button onClick={() => updateStatus(booking.id, 'Confirmed')} className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-2">
                                  <Check size={14} /> Confirm
                                </button>
                                <button onClick={() => updateStatus(booking.id, 'Cancelled')} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                  <X size={14} /> Cancel
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button onClick={() => { setSelectedBooking(booking); setActionMenuOpen(null); }} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-gray-50 rounded-lg">
                                  View Details
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colspan="8" className="p-8 text-center text-text-muted">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to <span className="font-medium">{Math.min(page * rowsPerPage, sorted.length)}</span> of <span className="font-medium">{sorted.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-2">Page {page} of {totalPages || 1}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal (Simplistic for now) */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">Booking Details</h2>
                    <p className="text-sm text-text-secondary"># {selectedBooking.id}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Customer</p>
                      <p className="font-medium text-text-primary mt-1 text-sm">{selectedBooking.customer}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Amount</p>
                      <p className="font-medium text-text-primary mt-1 text-sm">₹{selectedBooking.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Destination</p>
                    <p className="font-medium text-text-primary mt-1 text-sm">{selectedBooking.destination}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                    <span className="text-sm font-medium text-text-secondary">Current Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button onClick={() => { updateStatus(selectedBooking.id, 'Confirmed'); setSelectedBooking(null); }} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors">
                      Confirm Booking
                    </button>
                    <button onClick={() => { updateStatus(selectedBooking.id, 'Cancelled'); setSelectedBooking(null); }} className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors">
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
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

