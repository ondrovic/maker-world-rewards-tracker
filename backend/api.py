from fastapi import FastAPI, Request, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import json
import os
import math
from dotenv import load_dotenv
import re
from decimal import Decimal, ROUND_DOWN
import uvicorn
from sse_starlette.sse import EventSourceResponse
import asyncio
import time

load_dotenv()

app = FastAPI()
app.environment = 'production'

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_env_variable(key: str) -> str:
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Environment variable {key} not set")
    return value

def evaluate_conversion_rate(conversion_rate: str) -> Decimal:
    try:
        return Decimal(conversion_rate)
    except ValueError:
        try:
            # Try to parse the conversion rate as a fraction
            numerator, denominator = map(int, conversion_rate.split('/'))
            return Decimal(numerator) / Decimal(denominator)
        except ValueError:
            raise ValueError("Invalid conversion rate format")

app.title = get_env_variable("SWAGGER_UI_TITLE")
app.description = get_env_variable("SWAGGER_UI_DESCRIPTION")

router = APIRouter()

async def process_last_updated() -> str:
    try:
        with open(get_env_variable("LAST_UPDATE_FILENAME"), "r") as json_file:
            data = json.load(json_file)
        return data.get('lastUpdate', "")
    except FileNotFoundError:
        return ""

@app.get("/current-points", tags=["points"])
async def get_current_points() -> JSONResponse:
    try:
        with open(get_env_variable("DATA_FILENAME"), "r") as json_file:
            data = json.load(json_file)
        return JSONResponse(content=data)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"{get_env_variable('DATA_FILENAME')} not found")

@app.get("/last-updated", tags=["status"])
async def get_last_updated() -> JSONResponse:
    last_updated = await process_last_updated()
    if last_updated:
        return JSONResponse(content={"lastUpdate": last_updated})
    else:
        raise HTTPException(status_code=404, detail=f"{get_env_variable('LAST_UPDATE_FILENAME')} not found")

@app.get("/current-point-value", tags=["points"])
async def calculate_money_from_points() -> JSONResponse:
    try:
        conversion_rate = evaluate_conversion_rate(get_env_variable("POINT_CONVERSION_RATE"))
        with open(get_env_variable("DATA_FILENAME"), "r") as json_file:
            data = json.load(json_file)

        current_points = data.get("currentPoints")
        last_updated = await process_last_updated()

        dollar_amount = Decimal(current_points) * conversion_rate
        # num_of_gift_cards = float(dollar_amount / Decimal(40))  # Convert to float for JSON serialization
        num_of_gift_cards = math.floor(dollar_amount / Decimal(40))

        formatted_dollar_amount = f"${dollar_amount:.2f}"

        return JSONResponse(content={
            'currentPoints': current_points,
            'dollarAmount': formatted_dollar_amount,
            'numOfGiftCards': num_of_gift_cards,
            'lastUpdate': last_updated
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DollarAmountRequest(BaseModel):
    dollarAmount: str = Field(..., example="900", description="The dollar amount as a string")

@app.post("/needed-points", tags=["points"])
async def calculate_needed_points(request: DollarAmountRequest) -> JSONResponse:
    try:
        dollar_amount_str = request.dollarAmount
        currency_pattern = re.compile(r"^(\d+|\d+(\.\d+))$")

        if not currency_pattern.match(dollar_amount_str):
            raise ValueError('Invalid dollarAmount format. Please enter a number (integer or decimal).')

        dollar_amount = Decimal(dollar_amount_str)
        conversion_rate = evaluate_conversion_rate(get_env_variable("POINT_CONVERSION_RATE"))

        required_points = (dollar_amount / conversion_rate).quantize(Decimal('1.'), rounding=ROUND_DOWN)
        return JSONResponse(content={'requiredPoints': int(required_points)})

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/last-updated/stream")
async def last_updated_stream():
    last_update_path = get_env_variable("LAST_UPDATE_FILENAME")
    last_sent = None
    async def event_generator():
        nonlocal last_sent
        while True:
            try:
                with open(last_update_path, "r") as f:
                    data = json.load(f)
                    last_update = data.get("lastUpdate", "")
            except FileNotFoundError:
                last_update = ""
            if last_update and last_update != last_sent:
                last_sent = last_update
                yield {
                    "event": "message",
                    "data": json.dumps({"lastUpdate": last_update})
                }
            await asyncio.sleep(2)  # Check every 2 seconds
    return EventSourceResponse(event_generator())

@app.get("/current-points/stream")
async def current_points_stream():
    data_path = get_env_variable("DATA_FILENAME")
    last_sent = None
    async def event_generator():
        nonlocal last_sent
        while True:
            try:
                with open(data_path, "r") as f:
                    data = json.load(f)
                    current_points = data.get("currentPoints", None)
            except FileNotFoundError:
                current_points = None
            if current_points is not None and current_points != last_sent:
                last_sent = current_points
                yield {
                    "event": "message",
                    "data": json.dumps({"currentPoints": current_points})
                }
            await asyncio.sleep(2)  # Check every 2 seconds
    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    uvicorn.run(app, host=get_env_variable("API_BIND_ADDRESS"), port=int(get_env_variable("API_PORT")), log_level="info")