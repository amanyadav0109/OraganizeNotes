import dotenv from "dotenv";
dotenv.config();

import db from "../config/db.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    const [existing] = await db.promise().query(
      "SELECT id FROM admins WHERE email = ?",
      [ADMIN_EMAIL]
    );

    if (existing.length > 0) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.promise().query(
      `INSERT INTO admins (name, email, password, status)
       VALUES (?, ?, ?, 'active')`,
      [ADMIN_NAME, ADMIN_EMAIL, hashedPassword]
    );

    console.log("Admin account created successfully!");
    console.log("Admin email:", ADMIN_EMAIL);
  } catch (error) {
    console.error("ADMIN CREATION ERROR:", error.message);
    process.exitCode = 1;
  } finally {
    db.end();
  }
};

createAdmin();