import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { healthScore, healthLabel, healthBreakdown } from "@/lib/analytics";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

export default function HealthPage() {
  const { orders } = useData();
  const score = healthScore(orders);
  const label = healthLabel(score);
  const bd = healthBreakdown(orders);

  const donutData = [
    { name: "Healthy", value: bd.healthy },
    { name: "Neutral", value: bd.neutral },
    { name: "Unhealthy", value: bd.unhealthy },
  ];

  const gaugeAngle = (score / 100) * 180;
  const labelColor = label === "Healthy" ? "text-emerald-500" : label === "Moderate" ? "text-amber-500" : "text-red-500";
  const badgeColor = label === "Healthy" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
    label === "Moderate" ? "bg-amber-500/10 text-amber-600 border-amber-200" :
    "bg-red-500/10 text-red-600 border-red-200";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Health Score</h1>
        <p className="text-muted-foreground text-sm mt-1">Your food health score based on ordering choices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Score Meter</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="relative w-48 h-24 mb-4">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
                <path
                  d="M 10 95 A 90 90 0 0 1 190 95"
                  fill="none"
                  stroke={label === "Healthy" ? "hsl(152, 60%, 40%)" : label === "Moderate" ? "hsl(36, 95%, 55%)" : "hsl(0, 72%, 51%)"}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${(gaugeAngle / 180) * 283} 283`}
                />
              </svg>
            </div>
            <p className={`text-5xl font-bold ${labelColor}`}>{score}</p>
            <p className="text-muted-foreground text-sm">out of 100</p>
            <Badge className={`mt-3 text-sm px-4 py-1 ${badgeColor}`}>{label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Healthy items (salads, grilled, fruits)", points: "+2 each", count: bd.healthy, color: "bg-emerald-500" },
                { label: "Neutral items (regular meals, beverages)", points: "+1 each", count: bd.neutral, color: "bg-amber-500" },
                { label: "Unhealthy items (fried, desserts)", points: "-2 each", count: bd.unhealthy, color: "bg-red-500" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.points} × {item.count} orders</p>
                  </div>
                  <span className="text-sm font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Healthy vs Unhealthy Orders</CardTitle></CardHeader>
          <CardContent className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  <Cell fill="hsl(152, 60%, 40%)" />
                  <Cell fill="hsl(36, 95%, 55%)" />
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
