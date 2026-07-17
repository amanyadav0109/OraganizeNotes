import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";

import "./jobs/reminderJob.js";
import cron from "node-cron";
import { checkReminders } from "./services/reminderService.js";

const app = express();

app.use(
  cors({
    origin: "https://orgnize-notes.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reminders", reminderRoutes);

app.get("/", (req, res) => {
  res.send("FocusNotes Backend Running");
});

// sendTestMail();

cron.schedule("* * * * *", () => {
  console.log("Running reminder cron...");
  checkReminders();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started On ${PORT}`);
});