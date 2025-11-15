import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Coffee, Book, ShoppingBag, Shirt, Music, Dumbbell } from "lucide-react";

const categories = [
  { value: "Dining", label: "Dining", icon: Coffee },
  { value: "Bookstore", label: "Bookstore", icon: Book },
  { value: "Shopping", label: "Shopping", icon: ShoppingBag },
  { value: "Laundry", label: "Laundry", icon: Shirt },
  { value: "Events", label: "Events", icon: Music },
  { value: "Wellness", label: "Wellness", icon: Dumbbell },
];

interface BudgetDialogProps {
  children: React.ReactNode;
}

export default function BudgetDialog({ children }: BudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const { toast } = useToast();

  const createBudgetMutation = useMutation({
    mutationFn: async (data: { category: string; limit: string }) => {
      const response = await apiRequest("POST", "/api/budgets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Budget created",
        description: `Your ${category} budget has been set to $${limit}`,
      });
      setOpen(false);
      setCategory("");
      setLimit("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create budget",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a budget category",
        variant: "destructive",
      });
      return;
    }

    const limitNum = parseFloat(limit);
    if (!limit || isNaN(limitNum) || limitNum <= 0) {
      toast({
        title: "Invalid limit",
        description: "Please enter a valid budget limit greater than $0",
        variant: "destructive",
      });
      return;
    }

    createBudgetMutation.mutate({ category, limit });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-add-budget">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogDescription>
            Set a spending limit for a category to track your expenses
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" data-testid="select-budget-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="limit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="pl-7"
                data-testid="input-budget-limit"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You'll be notified when you approach this limit
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              data-testid="button-cancel-budget"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glass"
              className="flex-1"
              disabled={createBudgetMutation.isPending}
              data-testid="button-create-budget"
            >
              {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
