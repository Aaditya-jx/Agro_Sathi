export interface CarbonSequestration {
  id: string;
  farmId: string;
  date: Date;
  cropType: string;
  area: number; // hectares
  sequestrationRate: number; // tons CO2 per hectare per year
  totalSequestration: number; // tons CO2
  methodology: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  carbonCredits: number; // number of carbon credits
}

export interface CarbonCredit {
  id: string;
  farmId: string;
  amount: number; // tons CO2
  price: number; // INR per ton
  status: 'available' | 'sold' | 'pending' | 'verified';
  marketplaceId?: string;
  listingDate: Date;
  saleDate?: Date;
  buyer?: string;
  certificationId?: string;
}

export interface SustainabilityMetrics {
  id: string;
  farmId: string;
  date: Date;
  carbonSequestration: number; // tons CO2
  biodiversityScore: number; // 0-100
  waterConservation: number; // 0-100
  soilHealth: number; // 0-100
  renewableEnergy: number; // 0-100
  wasteManagement: number; // 0-100
  overallScore: number; // 0-100
  certification: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface CertificationReport {
  id: string;
  farmId: string;
  farmName: string;
  farmerName: string;
  certificationDate: Date;
  expiryDate: Date;
  certificationLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  carbonCredits: number;
  sustainabilityScore: number;
  metrics: SustainabilityMetrics;
  verificationMethod: 'remote' | 'onsite' | 'satellite';
  verifiedBy: string;
  certificateNumber: string;
  qrCode: string;
}

export interface MarketplaceListing {
  id: string;
  farmId: string;
  carbonCredits: number;
  pricePerCredit: number;
  totalValue: number;
  status: 'active' | 'sold' | 'expired';
  listingDate: Date;
  expiryDate: Date;
  description: string;
  location: string;
  farmType: string;
  verificationLevel: string;
}

export interface CarbonTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  carbonCredits: number;
  pricePerCredit: number;
  totalAmount: number;
  transactionDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  blockchainHash?: string;
}

export interface CarbonMethodology {
  id: string;
  name: string;
  description: string;
  sequestrationRates: {
    [cropType: string]: number; // tons CO2 per hectare per year
  };
  verificationRequirements: string[];
  certificationStandards: string[];
  validityPeriod: number; // years
  monitoringFrequency: 'monthly' | 'quarterly' | 'annually';
}
