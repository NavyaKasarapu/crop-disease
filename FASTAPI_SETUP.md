# PlantAI: Vision Transformer (ViT) FastAPI Backend Guide

This project is an **AI-based Plant Disease Detection System** using a **Vision Transformer (ViT)** model trained on the **PlantVillage dataset**.

---

## 1. Machine Learning Architecture

```text
PlantVillage Dataset (54,306 images, 38 classes, 14 crops)
       ↓
Jupyter Notebook (Model Training with PyTorch & timm)
       ↓
Trained Vision Transformer Weights (plant_disease_vit.pth)
       ↓
FastAPI REST Microservice (uvicorn main:app --port 8000)
       ↓
POST /predict (multipart/form-data: image file)
       ↓
React + TypeScript Frontend (PlantAI Web App)
```

> **Note:** The frontend never trains the ML model or downloads the heavy dataset. It delegates all image classification to the Python FastAPI backend via standard REST calls.

---

## 2. Python Environment Setup & Installation

Run the following commands in your Python backend environment:

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required dependencies
pip install fastapi uvicorn torch torchvision timm pillow python-multipart pydantic
```

---

## 3. FastAPI Server Code (`main.py`)

Create a file named `main.py` in your backend directory:

```python
"""
PlantAI: Vision Transformer (ViT) FastAPI Backend Service
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

app = FastAPI(
    title="PlantAI ViT Inference API",
    description="Vision Transformer inference service for PlantVillage plant leaf disease detection",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 38 PlantVillage Classes (matching training order)
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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_vit_model(weights_path: Optional[str] = "plant_disease_vit.pth"):
    model = timm.create_model("vit_base_patch16_224", pretrained=True, num_classes=len(CLASS_NAMES))
    try:
        state_dict = torch.load(weights_path, map_location=device)
        model.load_state_dict(state_dict)
        print(f"[OK] Loaded trained checkpoint {weights_path}")
    except Exception as e:
        print(f"[WARN] Checkpoint not found ({e}). Running on pretrained ViT backbone.")
    model.to(device)
    model.eval()
    return model

model = load_vit_model()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

class PredictionResponse(BaseModel):
    plant: str
    disease: str
    confidence: float
    modelVersion: str = "vit_base_patch16_224"

def parse_class_label(raw_class: str):
    parts = raw_class.split("___")
    plant = parts[0].replace("_", " ").strip()
    disease_suffix = parts[1].replace("_", " ").strip()
    if disease_suffix.lower() == "healthy":
        disease_name = "Healthy"
    else:
        disease_name = f"{plant} {disease_suffix}"
    return plant, disease_name

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
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await image.read()
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(pil_image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probabilities = torch.nn.functional.softmax(logits[0], dim=0)

    top_prob, top_idx = torch.topk(probabilities, 1)
    best_conf = float(top_prob[0].item()) * 100
    plant, disease = parse_class_label(CLASS_NAMES[top_idx[0].item()])

    return PredictionResponse(
        plant=plant,
        disease=disease,
        confidence=round(best_conf, 1),
        modelVersion="vit_base_patch16_224"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## 4. How to Run the Backend

```bash
uvicorn main:app --reload --port 8000
```

Verify in your browser:
- Swagger Interactive API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

---

## 5. Connecting the React Frontend

In the frontend directory, configure `.env`:

```env
# Point to your FastAPI server
VITE_API_URL="http://localhost:8000"

# Set to 'false' to send live requests to FastAPI POST /predict
# Set to 'true' for standalone presentation demonstration with simulated ViT output
VITE_USE_MOCK_API="false"
```

Start the frontend:

```bash
npm run dev
```

You can also toggle between **Demo Mode** and **Live FastAPI Backend** directly inside the web UI using the "Backend Code" button in the navigation header.
