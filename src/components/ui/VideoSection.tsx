import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
}

interface VideoSectionProps {
  videos?: Video[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ 
  videos = [
    {
      id: '1',
      title: 'Organic Farming Tips',
      thumbnail: 'https://picsum.photos/400/225?random=1',
      duration: '5:23'
    },
    {
      id: '2',
      title: 'Crop Disease Prevention',
      thumbnail: 'https://picsum.photos/400/225?random=2',
      duration: '3:45'
    }
  ]
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Videos</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {videos.map((video) => (
          <div 
            key={video.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            {/* Video Thumbnail Container */}
            <div className="relative group cursor-pointer">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <PlayIcon className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              
              {/* Duration Badge */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </div>
            
            {/* Video Title */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Indicator */}
      {videos.length > 2 && (
        <div className="text-center pt-2">
          <div className="inline-flex items-center text-sm text-gray-500">
            <span>Scroll for more videos</span>
            <svg className="w-4 h-4 ml-1 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
