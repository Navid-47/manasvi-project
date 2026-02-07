import React, { useState, useEffect } from 'react';
import { getAllPackages, savePackages } from '../../services/packageService';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagePackages() {
  const [packages, setPackages] = useState(() => getAllPackages());
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState({ open: false, editing: null });
  const [form, setForm] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    itinerary: '',
    inclusions: '',
    exclusions: '',
    tripType: 'Domestic',
    active: true,
    imageUrl: '',
  });
  const [toast, setToast] = useState(null);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Close toast automatically
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filtered = packages.filter((p) => {
    const q = query.toLowerCase();
    const name = (p.name || '').toLowerCase();
    const destination = (p.destination || '').toLowerCase();
    return name.includes(q) || destination.includes(q);
  });

  const sortComparator = (a, b) => {
    const av = a[orderBy];
    const bv = b[orderBy];
    let cmp = 0;
    if (orderBy === 'price') {
      cmp = Number(av || 0) - Number(bv || 0);
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return order === 'asc' ? cmp : -cmp;
  };

  const sorted = [...filtered].sort(sortComparator);
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paged = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const openCreate = () => {
    setForm({
      name: '',
      destination: '',
      price: '',
      duration: '',
      itinerary: '',
      inclusions: '',
      exclusions: '',
      tripType: 'Domestic',
      active: true,
      imageUrl: '',
    });
    setDialog({ open: true, editing: null });
  };

  const openEdit = (pkg) => {
    setForm({
      name: pkg.name || '',
      destination: pkg.destination || '',
      price: String(pkg.price ?? ''),
      duration: pkg.duration || '',
      itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary.join('\n') : pkg.itinerary || '',
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : pkg.inclusions || '',
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : pkg.exclusions || '',
      tripType: pkg.tripType || 'Domestic',
      active: pkg.active ?? true,
      imageUrl: pkg.imageUrl || pkg.image || (Array.isArray(pkg.images) && pkg.images[0]) || '',
    });
    setDialog({ open: true, editing: pkg });
  };

  const closeDialog = () => setDialog({ open: false, editing: null });

  const save = () => {
    if (!form.name.trim() || !form.price) { setToast({ type: 'error', message: 'Name and price are required' }); return; }
    const price = Number(form.price);
    if (Number.isNaN(price) || price <= 0) { setToast({ type: 'error', message: 'Price must be a positive number' }); return; }

    const toList = (value) => String(value || '').split('\n').map((v) => v.trim()).filter(Boolean);

    if (dialog.editing) {
      setPackages(prev => {
        const next = prev.map(p =>
          p.id === dialog.editing.id
            ? {
              ...p,
              name: form.name.trim(),
              destination: form.destination.trim(),
              price,
              duration: form.duration.trim(),
              itinerary: toList(form.itinerary),
              inclusions: toList(form.inclusions),
              exclusions: toList(form.exclusions),
              tripType: form.tripType || 'Domestic',
              active: form.active,
              image: form.imageUrl.trim() || p.image,
              imageUrl: form.imageUrl.trim(),
            }
            : p
        );
        savePackages(next);
        return next;
      });
      setToast({ type: 'success', message: 'Package updated successfully' });
    } else {
      setPackages(prev => {
        const numericIds = prev.map(p => parseInt(p.id, 10)).filter((n) => Number.isFinite(n));
        const nextNum = (numericIds.length ? Math.max(...numericIds) : 0) + 1;
        const id = String(nextNum);
        const img = form.imageUrl.trim();
        const created = {
          id,
          name: form.name.trim(),
          destination: form.destination.trim(),
          price,
          duration: form.duration.trim(),
          itinerary: toList(form.itinerary),
          inclusions: toList(form.inclusions),
          exclusions: toList(form.exclusions),
          tripType: form.tripType || 'Domestic',
          active: form.active,
          image: img || undefined,
          imageUrl: img,
        };
        const next = [created, ...prev];
        savePackages(next);
        return next;
      });
      setToast({ type: 'success', message: 'Package created successfully' });
    }
    closeDialog();
  };

  const remove = (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    setPackages(prev => {
      const next = prev.filter(p => p.id !== id);
      savePackages(next);
      return next;
    });
    setToast({ type: 'success', message: 'Package deleted' });
  };

  const toggleActive = (id) => {
    setPackages(prev => {
      const next = prev.map(p => p.id === id ? { ...p, active: !p.active } : p);
      savePackages(next);
      return next;
    });
  };

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manage Packages</h1>
          <p className="text-text-secondary">Create and manage your travel packages.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all">
          <Plus size={18} /> Add Package
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search packages by name or destination..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                <th className="p-4 w-20">Image</th>
                <th className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('id')}>ID</th>
                <th className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('name')}>Name</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-right cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleSort('price')}>Price</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-text-secondary">#{p.id}</td>
                  <td className="p-4 font-semibold text-text-primary">{p.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{p.duration || '-'}</td>
                  <td className="p-4 text-right font-medium text-text-primary">₹{Number(p.price).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleActive(p.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${p.active ? 'bg-brand' : 'bg-gray-200'}`}
                    >
                      <span className={`${p.active ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`} />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => remove(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-text-muted">
                    No packages found matching your criteria.
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

      {/* Form Modal */}
      <AnimatePresence>
        {dialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-text-primary">{dialog.editing ? 'Edit Package' : 'Create New Package'}</h2>
                <button onClick={closeDialog} className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Package Name</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Destination</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Price (₹)</label>
                    <input type="number" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Duration (e.g., 3N/4D)</label>
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Trip Type</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none bg-white" value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })}>
                      <option value="Domestic">Domestic</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-secondary">Itinerary (One item per line)</label>
                  <textarea className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" rows="3" value={form.itinerary} onChange={(e) => setForm({ ...form, itinerary: e.target.value })}></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Inclusions (One per line)</label>
                    <textarea className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" rows="3" value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })}></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-secondary">Exclusions (One per line)</label>
                    <textarea className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" rows="3" value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })}></textarea>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-secondary">Image URL</label>
                  <div className="flex gap-2">
                    <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                    {form.imageUrl && (
                      <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="activeCheck" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300 text-brand focus:ring-brand w-5 h-5" />
                  <label htmlFor="activeCheck" className="text-sm font-medium text-text-primary">Active (Visible to customers)</label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button onClick={closeDialog} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-text-secondary hover:bg-gray-50 font-medium">Cancel</button>
                <button onClick={save} className="px-5 py-2.5 rounded-xl bg-brand text-white hover:bg-brand-dark font-bold shadow-lg shadow-brand/20">Save Package</button>
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
            {toast.type === 'success' ? <Check size={20} className="text-green-400" /> : <X size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


