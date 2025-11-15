import { useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import TransactionItem from "@/components/TransactionItem";
import QuickAction from "@/components/QuickAction";
import SpendingChart from "@/components/SpendingChart";
import EventCard from "@/components/EventCard";
import AppHeader from "@/components/AppHeader";
import AddFundsDialog from "@/components/AddFundsDialog";
import SpendMoneyDialog from "@/components/SpendMoneyDialog";
import TapPayDialog from "@/components/TapPayDialog";
import { Button } from "@/components/ui/button";
import { Utensils, DollarSign, CreditCard, Plus, Send, Scan, History, Coffee, Book, Printer, Utensils as UtensilsIcon, Shirt, Dumbbell, Music, Backpack, TrendingUp, ArrowRight, ShoppingCart, QrCode } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Balance, Transaction, CampusEvent } from "@shared/schema";
import diningImage from '@assets/generated_images/Campus_dining_event_thumbnail_05852da1.png';
import festivalImage from '@assets/generated_images/Campus_festival_event_thumbnail_7d3e3ff7.png';
import { useAuth } from "@/contexts/AuthContext";

const categoryIcons: Record<string, any> = {
  "Dining": Coffee,
  "Bookstore": Book,
  "Printing": Printer,
  "Events": Music,
  "Laundry": Shirt,
  "Wellness": Dumbbell,
  "Shopping": Backpack,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [spendMoneyOpen, setSpendMoneyOpen] = useState(false);
  const [tapPayOpen, setTapPayOpen] = useState(false);

  const { data: balance, isLoading: balanceLoading } = useQuery<Balance>({
    queryKey: ["/api/balance"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    select: (data) => data.slice(0, 3),
  });

  const { data: events, isLoading: eventsLoading } = useQuery<CampusEvent[]>({
    queryKey: ["/api/events"],
    select: (data) => data.slice(0, 2),
  });

  return (
    <div className="pb-20">
      <AppHeader 
        title="Campus Wallet" 
        subtitle={`Welcome back, ${user?.username || 'Guest'}!`}
      >
        <Button 
          size="sm" 
          variant="glass" 
          data-testid="button-add-funds" 
          className="text-xs sm:text-sm"
          onClick={() => setAddFundsOpen(true)}
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Add Funds</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </AppHeader>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Balances</h2>
          {balanceLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : balance ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BalanceCard
                title="Meal Plan"
                balance={balance.mealPlanBalance}
                subtitle="meals remaining this week"
                icon={Utensils}
              />
              <BalanceCard
                title="Dining Dollars"
                balance={`$${parseFloat(balance.diningDollars).toFixed(2)}`}
                subtitle="valid until May 2025"
                icon={DollarSign}
              />
              <BalanceCard
                title="Campus Card"
                balance={`$${parseFloat(balance.campusCardBalance).toFixed(2)}`}
                subtitle="use anywhere on campus"
                icon={CreditCard}
              />
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <QuickAction icon={QrCode} label="Tap & Pay" onClick={() => setTapPayOpen(true)} />
            <QuickAction icon={Plus} label="Add Funds" onClick={() => setAddFundsOpen(true)} />
            <QuickAction icon={ShoppingCart} label="New Purchase" onClick={() => setSpendMoneyOpen(true)} />
            <QuickAction icon={History} label="History" onClick={() => window.location.href = "/transactions"} />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link href="/transactions">
              <div className="text-sm text-primary font-medium flex items-center gap-1 hover-elevate rounded px-2 py-1 cursor-pointer" data-testid="link-view-all">
                View All
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
          {transactionsLoading ? (
            <div className="bg-card rounded-lg p-4 space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="bg-card rounded-lg p-4 space-y-1">
              {transactions.map((transaction) => {
                const Icon = categoryIcons[transaction.category] || Coffee;
                return (
                  <TransactionItem
                    key={transaction.id}
                    merchant={transaction.merchant}
                    category={transaction.category}
                    amount={Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                    date={transaction.date}
                    icon={Icon}
                    type={transaction.type as "debit" | "credit"}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Spending Insights</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SpendingChart type="weekly" />
            <SpendingChart type="category" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Upcoming Campus Events</h2>
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  eventId={event.id}
                  title={event.title}
                  category={event.category}
                  price={parseFloat(event.price)}
                  date={event.date}
                  imageUrl={index === 0 ? diningImage : festivalImage}
                  location="Campus Center"
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          )}
        </section>
      </main>

      <AddFundsDialog open={addFundsOpen} onOpenChange={setAddFundsOpen} />
      <SpendMoneyDialog open={spendMoneyOpen} onOpenChange={setSpendMoneyOpen} />
      <TapPayDialog open={tapPayOpen} onOpenChange={setTapPayOpen} />
    </div>
  );
}
