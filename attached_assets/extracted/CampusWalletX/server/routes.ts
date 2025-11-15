import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema, insertCampusEventSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    next();
  };

  // Initialize user data when they first register
  async function initializeUserData(userId: string) {
    try {
      await storage.createBalance(userId);
      await storage.createRewards(userId);
      await storage.updateRewards(userId, {
        points: 0,
        level: "Bronze",
        achievements: []
      });
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  }

  // Initialize campus events on startup (shared across all users)
  async function initializeCampusEvents() {
    try {
      const events = await storage.getCampusEvents(1);
      if (events.length === 0) {
        await storage.createCampusEvent({
          title: "Late Night Dining",
          description: "Extended dining hours at Student Union",
          category: "Dining",
          price: "8.50",
          date: new Date(Date.now() + 86400000),
          imageUrl: "/campus-dining.jpg"
        });
        await storage.createCampusEvent({
          title: "Spring Festival",
          description: "Annual campus spring celebration",
          category: "Events",
          price: "15.00",
          date: new Date(Date.now() + 172800000),
          imageUrl: "/campus-festival.jpg"
        });
        await storage.createCampusEvent({
          title: "Study Group Session",
          description: "Peer-led study session",
          category: "Wellness",
          price: "5.00",
          date: new Date(Date.now() + 259200000),
          imageUrl: "/study-session.jpg"
        });
      }
    } catch (error) {
      console.error("Error initializing campus events:", error);
    }
  }

  // Initialize campus events on startup
  initializeCampusEvents();

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });
      
      await initializeUserData(user.id);
      
      req.session.userId = user.id;
      
      // Explicitly save the session before responding
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        res.json({ id: user.id, username: user.username });
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      req.session.userId = user.id;
      
      // Explicitly save the session before responding
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        res.json({ id: user.id, username: user.username });
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    storage.getUser(req.session.userId).then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id: user.id, username: user.username });
    }).catch(error => {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    });
  });

  // GET /api/balance - Get user's balance
  app.get("/api/balance", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const balance = await storage.getBalance(userId);
      if (!balance) {
        return res.status(404).json({ error: "Balance not found" });
      }
      res.json(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  // POST /api/balance - Update balance
  app.post("/api/balance", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const updates = req.body;
      const balance = await storage.updateBalance(userId, updates);
      res.json(balance);
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ error: "Failed to update balance" });
    }
  });

  // POST /api/balance/spend - Spend money from a specific balance
  app.post("/api/balance/spend", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { amount, category, merchant, description, paymentMethod } = req.body;

      if (!amount || !category || !merchant || !paymentMethod) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const amountNum = typeof amount === 'number' ? amount : parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const balance = await storage.getBalance(userId);
      if (!balance) {
        return res.status(404).json({ error: "Balance not found" });
      }

      // Check if user has sufficient balance
      let currentBalance = 0;
      let balanceUpdate: Partial<typeof balance> = {};

      if (paymentMethod === "meal_plan") {
        currentBalance = balance.mealPlanBalance;
        if (currentBalance < 1) {
          return res.status(400).json({ error: "Insufficient meal plan balance" });
        }
        balanceUpdate.mealPlanBalance = currentBalance - 1;
      } else if (paymentMethod === "dining_dollars") {
        currentBalance = parseFloat(balance.diningDollars);
        if (currentBalance < amountNum) {
          return res.status(400).json({ error: "Insufficient dining dollars" });
        }
        balanceUpdate.diningDollars = (currentBalance - amountNum).toFixed(2);
      } else if (paymentMethod === "campus_card") {
        currentBalance = parseFloat(balance.campusCardBalance);
        if (currentBalance < amountNum) {
          return res.status(400).json({ error: "Insufficient campus card balance" });
        }
        balanceUpdate.campusCardBalance = (currentBalance - amountNum).toFixed(2);
      } else {
        return res.status(400).json({ error: "Invalid payment method" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        userId,
        amount: amountNum.toFixed(2),
        category,
        merchant,
        description: description || `Purchase at ${merchant}`,
        type: "debit",
        paymentMethod,
      });

      // Update balance
      await storage.updateBalance(userId, balanceUpdate);

      // Update budget
      const budgets = await storage.getBudgets(userId);
      const categoryBudget = budgets.find(b => b.category === category);
      if (categoryBudget) {
        const currentSpent = parseFloat(categoryBudget.spent);
        const newSpent = (currentSpent + amountNum).toFixed(2);
        await storage.updateBudget(categoryBudget.id, { spent: newSpent });
      }

      res.json({ transaction, balance: await storage.getBalance(userId) });
    } catch (error) {
      console.error("Error processing spend:", error);
      res.status(500).json({ error: "Failed to process spend" });
    }
  });

  // POST /api/balance/add-funds - Add funds to a specific balance
  app.post("/api/balance/add-funds", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { amount, balanceType } = req.body;

      if (!amount || !balanceType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const amountNum = typeof amount === 'number' ? amount : parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const balance = await storage.getBalance(userId);
      if (!balance) {
        return res.status(404).json({ error: "Balance not found" });
      }

      let balanceUpdate: Partial<typeof balance> = {};
      let paymentMethod = "";

      if (balanceType === "meal_plan") {
        const meals = Math.floor(amountNum);
        balanceUpdate.mealPlanBalance = balance.mealPlanBalance + meals;
        paymentMethod = "meal_plan";
      } else if (balanceType === "dining_dollars") {
        const current = parseFloat(balance.diningDollars);
        balanceUpdate.diningDollars = (current + amountNum).toFixed(2);
        paymentMethod = "dining_dollars";
      } else if (balanceType === "campus_card") {
        const current = parseFloat(balance.campusCardBalance);
        balanceUpdate.campusCardBalance = (current + amountNum).toFixed(2);
        paymentMethod = "campus_card";
      } else {
        return res.status(400).json({ error: "Invalid balance type" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        userId,
        amount: amountNum.toFixed(2),
        category: "Add Funds",
        merchant: "Campus Wallet",
        description: `Added funds to ${balanceType.replace('_', ' ')}`,
        type: "credit",
        paymentMethod,
      });

      // Update balance
      await storage.updateBalance(userId, balanceUpdate);

      res.json({ transaction, balance: await storage.getBalance(userId) });
    } catch (error) {
      console.error("Error adding funds:", error);
      res.status(500).json({ error: "Failed to add funds" });
    }
  });

  // GET /api/transactions - Get all transactions
  app.get("/api/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const category = req.query.category as string | undefined;
      
      let transactions;
      if (category && category !== "All") {
        transactions = await storage.getTransactionsByCategory(userId, category);
      } else {
        transactions = await storage.getTransactions(userId, limit);
      }
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // POST /api/transactions - Create a new transaction
  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId
      });
      
      const transaction = await storage.createTransaction(validatedData);
      
      // Update budget spent amount
      const budgets = await storage.getBudgets(userId);
      const categoryBudget = budgets.find(b => b.category === validatedData.category);
      
      if (categoryBudget) {
        const currentSpent = parseFloat(categoryBudget.spent);
        const transactionAmount = Math.abs(parseFloat(validatedData.amount));
        const newSpent = (currentSpent + transactionAmount).toFixed(2);
        
        await storage.updateBudget(categoryBudget.id, { spent: newSpent });
      }
      
      // Update balance based on transaction type
      const balance = await storage.getBalance(userId);
      if (balance) {
        const amount = parseFloat(validatedData.amount);
        
        if (validatedData.type === "debit") {
          // Deduct from campus card balance
          const newBalance = (parseFloat(balance.campusCardBalance) + amount).toFixed(2);
          await storage.updateBalance(userId, { campusCardBalance: newBalance });
        } else {
          // Add to campus card balance
          const newBalance = (parseFloat(balance.campusCardBalance) + Math.abs(amount)).toFixed(2);
          await storage.updateBalance(userId, { campusCardBalance: newBalance });
        }
      }
      
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // GET /api/budgets - Get all budgets
  app.get("/api/budgets", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const budgets = await storage.getBudgets(userId);
      res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  // POST /api/budgets - Create a new budget
  app.post("/api/budgets", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const validatedData = insertBudgetSchema.parse({
        ...req.body,
        userId
      });
      
      const budget = await storage.createBudget(validatedData);
      res.json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid budget data", details: error.errors });
      }
      console.error("Error creating budget:", error);
      res.status(500).json({ error: "Failed to create budget" });
    }
  });

  // PATCH /api/budgets/:id - Update a budget
  app.patch("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const budget = await storage.updateBudget(id, updates);
      res.json(budget);
    } catch (error) {
      console.error("Error updating budget:", error);
      res.status(500).json({ error: "Failed to update budget" });
    }
  });

  // DELETE /api/budgets/:id - Delete a budget
  app.delete("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBudget(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({ error: "Failed to delete budget" });
    }
  });

  // GET /api/rewards - Get user's rewards
  app.get("/api/rewards", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const rewards = await storage.getRewards(userId);
      if (!rewards) {
        return res.status(404).json({ error: "Rewards not found" });
      }
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  // POST /api/rewards - Update rewards
  app.post("/api/rewards", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const updates = req.body;
      const rewards = await storage.updateRewards(userId, updates);
      res.json(rewards);
    } catch (error) {
      console.error("Error updating rewards:", error);
      res.status(500).json({ error: "Failed to update rewards" });
    }
  });

  // GET /api/events - Get campus events
  app.get("/api/events", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      let events;
      if (category) {
        events = await storage.getCampusEventsByCategory(category);
      } else {
        events = await storage.getCampusEvents(limit);
      }
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // POST /api/events/pay - Pay for an event
  app.post("/api/events/pay", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { eventId, eventTitle, amount, category } = req.body;
      
      // Validate required fields
      if (!eventTitle) {
        return res.status(400).json({ error: "Missing required field: eventTitle" });
      }
      
      if (amount === undefined || amount === null) {
        return res.status(400).json({ error: "Missing required field: amount" });
      }
      
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount < 0) {
        return res.status(400).json({ error: "Invalid amount: must be a non-negative number" });
      }
      
      // Event payments always count against the Events budget
      const eventCategory = "Events";
      
      // Check if user has sufficient balance
      const balance = await storage.getBalance(userId);
      if (!balance) {
        return res.status(404).json({ error: "Balance not found" });
      }
      
      const currentBalance = parseFloat(balance.campusCardBalance);
      if (currentBalance < numericAmount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Process payment atomically with error handling
      let transaction;
      let updatedBalance;
      let updatedBudget;
      let updatedRewards;
      
      try {
        // 1. Create transaction record
        transaction = await storage.createTransaction({
          userId,
          amount: `-${numericAmount.toFixed(2)}`,
          category: eventCategory,
          merchant: eventTitle,
          description: "Event payment",
          type: "debit"
        });
        
        // 2. Update balance
        const newBalance = (currentBalance - numericAmount).toFixed(2);
        updatedBalance = await storage.updateBalance(userId, { campusCardBalance: newBalance });
        
        // 3. Update budget spent amount
        const budgets = await storage.getBudgets(userId);
        const categoryBudget = budgets.find(b => b.category === eventCategory);
        
        if (categoryBudget) {
          const currentSpent = parseFloat(categoryBudget.spent);
          const newSpent = (currentSpent + numericAmount).toFixed(2);
          updatedBudget = await storage.updateBudget(categoryBudget.id, { spent: newSpent });
        }
        
        // 4. Award points for event attendance
        const rewards = await storage.getRewards(userId);
        if (rewards) {
          updatedRewards = await storage.updateRewards(userId, {
            points: rewards.points + 50
          });
        }
        
        res.json({ 
          success: true, 
          transaction,
          newBalance: updatedBalance.campusCardBalance,
          pointsEarned: 50
        });
      } catch (updateError) {
        // If any update fails, log the error and return failure
        // In production, this would need proper transaction rollback
        console.error("Error during payment processing:", updateError);
        return res.status(500).json({ 
          error: "Payment processing failed. Please contact support if your balance was affected.",
          details: updateError instanceof Error ? updateError.message : "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // POST /api/ai/insights - Get AI insights (placeholder for now)
  app.post("/api/ai/insights", requireAuth, async (req, res) => {
    try {
      // For now, return mock insights
      // TODO: Integrate with OpenAI API
      const insights = [
        {
          type: "success",
          title: "Great Progress!",
          message: "You've reduced dining spending by 15% this month compared to last month."
        },
        {
          type: "tip",
          title: "Smart Tip",
          message: "Consider using meal plan more often to save $40/month on dining expenses."
        },
        {
          type: "warning",
          title: "Watch Out",
          message: "Shopping budget is 20% over limit. Consider cutting back this week."
        }
      ];
      
      res.json({ insights });
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // POST /api/ai/chat - Chat with AI assistant (placeholder for now)
  app.post("/api/ai/chat", requireAuth, async (req, res) => {
    try {
      const { message } = req.body;
      
      // For now, return a mock response
      // TODO: Integrate with OpenAI API
      const response = {
        message: "I've analyzed your spending patterns. You're doing great with staying under budget in most categories! Consider reducing dining expenses by $20/week to reach your savings goal faster."
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // GET /api/analytics/spending - Get spending analytics
  app.get("/api/analytics/spending", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { period } = req.query; // 'week' or 'month'
      
      const now = new Date();
      const startDate = period === 'week' 
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const transactions = await storage.getTransactionsByDateRange(userId, startDate, now);
      
      // Calculate spending by category
      const categorySpending: Record<string, number> = {};
      transactions.forEach(tx => {
        if (tx.type === "debit") {
          const amount = Math.abs(parseFloat(tx.amount));
          categorySpending[tx.category] = (categorySpending[tx.category] || 0) + amount;
        }
      });
      
      res.json({ categorySpending, transactions });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Tap & Pay Routes
  
  // POST /api/tap/create - Create a new tap session for QR payment
  app.post("/api/tap/create", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { balanceSource, amountCap } = req.body;
      
      if (!balanceSource || !amountCap) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Import token utilities
      const { generateTapToken } = await import('./utils/tap-tokens');
      
      // Create tap session that expires in 60 seconds
      const expiresAt = new Date(Date.now() + 60000);
      
      // Generate signed token with HMAC
      const token = generateTapToken({
        userId,
        balanceSource,
        amountCap: parseFloat(amountCap),
        expiresAt: expiresAt.getTime()
      });
      
      const result = await storage.db.query(
        `INSERT INTO tap_sessions (user_id, token, balance_source, amount_cap, expires_at)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, token, balanceSource, amountCap, expiresAt]
      );
      
      const session = result.rows[0];
      
      res.json({
        sessionId: session.id,
        token: session.token,
        expiresAt: session.expires_at,
        balanceSource: session.balance_source,
        amountCap: session.amount_cap
      });
    } catch (error) {
      console.error("Error creating tap session:", error);
      res.status(500).json({ error: "Failed to create tap session" });
    }
  });

  // POST /api/tap/authorize - Authorize and capture payment (used by merchant terminals)
  app.post("/api/tap/authorize", async (req, res) => {
    try {
      const { token, amount, merchantName, category, terminalApiKey } = req.body;
      
      if (!token || !amount || !merchantName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Import token utilities
      const { verifyTapToken, isValidMerchantApiKey } = await import('./utils/tap-tokens');

      // Verify terminal API key
      if (!terminalApiKey || !isValidMerchantApiKey(terminalApiKey)) {
        return res.status(401).json({ error: "Invalid terminal credentials" });
      }

      // Verify and decode token (checks signature and token expiry)
      let payload;
      try {
        payload = verifyTapToken(token);
      } catch (error: any) {
        return res.status(400).json({ error: error.message || "Invalid token" });
      }
      
      // Get tap session from database (must exist and match payload)
      const sessionResult = await storage.db.query(
        `SELECT * FROM tap_sessions WHERE token = $1`,
        [token]
      );
      
      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const session = sessionResult.rows[0];
      
      // CRITICAL: Check session expiry in database (defense in depth)
      if (new Date() > new Date(session.expires_at)) {
        // Mark as expired
        await storage.db.query(
          `UPDATE tap_sessions SET status = 'expired' WHERE id = $1`,
          [session.id]
        );
        return res.status(400).json({ error: "Session expired" });
      }
      
      // CRITICAL: Validate session matches payload (prevent forgery)
      if (session.user_id !== payload.userId) {
        return res.status(403).json({ error: "Session user mismatch" });
      }
      
      if (session.balance_source !== payload.balanceSource) {
        return res.status(403).json({ error: "Session balance source mismatch" });
      }
      
      if (parseFloat(session.amount_cap) !== payload.amountCap) {
        return res.status(403).json({ error: "Session amount cap mismatch" });
      }
      
      // Check if already used
      if (session.status !== 'pending') {
        return res.status(400).json({ error: "Session already used" });
      }
      
      // Validate amount against session cap (not just payload)
      if (parseFloat(amount) > parseFloat(session.amount_cap)) {
        return res.status(400).json({ error: "Amount exceeds session cap" });
      }
      
      // Process payment - use session data (trusted), not payload
      const userId = session.user_id;
      const balanceSource = session.balance_source;
      const balance = await storage.getBalance(userId);
      
      let success = false;
      
      // Deduct from appropriate balance (use session data, not payload)
      if (balanceSource === 'meal_plan') {
        if (balance.mealPlanBalance >= 1) {
          await storage.updateBalance(userId, {
            mealPlanBalance: balance.mealPlanBalance - 1,
            diningDollars: balance.diningDollars,
            campusCardBalance: balance.campusCardBalance
          });
          success = true;
        }
      } else if (balanceSource === 'dining_dollars') {
        if (parseFloat(balance.diningDollars) >= parseFloat(amount)) {
          await storage.updateBalance(userId, {
            mealPlanBalance: balance.mealPlanBalance,
            diningDollars: (parseFloat(balance.diningDollars) - parseFloat(amount)).toFixed(2),
            campusCardBalance: balance.campusCardBalance
          });
          success = true;
        }
      } else if (balanceSource === 'campus_card') {
        if (parseFloat(balance.campusCardBalance) >= parseFloat(amount)) {
          await storage.updateBalance(userId, {
            mealPlanBalance: balance.mealPlanBalance,
            diningDollars: balance.diningDollars,
            campusCardBalance: (parseFloat(balance.campusCardBalance) - parseFloat(amount)).toFixed(2)
          });
          success = true;
        }
      }
      
      if (success) {
        // Mark session as captured
        await storage.db.query(
          `UPDATE tap_sessions SET status = 'captured' WHERE id = $1`,
          [session.id]
        );
        
        // Create transaction record
        await storage.createTransaction({
          userId,
          amount: amount.toString(),
          category: category || 'Dining',
          merchant: merchantName,
          description: `Tap & Pay: ${merchantName}`,
          type: 'debit',
          paymentMethod: balanceSource,
          tapSessionId: session.id,
          terminalId: undefined,
          verificationCode: undefined
        });
        
        // Award rewards
        const rewards = await storage.getRewards(userId);
        await storage.updateRewards(userId, {
          points: rewards.points + 10,
          level: rewards.level,
          achievements: rewards.achievements
        });
        
        res.json({ success: true, message: "Payment successful" });
      } else {
        res.status(400).json({ error: "Insufficient balance" });
      }
      
    } catch (error) {
      console.error("Error authorizing tap payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // GET /api/tap/session/:token - Get tap session status
  app.get("/api/tap/session/:token", requireAuth, async (req, res) => {
    try {
      const { token } = req.params;
      
      const result = await storage.db.query(
        `SELECT id, user_id, balance_source, amount_cap, status, expires_at, created_at 
         FROM tap_sessions WHERE token = $1`,
        [token]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching tap session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Web Scraper Routes
  
  // POST /api/scraper/run - Manually trigger scraper
  app.post("/api/scraper/run", requireAuth, async (req, res) => {
    try {
      const { scrapeDiningMenus } = await import('./scrapers/dining-scraper');
      
      // Create or get default merchant source
      const sourceResult = await storage.db.query(
        `INSERT INTO merchant_sources (source_name, source_url, source_type)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        ['Rutgers Dining', 'https://dining.rutgers.edu', 'dining_menu']
      );
      
      let sourceId: string;
      if (sourceResult.rows.length > 0) {
        sourceId = sourceResult.rows[0].id;
      } else {
        const existingSource = await storage.db.query(
          `SELECT id FROM merchant_sources WHERE source_name = $1`,
          ['Rutgers Dining']
        );
        sourceId = existingSource.rows[0].id;
      }
      
      // Run scraper
      const items = await scrapeDiningMenus(storage.db, sourceId);
      
      res.json({ 
        success: true, 
        itemsScraped: items.length,
        message: `Successfully scraped ${items.length} menu items`
      });
    } catch (error) {
      console.error("Error running scraper:", error);
      res.status(500).json({ error: "Failed to run scraper" });
    }
  });

  // GET /api/menu/items - Get scraped menu items
  app.get("/api/menu/items", requireAuth, async (req, res) => {
    try {
      const { merchant, category, limit = 20 } = req.query;
      
      let query = `SELECT * FROM scraped_items WHERE 1=1`;
      const params: any[] = [];
      
      if (merchant) {
        params.push(merchant);
        query += ` AND merchant_name = $${params.length}`;
      }
      
      if (category) {
        params.push(category);
        query += ` AND item_category = $${params.length}`;
      }
      
      query += ` ORDER BY scraped_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);
      
      const result = await storage.db.query(query, params);
      
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
