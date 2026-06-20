import { useState, useMemo } from "react";
import { useBuilder } from "../context/BuilderContext";

/* =========================================================
   SELECTED PARTS PANEL (ADVANCED)
========================================================= */
export default function SelectedParts() {
    const {
        selected,
        removePart,
        compatibility,
        totals,
    } = useBuilder();

    const [expanded, setExpanded] = useState(null);

    /* =========================================================
       CONFIG (LABELS + ORDER)
    ========================================================= */
    const componentConfig = [
        { key: "cpu", label: "Processor" },
        { key: "motherboard", label: "Motherboard" },
        { key: "ram", label: "Memory (RAM)" },
        { key: "gpu", label: "Graphics Card" },
        { key: "storage", label: "Storage" },
        { key: "psu", label: "Power Supply" },
        { key: "cabinet", label: "Cabinet" },
    ];

    /* =========================================================
       CHECK CONFLICT FOR EACH PART
    ========================================================= */
    const getConflict = (key) => {
        if (!selected[key]) return null;

        // CPU ↔ Motherboard
        if (key === "cpu" && selected.motherboard) {
            if (selected.cpu.socket !== selected.motherboard.socket) {
                return "Socket mismatch";
            }
        }

        if (key === "motherboard" && selected.cpu) {
            if (selected.cpu.socket !== selected.motherboard.socket) {
                return "Socket mismatch";
            }
        }

        // RAM ↔ Motherboard
        if (key === "ram" && selected.motherboard) {
            if (selected.ram.type !== selected.motherboard.ram_type) {
                return "RAM type mismatch";
            }
        }

        return null;
    };

    /* =========================================================
       TOTAL SELECTED COUNT
    ========================================================= */
    const selectedCount = useMemo(() => {
        return Object.values(selected).filter(Boolean).length;
    }, [selected]);

    /* =========================================================
       EMPTY STATE
    ========================================================= */
    if (selectedCount === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                <p className="text-lg">No components selected</p>
                <p className="text-sm mt-2">
                    Start building your PC by selecting components
                </p>
            </div>
        );
    }

    /* =========================================================
       RENDER
    ========================================================= */
    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    Your Build
                </h3>
                <span className="text-sm text-gray-400">
                    {selectedCount} components
                </span>
            </div>

            {/* COMPONENT LIST */}
            <div className="space-y-3">

                {componentConfig.map(({ key, label }) => {
                    const item = selected[key];
                    const conflict = getConflict(key);
                    const isExpanded = expanded === key;

                    return (
                        <div
                            key={key}
                            className={`rounded-xl border p-4 transition-all duration-300
                ${conflict
                                    ? "bg-red-900/30 border-red-500"
                                    : "bg-white/5 border-white/10"
                                }
              `}
                        >
                            {/* MAIN ROW */}
                            <div className="flex justify-between items-center">

                                {/* LEFT */}
                                <div>
                                    <p className="text-sm text-gray-400">{label}</p>

                                    {item ? (
                                        <h4 className="font-medium text-white">
                                            {item.name}
                                        </h4>
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            Not selected
                                        </span>
                                    )}

                                    {/* CONFLICT */}
                                    {conflict && (
                                        <p className="text-xs text-red-400 mt-1">
                                            ⚠ {conflict}
                                        </p>
                                    )}
                                </div>

                                {/* RIGHT */}
                                <div className="flex items-center gap-2">

                                    {/* PRICE */}
                                    {item && (
                                        <span className="text-purple-400 font-semibold">
                                            ₹{item.price}
                                        </span>
                                    )}

                                    {/* EXPAND */}
                                    {item && (
                                        <button
                                            onClick={() =>
                                                setExpanded(isExpanded ? null : key)
                                            }
                                            className="text-xs px-2 py-1 bg-white/10 rounded"
                                        >
                                            {isExpanded ? "Hide" : "View"}
                                        </button>
                                    )}

                                    {/* REMOVE */}
                                    {item && (
                                        <button
                                            onClick={() => removePart(key)}
                                            className="text-xs px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}

                                </div>
                            </div>

                            {/* EXPANDED DETAILS */}
                            {isExpanded && item && (
                                <div className="mt-3 pt-3 border-t border-white/10 text-sm text-gray-300 space-y-1">

                                    <p><strong>Brand:</strong> {item.brand || "N/A"}</p>
                                    <p><strong>Price:</strong> ₹{item.price}</p>

                                    {item.socket && (
                                        <p><strong>Socket:</strong> {item.socket}</p>
                                    )}

                                    {item.type && (
                                        <p><strong>Type:</strong> {item.type}</p>
                                    )}

                                    {item.wattage && (
                                        <p><strong>Power:</strong> {item.wattage}W</p>
                                    )}

                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

            {/* SUMMARY */}
            <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10">

                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Total Components</span>
                    <span>{selectedCount}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Total Power</span>
                    <span>{totals.wattage}W</span>
                </div>

                <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total Price</span>
                    <span className="text-purple-400">
                        ₹{totals.price}
                    </span>
                </div>

            </div>

        </div>
    );
}