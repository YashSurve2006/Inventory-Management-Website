import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

/* -------------------- ADMIN IMPORTS (UNCHANGED) -------------------- */
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";

/* -------------------- USER IMPORTS -------------------- */
import UserDashboard from "./user/pages/UserDashboard";
import BrowseProducts from "./user/pages/BrowseProducts";
import Cart from "./user/pages/Cart";
import MyOrders from "./user/pages/MyOrders";
import UserProfile from "./user/pages/UserProfile";
import UserProtectedRoute from "./user/components/UserProtectedRoute";

/* -------------------- ROOT REDIRECT -------------------- */
import RootRedirect from "./pages/RootRedirect";

/* -------------------- ADMIN PROTECTED (UNCHANGED LOGIC) -------------------- */
function Protected({ children }) {
  const user = JSON.parse(localStorage.getItem("ix_user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* -------------------- APP -------------------- */
export default function AppWrapper() {
  const location = useLocation();

  // Hide admin layout on auth + user pages
  const hideAdminLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/user");

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* ADMIN SIDEBAR */}
        {!hideAdminLayout && <Sidebar />}

        <main
          className={`flex-1 min-h-screen ${!hideAdminLayout ? "ml-60" : ""
            }`}
        >
          {/* ADMIN TOPBAR */}
          {!hideAdminLayout && (
            <div className="sticky top-0 z-50 bg-white shadow">
              <Topbar />
            </div>
          )}

          <div className="p-6">
            <Routes>
              {/* ---------------- ROOT ---------------- */}
              <Route path="/" element={<RootRedirect />} />

              {/* ---------------- AUTH ---------------- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ---------------- ADMIN (SAFE) ---------------- */}
              <Route
                path="/dashboard"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              />

              <Route
                path="/products"
                element={
                  <Protected>
                    <Products />
                  </Protected>
                }
              />

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

              <Route
                path="/profile"
                element={
                  <Protected>
                    <Profile />
                  </Protected>
                }
              />

              {/* ---------------- USER (ISOLATED) ---------------- */}
              <Route
                path="/user/dashboard"
                element={
                  <UserProtectedRoute>
                    <UserDashboard />
                  </UserProtectedRoute>
                }
              />

              <Route
                path="/user/products"
                element={
                  <UserProtectedRoute>
                    <BrowseProducts />
                  </UserProtectedRoute>
                }
              />

              <Route
                path="/user/cart"
                element={
                  <UserProtectedRoute>
                    <Cart />
                  </UserProtectedRoute>
                }
              />

              <Route
                path="/user/orders"
                element={
                  <UserProtectedRoute>
                    <MyOrders />
                  </UserProtectedRoute>
                }
              />

              <Route
                path="/user/profile"
                element={
                  <UserProtectedRoute>
                    <UserProfile />
                  </UserProtectedRoute>
                }
              />

              {/* ---------------- FALLBACK ---------------- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
