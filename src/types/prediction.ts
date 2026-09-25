export interface AlternativePrediction {
  disease: string;
  plant: string;
  confidence: number;
}

export interface DiseaseInfo {
  name: string;
  plant: string;
  scientificName?: string;
  severity: 'low' | 'moderate' | 'high' | 'healthy';
  symptoms: string[];
  causes: string[];
  prevention: string[];
  optimalConditions?: string;
}

export interface PredictionResponse {
  disease: string;
  confidence: number; // Percentage 0 - 100
  plant: string;
  symptoms?: string[];
  causes?: string[];
  prevention?: string[];
  severity?: 'low' | 'moderate' | 'high' | 'healthy';
  alternativePredictions?: AlternativePrediction[];
  processingTimeMs?: number;
  modelVersion?: string;
}

export interface ModelInfoResponse {
  model: string;
  dataset: string;
  architecture?: string;
  inputSize?: string;
  classesCount?: number;
  accuracy?: number;
  framework?: string;
}

export interface HealthResponse {
  status: string;
  service?: string;
  timestamp?: string;
}

export interface UploadedImageFile {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}
