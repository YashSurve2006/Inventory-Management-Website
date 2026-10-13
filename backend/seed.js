import "dotenv/config";
import pool from "./db.js";
import bcrypt from "bcryptjs";

const seed = async() => {
    if (process.env.NODE_ENV !== "development" || process.env.RESET_DEMO_DATA !== "true") {
        console.error("Refusing destructive seed: set NODE_ENV=development and RESET_DEMO_DATA=true only for a disposable development database.");
        process.exit(1);
    }
    const adminPassword = process.env.DEMO_ADMIN_PASSWORD;
    const staffPassword = process.env.DEMO_STAFF_PASSWORD;
    if (!adminPassword || !staffPassword) {
        console.error("Set DEMO_ADMIN_PASSWORD and DEMO_STAFF_PASSWORD in backend/.env before seeding.");
        process.exit(1);
    }
    try {
        console.log("🌱 Starting database seed...");

        // Clear existing data (optional)
        await pool.query("DELETE FROM pc_build_items");
        await pool.query("DELETE FROM pc_builds");
        await pool.query("DELETE FROM order_items");
        await pool.query("DELETE FROM orders");
        await pool.query("DELETE FROM cart");
        await pool.query("DELETE FROM inventory_logs");
        await pool.query("DELETE FROM transactions");
        await pool.query("DELETE FROM products");
        await pool.query("DELETE FROM suppliers");
        await pool.query("DELETE FROM users");

        // Reset IDs because demo transactions below intentionally reference the seeded rows.
        await pool.query("ALTER TABLE users AUTO_INCREMENT = 1");
        await pool.query("ALTER TABLE products AUTO_INCREMENT = 1");
        await pool.query("ALTER TABLE suppliers AUTO_INCREMENT = 1");
        await pool.query("ALTER TABLE transactions AUTO_INCREMENT = 1");
        await pool.query("ALTER TABLE inventory_logs AUTO_INCREMENT = 1");

        console.log("🧹 Old data cleared.");

        // Hash passwords
        const adminPass = await bcrypt.hash(adminPassword, 12);
        const staffPass = await bcrypt.hash(staffPassword, 12);

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
            `INSERT INTO products (sku, name, category, description, price, quantity, stock, min_quantity, supplier_id) VALUES
       ('SKU-1001', 'Dell Laptop', 'Electronics', '14-inch i5', 55000, 25, 25, 5, 1),
       ('SKU-1002', 'HP Laptop', 'Electronics', '15-inch Ryzen 5', 58000, 10, 10, 5, 1),
       ('SKU-1003', 'Logitech Mouse', 'Accessories', 'Wireless mouse', 799, 60, 60, 10, 2),
       ('SKU-1004', 'Mechanical Keyboard', 'Accessories', 'Red switches', 2200, 8, 8, 5, 2),
       ('SKU-1005', 'USB Type-C Cable', 'Electronics', 'Fast charging cable', 299, 40, 40, 10, 3)`
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