import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/summary", async(req, res) => {
    try {
        const [totalProducts] = await pool.query(
            "SELECT COUNT(*) AS total FROM products"
        );

        const [totalStock] = await pool.query(
            "SELECT SUM(quantity) AS stock FROM products"
        );

        const [lowStock] = await pool.query(
            "SELECT id, name, quantity, min_quantity FROM products WHERE quantity <= min_quantity"
        );

        res.json({
            total_products: totalProducts[0].total,
            total_stock: totalStock[0].stock || 0,
            low_stock: lowStock,
        });

    } catch (err) {
        console.log("REPORT ERROR:", err);
        res.status(500).json({ message: "Report fetch failed" });
    }
});

export default router;