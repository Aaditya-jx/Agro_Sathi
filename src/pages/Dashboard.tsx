import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Header } from '../components/ui/Header';
import { WeatherCard } from '../components/ui/WeatherCard';
import { VideoSection } from '../components/ui/VideoSection';
import { BottomNav } from '../components/ui/BottomNav';
import { SideDrawer } from '../components/ui/SideDrawer';
import type { Expense } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotifications] = useState(false);
  const [stats, setStats] = useState([
    { name: 'Total Expenses', value: '₹0' },
    { name: 'Crop Scans', value: '0' },
    { name: 'Events', value: '0' },
    { name: 'Schemes', value: '0' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch expenses
      const expensesQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', user.uid)
      );
      const expensesSnapshot = await getDocs(expensesQuery);
      const expenses = expensesSnapshot.docs.map(doc => doc.data() as Expense);
      
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate monthly expenses
      const monthlyExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          const currentDate = new Date();
          return expenseDate.getMonth() === currentDate.getMonth() && 
                 expenseDate.getFullYear() === currentDate.getFullYear();
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      // Fetch detection logs
      const detectionsQuery = query(
        collection(db, 'detectionLogs'),
        where('userId', '==', user.uid)
      );
      const detectionsSnapshot = await getDocs(detectionsQuery);
      const detectionCount = detectionsSnapshot.size;
      
      // Fetch upcoming events
      const eventsQuery = query(
        collection(db, 'events'),
        where('date', '>=', new Date()),
        orderBy('date', 'asc'),
        limit(10)
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const upcomingEvents = eventsSnapshot.size;
      
      setStats([
        { name: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}` },
        { name: 'This Month', value: `₹${monthlyExpenses.toLocaleString()}` },
        { name: 'Crop Scans', value: detectionCount.toString() },
        { name: 'Events', value: upcomingEvents.toString() }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <Header onMenuClick={handleMenuClick} showNotifications={showNotifications} />

      {/* Side Drawer */}
      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleDrawerClose} 
        userRole={user?.role}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Weather Card */}
        <div className="mb-6">
          <WeatherCard />
        </div>

        {/* Video Section */}
        <div className="mb-6">
          <VideoSection />
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
