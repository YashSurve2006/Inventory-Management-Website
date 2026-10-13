import express from "express";
import db from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// User administration is restricted to authenticated administrators.
router.use(auth, (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ success: false, message: "Administrator access required" });
    }
    next();
});

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, name, email, role, created_at FROM users");
        res.json(rows);
    } catch (err) {
        console.error("Failed to list users:", err);
        res.status(500).json({ success: false, message: "Unable to load users" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    if (id === Number(req.user.id)) {
        return res.status(400).json({ success: false, message: "You cannot delete your own account here" });
    }
    try {
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true });
    } catch (err) {
        console.error("Failed to delete user:", err);
        res.status(500).json({ success: false, message: "Unable to delete user" });
    }
});

router.put("/make-admin/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    try {
        const [result] = await db.execute("UPDATE users SET role = 'admin' WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true });
    } catch (err) {
        console.error("Failed to promote user:", err);
        res.status(500).json({ success: false, message: "Unable to update user role" });
    }
});

export default router;
