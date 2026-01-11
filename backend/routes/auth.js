import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* LOGIN */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1) Get user
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = rows[0];

        // 2) Clean password input (trim + zero-width removal)
        const cleanPassword = (password || "").trim().replace(/[\u200B-\u200D\uFEFF]/g, "");

        // 3) Compare using bcrypt.compare
        const match = await bcrypt.compare(cleanPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // 4) Create JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("🔥 LOGIN ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

/* REGISTER */
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Basic duplicate check
        const [exists] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (exists.length) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hash = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hash, role || "user"]
        );

        return res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("🔥 REGISTER ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
