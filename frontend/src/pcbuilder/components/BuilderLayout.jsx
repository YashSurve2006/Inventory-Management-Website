import { useEffect } from "react";
import { useBuilder } from "../context/BuilderContext";

import ComponentSelector from "./ComponentSelector";
import SelectedParts from "./SelectedParts";
import PriceSummary from "./PriceSummary";
import TopBar from "./TopBar";

/* =========================================================
   BUILDER LAYOUT (MAIN CONTAINER)
========================================================= */
export default function BuilderLayout() {
    const { compatibility, totals } = useBuilder();

    /* =========================================================
       PAGE EFFECTS
    ========================================================= */
    useEffect(() => {
        document.title = "PC Builder | InventoryX";
    }, []);

    /* =========================================================
       THEME CLASSES (CENTRALIZED CONTROL)
    ========================================================= */
    const theme = {
        background:
            "min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f172a] to-black text-white",

        glass:
            "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg",

        panel:
            "rounded-2xl p-5",

        heading:
            "text-xl font-semibold tracking-wide",

        subText:
            "text-sm text-gray-400",

        divider:
            "border-t border-white/10 my-4",
    };

    /* =========================================================
       RENDER
    ========================================================= */
    return (
        <div className={theme.background}>

            {/* =============================
         TOP BAR (STICKY)
      ============================== */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
                <TopBar />
            </div>

            {/* =============================
         MAIN GRID LAYOUT
      ============================== */}
            <div className="p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* =========================================================
             LEFT SECTION → 3D PREVIEW (FUTURE READY)
          ========================================================= */}
                    <div className={`xl:col-span-5 ${theme.glass} ${theme.panel}`}>

                        <h2 className={theme.heading}>🖥️ Build Preview</h2>
                        <p className={theme.subText}>
                            Interactive 3D preview will appear here
                        </p>

                        <div className={theme.divider}></div>

                        {/* FUTURE 3D CANVAS */}
                        <div className="h-[400px] flex items-center justify-center rounded-xl bg-black/40 border border-white/10">
                            <span className="text-gray-500">
                                3D Viewer (Phase 2)
                            </span>
                        </div>

                        {/* BUILD STATS */}
                        <div className="mt-6 grid grid-cols-2 gap-4">

                            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                                <p className="text-sm text-gray-400">Total Price</p>
                                <h3 className="text-lg font-bold text-purple-400">
                                    ₹{totals.price}
                                </h3>
                            </div>

                            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                                <p className="text-sm text-gray-400">Power Usage</p>
                                <h3 className="text-lg font-bold text-yellow-400">
                                    {totals.wattage}W
                                </h3>
                            </div>

                        </div>

                        {/* COMPATIBILITY STATUS */}
                        <div className="mt-6">
                            <p className="text-sm text-gray-400 mb-2">
                                Compatibility Status
                            </p>

                            <div
                                className={`p-3 rounded-lg text-sm ${compatibility.issues.length
                                    ? "bg-red-900/40 border border-red-500 text-red-300"
                                    : "bg-green-900/40 border border-green-500 text-green-300"
                                    }`}
                            >
                                {compatibility.issues.length
                                    ? compatibility.issues.join(", ")
                                    : "All components compatible"}
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
             MIDDLE SECTION → COMPONENT SELECTORS
          ========================================================= */}
                    <div className="xl:col-span-4 space-y-6">

                        <ComponentSelector type="cpu" />
                        <ComponentSelector type="motherboard" />
                        <ComponentSelector type="ram" />
                        <ComponentSelector type="gpu" />

                    </div>

                    {/* =========================================================
             RIGHT SECTION → SUMMARY PANEL
          ========================================================= */}
                    <div className="xl:col-span-3 space-y-6">

                        <div className={`${theme.glass} ${theme.panel}`}>
                            <h2 className={theme.heading}>Selected Components</h2>
                            <div className={theme.divider}></div>
                            <SelectedParts />
                        </div>

                        <div className={`${theme.glass} ${theme.panel}`}>
                            <PriceSummary />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className={`${theme.glass} ${theme.panel}`}>

                            <button className="w-full mb-3 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold">
                                💾 Save Build
                            </button>

                            <button className="w-full mb-3 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold">
                                🛒 Add to Cart
                            </button>

                            <button className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold">
                                🔄 Reset
                            </button>

                        </div>

                    </div>

                </div>
            </div>

            {/* =========================================================
         FOOTER (OPTIONAL FUTURE USE)
      ========================================================= */}
            <div className="text-center text-gray-500 text-sm py-6">
                InventoryX PC Builder • Advanced Configuration System
            </div>
        </div>
    );
}