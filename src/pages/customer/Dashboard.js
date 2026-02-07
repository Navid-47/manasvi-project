// src/pages/user/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CustomerNavbar from '../../components/CustomerNavbar';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const [showLoginSnackbar, setShowLoginSnackbar] = useState(false);
  const [userName, setUserName] = useState('User');

  // Show login success snackbar only once on initial login
  useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowLoginSnackbar(true);
      setUserName(location.state?.userName || 'User');

      // Clear the location state to prevent showing snackbar on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto-dismiss snackbar
  useEffect(() => {
    if (showLoginSnackbar) {
      const timer = setTimeout(() => setShowLoginSnackbar(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginSnackbar]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <CustomerNavbar />

      <div className="flex flex-1 relative">
        {/* Sidebar - Hidden on mobile, handled by Navbar drawer on mobile usually, 
            but Sidebar component has hidden md:flex logic */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 container mx-auto px-4 md:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <Footer />

      {/* Login Success Toast */}
      <AnimatePresence>
        {showLoginSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 bg-gray-900 text-white min-w-[320px]"
          >
            <div className="bg-green-500/20 text-green-400 p-1 rounded-full">
              <Check size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Login Successful</p>
              <p className="text-xs text-gray-400">Welcome back, {userName}!</p>
            </div>
            <button onClick={() => setShowLoginSnackbar(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}