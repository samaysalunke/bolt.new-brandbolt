import React, { useEffect, memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Analytics from './pages/Analytics';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import { AuthCallback } from './pages/AuthCallback';

// Memoize the routes component to prevent unnecessary re-renders
const AppRoutes = memo(function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="content" element={<Content />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
});

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}