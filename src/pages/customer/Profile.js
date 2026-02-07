import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserByEmail, updateUser } from '../../services/userService';
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Save,
  Calendar,
  CreditCard,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const [form, setForm] = useState({
    firstName: 'Alex',
    lastName: 'Traveler',
    gender: 'Male',
    dob: '',
    nationality: 'Indian',
    maritalStatus: 'Single',
    anniversary: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 98765 43210',
    email: 'alex@example.com',
    passportNumber: '',
    passportExpiry: '',
    issuingCountry: 'India',
    panNumber: '',
  });
  const [toast, setToast] = useState(null);
  const { user, login } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    try {
      const u = getUserByEmail(user.email);
      if (!u) return;
      const fallbackName = String(u.name || '').trim();
      const [firstDefault, ...rest] = fallbackName.split(' ').filter(Boolean);
      const lastDefault = rest.join(' ');
      setForm((prev) => ({
        ...prev,
        firstName: u.firstName || firstDefault || prev.firstName,
        lastName: u.lastName || lastDefault || prev.lastName,
        gender: u.gender || prev.gender,
        dob: u.dob || prev.dob,
        nationality: u.nationality || prev.nationality,
        maritalStatus: u.maritalStatus || prev.maritalStatus,
        anniversary: u.anniversary || prev.anniversary,
        city: u.city || prev.city,
        state: u.state || prev.state,
        phone: u.phone || prev.phone,
        email: u.email || prev.email,
        passportNumber: u.passportNumber || prev.passportNumber,
        passportExpiry: u.passportExpiry || prev.passportExpiry,
        issuingCountry: u.issuingCountry || prev.issuingCountry,
        panNumber: u.panNumber || prev.panNumber,
      }));
    } catch { }
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const displayName = useMemo(
    () => `${form.firstName || ''} ${form.lastName || ''}`.trim() || 'User',
    [form.firstName, form.lastName]
  );

  const initials = displayName
    .split('.')
    .join(' ')
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate slight delay for better UX
    await new Promise(r => setTimeout(r, 600));

    const computedName = `${form.firstName || ''} ${form.lastName || ''}`.trim();
    const userName = computedName || (user && user.userName) || 'User';
    try {
      if (user?.id) {
        updateUser(user.id, {
          name: userName,
          firstName: form.firstName,
          lastName: form.lastName,
          gender: form.gender,
          dob: form.dob,
          nationality: form.nationality,
          maritalStatus: form.maritalStatus,
          anniversary: form.anniversary,
          city: form.city,
          state: form.state,
          phone: form.phone,
          passportNumber: form.passportNumber,
          passportExpiry: form.passportExpiry,
          issuingCountry: form.issuingCountry,
          panNumber: form.panNumber,
        });
      }
    } catch { }

    if (login) {
      if (user) {
        login({ ...user, userName });
      } else {
        login({ userName, role: 'user' });
      }
    }

    setToast({ type: 'success', message: 'Profile updated successfully!' });
    setIsSaving(false);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand/20">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
            <p className="text-text-secondary text-sm">Keep your details up to date for a smoother booking experience.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-brand text-white rounded-xl font-medium shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <><Save size={18} /> Save Changes</>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* General Information */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <User size={20} className="text-brand" />
            <h2 className="text-lg font-bold text-text-primary">General Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">First & Middle Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Gender</label>
              <select name="gender" value={form.gender} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all appearance-none cursor-pointer">
                {['Male', 'Female', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Date of Birth</label>
              <div className="relative">
                <input type="date" name="dob" value={form.dob} onChange={onChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Nationality</label>
              <div className="relative">
                <input type="text" name="nationality" value={form.nationality} onChange={onChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
                <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Marital Status</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all appearance-none cursor-pointer">
                {['Single', 'Married', 'Divorced', 'Widowed'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Anniversary</label>
              <div className="relative">
                <input type="date" name="anniversary" value={form.anniversary} onChange={onChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">City of Residence</label>
              <div className="relative">
                <input type="text" name="city" value={form.city} onChange={onChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">State</label>
              <input type="text" name="state" value={form.state} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
              <p className="text-[10px] text-text-muted mt-1">Required for GST purpose</p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Phone size={20} className="text-brand" />
            <h2 className="text-lg font-bold text-text-primary">Contact Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Mobile Number</label>
              <div className="relative">
                <input type="text" name="phone" value={form.phone} onChange={onChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Email ID</label>
              <div className="relative">
                <input type="text" name="email" value={form.email} disabled className="w-full p-3 pl-10 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Details */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={20} className="text-brand" />
            <h2 className="text-lg font-bold text-text-primary">Document Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Passport Number</label>
              <input type="text" name="passportNumber" value={form.passportNumber} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Passport Expiry</label>
              <input type="date" name="passportExpiry" value={form.passportExpiry} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">Issuing Country</label>
              <input type="text" name="issuingCountry" value={form.issuingCountry} onChange={onChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase">PAN Card Number</label>
              <div className="relative">
                <input type="text" name="panNumber" value={form.panNumber} onChange={onChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all" />
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>NOTE: Your PAN No. will only be used for international bookings as per RBI Guidelines.</p>
          </div>
        </div>
      </motion.div>

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