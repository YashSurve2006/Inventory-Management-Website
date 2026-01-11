import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    // 🔎 Read header in ALL safe ways
    const authHeader =
        req.headers.authorization ||
        req.headers.Authorization ||
        req.headers["x-access-token"];

    if (!authHeader) {
        console.log("❌ NO AUTH HEADER");
        return res.status(401).json({ error: "No token provided" });
    }

    let token = authHeader;

    // Handle: "Bearer <token>"
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        console.log("❌ TOKEN MISSING AFTER PARSE");
        return res.status(401).json({ error: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded = { id, role, iat, exp }
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        console.log("❌ JWT VERIFY FAILED:", err.message);
        return res.status(401).json({ error: "Invalid token" });
    }
}
