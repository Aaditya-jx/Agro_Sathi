export interface FarmPlot {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  soilType: 'sandy' | 'clay' | 'loamy' | 'black' | 'red';
  currentCrop: Crop | null;
  plantingDate: Date | null;
  expectedHarvestDate: Date | null;
  growthStage: 'seedling' | 'vegetative' | 'flowering' | 'maturity' | 'harvested';
  health: number; // 0-100
  waterLevel: number; // 0-100
  nutrientLevel: number; // 0-100
  lastUpdated: Date;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  type: 'cereal' | 'vegetable' | 'fruit' | 'pulse' | 'oilseed' | 'fiber';
  growthDuration: number; // days
  waterRequirement: 'low' | 'medium' | 'high';
  nutrientRequirement: 'low' | 'medium' | 'high';
  temperatureTolerance: 'cool' | 'moderate' | 'hot';
  soilPreference: string[];
  expectedYield: number; // kg per hectare
  marketPrice: number; // per kg
  growthStages: {
    seedling: { duration: number; height: number };
    vegetative: { duration: number; height: number };
    flowering: { duration: number; height: number };
    maturity: { duration: number; height: number };
  };
}

export interface IrrigationStrategy {
  id: string;
  name: string;
  type: 'drip' | 'sprinkler' | 'flood' | 'drought';
  waterUsage: number; // liters per day per hectare
  efficiency: number; // 0-100
  cost: number; // per hectare per season
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  suitableCrops: string[];
}

export interface FertilizerStrategy {
  id: string;
  name: string;
  type: 'organic' | 'chemical' | 'bio';
  npkRatio: { nitrogen: number; phosphorus: number; potassium: number };
  applicationMethod: 'broadcast' | 'banded' | 'foliar' | 'drip';
  cost: number; // per hectare
  suitableCrops: string[];
  environmentalImpact: 'low' | 'medium' | 'high';
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  weatherConditions: {
    temperature: number; // average temperature
    rainfall: number; // mm per month
    humidity: number; // percentage
    sunlight: number; // hours per day
  };
  irrigationStrategy: IrrigationStrategy;
  fertilizerStrategy: FertilizerStrategy;
  plots: FarmPlot[];
  results: SimulationResult;
}

export interface SimulationResult {
  totalYield: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  yieldPerHectare: number;
  waterUsage: number;
  carbonFootprint: number;
  sustainabilityScore: number;
  recommendations: string[];
}

export interface FarmLayout {
  id: string;
  name: string;
  totalArea: number; // hectares
  plots: FarmPlot[];
  irrigationSystem: IrrigationStrategy;
  soilType: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: Date;
  lastModified: Date;
}
