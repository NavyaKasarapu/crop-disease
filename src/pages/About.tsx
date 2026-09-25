import React from 'react';
import { 
  Cpu, 
  Database, 
  Layers, 
  Server, 
  TrendingUp, 
  CheckCircle2, 
  FileCode2, 
  Activity, 
  ShieldCheck,
  Eye,
  BookOpen
} from 'lucide-react';

interface AboutProps {
  onOpenBackendModal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenBackendModal }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Final-Year Engineering Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 font-display tracking-tight text-balance">
          Plant Disease Detection using Vision Transformer
        </h1>
        <p className="text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
          An automated agricultural diagnostics system combining Transformer self-attention with high-throughput microservices to address global crop yield degradation.
        </p>
      </div>

      {/* 1. Problem Statement & 2. Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-display">
            Problem Statement
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Plant diseases and foliar pathogens cause an estimated 20% to 40% loss of global agricultural food production each year according to the Food and Agriculture Organization (FAO).
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Traditional manual inspection by professional phytopathologists is prohibitively slow, expensive, and unavailable to smallholder farmers. Misdiagnosed foliar symptoms often lead to inappropriate pesticide overuse, environmental toxicity, and catastrophic crop failures.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-display">
            Proposed Solution
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            We propose an intelligent, accessible web-based computer vision platform that decouples visual inference from heavy client runtimes.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            By deploying a fine-tuned <strong>Vision Transformer (ViT)</strong> backend wrapped in a high-speed asynchronous FastAPI microservice, farmers and agronomists can upload simple smartphone photographs and receive instant, calibrated disease classifications with targeted prevention guidelines.
          </p>
        </div>
      </div>

      {/* 3. PlantVillage Dataset */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              The PlantVillage Dataset
            </h2>
            <p className="text-xs text-stone-500">
              Gold-standard open access agricultural pathology benchmark
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
            <div className="text-2xl font-extrabold text-stone-900 font-display">54,306</div>
            <div className="text-xs text-stone-500 mt-1">High-Resolution Foliar Images</div>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
            <div className="text-2xl font-extrabold text-stone-900 font-display">14 Species</div>
            <div className="text-xs text-stone-500 mt-1">Economic Agricultural Crops</div>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
            <div className="text-2xl font-extrabold text-stone-900 font-display">38 Classes</div>
            <div className="text-xs text-stone-500 mt-1">Fungal, Bacterial, Viral & Healthy</div>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">
          The PlantVillage dataset was curated by researchers at Penn State University and EPFL. It comprises laboratory-verified leaf photographs captured across standardized lighting conditions. The classes include crucial food security crops: Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Pepper Bell, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato.
        </p>
      </div>

      {/* 4. Vision Transformer (ViT) Architecture */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              Vision Transformer (ViT) Architecture
            </h2>
            <p className="text-xs text-stone-500">
              Applying Multi-Head Self-Attention to Image Classification (Dosovitskiy et al.)
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
          <p>
            Unlike traditional Convolutional Neural Networks (CNNs) like ResNet or MobileNet which rely on localized sliding kernels, the <strong>Vision Transformer (ViT)</strong> treats an image as a sequence of discrete patches, analogous to tokens in Natural Language Processing:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                1. Patch Extraction (16×16)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                An input leaf tensor of resolution 224×224×3 is divided into 196 non-overlapping patches of size 16×16. Each patch is flattened into a 768-dimensional linear projection vector.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                2. Position Embeddings & [CLS] Token
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A learnable classification <code className="font-mono text-emerald-800">[CLS]</code> token is prepended to the patch sequence, and 1D learnable position embeddings are added to preserve 2D spatial arrangement.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                3. Multi-Head Self-Attention (MSA)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                12 stacked Transformer encoder blocks allow every leaf patch to attend globally to distant leaf veins, chlorotic halos, and perimeter necrosis simultaneously.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                4. MLP Classification Head
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The representation of the <code className="font-mono text-emerald-800">[CLS]</code> token is passed through a Multi-Layer Perceptron (MLP) with LayerNorm and Softmax across the 38 output classes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Backend API & ML Architecture */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                FastAPI Backend Integration Architecture
              </h2>
              <p className="text-xs text-stone-500">
                Separation of Concerns: High-speed PyTorch server + React client
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBackendModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span>View Python Code</span>
          </button>
        </div>

        <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 font-mono text-xs overflow-x-auto space-y-2">
          <div className="text-emerald-400 font-bold"># Machine Learning Pipeline Architecture:</div>
          <div className="text-stone-300">
            PlantVillage Dataset (54,306 images)<br />
            &nbsp;&nbsp;↓<br />
            Jupyter Notebook / PyTorch (Data Augmentation, Cross-Entropy Loss, AdamW)<br />
            &nbsp;&nbsp;↓<br />
            Trained Vision Transformer Checkpoint (`plant_disease_vit.pth`)<br />
            &nbsp;&nbsp;↓<br />
            FastAPI Server (`POST /predict` accepts `multipart/form-data`)<br />
            &nbsp;&nbsp;↓<br />
            React TypeScript Frontend (Renders Confidence & Agronomic Prevention)
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">
          The frontend strictly follows zero-training constraints: no heavy weights or training routines are downloaded into the browser. The communication is entirely decoupled over REST, enabling the backend to execute on GPU instances (NVIDIA CUDA or TensorRT) while delivering sub-second response times to mobile or edge web clients.
        </p>
      </div>

      {/* 6. Future Scope */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 font-display">
          Future Scope & Enhancements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-semibold text-stone-900 text-xs">UAV Drone Aerial Surveillance</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Integration with multispectral RGB/NIR cameras mounted on autonomous agricultural drones for field-wide canopy mapping.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-semibold text-stone-900 text-xs">Micro-Weather Correlation</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Fusing image predictions with IoT soil moisture and ambient humidity sensors to forecast disease outbreaks before macroscopic symptoms manifest.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-semibold text-stone-900 text-xs">Edge ONNX / CoreML Export</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Quantizing the ViT model to INT8 precision for completely offline mobile phone inference in remote rural farming regions without internet connectivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
