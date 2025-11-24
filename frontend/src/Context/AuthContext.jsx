// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Provide access to auth values
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("ix_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login function
  function login(username, password) {
    // Temporary hardcoded login
    if (username === "admin" && password === "admin123") {
      const userData = {
        name: "Admin",
        email: "admin@example.com",
        role: "Admin",
      };

      localStorage.setItem("ix_user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    }

    return { success: false, message: "Invalid credentials" };
  }

  // Logout function
  function logout() {
    localStorage.removeItem("ix_user");
    setUser(null);
  }

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
