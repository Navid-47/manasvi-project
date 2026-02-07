import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotificationsForUser, markAllAsReadForUser } from '../services/notificationService';
import NotificationBell from './NotificationBell';
import {
  Menu, X, Search, ChevronDown, User, LayoutDashboard, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const handleScroll = () => setIsScrolled(window.scrollY > 10);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const refresh = () => {
      try {
        setNotifications(getNotificationsForUser(user));
      } catch {
        // ignore
      }
    };

    refresh();
    if (typeof window !== 'undefined') {
      window.addEventListener('tm_notifications_updated', refresh);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('tm_notifications_updated', refresh);
      }
    };
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    setSearchOpen(false);
    setSearchTerm('');
  };

  const handleReadAllNotifications = () => {
    if (!user) return;
    try {
      markAllAsReadForUser(user);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'User');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Destinations', path: '/destinations' },
    { text: 'Tours', path: '/tours' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
            <span className="text-xl font-bold text-text-primary group-hover:text-brand transition-colors">
              Travel Manasvi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  to={link.path}
                  className={`font-medium text-sm transition-colors hover:text-brand ${location.pathname === link.path ? 'text-brand' : 'text-text-secondary'
                    }`}
                >
                  {link.text}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-text-secondary hover:text-brand transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            {user && (
              <NotificationBell
                notifications={notifications}
                onReadAll={handleReadAllNotifications}
              />
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {userInitials}
                </div>
                <ChevronDown size={16} className="text-text-secondary" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                      <p className="text-xs text-text-secondary">Customer Dashboard</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/user-dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-brand hover:bg-brand/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link
                        to="/user-dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-brand hover:bg-brand/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-text-secondary hover:text-brand transition-colors"
            >
              <Search size={22} />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="text-text-primary hover:text-brand transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations, tours, etc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 outline-none text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-primary"
                  >
                    <X size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* spacer for fixed nav */}
      <div className="h-[80px]"></div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl z-[70] overflow-y-auto"
            >
              <div className="p-5 bg-brand text-white">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white text-brand flex items-center justify-center font-bold text-sm">
                      TM
                    </div>
                    <span className="font-bold text-lg">Travel Manasvi</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-brand flex items-center justify-center font-bold">
                    {userInitials}
                  </div>
                  <div>
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-white/80">Customer</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.text}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.path
                        ? 'bg-brand/10 text-brand'
                        : 'text-text-secondary hover:bg-gray-50'
                      }`}
                  >
                    {link.text}
                  </Link>
                ))}

                <div className="my-4 border-t border-gray-100"></div>

                <Link
                  to="/user-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-brand"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link
                  to="/user-dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-brand"
                >
                  <User size={18} /> My Profile
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerNavbar;