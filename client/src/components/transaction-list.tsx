import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, BookOpen, Bus, Film, ShoppingCart, Stethoscope } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  paymentMethod: string;
  location: string;
  date: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  showAll?: boolean;
}

const categoryIcons: Record<string, typeof Utensils> = {
  Dining: Utensils,
  Books: BookOpen,
  Transport: Bus,
  Entertainment: Film,
  Supplies: ShoppingCart,
  Pharmacy: Stethoscope,
};

export function TransactionList({ transactions, showAll = false }: TransactionListProps) {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <Card data-testid="card-transaction-list">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransactions.map((transaction, index) => {
            const Icon = categoryIcons[transaction.category] || ShoppingCart;
            return (
              <div
                key={transaction.id}
                className={`flex items-center gap-4 ${
                  index !== displayTransactions.length - 1 ? "pb-4 border-b" : ""
                }`}
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{transaction.merchant}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{transaction.location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(transaction.date, "MMM d, yyyy")} • {transaction.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold font-mono tabular-nums" data-testid={`text-amount-${transaction.id}`}>
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
