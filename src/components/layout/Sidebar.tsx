import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  PenSquare, 
  Calendar, 
  Award, 
  Settings, 
  LogOut, 
  Linkedin 
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { mockUser } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/' 
    },
    { 
      name: 'Analytics', 
      icon: <LineChart size={20} />, 
      path: '/analytics' 
    },
    { 
      name: 'Content Creator', 
      icon: <PenSquare size={20} />, 
      path: '/content' 
    },
    { 
      name: 'Calendar', 
      icon: <Calendar size={20} />, 
      path: '/calendar' 
    },
    { 
      name: 'Goals', 
      icon: <Award size={20} />, 
      path: '/goals' 
    },
    { 
      name: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/settings' 
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
          <div className="flex items-center">
            <Linkedin className="h-7 w-7 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">BrandBolt</h1>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <div className="flex-grow py-4">
            <ul className="px-2 space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center px-3 py-2.5 text-sm rounded-md font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 group transition-all"
                  >
                    <span className="mr-3 text-gray-500 group-hover:text-blue-600 transition-all">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center">
              <Avatar 
                src={mockUser.avatar} 
                alt={mockUser.name} 
                size="md" 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                <p className="text-xs text-gray-500">{mockUser.email}</p>
              </div>
              <button className="ml-auto p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;