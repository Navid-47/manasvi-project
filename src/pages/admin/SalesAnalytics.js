import React, { useState } from 'react';
import { getAllBookings } from '../../services/bookingService';
import { TrendingUp, Users, ShoppingBag, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Check } from 'lucide-react';
import { motion } from 'framer-motion';

function SimpleBarChart({ data, height = 200, color = "bg-brand" }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 w-full" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="relative w-full flex items-end justify-center h-full">
            <div
              className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 group-hover:opacity-80 ${color}`}
              style={{ height: `${(d.value / max) * 100}%` }}
            ></div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
              {d.label}: {d.value}
            </div>
          </div>
          <span className="text-xs text-text-secondary font-medium truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleLineChart({ points, height = 200 }) {
  const max = Math.max(...points.map(p => p.value), 1);
  const min = 0;

  // Create path
  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - (p.value / max) * 100;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create area path
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full relative overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f3f4f6" strokeWidth="0.5" />
        ))}

        {/* Area */}
        <path d={areaD} fill="url(#gradient)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points - only show on hover logic ideally, but for now show all or endpoints */}
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * 100;
          const y = 100 - (p.value / max) * 100;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" className="fill-brand stroke-white stroke-[0.5]" />
          );
        })}
      </svg>
    </div>
  );
}

export default function SalesAnalytics() {
  const bookings = getAllBookings();
  const [range, setRange] = useState('30');

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - Number(range));

  const inRange = bookings.filter(b => new Date(b.createdAt) >= start);
  const confirmed = inRange.filter(b => b.status === 'Confirmed');

  const revenueByDayMap = new Map();
  confirmed.forEach(b => {
    const key = new Date(b.createdAt).toISOString().slice(0, 10);
    revenueByDayMap.set(key, (revenueByDayMap.get(key) || 0) + (b.amount || 0));
  });

  const dayKeys = Array.from({ length: Number(range) + 1 }).map((_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const revenueSeries = dayKeys.map(k => ({ label: k.slice(5), value: revenueByDayMap.get(k) || 0 }));

  const destinationCounts = inRange.reduce((acc, b) => {
    acc[b.destination] = (acc[b.destination] || 0) + 1;
    return acc;
  }, {});

  const topDestBars = Object.entries(destinationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const totalInRange = inRange.length;
  const totalConfirmed = confirmed.length;
  const conversionRate = totalInRange ? Math.round((totalConfirmed / totalInRange) * 100) : 0;
  const totalRevenue = confirmed.reduce((s, b) => s + (b.amount || 0), 0);

  // Compare with previous period (Simple Mock for UI)
  const growth = Math.random() > 0.5 ? 12 : -5;

  const revenueByPackage = confirmed.reduce((acc, b) => {
    const key = b.packageName || b.destination || 'Package';
    acc[key] = (acc[key] || 0) + (b.amount || 0);
    return acc;
  }, {});

  const topPackageBars = Object.entries(revenueByPackage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const revenueByCustomer = confirmed.reduce((acc, b) => {
    const key = b.userEmail || b.customer || 'Customer';
    acc[key] = (acc[key] || 0) + (b.amount || 0);
    return acc;
  }, {});

  const topCustomerBars = Object.entries(revenueByCustomer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sales Analytics</h1>
          <p className="text-text-secondary">Track your sales performance and revenue growth.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-secondary">Time Range:</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-white border border-gray-200 text-text-primary text-sm rounded-xl focus:ring-brand focus:border-brand block p-2.5 outline-none"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', trend: 12 },
          { label: 'Total Bookings', value: totalInRange, icon: ShoppingBag, color: 'text-blue-600', trend: 8 },
          { label: 'Confirmed', value: totalConfirmed, icon: Check, color: 'text-purple-600', trend: 5 },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-orange-600', trend: -2 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-text-primary">Revenue Trends</h3>
            <button className="text-brand text-sm font-medium hover:underline">View Report</button>
          </div>
          <div className="h-[300px]">
            <SimpleLineChart points={revenueSeries} height={300} />
            <div className="flex justify-between mt-4 text-xs text-text-secondary">
              {revenueSeries.filter((_, i) => i % Math.ceil(revenueSeries.length / 6) === 0).map(p => (
                <span key={p.label}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6">Top Destinations</h3>
          {topDestBars.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-text-muted">
              <p>No data available</p>
            </div>
          ) : (
            <SimpleBarChart data={topDestBars} height={300} color="bg-blue-500" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Packages */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6">Top Packages (Revenue)</h3>
          {topPackageBars.length === 0 ? (
            <div className="text-center py-10 text-text-secondary">No data available</div>
          ) : (
            <SimpleBarChart data={topPackageBars} height={200} color="bg-purple-500" />
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6">Top Customers (Revenue)</h3>
          {topCustomerBars.length === 0 ? (
            <div className="text-center py-10 text-text-secondary">No data available</div>
          ) : (
            <SimpleBarChart data={topCustomerBars} height={200} color="bg-orange-500" />
          )}
        </div>
      </div>
    </div>
  );
}


