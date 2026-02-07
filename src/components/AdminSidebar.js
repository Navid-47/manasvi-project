import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarRange, Package, CreditCard, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar({ collapsed, mobile, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/admin-dashboard/bookings', icon: CalendarRange, label: 'Bookings' },
    { to: '/admin-dashboard/packages', icon: Package, label: 'Packages' },
    { to: '/admin-dashboard/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin-dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`h-full flex flex-col py-4 ${mobile ? 'px-4' : 'px-2'}`}>
      <div className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `
              relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-brand/10 text-brand font-medium'
                : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon size={22} strokeWidth={2} className="flex-shrink-0" />

            {!collapsed && (
              <span className="ml-3 truncate">{item.label}</span>
            )}

            {/* Tooltip for collapsed mode */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group text-red-500 hover:bg-red-50
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={22} strokeWidth={2} className="flex-shrink-0" />
          {!collapsed && (
            <span className="ml-3 truncate font-medium">Logout</span>
          )}
          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
