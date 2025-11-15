import { BalanceCard } from "@/components/balance-card";
import { SpendingChart } from "@/components/spending-chart";
import { TransactionList } from "@/components/transaction-list";
import { BudgetProgress } from "@/components/budget-progress";
import { RewardsCard } from "@/components/rewards-card";
import { AIInsights } from "@/components/ai-insights";
import { QuickActions } from "@/components/quick-actions";
import { Utensils, Coffee, CreditCard } from "lucide-react";

export default function Dashboard() {
  //todo: remove mock functionality - replace with real data from backend
  const balances = [
    { title: "Meal Plan", balance: 287.50, icon: Utensils, subtitle: "12 meals remaining" },
    { title: "Dining Dollars", balance: 156.75, icon: Coffee, subtitle: "Expires May 2026" },
    { title: "Campus Card", balance: 423.20, icon: CreditCard, subtitle: "Available balance" },
  ];

  const spendingData = [
    { category: "Dining", amount: 245.30, color: "hsl(217, 91%, 35%)" },
    { category: "Books", amount: 128.50, color: "hsl(142, 76%, 30%)" },
    { category: "Transport", amount: 67.80, color: "hsl(271, 91%, 35%)" },
    { category: "Entertainment", amount: 89.40, color: "hsl(34, 92%, 45%)" },
  ];

  const transactions = [
    {
      id: "T0001",
      merchant: "Starbucks",
      category: "Dining",
      amount: 5.75,
      paymentMethod: "Dining Dollars",
      location: "Campus Center",
      date: new Date("2025-11-14"),
    },
    {
      id: "T0002",
      merchant: "Campus Dining Hall",
      category: "Dining",
      amount: 9.25,
      paymentMethod: "Meal Plan",
      location: "Dining Hall",
      date: new Date("2025-11-13"),
    },
    {
      id: "T0003",
      merchant: "Bookstore",
      category: "Books",
      amount: 42.50,
      paymentMethod: "Campus Card",
      location: "Bookstore",
      date: new Date("2025-11-12"),
    },
    {
      id: "T0004",
      merchant: "Target",
      category: "Supplies",
      amount: 28.99,
      paymentMethod: "Credit Card",
      location: "Downtown Newark",
      date: new Date("2025-11-11"),
    },
    {
      id: "T0005",
      merchant: "Local Pizzeria",
      category: "Dining",
      amount: 14.25,
      paymentMethod: "Campus Card",
      location: "Downtown Newark",
      date: new Date("2025-11-10"),
    },
  ];

  const budgets = [
    { id: "B001", category: "Dining", spent: 245.30, limit: 300, period: "Monthly" },
    { id: "B002", category: "Entertainment", spent: 89.40, limit: 100, period: "Monthly" },
    { id: "B003", category: "Transport", spent: 67.80, limit: 150, period: "Monthly" },
  ];

  const insights = [
    {
      id: "1",
      type: "savings" as const,
      title: "Save $45 this month",
      description: "You spent 15% more on dining this week. Consider using your meal plan for breakfast.",
    },
    {
      id: "2",
      type: "recommendation" as const,
      title: "Campus events this weekend",
      description: "Based on your interests, we found 3 free tech events that match your profile.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Alex!</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {balances.map((balance) => (
            <BalanceCard key={balance.title} {...balance} />
          ))}
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart data={spendingData} />
          <AIInsights insights={insights} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionList transactions={transactions} />
          <BudgetProgress budgets={budgets} />
        </div>

        <RewardsCard points={1250} streak={7} achievements={["Budget Master", "Early Bird", "Event Goer"]} />
      </div>
    </div>
  );
}
