import express from "express";
import db from "../db.js";

const router = express.Router();

// get all users
router.get("/", async (req, res) => {
    const [rows] = await db.execute("SELECT id, name, email, role, created_at FROM users");
    res.json(rows);
});

// delete user
router.delete("/:id", async (req, res) => {
    await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});

// promote to admin
router.put("/make-admin/:id", async (req, res) => {
    await db.execute("UPDATE users SET role='admin' WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});

export default router;
