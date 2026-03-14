import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon,
  BellIcon,
  SunIcon 
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, showNotifications = false }) => {

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Center - Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <SunIcon className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AgroSathi</span>
            </div>
          </div>

          {/* Right - Notifications */}
          <div className="flex items-center">
            <Link 
              to="/notifications" 
              className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            >
              <BellIcon className="h-6 w-6" />
              {showNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
