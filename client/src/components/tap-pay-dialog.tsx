import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Utensils, DollarSign, CreditCard, CheckCircle2 } from "lucide-react";

interface TapPayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TapPayDialog({ open, onOpenChange }: TapPayDialogProps) {
  const [balanceSource, setBalanceSource] = useState<string>("dining_dollars");
  const [amountCap, setAmountCap] = useState<string>("20.00");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCreateSession = () => {
    if (!amountCap || parseFloat(amountCap) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setShowSuccess(true);
      setIsProcessing(false);
      toast({
        title: "Tap & Pay Ready!",
        description: "Your payment method is ready for contactless payment."
      });
    }, 1500);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setAmountCap("20.00");
    onOpenChange(false);
  };

  const getBalanceIcon = () => {
    switch (balanceSource) {
      case "meal_plan":
        return <Utensils className="h-4 w-4" />;
      case "dining_dollars":
        return <DollarSign className="h-4 w-4" />;
      case "campus_card":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleClose();
      else onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px] glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Tap & Pay
          </DialogTitle>
          <DialogDescription>
            Enable contactless payment for quick transactions
          </DialogDescription>
        </DialogHeader>

        {!showSuccess ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance-source">Payment Source</Label>
              <Select value={balanceSource} onValueChange={setBalanceSource}>
                <SelectTrigger id="balance-source" data-testid="select-payment-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meal_plan" data-testid="option-meal-plan">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Meal Plan
                    </div>
                  </SelectItem>
                  <SelectItem value="dining_dollars" data-testid="option-dining-dollars">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Dining Dollars
                    </div>
                  </SelectItem>
                  <SelectItem value="campus_card" data-testid="option-campus-card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Campus Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount-cap">Maximum Amount</Label>
              <Input
                id="amount-cap"
                type="number"
                step="0.01"
                min="0.01"
                value={amountCap}
                onChange={(e) => setAmountCap(e.target.value)}
                placeholder="20.00"
                data-testid="input-amount-cap"
              />
              <p className="text-xs text-muted-foreground">
                The merchant cannot charge more than this amount
              </p>
            </div>

            <Button
              onClick={handleCreateSession}
              disabled={isProcessing}
              className="w-full"
              data-testid="button-enable-tap-pay"
            >
              {isProcessing ? "Activating..." : "Enable Tap & Pay"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="glass-strong p-8 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Tap & Pay Enabled!</h3>
                <p className="text-sm text-muted-foreground">
                  Your contactless payment is ready
                </p>
              </div>

              <div className="glass-subtle p-4 rounded-xl w-full text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  {getBalanceIcon()}
                  <span className="capitalize" data-testid="text-payment-source">
                    {balanceSource.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary" data-testid="text-amount-cap">
                  ${amountCap} max
                </p>
              </div>

              <p className="text-sm text-center text-muted-foreground px-4">
                Simply tap your phone at any contactless terminal to complete payment
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full"
              data-testid="button-close-tap-pay"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
