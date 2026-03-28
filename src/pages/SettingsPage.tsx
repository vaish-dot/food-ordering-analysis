import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calculator, Heart, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings & Info</h1>
        <p className="text-muted-foreground text-sm mt-1">Learn how the analytics work.</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-200">Important Disclaimer</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            This system analyzes only food ordering behavior and does not represent total dietary intake.
            The calorie estimations and health scores are approximations based on typical nutritional data
            for common food items and should not be used as medical or dietary advice.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">How Calorie Estimation Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Each food item in the dataset comes with an <strong>estimated calorie value</strong> based on average nutritional data from standard food databases.</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Calorie values represent a single standard serving size</li>
              <li>Values are approximate and may vary by restaurant/preparation</li>
              <li>Custom toppings, sides, or modifications are not accounted for</li>
              <li>Beverages include estimated sugar and milk calories</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <CardTitle className="text-base">Health Score Logic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>The health score is calculated using a point-based system:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-emerald-600">+2 points</strong> — Healthy items (salads, grilled, fruits, smoothies)</li>
              <li><strong className="text-amber-600">+1 point</strong> — Neutral items (regular meals, beverages)</li>
              <li><strong className="text-red-600">-2 points</strong> — Unhealthy items (fried food, desserts, sugary drinks)</li>
            </ul>
            <p className="mt-2">The raw score is normalized to a 0–100 scale:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>65–100:</strong> Healthy</li>
              <li><strong>35–64:</strong> Moderate</li>
              <li><strong>0–34:</strong> Unhealthy</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">About FoodIQ</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              FoodIQ is a smart food order analytics dashboard that helps you understand your food delivery
              ordering patterns. It provides behavioral insights, nutritional analysis, and health scoring
              based entirely on your order history.
            </p>
            <p>
              You can upload your own CSV data or explore with the built-in sample dataset containing
              35 realistic food delivery orders across multiple cuisines, categories, and time periods.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
