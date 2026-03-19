import db from "../db.js";

/* =====================================================
   GET ALL PRODUCTS
===================================================== */
export const getAllProducts = (req, res) => {

    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Fetch Products Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
};


/* =====================================================
   GET PRODUCT BY ID
===================================================== */
export const getProductById = (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Fetch Product Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result[0]);
    });
};


/* =====================================================
   ADD PRODUCT
===================================================== */
export const addProduct = (req, res) => {

    const {
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

    const sql = `
        INSERT INTO products
        (name, category, brand, price, socket, ram_type, wattage, storage_type, size, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
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
    ],
        (err, result) => {

            if (err) {
                console.error("Add Product Error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            res.json({
                message: "Product added successfully",
                productId: result.insertId
            });
        });
};


/* =====================================================
   UPDATE PRODUCT
===================================================== */
export const updateProduct = async (req, res) => {

    const { id } = req.params;

    const {
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

        await db.execute(sql, [
            name,
            category,
            brand,
            price,
            socket,
            ram_type,
            wattage,
            storage_type,
            size,
            stock,
            id
        ]);

        res.json({ message: "Product updated successfully" });

    } catch (err) {

        console.error("UPDATE PRODUCT ERROR:", err);
        res.status(500).json({ error: err.message });

    }

};

/* =====================================================
   DELETE PRODUCT
===================================================== */
export const deleteProduct = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Delete Product Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
};