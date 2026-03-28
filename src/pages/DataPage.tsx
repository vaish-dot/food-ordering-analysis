import { useRef } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Database } from "lucide-react";
import Papa from "papaparse";
import { Order } from "@/types/order";
import { toast } from "sonner";

export default function DataPage() {
  const { orders, setOrders, loadSampleData } = useData();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<Order>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length) {
          const parsed = results.data.map((r, i) => ({
            ...r,
            estimated_calories: Number(r.estimated_calories) || 0,
            order_id: r.order_id || `CSV${i}`,
          }));
          setOrders(parsed);
          toast.success(`Loaded ${parsed.length} orders from CSV`);
        }
      },
      error: () => toast.error("Failed to parse CSV"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Data Upload</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload your own data or use the built-in sample dataset.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => fileRef.current?.click()} variant="outline">
          <Upload className="h-4 w-4 mr-2" /> Upload CSV
        </Button>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleUpload} />
        <Button onClick={() => { loadSampleData(); toast.success("Sample data loaded"); }}>
          <Database className="h-4 w-4 mr-2" /> Load Sample Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Current Dataset <Badge variant="secondary">{orders.length} orders</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cuisine</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o.order_id}>
                    <TableCell className="font-mono text-xs">{o.order_id}</TableCell>
                    <TableCell>{o.date}</TableCell>
                    <TableCell>{o.time}</TableCell>
                    <TableCell className="font-medium">{o.food_item}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{o.category}</Badge></TableCell>
                    <TableCell>{o.cuisine}</TableCell>
                    <TableCell>{o.veg_nonveg}</TableCell>
                    <TableCell className="text-right font-semibold">{o.estimated_calories}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
