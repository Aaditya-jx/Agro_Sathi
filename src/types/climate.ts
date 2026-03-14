export interface ClimateRiskData {
  id: string;
  farmId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictions: {
    drought: {
      risk: number;
      probability: number;
      timeFrame: string;
      severity: 'mild' | 'moderate' | 'severe';
    };
    flood: {
      risk: number;
      probability: number;
      timeFrame: string;
      severity: 'mild' | 'moderate' | 'severe';
    };
    heatwave: {
      risk: number;
      probability: number;
      timeFrame: string;
      severity: 'mild' | 'moderate' | 'severe';
    };
  };
  recommendations: {
    climateResilientCrops: CropRecommendation[];
    adaptationStrategies: string[];
    insuranceRecommendations: string[];
  };
  lastUpdated: Date;
}

export interface CropRecommendation {
  name: string;
  resilienceScore: number;
  waterRequirement: 'low' | 'medium' | 'high';
  temperatureTolerance: 'cool' | 'moderate' | 'hot';
  soilType: string[];
  expectedYield: string;
  marketDemand: 'low' | 'medium' | 'high';
  plantingSeason: string[];
}

export interface ClimateAlert {
  id: string;
  type: 'drought' | 'flood' | 'heatwave' | 'frost';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedAreas: string[];
  startTime: Date;
  endTime: Date;
  recommendedActions: string[];
}
