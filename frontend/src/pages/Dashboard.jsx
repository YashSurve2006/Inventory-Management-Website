// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

import BigHeader from "../components/ui/BigHeader";

import {
  getDashboardSummary,
  getTopSellingProducts,
  getLowStockProducts,
  getRecentActivity,
  getCategoryStock,
  getMonthlySales
} from "../api";

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Dashboard() {

  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recent, setRecent] = useState([]);
  const [categoryStock, setCategoryStock] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  useEffect(() => {
    initDashboard();

    const refresh = setInterval(() => {
      initDashboard();
    }, 60000); // auto refresh every 60 sec

    return () => clearInterval(refresh);

  }, []);

  async function initDashboard() {

    try {

      const [
        summaryRes,
        topRes,
        lowRes,
        recentRes,
        catRes,
        salesRes
      ] = await Promise.all([

        getDashboardSummary(),
        getTopSellingProducts(),
        getLowStockProducts(),
        getRecentActivity(),
        getCategoryStock(),
        getMonthlySales()

      ]);

      setSummary(summaryRes.data || {});
      setTopProducts(topRes.data || []);
      setLowStock(lowRes.data || []);
      setRecent(recentRes.data || []);
      setCategoryStock(catRes.data || []);
      setSales(salesRes.data || []);

    } catch (err) {

      console.error("Dashboard load error", err);

    }

    setLoading(false);
  }

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {
    return (
      <div className="p-10 text-xl text-slate-600">
        Loading analytics dashboard...
      </div>
    );
  }

  /* =====================================================
     INVENTORY HEALTH SCORE
  ===================================================== */

  const health =
    summary.total_skus === 0
      ? 100
      : Math.max(
        0,
        100 - Math.round((summary.low_stock / summary.total_skus) * 100)
      );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="w-full">

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BigHeader
          title="InventoryX Analytics"
          subtitle="Real-time inventory metrics & operational insights"
        />
      </motion.div>

      {/* =====================================================
         SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        {[
          {
            label: "Total SKUs",
            value: summary.total_skus,
            icon: "📦",
            color: "from-purple-600 to-violet-600"
          },
          {
            label: "Stock Value",
            value: `₹ ${summary.stock_value?.toLocaleString() || 0}`,
            icon: "💰",
            color: "from-blue-600 to-indigo-600"
          },
          {
            label: "Low Stock",
            value: summary.low_stock,
            icon: "⚠️",
            color: "from-red-500 to-rose-600"
          },
          {
            label: "Inventory Health",
            value: `${health}%`,
            icon: "🧠",
            color: "from-emerald-500 to-green-600"
          }
        ].map((card, i) => (

          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`rounded-3xl p-6 shadow-xl text-white bg-gradient-to-br ${card.color}`}
          >

            <div className="text-4xl">{card.icon}</div>

            <div className="text-sm opacity-80 mt-2">
              {card.label}
            </div>

            <div className="text-4xl font-bold">
              {card.value}
            </div>

          </motion.div>

        ))}

      </div>

      {/* =====================================================
         CHARTS
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

        {/* SALES CHART */}

        <div className="bg-white rounded-3xl shadow-xl p-6 col-span-2">

          <h3 className="text-xl font-bold mb-3">
            Monthly Sales Trend
          </h3>

          <div style={{ width: "100%", height: 320 }}>

            <ResponsiveContainer>

              <LineChart data={sales}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7c3aed"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#06b6d4"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* CATEGORY STOCK */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h3 className="text-xl font-bold mb-3">
            Category Stock
          </h3>

          <div style={{ width: "100%", height: 260 }}>

            <ResponsiveContainer>

              <BarChart data={categoryStock}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="category" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="stock"
                  fill="#6366f1"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* =====================================================
         TOP PRODUCTS
      ===================================================== */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-10">

        <h3 className="text-xl font-bold mb-4">
          Top Selling Products
        </h3>

        {topProducts.length === 0 && (
          <p className="text-slate-500">No sales yet</p>
        )}

        {topProducts.map((p, i) => (

          <div
            key={i}
            className="flex justify-between p-3 bg-slate-50 rounded-lg mb-2"
          >

            <span>{p.name}</span>

            <span className="font-semibold">
              Sold: {p.total_sold}
            </span>

          </div>

        ))}

      </div>

      {/* =====================================================
         LOW STOCK
      ===================================================== */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-10">

        <h3 className="text-xl font-bold mb-4">
          Low Stock Alerts
        </h3>

        {lowStock.map((item, i) => (

          <div
            key={i}
            className="flex justify-between p-3 bg-red-50 rounded-lg mb-2"
          >

            <span>{item.name}</span>

            <span className="font-semibold text-red-600">
              {item.stock}
            </span>

          </div>

        ))}

      </div>

      {/* =====================================================
         RECENT ACTIVITY
      ===================================================== */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-10 mb-20">

        <h3 className="text-xl font-bold mb-4">
          Recent Activity
        </h3>

        {recent.map((r, i) => (

          <div
            key={i}
            className="flex justify-between p-3 bg-slate-50 rounded-lg mb-2"
          >

            <span>{r.name}</span>

            <span className="text-slate-500">
              {r.type}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}