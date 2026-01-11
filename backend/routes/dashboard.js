import express from "express";
import db from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// DEFAULT ROUTE → redirects to summary
router.get("/", auth, async (req, res) => {
    try {
        const [[{ total_skus }]] = await db.execute(
            "SELECT COUNT(*) AS total_skus FROM products"
        );

        const [[{ stock_value }]] = await db.execute(
            "SELECT SUM(quantity * price) AS stock_value FROM products"
        );

        const [[{ low_stock }]] = await db.execute(
            "SELECT COUNT(*) AS low_stock FROM products WHERE quantity < 10"
        );

        res.json({
            total_skus,
            stock_value: stock_value || 0,
            low_stock
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ error: "Dashboard fetch failed" });
    }
});

// EXISTING SUMMARY ENDPOINT (kept untouched)
router.get("/summary", auth, async (req, res) => {
    try {
        const [[{ total_skus }]] = await db.execute(
            "SELECT COUNT(*) AS total_skus FROM products"
        );

        const [[{ stock_value }]] = await db.execute(
            "SELECT SUM(quantity * price) AS stock_value FROM products"
        );

        const [[{ low_stock }]] = await db.execute(
            "SELECT COUNT(*) AS low_stock FROM products WHERE quantity < 10"
        );

        res.json({
            total_skus,
            stock_value: stock_value || 0,
            low_stock
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ error: "Dashboard fetch failed" });
    }
});

export default router;
