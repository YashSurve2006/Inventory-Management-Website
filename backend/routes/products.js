import express from "express";
import db from "../db.js";   // ✔ using db.execute everywhere

const router = express.Router();

/* ================================
   ADD PRODUCT
================================ */
router.post("/add", async (req, res) => {
    const { name, category, quantity, price, min_quantity } = req.body;

    try {
        const [result] = await db.execute(
            "INSERT INTO products (name, category, quantity, price, min_quantity) VALUES (?, ?, ?, ?, ?)",
            [name, category, quantity, price, min_quantity || 10]
        );

        res.json({ success: true, message: "Product added", id: result.insertId });

    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/* ================================
   GET ALL PRODUCTS
================================ */
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM products ORDER BY id DESC");
        res.json(rows);

    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

/* ================================
   DELETE PRODUCT
================================ */
router.delete("/:id", async (req, res) => {
    try {
        await db.execute("DELETE FROM products WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: "Product deleted" });

    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

/* ================================
   UPDATE PRODUCT
================================ */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, price, min_quantity } = req.body;

    try {
        const sql = `
            UPDATE products 
            SET name = ?, category = ?, quantity = ?, price = ?, min_quantity = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(sql, [
            name,
            category,
            quantity,
            price,
            min_quantity || 10,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ success: true, message: "Product updated successfully" });

    } catch (err) {
        console.error("🔥 UPDATE PRODUCT ERROR:", err);
        res.status(500).json({ error: "Update failed", details: err.message });
    }
});

export default router;
