import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BalanceCardProps {
  title: string;
  balance: number;
  icon: LucideIcon;
  subtitle?: string;
}

export function BalanceCard({ title, balance, icon: Icon, subtitle }: BalanceCardProps) {
  return (
    <Card className="glass-card hover-elevate" data-testid={`card-balance-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-mono tabular-nums" data-testid={`text-balance-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          ${balance.toFixed(2)}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
