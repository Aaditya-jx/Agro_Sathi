import type { FarmPlot, Crop, IrrigationStrategy, FertilizerStrategy, SimulationScenario, SimulationResult, FarmLayout } from '../types/digitalFarm';

export class FarmSimulationService {
  private static instance: FarmSimulationService;

  static getInstance(): FarmSimulationService {
    if (!FarmSimulationService.instance) {
      FarmSimulationService.instance = new FarmSimulationService();
    }
    return FarmSimulationService.instance;
  }

  // Predefined crops database
  private crops: Crop[] = [
    {
      id: 'wheat',
      name: 'Wheat',
      variety: 'HD-2967',
      type: 'cereal',
      growthDuration: 120,
      waterRequirement: 'medium',
      nutrientRequirement: 'medium',
      temperatureTolerance: 'moderate',
      soilPreference: ['loamy', 'clay'],
      expectedYield: 3500,
      marketPrice: 22,
      growthStages: {
        seedling: { duration: 15, height: 10 },
        vegetative: { duration: 45, height: 40 },
        flowering: { duration: 20, height: 80 },
        maturity: { duration: 40, height: 100 }
      }
    },
    {
      id: 'rice',
      name: 'Rice',
      variety: 'IR64',
      type: 'cereal',
      growthDuration: 140,
      waterRequirement: 'high',
      nutrientRequirement: 'high',
      temperatureTolerance: 'hot',
      soilPreference: ['clay', 'loamy'],
      expectedYield: 4500,
      marketPrice: 25,
      growthStages: {
        seedling: { duration: 20, height: 15 },
        vegetative: { duration: 50, height: 60 },
        flowering: { duration: 25, height: 90 },
        maturity: { duration: 45, height: 120 }
      }
    },
    {
      id: 'corn',
      name: 'Corn',
      variety: 'Sweet Corn',
      type: 'cereal',
      growthDuration: 90,
      waterRequirement: 'high',
      nutrientRequirement: 'high',
      temperatureTolerance: 'hot',
      soilPreference: ['loamy', 'sandy'],
      expectedYield: 6000,
      marketPrice: 18,
      growthStages: {
        seedling: { duration: 10, height: 20 },
        vegetative: { duration: 35, height: 60 },
        flowering: { duration: 15, height: 150 },
        maturity: { duration: 30, height: 200 }
      }
    },
    {
      id: 'tomato',
      name: 'Tomato',
      variety: 'Roma',
      type: 'vegetable',
      growthDuration: 80,
      waterRequirement: 'medium',
      nutrientRequirement: 'high',
      temperatureTolerance: 'moderate',
      soilPreference: ['loamy', 'sandy'],
      expectedYield: 4000,
      marketPrice: 30,
      growthStages: {
        seedling: { duration: 12, height: 8 },
        vegetative: { duration: 30, height: 40 },
        flowering: { duration: 18, height: 60 },
        maturity: { duration: 20, height: 80 }
      }
    },
    {
      id: 'cotton',
      name: 'Cotton',
      variety: 'Bt Cotton',
      type: 'fiber',
      growthDuration: 160,
      waterRequirement: 'medium',
      nutrientRequirement: 'medium',
      temperatureTolerance: 'hot',
      soilPreference: ['black', 'red'],
      expectedYield: 2000,
      marketPrice: 45,
      growthStages: {
        seedling: { duration: 25, height: 15 },
        vegetative: { duration: 60, height: 60 },
        flowering: { duration: 35, height: 100 },
        maturity: { duration: 40, height: 120 }
      }
    }
  ];

