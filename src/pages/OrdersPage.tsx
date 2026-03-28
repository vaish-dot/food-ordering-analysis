import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  peakOrderingHours, cuisineDistribution, topItems, vegNonVegDistribution, ordersOverTime,
} from "@/lib/analytics";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { format, parseISO, startOfWeek, startOfMonth } from "date-fns";

const COLORS = ["hsl(243, 75%, 59%)", "hsl(170, 60%, 45%)", "hsl(36, 95%, 55%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 55%)"];

export default function OrdersPage() {
  const { orders } = useData();
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const groupedOrders = () => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      let key: string;
      const d = parseISO(o.date);
      if (period === "daily") key = format(d, "MMM dd");
      else if (period === "weekly") key = "Wk " + format(startOfWeek(d), "MMM dd");
      else key = format(startOfMonth(d), "MMM yyyy");
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">Detailed breakdown of your ordering patterns.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Orders Over Time</CardTitle>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
            <TabsList><TabsTrigger value="daily">Daily</TabsTrigger><TabsTrigger value="weekly">Weekly</TabsTrigger><TabsTrigger value="monthly">Monthly</TabsTrigger></TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupedOrders()}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(243, 75%, 59%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Peak Ordering Hours</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakOrderingHours(orders)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(170, 60%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Most Ordered Cuisines</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cuisineDistribution(orders)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" width={70} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(36, 95%, 55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Most Frequent Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topItems(orders, 8).map((t, i) => (
                <div key={t.item} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <span className="text-sm font-medium">{t.item}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{t.count}x</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Veg vs Non-Veg</CardTitle></CardHeader>
          <CardContent className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vegNonVegDistribution(orders)} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label>
                  <Cell fill="hsl(152, 60%, 40%)" />
                  <Cell fill="hsl(0, 72%, 51%)" />
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
