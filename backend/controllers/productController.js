import db from "../db.js";

// GET all products (User side)
export const getAllProducts = (req, res) => {
    const sql = "SELECT * FROM products ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(result);
    });
};

// GET single product by ID
export const getProductById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result[0]);
    });
};
