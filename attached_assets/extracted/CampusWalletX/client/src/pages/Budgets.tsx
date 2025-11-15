import BudgetCard from "@/components/BudgetCard";
import BudgetDialog from "@/components/BudgetDialog";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingDown, AlertCircle } from "lucide-react";
import { Coffee, Book, ShoppingBag, Shirt, Music, Dumbbell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Budget } from "@shared/schema";

const categoryIcons: Record<string, any> = {
  "Dining": Coffee,
  "Bookstore": Book,
  "Shopping": ShoppingBag,
  "Laundry": Shirt,
  "Events": Music,
  "Wellness": Dumbbell,
};

export default function Budgets() {
  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.limit), 0) || 0;
  const totalSpent = budgets?.reduce((sum, b) => sum + parseFloat(b.spent), 0) || 0;
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="pb-20">
      <AppHeader 
        title="Budget Manager" 
        subtitle="Track your spending limits"
      >
        <BudgetDialog>
          <Button size="sm" variant="glass" data-testid="button-add-budget" className="text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Add Budget</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </BudgetDialog>
      </AppHeader>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Overall Budget</h2>
                <p className="text-sm text-muted-foreground">Monthly spending limit</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" data-testid="text-total-spent">
                  ${totalSpent.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">of ${totalBudget.toFixed(2)}</p>
              </div>
            </div>
            <Progress value={budgetPercentage} className="h-3 mb-2" data-testid="progress-overall-budget" />
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-chart-3" />
              <span className="text-muted-foreground">
                ${(totalBudget - totalSpent).toFixed(2)} remaining this month
              </span>
            </div>
          </Card>
        )}

        {budgetPercentage >= 80 && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                  Budget Alert
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  You've used {budgetPercentage.toFixed(0)}% of your monthly budget. Consider reducing spending in categories that are over limit.
                </p>
              </div>
            </div>
          </Card>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">Category Budgets</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          ) : budgets && budgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => {
                const Icon = categoryIcons[budget.category] || Coffee;
                return (
                  <BudgetCard
                    key={budget.id}
                    category={budget.category}
                    spent={parseFloat(budget.spent)}
                    limit={parseFloat(budget.limit)}
                    icon={Icon}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No budgets set up yet</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
