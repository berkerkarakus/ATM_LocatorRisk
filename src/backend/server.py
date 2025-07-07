from flask import Flask, request, jsonify
from flask_cors import CORS
from atm_find import find_atms_nearby
from atm_search import search_atms
from risk_calculation import enrich_atms_with_risk  # ← bunu da eklemelisin
from advanced_search import search_atm_advanced

app = Flask(__name__)
CORS(app)

@app.route("/atms", methods=["GET"])
def get_atms():
    lat = float(request.args.get("lat"))
    lng = float(request.args.get("lng"))
    radius = int(request.args.get("radius", 2500))
    atms = find_atms_nearby(lat, lng, radius)
    return jsonify(atms)

@app.route("/atm-search", methods=["GET"])
def search():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Missing query"}), 400
    try:
        results = search_atms(query)
        return jsonify(results)
    except Exception as e:
        print("Search error:", e)
        return jsonify({"error": "Internal Server Error"}), 500


@app.route("/enrich", methods=["POST"])
def enrich():
    try:
        data = request.get_json()
        if not isinstance(data, list):
            return jsonify({"error": "Invalid input, must be a list of ATMs"}), 400
        enriched = enrich_atms_with_risk(data)
        return jsonify(enriched)
    except Exception as e:
        print("Enrich error:", e)
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route("/advanced", methods=["GET"])
def advanced():
    query = request.args.get("province")
    query1 = request.args.get("district")
    if not query or not query1:
        return jsonify({"error": "Missing query"}), 400
    try:
        results = search_atm_advanced(query,query1)
        return jsonify(results)
    except Exception as e:
        print("Search error:", e)
        return jsonify({"error": "Internal Server Error"}), 500    

if __name__ == "__main__":
    print("✅ Server running on http://localhost:5000")
    app.run(port=5000)
