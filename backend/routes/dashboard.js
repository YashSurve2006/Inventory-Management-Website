import express from "express";
import db from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ======================================================
   DASHBOARD SUMMARY
====================================================== */

router.get("/summary", auth, async (req, res) => {

    try {

        const [[summary]] = await db.execute(`
      SELECT 
        COUNT(*) AS total_skus,
        IFNULL(SUM(stock * price),0) AS stock_value,
        SUM(CASE WHEN stock < 5 THEN 1 ELSE 0 END) AS low_stock
      FROM products
    `);

        res.json(summary);

    } catch (err) {

        console.error("SUMMARY ERROR:", err);
        res.status(500).json({ error: "Dashboard summary failed" });

    }

});


/* ======================================================
   LOW STOCK PRODUCTS
====================================================== */

router.get("/low-stock", auth, async (req, res) => {

    try {

        const [rows] = await db.execute(`
      SELECT id, name, stock
      FROM products
      WHERE stock < 5
      ORDER BY stock ASC
      LIMIT 10
    `);

        res.json(rows);

    } catch (err) {

        console.error("LOW STOCK ERROR:", err);
        res.status(500).json({ error: "Low stock fetch failed" });

    }

});


/* ======================================================
   CATEGORY STOCK BREAKDOWN
====================================================== */

router.get("/category-stock", auth, async (req, res) => {

    try {

        const [rows] = await db.execute(`
      SELECT category, SUM(stock) AS stock
      FROM products
      GROUP BY category
      ORDER BY stock DESC
    `);

        res.json(rows);

    } catch (err) {

        console.error("CATEGORY STOCK ERROR:", err);
        res.status(500).json({ error: "Category stock fetch failed" });

    }

});


/* ======================================================
   TOP PRODUCTS
====================================================== */

router.get("/top-products", auth, async (req, res) => {

    try {

        const [rows] = await db.execute(`
      SELECT name, stock AS total_sold
      FROM products
      ORDER BY stock DESC
      LIMIT 5
    `);

        res.json(rows);

    } catch (err) {

        console.error("TOP PRODUCTS ERROR:", err);
        res.status(500).json({ error: "Top products fetch failed" });

    }

});


/* ======================================================
   MONTHLY SALES (demo data for now)
====================================================== */

router.get("/monthly-sales", auth, async (req, res) => {

    try {

        const data = [
            { month: "Jan", revenue: 12000, orders: 80 },
            { month: "Feb", revenue: 15000, orders: 95 },
            { month: "Mar", revenue: 18000, orders: 110 },
            { month: "Apr", revenue: 21000, orders: 130 },
            { month: "May", revenue: 24000, orders: 160 },
            { month: "Jun", revenue: 26000, orders: 175 }
        ];

        res.json(data);

    } catch (err) {

        console.error("MONTHLY SALES ERROR:", err);
        res.status(500).json({ error: "Monthly sales fetch failed" });

    }

});


/* ======================================================
   RECENT ACTIVITY
====================================================== */

router.get("/recent-activity", auth, async (req, res) => {

    try {

        const [rows] = await db.execute(`
      SELECT p.name, t.quantity, t.type, t.date
      FROM transactions t
      JOIN products p ON p.id = t.product_id
      ORDER BY t.date DESC
      LIMIT 10
    `);

        res.json(rows);

    } catch (err) {

        console.error("RECENT ACTIVITY ERROR:", err);
        res.status(500).json({ error: "Recent activity fetch failed" });

    }

});


export default router;