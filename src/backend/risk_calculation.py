import requests

# --- Constants ---
from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# --- Helper: Kapalı alan kontrolü ---
def is_indoor(atm_name, address):
    keywords = ["market", "alışveriş", "avm", "shopping", "mall", "metro","carrefour","migros","kampüs"]
    text = f"{atm_name} {address}".lower()
    return any(kw in text for kw in keywords)

# --- Helper: Sıcaklık bilgisi al ---
def get_temperature(lat, lng):
    params = {
        "latitude": lat,
        "longitude": lng,
        "current_weather": True
    }
    response = requests.get(OPEN_METEO_URL, params=params)
    if response.status_code != 200:
        return None
    return response.json().get("current_weather", {}).get("temperature")

# --- Risk Hesapla ---
def calculate_risk(atm):
    # Varsayılan düşük risk
    score = 0

    indoor = is_indoor(atm["name"], atm["address"])
    atm["indoor"] = indoor

    if not indoor:
        score += 10  # açık alansa riskli
        temperature = get_temperature(atm["lat"], atm["lng"])
        atm["temperature"] = temperature
        if temperature is not None and (temperature <= 5 or temperature >= 32):
            score += 10  # sıcaklık uç değerlerdeyse riskli
    else:
        atm["temperature"] = None

    atm["risk_score"] = score
    return atm

# --- Wrapper: ATM listesine risk ekle ---
def enrich_atms_with_risk(atms):
    enriched = []
    for atm in atms:
        enriched.append(calculate_risk(atm))
    return enriched

if __name__ == "__main__":
    test_atm = {
        "name": "Yapı Kredi Boga heykeli",
        "lat": 40.9859376,
        "lng": 29.0957311,
        "address": "Kadıköy, İstanbul, Türkiye",
        "rating": 4.2
    }

    enriched_atm = calculate_risk(test_atm)
    print(enriched_atm)
