import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({
  adminOnly = false,
  roles,                   // e.g., ['admin', 'manager']
  redirectTo = '/login',
  children
}) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loader fullScreen label="Loading..." />;

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (adminOnly && role !== 'admin') return <Navigate to="/user-dashboard" replace />;

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;