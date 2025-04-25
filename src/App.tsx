import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Analytics from './pages/Analytics';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import { Auth } from './pages/Auth';
import { AuthCallback } from './components/auth/AuthCallback';
import { useAuth } from './modules/auth/hooks/useAuth';

function AppRoutes() {
  const { isAuthenticated, isInitialized, requireAuth, requireNoAuth } = useAuth();
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/auth');

  useEffect(() => {
    if (isAuthRoute) {
      requireNoAuth(location.pathname);
    } else {
      requireAuth(location.pathname);
    }
  }, [isAuthRoute, location.pathname, requireAuth, requireNoAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/reset-password" element={<Auth />} />
      
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="content" element={<Content />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="settings" element={<Settings />} />
        <Route path="goals" element={<div>Goals Page</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;