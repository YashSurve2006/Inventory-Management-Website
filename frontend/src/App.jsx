import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

/* =========================================================
   LAZY LOAD (PERFORMANCE BOOST 🚀)
========================================================= */

/* ---------- COMMON ---------- */
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const RootRedirect = lazy(() => import("./pages/RootRedirect"));

/* ---------- ADMIN ---------- */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Reports = lazy(() => import("./pages/Reports"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Profile = lazy(() => import("./pages/Profile"));

/* ---------- USER ---------- */
const UserDashboard = lazy(() => import("./user/pages/UserDashboard"));
const BrowseProducts = lazy(() => import("./user/pages/BrowseProducts"));
const Cart = lazy(() => import("./user/pages/Cart"));
const MyOrders = lazy(() => import("./user/pages/MyOrders"));
const UserProfile = lazy(() => import("./user/pages/UserProfile"));

/* ---------- PCBULDER ---------- */
const PCBuilder = lazy(() => import("./pcbuilder/pages/PCBuilder"));

/* ---------- LAYOUT ---------- */
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UserProtectedRoute from "./user/components/UserProtectedRoute";

/* =========================================================
   LOADER UI
========================================================= */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
    </div>
  );
}

/* =========================================================
   ADMIN PROTECTED
========================================================= */
function Protected({ children }) {
  const user = JSON.parse(localStorage.getItem("ix_user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* =========================================================
   APP
========================================================= */
export default function AppWrapper() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register", "/landing"].includes(
    location.pathname
  );

  const isUserPage = location.pathname.startsWith("/user");

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50">

        {/* ================= ADMIN SIDEBAR ================= */}
        {!isAuthPage && !isUserPage && <Sidebar />}

        <main
          className={`flex-1 min-h-screen ${!isAuthPage && !isUserPage ? "ml-60" : ""
            }`}
        >

          {/* ================= ADMIN TOPBAR ================= */}
          {!isAuthPage && !isUserPage && (
            <div className="sticky top-0 z-50 bg-white shadow">
              <Topbar />
            </div>
          )}

          <div className={!isAuthPage && !isUserPage ? "p-6" : ""}>

            <Suspense fallback={<PageLoader />}>

              <Routes>

                {/* ================= ROOT ================= */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/landing" element={<Landing />} />

                {/* ================= AUTH ================= */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ================= ADMIN ================= */}

                <Route path="/dashboard" element={
                  <Protected><Dashboard /></Protected>
                } />

                <Route path="/products" element={
                  <Protected><Products /></Protected>
                } />

                <Route path="/suppliers" element={
                  <Protected><Suppliers /></Protected>
                } />

                <Route path="/transactions" element={
                  <Protected><Transactions /></Protected>
                } />

                <Route path="/reports" element={
                  <Protected><Reports /></Protected>
                } />

                <Route path="/profile" element={
                  <Protected><Profile /></Protected>
                } />

                {/* ================= USER ================= */}

                <Route path="/user/dashboard" element={
                  <UserProtectedRoute><UserDashboard /></UserProtectedRoute>
                } />

                <Route path="/user/products" element={
                  <UserProtectedRoute><BrowseProducts /></UserProtectedRoute>
                } />

                <Route path="/user/cart" element={
                  <UserProtectedRoute><Cart /></UserProtectedRoute>
                } />

                <Route path="/user/orders" element={
                  <UserProtectedRoute><MyOrders /></UserProtectedRoute>
                } />

                <Route path="/user/profile" element={
                  <UserProtectedRoute><UserProfile /></UserProtectedRoute>
                } />

                {/* ================= PC BUILDER ================= */}

                <Route path="/user/pc-builder" element={
                  <UserProtectedRoute><PCBuilder /></UserProtectedRoute>
                } />

                {/* ================= FUTURE ROUTES ================= */}

                {/* 🔥 Builder Enhancements */}
                <Route path="/user/pc-builder/saved" element={<div>Saved Builds (Future)</div>} />
                <Route path="/user/pc-builder/history" element={<div>Build History (Future)</div>} />
                <Route path="/user/pc-builder/compare" element={<div>Compare Builds (Future)</div>} />

                {/* 🔥 User Features */}
                <Route path="/user/wishlist" element={<div>Wishlist (Future)</div>} />
                <Route path="/user/recommendations" element={<div>AI Recommendations (Future)</div>} />

                {/* 🔥 Admin Future */}
                <Route path="/admin/analytics" element={<div>Analytics Dashboard (Future)</div>} />
                <Route path="/admin/inventory-ai" element={<div>AI Inventory Insights (Future)</div>} />

                {/* ================= FALLBACK ================= */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>

            </Suspense>

          </div>
        </main>
      </div>
    </AuthProvider>
  );
}