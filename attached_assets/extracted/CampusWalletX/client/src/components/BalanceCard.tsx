import { LucideIcon } from "lucide-react";

interface BalanceCardProps {
  title: string;
  balance: string | number;
  icon: LucideIcon;
  subtitle?: string;
  iconColor?: string;
}

export default function BalanceCard({ 
  title, 
  balance, 
  icon: Icon, 
  subtitle,
  iconColor = "text-primary"
}: BalanceCardProps) {
  return (
    <div 
      className="p-8 hover:scale-105 transition-all duration-300 rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/30 shadow-2xl" 
      data-testid={`card-balance-${title.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        boxShadow: '0 8px 24px 0 rgba(220, 38, 38, 0.12)'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold mt-3 drop-shadow-sm" data-testid={`text-balance-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {balance}
          </p>
          {subtitle && (
            <p className="text-sm font-medium text-foreground/60 mt-2">{subtitle}</p>
          )}
        </div>
        <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 dark:bg-white/3 border border-white/20">
          <Icon className="h-7 w-7 text-primary drop-shadow-md" />
        </div>
      </div>
    </div>
  );
}
