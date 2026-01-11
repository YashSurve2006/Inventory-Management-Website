import pool from "./db.js";
import bcrypt from "bcryptjs";

const seed = async() => {
    try {
        console.log("🌱 Starting database seed...");

        // Clear existing data (optional)
        await pool.query("DELETE FROM transactions");
        await pool.query("DELETE FROM products");
        await pool.query("DELETE FROM suppliers");
        await pool.query("DELETE FROM users");

        console.log("🧹 Old data cleared.");

        // Hash passwords
        const adminPass = await bcrypt.hash("admin123", 10);
        const staffPass = await bcrypt.hash("staff123", 10);

        // Insert users
        await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES 
       ('Sample Admin', 'admin@sample.com', ?, 'admin'),
       ('Sample Staff', 'staff@sample.com', ?, 'user')`, [adminPass, staffPass]
        );

        console.log("👤 Sample users inserted.");

        // Insert suppliers
        await pool.query(
            `INSERT INTO suppliers (name, contact, address) VALUES
       ('Global Traders', '9876543210', 'Mumbai'),
       ('Prime Wholesale', '9876501234', 'Pune'),
       ('Sunrise Suppliers', '9123456789', 'Nashik')`
        );

        console.log("🏭 Sample suppliers inserted.");

        // Insert products
        await pool.query(
            `INSERT INTO products (sku, name, category, description, price, quantity, min_quantity, supplier_id) VALUES
       ('SKU-1001', 'Dell Laptop', 'Electronics', '14-inch i5', 55000, 25, 5, 1),
       ('SKU-1002', 'HP Laptop', 'Electronics', '15-inch Ryzen 5', 58000, 10, 5, 1),
       ('SKU-1003', 'Logitech Mouse', 'Accessories', 'Wireless mouse', 799, 60, 10, 2),
       ('SKU-1004', 'Mechanical Keyboard', 'Accessories', 'Red switches', 2200, 8, 5, 2),
       ('SKU-1005', 'USB Type-C Cable', 'Electronics', 'Fast charging cable', 299, 40, 10, 3)`
        );

        console.log("📦 Sample products inserted.");

        // Insert transactions
        await pool.query(
            `INSERT INTO transactions (product_id, type, quantity, user_id, note) VALUES
       (1, 'IN', 10, 1, 'New stock received'),
       (2, 'OUT', 4, 1, 'Sold to customer'),
       (3, 'IN', 20, 2, 'Warehouse restock'),
       (4, 'OUT', 3, 2, 'Retail order'),
       (5, 'OUT', 10, 1, 'Bulk sale')`
        );

        console.log("🔄 Sample transactions inserted.");

        console.log("✅ SEED COMPLETE!");
        process.exit();

    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
};

seed();