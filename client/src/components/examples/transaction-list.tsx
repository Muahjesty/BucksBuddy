import { TransactionList } from "../transaction-list";

export default function TransactionListExample() {
  const mockTransactions = [
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
  ];

  return (
    <div className="p-6">
      <TransactionList transactions={mockTransactions} />
    </div>
  );
}
