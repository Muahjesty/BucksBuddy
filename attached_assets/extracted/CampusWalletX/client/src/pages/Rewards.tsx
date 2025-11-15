import RewardCard from "@/components/RewardCard";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Reward } from "@shared/schema";

const achievedRewards = [
  { title: "Budget Master", description: "Stay under budget for 3 consecutive months", points: 500, type: "trophy" as const },
  { title: "Smart Spender", description: "Use campus card for 20+ transactions", points: 250, type: "star" as const },
  { title: "Early Bird", description: "Pay for 5 events before deadline", points: 300, type: "star" as const },
  { title: "Wellness Warrior", description: "Use gym facilities 10 times this month", points: 200, type: "trophy" as const },
];

const availableRewards = [
  { title: "Meal Planner", description: "Track all meal swipes for one month", points: 300, type: "target" as const },
  { title: "Savings Streak", description: "Stay 10% under budget for 2 months", points: 400, type: "trophy" as const },
  { title: "Community Member", description: "Attend 5 campus events this semester", points: 250, type: "star" as const },
  { title: "Eco Warrior", description: "Use reusable containers 15 times", points: 150, type: "target" as const },
];

export default function Rewards() {
  const { data: rewards, isLoading } = useQuery<Reward>({
    queryKey: ["/api/rewards"],
  });

  const currentPoints = rewards?.points || 0;
  const nextLevelPoints = 2000;
  const progressPercentage = (currentPoints / nextLevelPoints) * 100;

  return (
    <div className="pb-20">
      <AppHeader 
        title="Rewards & Achievements" 
        subtitle="Earn points for smart spending habits"
      />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <Skeleton className="h-40" />
        ) : (
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                  <p className="text-2xl font-bold">{rewards?.level || "Bronze"} Member</p>
                </div>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2" data-testid="badge-points">
                {currentPoints} pts
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress to Gold</span>
                <span className="font-medium">{nextLevelPoints - currentPoints} points to go</span>
              </div>
              <Progress value={progressPercentage} className="h-2" data-testid="progress-level" />
            </div>
          </Card>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievedRewards.map((reward) => (
              <RewardCard
                key={reward.title}
                title={reward.title}
                description={reward.description}
                points={reward.points}
                achieved={true}
                type={reward.type}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Available Challenges</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward) => (
              <RewardCard
                key={reward.title}
                title={reward.title}
                description={reward.description}
                points={reward.points}
                achieved={false}
                type={reward.type}
              />
            ))}
          </div>
        </section>

        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">Redeem Your Points</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use your points for dining discounts, event tickets, and campus store vouchers. More redemption options coming soon!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <p className="text-2xl mb-1">☕</p>
              <p className="text-sm font-medium">Free Coffee</p>
              <p className="text-xs text-muted-foreground">500 pts</p>
            </Card>
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <p className="text-2xl mb-1">🎟️</p>
              <p className="text-sm font-medium">Event Ticket</p>
              <p className="text-xs text-muted-foreground">800 pts</p>
            </Card>
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <p className="text-2xl mb-1">🍕</p>
              <p className="text-sm font-medium">Pizza Voucher</p>
              <p className="text-xs text-muted-foreground">1000 pts</p>
            </Card>
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <p className="text-2xl mb-1">🎁</p>
              <p className="text-sm font-medium">Store Credit</p>
              <p className="text-xs text-muted-foreground">1500 pts</p>
            </Card>
          </div>
        </Card>
      </main>
    </div>
  );
}
