import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import Register from './Register';
import AQPage from './AQPage'; 
import CQPage from './CQPage';
import ManagerPage from './ManagerPage';
import ForgotPassword from './ForgotPassword';
import { useAuthContext } from '../hooks/useAuthContext';
import AdminPage from './AdminPage';

const RoutesList = () => {
  const { user } = useAuthContext(); // Access authentication context
  const location = useLocation(); // Get current location

  const noPaddingRoutes = ['/login', '/register']; // Routes without padding
  const applyPadding = !noPaddingRoutes.includes(location.pathname); // Apply padding if the route is not in noPaddingRoutes

  return (
    <div style={{ paddingBottom: applyPadding ? '100px' : '0px', minHeight: 'calc(100vh - 200px)' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'AQ' ? "/aq/home" : user.role === 'manager' ? "/manager/home" : "/cq/home"} replace />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'AQ' ? "/aq/home" : user.role === 'manager' ? "/manager/home" :user.role ==='admin'?'/admin/users': "/cq/home"} replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes for AQ users */}
        {user && user.role === 'AQ' && (
          <Route path="/aq/*" element={<AQPage />} />
        )}

        {/* Protected Routes for CQ users */}
        {user && user.role === 'CQ' && (
          <Route path="/cq/*" element={<CQPage />} />
        )}

        {/* Protected Routes for Manager users */}
        {user && user.role === 'manager' && (
          <Route path="/manager/*" element={<ManagerPage />} />
        )}

        {/* Protected Routes for Admin users */}
        {user && user.role === 'admin' && (
          <Route path="/admin/*" element={<AdminPage />} />
        )}

        {/* Redirect all other routes to login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default RoutesList;
