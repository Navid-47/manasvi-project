import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Wallet,
  LogOut,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const items = [
    { to: '/user-dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/user-dashboard/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/user-dashboard/payments', icon: CreditCard, label: 'Payment History' },
    { to: '/user-dashboard/wallet', icon: Wallet, label: 'My Wallet' },
    { to: '/user-dashboard/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    try {
      logout();
    } catch {
      /* ignore */
    }
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-20 bg-white border-r border-gray-100 shadow-sm z-30 transition-all duration-300"
    >
      <div className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-6 py-3 mx-3 rounded-xl transition-all duration-300 group
              ${isActive
                ? 'bg-brand text-white shadow-lg shadow-brand/25'
                : 'text-text-secondary hover:bg-gray-50 hover:text-brand'
              }
            `}
          >
            <item.icon size={22} strokeWidth={2} />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isExpanded && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
            text-red-500 hover:bg-red-50 hover:shadow-sm
          `}
        >
          <LogOut size={22} strokeWidth={2} />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
