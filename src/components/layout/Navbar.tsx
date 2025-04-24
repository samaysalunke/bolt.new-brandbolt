import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import Button from '../common/Button';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, signInWithLinkedIn } = useAuthStore();
  const isLinkedInConnected = user?.app_metadata?.provider === 'linkedin';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block">
            <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="py-2 pl-10 pr-3 w-64 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search..."
            />
          </div>
          
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {!isLinkedInConnected && (
            <Button 
              variant="primary" 
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => signInWithLinkedIn()}
            >
              Connect LinkedIn
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;