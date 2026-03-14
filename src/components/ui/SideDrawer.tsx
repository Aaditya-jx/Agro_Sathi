import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  CalendarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CubeIcon,
  SparklesIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  isAdmin?: boolean;
  isLogout?: boolean;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();
  
  const drawerItems: DrawerItem[] = [
    {
      id: 'events',
      label: 'Events',
      icon: CalendarIcon,
      href: '/events'
    },
    {
      id: 'schemes',
      label: 'Government Schemes',
      icon: BuildingOfficeIcon,
      href: '/schemes'
    },
    {
      id: 'expense-tracker',
      label: 'Expense Tracker',
      icon: CurrencyDollarIcon,
      href: '/expense-tracker'
    },
    {
      id: 'digital-farm',
      label: 'Digital Farm',
      icon: CubeIcon,
      href: '/digital-farm'
    },
    {
      id: 'crop-advisory',
      label: 'Crop Advisory',
      icon: SparklesIcon,
      href: '/crop-advisory'
    }
  ];

  // Add admin item if user is admin
  if (userRole === 'admin') {
    drawerItems.push({
      id: 'admin',
      label: 'ADMIN',
      icon: UserGroupIcon,
      href: '/admin',
      isAdmin: true
    });
  }

  // Add logout button
  drawerItems.push({
    id: 'logout',
    label: 'LOGOUT',
    icon: ArrowRightOnRectangleIcon,
    href: '/login',
    isLogout: true
  });

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    // Clear any auth state and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {drawerItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            if (item.isLogout) {
              return (
                <button
                  key={item.id}
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            }
            
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  item.isAdmin
                    ? active
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                    : active
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>AgroSathi v1.0</p>
            <p className="text-xs mt-1">Sustainable Farming Companion</p>
          </div>
        </div>
      </div>
    </>
  );
};
