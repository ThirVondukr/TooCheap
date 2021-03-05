exports.mod = (mod_info) => {

    let flea_prices = new Map(Object.entries(require('./flea.json')))
    const ids_blacklist = new Set(require('./blacklist.json'))

    flea_prices = new Map(
        [...flea_prices].filter(([key, value]) => {
            if (value < 1000)
            {
                return false;
            }
            if (ids_blacklist.has(key))
            {
                return false;
            }

            return true;
        })
    )

    for (const item of Object.values(global._database.items))
    {
        if (flea_prices.has(item._id))
        {
            item._props.CreditsPrice = flea_prices.get(item._id);
        }
    }

    for (const item of global._database.templates.Items)
    {
        if (flea_prices.has(item.Id))
        {
            item.Price = flea_prices.get(item.Id);
        }
    }
    logger.logSuccess("[MOD] Too Cheap applied new prices to Flea/Traders");
}
