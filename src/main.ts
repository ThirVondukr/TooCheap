interface ItemTemplate {
    _id: string
    _props: {
        CreditsPrice: number
    }
}

interface ItemCategory {
    Id: string
    ParentId: string
    Price: number
}


interface Database {
    items: { [key: string]: ItemTemplate },
    templates: {
        Items: ItemCategory[]
    }
}

declare var _database: Database;
declare var logger: any;

interface FleaItem {
    name: string,
    price: number,
}


exports.mod = (mod_info: any) => {
    let flea_prices: Map<string, FleaItem> = new Map(Object.entries(require('../resources/flea.json')))
    const ids_blacklist: Set<string> = new Set(require('../resources/blacklist.json'))

    flea_prices = new Map(
        [...flea_prices].filter(([key, item]) => {
            if (item.price < 1000) {
                return false;
            }
            if (ids_blacklist.has(key)) {
                return false;
            }

            return true;
        })
    )

    // Traders item prices
    for (const item of Object.values(_database.items)) {
        if (flea_prices.has(item._id)) {
            console.log(flea_prices.get(item._id)!)
            item._props.CreditsPrice = flea_prices.get(item._id)!.price;
        }
    }

    // Item price on flea market
    for (const item of _database.templates.Items) {
        if (flea_prices.has(item.Id)) {
            item.Price = flea_prices.get(item.Id)!.price;
        }
    }
    logger.logSuccess("[MOD] Too Cheap applied new prices to Flea/Traders");
}
