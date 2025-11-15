import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target } from "lucide-react";

interface RewardCardProps {
  title: string;
  description: string;
  points: number;
  achieved?: boolean;
  type?: "trophy" | "star" | "target";
}

export default function RewardCard({ 
  title, 
  description, 
  points, 
  achieved = false,
  type = "star"
}: RewardCardProps) {
  const icons = {
    trophy: Trophy,
    star: Star,
    target: Target,
  };
  
  const Icon = icons[type];

  return (
    <Card 
      className={`p-4 ${achieved ? 'bg-primary/5 border-primary/20' : ''}`}
      data-testid={`card-reward-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start gap-3">
        <div className={`${achieved ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} p-3 rounded-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm" data-testid="text-reward-title">{title}</p>
            {achieved && (
              <Badge variant="default" className="text-xs" data-testid="badge-achieved">
                Unlocked
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          <p className="text-sm font-medium text-primary mt-2" data-testid="text-reward-points">
            +{points} points
          </p>
        </div>
      </div>
    </Card>
  );
}
