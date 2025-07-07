import requests

from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

ENDPOINT = "https://maps.googleapis.com/maps/api/place/textsearch/json"

def search_atm_advanced(province, district):
    params = {
        "key": GOOGLE_API_KEY,
        "type": "atm",
        "query": f"atm in {district}, {province}"
    }

    response = requests.get(ENDPOINT, params=params)
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

    return results  # sadece ilk sayfa
