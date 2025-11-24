import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsCard({
  title,
  value,
  chartData = [],
  color = "#6366f1",
  description = "Inventory analytics overview",
  icon = null,
  trend = 0, // positive or negative number
  footer = "Last 30 days", // new footer
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white rounded-2xl p-6 shadow-xl border border-slate-200 transition-all duration-300 relative overflow-hidden"
    >
      {/* Soft background gradient blob */}
      <div
        className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10"
        style={{ background: color }}
      ></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {title}
          </h3>

          <div className="text-4xl font-extrabold text-slate-900 mt-1">
            {value}
          </div>

          <div className="flex items-center gap-2 mt-1">
            {/* Trend arrow */}
            {trend !== 0 && (
              <span
                className={`text-xs font-semibold ${trend > 0 ? "text-green-500" : "text-red-500"
                  }`}
              >
                {trend > 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
              </span>
            )}

            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>

        {/* ICON container */}
        <div className="p-3 bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl shadow-inner">
          {icon ? (
            icon
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v18h18M7 14l3-3 4 4 3-3"
              />
            </svg>
          )}
        </div>
      </div>

      {/* CHART */}
      <div className="w-full h-32 -mb-2 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" hide={true} />
            <YAxis hide={true} />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                background: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
              labelStyle={{ color: "#64748b", fontWeight: "bold" }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#gradient-${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer line */}
      <div className="text-xs text-slate-400 mt-4 border-t pt-2">
        {footer}
      </div>
    </motion.div>
  );
}
