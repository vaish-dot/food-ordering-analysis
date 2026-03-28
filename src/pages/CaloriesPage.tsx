import { useData } from "@/context/DataContext";
import { KpiCard } from "@/components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Flame, TrendingUp } from "lucide-react";
import {
  totalCalories, avgCalories, caloriesPerOrder, highCalorieItems, categoryCalories, caloriesOverTime,
} from "@/lib/analytics";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(243, 75%, 59%)", "hsl(170, 60%, 45%)", "hsl(36, 95%, 55%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 55%)"];

export default function CaloriesPage() {
  const { orders } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calories & Nutrition</h1>
        <p className="text-muted-foreground text-sm mt-1">Calorie analysis based on your ordered food items.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard title="Total Calories" value={totalCalories(orders).toLocaleString()} icon={Flame} color="text-destructive" />
        <KpiCard title="Average per Order" value={avgCalories(orders)} icon={TrendingUp} color="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Calories Per Order</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caloriesPerOrder(orders)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} className="fill-muted-foreground" angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip />
                <Bar dataKey="calories" fill="hsl(243, 75%, 59%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Category-wise Calorie Split</CardTitle></CardHeader>
          <CardContent className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryCalories(orders)} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryCalories(orders).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Daily Calorie Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caloriesOverTime(orders)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="hsl(170, 60%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Top High-Calorie Items</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cuisine</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highCalorieItems(orders, 8).map(o => (
                  <TableRow key={o.order_id}>
                    <TableCell className="font-medium">{o.food_item}</TableCell>
                    <TableCell>{o.category}</TableCell>
                    <TableCell>{o.cuisine}</TableCell>
                    <TableCell className="text-right font-semibold">{o.estimated_calories}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
