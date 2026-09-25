import { PredictionResponse, HealthResponse, ModelInfoResponse } from '../types/prediction';
import { lookupDiseaseDetails } from '../data/plantVillageData';

// API Base URL from Vite environment variables (fallback to localhost:8000)
export const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Global state / configuration accessor for Mock API mode
// Defaults to import.meta.env.VITE_USE_MOCK_API === 'true' (or true if unset)
export function getIsMockMode(): boolean {
  const localOverride = localStorage.getItem('plantai_use_mock_api');
  if (localOverride !== null) {
    return localOverride === 'true';
  }
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
}

export function setIsMockMode(enabled: boolean): void {
  localStorage.setItem('plantai_use_mock_api', enabled ? 'true' : 'false');
}

export function getApiBaseUrl(): string {
  const localOverride = localStorage.getItem('plantai_api_url');
  if (localOverride) {
    return localOverride;
  }
  return DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem('plantai_api_url', url);
}

/**
 * Validates the uploaded file format and size
 */
export function validateImageFile(file?: File | null): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Please upload a plant leaf image.' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
  const isExtensionValid = /\.(jpe?g|png|webp|svg)$/i.test(file.name);

  if (!allowedTypes.includes(file.type) && !isExtensionValid) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.'
    };
  }

  // Max 10 MB = 10 * 1024 * 1024 bytes
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds 10 MB limit. Please upload a smaller image.'
    };
  }

  return { valid: true };
}

/**
 * Predicts disease from plant leaf image
 * Sends multipart/form-data with field name 'image' to POST /predict
 */
