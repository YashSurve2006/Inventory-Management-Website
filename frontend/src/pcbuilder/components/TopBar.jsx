import React from "react";
import { useBuilder } from "../context/BuilderContext";

/* =============================
   FORMAT
============================= */
const formatCurrency = (value) => {
    const num = Number(value || 0);

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(num);
};

/* =============================
   COMPONENT
============================= */
export default function TopBar() {
    const {
        totals = {},
        compatibility = {},
        performance = {},
        ui = {},
        undo,
        redo,
        resetBuild,
    } = useBuilder() || {};

    const notifications = ui.notifications || [];

    return (
        <div className="w-full bg-[#020617] border-b border-white/10 shadow-xl">

            {/* MAIN CONTAINER */}
            <div className="px-6 py-5 flex flex-col gap-5">

                {/* =============================
           HEADER
        ============================== */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">
                            ⚡ PC Builder Pro
                        </h1>
                        <p className="text-sm text-gray-400">
                            Real-time compatibility & performance engine
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">

                        <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition">
                            Undo
                        </button>

                        <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition">
                            Redo
                        </button>

                        <button
                            onClick={resetBuild}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm transition"
                        >
                            Reset
                        </button>

                    </div>
                </div>

                {/* =============================
           STATS CARDS (STRONG UI)
        ============================== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* PRICE */}
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-xl shadow-lg">
                        <p className="text-xs text-white/80">Total Price</p>
                        <h2 className="text-xl font-bold text-white">
                            {formatCurrency(totals.price)}
                        </h2>
                    </div>

                    {/* POWER */}
                    <div className="bg-[#111827] p-4 rounded-xl shadow-md border border-yellow-500/20">
                        <p className="text-xs text-gray-400">Power Usage</p>
                        <h2 className="text-xl font-bold text-yellow-400">
                            {totals.wattage || 0}W
                        </h2>
                    </div>

                    {/* COMPATIBILITY */}
                    <div className="bg-[#111827] p-4 rounded-xl shadow-md border border-green-500/20">
                        <p className="text-xs text-gray-400">Compatibility</p>
                        <h2
                            className={`text-xl font-bold ${compatibility.score > 80
                                    ? "text-green-400"
                                    : compatibility.score > 50
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                }`}
                        >
                            {compatibility.score || 0}%
                        </h2>
                    </div>

                    {/* GAMING */}
                    <div className="bg-[#111827] p-4 rounded-xl shadow-md border border-blue-500/20">
                        <p className="text-xs text-gray-400">Gaming Score</p>
                        <h2 className="text-xl font-bold text-blue-400">
                            {performance.gaming || 0}%
                        </h2>
                    </div>

                </div>

                {/* =============================
           PERFORMANCE BARS (VISIBLE)
        ============================== */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-white/10">

                    <div className="space-y-4">

                        {/* GAMING */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Gaming</p>
                            <div className="w-full h-3 bg-gray-800 rounded">
                                <div
                                    className="h-3 bg-blue-500 rounded shadow-md"
                                    style={{ width: `${performance.gaming || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* WORK */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Workstation</p>
                            <div className="w-full h-3 bg-gray-800 rounded">
                                <div
                                    className="h-3 bg-purple-500 rounded shadow-md"
                                    style={{ width: `${performance.workstation || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* EFFICIENCY */}
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Efficiency</p>
                            <div className="w-full h-3 bg-gray-800 rounded">
                                <div
                                    className="h-3 bg-green-500 rounded shadow-md"
                                    style={{ width: `${performance.efficiency || 0}%` }}
                                />
                            </div>
                        </div>

                    </div>

                </div>

                {/* =============================
           NOTIFICATIONS
        ============================== */}
                {notifications.length > 0 && (
                    <div className="space-y-2">

                        {notifications.slice(-3).map((n) => (
                            <div
                                key={n.id}
                                className="bg-[#111827] border border-white/10 px-4 py-3 rounded-lg text-sm text-white shadow"
                            >
                                {n.message}
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}