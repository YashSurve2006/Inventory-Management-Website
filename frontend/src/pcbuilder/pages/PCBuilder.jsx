import React, {
    useEffect,
    useState,
    useCallback,
    useMemo
} from "react";

import UserNavbar from "../../user/components/UserNavbar";
import ComponentSelector from "../components/ComponentSelector";
import PriceSummary from "../components/PriceSummary";
import SelectedParts from "../components/SelectedParts";
import TopBar from "../components/TopBar";
import { BuilderProvider, useBuilder } from "../context/BuilderContext";
import pcBuilderApi from "../services/pcBuilderApi";

/* =========================================================
   CONSTANTS
========================================================= */

const CATEGORIES = [
    "cpu",
    "motherboard",
    "ram",
    "gpu",
    "storage",
    "psu",
    "cabinet"
];

/* =========================================================
   WRAPPER
========================================================= */

export default function PCBuilderPage() {

    return (
        <BuilderProvider>
            <PCBuilderMain />
        </BuilderProvider>
    );

}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function PCBuilderMain() {

    const {
        totals = {},
        compatibility = {},
        performance = {},
        resetBuild
    } = useBuilder() || {};

    /* =============================
       LOCAL UI STATE
    ============================== */

    const [buildName, setBuildName] =
        useState("");

    const [toast, setToast] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    /* =============================
       INITIAL LOAD
    ============================== */

    useEffect(() => {

        setLoading(false);

    }, []);

    /* =============================
       SAFE VALUES
    ============================== */

    const totalPrice =
        totals.price || 0;

    const powerUsage =
        totals.wattage || 0;

    const compatibilityScore =
        compatibility.score ?? 0;

    const compatibilityStatus =
        compatibility.status || "Waiting";

    const warnings =
        compatibility.warnings || [];

    const issues =
        compatibility.issues || [];

    const gamingScore =
        performance.gaming || 0;

    const workstationScore =
        performance.workstation || 0;

    const efficiencyScore =
        performance.efficiency || 0;

    const performanceTier =
        performance.tier || "Entry";

    /* =============================
       TOAST
    ============================== */

    const showToast =
        useCallback(
            (msg, type = "success") => {

                setToast({
                    msg,
                    type
                });

                setTimeout(
                    () => setToast(null),
                    3000
                );

            },
            []
        );

    /* =============================
       SAVE BUILD
    ============================== */

    const saveBuild =
        async () => {

            if (!buildName)
                return showToast(
                    "Enter build name",
                    "error"
                );

            if (
                compatibilityStatus ===
                "Not Compatible"
            )
                return showToast(
                    "Build not compatible",
                    "error"
                );

            try {

                await pcBuilderApi
                    .saveBuild({

                        buildName

                    });

                showToast(
                    "Build saved successfully"
                );

            }

            catch {

                showToast(
                    "Failed to save build",
                    "error"
                );

            }

        };

    /* =============================
       ADD TO CART
    ============================== */

    const addToCart =
        async () => {

            if (
                compatibilityStatus ===
                "Not Compatible"
            )
                return showToast(
                    "Build not compatible",
                    "error"
                );

            try {

                await pcBuilderApi
                    .addBuildToCart();

                showToast(
                    "Added to cart"
                );

            }

            catch {

                showToast(
                    "Failed to add to cart",
                    "error"
                );

            }

        };

    /* =============================
       STATUS COLOR
    ============================== */

    const statusColor =
        useMemo(() => {

            if (
                compatibilityStatus ===
                "Compatible"
            )
                return "text-green-400";

            if (
                compatibilityStatus ===
                "Minor Issues"
            )
                return "text-yellow-400";

            if (
                compatibilityStatus ===
                "Not Compatible"
            )
                return "text-red-400";

            return "text-gray-400";

        },
            [compatibilityStatus]
        );

    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <>
            <UserNavbar />


            <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white p-6">

                {/* HEADER */}

                <div className="text-center mb-10">

                    <h1 className="text-4xl font-bold tracking-wide">

                        ⚡ PC Builder Pro

                    </h1>

                    <p className="text-gray-400 mt-2">

                        Real-time compatibility & performance engine

                    </p>

                </div>

                {/* STATUS CARDS */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                    <StatCard
                        label="Total Price"
                        value={`₹${totalPrice.toLocaleString()}`}
                        color="from-pink-500 to-purple-600"
                        highlight
                    />

                    <StatCard
                        label="Power Usage"
                        value={`${powerUsage}W`}
                        text="text-yellow-400"
                    />

                    <StatCard
                        label="Compatibility"
                        value={`${compatibilityScore}%`}
                        text={statusColor}
                    />

                    <StatCard
                        label="Gaming Score"
                        value={`${gamingScore}%`}
                        text="text-blue-400"
                    />

                </div>

                {/* PERFORMANCE BARS */}

                <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10 mb-6">

                    <ProgressBar
                        label="Gaming"
                        value={gamingScore}
                        color="bg-blue-500"
                    />

                    <ProgressBar
                        label="Workstation"
                        value={workstationScore}
                        color="bg-purple-500"
                    />

                    <ProgressBar
                        label="Efficiency"
                        value={efficiencyScore}
                        color="bg-green-500"
                    />

                    <div className="mt-4 text-sm text-gray-400">

                        Performance Tier:

                        <span className="ml-2 font-semibold text-white">

                            {performanceTier}

                        </span>

                    </div>

                </div>

                {/* ISSUES */}

                {
                    issues.length > 0 && (

                        <AlertBox
                            title="Critical Compatibility Issues"
                            items={issues}
                            color="red"
                        />

                    )
                }

                {
                    warnings.length > 0 && (

                        <AlertBox
                            title="Warnings"
                            items={warnings}
                            color="yellow"
                        />

                    )
                }

                {/* MAIN GRID */}

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    <div className="xl:col-span-8 space-y-6">

                        {
                            CATEGORIES.map(
                                cat => (

                                    <ComponentSelector
                                        key={cat}
                                        type={cat}
                                    />

                                )
                            )
                        }

                    </div>

                    <div className="xl:col-span-4 space-y-6">

                        <Card>
                            <SelectedParts />
                        </Card>

                        <Card>
                            <PriceSummary />
                        </Card>

                        <Card>

                            <input
                                type="text"
                                placeholder="Build Name"
                                value={buildName}
                                onChange={e =>
                                    setBuildName(
                                        e.target.value
                                    )
                                }
                                className="w-full p-3 rounded bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                            <button
                                onClick={saveBuild}
                                disabled={
                                    compatibilityStatus ===
                                    "Not Compatible"
                                }
                                className="w-full py-3 bg-purple-600 rounded hover:bg-purple-700 mt-3 disabled:bg-gray-600 transition"
                            >
                                Save Build
                            </button>

                            <button
                                onClick={addToCart}
                                disabled={
                                    compatibilityStatus ===
                                    "Not Compatible"
                                }
                                className="w-full py-3 bg-green-600 rounded hover:bg-green-700 mt-2 disabled:bg-gray-600 transition"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={resetBuild}
                                className="w-full py-3 bg-red-600 rounded hover:bg-red-700 mt-2 transition"
                            >
                                Reset Build
                            </button>

                        </Card>

                    </div>

                </div>

                {/* TOAST */}

                {
                    toast && (

                        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg ${
                            toast.type === "error"
                                ? "bg-red-500"
                                : "bg-green-500"
                        }`}>

                            {toast.msg}

                        </div>

                    )
                }

            </div>

        </>

    );

}

/* =========================================================
   COMPONENTS
========================================================= */

function Card({ children }) {

    return (

        <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3 shadow-lg">

            {children}

        </div>

    );

}

function StatCard({
    label,
    value,
    color,
    text,
    highlight
}) {

    return (

        <div className={`p-4 rounded-xl border border-white/10 ${
            highlight
                ? `bg-gradient-to-br ${color}`
                : "bg-white/5"
        }`}>

            <p className="text-gray-400 text-sm">

                {label}

            </p>

            <h2 className={`text-xl font-bold ${
                text || "text-white"
            }`}>

                {value}

            </h2>

        </div>

    );

}

function ProgressBar({
    label,
    value,
    color
}) {

    return (

        <div className="mb-4">

            <div className="text-xs text-gray-400 mb-1">

                {label}

            </div>

            <div className="w-full h-3 bg-gray-800 rounded">

                <div
                    className={`h-3 rounded ${color}`}
                    style={{
                        width: `${value}%`,
                        transition: "width .5s"
                    }}
                />

            </div>

        </div>

    );

}

function AlertBox({
    title,
    items,
    color
}) {

    const border =
        color === "red"
            ? "border-red-500 bg-red-500/10"
            : "border-yellow-500 bg-yellow-500/10";

    const text =
        color === "red"
            ? "text-red-400"
            : "text-yellow-400";

    return (

        <div className={`${border} p-4 rounded-xl mb-6`}>

            <h3 className={`${text} font-bold mb-2`}>

                {title}

            </h3>

            {
                items.map(
                    (item, i) => (

                        <div key={i}>

                            ⚠ {item}

                        </div>

                    )
                )
            }

        </div>

    );

}