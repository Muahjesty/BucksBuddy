import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface BudgetCardProps {
  category: string;
  spent: number;
  limit: number;
  icon: LucideIcon;
}

export default function BudgetCard({ category, spent, limit, icon: Icon }: BudgetCardProps) {
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/90 hover:bg-card transition-all duration-200" data-testid={`card-budget-${category.toLowerCase()}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg backdrop-blur-sm">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold" data-testid="text-category">{category}</p>
          <p className="text-sm text-muted-foreground">
            ${remaining.toFixed(2)} remaining
          </p>
        </div>
      </div>
      <Progress 
        value={Math.min(percentage, 100)} 
        className="h-2 mb-2"
        data-testid="progress-budget"
      />
      <div className="flex justify-between text-sm">
        <span className={isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
          ${spent.toFixed(2)} spent
        </span>
        <span className="text-muted-foreground">${limit.toFixed(2)} limit</span>
      </div>
      {isNearLimit && !isOverLimit && (
        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2" data-testid="text-warning">
          ⚠️ Approaching budget limit
        </p>
      )}
      {isOverLimit && (
        <p className="text-xs text-destructive mt-2" data-testid="text-over-limit">
          ⚠️ Over budget
        </p>
      )}
    </Card>
  );
}
