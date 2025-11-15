import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { format } from "date-fns";

interface TransactionItemProps {
  merchant: string;
  category: string;
  amount: string | number;
  date: Date | string;
  icon: LucideIcon;
  type: "debit" | "credit";
}

export default function TransactionItem({
  merchant,
  category,
  amount,
  date,
  icon: Icon,
  type,
}: TransactionItemProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return (
    <div className="flex items-center gap-4 py-4 px-4 glass-card hover:glass-strong rounded-2xl transition-all duration-300 hover:scale-[1.02]" data-testid={`transaction-${merchant.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="glass-subtle p-3 rounded-xl">
        <Icon className="h-5 w-5 text-primary drop-shadow-md" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-foreground" data-testid="text-merchant">{merchant}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="secondary" className="text-xs font-medium rounded-lg" data-testid="badge-category">
            {category}
          </Badge>
          <span className="text-xs text-foreground/60 font-medium">
            {format(dateObj, "MMM d, h:mm a")}
          </span>
        </div>
      </div>
      <p
        className={`font-bold text-lg ${
          type === "debit" ? "text-foreground" : "text-chart-3"
        }`}
        data-testid="text-amount"
      >
        {type === "debit" ? "-" : "+"}${typeof amount === "number" ? amount.toFixed(2) : amount}
      </p>
    </div>
  );
}
