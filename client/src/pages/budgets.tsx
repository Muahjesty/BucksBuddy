import { BudgetProgress } from "@/components/budget-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState } from "react";

export default function Budgets() {
  //todo: remove mock functionality - replace with real data from backend
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState("Monthly");

  const budgets = [
    { id: "B001", category: "Dining", spent: 245.30, limit: 300, period: "Monthly" },
    { id: "B002", category: "Entertainment", spent: 89.40, limit: 100, period: "Monthly" },
    { id: "B003", category: "Transport", spent: 67.80, limit: 150, period: "Monthly" },
    { id: "B004", category: "Books", spent: 128.50, limit: 200, period: "Monthly" },
  ];

  const handleCreateBudget = () => {
    console.log("Creating budget:", { category, limit, period });
    setIsDialogOpen(false);
    setCategory("");
    setLimit("");
    setPeriod("Monthly");
  };

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
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
              <Button onClick={handleCreateBudget} className="w-full" data-testid="button-save-budget">
                Create Budget
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
            <div className="text-3xl font-bold font-mono tabular-nums">${totalLimit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono tabular-nums">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono tabular-nums text-chart-2">
              ${savingsThisMonth.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgress budgets={budgets} />
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <p className="font-semibold text-sm mb-1">You're doing great!</p>
                <p className="text-sm text-muted-foreground">
                  You're staying within budget in 3 out of 4 categories this month.
                </p>
              </div>
              <div className="p-4 rounded-md bg-muted">
                <p className="font-semibold text-sm mb-1">Entertainment Alert</p>
                <p className="text-sm text-muted-foreground">
                  You've used 89% of your entertainment budget. Consider free campus events.
                </p>
              </div>
              <div className="p-4 rounded-md bg-muted">
                <p className="font-semibold text-sm mb-1">Save More</p>
                <p className="text-sm text-muted-foreground">
                  At your current rate, you'll save $150 this month. Keep it up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
