import type { ClimateRiskData, CropRecommendation, ClimateAlert } from '../types/climate';

export class ClimateRiskService {
  private static instance: ClimateRiskService;

  static getInstance(): ClimateRiskService {
    if (!ClimateRiskService.instance) {
      ClimateRiskService.instance = new ClimateRiskService();
    }
    return ClimateRiskService.instance;
  }

  // Calculate farm-level climate risk score
  calculateRiskScore(farmData: any): number {
    let riskScore = 0;
    
    // Historical weather patterns (40% weight)
    const historicalRisk = this.calculateHistoricalRisk(farmData.location);
    riskScore += historicalRisk * 0.4;
    
    // Current environmental conditions (30% weight)
    const environmentalRisk = this.calculateEnvironmentalRisk(farmData);
    riskScore += environmentalRisk * 0.3;
    
    // Soil and topography (20% weight)
    const soilRisk = this.calculateSoilRisk(farmData.soilType, farmData.elevation);
    riskScore += soilRisk * 0.2;
    
    // Crop vulnerability (10% weight)
    const cropRisk = this.calculateCropRisk(farmData.currentCrops);
    riskScore += cropRisk * 0.1;
    
    return Math.min(100, Math.max(0, riskScore));
  }

  // Predict specific climate risks
  predictClimateRisks(farmData: any): ClimateRiskData['predictions'] {
    const location = farmData.location;
    const season = this.getCurrentSeason();
    
    return {
      drought: this.predictDroughtRisk(location, season),
      flood: this.predictFloodRisk(location, season),
      heatwave: this.predictHeatwaveRisk(location, season)
    };
  }

  // Generate climate-resilient crop recommendations
  generateCropRecommendations(riskData: ClimateRiskData): CropRecommendation[] {
    const { predictions } = riskData;
    
    // Base climate-resilient crops database
    const climateResilientCrops: CropRecommendation[] = [
      {
        name: 'Millet',
        resilienceScore: 85,
        waterRequirement: 'low',
        temperatureTolerance: 'hot',
        soilType: ['sandy', 'loamy'],
        expectedYield: '800-1200 kg/ha',
        marketDemand: 'medium',
        plantingSeason: ['kharif', 'zaid']
      },
      {
        name: 'Sorghum',
        resilienceScore: 82,
        waterRequirement: 'low',
        temperatureTolerance: 'hot',
        soilType: ['sandy', 'clay', 'loamy'],
        expectedYield: '1000-1500 kg/ha',
        marketDemand: 'medium',
        plantingSeason: ['kharif', 'rabi']
      },
      {
        name: 'Cowpea',
        resilienceScore: 78,
        waterRequirement: 'low',
        temperatureTolerance: 'hot',
        soilType: ['sandy', 'loamy'],
        expectedYield: '600-900 kg/ha',
        marketDemand: 'high',
        plantingSeason: ['kharif', 'zaid']
      },
      {
        name: 'Pigeon Pea',
        resilienceScore: 80,
        waterRequirement: 'medium',
        temperatureTolerance: 'moderate',
        soilType: ['loamy', 'black'],
        expectedYield: '1200-1800 kg/ha',
        marketDemand: 'high',
        plantingSeason: ['kharif']
      },
      {
        name: 'Groundnut',
        resilienceScore: 75,
        waterRequirement: 'medium',
        temperatureTolerance: 'hot',
        soilType: ['sandy', 'loamy'],
        expectedYield: '1500-2500 kg/ha',
        marketDemand: 'high',
        plantingSeason: ['kharif']
      }
    ];

    // Filter and rank based on specific risks
    return climateResilientCrops
      .filter(crop => this.isCropSuitableForRisks(crop, predictions))
      .sort((a, b) => b.resilienceScore - a.resilienceScore)
      .slice(0, 3);
  }

  // Generate adaptation strategies
  generateAdaptationStrategies(riskData: ClimateRiskData): string[] {
    const strategies: string[] = [];
    const { predictions } = riskData;

    if (predictions.drought.risk > 60) {
      strategies.push(
        'Implement drip irrigation system',
        'Use mulching techniques to retain soil moisture',
        'Plant drought-resistant crop varieties',
        'Create water harvesting structures'
      );
    }

    if (predictions.flood.risk > 60) {
      strategies.push(
        'Build raised beds for planting',
        'Create proper drainage channels',
        'Plant flood-resistant crops',
        'Establish early warning systems'
      );
    }

    if (predictions.heatwave.risk > 60) {
      strategies.push(
        'Install shade nets for sensitive crops',
        'Adjust planting schedules to avoid peak heat',
        'Use heat-tolerant crop varieties',
        'Implement fogging or misting systems'
      );
    }

    // General climate adaptation strategies
    strategies.push(
      'Diversify crop portfolio',
      'Implement crop rotation practices',
      'Use organic farming methods',
      'Maintain soil health through cover crops'
    );

    return strategies.slice(0, 5);
  }

