// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from "recharts";

import BigHeader from "../components/ui/BigHeader";
import { api } from "../api";

export default function Dashboard() {

  // ====================== STATE ======================
  const [summary, setSummary] = useState({
    total_skus: 0,
    stock_value: 0,
    low_stock: 0,
  });

  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recent, setRecent] = useState([]);
  const [categoryStock, setCategoryStock] = useState([]);

  const [loading, setLoading] = useState(true);

  // ====================== LOAD DATA ======================
  useEffect(() => {
    loadSummary();
    loadSalesChart();
    loadTopProducts();
    loadLowStock();
    loadRecentActivity();
    loadCategoryBreakdown();
  }, []);

  // Summary
  async function loadSummary() {
    try {
      const res = await api.get("/dashboard/summary");
      setSummary(res.data);
    } catch {
      console.log("Summary error");
    } finally {
      setLoading(false);
    }
  }

  // Static Sales Chart
  function loadSalesChart() {
    const months = Array.from({ length: 12 }).map((_, i) => `M${i + 1}`);

    setSales(
      months.map((m, i) => ({
        name: m,
        value: Math.round((Math.sin(i / 2) + 1.5) * (300 + i * 20)),
        orders: Math.max(20, Math.round(Math.cos(i / 3) * 50 + 120)),
      }))
    );
  }

  // Top Products
  async function loadTopProducts() {
    try {
      const res = await api.get("/dashboard/top-selling");
      setTopProducts(res.data);
    } catch {
      setTopProducts([
        { product_name: "Laptop Bag", sold_qty: 120, revenue: 35000 },
        { product_name: "USB Cable", sold_qty: 90, revenue: 9000 },
        { product_name: "Keyboard", sold_qty: 70, revenue: 14000 },
      ]);
    }
  }

  // Low Stock
  async function loadLowStock() {
    try {
      const res = await api.get("/dashboard/low-stock");
      setLowStock(res.data);
    } catch {
      setLowStock([
        { name: "Pendrive", qty: 5 },
        { name: "Mouse", qty: 2 },
        { name: "HDMI Cable", qty: 4 }
      ]);
    }
  }

  // Activity
  async function loadRecentActivity() {
    try {
      const res = await api.get("/dashboard/recent-activity");
      setRecent(res.data);
    } catch {
      setRecent([
        { event: "New Product Added", time: "2 hours ago" },
        { event: "Stock Updated – Mouse", time: "4 hours ago" },
        { event: "Supplier Added – Dell", time: "1 day ago" },
      ]);
    }
  }

  // Category Mini Bar Chart
  function loadCategoryBreakdown() {
    setCategoryStock([
      { category: "Electronics", qty: 120 },
      { category: "Accessories", qty: 80 },
      { category: "Cables", qty: 60 },
      { category: "Office", qty: 40 }
    ]);
  }

  // ====================== LOADING ======================
  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold text-slate-600">
        Loading dashboard…
      </div>
    );
  }

  // ====================== UI ======================
  return (
    <div className="w-full">

      {/* MAIN HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BigHeader
          title="InventoryX — Analytics Dashboard"
          subtitle="Live metrics, real-time inventory insights & powerful visualizations."
        />
      </motion.div>

      {/* ====================== STATS CARDS ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        {[
          {
            label: "Total SKUs",
            value: summary.total_skus,
            color: "from-purple-600 to-violet-600",
            icon: "📦"
          },
          {
            label: "Stock Value",
            value: `₹ ${summary.stock_value.toLocaleString()}`,
            color: "from-blue-600 to-indigo-600",
            icon: "💰"
          },
          {
            label: "Low Stock Items",
            value: summary.low_stock,
            color: "from-rose-500 to-red-600",
            icon: "⚠️"
          }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`rounded-3xl p-6 shadow-xl bg-linear-to-br ${card.color} text-white`}
          >
            <div className="text-4xl mb-2">{card.icon}</div>
            <div className="text-sm opacity-80">{card.label}</div>
            <div className="text-4xl font-extrabold">{card.value}</div>
          </motion.div>
        ))}

      </div>

      {/* ====================== CHART + CATEGORIES ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

        {/* CHART */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 col-span-2"
        >
          <h3 className="text-xl font-bold">Monthly Sales & Orders</h3>
          <p className="text-slate-500 text-sm">Yearly graph overview</p>

          <div className="w-full h-80 mt-6">
            <ResponsiveContainer>
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} />
                <Line type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CATEGORY BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100"
        >
          <h3 className="text-xl font-bold">Category Breakdown</h3>
          <p className="text-slate-500 text-sm">Stock by category</p>

          <div className="w-full h-64 mt-4">
            <ResponsiveContainer>
              <BarChart data={categoryStock}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* ====================== TOP SELLING ====================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-6 mt-10 border border-slate-100"
      >
        <h3 className="text-xl font-bold">Top Selling Products</h3>
        <p className="text-slate-500 text-sm">Best performing items</p>

        <div className="mt-6 space-y-4">
          {topProducts.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-4 rounded-xl"
            >
              <div className="font-semibold">{i + 1}. {p.product_name}</div>
              <div className="text-sm">Sold: {p.sold_qty}</div>
              <div className="font-bold text-slate-700">₹ {p.revenue.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ====================== LOW STOCK ====================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-3xl shadow-xl p-6 mt-10 border border-slate-100"
      >
        <h3 className="text-xl font-bold">Low Stock Alerts</h3>
        <p className="text-slate-500 text-sm">Items needing restock</p>

        <div className="mt-6 space-y-3">
          {lowStock.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-lg"
            >
              <span className="font-semibold text-rose-700">{item.name}</span>
              <span className="text-rose-600 font-bold">{item.qty} left</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ====================== RECENT ACTIVITY ====================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-3xl shadow-xl p-6 mt-10 border border-slate-100 mb-20"
      >
        <h3 className="text-xl font-bold">Recent Activity</h3>
        <p className="text-slate-500 text-sm">Latest updates from system</p>

        <div className="mt-6 space-y-3">
          {recent.map((r, i) => (
            <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">{r.event}</span>
              <span className="text-sm text-slate-500">{r.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
