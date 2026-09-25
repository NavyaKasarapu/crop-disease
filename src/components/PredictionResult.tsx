import React, { useState } from 'react';
import { PredictionResponse } from '../types/prediction';
import { ConfidenceBar } from './ConfidenceBar';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Clock, 
  Sprout,
  Share2,
  Printer
} from 'lucide-react';

interface PredictionResultProps {
  prediction: PredictionResponse;
  previewUrl: string | null;
  onReset: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  prediction,
  previewUrl,
  onReset
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const isHealthy = prediction.disease.toLowerCase().includes('healthy');

  const handleShare = () => {
    const text = `PlantAI Diagnostic: ${prediction.plant} - ${prediction.disease} (${prediction.confidence}% confidence via Vision Transformer).`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Primary Result Banner / Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        {/* Top Status Strip */}
        <div className={`px-6 py-3 border-b flex items-center justify-between text-xs font-medium ${
          isHealthy
            ? 'bg-emerald-50/80 border-emerald-100 text-emerald-800'
            : 'bg-amber-50/80 border-amber-100 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {isHealthy ? 'Specimen Diagnosed as Healthy' : 'Pathological Foliar Condition Identified'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
            {prediction.processingTimeMs && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {prediction.processingTimeMs}ms inference
              </span>
            )}
            <span className="hidden sm:inline">ViT-Base-16</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Specimen Photo Thumbnail */}
            {previewUrl && (
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 w-full max-w-[240px] aspect-square flex items-center justify-center shadow-xs">
                  <img
                    src={previewUrl}
                    alt="Analyzed plant leaf"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white font-mono">
                    224×224 Input
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Core Metrics */}
            <div className={previewUrl ? 'md:col-span-8 space-y-4' : 'md:col-span-12 space-y-4'}>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                  <Sprout className="w-4 h-4" />
                  <span>Host Plant: {prediction.plant}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 font-display tracking-tight">
                  {prediction.disease}
                </h2>
              </div>

              {/* Confidence Progress Bar */}
              <div className="pt-1">
                <ConfidenceBar confidence={prediction.confidence} size="lg" />
              </div>

              {/* ViT Verification Callout */}
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
                <p>
                  <strong>Model Verification:</strong> Prediction generated using a Vision Transformer (ViT) model trained on the PlantVillage benchmark.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Analyze Another Image
                </button>

                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  {showDetails ? 'Hide Details' : 'View Details'}
                  {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={handleShare}
                    title="Copy diagnosis"
                    className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    title="Print report"
                    className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {copiedNotification && (
                <div className="text-xs text-emerald-700 font-medium">
                  Summary copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Predictions / ViT Softmax Distribution */}
      {prediction.alternativePredictions && prediction.alternativePredictions.length > 1 && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            Top Vision Transformer Softmax Distributions
          </h3>
          <div className="space-y-2.5">
            {prediction.alternativePredictions.map((alt, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-stone-400 w-4">{idx + 1}.</span>
                  <span className="font-medium text-stone-800">{alt.disease}</span>
                  <span className="text-stone-400">({alt.plant})</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, alt.confidence)}%` }}
                    />
                  </div>
                  <span className="font-mono font-semibold tabular-nums text-stone-700 w-12 text-right">
                    {alt.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Disease Breakdown Section */}
      {showDetails && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 md:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Agronomic Pathology & Prevention Guide
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Standard agricultural extension reference for {prediction.disease}
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Verified Reference Data
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Symptoms */}
            <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/70 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <h4>Observed Symptoms</h4>
              </div>
              {prediction.symptoms && prediction.symptoms.length > 0 ? (
                <ul className="space-y-2 text-xs text-stone-600 list-disc pl-4 leading-relaxed">
                  {prediction.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-400 italic">
                  Specific symptom records are not provided in the backend response for this class.
                </p>
              )}
            </div>

            {/* Causes */}
            <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/70 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <h4>Etiology & Causes</h4>
              </div>
              {prediction.causes && prediction.causes.length > 0 ? (
                <ul className="space-y-2 text-xs text-stone-600 list-disc pl-4 leading-relaxed">
                  {prediction.causes.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-400 italic">
                  Causal pathogen details are unavailable from backend.
                </p>
              )}
            </div>

            {/* General Prevention */}
            <div className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/70 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4>General Prevention</h4>
              </div>
              {prediction.prevention && prediction.prevention.length > 0 ? (
                <ul className="space-y-2 text-xs text-stone-600 list-disc pl-4 leading-relaxed">
                  {prediction.prevention.map((prev, i) => (
                    <li key={i}>{prev}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-stone-400 italic">
                  Prevention protocols not specified in backend database.
                </p>
              )}
            </div>
          </div>

          {/* Scientific Disclaimer note */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <p>
              <strong>Agronomic Guidance Notice:</strong> Disease information displayed here reflects standard scientific plant pathology extension literature for the PlantVillage dataset. In-field chemical treatments or fungicides must always be calibrated with licensed local agricultural extension specialists and regional regulation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
