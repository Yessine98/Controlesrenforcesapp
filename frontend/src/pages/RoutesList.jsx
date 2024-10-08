// src/pages/RoutesList.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Register from './Register';
import AQPage from './AQPage'; 
import CQPage from './CQPage';
import ManagerPage from './ManagerPage'; // Import the ManagerPage
import { useAuthContext } from '../hooks/useAuthContext';

const RoutesList = () => {
  const { user } = useAuthContext(); // Access authentication context

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'AQ' ? "/aq/home" : user.role === 'manager' ? "/manager/home" : "/cq/home"} replace />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'AQ' ? "/aq/home" : user.role === 'manager' ? "/manager/home" : "/cq/home"} replace />} />

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

      {/* Redirect all other routes to login page */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RoutesList;
