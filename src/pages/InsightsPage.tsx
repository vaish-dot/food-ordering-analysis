import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateInsights, generateSummary } from "@/lib/analytics";
import { Lightbulb, Brain } from "lucide-react";

export default function InsightsPage() {
  const { orders } = useData();
  const insights = generateInsights(orders);
  const summary = generateSummary(orders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered analysis of your ordering behavior.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Behavioral Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.length ? insights.map((insight, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted mt-0.5">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm leading-relaxed">{insight}</p>
            </CardContent>
          </Card>
        )) : (
          <p className="text-muted-foreground text-sm col-span-2">Not enough data to generate insights. Add more orders.</p>
        )}
      </div>
    </div>
  );
}
