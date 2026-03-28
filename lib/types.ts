export interface Item {
  uuid: string;
  img: string;
  name: string;
  rarity: string;
  team: string;
  ovr: number;
  series: string;
  display_position: string;
  has_augment: boolean;
  augment_text: string;
  augment_end_date: string;
  quirks: string[];
  contact_left: number;
  contact_right: number;
  power_left: number;
  power_right: number;
  speed: number;
  fielding: number;
  arm_strength: number;
  stamina_or_dummy: number;
  stamina?: number;
  hits_per_bf?: number;
  k_per_bf?: number;
  bb_per_bf?: number;
  hr_per_bf?: number;
  pitch_velocity?: number;
  pitch_control?: number;
  pitch_movement?: number;
}

export interface Listing {
  listing_name: string;
  best_sell_price: number;
  best_buy_price: number;
  item: Item;
}

export interface ListingsResponse {
  page: number;
  per_page: number;
  total_pages: number;
  listings: Listing[];
}

export interface CompletedOrder {
  date: string;
  price: string | number;
}

export interface SingleListing extends Listing {
  price_history: Array<{
    date: string;
    best_buy_price: number;
    best_sell_price: number;
  }>;
  completed_orders: CompletedOrder[];
}

export interface RosterUpdate {
  id: number;
  name: string;
  date?: string;
}

export interface TeamSlot {
  position: string;
  player: Item | null;
}

export interface FlipLogEntry {
  id: string;
  cardName: string;
  cardImg?: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  date: string;
  uuid?: string;
}

export interface WatchlistEntry {
  uuid: string;
  name: string;
  img: string;
  addedAt: string;
}
