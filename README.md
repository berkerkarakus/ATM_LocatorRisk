# 🏧 ATM Risk Map

ATM Risk Map is a full-stack web application that displays ATMs on a map along with their environmental risk levels. Risk levels are determined based on ATM location (indoor/outdoor) and real-time temperature data.

## 🔧 Technologies Used

### Frontend
- ⚛️ React
- 🗺️ Leaflet & React-Leaflet (for map rendering)
- 🧭 Geolocation API

### Backend
- 🐍 Python
- 🔥 Flask (RESTful API)
- 🌐 Google Places API
- ☀️ Open-Meteo API

---

## 🚀 Features

- Show nearby ATMs on a map with custom risk-based markers (green, yellow, red)
- Calculate risk levels using real-time temperature and location context
- Advanced search by city and district
- Modal popups showing detailed ATM risk data
- Responsive UI with pagination and interactivity

---

## 📦 Installation and Setup


bash
git clone https://github.com/your-username/atm-risk-map.git
cd atm-risk-map

For the front end:

cd frontend
npm install
npm run dev

***********

For the backend

cd backend
python -m venv venv
source venv/bin/activate  
pip install -r requirements.txt

-Create .env file and add Google Places API key.

GOOGLE_API_KEY=*****

then run python server.py
