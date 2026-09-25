import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { PredictionResult } from '../components/PredictionResult';
import { PredictionResponse } from '../types/prediction';
import { SampleLeaf, sampleLeafToFile } from '../data/sampleImages';
import { predictPlantDisease, getIsMockMode } from '../services/api';
import { Sparkles, AlertCircle, RefreshCw, Cpu, Server } from 'lucide-react';

interface DetectionProps {
  initialSample?: SampleLeaf | null;
  onClearInitialSample?: () => void;
  onOpenBackendModal: () => void;
}

export const Detection: React.FC<DetectionProps> = ({
  initialSample,
  onClearInitialSample,
  onOpenBackendModal
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleLeaf | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If initialSample is provided from home page, auto load it
  useEffect(() => {
    if (initialSample) {
      setSelectedSample(initialSample);
      setPreviewUrl(initialSample.dataUrl);
      sampleLeafToFile(initialSample).then((file) => {
        setSelectedFile(file);
      });
      if (onClearInitialSample) onClearInitialSample();
    }
  }, [initialSample, onClearInitialSample]);

  const handleImageSelected = (file: File, url: string, sample?: SampleLeaf) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setSelectedSample(sample || null);
    setPrediction(null);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedSample(null);
    setPrediction(null);
    setErrorMessage(null);
  };

  const handleDetectDisease = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload a plant leaf image.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const sampleInfo = selectedSample
        ? {
            plant: selectedSample.plant,
            condition: selectedSample.condition,
            confidence: selectedSample.expectedConfidence
          }
        : undefined;

      const result = await predictPlantDisease(selectedFile, sampleInfo);
      setPrediction(result);
    } catch (err: unknown) {
      console.error('Detection error:', err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unable to analyze this image. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isMock = getIsMockMode();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>Vision Transformer Classification Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
          Plant Disease Detection
        </h1>
        <p className="text-sm text-stone-600">
          Analyze foliar symptoms against 38 PlantVillage agricultural conditions.
        </p>
      </div>

      {/* Mode Status Pill Notice */}
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs px-4 py-2.5 bg-stone-100/90 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2 text-stone-700">
          <Server className="w-4 h-4 text-emerald-700" />
          <span>
            Current Backend Target: <strong>{isMock ? 'Demo Mode (Simulated ViT Inference)' : 'Live FastAPI Backend (POST /predict)'}</strong>
          </span>
        </div>
        <button
          onClick={onOpenBackendModal}
          className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-xs ml-2"
        >
          Change Mode / View Code
        </button>
      </div>

      {/* Main Detection Workflow */}
      {!prediction ? (
        <ImageUploader
          onImageSelected={handleImageSelected}
          onClear={handleClear}
          onDetect={handleDetectDisease}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          isLoading={isLoading}
          selectedSample={selectedSample}
          errorMessage={errorMessage}
          onDismissError={() => setErrorMessage(null)}
        />
      ) : (
        <PredictionResult
          prediction={prediction}
          previewUrl={previewUrl}
          onReset={handleClear}
        />
      )}
    </div>
  );
};
