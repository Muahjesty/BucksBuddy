import { useState, useEffect } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Utensils, DollarSign, CreditCard, Timer } from "lucide-react";
import QRCode from 'qrcode';

interface TapPayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TapPayDialog({ open, onOpenChange }: TapPayDialogProps) {
  const [balanceSource, setBalanceSource] = useState<string>("dining_dollars");
  const [amountCap, setAmountCap] = useState<string>("20.00");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/tap/create", {
        balanceSource,
        amountCap: parseFloat(amountCap)
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setSessionData(data);
      
      // Generate QR code with the token
      const qrDataURL = await QRCode.toDataURL(data.token, {
        width: 300,
        color: {
          dark: '#CC0033',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrDataURL);
      
      // Start countdown
      const expiresAt = new Date(data.expiresAt);
      const updateTimer = () => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          setQrCode(null);
          setSessionData(null);
          toast({
            title: "Session Expired",
            description: "The payment session has expired. Please create a new one.",
            variant: "destructive"
          });
        }
      };
      
      const interval = setInterval(updateTimer, 1000);
      updateTimer();
      
      // Clean up interval after 60 seconds
      setTimeout(() => clearInterval(interval), 61000);
      
      toast({
        title: "Tap & Pay Ready!",
        description: "Show this QR code to the merchant terminal to complete payment."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (!open) {
      setQrCode(null);
      setSessionData(null);
      setTimeLeft(60);
    }
  }, [open]);

  const handleCreateSession = () => {
    if (!amountCap || parseFloat(amountCap) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive"
      });
      return;
    }
    createSessionMutation.mutate();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Tap & Pay
          </DialogTitle>
          <DialogDescription>
            Create a secure payment QR code to use at merchant terminals
          </DialogDescription>
        </DialogHeader>

        {!qrCode ? (
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
              disabled={createSessionMutation.isPending}
              className="w-full"
              data-testid="button-generate-qr"
            >
              {createSessionMutation.isPending ? "Creating..." : "Generate QR Code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={qrCode}
                  alt="Payment QR Code"
                  className="rounded-2xl shadow-2xl border-4 border-white/30"
                  data-testid="img-qr-code"
                />
                <div className="absolute -top-2 -right-2 glass-strong px-3 py-1 rounded-full flex items-center gap-1">
                  <Timer className="h-3 w-3 text-primary" />
                  <span className="text-sm font-bold" data-testid="text-timer">{timeLeft}s</span>
                </div>
              </div>

              <div className="glass-subtle p-4 rounded-xl w-full text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  {getBalanceIcon()}
                  <span className="capitalize" data-testid="text-payment-source">{balanceSource.replace('_', ' ')}</span>
                </div>
                <p className="text-2xl font-bold text-primary" data-testid="text-amount-cap">
                  ${sessionData?.amountCap} max
                </p>
                <p className="text-xs text-muted-foreground" data-testid="text-token">
                  Token: {sessionData?.token?.substring(0, 20)}...
                </p>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Show this QR code to the merchant terminal to complete your payment
              </p>
            </div>

            <Button
              onClick={() => {
                setQrCode(null);
                setSessionData(null);
                onOpenChange(false);
              }}
              variant="outline"
              className="w-full"
              data-testid="button-close-qr"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
