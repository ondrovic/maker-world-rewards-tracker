"""
Serves up files that get updated via the maker-world-api.py
    """
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests, json, os, math
from datetime import datetime
from dotenv import load_dotenv

app = Flask(__name__)
app.environment = 'production'
CORS(app)

load_dotenv()

def get_env_variables(key):
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Environment variable {key} not set")
    return value


def evaluate_conversion_rate(conversion_rate):
    try:
        return eval(conversion_rate)
    except:
        raise ValueError("Invalid conversion rate format")

@app.route("/current-points", methods=["GET"])
def get_current_points():
    try:
        with open(get_env_variables("DATA_FILENAME"), "r") as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": f"{DATA_FILENAME} not found"}), 404


@app.route("/last-updated", methods=["GET"])
def get_last_updated():
    try:
        with open(get_env_variables("LAST_UPDATE_FILENAME"), "r") as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": f"{LAST_UPDATE_FILENAME} not found"}), 404

@app.route("/needed-points", methods=["POST"])
def calculate_needed_points():
    try:
        data = request.get_json()
        dollar_amount = data.get('dollarAmount')
        
        conversion_rate = evaluate_conversion_rate((get_env_variables("POINT_CONVERSION_RATE")))

        if dollar_amount is None:
            raise ValueError('Missing required parameter: dollarAmount')
        if conversion_rate is None:
            raise ValueError('Missing required parameter: POINT_CONVERSION_RATE')
        
        points = dollar_amount / conversion_rate
        rounded_points = math.floor(points)
        
        result = int(round(rounded_points))
        
        return jsonify({'requiredPoints': result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False, port=get_env_variables("API_PORT"))
