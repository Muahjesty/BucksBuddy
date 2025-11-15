import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Star } from "lucide-react";

interface RewardsCardProps {
  points: number;
  streak: number;
  achievements: string[];
}

export function RewardsCard({ points, streak, achievements }: RewardsCardProps) {
  return (
    <Card data-testid="card-rewards">
      <CardHeader>
        <CardTitle>Rewards & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <div className="text-5xl font-bold font-mono tabular-nums" data-testid="text-points">
              {points}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total Points</p>
          </div>

          <div className="flex items-center justify-center gap-2 p-4 rounded-md bg-muted">
            <Flame className="h-5 w-5 text-chart-4" />
            <span className="font-semibold">{streak} Day Streak</span>
          </div>

          {achievements.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Recent Achievements</p>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
