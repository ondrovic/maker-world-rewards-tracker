ARG API_PORT
ARG DATA_FILENAME
ARG LAST_UPDATE_FILENAME
ARG TZ

FROM python:3.11-slim
ENV TZ=$TZ

# Set the working directory to /app
WORKDIR /app

# Copy the needed files over
# COPY .env .
COPY api.py .
COPY requirements.txt .

# upgrade pip
RUN pip install --upgrade pip

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE $API_PORT

# Make the api.py script executable
RUN chmod +x api.py

# Start cron and the API when the container launches
CMD ["python", "api.py"]
