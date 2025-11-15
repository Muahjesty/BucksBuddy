import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { Link } from "wouter";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AddTransactionDialog />
      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" data-testid="button-view-budget" asChild>
        <Link href="/budgets">
          <Eye className="h-5 w-5" />
          <span className="text-sm">View Budget</span>
        </Link>
      </Button>
    </div>
  );
}
