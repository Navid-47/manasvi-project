import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock } from 'lucide-react';

const NotificationBell = ({ notifications = [], onReadAll, isScrolled, isHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-300 hover:bg-current/10 ${(!isScrolled && isHome) ? 'text-white' : 'text-text-secondary hover:text-brand'
          }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-sm text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-sm">
                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                    No notifications yet
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {notifications.slice(0, 6).map((n) => (
                      <li
                        key={n.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-brand' : 'bg-gray-300'}`} />
                          <div>
                            <p className={`text-sm ${!n.read ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                              {n.title}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                              <Clock size={10} />
                              <span>{n.time}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    onReadAll?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  <Check size={16} /> Mark all as read
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;