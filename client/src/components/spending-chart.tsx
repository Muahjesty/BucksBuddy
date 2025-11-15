import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SpendingData {
  category: string;
  amount: number;
  color: string;
}

interface SpendingChartProps {
  data: SpendingData[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card data-testid="card-spending-chart">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">This month</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 space-y-3">
          {data.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <span className="text-sm font-mono tabular-nums" data-testid={`text-spending-${item.category.toLowerCase()}`}>
                ${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="font-semibold">Total Spending</span>
          <span className="text-lg font-bold font-mono tabular-nums" data-testid="text-total-spending">
            ${total.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
