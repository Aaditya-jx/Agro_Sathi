export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface Crop {
  id: string;
  cropName: string;
  season: string;
  soilType: string;
  organicFertilizer: string;
  waterRequirement: string;
  cropRotation: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface DetectionLog {
  id: string;
  userId: string;
  disease: string;
  imageUrl: string;
  organicTreatment: string;
  confidence: number;
  timestamp: Date;
  cropType?: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  category: 'organic_farming' | 'water_conservation' | 'soil_health' | 'natural_pest_control';
  description: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  category: string;
  amount: number;
  date: Date;
  description: string;
  type: 'seed' | 'fertilizer' | 'pesticide' | 'equipment' | 'labor' | 'other';
}

export interface Scheme {
  id: string;
  schemeName: string;
  eligibility: string;
  benefits: string;
  state: string;
  category: string;
  applicationLink?: string;
  deadline?: Date;
  createdAt: Date;
}

export interface EcoProduct {
  id: string;
  productName: string;
  description: string;
  imageUrl: string;
  contact: string;
  price?: number;
  category: 'bio_fertilizer' | 'drip_irrigation' | 'organic_pesticide' | 'seeds' | 'equipment';
  supplier: string;
  location: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  imageUrl?: string;
  registrationLink?: string;
  maxAttendees?: number;
  currentAttendees: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'event';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  description: string;
  location: string;
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'farmer' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  detectionCount: number;
  upcomingEvents: number;
  unreadNotifications: number;
}
