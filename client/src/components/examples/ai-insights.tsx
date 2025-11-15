import { AIInsights } from "../ai-insights";

export default function AIInsightsExample() {
  const mockInsights = [
    {
      id: "1",
      type: "savings" as const,
      title: "Save $45 this month",
      description: "You spent 15% more on dining this week. Consider using your meal plan for breakfast.",
    },
    {
      id: "2",
      type: "recommendation" as const,
      title: "Campus events this weekend",
      description: "Based on your interests, we found 3 free tech events that match your profile.",
    },
  ];

  return (
    <div className="p-6">
      <AIInsights insights={mockInsights} />
    </div>
  );
}
