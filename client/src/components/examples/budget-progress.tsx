import { BudgetProgress } from "../budget-progress";

export default function BudgetProgressExample() {
  const mockBudgets = [
    { id: "B001", category: "Dining", spent: 245.30, limit: 300, period: "Monthly" },
    { id: "B002", category: "Entertainment", spent: 89.40, limit: 100, period: "Monthly" },
    { id: "B003", category: "Transport", spent: 67.80, limit: 150, period: "Monthly" },
  ];

  return (
    <div className="p-6">
      <BudgetProgress budgets={mockBudgets} />
    </div>
  );
}
