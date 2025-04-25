import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const { user } = useAuthStore();
  const isLinkedInConnected = user?.app_metadata?.provider === 'linkedin_oidc';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not connected to LinkedIn, just show the outlet without navigation
  if (!isLinkedInConnected) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="lg:pl-64">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;