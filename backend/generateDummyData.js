import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Expense from "./models/Expense.js";
import Budget from "./models/Budget.js";
import SplitExpense from "./models/SplitExpense.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smartt-expense";

const CATEGORIES = [
  "Food", "Transport", "Shopping", "Entertainment", "Bills", 
  "Health", "Education", "Groceries", "Travel", "Other"
];

const PAYMENT_METHODS = ["Cash", "UPI", "Credit Card", "Debit Card", "Bank Transfer"];
const TAGS = ["personal", "office", "urgent", "monthly", "subscription", "gift"];

const GOALS = [
  { goalName: "iPhone 16 Pro", targetAmount: 120000, icon: "📱", category: "Gadgets", priority: "High" },
  { goalName: "Europe Trip", targetAmount: 150000, icon: "✈️", category: "Travel", priority: "High" },
  { goalName: "Emergency Fund", targetAmount: 50000, icon: "🏦", category: "Savings", priority: "Medium" }
];

async function generateDummyData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find user by email
    const user = await User.findOne({ email: "abhishekpandey4517@gmail.com" });
    
    if (!user) {
      console.log("❌ User not found!");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);
    const userId = user._id;

    // Clear existing data for this user
    await Expense.deleteMany({ userId });
    await Budget.deleteMany({ userId });
    await SplitExpense.deleteMany({ userId });
    console.log("🗑️ Cleared existing data");

    // Generate expenses for Feb & March 2026
    const expenses = [];
    const months = [
      { month: 2, year: 2026, name: "February 2026" },
      { month: 3, year: 2026, name: "March 2026" }
    ];

    // Monthly budget amounts
    const febBudget = 45000;
    const marBudget = 52000;

    for (const m of months) {
      const daysInMonth = new Date(m.year, m.month, 0).getDate();
      const numExpenses = Math.floor(Math.random() * 15) + 20; // 20-35 expenses per month
      
      for (let i = 0; i < numExpenses; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const date = new Date(m.year, m.month - 1, day);
        
        expenses.push({
          amount: Math.floor(Math.random() * 3000) + 100,
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          date: date,
          paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
          description: `Expense for ${m.name}`,
          tags: [TAGS[Math.floor(Math.random() * TAGS.length)]],
          isShared: false,
          userId: userId
        });
      }
    }

    await Expense.insertMany(expenses);
    console.log(`✅ Created ${expenses.length} expenses`);

    // Create Budget for March 2026
    const budget = new Budget({
      userId: userId,
      month: 3,
      year: 2026,
      totalBudget: marBudget,
      passiveIncomes: [
        { _id: new mongoose.Types.ObjectId(), source: "Freelancing", amount: 8000, description: "Web development work", addedDate: new Date() },
        { _id: new mongoose.Types.ObjectId(), source: "Interest", amount: 1500, description: "FD interest", addedDate: new Date() }
      ],
      savingGoals: GOALS.map((g, idx) => ({
        _id: new mongoose.Types.ObjectId(),
        goalName: g.goalName,
        targetAmount: g.targetAmount,
        currentAmount: idx === 0 ? 15000 : idx === 1 ? 25000 : 5000,
        icon: g.icon,
        category: g.category,
        priority: g.priority,
        createdAt: new Date()
      }))
    });

    await budget.save();
    console.log("✅ Created Budget with saving goals");

    // Create some split expenses
    const splits = [
      {
        description: "Dinner at Restaurant",
        totalAmount: 2400,
        date: new Date(2026, 1, 15),
        paidBy: "Abhishek",
        participants: ["Abhishek", "Rahul", "Amit"],
        participantsData: [
          { name: "Abhishek", email: "abhishekpandey4517@gmail.com" },
          { name: "Rahul", email: "rahul@example.com" },
          { name: "Amit", email: "amit@example.com" }
        ],
        sharePerPerson: 800,
        userId: userId
      },
      {
        description: "Movie Tickets",
        totalAmount: 900,
        date: new Date(2026, 2, 10),
        paidBy: "Abhishek",
        participants: ["Abhishek", "Priya"],
        participantsData: [
          { name: "Abhishek", email: "abhishekpandey4517@gmail.com" },
          { name: "Priya", email: "priya@example.com" }
        ],
        sharePerPerson: 450,
        userId: userId
      },
      {
        description: "Groceries Split",
        totalAmount: 1500,
        date: new Date(2026, 2, 20),
        paidBy: "Abhishek",
        participants: ["Abhishek", "Mom"],
        participantsData: [
          { name: "Abhishek", email: "abhishekpandey4517@gmail.com" },
          { name: "Mom", email: "mom@example.com" }
        ],
        sharePerPerson: 750,
        userId: userId
      }
    ];

    await SplitExpense.insertMany(splits);
    console.log("✅ Created split expenses");

    // Update user streak data
    user.currentStreak = 12;
    user.maxStreak = 15;
    user.lastStreakUpdateDate = new Date();
    await user.save();
    console.log("✅ Updated user streak");

    console.log("\n🎉 Dummy data generation complete!");
    console.log(`📊 Expenses: ${expenses.length}`);
    console.log(`💰 Budget: ₹${marBudget}`);
    console.log(`🎯 Saving Goals: ${GOALS.length}`);
    console.log(`👥 Split Expenses: ${splits.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

generateDummyData();