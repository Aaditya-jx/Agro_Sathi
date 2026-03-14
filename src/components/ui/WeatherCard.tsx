import React from 'react';
import { SunIcon, CloudIcon, BoltIcon } from '@heroicons/react/24/outline';

interface WeatherCardProps {
  temperature?: number;
  description?: string;
  humidity?: number;
  rainfall?: number;
  icon?: 'sun' | 'cloud' | 'storm';
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  temperature = 28,
  description = 'Partly cloudy',
  humidity = 65,
  rainfall = 2.5,
  icon = 'sun'
}) => {
  const getWeatherIcon = () => {
    switch (icon) {
      case 'cloud':
        return <CloudIcon className="h-12 w-12 text-yellow-500" />;
      case 'storm':
        return <BoltIcon className="h-12 w-12 text-gray-600" />;
      default:
        return <SunIcon className="h-12 w-12 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold opacity-90">Today's Weather</h3>
        {getWeatherIcon()}
      </div>
      
      <div className="mb-4">
        <div className="text-4xl font-bold">{temperature}°C</div>
        <div className="text-blue-100 text-sm mt-1">{description}</div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-blue-100">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="mr-1">💧</span>
            {humidity}%
          </span>
          <span className="flex items-center">
            <span className="mr-1">🌧️</span>
            {rainfall}mm
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-400 border-opacity-30">
        <div className="text-sm text-blue-100">
          <span className="font-medium">Perfect for:</span>
          <span className="ml-2 font-semibold">Organic farming</span>
        </div>
      </div>
    </div>
  );
};
