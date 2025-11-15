import BudgetCard from '../BudgetCard';
import { Coffee, Book, ShoppingBag, Shirt } from 'lucide-react';

export default function BudgetCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl">
      <BudgetCard category="Dining" spent={145.50} limit={200} icon={Coffee} />
      <BudgetCard category="Bookstore" spent={85} limit={100} icon={Book} />
      <BudgetCard category="Shopping" spent={120} limit={100} icon={ShoppingBag} />
      <BudgetCard category="Laundry" spent={15} limit={50} icon={Shirt} />
    </div>
  );
}
