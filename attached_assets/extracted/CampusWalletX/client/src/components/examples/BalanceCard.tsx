import BalanceCard from '../BalanceCard';
import { Utensils, DollarSign, CreditCard } from 'lucide-react';

export default function BalanceCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <BalanceCard
        title="Meal Plan"
        balance="12"
        subtitle="meals remaining this week"
        icon={Utensils}
      />
      <BalanceCard
        title="Dining Dollars"
        balance="$248.50"
        subtitle="valid until May 2025"
        icon={DollarSign}
      />
      <BalanceCard
        title="Campus Card"
        balance="$127.80"
        subtitle="use anywhere on campus"
        icon={CreditCard}
      />
    </div>
  );
}
