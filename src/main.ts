import {Database, FleaItem} from "./types";


declare var _database: Database;
declare var logger: any;

function update_trader_prices(flea_prices: Map<string, FleaItem>) {
    for (const item of Object.values(_database.items)) {
        if (flea_prices.has(item._id)) {
            item._props.CreditsPrice = flea_prices.get(item._id)!.price;
        }
    }
}

function update_flea_prices(flea_prices: Map<string, FleaItem>) {
    for (const item of _database.templates.Items) {
        if (flea_prices.has(item.Id)) {
            item.Price = flea_prices.get(item.Id)!.price;
        }
    }
}

exports.mod = (mod_info: any) => {
    let flea_prices: Map<string, FleaItem> = new Map(Object.entries(require('../resources/flea.json')))
    const ids_blacklist: Set<string> = new Set(require('../resources/blacklist.json'))
    const mod_config = require("../resources/config.json")

    flea_prices = new Map(
        [...flea_prices].filter(([key, item]) => {
            if (item.price < mod_config.min_price) {
                return false;
            }
            if (ids_blacklist.has(key)) {
                return false;
            }

            return true;
        })
    )

    if (mod_config.update_trader_prices) {
        update_trader_prices(flea_prices)
        logger.logSuccess("[MOD] Too Cheap applied new prices to Traders");
    }

    if (mod_config.update_flea_prices) {
        update_flea_prices(flea_prices)
        logger.logSuccess("[MOD] Too Cheap applied new prices to Flea Market");
    }
}
