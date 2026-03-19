import db from "../db.js";

/* =====================================================
   ADD TO CART
===================================================== */

export const addToCart = async (req, res) => {

    const userId = req.user?.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: "Product ID required" });
    }

    try {

        const [product] = await db.execute(
            "SELECT id, stock FROM products WHERE id = ?",
            [productId]
        );

        if (product.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product[0].stock <= 0) {
            return res.status(400).json({ error: "Product out of stock" });
        }

        const [exists] = await db.execute(
            "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (exists.length > 0) {

            await db.execute(
                `UPDATE cart
         SET quantity = quantity + 1
         WHERE user_id = ? AND product_id = ?`,
                [userId, productId]
            );

        } else {

            await db.execute(
                `INSERT INTO cart (user_id, product_id, quantity)
         VALUES (?, ?, 1)`,
                [userId, productId]
            );

        }

        res.json({
            success: true,
            message: "Item added to cart"
        });

    } catch (err) {

        console.error("ADD TO CART ERROR:", err);

        res.status(500).json({
            error: "Failed to add item to cart"
        });

    }

};



/* =====================================================
   GET USER CART
===================================================== */

export const getCart = async (req, res) => {

    const userId = req.user?.id;

    try {

        const [rows] = await db.execute(
            `SELECT
        c.id AS cart_id,
        c.product_id,
        c.quantity,
        p.name,
        p.price,
        p.category,
        (p.price * c.quantity) AS subtotal
      FROM cart c
      JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?
      ORDER BY c.id DESC`,
            [userId]
        );

        const subtotal = rows.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + tax;

        res.json({
            success: true,
            items: rows,
            subtotal,
            tax,
            total
        });

    } catch (err) {

        console.error("GET CART ERROR:", err);

        res.status(500).json({
            error: "Failed to fetch cart"
        });

    }

};



/* =====================================================
   UPDATE CART QUANTITY
===================================================== */

export const updateCartQty = async (req, res) => {

    const userId = req.user?.id;
    const { productId, delta } = req.body;

    if (!productId || delta === undefined) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {

        const [row] = await db.execute(
            "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (row.length === 0) {
            return res.status(404).json({ error: "Item not in cart" });
        }

        const newQty = row[0].quantity + delta;

        if (newQty <= 0) {

            await db.execute(
                "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
                [userId, productId]
            );

            return res.json({
                success: true,
                removed: true
            });

        }

        await db.execute(
            `UPDATE cart
       SET quantity = ?
       WHERE user_id = ? AND product_id = ?`,
            [newQty, userId, productId]
        );

        res.json({
            success: true,
            quantity: newQty
        });

    } catch (err) {

        console.error("UPDATE CART ERROR:", err);

        res.status(500).json({
            error: "Failed to update cart"
        });

    }

};



/* =====================================================
   REMOVE ITEM FROM CART
===================================================== */

export const removeFromCart = async (req, res) => {

    const userId = req.user?.id;
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).json({ error: "Product ID missing" });
    }

    try {

        const [result] = await db.execute(
            "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                error: "Item not found in cart"
            });

        }

        res.json({
            success: true,
            message: "Item removed from cart"
        });

    } catch (err) {

        console.error("REMOVE CART ERROR:", err);

        res.status(500).json({
            error: "Failed to remove item"
        });

    }

};



/* =====================================================
   CLEAR CART (after order)
===================================================== */

export const clearCart = async (req, res) => {

    const userId = req.user?.id;

    try {

        await db.execute(
            "DELETE FROM cart WHERE user_id = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "Cart cleared"
        });

    } catch (err) {

        console.error("CLEAR CART ERROR:", err);

        res.status(500).json({
            error: "Failed to clear cart"
        });

    }

};