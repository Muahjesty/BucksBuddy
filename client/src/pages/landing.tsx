import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Target, Gift, Calendar, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Smart Campus Wallet
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate financial management platform for Rutgers University-Newark students. Track spending, manage budgets, and gain AI-powered insights.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6" 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover-elevate">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor your campus expenses across meal plans, dining dollars, and campus card purchases in one unified dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Smart Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set category-based budgets and get real-time alerts when you're approaching your limits. Stay on track effortlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Gift className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build spending streaks, unlock achievements, and earn points for smart financial habits. Make budgeting fun!
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Campus Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover free and paid events happening around campus. Never miss out on networking, workshops, or social activities.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get personalized spending recommendations and financial insights powered by AI to optimize your student budget.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your financial data is encrypted and secure. We never share your information with third parties.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Built for Rutgers University-Newark students 🔴
          </p>
        </div>
      </div>
    </div>
  );
}
