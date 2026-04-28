export interface Store {
  id: number;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface MonsterDrink {
  id: number;
  name: string;
  flavour: string;
  slug: string;
  description: string | null;
  calories: number | null;
  sugar_grams: number | null;
  caffeine_mg: number | null;
  is_zero_sugar: boolean;
  image_url: string | null;
  tag: number | null;
  created_at: string;
  updated_at: string;
}

export interface AvailableMonster {
  id: number;
  name: string;
  flavour: string;
  slug: string;
  is_zero_sugar: boolean;
  image_url: string | null;
  tag: number | null;
  last_spotted_at: string | null;
}

export interface PublicStore {
  id: number;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  distance_km?: number;
  flavour_count?: number;
  total_spottings?: number;
  available_monsters?: AvailableMonster[];
}

export interface RecentSpotting {
  id: number;
  image_url: string;
  created_at: string;
  matched_monster: {
    id: number;
    name: string;
    flavour: string;
    image_url: string | null;
  };
}

export interface StoreDetail extends PublicStore {
  recent_spottings?: RecentSpotting[];
}

export interface SpottingReport {
  id: number;
  image_url: string;
  latitude: number;
  longitude: number;
  status: "pending" | "matched" | "rejected";
  matched_monster_drink_id: number | null;
  matched_store_id: number | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface TagFilter {
  value: number;
  label: string;
  count: number;
}

export const TAG_LABELS: Record<number, string> = {
  1: "Original",
  2: "Ultra",
  3: "Java",
  4: "Juiced",
  5: "Special",
};
