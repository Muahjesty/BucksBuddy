import { db } from "../server/db";
import { users, balances, rewards, transactions, campusEvents } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CSVUser {
  user_id: string;
  name: string;
  major: string;
  class_year: string;
  residence_type: string;
  interests: string;
}

interface CSVTransaction {
  transaction_id: string;
  user_id: string;
  merchant: string;
  category: string;
  amount: string;
  payment_method: string;
  location: string;
  date: string;
}

interface CSVEvent {
  event_id: string;
  name: string;
  category: string;
  location: string;
  start_time: string;
  tags: string;
  cost: string;
}

function parseCSV<T>(filePath: string): T[] {
  const content = readFileSync(filePath, 'utf-8');
  const result = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  
  if (result.errors.length > 0) {
    console.error("CSV parsing errors:", result.errors);
  }
  
  return result.data;
}

function generateUsername(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}

async function importData() {
  console.log("Starting data import...");

  // Parse CSV files
  const csvUsers = parseCSV<CSVUser>(join(__dirname, '../attached_assets/users_sample_1763223970741.csv'));
  const csvTransactions = parseCSV<CSVTransaction>(join(__dirname, '../attached_assets/wallet_transactions_sample_1763223970740.csv'));
  const csvEvents = parseCSV<CSVEvent>(join(__dirname, '../attached_assets/campus_events_sample_1763223970735.csv'));

  console.log(`Parsed ${csvUsers.length} users, ${csvTransactions.length} transactions, ${csvEvents.length} events`);

  // Map to store CSV user_id to database UUID
  const userIdMap = new Map<string, string>();

  // Import users with default password
  console.log("\nImporting users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  for (const csvUser of csvUsers) {
    const username = generateUsername(csvUser.name);
    
    try {
      // Create user
      const [user] = await db.insert(users).values({
        username,
        password: hashedPassword,
      }).returning();

      userIdMap.set(csvUser.user_id, user.id);
      console.log(`  ✓ Created user: ${username} (${csvUser.name})`);

      // Create balance with varied starting amounts
      await db.insert(balances).values({
        userId: user.id,
        mealPlanBalance: Math.floor(Math.random() * 10) + 10, // 10-19 meals
        diningDollars: (Math.random() * 200 + 200).toFixed(2), // $200-$400
        campusCardBalance: (Math.random() * 100 + 100).toFixed(2), // $100-$200
      });

      // Create rewards
      await db.insert(rewards).values({
        userId: user.id,
        points: Math.floor(Math.random() * 500),
        level: Math.random() > 0.7 ? 'Silver' : 'Bronze',
      });
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        // User already exists, fetch their ID for transaction mapping
        const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (existingUser[0]) {
          userIdMap.set(csvUser.user_id, existingUser[0].id);
          console.log(`  ⚠ User ${username} already exists, using existing ID`);
        }
      } else {
        console.error(`  ✗ Error creating user ${username}:`, error.message);
      }
    }
  }

  // Import transactions
  console.log("\nImporting transactions...");
  for (const csvTx of csvTransactions) {
    const userId = userIdMap.get(csvTx.user_id);
    if (!userId) {
      console.log(`  ⚠ Skipping transaction ${csvTx.transaction_id}: user ${csvTx.user_id} not found`);
      continue;
    }

    // Map payment method to transaction type
    let type = 'debit';
    if (csvTx.payment_method === 'Meal Plan') {
      type = 'meal_plan';
    } else if (csvTx.payment_method === 'Dining Dollars') {
      type = 'dining_dollars';
    } else if (csvTx.payment_method === 'Campus Card') {
      type = 'campus_card';
    }

    try {
      await db.insert(transactions).values({
        userId,
        amount: csvTx.amount,
        category: csvTx.category,
        merchant: csvTx.merchant,
        description: csvTx.location,
        date: new Date(csvTx.date),
        type,
      });
      console.log(`  ✓ Created transaction: ${csvTx.merchant} ($${csvTx.amount})`);
    } catch (error: any) {
      console.error(`  ✗ Error creating transaction:`, error.message);
    }
  }

  // Import campus events
  console.log("\nImporting campus events...");
  
  // Manual events data since CSV has comma-separated tags which breaks parsing
  const eventsToImport = [
    { title: "Tech and Innovation Mixer", category: "Tech", location: "Business School Atrium", date: "2025-11-05 17:00", price: "0" },
    { title: "Career Networking Night", category: "Career", location: "Campus Center", date: "2025-11-06 18:00", price: "0" },
    { title: "Financial Wellness Workshop", category: "Finance", location: "Innovation Hub", date: "2025-11-07 16:00", price: "0" },
    { title: "HackFest Info Session", category: "Tech", location: "Innovation Hub", date: "2025-11-01 15:00", price: "0" },
    { title: "Study Skills Bootcamp", category: "Academic", location: "Library", date: "2025-11-08 11:00", price: "0" },
    { title: "Esports Tournament", category: "Sports", location: "Rec Center", date: "2025-11-09 19:00", price: "5" },
    { title: "Yoga and Mindfulness", category: "Wellness", location: "Rec Center", date: "2025-11-03 08:00", price: "0" },
    { title: "Cultural Night", category: "Cultural", location: "Campus Center", date: "2025-11-09 18:00", price: "0" },
    { title: "Women in Tech Panel", category: "Tech", location: "Business School Atrium", date: "2025-11-04 17:30", price: "0" },
    { title: "Entrepreneurship 101", category: "Career", location: "Innovation Hub", date: "2025-11-02 14:00", price: "0" },
    { title: "Resume and LinkedIn Clinic", category: "Career", location: "Campus Center", date: "2025-11-05 13:00", price: "0" },
    { title: "Music on the Green", category: "Social", location: "Quad", date: "2025-11-06 19:00", price: "0" },
    { title: "Campus Cleanup Day", category: "Community", location: "Quad", date: "2025-11-02 10:00", price: "0" },
    { title: "Intro to Personal Finance", category: "Finance", location: "Innovation Hub", date: "2025-11-03 16:00", price: "0" },
    { title: "Data Science Club Meetup", category: "Tech", location: "Innovation Hub", date: "2025-11-07 18:00", price: "0" },
    { title: "Movie Night", category: "Social", location: "Student Union", date: "2025-11-08 20:00", price: "0" },
    { title: "Leadership Workshop", category: "Academic", location: "Business School Atrium", date: "2025-11-01 12:00", price: "0" },
    { title: "Healthy Eating on a Budget", category: "Wellness", location: "Campus Center", date: "2025-11-04 12:30", price: "0" },
    { title: "Campus Job Fair", category: "Career", location: "Campus Center", date: "2025-11-09 13:00", price: "0" },
    { title: "Library Late Night Study", category: "Academic", location: "Library", date: "2025-11-10 21:00", price: "0" },
  ];
  
  // Load existing events to avoid duplicates
  const existingEvents = await db.select().from(campusEvents);
  const existingEventKeys = new Set(
    existingEvents.map(e => `${e.title}|${e.date.toISOString()}`)
  );
  
  for (const event of eventsToImport) {
    const eventDate = new Date(event.date);
    const eventKey = `${event.title}|${eventDate.toISOString()}`;
    
    if (existingEventKeys.has(eventKey)) {
      console.log(`  ⚠ Event "${event.title}" already exists, skipping...`);
      continue;
    }
    
    try {
      await db.insert(campusEvents).values({
        title: event.title,
        description: event.location,
        category: event.category,
        price: event.price,
        date: eventDate,
        imageUrl: null,
      });
      console.log(`  ✓ Created event: ${event.title}`);
    } catch (error: any) {
      console.error(`  ✗ Error creating event ${event.title}:`, error.message);
    }
  }

  console.log("\n✅ Data import completed!");
  console.log(`\nTest login credentials:`);
  console.log(`  Username: alexrivera`);
  console.log(`  Password: password123`);
  console.log(`\n(All imported users have the same password: password123)`);
  
  process.exit(0);
}

importData().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
