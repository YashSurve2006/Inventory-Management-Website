import React from "react";
import { Navigate } from "react-router-dom";

export default function UserProtectedRoute({ children }) {
    const stored = localStorage.getItem("ix_user");
    if (!stored) return <Navigate to="/login" replace />;

    const user = JSON.parse(stored);

    if (user.role !== "user") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
