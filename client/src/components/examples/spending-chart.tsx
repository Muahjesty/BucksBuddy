import { SpendingChart } from "../spending-chart";

export default function SpendingChartExample() {
  const mockData = [
    { category: "Dining", amount: 245.30, color: "hsl(217, 91%, 35%)" },
    { category: "Books", amount: 128.50, color: "hsl(142, 76%, 30%)" },
    { category: "Transport", amount: 67.80, color: "hsl(271, 91%, 35%)" },
    { category: "Entertainment", amount: 89.40, color: "hsl(34, 92%, 45%)" },
  ];

  return (
    <div className="p-6">
      <SpendingChart data={mockData} />
    </div>
  );
}
