import express from "express";
import db from "../../db.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

/**
 * USER - VIEW PRODUCTS (READ ONLY)
 */
router.get("/", auth, async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT 
        id,
        name,
        category,
        price,
        quantity AS stock
      FROM products
      ORDER BY created_at DESC
    `);

        res.json(rows);
    } catch (err) {
        console.error("USER PRODUCTS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

export default router;
