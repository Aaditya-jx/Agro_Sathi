import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  BookOpenIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCrops: 0,
    totalVideos: 0,
    totalSchemes: 0,
    totalProducts: 0,
    totalEvents: 0,
    totalDetections: 0,
    totalClimateRisks: 0
  });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchItems(getCollectionName());
    }
  }, [activeTab]);

  const fetchItems = async (collectionName: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsData);
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const collectionName = getCollectionName();
        await deleteDoc(doc(db, collectionName, id));
        await fetchItems(collectionName);
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error deleting item');
      }
    }
  };

  const handleAddItem = async () => {
    try {
      const collectionName = getCollectionName();
      const itemData = {
        ...formData,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, collectionName), itemData);
      await fetchItems(collectionName);
      setShowAddModal(false);
      setFormData({});
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Error adding item');
    }
  };

  const handleEditItem = async () => {
    try {
      const collectionName = getCollectionName();
      const itemData = {
        ...formData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, collectionName, editingItem.id), itemData);
      await fetchItems(collectionName);
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({});
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Error updating item');
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowEditModal(true);
  };

  const getCollectionName = () => {
    const tabMap: Record<string, string> = {
      'users': 'users',
      'crops': 'crops',
      'videos': 'videos',
      'schemes': 'schemes',
      'products': 'eco_products',
      'events': 'events',
      'detections': 'detection_logs'
    };
    return tabMap[activeTab] || 'users';
  };

  const fetchStats = async () => {
    try {
      const collections = [
        { name: 'users', key: 'totalUsers' },
        { name: 'crops', key: 'totalCrops' },
        { name: 'videos', key: 'totalVideos' },
        { name: 'schemes', key: 'totalSchemes' },
        { name: 'eco_products', key: 'totalProducts' },
        { name: 'events', key: 'totalEvents' },
        { name: 'detection_logs', key: 'totalDetections' },
        { name: 'climate_risk_data', key: 'totalClimateRisks' }
      ];

      const statsData = { ...stats };
      
      for (const collectionItem of collections) {
        const querySnapshot = await getDocs(collection(db, collectionItem.name));
        statsData[collectionItem.key as keyof typeof stats] = querySnapshot.size;
      }
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'crops', name: 'Crops', icon: SparklesIcon },
    { id: 'videos', name: 'Videos', icon: BookOpenIcon },
    { id: 'schemes', name: 'Schemes', icon: BuildingOfficeIcon },
    { id: 'products', name: 'Products', icon: ShoppingBagIcon },
    { id: 'events', name: 'Events', icon: CalendarIcon },
    { id: 'detections', name: 'AI Detections', icon: CameraIcon },
    { id: 'climate', name: 'Climate Risk', icon: CloudIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stats).map(([key, value]) => {
            const labels: Record<string, string> = {
              totalUsers: 'Total Users',
              totalCrops: 'Crops',
              totalVideos: 'Videos',
              totalSchemes: 'Schemes',
              totalProducts: 'Products',
              totalEvents: 'Events',
              totalDetections: 'AI Detections',
              totalClimateRisks: 'Climate Risks'
            };
            return (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">{labels[key]}</h3>
                <p className="text-3xl font-bold text-primary-600 mt-2">{value}</p>
              </div>
            );
          })}
        </div>
      );
    }

    if (activeTab === 'climate') {
      return (
        <div className="text-center py-12">
          <CloudIcon className="mx-auto h-12 w-12 text-blue-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Climate Risk Intelligence</h3>
          <p className="mt-1 text-sm text-gray-500">
            Advanced climate risk assessment and resilient crop recommendations
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/climate-risk-dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <CloudIcon className="h-4 w-4 mr-2" />
              Open Climate Risk Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
            {activeTab} Management
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add {activeTab.slice(0, -1)}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {/* Mobile Card View */}
          <div className="sm:hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">
                    {item.name || item.title || item.cropName || item.schemeName || item.productName || item.email}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {item.description || item.role || item.category || item.email}
                </p>
                <p className="text-xs text-gray-500">
                  {item.createdAt ? new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name || item.title || item.cropName || item.schemeName || item.productName || item.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.description || item.role || item.category || item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.createdAt ? new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAddForm = () => {
    const commonFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="Enter description"
          />
        </div>
      </>
    );

    switch (activeTab) {
      case 'videos':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter video URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 10:30"
              />
            </div>
          </>
        );
      
      case 'schemes':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Type</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select type</option>
                <option value="government">Government</option>
                <option value="private">Private</option>
                <option value="ngo">NGO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <input
                type="text"
                value={formData.eligibility || ''}
                onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter eligibility criteria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
              <input
                type="text"
                value={formData.benefits || ''}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter benefits"
              />
            </div>
          </>
        );
      
      case 'products':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                <option value="seeds">Seeds</option>
                <option value="fertilizers">Fertilizers</option>
                <option value="pesticides">Pesticides</option>
                <option value="tools">Tools</option>
                <option value="organic">Organic Products</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter stock quantity"
              />
            </div>
          </>
        );
      
      case 'events':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={formData.eventType || ''}
                onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select type</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="training">Training</option>
                <option value="exhibition">Exhibition</option>
              </select>
            </div>
          </>
        );
      
      case 'crops':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
              <input
                type="text"
                value={formData.cropName || ''}
                onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter crop name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
              <select
                value={formData.season || ''}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select season</option>
                <option value="kharif">Kharif</option>
                <option value="rabi">Rabi</option>
                <option value="zaid">Zaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Growing Tips</label>
              <textarea
                value={formData.growingTips || ''}
                onChange={(e) => setFormData({...formData, growingTips: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Enter growing tips"
              />
            </div>
          </>
        );
      
      default:
        return commonFields;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">🏛️ Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage AgroSathi platform and users
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            {/* Mobile Dropdown */}
            <div className="sm:hidden px-4 py-3">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Desktop Tabs */}
            <nav className="hidden sm:flex -mb-px space-x-1 sm:space-x-8 px-2 sm:px-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center flex-shrink-0`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  <span className="hidden lg:inline">{tab.name}</span>
                  <span className="lg:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowAddModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {renderAddForm()}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowEditModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {renderAddForm()}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleEditItem}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
