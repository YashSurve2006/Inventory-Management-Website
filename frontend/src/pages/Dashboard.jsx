// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
   COMPONENT
===================================================== */

export default function Dashboard() {

  const navigate = useNavigate();

  /* =====================================================
     STATE
  ===================================================== */

  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recent, setRecent] = useState([]);
  const [categoryStock, setCategoryStock] = useState([]);

  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  /* =====================================================
     LOAD USER NAME
  ===================================================== */

  useEffect(() => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (user?.name)
        setUsername(user.name);

      else if (user?.username)
        setUsername(user.username);

    }

    catch {

      setUsername("User");

    }

  }, []);

  /* =====================================================
     LIVE CLOCK
  ===================================================== */

  useEffect(() => {

    const timer =
      setInterval(() => {

        const now =
          new Date();

        setCurrentTime(
          now.toLocaleTimeString()
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  useEffect(() => {

    loadDashboard();

    const refresh =
      setInterval(() => {

        loadDashboard();

      }, 60000);

    return () =>
      clearInterval(refresh);

  }, []);

  async function loadDashboard() {

    setLoading(true);

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

      setLastUpdated(
        new Date().toLocaleTimeString()
      );

    }

    catch (err) {

      console.error(
        "Dashboard error",
        err
      );

    }

    setLoading(false);

  }

  /* =====================================================
     HEALTH SCORE
  ===================================================== */

  const health =
    summary.total_skus === 0
      ? 100
      : Math.max(
          0,
          100 -
          Math.round(
            (summary.low_stock /
              summary.total_skus) * 100
          )
        );

  /* =====================================================
     QUICK LINKS
  ===================================================== */

  const quickLinks = [

    {
      label: "Products",
      icon: "📦",
      route: "/products",
      color:
        "from-indigo-600 to-blue-600"
    },

    {
      label: "Suppliers",
      icon: "🏢",
      route: "/suppliers",
      color:
        "from-purple-600 to-pink-600"
    },

    {
      label: "Transactions",
      icon: "💳",
      route: "/transactions",
      color:
        "from-emerald-600 to-green-600"
    },

    {
      label: "Reports",
      icon: "📊",
      route: "/reports",
      color:
        "from-orange-600 to-red-600"
    }

  ];

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    topProducts.filter(p =>
      p.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="p-10 text-xl text-gray-600">

        Loading dashboard...

      </div>

    );

  }

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="w-full">

      {/* HEADER */}

      <BigHeader
        title={`Welcome, ${username}`}
        subtitle="Inventory intelligence dashboard"
      />

      {/* TOP BAR */}

      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          className="px-4 py-2 border rounded-xl w-64 shadow"
        />

        <div className="flex gap-4 items-center">

          <div className="text-sm text-gray-500">

            Last Updated:
            <b>
              {" "}
              {lastUpdated}
            </b>

          </div>

          <div className="text-sm text-blue-600 font-semibold">

            {currentTime}

          </div>

          <button
            onClick={loadDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            Refresh
          </button>

        </div>

      </div>

      {/* QUICK LINKS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

        {quickLinks.map(
          (link, i) => (

            <motion.button
              key={i}
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={() =>
                navigate(link.route)
              }
              className={`rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br ${link.color}`}
            >

              <div className="text-4xl">

                {link.icon}

              </div>

              <div className="text-lg font-semibold mt-2">

                {link.label}

              </div>

            </motion.button>

          )
        )}

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

        <Card
          label="Total SKUs"
          value={summary.total_skus}
          icon="📦"
        />

        <Card
          label="Stock Value"
          value={`₹ ${summary.stock_value?.toLocaleString() || 0}`}
          icon="💰"
        />

        <Card
          label="Low Stock"
          value={summary.low_stock}
          icon="⚠️"
        />

        <Card
          label="Inventory Health"
          value={`${health}%`}
          icon="🧠"
        />

      </div>

      {/* HEALTH BAR */}

      <div className="bg-white p-6 rounded-3xl shadow-xl mt-8">

        <h3 className="font-bold mb-3">

          Inventory Health

        </h3>

        <div className="w-full bg-gray-200 h-4 rounded-full">

          <div
            className="bg-green-500 h-4 rounded-full"
            style={{
              width: `${health}%`
            }}
          />

        </div>

      </div>

      {/* SALES CHART */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-10">

        <h3 className="text-xl font-bold mb-3">

          Monthly Sales

        </h3>

        <div style={{
          width: "100%",
          height: 320
        }}>

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

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}

/* =====================================================
   CARD COMPONENT
===================================================== */

function Card({
  label,
  value,
  icon
}) {

  return (

    <motion.div
      whileHover={{
        scale: 1.05
      }}
      className="rounded-3xl p-6 shadow-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
    >

      <div className="text-4xl">

        {icon}

      </div>

      <div className="text-sm opacity-80 mt-2">

        {label}

      </div>

      <div className="text-4xl font-bold">

        {value}

      </div>

    </motion.div>

  );

}
