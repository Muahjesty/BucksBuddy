import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatWidget, ChatWidgetRef } from "@/components/chat-widget";
import { useAuth } from "@/hooks/useAuth";
import { useRef } from "react";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Budgets from "@/pages/budgets";
import Rewards from "@/pages/rewards";
import CampusEvents from "@/pages/campus-events";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router({ chatWidgetRef }: { chatWidgetRef?: React.RefObject<ChatWidgetRef> }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Switch>
      <Route path="/">
        <Dashboard chatWidgetRef={chatWidgetRef} />
      </Route>
      <Route path="/transactions" component={Transactions} />
      <Route path="/budgets" component={Budgets} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/events" component={CampusEvents} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const financialContext = {
    meal_plan_balance: 287.50,
    dining_dollars: 156.75,
    campus_card_balance: 423.20,
    recent_spending: [
      { description: "Starbucks", amount: 5.75 },
      { description: "Campus Dining Hall", amount: 9.25 },
      { description: "Bookstore", amount: 42.50 },
    ],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthenticatedApp style={style} financialContext={financialContext} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedApp({ style, financialContext }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const chatWidgetRef = useRef<ChatWidgetRef>(null);

  if (isLoading || !isAuthenticated) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b glass-accent">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Router chatWidgetRef={chatWidgetRef} />
          </main>
        </div>
      </div>
      <ChatWidget ref={chatWidgetRef} financialContext={financialContext} />
    </SidebarProvider>
  );
}

export default App;
