import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import NotificationBell from '../../components/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { getNotificationsForUser, markAllAsReadForUser } from '../../services/notificationService';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop state
  const [mobileOpen, setMobileOpen] = useState(false);  // Mobile state
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'Admin');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  // Handle screen resize to auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Notifications logic
  useEffect(() => {
    if (!user) {
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
  }, [user]);

  const handleReadAllNotifications = () => {
    if (!user) return;
    try {
      markAllAsReadForUser(user);
    } catch { }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Top Navbar */}
      <header className="fixed top-0 right-0 left-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 flex items-center justify-between px-4 lg:px-8 transition-all duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.innerWidth < 1024 ? setMobileOpen(!mobileOpen) : setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary md:block hidden"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary md:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold shadow-lg shadow-brand/20">
              TM
            </div>
            <span className="font-display font-bold text-xl text-text-primary hidden sm:block">Travel Manasvi</span>
            <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-bold rounded-full border border-brand/20">ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell
            notifications={notifications}
            onReadAll={handleReadAllNotifications}
            isScrolled={true}
            isHome={false}
          />

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 pl-2 py-1 focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold shadow-md">
                {userInitials}
              </div>
              <ChevronDown size={16} className="text-text-muted group-hover:text-brand transition-colors" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                    <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-brand hover:bg-brand/5 transition-colors"
                    >
                      <LayoutDashboard size={16} /> Back to Site
                    </button>
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
      </header>

      {/* Main Layout */}
      <div className="flex pt-16 min-h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 bg-surface border-r border-gray-200 z-30 transition-all duration-300 overflow-y-auto hidden lg:block
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          <AdminSidebar collapsed={!sidebarOpen} mobile={false} onClose={() => { }} />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-64 bg-surface z-50 shadow-2xl lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">
                      TM
                    </div>
                    <span className="font-bold text-lg">Admin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                <div className="h-full overflow-y-auto">
                  <AdminSidebar collapsed={false} mobile={true} onClose={() => setMobileOpen(false)} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main
          className={`flex-grow p-6 transition-all duration-300 
            ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          `}
        >
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Footer />
      </div>
    </div>
  );
}
