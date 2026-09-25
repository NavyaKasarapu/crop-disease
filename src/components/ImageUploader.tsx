import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Sparkles, Check, FileCheck, Layers } from 'lucide-react';
import { SAMPLE_LEAVES, SampleLeaf, sampleLeafToFile } from '../data/sampleImages';
import { validateImageFile } from '../services/api';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string, sampleInfo?: SampleLeaf) => void;
  onClear: () => void;
  onDetect: () => void;
  selectedFile: File | null;
  previewUrl: string | null;
  isLoading: boolean;
  selectedSample?: SampleLeaf | null;
  errorMessage?: string | null;
  onDismissError?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onClear,
  onDetect,
  selectedFile,
  previewUrl,
  isLoading,
  selectedSample,
  errorMessage,
  onDismissError
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayError = errorMessage || internalError;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processFile = (file: File, sample?: SampleLeaf) => {
    setInternalError(null);
    if (onDismissError) onDismissError();

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setInternalError(validation.error || 'Invalid image file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onImageSelected(file, objectUrl, sample);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      processFile(selected);
    }
  };

  const handleSampleClick = async (sample: SampleLeaf) => {
    try {
      const file = await sampleLeafToFile(sample);
      processFile(file, sample);
    } catch {
      setInternalError('Could not load sample image.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Error alert banner */}
      {displayError && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold block">Upload issue</span>
              <p>{displayError}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setInternalError(null);
              if (onDismissError) onDismissError();
            }}
            className="text-red-500 hover:text-red-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Upload Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              Upload Plant Leaf Image
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Target Vision Transformer resolution: 224×224 RGB tensor
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>JPG / PNG</span>
            <span aria-hidden="true">·</span>
            <span>Max 10 MB</span>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-6">
          {!previewUrl ? (
            /* Dropzone when no file selected */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                  : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-base font-semibold text-stone-800 mb-1">
                Upload a clear image of the plant leaf.
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-5">
                Drag and drop your leaf specimen here, or click to browse files from your computer.
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Browse Files
              </button>

              <div className="mt-6 pt-4 border-t border-stone-200/60 text-[11px] text-stone-400">
                Supports single foliar leaf photography with clear contrast against natural or neutral background
              </div>
            </div>
          ) : (
            /* Image Preview Card when file loaded */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 flex items-center justify-center min-h-[320px] max-h-[460px]">
                <img
                  src={previewUrl}
                  alt="Uploaded plant leaf specimen"
                  className="max-h-[440px] w-auto max-w-full object-contain mx-auto transition-transform"
                />

                {/* Loading scanning overlay when inference in progress */}
                {isLoading && (
                  <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center">
                    <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                      {/* Pulse rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />
                      <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center">
                        <Layers className="w-8 h-8 text-emerald-300 animate-pulse" />
                      </div>
                    </div>

                    <h4 className="text-lg font-bold font-display text-white tracking-tight">
                      Analyzing your plant...
                    </h4>
                    <p className="text-xs text-emerald-200/80 font-mono mt-1">
                      Extracting 16×16 Vision Transformer Patches & Computing Attention Weights
                    </p>

                    {/* Progress scan bar */}
                    <div className="w-48 h-1.5 bg-stone-800 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                )}

                {/* Remove button */}
                {!isLoading && (
                  <button
                    onClick={onClear}
                    title="Remove image"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-stone-200 hover:text-white transition-colors shadow-md backdrop-blur-xs"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Specimen watermark tag */}
                <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono truncate max-w-[200px]">
                    {selectedFile?.name || 'leaf_specimen.jpg'}
                  </span>
                  {selectedFile?.size ? (
                    <span className="text-stone-400 font-mono text-[10px]">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClear}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Remove & Choose Another
                </button>

                <button
                  type="button"
                  onClick={onDetect}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  {isLoading ? 'Analyzing your plant...' : 'Detect Disease'}
                </button>
              </div>
            </div>
          )}

          {/* Sample Leaves Demonstration Selector (For college viva & quick testing) */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Or Try Sample PlantVillage Specimens:
              </span>
              <span className="text-[11px] text-stone-400">1-click test presets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_LEAVES.map((sample) => {
                const isCurrent = selectedSample?.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleClick(sample)}
                    disabled={isLoading}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:border-emerald-400 bg-stone-50/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-stone-900 truncate">
                        {sample.plant}
                      </span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <span className="text-stone-500 text-[11px] truncate block mb-1">
                      {sample.condition}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-medium">
                      ViT ~{sample.expectedConfidence}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
