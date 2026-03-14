import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Video } from '../types';
import { PlayIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export const Learning: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📚' },
    { value: 'organic_farming', label: 'Organic Farming', icon: '🌱' },
    { value: 'water_conservation', label: 'Water Conservation', icon: '💧' },
    { value: 'soil_health', label: 'Soil Health', icon: '🌍' },
    { value: 'natural_pest_control', label: 'Natural Pest Control', icon: '🐛' }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const videosCollection = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosData = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Video));
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">📚 Learning Center</h1>
            <p className="mt-1 text-sm text-gray-600">
              Video tutorials for sustainable farming practices
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-t-lg">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                    {categories.find(c => c.value === video.category)?.icon}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{video.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">
                    {video.category.replace('_', ' ')}
                  </span>
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Watch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No videos found in this category.</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🌱 Featured Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌾</div>
              <h3 className="font-semibold text-gray-900">Organic Methods</h3>
              <p className="text-sm text-gray-600 mt-1">Learn chemical-free farming</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-semibold text-gray-900">Water Saving</h3>
              <p className="text-sm text-gray-600 mt-1">Efficient irrigation techniques</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-semibold text-gray-900">Soil Health</h3>
              <p className="text-sm text-gray-600 mt-1">Maintain fertile soil naturally</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🐛</div>
              <h3 className="font-semibold text-gray-900">Pest Control</h3>
              <p className="text-sm text-gray-600 mt-1">Natural pest management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
