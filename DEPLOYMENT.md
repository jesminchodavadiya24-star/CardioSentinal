# 🚀 CardioSentinel Production Deployment Guide

This guide provides step-by-step instructions to deploy the entire **CardioSentinel** platform (Frontend, FastAPI Backend, ML Microservice, SQLite Database, and Audio Datasets).

---

## 🛠️ Architecture Overview

| Component | Technology Stack | Local Port | Production Service Recommendation |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Vite, React 18, Tailwind CSS | `5173` | **Vercel** / **Netlify** / **Render Static** |
| **FastAPI Backend** | Python 3.11, FastAPI, SQLite | `8000` | **Render Web Service** / **Railway** |
| **ML Microservice** | Python 3.11, SciPy, Librosa | `8001` | **Render Web Service** / **Railway** |
| **Database & Audio** | SQLite (`cardio_sentinel.db`), WAV files | Local Disk | Embedded in Backend / Render Persistent Disk |

---

## 🌐 Method 1: Cloud Deployment (Vercel + Render - FREE Tier)

### Step 1: Deploy the ML Microservice (`ml-service`) on Render

1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository: `https://github.com/jesminchodavadiya24-star/CardioSentinal`.
3. Configure the service settings:
   - **Name**: `cardiosentinel-ml`
   - **Root Directory**: `ml-service`
   - **Environment**: `Python 3` (or `Docker`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**. Copy the deployed URL (e.g. `https://cardiosentinel-ml.onrender.com`).

---

### Step 2: Deploy the Main Backend (`backend`) on Render

1. On Render.com, create another **New Web Service**.
2. Connect the same repository: `https://github.com/jesminchodavadiya24-star/CardioSentinal`.
3. Configure settings:
   - **Name**: `cardiosentinel-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3` (or `Docker`)
   - **Build Command**: `pip install -r requirements.txt` (or `pip install fastapi uvicorn requests pydantic google-generativeai`)
   - **Start Command**: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   - `GEMINI_API_KEY`: `<YOUR_GEMINI_API_KEY>`
   - `ML_SERVICE_URL`: `https://cardiosentinel-ml.onrender.com` (URL from Step 1)
5. Click **Create Web Service**. Copy the deployed backend URL (e.g. `https://cardiosentinel-backend.onrender.com`).

---

### Step 3: Deploy the Frontend (`frontend`) on Vercel

1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import repository: `jesminchodavadiya24-star/CardioSentinal`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://cardiosentinel-backend.onrender.com` (URL from Step 2)
5. Click **Deploy**. Your CardioSentinel website will be live at `https://cardio-sentinel.vercel.app`!

---

## 🐳 Method 2: Single-Command Docker Deployment (AWS / DigitalOcean / VPS)

If you have a VPS (AWS EC2 instance, DigitalOcean Droplet, or Ubuntu server), you can deploy all services with 1 command using Docker Compose:

### Step 1: SSH into your server
```bash
ssh ubuntu@your-server-ip
```

### Step 2: Clone the repository
```bash
git clone https://github.com/jesminchodavadiya24-star/CardioSentinal.git
cd CardioSentinal
```

### Step 3: Set environment variables
Create a `.env` file in the root folder:
```bash
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```

### Step 4: Build and launch all containers
```bash
docker-compose up -d --build
```

All 3 services will start automatically:
- **Frontend App**: `http://your-server-ip:3000`
- **Backend API**: `http://your-server-ip:8000`
- **ML Microservice**: `http://your-server-ip:8001`

---

## 💾 Dataset & Database Deployment Verification

The SQLite database (`cardio_sentinel.db`) and audio recordings dataset (`static_audio/`) are automatically bundled inside the backend repository:

1. **Database File**: `backend/cardio_sentinel.db`
2. **Audio Recordings**: `backend/static_audio/*.wav`
3. **To Seed Demo Data on Production**:
   ```bash
   cd backend
   python seed_demo_20.py
   ```

---

## 🔍 Post-Deployment Verification Checklist

- [ ] Open Frontend URL in browser.
- [ ] Test Sign-In Page (`ASHA Worker` / `Camp Admin` presets).
- [ ] Test Government ID Card Upload & Verification feature.
- [ ] Open Parent Portal Chatbot (`/family/ask`) and test live Gemini AI questions.
- [ ] Check Audio Waveform playback on Student Triage page.
