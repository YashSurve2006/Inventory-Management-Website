import express from "express";
import db from "../db.js";

const router = express.Router();

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
