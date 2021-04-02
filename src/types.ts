export interface ItemTemplate {
    _id: string
    _props: {
        CreditsPrice: number
    }
}

export interface ItemCategory {
    Id: string
    ParentId: string
    Price: number
}


export interface Database {
    items: { [key: string]: ItemTemplate },
    templates: {
        Items: ItemCategory[]
    }
}

export declare var _database: Database;
export declare var logger: any;

export interface FleaItem {
    name: string,
    price: number,
}

export interface ModConfig {
    price_threshold: number
    update_flea_prices: boolean
    update_trader_prices: boolean
}
