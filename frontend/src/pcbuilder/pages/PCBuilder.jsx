import React, { useEffect, useState, useCallback, useMemo } from "react";
import UserNavbar from "../../user/components/UserNavbar";
import ComponentSelector from "../components/ComponentSelector";
import PriceSummary from "../components/PriceSummary";
import SelectedParts from "../components/SelectedParts";
import TopBar from "../components/TopBar";
import { BuilderProvider } from "../context/BuilderContext";
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
    "cabinet",
];

/* =========================================================
   WRAPPER (PROVIDER)
========================================================= */
export default function PCBuilderPage() {
    return (
        <BuilderProvider>
            <PCBuilderMain />
        </BuilderProvider>
    );
}

/* =========================================================
   MAIN BUILDER COMPONENT
========================================================= */
function PCBuilderMain() {
    /* =============================
       STATE
    ============================== */
    const [components, setComponents] = useState({});
    const [compatibility, setCompatibility] = useState(null);
    const [buildName, setBuildName] = useState("");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [error, setError] = useState(null);

    /* =============================
       TOAST SYSTEM
    ============================== */
    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    /* =============================
       INITIAL LOAD (optional future API preload)
    ============================== */
    useEffect(() => {
        setLoading(false);
    }, []);

    /* =============================
       UPDATE SELECTION
    ============================== */
    const updateSelection = useCallback((category, component) => {
        setComponents((prev) => ({
            ...prev,
            [category]: component,
        }));
    }, []);

    /* =============================
       TOTAL PRICE
    ============================== */
    const totalPrice = useMemo(() => {
        return Object.values(components)
            .filter(Boolean)
            .reduce((sum, c) => sum + (c.price || 0), 0);
    }, [components]);

    /* =============================
       COMPATIBILITY CHECK
    ============================== */
    useEffect(() => {
        const handler = setTimeout(async () => {
            const selectedList = Object.values(components).filter(Boolean);
            if (!selectedList.length) return;

            try {
                const res = await pcBuilderApi.checkCompatibility(selectedList);
                setCompatibility(res);
            } catch (err) {
                console.error("Compatibility error:", err);
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [components]);

    /* =============================
       ACTIONS
    ============================== */
    const saveBuild = async () => {
        const list = Object.values(components).filter(Boolean);

        if (!buildName) return showToast("Enter build name", "error");
        if (!list.length) return showToast("Select components first", "error");

        try {
            await pcBuilderApi.saveBuild({ buildName, components: list });
            showToast("Build saved successfully");
        } catch {
            showToast("Failed to save build", "error");
        }
    };

    const addToCart = async () => {
        const list = Object.values(components).filter(Boolean);

        if (!list.length) return showToast("Select components first", "error");

        try {
            await pcBuilderApi.addBuildToCart(list);
            showToast("Added to cart");
        } catch {
            showToast("Failed to add to cart", "error");
        }
    };

    const resetBuild = () => {
        setComponents({});
        setCompatibility(null);
        showToast("Build reset");
    };

    /* =========================================================
       RENDER
    ========================================================= */
    return (
        <>
            <UserNavbar />
            <TopBar />

            <div className="min-h-screen bg-linear-to-br from-[#0b0f19] to-black text-white p-6">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-2">
                        🖥️ Advanced PC Builder
                    </h1>
                    <p className="text-gray-400">
                        Build your dream machine with real-time compatibility
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="text-center text-red-400 mb-6">
                        {error}
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">
                        Loading components...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                        {/* LEFT */}
                        <div className="xl:col-span-8 space-y-6">
                            {CATEGORIES.map((cat) => (
                                <ComponentSelector key={cat} type={cat} />
                            ))}
                        </div>

                        {/* RIGHT */}
                        <div className="xl:col-span-4 space-y-6">

                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <SelectedParts />
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <PriceSummary />
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">

                                <input
                                    type="text"
                                    placeholder="Build Name"
                                    value={buildName}
                                    onChange={(e) => setBuildName(e.target.value)}
                                    className="w-full p-3 rounded bg-black/40 border border-white/10"
                                />

                                <button
                                    onClick={saveBuild}
                                    className="w-full py-3 bg-purple-600 rounded hover:bg-purple-700"
                                >
                                    Save Build
                                </button>

                                <button
                                    onClick={addToCart}
                                    className="w-full py-3 bg-green-600 rounded hover:bg-green-700"
                                >
                                    Add to Cart
                                </button>

                                <button
                                    onClick={resetBuild}
                                    className="w-full py-3 bg-red-600 rounded hover:bg-red-700"
                                >
                                    Reset
                                </button>

                            </div>
                        </div>
                    </div>
                )}

                {/* TOAST */}
                {toast && (
                    <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
                        }`}>
                        {toast.msg}
                    </div>
                )}
            </div>
        </>
    );
}