import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, LogOut, LayoutDashboard, ChevronDown, Bell } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { getNotificationsForUser, markAllAsReadForUser } from '../services/notificationService';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notifications logic
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }
    const refresh = () => {
      try {
        setNotifications(getNotificationsForUser(user));
      } catch (e) { console.error(e); }
    };
    refresh();
    window.addEventListener('tm_notifications_updated', refresh);
    return () => window.removeEventListener('tm_notifications_updated', refresh);
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    // Add actual search logic here or navigation
    console.log('Searching:', searchTerm);
    setSearchTerm('');
  };

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Destinations', path: '/destinations' },
    { text: 'Tours', path: '/tours' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'User');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-glass py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-lg w-10 h-10 shadow-lg">
                <img
                  src="/images/logo.jpg"
                  alt="Travel Manasvi"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40'; }}
                />
              </div>
              <span className={`text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-dark transition-all duration-300 ${!isScrolled && location.pathname === '/' ? 'text-white' : ''}`}>
                Travel Manasvi
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  to={link.path}
                  className={`relative font-medium text-sm transition-colors duration-300 hover:text-brand ${location.pathname === link.path
                    ? 'text-brand'
                    : (!isScrolled && location.pathname === '/') ? 'text-white/90 hover:text-white' : 'text-text-secondary'
                    }`}
                >
                  {link.text}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </Link>
              ))}

              <div className="flex items-center gap-4 pl-4 border-l border-gray-200/20">
                {/* Search Toggle */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`transition-colors duration-300 ${(!isScrolled && location.pathname === '/') ? 'text-white hover:text-brand-light' : 'text-text-secondary hover:text-brand'}`}
                >
                  <Search size={20} />
                </button>

                {/* Notifications */}
                {isAuthenticated && (
                  <NotificationBell
                    notifications={notifications}
                    onReadAll={() => user && markAllAsReadForUser(user)}
                    isScrolled={isScrolled}
                    isHome={location.pathname === '/'}
                  />
                )}

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-secondary flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white/20">
                        {userInitials}
                      </div>
                      <ChevronDown size={16} className={(!isScrolled && location.pathname === '/') ? 'text-white' : 'text-text-secondary'} />
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
                            <p className="text-xs text-text-secondary truncate">{user.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-brand hover:bg-brand/5 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard size={16} /> Dashboard
                            </Link>
                            <Link
                              to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard/profile'}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-brand hover:bg-brand/5 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <User size={16} /> Profile
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
                ) : (
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-gradient-to-r from-brand to-brand-dark text-white rounded-full font-medium text-sm shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-4">
              {(!isScrolled && location.pathname === '/') ? (
                <button onClick={() => setMobileOpen(true)} className="text-white">
                  <Menu size={24} />
                </button>
              ) : (
                <button onClick={() => setMobileOpen(true)} className="text-text-primary">
                  <Menu size={24} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-white shadow-lg overflow-hidden border-t border-gray-100"
            >
              <div className="container mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">
                    TM
                  </div>
                  <span className="font-bold text-lg">Travel Manasvi</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.text}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-xl transition-all ${location.pathname === link.path
                        ? 'bg-brand/10 text-brand font-bold'
                        : 'text-text-primary hover:bg-gray-50'
                        }`}
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>

                {isAuthenticated && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Account</p>
                    <Link
                      to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-text-primary"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                      to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard/profile'}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-text-primary"
                    >
                      <User size={18} /> My Profile
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full py-3 bg-brand text-white text-center rounded-xl font-bold shadow-lg shadow-brand/20"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;