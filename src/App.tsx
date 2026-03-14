import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BackButtonHandler } from './components/BackButtonHandler';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './pages/Dashboard';
import { CropAdvisory } from './pages/CropAdvisory';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { Learning } from './pages/Learning';
import { ExpenseTracker } from './pages/ExpenseTracker';
import { Schemes } from './pages/Schemes';
import { EcoProducts } from './pages/EcoProducts';
import { Events } from './pages/Events';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClimateRiskDashboard } from './pages/ClimateRiskDashboard';
import { DigitalFarm } from './pages/DigitalFarm';
import { CarbonCredits } from './pages/CarbonCredits';
import { Notifications } from './pages/Notifications';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <BackButtonHandler />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Farmer Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/crop-advisory" element={
              <ProtectedRoute>
                <CropAdvisory />
              </ProtectedRoute>
            } />
            <Route path="/disease-detection" element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <Learning />
              </ProtectedRoute>
            } />
            <Route path="/expense-tracker" element={
              <ProtectedRoute>
                <ExpenseTracker />
              </ProtectedRoute>
            } />
            <Route path="/schemes" element={
              <ProtectedRoute>
                <Schemes />
              </ProtectedRoute>
            } />
            <Route path="/eco-products" element={
              <ProtectedRoute>
                <EcoProducts />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/digital-farm" element={
              <ProtectedRoute>
                <DigitalFarm />
              </ProtectedRoute>
            } />
            <Route path="/carbon-credits" element={
              <ProtectedRoute>
                <CarbonCredits />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Climate Risk Dashboard */}
            <Route path="/climate-risk-dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <ClimateRiskDashboard />
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
