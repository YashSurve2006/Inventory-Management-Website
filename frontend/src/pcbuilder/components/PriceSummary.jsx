import React, { useMemo } from "react";
import { useBuilder } from "../context/BuilderContext";

/* =============================
   FORMATTERS
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
export default function PriceSummary() {
    const { selected } = useBuilder();

    /* =============================
       CALCULATIONS (FIXED)
    ============================== */
    const { totalPrice, totalItems, totalWattage } = useMemo(() => {
        let price = 0;
        let items = 0;
        let watt = 0;

        Object.values(selected).forEach((item) => {
            if (!item) return;

            items += 1;

            // ✅ FIXED PRICE
            price += Number(item.price || 0);

            // ✅ SAFE WATTAGE
            watt += Number(item.wattage || 0);
        });

        return {
            totalPrice: price,
            totalItems: items,
            totalWattage: watt,
        };
    }, [selected]);

    /* =============================
       UI
    ============================== */
    return (
        <div className="bg-linear-to-br from-[#0f172a] to-[#020617] p-6 rounded-2xl border border-white/10 shadow-xl">

            {/* HEADER */}
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-white tracking-wide">
                    Build Summary
                </h2>
                <p className="text-xs text-gray-400">
                    Live system overview & cost analysis
                </p>
            </div>

            {/* STATS */}
            <div className="space-y-4">

                {/* TOTAL COMPONENTS */}
                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg">
                    <span className="text-gray-400 text-sm">
                        Total Components
                    </span>
                    <span className="text-white font-semibold">
                        {totalItems}
                    </span>
                </div>

                {/* POWER */}
                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg">
                    <span className="text-gray-400 text-sm">
                        Total Power
                    </span>
                    <span className="text-yellow-400 font-semibold">
                        {totalWattage}W
                    </span>
                </div>

                {/* PRICE */}
                <div className="flex justify-between items-center bg-linear-to-r from-purple-600/20 to-pink-600/20 px-4 py-4 rounded-xl border border-purple-500/20">

                    <span className="text-white text-base font-semibold">
                        Total Price
                    </span>

                    <span className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {formatCurrency(totalPrice)}
                    </span>

                </div>

            </div>

            {/* EXTRA INFO */}
            <div className="mt-5 text-xs text-gray-500">
                Prices include all selected components. Taxes may vary.
            </div>

        </div>
    );
}