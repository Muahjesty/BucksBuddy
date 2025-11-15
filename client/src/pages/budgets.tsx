import { BudgetProgress } from "@/components/budget-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Budget, InsertBudget } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Budgets() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("Monthly");

  const { data: budgets = [], isLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: Omit<InsertBudget, "userId">) => {
      return await apiRequest("POST", "/api/budgets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Budget created",
        description: "Your budget has been created successfully.",
      });
      setIsDialogOpen(false);
      setCategory("");
      setLimit("");
      setPeriod("Monthly");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create budget. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating budget:", error);
    },
  });

  const handleCreateBudget = () => {
    if (!category || !limit) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    createBudgetMutation.mutate({
      category,
      limit,
      period,
      spent: "0",
    });
  };

  const formattedBudgets = budgets.map(b => ({
    ...b,
    spent: parseFloat(b.spent),
    limit: parseFloat(b.limit),
  }));

  const totalSpent = formattedBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = formattedBudgets.reduce((sum, b) => sum + b.limit, 0);
  const savingsThisMonth = totalLimit - totalSpent;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground mt-1">Track your spending goals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-budget">
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" data-testid="select-budget-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dining">Dining</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Budget Limit ($)</Label>
                <Input
                  id="limit"
                  type="number"
                  placeholder="300.00"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  data-testid="input-budget-limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period" data-testid="select-budget-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateBudget} 
                className="w-full" 
                data-testid="button-save-budget"
                disabled={createBudgetMutation.isPending}
              >
                {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <>
                <div className="text-3xl font-bold font-mono tabular-nums">${totalLimit.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <>
                <div className="text-3xl font-bold font-mono tabular-nums">${totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <>
                <div className="text-3xl font-bold font-mono tabular-nums text-chart-2">
                  ${savingsThisMonth.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available to spend</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : formattedBudgets.length > 0 ? (
          <BudgetProgress budgets={formattedBudgets} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first budget to start tracking your spending goals.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Tips</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-md bg-muted">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : formattedBudgets.length > 0 ? (
              <div className="space-y-4">
                {formattedBudgets.some(b => (b.spent / b.limit) >= 0.8) && (
                  <div className="p-4 rounded-md bg-muted">
                    <p className="font-semibold text-sm mb-1">Budget Alert</p>
                    <p className="text-sm text-muted-foreground">
                      {formattedBudgets.filter(b => (b.spent / b.limit) >= 0.8).length} {formattedBudgets.filter(b => (b.spent / b.limit) >= 0.8).length === 1 ? 'category is' : 'categories are'} approaching or over budget. Review your spending to stay on track.
                    </p>
                  </div>
                )}
                {savingsThisMonth > 0 && (
                  <div className="p-4 rounded-md bg-muted">
                    <p className="font-semibold text-sm mb-1">Great Progress!</p>
                    <p className="text-sm text-muted-foreground">
                      You have ${savingsThisMonth.toFixed(2)} remaining across all budgets. Keep up the good work!
                    </p>
                  </div>
                )}
                <div className="p-4 rounded-md bg-muted">
                  <p className="font-semibold text-sm mb-1">Pro Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Set up weekly budgets for better spending control, or adjust your monthly budgets based on your spending patterns.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Create a budget to see personalized tips and recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
