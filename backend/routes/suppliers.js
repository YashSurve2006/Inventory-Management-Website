import express from "express";
import db from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth, (req, res, next) => {
    if (req.user?.role !== "admin") return res.status(403).json({ success: false, message: "Administrator access required" });
    next();
});

// Add supplier
router.post("/add", async (req, res) => {
    const { name, contact, address } = req.body;

    try {
        const [result] = await db.execute(
            "INSERT INTO suppliers (name, contact, address) VALUES (?, ?, ?)",
            [name, contact, address]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get suppliers
router.get("/", async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM suppliers");
    res.json(rows);
});

export default router;
