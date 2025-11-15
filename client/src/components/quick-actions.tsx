import { Button } from "@/components/ui/button";
import { Plus, Eye, CreditCard, ScanLine } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" data-testid="button-add-transaction">
        <Plus className="h-5 w-5" />
        <span className="text-sm">Add Transaction</span>
      </Button>
      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" data-testid="button-view-budget">
        <Eye className="h-5 w-5" />
        <span className="text-sm">View Budget</span>
      </Button>
      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" data-testid="button-pay">
        <CreditCard className="h-5 w-5" />
        <span className="text-sm">Pay</span>
      </Button>
      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" data-testid="button-scan">
        <ScanLine className="h-5 w-5" />
        <span className="text-sm">Scan</span>
      </Button>
    </div>
  );
}