  // Private helper methods
  private calculateHistoricalRisk(_location: any): number {
    // Simulate historical weather pattern analysis
    // In real implementation, this would use historical weather data
    return Math.random() * 60 + 20; // 20-80 range
  }

  private calculateEnvironmentalRisk(_farmData: any): number {
    // Simulate environmental condition analysis
    // In real implementation, this would use current weather data
    return Math.random() * 50 + 10; // 10-60 range
  }

  private calculateSoilRisk(soilType: string, elevation: number): number {
    const soilRiskMap: { [key: string]: number } = {
      'sandy': 70,
      'clay': 40,
      'loamy': 20,
      'black': 30,
      'red': 50
    };
    
    const elevationRisk = elevation > 500 ? 20 : 0;
    return (soilRiskMap[soilType] || 50) + elevationRisk;
  }

  private calculateCropRisk(_currentCrops: string[]): number {
    // Simulate crop vulnerability assessment
    return Math.random() * 40 + 10; // 10-50 range
  }

  private predictDroughtRisk(_location: any, _season: string): any {
    const baseRisk = Math.random() * 60 + 20;
    return {
      risk: baseRisk,
      probability: baseRisk / 100,
      timeFrame: 'Next 3 months',
      severity: baseRisk > 70 ? 'severe' : baseRisk > 40 ? 'moderate' : 'mild'
    };
  }

  private predictFloodRisk(_location: any, _season: string): any {
    const baseRisk = Math.random() * 50 + 10;
    return {
      risk: baseRisk,
      probability: baseRisk / 100,
      timeFrame: 'Next 2 months',
      severity: baseRisk > 60 ? 'severe' : baseRisk > 30 ? 'moderate' : 'mild'
    };
  }

  private predictHeatwaveRisk(_location: any, _season: string): any {
    const baseRisk = Math.random() * 70 + 15;
    return {
      risk: baseRisk,
      probability: baseRisk / 100,
      timeFrame: 'Next 1-2 months',
      severity: baseRisk > 75 ? 'severe' : baseRisk > 45 ? 'moderate' : 'mild'
    };
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 6 && month <= 9) return 'kharif';
    if (month >= 10 || month <= 2) return 'rabi';
    return 'zaid';
  }

  private isCropSuitableForRisks(crop: CropRecommendation, predictions: any): boolean {
    // Check if crop is suitable for predicted risks
    if (predictions.drought.risk > 60 && crop.waterRequirement !== 'low') {
      return false;
    }
    if (predictions.heatwave.risk > 60 && crop.temperatureTolerance === 'cool') {
      return false;
    }
    return true;
  }

  // Generate climate alerts
  generateClimateAlerts(riskData: ClimateRiskData[]): ClimateAlert[] {
    const alerts: ClimateAlert[] = [];
    
    riskData.forEach(farm => {
      const { predictions } = farm;
      
      if (predictions.drought.risk > 70) {
        alerts.push({
          id: `drought-${farm.id}`,
          type: 'drought',
          severity: predictions.drought.severity === 'severe' ? 'critical' : 'high',
          title: 'High Drought Risk Alert',
          description: `Farm at ${farm.location.address} faces severe drought risk in ${predictions.drought.timeFrame}`,
          affectedAreas: [farm.location.address],
          startTime: new Date(),
          endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          recommendedActions: [
            'Implement water conservation measures',
            'Consider drought-resistant crops',
            'Prepare irrigation systems'
          ]
        });
      }
      
      if (predictions.flood.risk > 70) {
        alerts.push({
          id: `flood-${farm.id}`,
          type: 'flood',
          severity: predictions.flood.severity === 'severe' ? 'critical' : 'high',
          title: 'High Flood Risk Alert',
          description: `Farm at ${farm.location.address} faces severe flood risk in ${predictions.flood.timeFrame}`,
          affectedAreas: [farm.location.address],
          startTime: new Date(),
          endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          recommendedActions: [
            'Create proper drainage systems',
            'Elevate farm beds',
            'Prepare flood-resistant crops'
          ]
        });
      }
      
      if (predictions.heatwave.risk > 70) {
        alerts.push({
          id: `heatwave-${farm.id}`,
          type: 'heatwave',
          severity: predictions.heatwave.severity === 'severe' ? 'critical' : 'high',
          title: 'High Heatwave Risk Alert',
          description: `Farm at ${farm.location.address} faces severe heatwave risk in ${predictions.heatwave.timeFrame}`,
          affectedAreas: [farm.location.address],
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          recommendedActions: [
            'Install shade nets',
            'Adjust irrigation schedules',
            'Use heat-tolerant varieties'
          ]
        });
      }
    });
    
    return alerts;
  }
}
