import { Navigate } from "react-router-dom";

export default function RootRedirect() {
    const user = JSON.parse(localStorage.getItem("ix_user") || "null");

    // 🔽 ADDED: if not logged in, stay on landing page
    if (!user) {
        return <Navigate to="/landing" replace />;
    }

    if (user.role === "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/user/dashboard" replace />;
}
