import bcrypt from "bcryptjs";
import pool from "./db.js";

const createAdmin = async() => {
    try {
        const hashed = await bcrypt.hash("admin123", 10);

        await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", ["Admin", "admin@local", hashed, "admin"]
        );

        console.log("Admin user created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("ERROR CREATING ADMIN:", err);
        process.exit(1);
    }
};

createAdmin();