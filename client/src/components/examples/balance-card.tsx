import { BalanceCard } from "../balance-card";
import { Utensils, Coffee, CreditCard } from "lucide-react";

export default function BalanceCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <BalanceCard title="Meal Plan" balance={287.50} icon={Utensils} subtitle="12 meals remaining" />
      <BalanceCard title="Dining Dollars" balance={156.75} icon={Coffee} subtitle="Expires May 2026" />
      <BalanceCard title="Campus Card" balance={423.20} icon={CreditCard} subtitle="Available balance" />
    </div>
  );
}
