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
import { ChatWidgetRef } from "@/components/chat-widget";

interface DashboardProps {
  chatWidgetRef?: React.RefObject<ChatWidgetRef>;
}

export default function Dashboard({ chatWidgetRef }: DashboardProps) {
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

  // Generate AI insights based on actual spending and budget data
  const generateInsights = () => {
    const insights: Array<{
      id: string;
      type: "savings" | "spending" | "recommendation";
      title: string;
      description: string;
    }> = [];

    // Calculate total spending
    const totalSpent = spendingData.reduce((sum, cat) => sum + cat.amount, 0);

    // Analyze each budget
    formattedBudgets.forEach((budget, index) => {
      const percentUsed = (budget.spent / budget.limit) * 100;
      const remaining = budget.limit - budget.spent;

      // Budget warning if over 80% used
      if (percentUsed >= 80 && percentUsed < 100) {
        insights.push({
          id: `budget-warning-${index}`,
          type: "spending",
          title: `${budget.category} budget at ${Math.round(percentUsed)}%`,
          description: `You've used $${budget.spent.toFixed(2)} of your $${budget.limit.toFixed(2)} ${budget.period} budget. $${remaining.toFixed(2)} remaining.`,
        });
      }

      // Budget exceeded alert
      if (percentUsed >= 100) {
        const overspent = budget.spent - budget.limit;
        insights.push({
          id: `budget-exceeded-${index}`,
          type: "spending",
          title: `${budget.category} budget exceeded`,
          description: `You're $${overspent.toFixed(2)} over your ${budget.period} ${budget.category} budget of $${budget.limit.toFixed(2)}.`,
        });
      }
    });

    // Analyze spending by category
    const topCategory = spendingData.reduce((prev, current) => 
      (current.amount > prev.amount) ? current : prev, 
      { category: '', amount: 0 }
    );

    if (topCategory.amount > 0 && totalSpent > 0) {
      const percentage = ((topCategory.amount / totalSpent) * 100).toFixed(0);
      insights.push({
        id: "top-spending",
        type: "spending",
        title: `${topCategory.category} is your top expense`,
        description: `${percentage}% of your spending ($${topCategory.amount.toFixed(2)}) goes to ${topCategory.category}. Consider reviewing your ${topCategory.category.toLowerCase()} habits.`,
      });
    }

    // Meal plan recommendation based on balances
    const mealPlanBalance = balances.find(b => b.title === "Meal Plan")?.balance || 0;
    const diningDollarsBalance = balances.find(b => b.title === "Dining Dollars")?.balance || 0;
    const diningSpending = spendingData.find(d => d.category === "Dining")?.amount || 0;

    if (diningSpending > 50 && mealPlanBalance > 0) {
      insights.push({
        id: "meal-plan-savings",
        type: "savings",
        title: "Use your meal plan to save money",
        description: `You spent $${diningSpending.toFixed(2)} on dining. With $${mealPlanBalance.toFixed(2)} in your meal plan, you could save by using it for more meals.`,
      });
    }

    // Campus card balance recommendation
    const campusCardBalance = balances.find(b => b.title === "Campus Card")?.balance || 0;
    if (campusCardBalance < 100 && campusCardBalance > 0) {
      insights.push({
        id: "campus-card-low",
        type: "recommendation",
        title: "Campus Card balance running low",
        description: `Your Campus Card has $${campusCardBalance.toFixed(2)} remaining. Consider adding funds to avoid running out.`,
      });
    }

    // If no insights generated, show positive message
    if (insights.length === 0 && formattedBudgets.length > 0) {
      insights.push({
        id: "on-track",
        type: "recommendation",
        title: "You're staying within budget!",
        description: "Great job! All your spending is within your budgets. Keep up the good work managing your finances.",
      });
    }

    // Default message if no data
    if (insights.length === 0) {
      insights.push({
        id: "get-started",
        type: "recommendation",
        title: "Start tracking your spending",
        description: "Add transactions and set budgets to receive personalized insights about your financial habits.",
      });
    }

    return insights.slice(0, 3); // Limit to top 3 insights
  };

  const insights = generateInsights();

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
          <AIInsights 
            insights={insights} 
            onLearnMore={(insight) => {
              const message = `Can you explain how you generated this insight: "${insight.title}" - ${insight.description}`;
              chatWidgetRef?.current?.openWithMessage(message);
            }}
          />
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
