import {FleaItem, ItemCategory, ItemTemplate, ModConfig} from "./types";


declare var logger: anbuily;
declare var fileIO: any;
// @ts-ignore
const resolve_path: Function = internal.path.resolve;

function update_trader_prices(flea_prices: Map<string, FleaItem>) {
    const db: any = fileIO.readParsed(resolve_path('user/cache/items.json'));
    const items: { [key: string]: ItemTemplate } = db.data;

    for (const item of Object.values(items)) {
        if (flea_prices.has(item._id)) {
            console.log(`Updating ${item._id}, ${flea_prices.get(item._id)!}`)
            item._props.CreditsPrice = flea_prices.get(item._id)!.price;
        }
    }
    fileIO.write(resolve_path('user/cache/items.json'), db, true);
}

function update_flea_prices(flea_prices: Map<string, FleaItem>) {
    const db = fileIO.readParsed(resolve_path('user/cache/templates.json'));
    const items: ItemCategory[] = db.data.Items;
    for (const item of items) {
        if (flea_prices.has(item.Id)) {
            item.Price = flea_prices.get(item.Id)!.price;
        }
    }
    fileIO.write(resolve_path('user/cache/templates.json'), db, true);
}

exports.mod = (mod_info: any) => {
    let flea_prices: Map<string, FleaItem> = new Map(Object.entries(require('../resources/flea.json')))
    const ids_blacklist: Set<string> = new Set(require('../resources/blacklist.json'))
    const mod_config = require("../resources/config.json") as ModConfig

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
