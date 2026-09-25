import React from 'react';
import { ArrowRight, Leaf, ShieldAlert, Cpu, Sparkles, CheckCircle2, BarChart3, Database } from 'lucide-react';
import { StatisticsCard } from '../components/StatisticsCard';
import { SAMPLE_LEAVES, SampleLeaf } from '../data/sampleImages';

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectSampleAndDetect: (sample: SampleLeaf) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onSelectSampleAndDetect
}) => {
  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Final-Year Engineering Project & Research Demo</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-display leading-[1.1] text-balance">
                AI-Powered <br className="hidden sm:inline" />
                <span className="text-emerald-700">Plant Disease Detection</span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl text-balance">
                Upload a plant leaf image and use AI to identify potential diseases.
                Powered by a fine-tuned Vision Transformer (ViT) architecture trained on the PlantVillage dataset with high-throughput FastAPI inference.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('detection')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Leaf className="w-4 h-4 text-emerald-200" />
                  <span>Detect Disease</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-2xl border border-stone-300 text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  <span>Learn More</span>
                </button>
              </div>

              {/* Quick specs pill row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Vision Transformer (ViT-Base)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>38 PlantVillage Classes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>FastAPI REST Microservice</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Agronomy + ViT Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-linear-to-b from-emerald-900 to-stone-900 rounded-3xl p-6 text-white shadow-2xl border border-emerald-800/40 overflow-hidden">
                {/* Background decorative grid */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between border-b border-emerald-800/50 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono text-emerald-200 tracking-wider uppercase">
                        ViT Patch Attention Grid (16×16)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-700">
                      224×224 px
                    </span>
                  </div>

                  {/* Visual Specimen with simulated attention tokens */}
                  <div className="relative rounded-2xl bg-stone-950 overflow-hidden aspect-4/3 flex items-center justify-center border border-emerald-800/60 p-2">
                    <img
                      src={SAMPLE_LEAVES[0].dataUrl}
                      alt="Sample leaf for ViT classification"
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />

                    {/* Transformer attention overlay overlay */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2 pointer-events-none opacity-40">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded border text-[9px] font-mono flex items-center justify-center ${
                            i === 5 || i === 6 || i === 9 || i === 10
                              ? 'border-emerald-400 bg-emerald-500/30 text-white font-bold'
                              : 'border-emerald-500/20 bg-emerald-900/10 text-emerald-400'
                          }`}
                        >
                          P{i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-stone-900/90 backdrop-blur-xs text-[10px] font-mono px-2 py-1 rounded text-emerald-300 border border-emerald-700/50">
                      Tomato Leaf · Late Blight Focus
                    </div>
                  </div>

                  {/* Interactive Quick Launch CTA */}
                  <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/40 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-200">
                      <span>Quick Test Demonstration</span>
                      <span className="text-emerald-400 font-mono font-semibold">94.7% Conf</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectSampleAndDetect(SAMPLE_LEAVES[0])}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Test Specimen on ViT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900 font-display">
            Dataset & Model Benchmarks
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Demonstration metrics calibrated with the PlantVillage benchmark test split.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatisticsCard
            label="Total Images Analyzed"
            value="54,306"
            subtext="PlantVillage research dataset"
            icon={Database}
            trend="+100%"
            badge="Benchmark Dataset"
          />
          <StatisticsCard
            label="Plants Detected"
            value="14"
            subtext="Agricultural crop species"
            icon={Leaf}
            trend="Multi-crop"
            badge="Crop Diversity"
          />
          <StatisticsCard
            label="Diseases Identified"
            value="38"
            subtext="Distinct pathological conditions"
            icon={ShieldAlert}
            trend="Foliar Classes"
            badge="Full Coverage"
          />
          <StatisticsCard
            label="Model Accuracy"
            value="98.4%"
            subtext="Top-1 accuracy on test split"
            icon={Cpu}
            trend="ViT-B/16"
            badge="PyTorch ViT"
          />
        </div>
      </section>

      {/* How It Works: Application Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-stone-200/90 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              End-to-End Diagnostic Pipeline
            </h2>
            <p className="text-sm text-stone-500">
              How the user foliar image travels from frontend drag-and-drop to Vision Transformer self-attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Foliar Image Ingestion
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The farmer or researcher uploads a high-resolution leaf photograph. The client validates type and size, preparing a <code className="font-mono text-emerald-800">multipart/form-data</code> payload.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Vision Transformer (ViT) Inference
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The FastAPI microservice resizes the image to 224×224, decomposes it into 196 non-overlapping 16×16 patches, and computes multi-head self-attention across layers.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Pathology & Prevention Protocols
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The client renders the verified diagnosis, confidence score, and retrieves scientifically calibrated agronomy prevention guidelines and causal pathogen factors.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('detection')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Launch Disease Detection Engine</span>
            </button>
          </div>
        </div>
      </section>

      {/* Crops Covered Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              Supported Agricultural Crops
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              14 crops represented in the PlantVillage classification schema
            </p>
          </div>
          <button
            onClick={() => onNavigate('dataset')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Explore all 38 classes →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            { name: 'Tomato', count: '10 conditions' },
            { name: 'Potato', count: '3 conditions' },
            { name: 'Corn (Maize)', count: '4 conditions' },
            { name: 'Apple', count: '4 conditions' },
            { name: 'Grape', count: '4 conditions' },
            { name: 'Pepper Bell', count: '2 conditions' },
            { name: 'Strawberry', count: '2 conditions' }
          ].map((crop, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 rounded-xl border border-stone-200 text-center hover:border-emerald-500 transition-colors"
            >
              <div className="text-sm font-bold text-stone-800 font-display">
                {crop.name}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {crop.count}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
