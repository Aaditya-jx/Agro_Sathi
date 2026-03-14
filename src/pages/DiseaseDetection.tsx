import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CameraIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Import our disease detection service
import DiseaseDetectionService from '../services/DiseaseDetectionService';

export const DiseaseDetection: React.FC = () => {
  const { user } = useAuth(); // Keep for potential future use
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cropType, setCropType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suppress unused variable warning
  void user;

  // Vegetable crops trained in our new model
  const trainedCrops = [
    'Potato', 
    'Tomato', 
    'Pepper'
  ].sort();

  // Initialize the disease detection service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await DiseaseDetectionService.initialize();
        console.log('✅ Disease detection service initialized');
      } catch (error) {
        console.error('❌ Failed to initialize disease detection service:', error);
        toast.error('Failed to initialize disease detection service');
      }
    };
    
    initializeService();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDisease = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    if (!cropType) {
      toast.error('Please select a crop type');
      return;
    }

    setAnalyzing(true);
    
    try {
      console.log('🔍 Analyzing disease for crop:', cropType);
      
      // Use the simplified AI service
      const prediction = await DiseaseDetectionService.predictDisease(selectedFile, cropType);
      
      // Get treatment recommendations
      const treatment = DiseaseDetectionService.getTreatmentRecommendations(prediction.disease);
      
      // Get confidence level
      const confidenceLevel = DiseaseDetectionService.getConfidenceLevel(prediction.confidence);
      
      // Format result for display
      const formattedResult = {
        crop: prediction.crop || cropType,
        disease: prediction.disease || 'Unknown',
        confidence: prediction.confidence || 0,
        confidenceLevel: confidenceLevel,
        treatment: treatment,
        status: prediction.confidence > 0.5 ? 'SUCCESS' : 'LOW_CONFIDENCE',
        selectedCrop: cropType
      };
      
      setResult(formattedResult);
      
      // Show appropriate toast
      if (prediction.confidence > 0.5) {
        toast.success(`Disease detected: ${prediction.disease}`);
      } else {
        toast('Low confidence detection. Please retake photo.', { icon: '⚠️' });
      }
      
    } catch (error) {
      console.error('❌ Error analyzing disease:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setCropType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Disease Detection</h1>
          <p className="text-gray-600 mb-8">Upload a plant leaf image to detect diseases and get treatment recommendations</p>

          {/* Crop Selection Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Crop Type
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Choose a crop...</option>
              {trainedCrops.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <CameraIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Click to upload a plant leaf image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
              >
                Choose Image
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-8">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected plant"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={resetAnalysis}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              
              {/* Analyze Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={analyzeDisease}
                  disabled={analyzing || !cropType}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Disease'}
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Disease Detection Result */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">Detection Result</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Crop</p>
                    <p className="text-lg font-semibold text-gray-800">{result.crop}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Disease</p>
                    <p className="text-lg font-semibold text-gray-800">{result.disease}</p>
                  </div>
                </div>
                
                {/* Confidence Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-sm font-semibold text-gray-800">{result.confidenceLevel} ({result.confidence > 1 ? Math.round(result.confidence) : Math.round(result.confidence * 100)}%)</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        result.confidence > 0.8 ? 'bg-green-500' : 
                        result.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.confidence > 1 ? Math.min(result.confidence, 100) : Math.min(result.confidence * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Treatment Recommendation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Treatment Recommendation</h2>
                <p className="text-gray-700">{result.treatment}</p>
              </div>

              {/* Low Confidence Warning */}
              {result.status === 'LOW_CONFIDENCE' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">Low Confidence Detection</h3>
                      <p className="text-yellow-700">Please retake the photo for better accuracy. Ensure good lighting and clear focus on the affected area.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
