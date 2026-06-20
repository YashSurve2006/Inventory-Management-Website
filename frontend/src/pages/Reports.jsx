// src/pages/Reports.jsx
// Advanced Reports page (JSX, no Sidebar/Topbar included — this file is the *page content* only).
// Features:
// - Multiple charts (line, area, bar, pie) with responsive containers
// - Large mock dataset (12 months + product-level details)
// - Filters: date range, category, min revenue, search
// - Exports: CSV for tables, PNG export for charts (SVG -> PNG conversion)
// - Responsive layout and accessible controls
// - Animated entrance using framer-motion
//
// Notes: This file expects your global layout (App.jsx) to provide the Sidebar and Topbar around <Routes/>.
// Drop into src/pages/Reports.jsx and ensure recharts + framer-motion are installed.

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import BigHeader from "../components/ui/BigHeader";

const COLORS = [
  "#7c3aed",
  "#06b6d4",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#a78bfa",
  "#f472b6",
  "#60a5fa",
];

function buildMockData(seed = 1) {
  // 24 months of sales for time-range flexibility
  const months = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const startYear = 2024;
  for (let y = 0; y < 2; y++) {
    for (let m = 0; m < 12; m++) {
      months.push({
        id: `${startYear + y}-${String(m + 1).padStart(2, "0")}`,
        month: `${monthNames[m]} ${startYear + y}`,
        revenue: Math.round(
          (1200 + (m + 1) * 150 + Math.sin((m + seed) / 1.5) * 300 + Math.random() * 200) /
          1
        ),
        orders: Math.round(80 + (m + seed) * 4 + Math.cos((m - seed) / 2) * 10),
        returns: Math.round(Math.abs(Math.sin(m + seed) * 6)),
        averageOrder: Math.round(Math.random() * 40 + 45),
      });
    }
  }

  // categories & product-level metrics
  const categories = [
    "Cables",
    "Batteries",
    "Lighting",
    "Accessories",
    "Peripherals",
    "Adapters",
    "Chargers",
  ];

  const topProducts = Array.from({ length: 18 }).map((_, i) => {
    const cat = categories[i % categories.length];
    const units = Math.round(300 - i * 8 + Math.random() * 60);
    const revenue = Math.round(units * (150 + (i % 6) * 25 + Math.random() * 80));
    return {
      sku: `PRD-${1000 + i}`,
      name:
        [
          "USB-C Cable",
          "AA Battery Pack",
          "LED Bulb 9W",
          "Wireless Mouse",
          "HDMI Cable",
          "Power Bank 10k",
          "Type-C Adapter",
          "Fast Charger",
          "Laptop Charger",
          "Ethernet Cable",
        ][i % 10] + ` ${i + 1}`,
      category: cat,
      unitsSold: units,
      revenue,
      margin: Number((12 + (i % 7) * 3 + Math.random() * 10).toFixed(1)),
      trend: Array.from({ length: 6 }).map(() => Math.round(units * (0.6 + Math.random() * 0.8))),
    };
  });

  const supplierPerformance = Array.from({ length: 6 }).map((_, i) => ({
    name: `Supplier ${i + 1}`,
    onTime: Math.round(82 + Math.random() * 16),
    quality: Math.round(75 + Math.random() * 20),
    volume: Math.round(400 + Math.random() * 700),
  }));

  const categoryBreakdown = categories.map((c, idx) => ({
    name: c,
    value: Math.round(900 + idx * 600 + Math.random() * 800),
  }));

  return {
    months,
    topProducts,
    supplierPerformance,
    categoryBreakdown,
  };
}

/* -------------------------
   Utility: CSV & PNG export
   ------------------------- */

