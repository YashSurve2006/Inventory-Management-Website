// src/components/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiUser,
  FiUsers
} from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";


export default function Topbar() {
  const { user, logout } = useAuth();

  const [quickOpen, setQuickOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const quickRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClick(e) {
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setQuickOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ================================
     FIXED LOGOUT HANDLER
  ================================= */
  function handleLogout() {
    // Clear ALL tokens/data
    localStorage.removeItem("ix_token");
    localStorage.removeItem("ix_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    logout();    // AuthContext cleanup

    // Redirect to login
    window.location.href = "/login";
  }

  return (
    <div className="w-full bg-white shadow-sm rounded-xl px-6 py-3 flex items-center justify-between">

      {/* LEFT SECTION — Logo & Search */}
      <div className="flex items-center gap-6 flex-1">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow">
            IX
          </div>
          <h2 className="font-semibold text-slate-700 text-lg">InventoryX</h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            placeholder="Search products, suppliers, transactions…"
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Quick Menu */}
        <div ref={quickRef} className="relative">
          <button
            onClick={() => setQuickOpen(!quickOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiGrid /> Quick Menu
          </button>

          {quickOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl p-3 z-50">
              <p className="text-xs text-slate-500 mb-2 px-2">Shortcuts</p>

              {[
                { name: "Dashboard", path: "/dashboard" },
                { name: "Products", path: "/products" },
                { name: "Suppliers", path: "/suppliers" },
                { name: "Transactions", path: "/transactions" },
                { name: "Reports", path: "/reports" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100"
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION — Notifications + Profile */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <div className="relative">
          <FiBell size={22} className="text-slate-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500">{user?.role || "User"}</p>
            </div>

            <FiChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl p-2 z-50">

              <a
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm"
              >
                <FiUser /> Profile
              </a>

              {/* ADMIN ONLY – USER MANAGEMENT */}
              {user?.role === "admin" && (
                <a
                  href="/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm"
                >
                  <FiUsers /> User Management
                </a>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-red-600"
              >
                <FiLogOut /> Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
