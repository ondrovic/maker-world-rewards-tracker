"""
Serves up files that get updated via the maker-world-api.py
    """
from flask import Flask, jsonify
from flask_cors import CORS
import requests, json, os
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False, port=get_env_variables("API_PORT"))
