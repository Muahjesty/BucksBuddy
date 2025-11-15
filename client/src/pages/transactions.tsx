import { TransactionList } from "@/components/transaction-list";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

export default function Transactions() {
  //todo: remove mock functionality - replace with real data from backend
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allTransactions = [
    {
      id: "T0001",
      merchant: "Starbucks",
      category: "Dining",
      amount: 5.75,
      paymentMethod: "Dining Dollars",
      location: "Campus Center",
      date: new Date("2025-11-14"),
    },
    {
      id: "T0002",
      merchant: "Campus Dining Hall",
      category: "Dining",
      amount: 9.25,
      paymentMethod: "Meal Plan",
      location: "Dining Hall",
      date: new Date("2025-11-13"),
    },
    {
      id: "T0003",
      merchant: "Bookstore",
      category: "Books",
      amount: 42.50,
      paymentMethod: "Campus Card",
      location: "Bookstore",
      date: new Date("2025-11-12"),
    },
    {
      id: "T0004",
      merchant: "Target",
      category: "Supplies",
      amount: 28.99,
      paymentMethod: "Credit Card",
      location: "Downtown Newark",
      date: new Date("2025-11-11"),
    },
    {
      id: "T0005",
      merchant: "Local Pizzeria",
      category: "Dining",
      amount: 14.25,
      paymentMethod: "Campus Card",
      location: "Downtown Newark",
      date: new Date("2025-11-10"),
    },
    {
      id: "T0006",
      merchant: "Streaming Service",
      category: "Entertainment",
      amount: 9.99,
      paymentMethod: "Credit Card",
      location: "Online",
      date: new Date("2025-11-09"),
    },
    {
      id: "T0007",
      merchant: "Gym Cafe",
      category: "Dining",
      amount: 6.75,
      paymentMethod: "Campus Card",
      location: "Rec Center",
      date: new Date("2025-11-08"),
    },
    {
      id: "T0008",
      merchant: "Uber",
      category: "Transport",
      amount: 12.40,
      paymentMethod: "Debit Card",
      location: "Off-Campus",
      date: new Date("2025-11-07"),
    },
  ];

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground mt-1">View and manage your transaction history</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-transactions"
              />
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Dining">Dining</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionList transactions={filteredTransactions} showAll />
    </div>
  );
}
