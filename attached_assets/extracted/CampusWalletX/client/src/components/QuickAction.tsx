import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function QuickAction({ icon: Icon, label, onClick }: QuickActionProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    console.log(`Quick action: ${label}`);
    onClick?.();
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <Button
      variant="outline"
      className="flex-col h-auto py-3 px-5 min-w-[90px] glass-card hover:glass-strong hover:scale-105 transition-all duration-300 rounded-xl border-white/25"
      onClick={handleClick}
      disabled={isClicked}
      data-testid={`button-quick-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Icon className="h-5 w-5 mb-1.5 text-primary drop-shadow-md" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}
