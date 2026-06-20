import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Products", path: "/products", icon: "📦" },
    { label: "Suppliers", path: "/suppliers", icon: "🏭" },
    { label: "Transactions", path: "/transactions", icon: "🔄" },
    { label: "Reports", path: "/reports", icon: "📑" },
  ];

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`h-screen fixed left-0 top-0 bg-linear-to-b from-slate-900 via-indigo-900 to-indigo-700 text-white shadow-2xl flex flex-col p-6 border-r border-white/10 transition-all duration-300 z-50 ${collapsed ? "w-20" : "w-60"
        }`}
    >
      {/* LOGO + COLLAPSE BUTTON */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">
            IX
          </div>
          {!collapsed && (
            <h1 className="text-xl font-extrabold tracking-wide">InventoryX</h1>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/70 hover:text-white text-xl"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 flex-1 mt-4">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${location.pathname === item.path
                  ? "bg-white/20 shadow-lg"
                  : "hover:bg-white/10"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* PROFILE SECTION */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            A
          </div>
          {!collapsed && (
            <div>
              <h4 className="text-sm font-semibold">Admin</h4>
              <p className="text-xs text-white/60">System Manager</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
