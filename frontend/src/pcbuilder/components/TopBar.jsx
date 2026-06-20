import React, { useMemo } from "react";
import { useBuilder } from "../context/BuilderContext";

/* =============================
   FORMAT CURRENCY
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
   COLOR HELPERS
============================= */

const getCompatibilityColor = (score) => {

    if (score >= 90)
        return "text-green-400 border-green-500/20";

    if (score >= 70)
        return "text-yellow-400 border-yellow-500/20";

    return "text-red-400 border-red-500/20";

};

const getPerformanceTier = (value) => {

    if (value >= 90)
        return "High-End";

    if (value >= 70)
        return "Gaming";

    if (value >= 50)
        return "Balanced";

    return "Entry";

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

    const notifications =
        ui.notifications || [];

    /* =============================
       SAFE VALUES
    ============================== */

    const price =
        totals.price || 0;

    const wattage =
        totals.wattage || 0;

    const score =
        compatibility.score || 0;

    const gaming =
        performance.gaming || 0;

    const workstation =
        performance.workstation || 0;

    const efficiency =
        performance.efficiency || 0;

    /* =============================
       PERFORMANCE TIER
    ============================== */

    const tier = useMemo(
        () => getPerformanceTier(gaming),
        [gaming]
    );

    /* =============================
       STATUS
    ============================== */

    const statusText =
        score === 100
            ? "Fully Compatible"
            : score >= 70
            ? "Minor Issues"
            : "Not Compatible";

    /* =============================
       RENDER
    ============================== */

    return (

        <div className="w-full bg-[#020617] border-b border-white/10 shadow-xl">

            <div className="px-6 py-5 flex flex-col gap-5">

                {/* HEADER */}

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

                        <button
                            onClick={undo}
                            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition"
                        >
                            Undo
                        </button>

                        <button
                            onClick={redo}
                            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition"
                        >
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

                {/* STATUS BADGE */}

                <div className="flex justify-end">

                    <div
                        className={`px-4 py-1 rounded-full text-xs font-semibold border ${getCompatibilityColor(score)}`}
                    >

                        {statusText}

                    </div>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* PRICE */}

                    <StatCard
                        label="Total Price"
                        value={formatCurrency(price)}
                        bg="from-purple-600 to-pink-600"
                        text="text-white"
                    />

                    {/* POWER */}

                    <StatCard
                        label="Power Usage"
                        value={`${wattage}W`}
                        border="border-yellow-500/20"
                        text="text-yellow-400"
                    />

                    {/* COMPATIBILITY */}

                    <StatCard
                        label="Compatibility"
                        value={`${score}%`}
                        border="border-green-500/20"
                        text={
                            score >= 90
                                ? "text-green-400"
                                : score >= 70
                                ? "text-yellow-400"
                                : "text-red-400"
                        }
                    />

                    {/* PERFORMANCE */}

                    <StatCard
                        label="Gaming Score"
                        value={`${gaming}%`}
                        border="border-blue-500/20"
                        text="text-blue-400"
                    />

                </div>

                {/* PERFORMANCE BARS */}

                <div className="bg-[#0f172a] p-4 rounded-xl border border-white/10">

                    <div className="space-y-4">

                        <ProgressBar
                            label="Gaming"
                            value={gaming}
                            color="bg-blue-500"
                        />

                        <ProgressBar
                            label="Workstation"
                            value={workstation}
                            color="bg-purple-500"
                        />

                        <ProgressBar
                            label="Efficiency"
                            value={efficiency}
                            color="bg-green-500"
                        />

                    </div>

                </div>

                {/* PERFORMANCE TIER */}

                <div className="text-sm text-gray-400">

                    Performance Tier:

                    <span className="ml-2 font-semibold text-white">

                        {tier}

                    </span>

                </div>

                {/* NOTIFICATIONS */}

                {notifications.length > 0 && (

                    <div className="space-y-2">

                        {notifications
                            .slice(-3)
                            .map((n) => (

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

/* =============================
   STAT CARD
============================= */

function StatCard({
    label,
    value,
    bg,
    text,
    border
}) {

    return (

        <div
            className={`p-4 rounded-xl shadow-md border ${border || ""} ${
                bg
                    ? `bg-gradient-to-br ${bg}`
                    : "bg-[#111827]"
            }`}
        >

            <p className="text-xs text-gray-400">

                {label}

            </p>

            <h2
                className={`text-xl font-bold ${
                    text || "text-white"
                }`}
            >

                {value}

            </h2>

        </div>

    );

}

/* =============================
   PROGRESS BAR
============================= */

function ProgressBar({
    label,
    value,
    color
}) {

    return (

        <div>

            <p className="text-xs text-gray-400 mb-1">

                {label}

            </p>

            <div className="w-full h-3 bg-gray-800 rounded">

                <div
                    className={`h-3 rounded shadow-md ${color}`}
                    style={{
                        width: `${value}%`,
                        transition: "width .6s"
                    }}
                />

            </div>

        </div>

    );

}