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


# Function to call the login endpoint and get the access token
def get_access_token():
    login_url = get_env_variable("LOGIN_API_ENDPOINT")
    login_payload = {
        "account": get_env_variable("ACCOUNT"),
        "password": get_env_variable("PASSWORD"),
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(login_url, data=json.dumps(login_payload), headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data.get("accessToken")
    else:
        print("Error in login:", response.text)
        return None


# Function to call the profile endpoint and extract the point value
def get_point_value(access_token):
    profile_url = get_env_variable("PROFILE_API_ENDPOINT")
    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(profile_url, headers=headers)

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
