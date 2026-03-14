import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc as docRef } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ClimateRiskService } from '../services/climateRiskService';
import type { ClimateRiskData, ClimateAlert } from '../types/climate';
import { 
  CloudIcon, 
  ExclamationTriangleIcon,
  FireIcon,
  BeakerIcon,
  SunIcon,
  MapPinIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const ClimateRiskDashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<ClimateRiskData[]>([]);
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState<ClimateRiskData | null>(null);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [newFarmData, setNewFarmData] = useState({
    farmId: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    soilType: 'loamy',
    elevation: 100,
    currentCrops: [] as string[]
  });

  const climateService = ClimateRiskService.getInstance();

  useEffect(() => {
    fetchClimateRiskData();
    generateAlerts();
  }, []);

  const fetchClimateRiskData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'climate_risk_data'));
      const data: ClimateRiskData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      })) as ClimateRiskData[];
      
      setRiskData(data);
    } catch (error) {
      console.error('Error fetching climate risk data:', error);
      toast.error('Error fetching climate risk data');
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = () => {
    // Generate sample alerts for demonstration
    const sampleAlerts: ClimateAlert[] = [
      {
        id: 'alert-1',
        type: 'drought',
        severity: 'high',
        title: 'Drought Warning - Maharashtra Region',
        description: 'Severe drought conditions expected in the next 2-3 months',
        affectedAreas: ['Pune', 'Nashik', 'Ahmednagar'],
        startTime: new Date(),
        endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        recommendedActions: [
          'Implement water conservation measures',
          'Switch to drought-resistant crops',
          'Prepare irrigation systems'
        ]
      },
      {
        id: 'alert-2',
        type: 'flood',
        severity: 'medium',
        title: 'Flood Watch - Bihar Region',
        description: 'Moderate flood risk during upcoming monsoon season',
        affectedAreas: ['Patna', 'Gaya', 'Bhagalpur'],
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        recommendedActions: [
          'Create proper drainage systems',
          'Elevate farm beds',
          'Prepare flood-resistant crops'
        ]
      }
    ];
    
    setAlerts(sampleAlerts);
  };

  const addNewFarm = async () => {
    try {
      const farmData = {
        ...newFarmData,
        riskScore: climateService.calculateRiskScore(newFarmData),
        riskLevel: getRiskLevel(climateService.calculateRiskScore(newFarmData)),
        predictions: climateService.predictClimateRisks(newFarmData),
        recommendations: {
          climateResilientCrops: [],
          adaptationStrategies: [],
          insuranceRecommendations: []
        },
        lastUpdated: serverTimestamp()
      };

      const docReference = await addDoc(collection(db, 'climate_risk_data'), farmData);
      
      // Generate recommendations for the new farm
      const newFarmWithId = { ...farmData, id: docReference.id, lastUpdated: new Date() };
      const recommendations = climateService.generateCropRecommendations(newFarmWithId);
      const strategies = climateService.generateAdaptationStrategies(newFarmWithId);
      
      await updateDoc(docRef(db, 'climate_risk_data', docReference.id), {
        'recommendations.climateResilientCrops': recommendations,
        'recommendations.adaptationStrategies': strategies
      });

      toast.success('Farm added successfully with climate risk assessment');
      setShowAddFarmModal(false);
      setNewFarmData({
        farmId: '',
        location: {
          latitude: 0,
          longitude: 0,
          address: ''
        },
        soilType: 'loamy',
        elevation: 100,
        currentCrops: []
      });
      fetchClimateRiskData();
    } catch (error) {
      console.error('Error adding farm:', error);
      toast.error('Error adding farm');
    }
  };

  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    if (score < 80) return 'high';
    return 'critical';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'drought': return <FireIcon className="h-5 w-5" />;
      case 'flood': return <BeakerIcon className="h-5 w-5" />;
      case 'heatwave': return <SunIcon className="h-5 w-5" />;
      default: return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'high': return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'critical': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CloudIcon className="h-8 w-8 mr-3 text-blue-600" />
              AI Climate Risk Intelligence
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Farm-level climate risk assessment and resilient crop recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Farms</p>
                <p className="text-2xl font-bold text-gray-900">{riskData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Risk Farms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riskData.filter(f => f.riskLevel === 'high' || f.riskLevel === 'critical').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resilient Crops</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Climate Alerts */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-orange-500" />
              Active Climate Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.description}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium">Affected Areas:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.affectedAreas.map((area, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-white bg-opacity-60">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getAlertColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Farms Risk Assessment */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
              Farm Risk Assessments
            </h2>
            <button
              onClick={() => setShowAddFarmModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Add Farm
            </button>
          </div>
          
          <div className="p-6">
            {riskData.length === 0 ? (
              <div className="text-center py-12">
                <CloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No farms assessed yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a farm for climate risk assessment.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Farm
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {riskData.map((farm) => (
                  <div key={farm.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{farm.farmId}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {farm.location.address}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRiskColor(farm.riskLevel)}`}>
                        {farm.riskLevel.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Risk Score</span>
                          <span className="font-medium">{farm.riskScore.toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              farm.riskScore < 30 ? 'bg-green-500' :
                              farm.riskScore < 60 ? 'bg-yellow-500' :
                              farm.riskScore < 80 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${farm.riskScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <FireIcon className="h-4 w-4 mx-auto text-orange-500" />
                          <p className="mt-1">Drought</p>
                          <p className="font-medium">{farm.predictions.drought.risk.toFixed(0)}%</p>
                        </div>
                        <div className="text-center">
                          <BeakerIcon className="h-4 w-4 mx-auto text-blue-500" />
                          <p className="mt-1">Flood</p>
                          <p className="font-medium">{farm.predictions.flood.risk.toFixed(0)}%</p>
                        </div>
                        <div className="text-center">
                          <SunIcon className="h-4 w-4 mx-auto text-red-500" />
                          <p className="mt-1">Heatwave</p>
                          <p className="font-medium">{farm.predictions.heatwave.risk.toFixed(0)}%</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedFarm(farm)}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Farm Modal */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowAddFarmModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add Farm for Climate Risk Assessment
                  </h3>
                  <button
                    onClick={() => setShowAddFarmModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm ID</label>
                    <input
                      type="text"
                      value={newFarmData.farmId}
                      onChange={(e) => setNewFarmData({...newFarmData, farmId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter farm ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newFarmData.location.address}
                      onChange={(e) => setNewFarmData({
                        ...newFarmData, 
                        location: {...newFarmData.location, address: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter farm address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        value={newFarmData.location.latitude}
                        onChange={(e) => setNewFarmData({
                          ...newFarmData, 
                          location: {...newFarmData.location, latitude: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="19.0760"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        value={newFarmData.location.longitude}
                        onChange={(e) => setNewFarmData({
                          ...newFarmData, 
                          location: {...newFarmData.location, longitude: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="72.8777"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                    <select
                      value={newFarmData.soilType}
                      onChange={(e) => setNewFarmData({...newFarmData, soilType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="loamy">Loamy</option>
                      <option value="sandy">Sandy</option>
                      <option value="clay">Clay</option>
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={addNewFarm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Farm
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farm Details Modal */}
      {selectedFarm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedFarm(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl leading-6 font-medium text-gray-900">
                    Climate Risk Details - {selectedFarm.farmId}
                  </h3>
                  <button
                    onClick={() => setSelectedFarm(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Predictions */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Risk Predictions
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(selectedFarm.predictions).map(([key, prediction]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">{key}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              prediction.severity === 'severe' ? 'bg-red-100 text-red-800' :
                              prediction.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {prediction.severity}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Risk Level</span>
                              <span className="font-medium">{prediction.risk.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  prediction.risk < 30 ? 'bg-green-500' :
                                  prediction.risk < 60 ? 'bg-yellow-500' :
                                  prediction.risk < 80 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${prediction.risk}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Probability</span>
                              <span className="font-medium">{(prediction.probability * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Time Frame</span>
                              <span className="font-medium">{prediction.timeFrame}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      Recommendations
                    </h4>
                    
                    {/* Climate Resilient Crops */}
                    <div className="mb-6">
                      <h5 className="font-medium text-gray-900 mb-3">Climate Resilient Crops</h5>
                      <div className="space-y-2">
                        {selectedFarm.recommendations.climateResilientCrops.length > 0 ? (
                          selectedFarm.recommendations.climateResilientCrops.map((crop, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h6 className="font-medium text-gray-900">{crop.name}</h6>
                                  <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <span>Yield: {crop.expectedYield}</span>
                                    <span>Water: {crop.waterRequirement}</span>
                                    <span>Market: {crop.marketDemand}</span>
                                    <span>Season: {crop.plantingSeason.join(', ')}</span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                                  <span className="text-sm font-medium text-green-600">
                                    {crop.resilienceScore}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No crop recommendations available</p>
                        )}
                      </div>
                    </div>

                    {/* Adaptation Strategies */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Adaptation Strategies</h5>
                      <div className="space-y-2">
                        {selectedFarm.recommendations.adaptationStrategies.length > 0 ? (
                          selectedFarm.recommendations.adaptationStrategies.map((strategy, index) => (
                            <div key={index} className="flex items-start">
                              <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-700">{strategy}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No adaptation strategies available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
