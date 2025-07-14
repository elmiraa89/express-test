import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "./config/passport.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import userRouter from "./routes/user.js";

// Load .env variables
dotenv.config();

// --- Debug log untuk memastikan variabel lingkungan terbaca ---
console.log("Loaded Environment Variables:");
console.log("MONGODB_CONNECTION_STRING:", process.env.MONGODB_CONNECTION_STRING);
console.log("DATABASE_NAME:", process.env.DATABASE_NAME);
console.log("PORT:", process.env.PORT);

// --- Validasi environment variables ---
if (!process.env.MONGODB_CONNECTION_STRING || !process.env.DATABASE_NAME) {
  console.error("❌ Missing MongoDB environment variables.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// JWT Passport Middleware
app.use((req, res, next) => {
  if (!req.cookies["token"]) return next();
  passport.authenticate("jwt", { session: false })(req, res, next);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", userRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send({ message: "Welcome to Kada-ch2 API" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Internal error:", err);
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
