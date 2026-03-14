import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CarbonCreditService } from '../services/carbonCreditService';
import type { 
  CarbonSequestration, 
  SustainabilityMetrics, 
  CertificationReport, 
  MarketplaceListing 
} from '../types/carbonCredits';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  SunIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const CarbonCredits: React.FC = () => {
  const { user } = useAuth();
  const [carbonSequestrations, setCarbonSequestrations] = useState<CarbonSequestration[]>([]);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetrics[]>([]);
  const [certifications, setCertifications] = useState<CertificationReport[]>([]);
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<CertificationReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [cropType, setCropType] = useState('wheat');
  const [farmArea, setFarmArea] = useState(5);
  const [farmName, setFarmName] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [sustainabilityPractices, setSustainabilityPractices] = useState({
    cropRotation: false,
    organicFarming: false,
    waterConservation: false,
    renewableEnergy: false,
    wasteManagement: false,
    soilHealth: 50,
    biodiversity: 50
  });

  const carbonService = CarbonCreditService.getInstance();

  useEffect(() => {
    fetchCarbonData();
  }, [user]);

  const fetchCarbonData = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, these would fetch from Firestore
      // For now, we'll use empty arrays
      setCarbonSequestrations([]);
      setSustainabilityMetrics([]);
      setCertifications([]);
      setMarketplaceListings([]);
    } catch (error) {
      console.error('Error fetching carbon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCarbonSequestration = () => {
    try {
      const sequestration = carbonService.calculateCarbonSequestration(
        'temp_farm_id',
        cropType,
        farmArea
      );
      
      toast.success(`Calculated ${sequestration.carbonCredits} carbon credits!`);
      setShowCalculationModal(false);
      
      // In a real implementation, save to Firestore
      setCarbonSequestrations([...carbonSequestrations, sequestration]);
    } catch (error) {
      console.error('Error calculating carbon sequestration:', error);
      toast.error('Error calculating carbon sequestration');
    }
  };

  const generateCertification = () => {
    try {
      const metrics = carbonService.calculateSustainabilityMetrics(
        'temp_farm_id',
        sustainabilityPractices
      );
      
      const certification = carbonService.generateCertificationReport(
        'temp_farm_id',
        farmName,
        farmerName,
        metrics,
        metrics.carbonSequestration
      );
      
      toast.success(`Generated ${certification.certificationLevel} certification!`);
      setShowCertificationModal(false);
      setSelectedCertification(certification);
      
      // In a real implementation, save to Firestore
      setCertifications([...certifications, certification]);
      setSustainabilityMetrics([...sustainabilityMetrics, metrics]);
    } catch (error) {
      console.error('Error generating certification:', error);
      toast.error('Error generating certification');
    }
  };

  const createMarketplaceListing = () => {
    try {
      const latestCertification = certifications[certifications.length - 1];
      if (!latestCertification) {
        toast.error('Please generate a certification first');
        return;
      }

      const listing = carbonService.createMarketplaceListing(
        latestCertification.farmId,
        latestCertification.carbonCredits,
        carbonService.getCurrentCarbonPrice(),
        latestCertification.farmName,
        'India',
        'Sustainable Farm'
      );
      
      toast.success('Created marketplace listing!');
      setShowMarketplaceModal(false);
      
      // In a real implementation, save to Firestore
      setMarketplaceListings([...marketplaceListings, listing]);
    } catch (error) {
      console.error('Error creating marketplace listing:', error);
      toast.error('Error creating marketplace listing');
    }
  };

  const getCertificationColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCertificationIcon = (level: string) => {
    switch (level) {
      case 'platinum': return '🏆';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🏅';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <SunIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-green-600" />
                Smart Carbon Credits
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Calculate carbon sequestration, earn credits, and generate sustainability certifications
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setShowCalculationModal(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
              >
                <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Calculate Credits
              </button>
              <button
                onClick={() => setShowCertificationModal(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Get Certified
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <SunIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Carbon Credits</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {carbonSequestrations.reduce((sum, s) => sum + s.carbonCredits, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Potential Earnings</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{(carbonSequestrations.reduce((sum, s) => sum + s.carbonCredits, 0) * carbonService.getCurrentCarbonPrice()).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <CheckCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certifications</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {certifications.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <GlobeAltIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CO₂ Sequestered</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {carbonSequestrations.reduce((sum, s) => sum + s.totalSequestration, 0).toFixed(1)} tons
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Certifications */}
        {certifications.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Certifications</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCertificationIcon(cert.certificationLevel)}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{cert.farmName}</h3>
                            <p className="text-sm text-gray-600">{cert.farmerName}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationColor(cert.certificationLevel)}`}>
                            {cert.certificationLevel.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">
                            {cert.carbonCredits} carbon credits
                          </span>
                          <span className="text-sm text-gray-600">
                            Score: {cert.sustainabilityScore}/100
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCertification(cert)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setShowMarketplaceModal(true)}
                          className="p-2 text-green-600 hover:text-green-900"
                        >
                          <CurrencyDollarIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Marketplace Listings */}
        {marketplaceListings.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Marketplace Listings</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {marketplaceListings.map((listing) => (
                  <div key={listing.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{listing.description}</h3>
                        <p className="text-sm text-gray-600 mt-1">{listing.location}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {listing.carbonCredits} credits available
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            ₹{listing.pricePerCredit}/credit
                          </span>
                          <span className="text-sm text-gray-600">
                            Total: ₹{listing.totalValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        listing.status === 'active' ? 'bg-green-100 text-green-800' :
                        listing.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {listing.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {certifications.length === 0 && (
          <div className="text-center py-12">
            <SunIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No carbon credits yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by calculating your carbon sequestration and getting certified
            </p>
            <div className="mt-6 space-x-3">
              <button
                onClick={() => setShowCalculationModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Calculate Credits
              </button>
              <button
                onClick={() => setShowCertificationModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Get Certified
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Carbon Calculation Modal */}
      {showCalculationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCalculationModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:max-h-[90vh] sm:overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Calculate Carbon Credits</h3>
                  <button
                    onClick={() => setShowCalculationModal(false)}
                    className="text-gray-400 hover:text-gray-500 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                    <select
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base"
                    >
                      <option value="wheat">Wheat</option>
                      <option value="rice">Rice</option>
                      <option value="corn">Corn</option>
                      <option value="tomato">Tomato</option>
                      <option value="cotton">Cotton</option>
                      <option value="pulses">Pulses</option>
                      <option value="millets">Millets</option>
                      <option value="sugarcane">Sugarcane</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Area (hectares)</label>
                    <input
                      type="number"
                      value={farmArea}
                      onChange={(e) => setFarmArea(Number(e.target.value))}
                      min="1"
                      max="1000"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Calculation Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sequestration Rate:</span>
                        <span className="font-medium">
                          {cropType === 'wheat' ? '0.5' : 
                           cropType === 'rice' ? '0.3' :
                           cropType === 'corn' ? '0.8' :
                           cropType === 'tomato' ? '0.4' :
                           cropType === 'cotton' ? '0.6' :
                           cropType === 'pulses' ? '0.7' :
                           cropType === 'millets' ? '0.9' :
                           cropType === 'sugarcane' ? '1.2' : '0.5'} tons CO₂/ha/year
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Credits:</span>
                        <span className="font-medium text-green-600">
                          {Math.floor(farmArea * (
                            cropType === 'wheat' ? 0.5 : 
                            cropType === 'rice' ? 0.3 :
                            cropType === 'corn' ? 0.8 :
                            cropType === 'tomato' ? 0.4 :
                            cropType === 'cotton' ? 0.6 :
                            cropType === 'pulses' ? 0.7 :
                            cropType === 'millets' ? 0.9 :
                            cropType === 'sugarcane' ? 1.2 : 0.5
                          ))} credits
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Potential Value:</span>
                        <span className="font-medium text-blue-600">
                          ₹{(Math.floor(farmArea * (
                            cropType === 'wheat' ? 0.5 : 
                            cropType === 'rice' ? 0.3 :
                            cropType === 'corn' ? 0.8 :
                            cropType === 'tomato' ? 0.4 :
                            cropType === 'cotton' ? 0.6 :
                            cropType === 'pulses' ? 0.7 :
                            cropType === 'millets' ? 0.9 :
                            cropType === 'sugarcane' ? 1.2 : 0.5
                          )) * carbonService.getCurrentCarbonPrice()).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCalculationModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={calculateCarbonSequestration}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-base"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {showCertificationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCertificationModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:max-h-[90vh] sm:overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Get Sustainability Certified</h3>
                  <button
                    onClick={() => setShowCertificationModal(false)}
                    className="text-gray-400 hover:text-gray-500 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                        placeholder="Enter farm name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Name</label>
                      <input
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                        placeholder="Enter farmer name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sustainable Practices</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries({
                        cropRotation: 'Crop Rotation',
                        organicFarming: 'Organic Farming',
                        waterConservation: 'Water Conservation',
                        renewableEnergy: 'Renewable Energy',
                        wasteManagement: 'Waste Management'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Boolean(sustainabilityPractices[key as keyof typeof sustainabilityPractices])}
                            onChange={(e) => setSustainabilityPractices({
                              ...sustainabilityPractices,
                              [key]: e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soil Health (0-100)</label>
                      <input
                        type="number"
                        value={sustainabilityPractices.soilHealth}
                        onChange={(e) => setSustainabilityPractices({
                          ...sustainabilityPractices,
                          soilHealth: Number(e.target.value)
                        })}
                        min="0"
                        max="100"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biodiversity (0-100)</label>
                      <input
                        type="number"
                        value={sustainabilityPractices.biodiversity}
                        onChange={(e) => setSustainabilityPractices({
                          ...sustainabilityPractices,
                          biodiversity: Number(e.target.value)
                        })}
                        min="0"
                        max="100"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Certification Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Level:</span>
                        <span className="font-medium">
                          {(() => {
                            const score = Math.round(
                              (sustainabilityPractices.biodiversity + 
                              (sustainabilityPractices.waterConservation ? 80 : 0) + 
                              sustainabilityPractices.soilHealth + 
                              (sustainabilityPractices.renewableEnergy ? 90 : 0) + 
                              (sustainabilityPractices.wasteManagement ? 85 : 0)) / 5
                            );
                            if (score >= 90) return '🏆 Platinum';
                            if (score >= 75) return '🥇 Gold';
                            if (score >= 60) return '🥈 Silver';
                            return '🥉 Bronze';
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sustainability Score:</span>
                        <span className="font-medium">
                          {Math.round(
                            (sustainabilityPractices.biodiversity + 
                            (sustainabilityPractices.waterConservation ? 80 : 0) + 
                            sustainabilityPractices.soilHealth + 
                            (sustainabilityPractices.renewableEnergy ? 90 : 0) + 
                            (sustainabilityPractices.wasteManagement ? 85 : 0)) / 5
                          )}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carbon Credits:</span>
                        <span className="font-medium text-green-600">
                          {Math.round(
                            (sustainabilityPractices.biodiversity + 
                            (sustainabilityPractices.waterConservation ? 80 : 0) + 
                            sustainabilityPractices.soilHealth + 
                            (sustainabilityPractices.renewableEnergy ? 90 : 0) + 
                            (sustainabilityPractices.wasteManagement ? 85 : 0)) / 5
                          ) * 0.1 + farmArea * 0.5}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCertificationModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateCertification}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base"
                  >
                    Generate Certification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marketplace Modal */}
      {showMarketplaceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowMarketplaceModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">List Carbon Credits</h3>
                  <button
                    onClick={() => setShowMarketplaceModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Marketplace Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Available Credits:</span>
                        <span className="text-sm font-medium">
                          {certifications[certifications.length - 1]?.carbonCredits || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Price:</span>
                        <span className="text-sm font-medium">
                          ₹{carbonService.getCurrentCarbonPrice()}/credit
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Potential Value:</span>
                        <span className="text-sm font-medium text-green-600">
                          ₹{((certifications[certifications.length - 1]?.carbonCredits || 0) * carbonService.getCurrentCarbonPrice()).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMarketplaceModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createMarketplaceListing}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    List on Marketplace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certification Detail Modal */}
      {selectedCertification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedCertification(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sustainability Certificate</h3>
                  <button
                    onClick={() => setSelectedCertification(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Certificate Header */}
                  <div className="text-center border-b pb-4">
                    <div className="text-4xl mb-2">{getCertificationIcon(selectedCertification.certificationLevel)}</div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCertification.certificationLevel.toUpperCase()} CERTIFICATION
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Certificate No: {selectedCertification.certificateNumber}
                    </p>
                  </div>
                  
                  {/* Farm Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Farm Details</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Farm Name:</span> {selectedCertification.farmName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Farmer:</span> {selectedCertification.farmerName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Certified:</span> {selectedCertification.certificationDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Expires:</span> {selectedCertification.expiryDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Carbon Credits</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Credits Earned:</span> {selectedCertification.carbonCredits}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">CO₂ Sequestered:</span> {selectedCertification.metrics.carbonSequestration.toFixed(1)} tons
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Sustainability Score:</span> {selectedCertification.sustainabilityScore}/100
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Verification:</span> {selectedCertification.verificationMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sustainability Metrics */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sustainability Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <SunIcon className="h-5 w-5 text-yellow-600 mr-2" />
                          <div>
                            <p className="text-xs text-gray-600">Biodiversity</p>
                            <p className="text-sm font-medium">{selectedCertification.metrics.biodiversityScore}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <BeakerIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-xs text-gray-600">Water Conservation</p>
                            <p className="text-sm font-medium">{selectedCertification.metrics.waterConservation}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <SunIcon className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-xs text-gray-600">Soil Health</p>
                            <p className="text-sm font-medium">{selectedCertification.metrics.soilHealth}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-xs text-gray-600">Renewable Energy</p>
                            <p className="text-sm font-medium">{selectedCertification.metrics.renewableEnergy}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <ArrowTrendingUpIcon className="h-5 w-5 text-orange-600 mr-2" />
                          <div>
                            <p className="text-xs text-gray-600">Waste Management</p>
                            <p className="text-sm font-medium">{selectedCertification.metrics.wasteManagement}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-xs text-gray-600">Overall Score</p>
                            <p className="text-sm font-medium">{selectedCertification.metrics.overallScore}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Verification Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Verification Details</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Verified By:</span> {selectedCertification.verifiedBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Certificate QR:</span> Available for verification
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCertification(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
