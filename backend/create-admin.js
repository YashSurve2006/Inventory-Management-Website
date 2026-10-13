import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "./db.js";

const createAdmin = async() => {
    const password = process.env.ADMIN_PASSWORD;
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!password || password.length < 12 || !email) {
        console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in backend/.env before creating an administrator.");
        process.exit(1);
    }
    try {
        const hashed = await bcrypt.hash(password, 12);

        await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", ["Admin", email, hashed, "admin"]
        );

        console.log("Admin user created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("ERROR CREATING ADMIN:", err);
        process.exit(1);
    }
};

createAdmin();