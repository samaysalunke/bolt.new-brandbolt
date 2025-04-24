import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Analytics from './pages/Analytics';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import { Auth } from './pages/Auth';
import AuthCallback from './components/auth/AuthCallback';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

function App() {
  const { getCurrentUser, user, session } = useAuthStore();

  useEffect(() => {
    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await getCurrentUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getCurrentUser]);

  // Show loading state while checking authentication
  if (user === null && session === null) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/reset-password" element={<Auth />} />
        
        <Route
          path="/"
          element={user ? <Layout /> : <Navigate to="/auth" />}
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
    </BrowserRouter>
  );
}

export default App;