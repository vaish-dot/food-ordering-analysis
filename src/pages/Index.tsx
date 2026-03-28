import { useData } from "@/context/DataContext";
import { KpiCard } from "@/components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Flame, TrendingUp, Heart } from "lucide-react";
import {
  totalCalories, avgCalories, healthScore, healthLabel,
  ordersOverTime, caloriesOverTime, categoryDistribution,
} from "@/lib/analytics";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = [
  "hsl(243, 75%, 59%)", "hsl(170, 60%, 45%)", "hsl(36, 95%, 55%)",
  "hsl(0, 72%, 51%)", "hsl(280, 60%, 55%)",
];

export default function DashboardPage() {
  const { orders } = useData();
  const score = healthScore(orders);
  const label = healthLabel(score);

  const labelColor = label === "Healthy" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
    label === "Moderate" ? "bg-amber-500/10 text-amber-600 border-amber-200" :
    "bg-red-500/10 text-red-600 border-red-200";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your food ordering analytics. All insights are based on ordered food only.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200">
        ⚠️ All calorie and health insights are based <strong>only</strong> on your ordered food — not your total daily diet.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Orders" value={orders.length} icon={ShoppingBag} />
        <KpiCard title="Total Calories" value={totalCalories(orders).toLocaleString()} icon={Flame} color="text-destructive" />
        <KpiCard title="Avg Cal / Order" value={avgCalories(orders)} icon={TrendingUp} color="text-accent" />
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold tracking-tight">{score}/100</p>
                <Badge className={labelColor}>{label}</Badge>
              </div>
              <div className="p-2 rounded-lg bg-muted text-pink-500">
                <Heart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Orders Over Time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersOverTime(orders)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(243, 75%, 59%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Calories Over Time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caloriesOverTime(orders)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="hsl(170, 60%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Category Distribution</CardTitle></CardHeader>
          <CardContent className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution(orders)} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryDistribution(orders).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
