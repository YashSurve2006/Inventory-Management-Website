import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {

    try {

        /* ---------------- GET TOKEN ---------------- */

        let token = null;

        const authHeader =
            req.headers.authorization ||
            req.headers.Authorization;

        // Authorization: Bearer <token>
        if (authHeader && authHeader.startsWith("Bearer ")) {

            token = authHeader.split(" ")[1];

        }

        // x-access-token header
        if (!token && req.headers["x-access-token"]) {

            token = req.headers["x-access-token"];

        }

        // cookie token (optional support)
        if (!token && req.cookies?.token) {

            token = req.cookies.token;

        }

        /* ---------------- NO TOKEN ---------------- */

        if (!token) {

            console.log("❌ Auth middleware: No token provided");

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }

        /* ---------------- VERIFY TOKEN ---------------- */

        if (!process.env.JWT_SECRET) {

            console.error("❌ JWT_SECRET not defined in environment");

            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /* ---------------- ATTACH USER ---------------- */

        req.user = {
            id: decoded.id,
            role: decoded.role || "user"
        };

        next();

    } catch (err) {

        console.log("❌ JWT verification failed:", err.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }

};