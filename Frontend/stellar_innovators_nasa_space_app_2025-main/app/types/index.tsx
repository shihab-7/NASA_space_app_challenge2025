export type PollutionLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LightPollutionData {
  region: string;
  coordinates: Coordinates;
  pollutionLevel: PollutionLevel;
  suggestions: string[];
  trends: PollutionLevel[];
  regressionResult?: {
    night_light_mean: number;
    ndvi_mean: number;
    population_dense_mean: number;
  };
}

export interface RegressionResult {
  night_light_mean: number;
  ndvi_mean: number;
  population_dense_mean: number;
}

export interface RegionMapData {
  intensity: PollutionLevel;
  regressionResult: {
    night_light_mean: number;
    ndvi_mean: number;
    population_dense_mean: number;
  };
  llmSuggestion: string;
  population?: number;
}

export interface ApiResponse {
  regression_result: [number, number, number]; // [night_light_mean, ndvi_mean, population_dense_mean]
  classification_result: PollutionLevel;
  llm_suggestion: string;
}
