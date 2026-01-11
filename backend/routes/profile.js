import express from "express";
import db from "../db.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// --------------------
// File Storage (Avatar)
// --------------------
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, "avatar_" + Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage });

// --------------------
// GET USER PROFILE
// --------------------
router.get("/", auth, async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, name, email, role, phone, address, avatar FROM users WHERE id = ?",
            [req.user.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// --------------------
// UPDATE PROFILE
// --------------------
router.put("/", auth, async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        await db.execute(
            "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
            [name, phone, address, req.user.id]
        );

        res.json({ success: true, message: "Profile updated" });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// --------------------
// CHANGE PASSWORD
// --------------------
router.put("/password", auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const [rows] = await db.execute(
            "SELECT password FROM users WHERE id = ?",
            [req.user.id]
        );

        const bcrypt = (await import("bcryptjs")).default;

        const valid = await bcrypt.compare(currentPassword, rows[0].password);
        if (!valid) return res.status(400).json({ error: "Incorrect password" });

        const hash = await bcrypt.hash(newPassword, 10);

        await db.execute("UPDATE users SET password = ? WHERE id = ?", [
            hash,
            req.user.id,
        ]);

        res.json({ success: true, message: "Password changed" });
    } catch (err) {
        res.status(500).json({ error: "Password update failed" });
    }
});

// --------------------
// UPLOAD AVATAR
// --------------------
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
    try {
        await db.execute(
            "UPDATE users SET avatar = ? WHERE id = ?",
            [req.file.filename, req.user.id]
        );

        res.json({ success: true, avatar: req.file.filename });
    } catch (err) {
        res.status(500).json({ error: "Avatar upload failed" });
    }
});

export default router;
