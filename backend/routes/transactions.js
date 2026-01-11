// backend/routes/transactions.js
import express from "express";
import db from "../db.js"; // your pool.promise() export

const router = express.Router();

/**
 * Add transaction (IN / OUT)
 * body: { product_id, supplier_id, quantity, type }  type = "IN" | "OUT"
 *
 * This runs in a DB transaction:
 * 1. INSERT into transactions
 * 2. INSERT into inventory_logs
 * 3. UPDATE products.quantity (add/subtract)
 */
router.post("/add", async (req, res) => {
    const { product_id, supplier_id = null, quantity, type } = req.body;

    if (!product_id || !quantity || !type) {
        return res.status(400).json({ error: "product_id, quantity and type are required" });
    }

    const conn = await db.getConnection(); // get connection from pool
    try {
        await conn.beginTransaction();

        // 1) insert into transactions
        const [tResult] = await conn.execute(
            `INSERT INTO transactions (product_id, supplier_id, quantity, type) VALUES (?, ?, ?, ?)`,
            [product_id, supplier_id, quantity, type]
        );

        const transactionId = tResult.insertId;

        // 2) insert into inventory_logs
        const action = type === "IN" ? "Stock In" : "Stock Out";
        await conn.execute(
            `INSERT INTO inventory_logs (product_id, change_amount, action) VALUES (?, ?, ?)`,
            [product_id, (type === "IN" ? quantity : -quantity), action]
        );

        // 3) update product quantity
        if (type === "IN") {
            await conn.execute(`UPDATE products SET quantity = quantity + ? WHERE id = ?`, [quantity, product_id]);
        } else {
            // prevent negative stock — you can change this behavior as needed
            const [rows] = await conn.execute(`SELECT quantity FROM products WHERE id = ? FOR UPDATE`, [product_id]);
            if (!rows || rows.length === 0) {
                throw new Error("Product not found");
            }
            const currentQty = rows[0].quantity || 0;
            const newQty = currentQty - Number(quantity);
            if (newQty < 0) {
                // you can allow negative or prevent — currently we prevent
                throw new Error("Insufficient stock for OUT transaction");
            }
            await conn.execute(`UPDATE products SET quantity = ? WHERE id = ?`, [newQty, product_id]);
        }

        await conn.commit();

        // Return transaction with id
        res.json({ success: true, id: transactionId });
    } catch (err) {
        try {
            await conn.rollback();
        } catch (_) { }
        console.error("Transaction add error:", err);
        res.status(500).json({ error: err.message || "Server error" });
    } finally {
        conn.release();
    }
});

/**
 * Get transactions (joined with product and supplier names)
 */
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT 
        t.id, t.product_id, t.supplier_id, t.quantity, t.type, t.date,
        p.name as product_name,
        s.name as supplier_name
      FROM transactions t
      LEFT JOIN products p ON p.id = t.product_id
      LEFT JOIN suppliers s ON s.id = t.supplier_id
      ORDER BY t.date DESC, t.id DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error("Transactions fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
