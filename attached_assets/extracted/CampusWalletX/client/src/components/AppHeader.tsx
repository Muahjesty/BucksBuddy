import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <header className="glass-strong border-b border-white/20 sticky top-0 z-40 px-4 py-4 sm:py-5 shadow-xl">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground drop-shadow-sm">{title}</h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-foreground/80 font-semibold mt-0.5" data-testid="text-welcome">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {children}
          <ThemeToggle />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleLogout}
            className="glass-subtle hover:glass-card rounded-xl"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
