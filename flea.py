import json
import os

import dotenv
import requests

dotenv.load_dotenv()

def update_prices():
    response = requests.get(
        "https://tarkov-market.com/api/v1/items/all",
        headers={"x-api-key": os.environ["TARKOV_MARKET_API_KEY"]},
    )

    items = {}
    for item in response.json():
        if not item["avg24hPrice"]:
            continue
        items[item["bsgId"]] = {
            "price": item["avg24hPrice"],
            "name": item["name"]
        }

    with open("resources/flea.json", "w") as file:
        json.dump(items, file, indent=4, sort_keys=True)

if __name__ == '__main__':
    update_prices()
