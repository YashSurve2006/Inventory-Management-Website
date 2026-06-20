import express from "express";
import db from "../../db.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

/**
 * USER – VIEW OWN PROFILE
 * GET /api/user/profile
 */
router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.execute(
            "SELECT id, name, email, phone, address, avatar, role FROM users WHERE id = ?",
            [userId]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error("USER PROFILE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
