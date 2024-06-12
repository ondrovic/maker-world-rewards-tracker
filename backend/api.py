"""
Serves up files that get updated via the maker-world-api.py
    """
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests, json, os, math
from datetime import datetime
from dotenv import load_dotenv
import re

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

@app.route("/current-point-value", methods=["GET"])
def calculate_money_from_points():
    try:
        conversion_rate = evaluate_conversion_rate((get_env_variables("POINT_CONVERSION_RATE")))
        with open(get_env_variables("DATA_FILENAME"), "r") as json_file:
            data = json.load(json_file)
            
        current_points = data.get("currentPoints")
        
        dollar_amount = round(current_points * conversion_rate)
        
        num_of_gift_cards = math.floor(dollar_amount / 40)
        
        formatted_dollar_amount = f"${dollar_amount:.2f}"
        
        return jsonify(
            {
                'currentPoints': current_points,
                'dollarAmount': formatted_dollar_amount,
                'numOfGiftCards': num_of_gift_cards
            }
        )
        
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/needed-points", methods=["POST"])
def calculate_needed_points():
    try:
        data = request.get_json()

        # Check for missing dollarAmount and raise an informative error
        if 'dollarAmount' not in data:
            raise ValueError('Missing required parameter: dollarAmount')

        dollar_amount_str = data['dollarAmount']

        # Validate dollarAmount format using a relaxed regex (no $)
        currency_pattern = r"^(\d+|\d+(\.\d+))$"  # Matches integer or decimal
        if not re.match(currency_pattern, dollar_amount_str):
            raise ValueError('Invalid dollarAmount format. Please enter a number (integer or decimal).')

        # Convert to float after validation, handling integers gracefully
        try:
            dollar_amount = float(dollar_amount_str)
        except ValueError:
            # If conversion fails, assume it's an integer and convert explicitly
            dollar_amount = int(dollar_amount_str)

        conversion_rate = evaluate_conversion_rate((get_env_variables("POINT_CONVERSION_RATE")))

        if conversion_rate is None:
            raise ValueError('Missing required parameter: POINT_CONVERSION_RATE')

        points = dollar_amount / conversion_rate
        rounded_points = math.floor(points)
        result = int(round(rounded_points))

        return jsonify({'requiredPoints': result})

    except (ValueError, KeyError) as e:
        return jsonify({"error": str(e)}), 400  # Return 400 for missing params

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False, port=get_env_variables("API_PORT"))