  // Predefined irrigation strategies
  private irrigationStrategies: IrrigationStrategy[] = [
    {
      id: 'drip_irrigation',
      name: 'Drip Irrigation',
      type: 'drip',
      waterUsage: 5000,
      efficiency: 95,
      cost: 8000,
      frequency: 'daily',
      suitableCrops: ['wheat', 'corn', 'tomato', 'cotton']
    },
    {
      id: 'sprinkler_irrigation',
      name: 'Sprinkler Irrigation',
      type: 'sprinkler',
      waterUsage: 8000,
      efficiency: 75,
      cost: 6000,
      frequency: 'weekly',
      suitableCrops: ['wheat', 'rice', 'corn']
    },
    {
      id: 'flood_irrigation',
      name: 'Flood Irrigation',
      type: 'flood',
      waterUsage: 15000,
      efficiency: 60,
      cost: 4000,
      frequency: 'weekly',
      suitableCrops: ['rice']
    },
    {
      id: 'drought_irrigation',
      name: 'Drought Irrigation',
      type: 'drought',
      waterUsage: 3000,
      efficiency: 85,
      cost: 5000,
      frequency: 'biweekly',
      suitableCrops: ['wheat', 'cotton', 'tomato']
    }
  ];

  // Predefined fertilizer strategies
  private fertilizerStrategies: FertilizerStrategy[] = [
    {
      id: 'organic_compost',
      name: 'Organic Compost',
      type: 'organic',
      npkRatio: { nitrogen: 2, phosphorus: 1, potassium: 3 },
      applicationMethod: 'broadcast',
      cost: 2000,
      suitableCrops: ['wheat', 'corn', 'tomato', 'cotton'],
      environmentalImpact: 'low'
    },
    {
      id: 'chemical_npk',
      name: 'Chemical NPK',
      type: 'chemical',
      npkRatio: { nitrogen: 20, phosphorus: 20, potassium: 20 },
      applicationMethod: 'broadcast',
      cost: 3000,
      suitableCrops: ['wheat', 'rice', 'corn'],
      environmentalImpact: 'high'
    },
    {
      id: 'bio_fertilizer',
      name: 'Bio-Fertilizer',
      type: 'bio',
      npkRatio: { nitrogen: 10, phosphorus: 5, potassium: 15 },
      applicationMethod: 'drip',
      cost: 4000,
      suitableCrops: ['tomato', 'cotton'],
      environmentalImpact: 'medium'
    }
  ];

  getCrops(): Crop[] {
    return this.crops;
  }

  getIrrigationStrategies(): IrrigationStrategy[] {
    return this.irrigationStrategies;
  }

  getFertilizerStrategies(): FertilizerStrategy[] {
    return this.fertilizerStrategies;
  }

  // Helper method to get frequency in days
  private getFrequencyDays(frequency: string): number {
    switch (frequency) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'biweekly': return 14;
      case 'monthly': return 30;
      default: return 7;
    }
  }

  // Calculate crop growth based on conditions
  calculateCropGrowth(plot: FarmPlot, daysElapsed: number, scenario: SimulationScenario): FarmPlot {
    if (!plot.currentCrop) return plot;

    const crop = this.crops.find(c => c.id === plot.currentCrop?.id);
    if (!crop) return plot;

    const totalDays = crop.growthDuration;
    const growthProgress = Math.min(daysElapsed / totalDays, 1);

    // Determine growth stage
    let growthStage: 'seedling' | 'vegetative' | 'flowering' | 'maturity' | 'harvested' = 'seedling';
    let cumulativeDays = 0;

    if (growthProgress >= 1) {
      growthStage = 'harvested';
    } else {
      const stages = ['seedling', 'vegetative', 'flowering', 'maturity'] as const;
      for (const stage of stages) {
        cumulativeDays += crop.growthStages[stage].duration;
        if (growthProgress < cumulativeDays / totalDays) {
          growthStage = stage;
          break;
        }
      }
    }

    // Calculate health based on conditions
    const health = this.calculateCropHealth(plot, scenario, crop);

    // Update plot
    return {
      ...plot,
      growthStage,
      health,
      lastUpdated: new Date()
    };
  }

  // Calculate crop health based on environmental conditions
  private calculateCropHealth(plot: FarmPlot, scenario: SimulationScenario, crop: Crop): number {
    let health = 100;

    // Water level impact
    const waterImpact = plot.waterLevel < 30 ? -30 : plot.waterLevel > 80 ? -10 : 0;
    health += waterImpact;

    // Nutrient level impact
    const nutrientImpact = plot.nutrientLevel < 30 ? -25 : plot.nutrientLevel > 80 ? -5 : 0;
    health += nutrientImpact;

    // Soil compatibility
    if (plot.currentCrop) {
      const soilScore = this.getSoilCompatibility(plot.soilType, plot.currentCrop.soilPreference);
      health += soilScore;
    }

    // Weather conditions impact
    const weatherScore = this.getWeatherScore(crop, scenario.weatherConditions);
    health += weatherScore;

    // Irrigation strategy efficiency
    const irrigationScore = scenario.irrigationStrategy.efficiency / 100 * 10;
    health += irrigationScore;

    return Math.max(0, Math.min(100, health));
  }

