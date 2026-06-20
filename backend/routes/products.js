import express from "express";
import db from "../db.js";

const router = express.Router();

/* =================================================
   ADD PRODUCT
================================================= */

router.post("/", async (req, res) => {

    let {
        name,
        category,
        brand,
        price,
        socket,
        ram_type,
        wattage,
        storage_type,
        size,
        stock
    } = req.body;

    try {

        const sql = `
      INSERT INTO products
      (name, category, brand, price, socket, ram_type, wattage, storage_type, size, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.execute(sql, [
            name ?? null,
            category ?? null,
            brand ?? null,
            price ?? 0,
            socket ?? null,
            ram_type ?? null,
            wattage ?? null,
            storage_type ?? null,
            size ?? null,
            stock ?? 0
        ]);

        res.json({
            success: true,
            message: "Product added successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error("ADD PRODUCT ERROR:", error);
        res.status(500).json({ error: error.message });

    }

});


/* =================================================
   GET ALL PRODUCTS
================================================= */

router.get("/", async (req, res) => {

    try {

        const [rows] = await db.execute(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.json(rows);

    } catch (error) {

        console.error("GET PRODUCTS ERROR:", error);
        res.status(500).json({ error: error.message });

    }

});


/* =================================================
   GET PRODUCT BY ID
================================================= */

router.get("/:id", async (req, res) => {

    try {

        const [rows] = await db.execute(
            "SELECT * FROM products WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error("GET PRODUCT ERROR:", error);
        res.status(500).json({ error: error.message });

    }

});


/* =================================================
   UPDATE PRODUCT
================================================= */

router.put("/:id", async (req, res) => {

    const { id } = req.params;

    let {
        name,
        category,
        brand,
        price,
        socket,
        ram_type,
        wattage,
        storage_type,
        size,
        stock
    } = req.body;

    try {

        const sql = `
      UPDATE products
      SET
        name = ?,
        category = ?,
        brand = ?,
        price = ?,
        socket = ?,
        ram_type = ?,
        wattage = ?,
        storage_type = ?,
        size = ?,
        stock = ?
      WHERE id = ?
    `;

        const [result] = await db.execute(sql, [
            name ?? null,
            category ?? null,
            brand ?? null,
            price ?? 0,
            socket ?? null,
            ram_type ?? null,
            wattage ?? null,
            storage_type ?? null,
            size ?? null,
            stock ?? 0,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {

        console.error("UPDATE PRODUCT ERROR:", error);
        res.status(500).json({ error: error.message });

    }

});


/* =================================================
   DELETE PRODUCT
================================================= */

router.delete("/:id", async (req, res) => {

    try {

        const [result] = await db.execute(
            "DELETE FROM products WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        console.error("DELETE PRODUCT ERROR:", error);
        res.status(500).json({ error: error.message });

    }

});

export default router;