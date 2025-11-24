import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";

/**
 * Protected wrapper - checks localStorage for logged-in user
 * NOTE: we use "ix_user" for consistency
 */
function Protected({ children }) {
  const user = JSON.parse(localStorage.getItem("ix_user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function AppWrapper() {
  const location = useLocation();
  // Option A: hide sidebar/topbar on auth pages
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Conditionally show Sidebar */}
        {!hideLayout && <Sidebar />}

        {/* ✅ MAIN UPDATED HERE */}
        <main className="flex-1 min-h-screen ml-60 overflow-y-auto">

          {/* Conditionally show Topbar */}
          {!hideLayout && (
            <div className="sticky top-0 z-50 bg-white shadow">
              <Topbar />
            </div>
          )}

          <div className={`${hideLayout ? "flex items-center justify-center p-6" : "p-6"}`}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              />
              <Route path="/profile" element={
                <Protected>
                  <Profile />
                </Protected>
              } />

              <Route
                path="/products"
                element={
                  <Protected>
                    <Products />
                  </Protected>
                }
              />
              <Route path="/profile" element={
                <Protected>
                  <Profile />
                </Protected>
              } />

              <Route
                path="/suppliers"
                element={
                  <Protected>
                    <Suppliers />
                  </Protected>
                }
              />

              <Route
                path="/transactions"
                element={
                  <Protected>
                    <Transactions />
                  </Protected>
                }
              />

              <Route
                path="/reports"
                element={
                  <Protected>
                    <Reports />
                  </Protected>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