export async function predictPlantDisease(
  file: File,
  knownSampleInfo?: { plant: string; condition: string; confidence: number }
): Promise<PredictionResponse> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  const isMock = getIsMockMode();

  if (isMock) {
    // -------------------------------------------------------------
    // MOCK / DEMO API MODE
    // Simulates Vision Transformer (ViT) inference latency & response
    // -------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1400));

    let plant = 'Tomato';
    let disease = 'Tomato Late Blight';
    let confidence = 94.7;

    if (knownSampleInfo) {
      plant = knownSampleInfo.plant;
      disease = knownSampleInfo.condition;
      confidence = knownSampleInfo.confidence;
    } else {
      // Deterministically infer based on filename or randomized realistic PlantVillage classes
      const name = file.name.toLowerCase();
      if (name.includes('apple')) {
        plant = 'Apple';
        disease = 'Apple Scab';
        confidence = 96.2;
      } else if (name.includes('corn') || name.includes('maize')) {
        plant = 'Corn (Maize)';
        disease = 'Corn Northern Leaf Blight';
        confidence = 92.4;
      } else if (name.includes('potato')) {
        plant = 'Potato';
        disease = 'Potato Early Blight';
        confidence = 91.8;
      } else if (name.includes('healthy')) {
        plant = 'Tomato';
        disease = 'Healthy';
        confidence = 98.6;
      }
    }

    const agronomyDetails = lookupDiseaseDetails(disease, plant);

    return {
      plant,
      disease,
      confidence,
      severity: agronomyDetails?.severity || (disease.toLowerCase().includes('healthy') ? 'healthy' : 'moderate'),
      symptoms: agronomyDetails?.symptoms || [
        'Noticeable leaf spotting with chlorotic margin halos.',
        'Necrotic tissue degradation visible on upper leaf lamina.'
      ],
      causes: agronomyDetails?.causes || [
        'Fungal or bacterial pathogen spore dispersion under elevated humidity.'
      ],
      prevention: agronomyDetails?.prevention || [
        'Routine field scouting and early rogueing of diseased plant tissues.',
        'Promote canopy ventilation with wide crop row spacing.'
      ],
      alternativePredictions: [
        { plant, disease, confidence },
        {
          plant,
          disease: disease.includes('Early') ? 'Tomato Late Blight' : 'Tomato Early Blight',
          confidence: Number(((100 - confidence) * 0.72).toFixed(1))
        },
        {
          plant,
          disease: 'Tomato Septoria Leaf Spot',
          confidence: Number(((100 - confidence) * 0.28).toFixed(1))
        }
      ],
      processingTimeMs: 412,
      modelVersion: 'vit_base_patch16_224 (PlantVillage 38-class)'
    };
  }

  // -----------------------------------------------------------------
  // LIVE FASTAPI BACKEND MODE
  // Endpoint: POST /predict (multipart/form-data with key 'image')
  // -----------------------------------------------------------------
  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/predict`;

  const formData = new FormData();
  formData.append('image', file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const startTime = performance.now();
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Endpoint /predict not found on backend. Please ensure your FastAPI app is running with POST /predict.');
      } else if (response.status === 422) {
        throw new Error('FastAPI validation error: The uploaded file was not accepted as a valid image field.');
      } else if (response.status >= 500) {
        throw new Error(`AI Backend server error (${response.status}). Check Python FastAPI console logs.`);
      }
      throw new Error(`Unable to analyze this image. Server returned status ${response.status}.`);
    }

    const data = await response.json();
    const duration = Math.round(performance.now() - startTime);

    // Validate expected response structure: { disease, confidence, plant }
    if (!data || typeof data.disease !== 'string') {
      throw new Error('Invalid API response format from FastAPI server.');
    }

    // Normalize confidence: if backend sends probability 0.0 - 1.0, convert to 0 - 100
    let conf = typeof data.confidence === 'number' ? data.confidence : 0;
    if (conf <= 1.0 && conf > 0) {
      conf = Number((conf * 100).toFixed(1));
    } else {
      conf = Number(conf.toFixed(1));
    }

    const plantName = data.plant || 'Unknown Crop';
    const diseaseName = data.disease;
    const agronomicInfo = lookupDiseaseDetails(diseaseName, plantName);

    return {
      disease: diseaseName,
      plant: plantName,
      confidence: conf,
      symptoms: Array.isArray(data.symptoms) && data.symptoms.length > 0 ? data.symptoms : agronomicInfo?.symptoms,
      causes: Array.isArray(data.causes) && data.causes.length > 0 ? data.causes : agronomicInfo?.causes,
      prevention: Array.isArray(data.prevention) && data.prevention.length > 0 ? data.prevention : agronomicInfo?.prevention,
      severity: data.severity || agronomicInfo?.severity,
      alternativePredictions: data.alternativePredictions || data.alternatives,
      processingTimeMs: data.processingTimeMs || duration,
      modelVersion: data.modelVersion || 'Vision Transformer (FastAPI PyTorch)'
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. The AI backend did not respond within 20 seconds.');
      }
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Unable to connect to the AI server. Please verify your FastAPI backend is running at ' + baseUrl + ' with CORS enabled, or toggle to Demo Mode.');
      }
      throw err;
    }
    throw new Error('Unable to connect to the AI server. Please try again.');
  }
}

/**
 * Checks health of FastAPI backend: GET /health
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  const isMock = getIsMockMode();
  if (isMock) {
    return { status: 'ok', service: 'PlantAI Demo Simulator (ViT)', timestamp: new Date().toISOString() };
  }

  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/health`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Health check returned status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw new Error('FastAPI backend is offline or unreachable at ' + baseUrl);
  }
}

/**
 * Retrieves Model Information: GET /model-info
 */
export async function getModelInfo(): Promise<ModelInfoResponse> {
  const isMock = getIsMockMode();
  if (isMock) {
    return {
      model: 'Vision Transformer (ViT-Base-16)',
      dataset: 'PlantVillage (54,306 images)',
      architecture: 'ViT-B/16 (12 layers, 12 heads, 768 hidden dim)',
      inputSize: '224x224x3',
      classesCount: 38,
      accuracy: 98.4,
      framework: 'PyTorch / timm / FastAPI'
    };
  }

  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/model-info`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Could not retrieve model info');
    }
    return await res.json();
  } catch {
    // Graceful fallback
    return {
      model: 'Vision Transformer',
      dataset: 'PlantVillage',
      framework: 'FastAPI / PyTorch'
    };
  }
}
