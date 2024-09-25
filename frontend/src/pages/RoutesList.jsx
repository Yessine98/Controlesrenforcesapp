// src/pages/RoutesList.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Register from './Register';
import AQPage from './AQPage'; 
import CQPage  from './CQPage';
import { useAuthContext } from '../hooks/useAuthContext';

const RoutesList = () => {
  const { user } = useAuthContext(); // Access authentication context

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'AQ' ? "/aq/home" : "/cq/home"} replace />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'AQ' ? "/aq/home" : "/cq/home"} replace />} />

      {/* Protected Routes for AQ users */}
      {user && user.role === 'AQ' && (
        <Route path="/aq/*" element={<AQPage />} />
      )}

      {user && user.role === 'CQ' && (
        <Route path="/cq/*" element={<CQPage />} />
      )}
      {/* Add CQ routes here if needed */}

      {/* Redirect all other routes to login page */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RoutesList;
