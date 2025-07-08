"""
Logins via the api, writes current point value to data/data.json, this is automated currently via task scheduler, need to cron it in the docker container
    """
import os, sys, json, requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Get the current date and time in a human-readable format
current_datetime = datetime.now().strftime("%Y-%m-%d %I:%M %p")

# Function to read environment variables
def get_env_variable(key):
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Environment variable {key} not set")
    return value


# Function to read the access token from auth.json file
def get_access_token():
    auth_file_path = get_env_variable("AUTH_FILENAME")
    try:
        with open(auth_file_path, "r") as auth_file:
            auth_data = json.load(auth_file)
            return auth_data.get("token")
    except FileNotFoundError:
        print(f"Error: {auth_file_path} not found")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {auth_file_path}")
        return None
    except Exception as e:
        print(f"Error reading auth file: {e}")
        return None


# Function to call the profile endpoint and extract the point value
def get_point_value(access_token):
    profile_url = get_env_variable("PROFILE_API_ENDPOINT")
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Authorization": f"Bearer {access_token}"
    }
    session = requests.Session()
    response = session.get(profile_url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        point_value = data.get("point", None)
        return point_value
    else:
        print("Error in fetching profile:", response.text)
        return None


if __name__ == "__main__":
    file_name = get_env_variable("LAST_UPDATE_FILENAME")
    print(f"Job executed at {current_datetime}")
    if file_name:
        data = {"lastUpdate": current_datetime}
        with open(file_name, "w") as json_file:
            json.dump(data, json_file, indent=2)

    access_token = get_access_token()

    if access_token:
        point_value = get_point_value(access_token)
        if point_value is not None:
            # Save point_value to data.json
            data = {"currentPoints": point_value}
            with open(get_env_variable("DATA_FILENAME"), "w") as json_file:
                json.dump(data, json_file, indent=2)

        else:
            print("Error fetching point value")
    else:
        print("Error fetching access token")
