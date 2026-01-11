import db from "../db.js";

// ADD TO CART (ALREADY WORKING – KEEP)
export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const [exists] = await db.execute(
            "SELECT id FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (exists.length > 0) {
            await db.execute(
                "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?",
                [userId, productId]
            );
        } else {
            await db.execute(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)",
                [userId, productId]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error("ADD TO CART ERROR:", err);
        res.status(500).json({ error: "Failed to add to cart" });
    }
};

// GET CART
export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.execute(
            `SELECT 
                c.id,
                c.product_id,
                c.quantity,
                p.name,
                p.price
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );

        res.json(rows);
    } catch (err) {
        console.error("GET CART ERROR:", err);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
};

// UPDATE QUANTITY (+ / -)
export const updateCartQty = async (req, res) => {
    const userId = req.user.id;
    const { productId, delta } = req.body;

    try {
        await db.execute(
            "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
            [delta, userId, productId]
        );

        // Remove item if quantity <= 0
        await db.execute(
            "DELETE FROM cart WHERE quantity <= 0 AND user_id = ?",
            [userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("UPDATE CART ERROR:", err);
        res.status(500).json({ error: "Failed to update cart quantity" });
    }
};

// REMOVE ITEM COMPLETELY
export const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        await db.execute(
            "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("REMOVE CART ERROR:", err);
        res.status(500).json({ error: "Failed to remove item" });
    }
};
