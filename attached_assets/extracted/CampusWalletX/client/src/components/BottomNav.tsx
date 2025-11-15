import { Home, Receipt, PieChart, Award, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/transactions", icon: Receipt, label: "Transactions" },
    { path: "/budgets", icon: PieChart, label: "Budgets" },
    { path: "/rewards", icon: Award, label: "Rewards" },
    { path: "/ai", icon: Sparkles, label: "AI Insights" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/30 z-50 shadow-2xl">
      <div className="flex items-center justify-around max-w-2xl mx-auto py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex flex-col items-center gap-1.5 py-3 px-3 sm:px-4 min-w-[65px] sm:min-w-[75px] rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? "text-primary scale-105 glass-card shadow-lg" 
                    : "text-foreground/70 hover:text-foreground hover:scale-105"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-md" />
                <span className="text-[10px] sm:text-xs font-semibold">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
