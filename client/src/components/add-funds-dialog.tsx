import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Utensils, DollarSign, CreditCard } from "lucide-react";

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFundsDialog({ open, onOpenChange }: AddFundsDialogProps) {
  const [amount, setAmount] = useState("");
  const [balanceType, setBalanceType] = useState("dining_dollars");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Funds Added Successfully",
        description: `$${amount} has been added to your ${balanceType.replace('_', ' ')}`,
      });
      setAmount("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  const balanceIcons = {
    meal_plan: Utensils,
    dining_dollars: DollarSign,
    campus_card: CreditCard,
  };

  const Icon = balanceIcons[balanceType as keyof typeof balanceIcons];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-add-funds">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
            Add money to your campus wallet balances
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balanceType">Balance Type</Label>
              <Select value={balanceType} onValueChange={setBalanceType}>
                <SelectTrigger data-testid="select-balance-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meal_plan">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Meal Plan
                    </div>
                  </SelectItem>
                  <SelectItem value="dining_dollars">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Dining Dollars
                    </div>
                  </SelectItem>
                  <SelectItem value="campus_card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Campus Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                {Icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={balanceType === "meal_plan" ? "Number of meals" : "0.00"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  data-testid="input-amount"
                  required
                />
              </div>
              {balanceType === "meal_plan" && (
                <p className="text-xs text-muted-foreground">
                  Note: Meals are rounded down to whole numbers
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-add-funds-submit"
            >
              {isSubmitting ? "Adding..." : "Add Funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
