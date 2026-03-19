import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useBuilder } from "../context/BuilderContext";
import pcBuilderApi from "../services/pcBuilderApi";

/* =============================
   CATEGORY META
============================= */
const META = {
    cpu: { title: "CPU" },
    motherboard: { title: "Motherboard" },
    ram: { title: "RAM" },
    gpu: { title: "GPU" },
    storage: { title: "Storage" },
    psu: { title: "PSU" },
    cabinet: { title: "Cabinet" },
};

/* =============================
   SAFE HELPERS
============================= */
const safe = (v) =>
    v === null || v === undefined || v === "" ? null : String(v).toLowerCase();

const formatPrice = (p) =>
    "₹" + Number(p || 0).toLocaleString("en-IN");

/* =============================
   COMPATIBILITY ENGINE (CLEAN)
============================= */
const checkCompatibility = (type, item, selected) => {
    let status = "compatible";
    let message = "Compatible";

    const cpu = selected.cpu;
    const motherboard = selected.motherboard;
    const ram = selected.ram;

    /* ---------- CPU ↔ MOTHERBOARD ---------- */
    if (type === "cpu" && motherboard) {
        if (safe(item.socket) && safe(motherboard.socket)) {
            if (safe(item.socket) !== safe(motherboard.socket)) {
                status = "warning";
                message = `Works best with ${motherboard.socket}`;
            }
        }
    }

    if (type === "motherboard" && cpu) {
        if (safe(item.socket) && safe(cpu.socket)) {
            if (safe(item.socket) !== safe(cpu.socket)) {
                status = "warning";
                message = `Works best with ${cpu.socket}`;
            }
        }
    }

    /* ---------- RAM ↔ MOTHERBOARD ---------- */
    if (type === "ram" && motherboard) {
        if (safe(item.ram_type) && safe(motherboard.ram_type)) {
            if (safe(item.ram_type) !== safe(motherboard.ram_type)) {
                status = "warning";
                message = `Recommended ${motherboard.ram_type}`;
            }
        }
    }

    /* ---------- STOCK CHECK ---------- */
    if (item.stock !== undefined && item.stock <= 0) {
        status = "blocked";
        message = "Out of stock";
    }

    return { status, message };
};

/* =============================
   COMPONENT
============================= */
export default function ComponentSelector({ type }) {
    const { selected, selectPart } = useBuilder();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    /* =============================
       FETCH DATA
    ============================== */
    useEffect(() => {
        const load = async () => {
            try {
                const res = await pcBuilderApi.getComponents(type);
                setItems(Array.isArray(res) ? res : []);
            } catch (err) {
                console.error("Error loading:", type, err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [type]);

    /* =============================
       FILTER
    ============================== */
    const filtered = useMemo(() => {
        return items.filter((i) =>
            (i.name || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    /* =============================
       SELECT HANDLER
    ============================== */
    const handleSelect = useCallback(
        (item) => {
            const check = checkCompatibility(type, item, selected);

            if (check.status === "blocked") return;

            selectPart(type, item);
        },
        [type, selected, selectPart]
    );

    /* =============================
       RENDER
    ============================== */
    return (
        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10">

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold">{META[type]?.title}</h2>

                <input
                    type="text"
                    placeholder={`Search ${type}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-2 w-full p-2 rounded bg-black/30 border border-white/10"
                />
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-gray-400 text-sm">Loading...</div>
            )}

            {/* LIST */}
            <div className="space-y-3">
                {filtered.map((item) => {
                    const comp = checkCompatibility(type, item, selected);
                    const isSelected = selected[type]?.id === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`p-4 rounded-lg border transition ${isSelected
                                    ? "border-purple-500 bg-purple-500/10"
                                    : comp.status === "blocked"
                                        ? "border-red-500 bg-red-500/10 opacity-70"
                                        : comp.status === "warning"
                                            ? "border-yellow-500 bg-yellow-500/10"
                                            : "border-white/10 bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            {/* TOP */}
                            <div className="flex justify-between items-center">

                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSelect(item)}
                                    disabled={comp.status === "blocked"}
                                    className={`px-4 py-2 rounded ${comp.status === "blocked"
                                            ? "bg-red-500/30 cursor-not-allowed"
                                            : isSelected
                                                ? "bg-purple-600"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {isSelected
                                        ? "Selected"
                                        : comp.status === "blocked"
                                            ? "Unavailable"
                                            : "Select"}
                                </button>

                            </div>

                            {/* META */}
                            <div className="mt-2 text-xs text-gray-400 flex gap-4 flex-wrap">
                                {item.brand && <span>Brand: {item.brand}</span>}
                                {item.socket && <span>Socket: {item.socket}</span>}
                                {item.ram_type && <span>RAM: {item.ram_type}</span>}
                            </div>

                            {/* STATUS */}
                            <div className="mt-2 text-sm">
                                {comp.status === "warning" && (
                                    <span className="text-yellow-400">{comp.message}</span>
                                )}
                                {comp.status === "blocked" && (
                                    <span className="text-red-400">{comp.message}</span>
                                )}
                                {comp.status === "compatible" && (
                                    <span className="text-green-400">Compatible</span>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}