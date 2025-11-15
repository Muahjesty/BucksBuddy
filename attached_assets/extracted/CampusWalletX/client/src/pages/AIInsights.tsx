import AIChat from "@/components/AIChat";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="pb-20">
      <AppHeader 
        title="AI Financial Insights" 
        subtitle="Get personalized spending recommendations"
      />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-2 rounded-lg">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-900 dark:text-green-100">Great Progress!</p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  You've reduced dining spending by 15% this month compared to last month.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">Smart Tip</p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Consider using meal plan more often to save $40/month on dining expenses.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 text-white p-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-purple-900 dark:text-purple-100">Spending Pattern</p>
                <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                  You spend 30% more on weekends. Planning ahead could help save money.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white p-2 rounded-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Watch Out</p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  Shopping budget is 20% over limit. Consider cutting back this week.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Chat with AI Assistant</h2>
          <AIChat />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Budget Optimization</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your spending patterns, reallocating $50 from shopping to your savings could help you reach your semester goals 2 weeks earlier.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Potential savings:</span>
                    <span className="font-semibold text-chart-3">$200/semester</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Meal Plan Efficiency</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're using only 65% of your meal plan. Use 3 more swipes per week to maximize value and reduce dining dollar spending.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Unused value:</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-500">$85 this month</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Event Spending Insight</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Campus events with early-bird pricing could save you 25%. Set reminders for upcoming events to lock in discounts.
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">Average savings:</span>
                    <span className="font-semibold text-chart-3">$12/event</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
