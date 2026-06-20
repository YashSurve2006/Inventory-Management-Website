import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full bg-linear-to-r from-indigo-600 to-accent p-4 text-white rounded-b-2xl mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold text-lg">InventoryX</div>
          <div className="text-xs">• Modern Inventory System</div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/suppliers" className="hover:underline">Suppliers</Link>
          <Link to="/reports" className="hover:underline">Reports</Link>
        </div>
      </div>
    </div>
  );
}
