import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  VideoCameraIcon,
  CameraIcon,
  PlusCircleIcon,
  SparklesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { 
  PlusCircleIcon as PlusCircleSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  iconSolid?: React.ComponentType<any>;
  href: string;
  isFloating?: boolean;
}

export const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      id: 'short',
      label: 'Short',
      icon: VideoCameraIcon,
      href: '/learning'
    },
    {
      id: 'disease-detection',
      label: 'Disease Detection',
      icon: CameraIcon,
      href: '/disease-detection'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: PlusCircleIcon,
      iconSolid: PlusCircleSolid,
      href: '/disease-detection',
      isFloating: true
    },
    {
      id: 'garden-detection',
      label: 'Garden Detection',
      icon: SparklesIcon,
      href: '/digital-farm'
    },
    {
      id: 'eco-products',
      label: 'Eco Products',
      icon: ShoppingBagIcon,
      href: '/eco-products'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/disease-detection' && location.pathname === href) return true;
    return location.pathname === href;
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 relative">
            {/* Slot 1: Short */}
            <Link
              to={navItems[0].href}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors duration-200 ${
                isActive(navItems[0].href)
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {React.createElement(navItems[0].icon, { className: "h-6 w-6 mb-1" })}
              <span className="text-xs font-medium text-center">{navItems[0].label}</span>
            </Link>

            {/* Slot 2: Disease Detection */}
            <Link
              to={navItems[1].href}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors duration-200 ${
                isActive(navItems[1].href)
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {React.createElement(navItems[1].icon, { className: "h-6 w-6 mb-1" })}
              <span className="text-xs font-medium text-center">{navItems[1].label}</span>
            </Link>

            {/* Slot 3: Empty placeholder for FAB */}
            <div className="w-16"></div>

            {/* Slot 4: Garden Detection */}
            <Link
              to={navItems[3].href}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors duration-200 ${
                isActive(navItems[3].href)
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {React.createElement(navItems[3].icon, { className: "h-6 w-6 mb-1" })}
              <span className="text-xs font-medium text-center">{navItems[3].label}</span>
            </Link>

            {/* Slot 5: Eco Products */}
            <Link
              to={navItems[4].href}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors duration-200 ${
                isActive(navItems[4].href)
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {React.createElement(navItems[4].icon, { className: "h-6 w-6 mb-1" })}
              <span className="text-xs font-medium text-center">{navItems[4].label}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* FAB positioned absolutely */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Link
          to={navItems[2].href}
          className={`block transition-all duration-200 ${
            isActive(navItems[2].href) 
              ? 'scale-110' 
              : 'hover:scale-105'
          }`}
        >
          <div className={`relative ${
            isActive(navItems[2].href)
              ? 'bg-green-600 shadow-lg' 
              : 'bg-white shadow-md hover:shadow-lg'
          } rounded-full p-4 border-2 border-gray-100`}>
            {navItems[2].iconSolid && React.createElement(navItems[2].iconSolid, {
              className: `h-8 w-8 ${isActive(navItems[2].href) ? 'text-white' : 'text-gray-700'}`
            })}
          </div>
          <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap ${
            isActive(navItems[2].href) ? 'text-green-600' : 'text-gray-600'
          }`}>
            {navItems[2].label}
          </span>
        </Link>
      </div>
    </>
  );
};
