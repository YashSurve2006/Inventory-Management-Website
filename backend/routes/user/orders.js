import express from "express";
import db from "../../db.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

/**
 * PLACE ORDER (FROM CART)
 * POST /api/user/orders/place
 */
router.post("/place", auth, async (req, res) => {
    const userId = req.user.id;
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // 1️⃣ Fetch cart items
        const [cartItems] = await conn.execute(
            `SELECT c.product_id, c.quantity, p.price
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 2️⃣ Calculate total
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // 3️⃣ Create order
        const [orderResult] = await conn.execute(
            `INSERT INTO orders (user_id, total_amount, status, created_at)
             VALUES (?, ?, 'Pending', NOW())`,
            [userId, totalAmount]
        );

        const orderId = orderResult.insertId;

        // 4️⃣ Insert order items + reduce stock
        for (const item of cartItems) {
            await conn.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );

            await conn.execute(
                `UPDATE products
                 SET quantity = quantity - ?
                 WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // 5️⃣ Clear cart
        await conn.execute(
            "DELETE FROM cart WHERE user_id = ?",
            [userId]
        );

        await conn.commit();
        res.json({ success: true, orderId });
    } catch (err) {
        await conn.rollback();
        console.error("PLACE ORDER ERROR:", err);
        res.status(500).json({ error: "Order failed" });
    } finally {
        conn.release();
    }
});

/**
 * GET MY ORDERS
 * GET /api/user/orders/my
 */
router.get("/my", auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const [orders] = await db.execute(
            `SELECT id, total_amount, status, created_at
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        for (const order of orders) {
            const [items] = await db.execute(
                `SELECT p.name, oi.quantity, oi.price
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (err) {
        console.error("FETCH ORDERS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

/**
 * CANCEL ORDER (ONLY PENDING)
 * DELETE /api/user/orders/:id
 */
router.delete("/:id", auth, async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    try {
        const [result] = await db.execute(
            `DELETE FROM orders
             WHERE id = ? AND user_id = ? AND status = 'Pending'`,
            [orderId, userId]
        );

        if (result.affectedRows === 0) {
            return res
                .status(400)
                .json({ message: "Order cannot be cancelled" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("CANCEL ORDER ERROR:", err);
        res.status(500).json({ error: "Failed to cancel order" });
    }
});

export default router;
