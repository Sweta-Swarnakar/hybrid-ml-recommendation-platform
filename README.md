# Hybrid ML Recommendation Platform

A full-stack book recommendation system that integrates a React frontend, Node.js backend, and a Python-based ML service to provide personalized book suggestions.

---

## Features

* Browse books without login
* Authentication-based access for reading, downloading, and recommendations
* ML-powered recommendations based on user preferences and genres
* REST APIs with pagination and error handling
* Redis caching for improved performance
* Web-based EPUB reader for online reading

---

## Tech Stack

* Frontend: React (Vite)
* Backend: Node.js, Express
* Database: MongoDB
* ML Service: Python (FastAPI)
* Caching: Redis

---

## Live Demo

https://inkforge-web.vercel.app

---

## Live Services (Render - Cold Start Notice)

> Backend and ML services are hosted on free tier servers and may take 30–60 seconds to start.

* ML Service: https://ml-recommender-service.onrender.com
* Backend API: https://hybrid-book-recommender.onrender.com

---

## Architecture

* Frontend (React) → calls Backend APIs
* Backend (Node.js) → handles business logic, authentication, DB
* Backend → calls ML Service (Python) for recommendations
* Redis → caches frequent responses for performance

---

## Run Locally

### 1. Clone Repository

git clone https://github.com/your-username/your-repo.git
cd your-repo

---

### 2. Backend (Node.js)

cd backend
npm install

#### Create .env file

PORT=5000
MONGO_URI=your_mongodb_connection
REDIS_URL=redis://localhost:6379
ML_SERVICE_URL=http://localhost:8000

#### Run Backend

npm run dev

---

### 3. ML Service (Python)

cd ml-service

#### Create virtual environment

python -m venv venv
source venv/bin/activate   (Windows: venv\Scripts\activate)

#### Install dependencies

pip install -r requirements.txt

#### Run ML server

uvicorn main:app --reload --port 8000

---

### 4. Frontend (React)

cd frontend
npm install

#### Create .env file

VITE_API_URL=http://localhost:5000

#### Run frontend

npm run dev

---

### 5. Redis (Optional but Recommended)

#### Run Redis locally

Mac/Linux/windows:
redis-server

---

## Access URLs

Frontend: http://localhost:5173
Backend: http://localhost:5000
ML Service: http://localhost:8000