// ...
  // Get soil compatibility score
  private getSoilCompatibility(plotSoil: string, preferredSoils: string[]): number {
    if (preferredSoils.includes(plotSoil)) return 20;
    if (plotSoil === 'loamy') return 10; // Loamy is generally good for most crops
    return -10;
  }

  // Get weather compatibility score
  private getWeatherScore(crop: Crop, weather: any): number {
    let score = 0;

    // Temperature compatibility
    if (crop.temperatureTolerance === 'hot' && weather.temperature > 25) score += 10;
    else if (crop.temperatureTolerance === 'cool' && weather.temperature < 20) score += 10;
    else if (crop.temperatureTolerance === 'moderate' && weather.temperature >= 20 && weather.temperature <= 25) score += 10;
    else score -= 10;

    // Rainfall impact
    if (crop.waterRequirement === 'high' && weather.rainfall > 100) score += 5;
    else if (crop.waterRequirement === 'low' && weather.rainfall < 50) score += 5;
    else score -= 5;

    return score;
  }

  // Simulate irrigation effects
  simulateIrrigation(plot: FarmPlot, _strategy: IrrigationStrategy): FarmPlot {
    const waterIncrease = _strategy.waterUsage / 30; // Daily water increase
    const newWaterLevel = Math.min(100, plot.waterLevel + waterIncrease);
    
    return {
      ...plot,
      waterLevel: newWaterLevel,
      lastUpdated: new Date()
    };
  }

  // Simulate fertilizer effects
  simulateFertilizer(plot: FarmPlot, _strategy: FertilizerStrategy): FarmPlot {
    const nutrientIncrease = 20; // Base nutrient increase
    const newNutrientLevel = Math.min(100, plot.nutrientLevel + nutrientIncrease);
    
    return {
      ...plot,
      nutrientLevel: newNutrientLevel,
      lastUpdated: new Date()
    };
  }

  // Run complete simulation
  runSimulation(scenario: SimulationScenario): SimulationResult {
    let totalYield = 0;
    let totalCost = 0;
    let totalWaterUsage = 0;
    let carbonFootprint = 0;

    // Simulate each plot over the scenario duration
    const updatedPlots = scenario.plots.map(plot => {
      let currentPlot = { ...plot };
      
      for (let day = 0; day < scenario.duration; day++) {
        // Apply irrigation
        if (day % this.getFrequencyDays(scenario.irrigationStrategy.frequency) === 0) {
          currentPlot = this.simulateIrrigation(currentPlot, scenario.irrigationStrategy);
          totalWaterUsage += scenario.irrigationStrategy.waterUsage;
          totalCost += scenario.irrigationStrategy.cost / 90; // Seasonal cost divided by days
        }

        // Apply fertilizer
        if (day === 30) { // Apply once per month
          currentPlot = this.simulateFertilizer(currentPlot, scenario.fertilizerStrategy);
          totalCost += scenario.fertilizerStrategy.cost;
          carbonFootprint += scenario.fertilizerStrategy.environmentalImpact === 'high' ? 100 : 
                          scenario.fertilizerStrategy.environmentalImpact === 'medium' ? 50 : 10;
        }

        // Calculate growth
        currentPlot = this.calculateCropGrowth(currentPlot, day, scenario);

        // Calculate yield at harvest
        if (currentPlot.growthStage === 'harvested' && currentPlot.currentCrop) {
          const yieldMultiplier = currentPlot.health / 100;
          const plotYield = (currentPlot.currentCrop.expectedYield * (plot.width * plot.height / 10000)) * yieldMultiplier;
          totalYield += plotYield;
        }
      }

      return currentPlot;
    });

    // Calculate results
    const totalRevenue = updatedPlots.reduce((sum, plot) => {
      if (plot.currentCrop && plot.growthStage === 'harvested') {
        const plotArea = (plot.width * plot.height) / 10000; // Convert to hectares
        const yieldMultiplier = plot.health / 100;
        const plotYield = plot.currentCrop.expectedYield * plotArea * yieldMultiplier;
        return sum + (plotYield * plot.currentCrop.marketPrice);
      }
      return sum;
    }, 0);

    const profit = totalRevenue - totalCost;
    const yieldPerHectare = totalYield / (updatedPlots.reduce((sum, plot) => sum + (plot.width * plot.height), 0) / 10000);
    const sustainabilityScore = this.calculateSustainabilityScore(scenario, updatedPlots);

    return {
      totalYield,
      totalRevenue,
      totalCost,
      profit,
      yieldPerHectare,
      waterUsage: totalWaterUsage,
      carbonFootprint,
      sustainabilityScore,
      recommendations: this.generateRecommendations(scenario, updatedPlots, totalCost, totalRevenue)
    };
  }

  // Calculate sustainability score
  private calculateSustainabilityScore(scenario: SimulationScenario, plots: FarmPlot[]): number {
    let score = 50; // Base score

    // Water efficiency
    score += scenario.irrigationStrategy.efficiency / 2;

    // Environmental impact
    if (scenario.fertilizerStrategy.environmentalImpact === 'low') score += 20;
    else if (scenario.fertilizerStrategy.environmentalImpact === 'medium') score += 10;
    else score -= 10;

    // Crop diversity
    const cropTypes = new Set(plots.map(p => p.currentCrop?.type).filter(Boolean));
    score += cropTypes.size * 5;

    return Math.max(0, Math.min(100, score));
  }

  // Generate recommendations
  private generateRecommendations(_scenario: SimulationScenario, plots: FarmPlot[], totalCost: number, totalRevenue: number): string[] {
    const recommendations: string[] = [];

    // Water usage recommendations
    if (totalCost > totalRevenue * 0.7) {
      recommendations.push("Consider more water-efficient irrigation to reduce costs");
    }

    // Soil health recommendations
    const avgNutrientLevel = plots.reduce((sum, plot) => sum + plot.nutrientLevel, 0) / plots.length;
    if (avgNutrientLevel < 50) {
      recommendations.push("Increase organic matter to improve soil health");
    }

    // Crop rotation recommendations
    const cropTypes = plots.map(p => p.currentCrop?.type).filter(Boolean);
    if (cropTypes.length < 2) {
      recommendations.push("Implement crop rotation for better soil health");
    }

    return recommendations;
  }

  // Create virtual farm layout
  createVirtualFarmLayout(name: string, totalArea: number): FarmLayout {
    const numPlots = Math.floor(totalArea * 10); // Convert hectares to plots
    const plots: FarmPlot[] = [];

    for (let i = 0; i < numPlots; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;
      
      plots.push({
        id: `plot_${i}`,
        name: `Plot ${i + 1}`,
        x: col * 120,
        y: row * 120,
        width: 100,
        height: 100,
        soilType: this.getRandomSoilType(),
        currentCrop: null,
        plantingDate: null,
        expectedHarvestDate: null,
        growthStage: 'seedling',
        health: 75,
        waterLevel: 60,
        nutrientLevel: 50,
        lastUpdated: new Date()
      });
    }

    return {
      id: `farm_${Date.now()}`,
      name,
      totalArea,
      plots,
      irrigationSystem: this.irrigationStrategies[0],
      soilType: 'mixed',
      location: {
        latitude: 20.5937,
        longitude: 78.9629,
        address: 'Sample Location'
      },
      createdAt: new Date(),
      lastModified: new Date()
    };
  }

  private getRandomSoilType(): 'sandy' | 'clay' | 'loamy' | 'black' | 'red' {
    const types: ('sandy' | 'clay' | 'loamy' | 'black' | 'red')[] = ['sandy', 'clay', 'loamy', 'black', 'red'];
    return types[Math.floor(Math.random() * types.length)];
  }
}
