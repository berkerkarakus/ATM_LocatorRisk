import requests
from risk_calculation import enrich_atms_with_risk
from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def find_atms_nearby(lat, lng, radius=2500):
    endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "atm",
        "key": GOOGLE_API_KEY
    }

    response = requests.get(endpoint, params=params)
    if response.status_code != 200:
        raise Exception("Google API error: " + response.text)

    data = response.json()
    results = []

    for place in data.get("results", []):
        atm = {
            "name": place.get("name"),
            "lat": place["geometry"]["location"]["lat"],
            "lng": place["geometry"]["location"]["lng"],
            "address": place.get("vicinity", ""),
            "rating": place.get("rating", None),
            
        }
        results.append(atm)

    return results