function downloadCSV(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell == null) return "";
          const s = String(cell).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    )
    .join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportChartAsPNG(containerNode, filename = "chart.png") {
  // Convert SVG inside container to PNG using <canvas>.
  try {
    const svg = containerNode.querySelector("svg");
    if (!svg) throw new Error("SVG element not found inside container");
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(unescape(encodeURIComponent(xml)));
    const b64Start = "data:image/svg+xml;base64,";
    const image64 = b64Start + svg64;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2; // high DPI
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.onerror = () => alert("Unable to export chart image due to cross-origin or serialization issue.");
    img.src = image64;
  } catch (err) {
    alert("Export failed: " + (err && err.message ? err.message : err));
  }
}

/* -------------------------
   Main Reports component
   ------------------------- */

export default function Reports() {
  const { months, topProducts, supplierPerformance, categoryBreakdown } = useMemo(
    () => buildMockData(2),
    []
  );

  // filters & UI state
  const [range, setRange] = useState("12M");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [minRevenue, setMinRevenue] = useState("");
  const [search, setSearch] = useState("");
  const [timeWindow, setTimeWindow] = useState({ start: months[months.length - 12].id, end: months[months.length - 1].id });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compact, setCompact] = useState(false);

  // refs for exporting
  const revenueChartRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  // derive filtered products list
  const filteredProducts = useMemo(() => {
    let list = topProducts.slice();
    if (categoryFilter !== "All") list = list.filter((p) => p.category === categoryFilter);
    if (minRevenue) list = list.filter((p) => p.revenue >= Number(minRevenue || 0));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    // sort by revenue desc
    list.sort((a, b) => b.revenue - a.revenue);
    return list;
  }, [topProducts, categoryFilter, minRevenue, search]);

  // calculate totals in selected time window
  const windowMonths = useMemo(() => {
    // find indices for start/end ids
    const startIndex = months.findIndex((m) => m.id === timeWindow.start);
    const endIndex = months.findIndex((m) => m.id === timeWindow.end);
    const s = Math.max(0, startIndex === -1 ? months.length - 12 : startIndex);
    const e = Math.min(months.length - 1, endIndex === -1 ? months.length - 1 : endIndex);
    return months.slice(s, e + 1);
  }, [months, timeWindow]);

  const totalRevenueWindow = useMemo(
    () => windowMonths.reduce((s, x) => s + x.revenue, 0),
    [windowMonths]
  );
  const totalOrdersWindow = useMemo(() => windowMonths.reduce((s, x) => s + x.orders, 0), [windowMonths]);

  // handle range shortcuts
  const applyRange = (label) => {
    setRange(label);
    if (label === "3M") {
      setTimeWindow({
        start: months[months.length - 3].id,
        end: months[months.length - 1].id,
      });
    } else if (label === "6M") {
      setTimeWindow({
        start: months[months.length - 6].id,
        end: months[months.length - 1].id,
      });
    } else {
      setTimeWindow({
        start: months[months.length - 12].id,
        end: months[months.length - 1].id,
      });
    }
  };

  // small helper: prepare CSV rows for products
  function exportProductsCSV() {
    const rows = [
      ["SKU", "Name", "Category", "Units Sold", "Revenue", "Margin"],
      ...filteredProducts.map((p) => [p.sku, p.name, p.category, p.unitsSold, p.revenue, p.margin]),
    ];
    downloadCSV("top_products.csv", rows);
  }

  function exportRevenueCSV() {
    const rows = [["Month", "Revenue", "Orders"], ...windowMonths.map((m) => [m.month, m.revenue, m.orders])];
    downloadCSV("revenue_window.csv", rows);
  }

  // responsive chart width control (not required but nicer)
  useEffect(() => {
    // keep page responsive when compact toggled
    const handleResize = () => { };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -------------------------
     Render
     ------------------------- */

  return (
    <main className="flex-1 p-6 md:p-8 lg:pr-12">
      <BigHeader title="Reports & Insights" subtitle="Deep analytics, exports and schedule-ready reports." />

      <div className="mt-6 space-y-6">
        {/* Top control row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow flex items-center gap-4">
            <input
              aria-label="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU, product name..."
              className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="All">All categories</option>
              {[...new Set(topProducts.map((p) => p.category))].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={minRevenue}
              onChange={(e) => setMinRevenue(e.target.value)}
              placeholder="Min revenue"
              className="w-36 px-3 py-2 rounded-lg border"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => applyRange("3M")}
                className={`px-3 py-2 rounded-lg border ${range === "3M" ? "bg-indigo-600 text-white" : ""}`}
              >
                3M
              </button>
              <button
                onClick={() => applyRange("6M")}
                className={`px-3 py-2 rounded-lg border ${range === "6M" ? "bg-indigo-600 text-white" : ""}`}
              >
                6M
              </button>
              <button
                onClick={() => applyRange("12M")}
                className={`px-3 py-2 rounded-lg border ${range === "12M" ? "bg-indigo-600 text-white" : ""}`}
              >
                12M
              </button>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button onClick={() => exportRevenueCSV()} className="px-4 py-2 rounded-lg border">
              Export Revenue CSV
            </button>
            <button
              onClick={() => {
                if (revenueChartRef.current) exportChartAsPNG(revenueChartRef.current, "revenue_chart.png");
                else alert("Chart not ready to export.");
              }}
              className="px-4 py-2 rounded-lg bg-accent text-white"
            >
              Export Chart PNG
            </button>
            <button onClick={() => exportProductsCSV()} className="px-4 py-2 rounded-lg border">
              Export Products CSV
            </button>
            <button onClick={() => setCompact((c) => !c)} className="px-3 py-2 rounded-lg border">
              {compact ? "Normal View" : "Compact"}
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column: main charts & product table */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            {/* Stats & Line Chart */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <p className="text-sm text-slate-500">Trend across the selected window</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Total revenue</div>
                    <div className="text-xl font-extrabold">₹ {totalRevenueWindow.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Total orders</div>
                    <div className="text-xl font-extrabold">{totalOrdersWindow}</div>
                  </div>
                </div>
              </div>

              <div ref={revenueChartRef} className="mt-6" style={{ width: "100%", height: compact ? 220 : 340 }}>
                <ResponsiveContainer>
                  <LineChart data={windowMonths}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="orders" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 3 }} />
                    <Area type="monotone" dataKey="averageOrder" stroke="transparent" fill={COLORS[0]} fillOpacity={0.04} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bar stacked of returns / orders */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold">Orders vs Returns (window)</h4>
                <div className="text-sm text-slate-500">Quick comparison across months</div>
              </div>
              <div ref={barRef} style={{ width: "100%", height: compact ? 220 : 260 }}>
                <ResponsiveContainer>
                  <BarChart data={windowMonths}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" stackId="a" fill={COLORS[1]} />
                    <Bar dataKey="returns" stackId="a" fill={COLORS[2]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Products table + small inline sparkline */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-md font-semibold">Top Products</h4>
                  <p className="text-sm text-slate-500">Filtered by your controls — click a row for details</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => exportProductsCSV()} className="px-3 py-2 rounded-lg border text-sm">CSV</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-sm text-slate-500">
                    <tr>
                      <th className="py-2">SKU</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th className="text-right">Units</th>
                      <th className="text-right">Revenue</th>
                      <th className="text-right">Margin</th>
                      <th className="text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, idx) => (
                      <tr key={p.sku} className={`border-t hover:bg-slate-50 cursor-pointer ${idx % 2 === 0 ? "" : ""}`} onClick={() => setSelectedProduct(p)}>
                        <td className="py-3 font-mono">{p.sku}</td>
                        <td className="font-medium">{p.name}</td>
                        <td>{p.category}</td>
                        <td className="text-right">{p.unitsSold}</td>
                        <td className="text-right">₹ {p.revenue.toLocaleString()}</td>
                        <td className="text-right">{p.margin}%</td>
                        <td className="text-right" style={{ width: 160 }}>
                          <ResponsiveContainer width="100%" height={28}>
                            <AreaChart data={p.trend.map((v, i) => ({ i, v }))}>
                              <Area type="monotone" dataKey="v" stroke={COLORS[5]} fill={COLORS[5]} fillOpacity={0.12} strokeWidth={1.5} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* pagination/more controls (simple) */}
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <div>{filteredProducts.length} products</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const csvRows = [["SKU", "Name", "Category", "Units", "Revenue", "Margin"], ...filteredProducts.map((r) => [r.sku, r.name, r.category, r.unitsSold, r.revenue, r.margin])];
                      downloadCSV("filtered_products.csv", csvRows);
                    }}
                    className="px-3 py-1 rounded-lg border"
                  >
                    Export filtered
                  </button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Right column: pie, suppliers, schedule */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            {/* Category breakdown (pie) */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold">Category Breakdown</h5>
                  <p className="text-xs text-slate-400">Units by category</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => { if (pieRef.current) exportChartAsPNG(pieRef.current, "category_pie.png"); }} className="px-2 py-1 rounded-lg border text-sm">PNG</button>
                  <button onClick={() => downloadCSV("category_breakdown.csv", [["Category", "Units"], ...categoryBreakdown.map((c) => [c.name, c.value])])} className="px-2 py-1 rounded-lg border text-sm">CSV</button>
                </div>
              </div>

              <div ref={pieRef} style={{ width: "100%", height: 260 }} className="mt-3">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={80} innerRadius={42} paddingAngle={6}>
                      {categoryBreakdown.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 space-y-2">
                {categoryBreakdown.map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span style={{ width: 12, height: 12, background: COLORS[i % COLORS.length], display: "inline-block", borderRadius: 4 }} />
                      <div>{c.name}</div>
                    </div>
                    <div className="text-slate-500">{c.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Supplier performance */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow">
              <h5 className="text-sm font-semibold mb-3">Supplier Performance</h5>
              <div className="space-y-3">
                {supplierPerformance.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-400">Volume {s.volume} • Quality {s.quality}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{s.onTime}%</div>
                      <div className="text-xs text-slate-400">On-time</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Schedule & quick actions */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow">
              <h5 className="text-sm font-semibold">Schedule & Automations</h5>
              <p className="text-xs text-slate-400 mb-3">Schedule exports or create alerts (client demo controls)</p>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="date" className="px-3 py-2 rounded-lg border w-1/2" onChange={(e) => setTimeWindow((t) => ({ ...t, start: e.target.value || t.start }))} />
                  <input type="date" className="px-3 py-2 rounded-lg border w-1/2" onChange={(e) => setTimeWindow((t) => ({ ...t, end: e.target.value || t.end }))} />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-accent text-white">Schedule Export</button>
                  <button className="flex-1 py-2 rounded-lg border">Create Alert</button>
                </div>

                <div className="text-xs text-slate-400">Tip: these features will connect to a server-side scheduler later. For now they simulate scheduling.</div>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Selected product detail drawer (simple) */}
        <div aria-live="polite">
          {selectedProduct && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed right-6 bottom-6 w-96 bg-white rounded-2xl shadow-lg p-4 z-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">Product</div>
                  <div className="text-lg font-semibold">{selectedProduct.name}</div>
                  <div className="text-xs text-slate-400">{selectedProduct.sku} • {selectedProduct.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Revenue</div>
                  <div className="text-lg font-extrabold">₹ {selectedProduct.revenue.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">{selectedProduct.unitsSold} units</div>
                </div>
              </div>

              <div className="mt-3">
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={selectedProduct.trend.map((v, i) => ({ name: i + 1, v }))}>
                    <Area type="monotone" dataKey="v" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.12} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <button onClick={() => { downloadCSV("product_detail.csv", [["SKU", "Name", "Category", "Units", "Revenue"], [selectedProduct.sku, selectedProduct.name, selectedProduct.category, selectedProduct.unitsSold, selectedProduct.revenue]]); }} className="px-3 py-2 rounded-lg border">Export</button>
                <button onClick={() => setSelectedProduct(null)} className="px-3 py-2 rounded-lg bg-rose-500 text-white">Close</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}


