import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Utensils, DollarSign, CreditCard, Coffee, Book, Shirt, Music, Dumbbell } from "lucide-react";

interface SpendMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "Dining", label: "Dining", icon: Coffee },
  { value: "Bookstore", label: "Bookstore", icon: Book },
  { value: "Laundry", label: "Laundry", icon: Shirt },
  { value: "Entertainment", label: "Entertainment", icon: Music },
  { value: "Supplies", label: "Supplies", icon: Dumbbell },
];

export function SpendMoneyDialog({ open, onOpenChange }: SpendMoneyDialogProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Dining");
  const [merchant, setMerchant] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Dining Dollars");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const spendMutation = useMutation({
    mutationFn: async (data: {
      merchant: string;
      category: string;
      amount: string;
      paymentMethod: string;
      location: string;
    }) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      toast({
        title: "Transaction Successful",
        description: `$${parseFloat(variables.amount).toFixed(2)} spent at ${variables.merchant}`,
      });
      setAmount("");
      setMerchant("");
      setCategory("Dining");
      setPaymentMethod("Dining Dollars");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Transaction Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (!merchant.trim()) {
      toast({
        title: "Missing Merchant",
        description: "Please enter a merchant name",
        variant: "destructive",
      });
      return;
    }
    
    spendMutation.mutate({ 
      merchant: merchant.trim(),
      category, 
      amount: amountValue.toFixed(2),
      paymentMethod,
      location: "Campus"
    });
  };

  const paymentIcons = {
    "Meal Plan": Utensils,
    "Dining Dollars": DollarSign,
    "Campus Card": CreditCard,
  };

  const Icon = paymentIcons[paymentMethod as keyof typeof paymentIcons];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-spend-money">
        <DialogHeader>
          <DialogTitle>New Purchase</DialogTitle>
          <DialogDescription>
            Record a new spending transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                placeholder="Starbucks, Campus Store, etc."
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                data-testid="input-merchant"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
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
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  data-testid="input-amount-spend"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger data-testid="select-payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meal Plan">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Meal Plan
                    </div>
                  </SelectItem>
                  <SelectItem value="Dining Dollars">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Dining Dollars
                    </div>
                  </SelectItem>
                  <SelectItem value="Campus Card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Campus Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-spend"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={spendMutation.isPending}
              data-testid="button-spend-submit"
            >
              {spendMutation.isPending ? "Processing..." : "Complete Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
