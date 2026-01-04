// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navbar, { NavbarSpacer } from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/public/Home';
import Destinations from './pages/public/Destinations';
import Tours from './pages/public/Tours';
import PackageDetails from './pages/public/PackageDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/errors/NotFound';

// Customer Dashboard pages
import Dashboard from './pages/customer/Dashboard';
import DashboardHome from './pages/customer/DashboardHome';
import MyBookings from './pages/customer/MyBookings';
import PaymentHistory from './pages/customer/PaymentHistory';
import Profile from './pages/customer/Profile';
import Wallet from './pages/customer/Wallet';
import BookingForm from './pages/customer/BookingForm';
import BookingSummary from './pages/customer/BookingSummary';
import Invoice from './pages/customer/Invoice';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManagePackages from './pages/admin/ManagePackages';
import PaymentReports from './pages/admin/PaymentReports';
import SalesAnalytics from './pages/admin/SalesAnalytics';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailure from './pages/payment/PaymentFailure';
import PaymentCheckout from './pages/payment/PaymentCheckout';

function AppContent() {
  const location = useLocation();
  // Hide the public Navbar/Footer on customer dashboard, admin dashboard, and auth pages
  const isCustomerDashboard = location.pathname.startsWith('/user-dashboard');
  const isAdminDashboard = location.pathname.startsWith('/admin-dashboard');
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const showPublicShell = !(isCustomerDashboard || isAdminDashboard || isAuthPage);

  return (
    <div className="App flex flex-col min-h-screen">
      <ScrollToTop />
      {showPublicShell && <Navbar />}
      {showPublicShell && <NavbarSpacer />}
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:packageId" element={<PackageDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Booking & payment flow (authenticated users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/book/:packageId" element={<BookingForm />} />
            <Route path="/booking/:bookingId/summary" element={<BookingSummary />} />
            <Route path="/booking/:bookingId/invoice" element={<Invoice />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/payment/processing" element={<PaymentCheckout />} />
          </Route>

          {/* Admin Dashboard (renders its own AdminLayout + Sidebar + Footer) */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin-dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboard standalone={false} />} />
              <Route path="bookings" element={<ManageBookings standalone={false} />} />
              <Route path="packages" element={<ManagePackages standalone={false} />} />
              <Route path="payments" element={<PaymentReports standalone={false} />} />
              <Route path="analytics" element={<SalesAnalytics standalone={false} />} />
            </Route>
          </Route>

          {/* Customer Dashboard (renders its own CustomerNavbar + Footer) */}
          <Route element={<ProtectedRoute roles={['customer', 'user', 'admin']} />}>
            <Route path="/user-dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="wallet" element={<Wallet />} />
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showPublicShell && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;