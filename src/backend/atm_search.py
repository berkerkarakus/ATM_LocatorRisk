import requests
from risk_calculation import enrich_atms_with_risk

from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def search_atms(query):
    endpoint = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": f"{query}",  # kullanıcı metni + atm
        "key": GOOGLE_API_KEY,
        "type": "atm"
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
            "address": place.get("formatted_address", ""),
            "rating": place.get("rating", None)
        }
        results.append(atm)

    return results
