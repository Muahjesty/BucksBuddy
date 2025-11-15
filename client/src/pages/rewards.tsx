import { RewardsCard } from "@/components/rewards-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Zap, Award, Calendar } from "lucide-react";
import heroImage from "@assets/generated_images/Campus_events_and_activities_fb136356.png";

export default function Rewards() {
  //todo: remove mock functionality - replace with real data from backend
  const rewardTiers = [
    { name: "Bronze", minPoints: 0, maxPoints: 499, color: "bg-chart-4" },
    { name: "Silver", minPoints: 500, maxPoints: 999, color: "bg-muted" },
    { name: "Gold", minPoints: 1000, maxPoints: 1999, color: "bg-chart-1" },
    { name: "Platinum", minPoints: 2000, maxPoints: Infinity, color: "bg-primary" },
  ];

  const currentPoints = 1250;
  const currentTier = rewardTiers.find(
    (tier) => currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints
  );
  const nextTier = rewardTiers.find((tier) => tier.minPoints > currentPoints);
  const pointsToNext = nextTier ? nextTier.minPoints - currentPoints : 0;

  const redeemableRewards = [
    { id: "R001", name: "Free Coffee", cost: 200, icon: Gift },
    { id: "R002", name: "$5 Dining Credit", cost: 500, icon: Gift },
    { id: "R003", name: "Event Ticket", cost: 300, icon: Calendar },
    { id: "R004", name: "$10 Bookstore Credit", cost: 800, icon: Gift },
  ];

  const recentActivity = [
    { id: "A001", action: "Stayed under budget", points: 50, date: "2 days ago" },
    { id: "A002", action: "Attended campus event", points: 100, date: "5 days ago" },
    { id: "A003", action: "7-day streak bonus", points: 75, date: "1 week ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rewards</h1>
        <p className="text-muted-foreground mt-1">Earn points and unlock perks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img src={heroImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${currentTier?.color} text-white`}>{currentTier?.name} Member</Badge>
              </div>
              <div className="text-6xl font-bold font-mono tabular-nums mb-2">{currentPoints}</div>
              <p className="text-sm text-muted-foreground mb-6">Total Reward Points</p>
              {nextTier && currentTier && (
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">
                    {pointsToNext} points to {nextTier.name}
                  </p>
                  <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <RewardsCard points={currentPoints} streak={7} achievements={["Budget Master", "Early Bird", "Event Goer"]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Redeem Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redeemableRewards.map((reward) => {
                const canRedeem = currentPoints >= reward.cost;
                return (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-4 rounded-md bg-muted/50"
                    data-testid={`reward-${reward.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <reward.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{reward.name}</p>
                        <p className="text-xs text-muted-foreground">{reward.cost} points</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={!canRedeem}
                      data-testid={`button-redeem-${reward.id}`}
                    >
                      Redeem
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-semibold text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" />
                    +{activity.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-muted/50">
              <Award className="h-8 w-8 text-primary mb-2" />
              <p className="font-semibold text-sm mb-1">Stay Under Budget</p>
              <p className="text-xs text-muted-foreground">Earn 50 points each week you stay within your budgets</p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <p className="font-semibold text-sm mb-1">Attend Events</p>
              <p className="text-xs text-muted-foreground">Get 100 points for attending campus events</p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <Zap className="h-8 w-8 text-primary mb-2" />
              <p className="font-semibold text-sm mb-1">Daily Streak</p>
              <p className="text-xs text-muted-foreground">Bonus points for checking in daily - keep your streak alive!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
