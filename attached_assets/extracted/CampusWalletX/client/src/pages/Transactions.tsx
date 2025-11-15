import TransactionItem from "@/components/TransactionItem";
import AppHeader from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Coffee, Book, Printer, Utensils, Shirt, Dumbbell, Music, Backpack } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@shared/schema";
import emptyState from '@assets/generated_images/Empty_transactions_illustration_b9ea2018.png';

const categoryIcons: Record<string, any> = {
  "Dining": Coffee,
  "Bookstore": Book,
  "Printing": Printer,
  "Events": Music,
  "Laundry": Shirt,
  "Wellness": Dumbbell,
  "Shopping": Backpack,
};

const categories = ["All", "Dining", "Bookstore", "Events", "Wellness", "Laundry", "Printing"];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const filteredTransactions = transactions?.filter((t) => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="pb-20">
      <AppHeader title="Transaction History" />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-transactions"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`filter-${cat.toLowerCase()}`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-card rounded-lg p-4 space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img src={emptyState} alt="No transactions" className="w-48 h-48 opacity-50 mb-4" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-4 space-y-1">
            {filteredTransactions.map((transaction) => {
              const Icon = categoryIcons[transaction.category] || Coffee;
              return (
                <TransactionItem
                  key={transaction.id}
                  merchant={transaction.merchant}
                  category={transaction.category}
                  amount={Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                  date={transaction.date}
                  icon={Icon}
                  type={transaction.type as "debit" | "credit"}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
