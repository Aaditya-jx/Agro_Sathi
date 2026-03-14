import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FarmSimulationService } from '../services/farmSimulationService';
import type { FarmLayout, SimulationScenario, SimulationResult } from '../types/digitalFarm';
import { 
  CubeIcon, 
  PlayIcon,
  BeakerIcon,
  SunIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const DigitalFarm: React.FC = () => {
  const { user } = useAuth();
  const [farmLayouts, setFarmLayouts] = useState<FarmLayout[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<FarmLayout | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmArea, setNewFarmArea] = useState(5); // hectares
  const [editFarmName, setEditFarmName] = useState('');
  const [editFarmArea, setEditFarmArea] = useState(5); // hectares
  const [simulationDays, setSimulationDays] = useState(120);
  const [selectedIrrigation, setSelectedIrrigation] = useState('drip_irrigation');
  const [selectedFertilizer, setSelectedFertilizer] = useState('organic_compost');

  const farmService = FarmSimulationService.getInstance();

  useEffect(() => {
    fetchFarmLayouts();
  }, [user]);

  const fetchFarmLayouts = async () => {
    if (!user) return;
    
    try {
      const querySnapshot = await getDocs(collection(db, 'farm_layouts'));
      const layouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastModified: doc.data().lastModified?.toDate() || new Date()
      })) as FarmLayout[];
      setFarmLayouts(layouts);
    } catch (error) {
      console.error('Error fetching farm layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createVirtualFarm = async () => {
    if (!user || !newFarmName.trim()) {
      toast.error('Please enter a farm name');
      return;
    }

    try {
      const farmLayout = farmService.createVirtualFarmLayout(newFarmName, newFarmArea);
      
      await addDoc(collection(db, 'farm_layouts'), {
        ...farmLayout,
        userId: user.uid,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp()
      });

      toast.success('Virtual farm created successfully!');
      setShowCreateModal(false);
      setNewFarmName('');
      setNewFarmArea(5);
      fetchFarmLayouts();
    } catch (error) {
      console.error('Error creating farm layout:', error);
      toast.error('Error creating virtual farm');
    }
  };

  const updateVirtualFarm = async () => {
    if (!user || !selectedFarm || !editFarmName.trim()) {
      toast.error('Please enter a farm name');
      return;
    }

    try {
      const updatedFarmLayout = farmService.createVirtualFarmLayout(editFarmName, editFarmArea);
      
      await updateDoc(doc(db, 'farm_layouts', selectedFarm.id), {
        ...updatedFarmLayout,
        userId: user.uid,
        lastModified: serverTimestamp()
      });

      toast.success('Virtual farm updated successfully!');
      setShowEditModal(false);
      setEditFarmName('');
      setEditFarmArea(5);
      fetchFarmLayouts();
    } catch (error) {
      console.error('Error updating farm layout:', error);
      toast.error('Error updating virtual farm');
    }
  };

  const openEditModal = (farm: FarmLayout) => {
    setSelectedFarm(farm);
    setEditFarmName(farm.name);
    setEditFarmArea(farm.totalArea);
    setShowEditModal(true);
  };

  const runSimulation = async () => {
    if (!selectedFarm) return;

    try {
      const irrigationStrategy = farmService.getIrrigationStrategies().find(s => s.id === selectedIrrigation);
      const fertilizerStrategy = farmService.getFertilizerStrategies().find(s => s.id === selectedFertilizer);
      
      if (!irrigationStrategy || !fertilizerStrategy) {
        toast.error('Please select valid strategies');
        return;
      }

      const scenario: SimulationScenario = {
        id: `scenario_${Date.now()}`,
        name: `${selectedFarm.name} Simulation`,
        description: `Simulation for ${simulationDays} days`,
        duration: simulationDays,
        weatherConditions: {
          temperature: 25,
          rainfall: 100,
          humidity: 65,
          sunlight: 8
        },
        irrigationStrategy,
        fertilizerStrategy,
        plots: selectedFarm.plots,
        results: {} as SimulationResult
      };

      const result = farmService.runSimulation(scenario);
      setSimulationResult(result);
      setShowSimulationModal(false);
      toast.success('Simulation completed successfully!');
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Error running simulation');
    }
  };

  const getGrowthStageColor = (stage: string) => {
    switch (stage) {
      case 'seedling': return 'bg-green-100 text-green-800';
      case 'vegetative': return 'bg-blue-100 text-blue-800';
      case 'flowering': return 'bg-purple-100 text-purple-800';
      case 'maturity': return 'bg-yellow-100 text-yellow-800';
      case 'harvested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    if (health >= 40) return 'text-orange-600';
    return 'text-red-600';
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
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CubeIcon className="h-8 w-8 mr-3 text-green-600" />
                Digital Twin Farm
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Virtual farm simulation and strategy testing
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Virtual Farm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Farm Selection */}
        {farmLayouts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Farm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farmLayouts.map((farm) => (
                <div
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFarm?.id === farm.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{farm.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">
                        {farm.totalArea} ha
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(farm);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {farm.plots.length} plots • {farm.soilType} soil
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Farm Details */}
        {selectedFarm && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedFarm.name} - Virtual Farm View
              </h2>
              <button
                onClick={() => setShowSimulationModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Run Simulation
              </button>
            </div>
            
            <div className="p-6">
              {/* Farm Grid Visualization */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Layout</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-1 p-4 bg-gray-100 rounded-lg">
                  {selectedFarm.plots.map((plot) => (
                    <div
                      key={plot.id}
                      className="relative border border-gray-300 bg-white rounded p-2 hover:shadow-md transition-shadow"
                      title={`${plot.name} - ${plot.soilType} soil`}
                    >
                      <div className="text-xs text-center">
                        <div className={`px-1 py-0.5 rounded text-xs font-medium ${getGrowthStageColor(plot.growthStage)}`}>
                          {plot.growthStage}
                        </div>
                        {plot.currentCrop && (
                          <div className="mt-1 text-xs text-gray-600 truncate">
                            {plot.currentCrop.name}
                          </div>
                        )}
                        <div className="mt-1">
                          <div className="flex justify-center">
                            <SunIcon className={`h-3 w-3 ${getHealthColor(plot.health)}`} />
                          </div>
                          <div className="text-xs text-gray-500">
                            {plot.health}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farm Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <SunIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Active Plots</p>
                      <p className="text-xl font-bold text-gray-900">
                        {selectedFarm.plots.filter(p => p.currentCrop).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BeakerIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Avg Water Level</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(selectedFarm.plots.reduce((sum, p) => sum + p.waterLevel, 0) / selectedFarm.plots.length)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BeakerIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Avg Nutrients</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(selectedFarm.plots.reduce((sum, p) => sum + p.nutrientLevel, 0) / selectedFarm.plots.length)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <SunIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Avg Health</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(selectedFarm.plots.reduce((sum, p) => sum + p.health, 0) / selectedFarm.plots.length)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Farms Message */}
        {farmLayouts.length === 0 && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No virtual farms yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first virtual farm to start simulating crop growth scenarios
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Virtual Farm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Farm Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCreateModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create Virtual Farm</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                    <input
                      type="text"
                      value={newFarmName}
                      onChange={(e) => setNewFarmName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter farm name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Farm Size (hectares)</label>
                    <input
                      type="number"
                      value={newFarmArea}
                      onChange={(e) => setNewFarmArea(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter farm size in hectares"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createVirtualFarm}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Create Farm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Farm Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowEditModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Virtual Farm</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                    <input
                      type="text"
                      value={editFarmName}
                      onChange={(e) => setEditFarmName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter farm name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Farm Size (hectares)</label>
                    <input
                      type="number"
                      value={editFarmArea}
                      onChange={(e) => setEditFarmArea(Number(e.target.value))}
                      min="1"
                      max="100"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter farm size in hectares"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateVirtualFarm}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Update Farm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Modal */}
      {showSimulationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowSimulationModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Run Farm Simulation</h3>
                  <button
                    onClick={() => setShowSimulationModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Simulation Duration (days)</label>
                    <input
                      type="number"
                      value={simulationDays}
                      onChange={(e) => setSimulationDays(Number(e.target.value))}
                      min="30"
                      max="365"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Irrigation Strategy</label>
                    <select
                      value={selectedIrrigation}
                      onChange={(e) => setSelectedIrrigation(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {farmService.getIrrigationStrategies().map(strategy => (
                        <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fertilizer Strategy</label>
                    <select
                      value={selectedFertilizer}
                      onChange={(e) => setSelectedFertilizer(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {farmService.getFertilizerStrategies().map(strategy => (
                        <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSimulationModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={runSimulation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Run Simulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Results */}
      {simulationResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSimulationResult(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Simulation Results</h3>
                  <button
                    onClick={() => setSimulationResult(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Main Results Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">Total Yield</p>
                          <p className="text-xl font-bold text-gray-900">
                            {simulationResult.totalYield.toFixed(0)} kg
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${simulationResult.profit >= 0 ? 'bg-blue-50' : 'bg-red-50'} rounded-lg p-4`}>
                      <div className="flex items-center">
                        <ArrowTrendingUpIcon className={`h-8 w-8 ${simulationResult.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">Profit</p>
                          <p className={`text-xl font-bold ${simulationResult.profit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {simulationResult.profit >= 0 ? '+' : ''}₹{Math.abs(simulationResult.profit).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Secondary Results Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <BeakerIcon className="h-8 w-8 text-yellow-600" />
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">Water Usage</p>
                          <p className="text-xl font-bold text-gray-900">
                            {simulationResult.waterUsage.toLocaleString()} L
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <SunIcon className="h-8 w-8 text-purple-600" />
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">Sustainability</p>
                          <p className="text-xl font-bold text-gray-900">
                            {simulationResult.sustainabilityScore.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Yield/Hectare</p>
                        <p className="text-xl font-bold text-gray-900">
                          {simulationResult.yieldPerHectare.toFixed(0)} kg
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{simulationResult.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{simulationResult.totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  {simulationResult.recommendations.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {simulationResult.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
