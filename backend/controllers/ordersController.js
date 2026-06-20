import db from "../db.js";

/* PLACE ORDER */
export const placeOrder = async (req, res) => {
    const userId = req.user.id;
    const items = req.body;

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [orderResult] = await conn.execute(
            "INSERT INTO orders (user_id, status, created_at) VALUES (?, 'Placed', NOW())",
            [userId]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            await conn.execute(
                "INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.price]
            );

            await conn.execute(
                "UPDATE products SET quantity = quantity - ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

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
};

/* GET MY ORDERS */
export const getMyOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const [orders] = await db.execute(
            `SELECT id, status, created_at 
             FROM orders 
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        for (const order of orders) {
            const [items] = await db.execute(
                `SELECT oi.qty, oi.price, p.name
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (err) {
        console.error("GET ORDERS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
