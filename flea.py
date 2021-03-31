import json
import os

import dotenv
import requests

dotenv.load_dotenv()

response = requests.get(
    "https://tarkov-market.com/api/v1/items/all",
    headers={"x-api-key": os.environ["TARKOV_MARKET_API_KEY"]},
)
items = response.json()
items = {item["bsgId"]: price for item in items if (price := item["avg24hPrice"])}

with open("resources/flea.json", "w") as file:
    json.dump(items, file, indent=4, sort_keys=True)
