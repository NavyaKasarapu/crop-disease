import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Server, Cpu, Database, ExternalLink } from 'lucide-react';
import { getApiBaseUrl, getIsMockMode, setApiBaseUrl, setIsMockMode } from '../services/api';

interface BackendCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChanged?: () => void;
}

export const BackendCodeModal: React.FC<BackendCodeModalProps> = ({
  isOpen,
  onClose,
  onSettingsChanged
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fastapi' | 'guide' | 'settings'>('fastapi');
  
  // Settings form state
  const [mockMode, setMockModeState] = useState<boolean>(getIsMockMode());
  const [apiUrl, setApiUrlState] = useState<string>(getApiBaseUrl());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMockMode(mockMode);
    setApiBaseUrl(apiUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    if (onSettingsChanged) onSettingsChanged();
  };

  const fastApiCode = `"""
PlantAI: Vision Transformer (ViT) FastAPI Backend Service
Project: AI-Based Plant Disease Detection System
Dataset: PlantVillage (38 Classes, 14 Crop Species)
Architecture: ViT-Base (Patch Size 16x16, Image Size 224x224)
"""

import io
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
import torchvision.transforms as transforms
import timm

# 1. Initialize FastAPI Application
app = FastAPI(
    title="PlantAI ViT Inference API",
    description="Vision Transformer inference service for PlantVillage plant leaf disease detection",
    version="1.0.0"
)

# 2. Configure CORS (Allows React frontend at localhost:3000 or production domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to ["http://localhost:3000"] in strict production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define PlantVillage 38 Classes (Exact Order from Training Phase)
CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight",
    "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy",
    "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# 4. Device Selection & Model Loader
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_vit_model(model_weights_path: Optional[str] = None):
    # Initialize ViT-Base architecture for 38 target classes
    model = timm.create_model("vit_base_patch16_224", pretrained=True, num_classes=len(CLASS_NAMES))
    
    # Load your fine-tuned checkpoint (.pth or .pt) if present
    if model_weights_path:
        try:
            state_dict = torch.load(model_weights_path, map_location=device)
            model.load_state_dict(state_dict)
            print(f"[OK] Successfully loaded weights from {model_weights_path}")
        except Exception as e:
            print(f"[WARN] Could not load checkpoint ({e}). Running on initialized weights.")
            
    model.to(device)
    model.eval()
    return model

# Global model instance
model = load_vit_model("plant_disease_vit.pth")

# 5. Image Preprocessing Pipeline for ViT (Standard 224x224, ImageNet Normalization)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# 6. Pydantic Response Schemas
class AlternativePrediction(BaseModel):
    plant: str
    disease: str
    confidence: float

class PredictionResponse(BaseModel):
    plant: str
    disease: str
    confidence: float
    symptoms: Optional[List[str]] = None
    causes: Optional[List[str]] = None
    prevention: Optional[List[str]] = None
    alternativePredictions: Optional[List[AlternativePrediction]] = None
    processingTimeMs: Optional[int] = None
    modelVersion: str = "vit_base_patch16_224"

# 7. Helper: Format Class Labels
def parse_class_label(raw_class: str):
    # e.g., 'Tomato___Late_blight' -> ('Tomato', 'Tomato Late Blight')
    parts = raw_class.split("___")
    plant = parts[0].replace("_", " ").strip()
    disease_suffix = parts[1].replace("_", " ").strip()
    
    if disease_suffix.lower() == "healthy":
        disease_name = "Healthy"
    else:
        disease_name = f"{plant} {disease_suffix}"
    return plant, disease_name

# 8. API Endpoints
@app.get("/health")
def health():
    return {"status": "ok", "device": str(device)}

@app.get("/model-info")
def model_info():
    return {
        "model": "Vision Transformer (ViT-Base/16)",
        "dataset": "PlantVillage",
        "total_classes": len(CLASS_NAMES),
        "input_resolution": "224x224"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(image: UploadFile = File(...)):
    # Validate uploaded file
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read bytes and convert to PIL RGB Image
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to decode image: {str(e)}")

    # Preprocess tensor
    input_tensor = transform(pil_image).unsqueeze(0).to(device)

    # ViT Forward Pass
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)

    # Top-3 predictions
    top_probs, top_indices = torch.topk(probabilities, 3)
    
    best_idx = top_indices[0].item()
    best_conf = float(top_probs[0].item()) * 100
    best_raw_label = CLASS_NAMES[best_idx]
    plant, disease = parse_class_label(best_raw_label)

    alternatives = []
    for p, idx in zip(top_probs, top_indices):
        alt_plant, alt_disease = parse_class_label(CLASS_NAMES[idx.item()])
        alternatives.append(AlternativePrediction(
            plant=alt_plant,
            disease=alt_disease,
            confidence=round(float(p.item()) * 100, 1)
        ))

    return PredictionResponse(
        plant=plant,
        disease=disease,
        confidence=round(best_conf, 1),
        alternativePredictions=alternatives,
        modelVersion="vit_base_patch16_224 (PlantVillage)"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;

  const requirementsTxt = `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
torch>=2.2.0
torchvision>=0.17.0
timm>=0.9.16
pillow>=10.2.0
python-multipart>=0.0.9
pydantic>=2.6.0
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                FastAPI + Vision Transformer Backend Integration
              </h2>
              <p className="text-xs text-stone-500">
                Final-Year Project Architecture & Local Server Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 gap-2 bg-stone-50/30">
          <button
            onClick={() => setActiveTab('fastapi')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'fastapi'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            FastAPI `main.py` Code
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Integration Instructions
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Server className="w-4 h-4" />
            Active Mode & Connection Settings
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'fastapi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-stone-100 p-3 rounded-xl">
                <div>
                  <span className="text-xs font-mono font-medium text-stone-700">main.py</span>
                  <p className="text-xs text-stone-500">
                    Ready-to-run FastAPI service loading the Vision Transformer (ViT) on port 8000
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(fastApiCode, 'main_py')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  {copiedKey === 'main_py' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy main.py
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-stone-900 text-stone-100 border border-stone-800">
                <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[420px] leading-relaxed">
                  <code>{fastApiCode}</code>
                </pre>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-stone-800">requirements.txt</span>
                  <button
                    onClick={() => handleCopy(requirementsTxt, 'requirements')}
                    className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    {copiedKey === 'requirements' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy requirements.txt
                  </button>
                </div>
                <pre className="text-xs font-mono text-stone-600 bg-white p-3 rounded-lg border border-stone-200/80">
                  {requirementsTxt}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
              {/* Architecture flow */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  Machine Learning Architecture Flow
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-700 pt-1">
                  <span className="bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">PlantVillage Dataset (54k images)</span>
                  <span>→</span>
                  <span className="bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">Jupyter Notebook Training</span>
                  <span>→</span>
                  <span className="bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">ViT Checkpoint (.pth)</span>
                  <span>→</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-semibold">FastAPI POST /predict</span>
                  <span>→</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-semibold">React Frontend</span>
                </div>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <h4 className="font-semibold text-stone-900">How to Run the Entire Stack Locally:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-stone-600">
                  <li>
                    <strong>Install Python Dependencies:</strong>
                    <div className="bg-stone-900 text-stone-100 font-mono text-xs p-2.5 rounded-lg my-1">
                      pip install fastapi uvicorn torch torchvision timm pillow python-multipart
                    </div>
                  </li>
                  <li>
                    <strong>Start the FastAPI Server:</strong>
                    <div className="bg-stone-900 text-stone-100 font-mono text-xs p-2.5 rounded-lg my-1">
                      uvicorn main:app --reload --port 8000
                    </div>
                    The API documentation will be available at <code className="text-emerald-700 font-mono">http://localhost:8000/docs</code>.
                  </li>
                  <li>
                    <strong>Connect the React Frontend:</strong>
                    In your frontend <code className="bg-stone-100 px-1 py-0.5 rounded text-xs font-mono">.env</code>:
                    <div className="bg-stone-900 text-stone-100 font-mono text-xs p-2.5 rounded-lg my-1">
                      VITE_API_URL=http://localhost:8000<br />
                      VITE_USE_MOCK_API=false
                    </div>
                    Or toggle to Live Mode directly in the tab next to this!
                  </li>
                </ol>
              </div>

              {/* API Contract */}
              <div className="border border-stone-200 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-stone-900">API Contract (`POST /predict`):</h4>
                <div className="text-xs space-y-1 text-stone-600">
                  <p><strong>Method:</strong> <span className="font-mono text-emerald-700">POST</span></p>
                  <p><strong>Path:</strong> <span className="font-mono">/predict</span></p>
                  <p><strong>Content-Type:</strong> <span className="font-mono">multipart/form-data</span></p>
                  <p><strong>Payload key:</strong> <span className="font-mono">image</span> (Binary image file)</p>
                  <p><strong>Expected Response:</strong></p>
                  <pre className="bg-stone-100 p-2 rounded text-stone-800 font-mono mt-1">
{`{
  "plant": "Tomato",
  "disease": "Tomato Late Blight",
  "confidence": 94.7
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Runtime API Mode</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Switch between the simulated Vision Transformer mock inference and real FastAPI backend.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label
                    onClick={() => setMockModeState(true)}
                    className={`cursor-pointer p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      mockMode
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-stone-900 text-sm">Demo / Mock Mode</span>
                      <input
                        type="radio"
                        checked={mockMode}
                        onChange={() => setMockModeState(true)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-xs text-stone-600">
                      Returns realistic Vision Transformer PlantVillage predictions without requiring a running Python backend. Ideal for offline demonstrations.
                    </p>
                  </label>

                  <label
                    onClick={() => setMockModeState(false)}
                    className={`cursor-pointer p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      !mockMode
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-stone-900 text-sm">Live FastAPI Mode</span>
                      <input
                        type="radio"
                        checked={!mockMode}
                        onChange={() => setMockModeState(false)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-xs text-stone-600">
                      Dispatches live multipart/form-data POST requests to your Python FastAPI server running the PyTorch ViT model.
                    </p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  FastAPI Base URL (`VITE_API_URL`)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrlState(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setApiUrlState('http://localhost:8000')}
                    className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl bg-stone-50"
                  >
                    Reset Default
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  Default: <code className="font-mono">http://localhost:8000</code>. Ensure your FastAPI server includes CORS middleware.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Configuration saved successfully!
                  </span>
                ) : (
                  <span className="text-xs text-stone-400">Settings persist in browser session</span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Vision Transformer PlantVillage Classifier</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-stone-600 hover:text-stone-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
