export interface Order {
  order_id: string;
  date: string;
  time: string;
  food_item: string;
  category: "Fast Food" | "Healthy" | "Dessert" | "Beverage" | "Meal";
  cuisine: string;
  veg_nonveg: "Veg" | "Non-Veg";
  estimated_calories: number;
}

export type HealthLabel = "Healthy" | "Moderate" | "Unhealthy";
export type TimePeriod = "daily" | "weekly" | "monthly";
