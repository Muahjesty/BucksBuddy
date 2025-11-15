import { BalanceCard } from "@/components/balance-card";
import { SpendingChart } from "@/components/spending-chart";
import { TransactionList } from "@/components/transaction-list";
import { BudgetProgress } from "@/components/budget-progress";
import { RewardsCard } from "@/components/rewards-card";
import { AIInsights } from "@/components/ai-insights";
import { QuickActions } from "@/components/quick-actions";
import { Utensils, Coffee, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Transaction, Budget } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: budgets = [], isLoading: budgetsLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const balances = [
    { title: "Meal Plan", balance: 287.50, icon: Utensils, subtitle: "12 meals remaining" },
    { title: "Dining Dollars", balance: 156.75, icon: Coffee, subtitle: "Expires May 2026" },
    { title: "Campus Card", balance: 423.20, icon: CreditCard, subtitle: "Available balance" },
  ];

  const categoryColors: Record<string, string> = {
    "Dining": "hsl(217, 91%, 35%)",
    "Books": "hsl(142, 76%, 30%)",
    "Transport": "hsl(271, 91%, 35%)",
    "Entertainment": "hsl(34, 92%, 45%)",
    "Supplies": "hsl(0, 0%, 45%)",
  };

  const spendingData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    const amount = parseFloat(transaction.amount);
    const existing = acc.find(item => item.category === category);
    
    if (existing) {
      existing.amount += amount;
    } else {
      acc.push({
        category,
        amount,
        color: categoryColors[category] || "hsl(0, 0%, 45%)",
      });
    }
    
    return acc;
  }, [] as Array<{ category: string; amount: number; color: string }>);

  const formattedTransactions = transactions.slice(0, 5).map(t => ({
    ...t,
    amount: parseFloat(t.amount),
    date: new Date(t.date),
  }));

  const formattedBudgets = budgets.map(b => ({
    ...b,
    spent: parseFloat(b.spent),
    limit: parseFloat(b.limit),
  }));

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
          {transactionsLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <TransactionList transactions={formattedTransactions} />
          )}
          
          {budgetsLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Budget Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <BudgetProgress budgets={formattedBudgets} />
          )}
        </div>

        <RewardsCard points={1250} streak={7} achievements={["Budget Master", "Early Bird", "Event Goer"]} />
      </div>
    </div>
  );
}
