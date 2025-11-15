import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Smartphone, ShoppingBag, History } from "lucide-react";
import { AddFundsDialog } from "./add-funds-dialog";
import { TapPayDialog } from "./tap-pay-dialog";
import { SpendMoneyDialog } from "./spend-money-dialog";
import { Link } from "wouter";

export function QuickActions() {
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [tapPayOpen, setTapPayOpen] = useState(false);
  const [spendMoneyOpen, setSpendMoneyOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2 hover-elevate" 
          data-testid="button-add-funds"
          onClick={() => setAddFundsOpen(true)}
        >
          <PlusCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Add Funds</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2 hover-elevate" 
          data-testid="button-tap-pay"
          onClick={() => setTapPayOpen(true)}
        >
          <Smartphone className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Tap & Pay</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2 hover-elevate" 
          data-testid="button-new-purchase"
          onClick={() => setSpendMoneyOpen(true)}
        >
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">New Purchase</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col gap-2 hover-elevate" 
          data-testid="button-purchase-history" 
          asChild
        >
          <Link href="/transactions">
            <History className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">History</span>
          </Link>
        </Button>
      </div>

      <AddFundsDialog open={addFundsOpen} onOpenChange={setAddFundsOpen} />
      <TapPayDialog open={tapPayOpen} onOpenChange={setTapPayOpen} />
      <SpendMoneyDialog open={spendMoneyOpen} onOpenChange={setSpendMoneyOpen} />
    </>
  );
}
