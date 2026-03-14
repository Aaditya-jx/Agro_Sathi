import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Crop } from '../types';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export const CropAdvisory: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [loading, setLoading] = useState(true);

  const seasons = ['all', 'summer', 'winter', 'monsoon', 'spring'];

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, selectedSeason]);

  const fetchCrops = async () => {
    try {
      const cropsCollection = collection(db, 'crops');
      const cropsSnapshot = await getDocs(cropsCollection);
      const cropsData = cropsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Crop));
      setCrops(cropsData);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = crops;

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(crop => crop.season === selectedSeason);
    }

    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCrops(filtered);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">🌾 Crop Advisory</h1>
            <p className="mt-1 text-sm text-gray-600">
              Get eco-friendly guidance for sustainable farming
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {seasons.map(season => (
                  <option key={season} value={season}>
                    {season === 'all' ? 'All Seasons' : season.charAt(0).toUpperCase() + season.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredCrops.length} of {crops.length} crops
          </p>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {crop.imageUrl && (
                <img
                  src={crop.imageUrl}
                  alt={crop.cropName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{crop.cropName}</h3>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-2">
                  {crop.season}
                </span>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Soil Type:</span>
                    <span className="ml-2 text-gray-600">{crop.soilType}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Water Requirement:</span>
                    <span className="ml-2 text-gray-600">{crop.waterRequirement}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">🌱 Organic Fertilizer</h4>
                  <p className="text-sm text-gray-600">{crop.organicFertilizer}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">🔄 Crop Rotation</h4>
                  <p className="text-sm text-gray-600">{crop.cropRotation}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">{crop.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No crops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
