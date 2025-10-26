import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false, redirectTo = '/login' }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (adminOnly && role !== 'admin') return <Navigate to="/user-dashboard" replace />;

  return <Outlet />;
};

export default ProtectedRoute;