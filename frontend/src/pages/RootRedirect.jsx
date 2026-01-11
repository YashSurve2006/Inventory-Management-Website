import { Navigate } from "react-router-dom";

export default function RootRedirect() {
    const user = JSON.parse(localStorage.getItem("ix_user") || "null");

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/user/dashboard" replace />;
}
