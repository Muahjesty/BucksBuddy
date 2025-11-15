import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface SpendingChartProps {
  type: "weekly" | "category";
}

const weeklyData = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 32 },
  { day: "Wed", amount: 58 },
  { day: "Thu", amount: 41 },
  { day: "Fri", amount: 67 },
  { day: "Sat", amount: 28 },
  { day: "Sun", amount: 35 },
];

const categoryData = [
  { name: "Dining", value: 245, color: "hsl(var(--chart-1))" },
  { name: "Bookstore", value: 128, color: "hsl(var(--chart-2))" },
  { name: "Events", value: 85, color: "hsl(var(--chart-3))" },
  { name: "Laundry", value: 45, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 67, color: "hsl(var(--chart-5))" },
];

export default function SpendingChart({ type }: SpendingChartProps) {
  if (type === "weekly") {
    return (
      <Card className="p-6" data-testid="card-spending-weekly">
        <h3 className="font-semibold mb-4">Weekly Spending</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  }

  return (
    <Card className="p-6" data-testid="card-spending-category">
      <h3 className="font-semibold mb-4">Spending by Category</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-medium ml-auto">${item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
