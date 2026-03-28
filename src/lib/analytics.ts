import { Order, HealthLabel } from "@/types/order";
import { format, parseISO, getDay, getHours } from "date-fns";

export function totalCalories(orders: Order[]) {
  return orders.reduce((s, o) => s + o.estimated_calories, 0);
}

export function avgCalories(orders: Order[]) {
  return orders.length ? Math.round(totalCalories(orders) / orders.length) : 0;
}

function healthPoints(o: Order): number {
  if (o.category === "Healthy") return 2;
  if (o.category === "Meal" || o.category === "Beverage") return 1;
  return -2; // Fast Food, Dessert
}

export function healthScore(orders: Order[]): number {
  if (!orders.length) return 0;
  const raw = orders.reduce((s, o) => s + healthPoints(o), 0);
  const max = orders.length * 2;
  const min = orders.length * -2;
  return Math.round(((raw - min) / (max - min)) * 100);
}

export function healthLabel(score: number): HealthLabel {
  if (score >= 65) return "Healthy";
  if (score >= 35) return "Moderate";
  return "Unhealthy";
}

export function healthBreakdown(orders: Order[]) {
  let healthy = 0, neutral = 0, unhealthy = 0;
  orders.forEach(o => {
    const p = healthPoints(o);
    if (p > 1) healthy++;
    else if (p >= 0) neutral++;
    else unhealthy++;
  });
  return { healthy, neutral, unhealthy };
}

export function categoryDistribution(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => { map[o.category] = (map[o.category] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function cuisineDistribution(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => { map[o.cuisine] = (map[o.cuisine] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function vegNonVegDistribution(orders: Order[]) {
  let veg = 0, nonVeg = 0;
  orders.forEach(o => o.veg_nonveg === "Veg" ? veg++ : nonVeg++);
  return [{ name: "Veg", value: veg }, { name: "Non-Veg", value: nonVeg }];
}

export function ordersOverTime(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => {
    const key = o.date;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).sort().map(([date, count]) => ({ date: format(parseISO(date), "MMM dd"), count }));
}

export function caloriesOverTime(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => {
    map[o.date] = (map[o.date] || 0) + o.estimated_calories;
  });
  return Object.entries(map).sort().map(([date, calories]) => ({ date: format(parseISO(date), "MMM dd"), calories }));
}

export function caloriesPerOrder(orders: Order[]) {
  return orders.map(o => ({ name: o.food_item.slice(0, 15), calories: o.estimated_calories }));
}

export function peakOrderingHours(orders: Order[]) {
  const hours = Array(24).fill(0);
  orders.forEach(o => {
    const h = parseInt(o.time.split(":")[0], 10);
    hours[h]++;
  });
  return hours.map((count, hour) => ({ hour: `${hour}:00`, count }));
}

export function topItems(orders: Order[], n = 5) {
  const map: Record<string, number> = {};
  orders.forEach(o => { map[o.food_item] = (map[o.food_item] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n).map(([item, count]) => ({ item, count }));
}

export function highCalorieItems(orders: Order[], n = 5) {
  return [...orders].sort((a, b) => b.estimated_calories - a.estimated_calories).slice(0, n);
}

export function categoryCalories(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => { map[o.category] = (map[o.category] || 0) + o.estimated_calories; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function generateInsights(orders: Order[]): string[] {
  const insights: string[] = [];
  if (!orders.length) return insights;

  // Night ordering pattern
  const nightOrders = orders.filter(o => {
    const h = parseInt(o.time.split(":")[0], 10);
    return h >= 21 || h < 5;
  });
  const nightCalAvg = nightOrders.length ? totalCalories(nightOrders) / nightOrders.length : 0;
  const dayOrders = orders.filter(o => {
    const h = parseInt(o.time.split(":")[0], 10);
    return h >= 5 && h < 21;
  });
  const dayCalAvg = dayOrders.length ? totalCalories(dayOrders) / dayOrders.length : 0;
  if (nightCalAvg > dayCalAvg * 1.15 && nightOrders.length >= 3) {
    insights.push("🌙 You tend to order higher-calorie food at night — average " + Math.round(nightCalAvg) + " cal vs " + Math.round(dayCalAvg) + " cal during the day.");
  }

  // Weekend pattern
  const weekendOrders = orders.filter(o => { const d = getDay(parseISO(o.date)); return d === 0 || d === 6; });
  const weekdayOrders = orders.filter(o => { const d = getDay(parseISO(o.date)); return d > 0 && d < 6; });
  if (weekendOrders.length && weekdayOrders.length) {
    const weAvg = totalCalories(weekendOrders) / weekendOrders.length;
    const wdAvg = totalCalories(weekdayOrders) / weekdayOrders.length;
    if (weAvg > wdAvg * 1.1) {
      insights.push("📅 Weekend calorie intake is significantly higher than weekdays (" + Math.round(weAvg) + " vs " + Math.round(wdAvg) + " avg per order).");
    }
  }

  // Fast food ratio
  const ffRatio = orders.filter(o => o.category === "Fast Food").length / orders.length;
  if (ffRatio >= 0.3) {
    insights.push("🍔 " + Math.round(ffRatio * 100) + "% of your orders are fast food — consider healthier alternatives.");
  }

  // Healthy ratio
  const healthyRatio = orders.filter(o => o.category === "Healthy").length / orders.length;
  if (healthyRatio < 0.25) {
    insights.push("🥗 Your healthy food ratio is only " + Math.round(healthyRatio * 100) + "% — try adding more salads and grilled items.");
  }

  // Dessert at night
  const nightDesserts = orders.filter(o => {
    const h = parseInt(o.time.split(":")[0], 10);
    return o.category === "Dessert" && (h >= 21 || h < 5);
  });
  if (nightDesserts.length >= 2) {
    insights.push("🍰 You frequently order desserts late at night (" + nightDesserts.length + " times).");
  }

  // Cuisine preference
  const cuisines = cuisineDistribution(orders);
  if (cuisines.length && cuisines[0].value >= orders.length * 0.25) {
    insights.push("🍽️ " + cuisines[0].name + " is your most ordered cuisine (" + cuisines[0].value + " orders).");
  }

  // High calorie average
  const avg = avgCalories(orders);
  if (avg > 550) {
    insights.push("⚡ Your average order is " + avg + " calories — that's on the higher side for single meals.");
  }

  // Veg vs non-veg
  const vnv = vegNonVegDistribution(orders);
  const nvRatio = (vnv.find(v => v.name === "Non-Veg")?.value || 0) / orders.length;
  if (nvRatio > 0.5) {
    insights.push("🥩 More than half your orders (" + Math.round(nvRatio * 100) + "%) are non-vegetarian.");
  }

  return insights;
}

export function generateSummary(orders: Order[]): string {
  if (!orders.length) return "No data to analyze.";
  const score = healthScore(orders);
  const label = healthLabel(score);
  const avg = avgCalories(orders);
  const topCuisine = cuisineDistribution(orders)[0]?.name || "varied";
  const bd = healthBreakdown(orders);

  return `Based on your ${orders.length} orders, your eating pattern from delivery orders is rated as "${label}" with a health score of ${score}/100. You average ${avg} calories per order, with ${topCuisine} being your most preferred cuisine. ${bd.healthy} of your orders are healthy choices, while ${bd.unhealthy} lean towards less healthy options. Remember, this analysis covers only your delivery orders — not your complete daily diet.`;
}
