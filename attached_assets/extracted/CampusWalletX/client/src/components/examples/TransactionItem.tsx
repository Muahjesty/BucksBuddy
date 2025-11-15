import TransactionItem from '../TransactionItem';
import { Coffee, Book, Printer, Dumbbell } from 'lucide-react';

export default function TransactionItemExample() {
  return (
    <div className="space-y-2 p-4 max-w-md">
      <TransactionItem
        merchant="Student Union Cafe"
        category="Dining"
        amount="12.50"
        date={new Date()}
        icon={Coffee}
        type="debit"
      />
      <TransactionItem
        merchant="Campus Bookstore"
        category="Bookstore"
        amount="45.00"
        date={new Date(Date.now() - 86400000)}
        icon={Book}
        type="debit"
      />
      <TransactionItem
        merchant="Library Printing"
        category="Printing"
        amount="3.25"
        date={new Date(Date.now() - 172800000)}
        icon={Printer}
        type="debit"
      />
      <TransactionItem
        merchant="Gym Membership Refund"
        category="Wellness"
        amount="25.00"
        date={new Date(Date.now() - 259200000)}
        icon={Dumbbell}
        type="credit"
      />
    </div>
  );
}
