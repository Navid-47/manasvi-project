import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllBookings } from '../../services/bookingService';
import { getAllPackages } from '../../services/packageService';
import { TrendingUp, Users, ShoppingBag, CreditCard, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

function MiniAreaChart({ series, color }) {
  const max = Math.max(...series.map(p => p.revenue), 1);
  const points = series.map((p, i) => {
    const x = (i / (series.length - 1)) * 100;
    const y = 100 - (p.revenue / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-16 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Gradient fill */}
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={`text-${color}-500`} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={`text-${color}-500`} />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} />
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-${color}-500`} />
      </svg>
    </div>
  );
}

function buildRevenueSeries(bookings) {
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now);
    d.setMonth(now.getMonth() - (5 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const totals = months.reduce((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {});

  bookings.forEach((b) => {
    if (b.status !== 'Confirmed' || !b.createdAt) return;
    const d = new Date(b.createdAt);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (Object.prototype.hasOwnProperty.call(totals, key)) {
      totals[key] += Number(b.amount) || 0;
    }
  });

  return months.map((m) => ({ month: m, revenue: totals[m] || 0 }));
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick, chartData }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer relative overflow-hidden group"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>

    {chartData ? (
      <div className="-mx-6 -mb-6 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <MiniAreaChart series={chartData} color={color} />
      </div>
    ) : (
      <div className="flex items-center text-sm">
        <span className={`text-${color}-600 font-medium bg-${color}-50 px-2 py-0.5 rounded mr-2`}>
          {subtitle.split(' ')[0]}
        </span>
        <span className="text-text-muted text-xs">{subtitle.split(' ').slice(1).join(' ')}</span>
      </div>
    )}
  </motion.div>
);

export default function AdminDashboard({ standalone = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Admin';

  const bookings = getAllBookings();
  const packages = getAllPackages();
  const revenueSeries = buildRevenueSeries(bookings);

  const totalRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((s, b) => s + (b.amount || 0), 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const activePackages = packages.filter(p => p.active).length;

  const recent = [...bookings]
    .filter((b) => b.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const revenueByPackageId = confirmedBookings.reduce((acc, b) => {
    const pkgId = b.packageId || b.package_id || b.package || 'unknown';
    const amount = Number(b.amount) || 0;
    if (!acc[pkgId]) {
      acc[pkgId] = { id: pkgId, revenue: 0, count: 0 };
    }
    acc[pkgId].revenue += amount;
    acc[pkgId].count += 1;
    return acc;
  }, {});

  const packagesById = new Map((packages || []).map((p) => [String(p.id), p]));
  const topPackages = Object.values(revenueByPackageId)
    .map((entry) => {
      const pkgMeta = packagesById.get(String(entry.id));
      return {
        id: entry.id,
        name: pkgMeta?.name || pkgMeta?.title || entry.id || 'Travel Package',
        revenue: entry.revenue,
        count: entry.count,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const avgOrderValue = bookings.length ? Math.round(totalRevenue / Math.max(1, bookings.filter(b => b.status === 'Confirmed').length)) : 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome back, {userName}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Activity size={16} /> Reports
          </button>
          <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium shadow-lg shadow-brand/25 hover:bg-brand-dark flex items-center gap-2">
            <ChevronRight size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
          chartData={revenueSeries}
          onClick={() => navigate('/admin-dashboard/payments')}
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle={`${pendingCount} pending approval`}
          icon={ShoppingBag}
          color="purple"
          onClick={() => navigate('/admin-dashboard/bookings')}
        />
        <StatCard
          title="Active Packages"
          value={activePackages}
          subtitle={`${packages.length} total available`}
          icon={Package} // Using Package from Lucide (needs import if not global, assuming imported)
          color="emerald"
          onClick={() => navigate('/admin-dashboard/packages')}
        />
        <StatCard
          title="Avg. Order Value"
          value={`₹${avgOrderValue.toLocaleString()}`}
          subtitle="+12% vs last month"
          icon={CreditCard}
          color="amber"
          onClick={() => navigate('/admin-dashboard/analytics')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-text-primary">Revenue Overview</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-brand/20">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-64 w-full">
            {/* Simple SVG Chart Reimplementation */}
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="mainChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const max = Math.max(...revenueSeries.map(p => p.revenue), 1) * 1.2;
                const points = revenueSeries.map((p, i) => {
                  const x = (i / (revenueSeries.length - 1)) * 100;
                  const y = 50 - (p.revenue / max) * 50;
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <>
                    <polygon points={`0,50 ${points} 100,50`} fill="url(#mainChartGrad)" />
                    <polyline points={points} fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* X Axis Labels */}
                    {revenueSeries.map((p, i) => (
                      <text key={i} x={(i / (revenueSeries.length - 1)) * 100} y="55" fontSize="2" fill="#94a3b8" textAnchor="middle">{p.month.split('-')[1]}</text>
                    ))}
                  </>
                )
              })()}
            </svg>
          </div>
        </div>

        {/* Recent Bookings & Top Packages */}
        <div className="space-y-6">
          {/* Recent Bookings List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-text-primary mb-4">Recent Bookings</h3>
            <div className="space-y-4">
              {recent.map(b => (
                <div key={b.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{b.packageName || 'Travel Package'}</p>
                      <p className="text-xs text-text-secondary">{new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text-primary">₹{(Number(b.amount) || 0).toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
              {recent.length === 0 && <p className="text-text-muted text-sm">No recent bookings found.</p>}
            </div>
          </div>

          {/* Top Packages */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-text-primary mb-4">Top Packages</h3>
            <div className="space-y-3">
              {topPackages.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-text-secondary">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-text-primary truncate max-w-[150px]">{p.name}</span>
                      <span className="text-xs font-bold text-text-primary">₹{p.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-brand h-1.5 rounded-full" style={{ width: `${Math.min((p.count / 10) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
              {topPackages.length === 0 && <p className="text-text-muted text-sm">No package data available.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper for icon since we used it in the render function
function Package(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22v-10" />
    </svg>
  )
}

