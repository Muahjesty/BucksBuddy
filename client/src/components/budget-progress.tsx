import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

interface Budget {
  id: string;
  category: string;
  spent: number;
  limit: number;
  period: string;
}

interface BudgetProgressProps {
  budgets: Budget[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  const getStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "over";
    if (percentage >= 80) return "warning";
    return "good";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "over":
        return "bg-destructive";
      case "warning":
        return "bg-chart-4";
      default:
        return "bg-chart-2";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "over":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <TrendingUp className="h-4 w-4 text-chart-4" />;
      default:
        return <CheckCircle className="h-4 w-4 text-chart-2" />;
    }
  };

  return (
    <Card data-testid="card-budget-progress">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const status = getStatus(budget.spent, budget.limit);
            const remaining = budget.limit - budget.spent;

            return (
              <div key={budget.id} className="space-y-2" data-testid={`budget-${budget.category.toLowerCase()}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="font-semibold text-sm">{budget.category}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{budget.period}</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full transition-all ${getStatusColor(status)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono tabular-nums">
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                  <span className={`font-medium ${remaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {remaining < 0 ? `$${Math.abs(remaining).toFixed(2)} over` : `$${remaining.toFixed(2)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
