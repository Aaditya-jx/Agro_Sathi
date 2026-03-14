import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Scheme } from '../types';
import { BuildingOfficeIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const Schemes: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(true);

  const states = [
    'all', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const schemesCollection = collection(db, 'schemes');
      const schemesSnapshot = await getDocs(schemesCollection);
      const schemesData = schemesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Scheme));
      setSchemes(schemesData);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = selectedState === 'all' 
    ? schemes 
    : schemes.filter(scheme => scheme.state === selectedState);

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
            <h1 className="text-3xl font-bold text-gray-900">🏛️ Government Schemes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Discover agricultural schemes and benefits for farmers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* State Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{scheme.schemeName}</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      {scheme.state}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Eligibility</h4>
                    <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Benefits</h4>
                    <p className="text-sm text-gray-600">{scheme.benefits}</p>
                  </div>
                  
                  {scheme.deadline && (
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {scheme.applicationLink && (
                  <div className="mt-4">
                    <a
                      href={scheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                    >
                      Apply Now
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No schemes found for the selected state.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">📋 How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-blue-800">
            <div>
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="font-semibold mb-2">Check Eligibility</h3>
              <p>Review the eligibility criteria for the scheme</p>
            </div>
            <div>
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="font-semibold mb-2">Gather Documents</h3>
              <p>Collect required documents and certificates</p>
            </div>
            <div>
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="font-semibold mb-2">Fill Application</h3>
              <p>Complete the application form accurately</p>
            </div>
            <div>
              <div className="text-2xl mb-2">4️⃣</div>
              <h3 className="font-semibold mb-2">Submit & Track</h3>
              <p>Submit application and track its status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
