import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingDown, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsightAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
}

interface Insight {
  id: string;
  type: "savings" | "spending" | "recommendation";
  title: string;
  description: string;
  actions?: InsightAction[];
}

interface AIInsightsProps {
  insights: Insight[];
  onLearnMore?: (insight: Insight) => void;
}

const insightIcons = {
  savings: TrendingDown,
  spending: Info,
  recommendation: Calendar,
};

export function AIInsights({ insights, onLearnMore }: AIInsightsProps) {
  return (
    <Card data-testid="card-ai-insights">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = insightIcons[insight.type];
            return (
              <div
                key={insight.id}
                className="flex gap-4 p-4 rounded-md bg-muted/50 hover-elevate"
                data-testid={`insight-${insight.id}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.actions?.map((action, idx) => (
                      <Button
                        key={idx}
                        variant={action.variant || "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={action.onClick}
                        data-testid={`button-action-${insight.id}-${idx}`}
                      >
                        {action.label}
                      </Button>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs" 
                      data-testid={`button-insight-${insight.id}`}
                      onClick={() => onLearnMore?.(insight)}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
