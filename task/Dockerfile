ARG DATA_FILENAME
ARG LAST_UPDATE_FILENAME
ARG TZ
ARG LOGIN_API_ENDPOINT
ARG PROFILE_API_ENDPOINT
ARG ACCOUNT
ARG PASSWORD
# Python Base Image
FROM python:3.11-alpine

ENV TZ=$TZ
#RUN apt-get update && apt-get install -y cron tzdata && rm -rf /var/lib/apt/lists/*
RUN apk update && apk add -U tzdata
#RUN apk add --no-cache tzdata

# Creating Working Directory
WORKDIR /app

# Copying the crontab file 
COPY crontab /etc/cron.d/crontab

# Copy the required files
# COPY .env .
COPY requirements.txt .
COPY maker-world-api.py .

# upgrade pip
RUN pip install --upgrade pip
# Install all of necessary modules from the requiremen.txt file
RUN pip install --no-cache-dir -r requirements.txt

# Create the cron log file
RUN touch /var/log/cron.log

# Run the crontab file
RUN crontab /etc/cron.d/crontab

# Make maker-world-api.py executable
RUN chmod +x maker-world-api.py
# Executing cron command with log redirection
CMD ["crond", "-f"]