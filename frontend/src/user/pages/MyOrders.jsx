import { useState } from "react";
import UserLayout from "../components/UserLayout";
import { motion, AnimatePresence } from "framer-motion";

/* 🔒 DEMO DATA – LOCKED FOR PRESENTATION */
const ORDERS = [
    {
        id: "ORD-1021",
        date: "12 Mar 2026",
        total: 76400,
        status: "Shipped",
        items: ["Laptop Pro 15", "Wireless Mouse"],
    },
    {
        id: "ORD-1014",
        date: "05 Mar 2026",
        total: 9800,
        status: "Delivered",
        items: ["Office Chair"],
    },
    {
        id: "ORD-1002",
        date: "28 Feb 2026",
        total: 4200,
        status: "Pending",
        items: ["Mechanical Keyboard"],
    },
];

const FLOW = ["Pending", "Approved", "Shipped", "Delivered"];

export default function MyOrders() {
    const [open, setOpen] = useState(null);

    return (
        <UserLayout>
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={header}
            >
                <h1 style={title}>My Orders</h1>
                <p style={subtitle}>Track & review your purchases</p>
            </motion.div>

            {/* ORDER LIST */}
            <div style={list}>
                {ORDERS.map((order) => {
                    const progress =
                        ((FLOW.indexOf(order.status) + 1) / FLOW.length) * 100;

                    return (
                        <motion.div
                            key={order.id}
                            layout
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35 }}
                            style={card}
                        >
                            {/* TOP */}
                            <div style={topRow}>
                                <div>
                                    <h3 style={orderId}>{order.id}</h3>
                                    <span style={date}>{order.date}</span>
                                </div>

                                <div style={right}>
                                    <span style={{ ...badge, ...badgeStyle(order.status) }}>
                                        {order.status}
                                    </span>
                                    <span style={amount}>₹{order.total}</span>
                                </div>
                            </div>

                            {/* PROGRESS */}
                            <div style={progressWrap}>
                                <motion.div
                                    style={progressBar}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>

                            {/* ACTION */}
                            <button
                                style={trackBtn}
                                onClick={() =>
                                    setOpen(open === order.id ? null : order.id)
                                }
                            >
                                {open === order.id ? "Hide Tracking" : "Track Order"}
                            </button>

                            {/* EXPAND */}
                            <AnimatePresence>
                                {open === order.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35 }}
                                        style={details}
                                    >
                                        {/* TIMELINE */}
                                        <div style={timeline}>
                                            {FLOW.map((step) => (
                                                <TimelineStep
                                                    key={step}
                                                    label={step}
                                                    active={
                                                        FLOW.indexOf(step) <=
                                                        FLOW.indexOf(order.status)
                                                    }
                                                />
                                            ))}
                                        </div>

                                        {/* ITEMS */}
                                        <div>
                                            <h4 style={sectionTitle}>Items</h4>
                                            <ul style={items}>
                                                {order.items.map((i, idx) => (
                                                    <li key={idx}>• {i}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </UserLayout>
    );
}

/* ---------------- COMPONENTS ---------------- */

function TimelineStep({ label, active }) {
    return (
        <div style={step}>
            <motion.div
                animate={{
                    scale: active ? 1.1 : 1,
                    boxShadow: active
                        ? "0 0 16px rgba(34,197,94,0.8)"
                        : "none",
                }}
                style={{
                    ...circle,
                    background: active ? "#22c55e" : "#334155",
                }}
            />
            <span
                style={{
                    ...stepLabel,
                    color: active ? "#e5e7eb" : "#64748b",
                }}
            >
                {label}
            </span>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const header = { marginBottom: "32px" };

const title = {
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff",
};

const subtitle = {
    color: "#c7d2fe",
    marginTop: "6px",
};

const list = {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
};

const card = {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    borderRadius: "22px",
    padding: "22px",
};

const topRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
};

const orderId = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
};

const date = {
    fontSize: "13px",
    color: "#94a3b8",
};

const right = { textAlign: "right" };

const badge = {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    display: "inline-block",
    marginBottom: "6px",
};

const amount = {
    display: "block",
    fontWeight: "700",
    color: "#ffffff",
};

const progressWrap = {
    height: "6px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "16px",
};

const progressBar = {
    height: "100%",
    background: "linear-gradient(90deg,#22c55e,#4ade80)",
};

const trackBtn = {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#ffffff",
    cursor: "pointer",
    marginBottom: "10px",
};

const details = {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: "18px",
};

const timeline = {
    display: "flex",
    gap: "28px",
    marginBottom: "20px",
};

const step = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
};

const circle = {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
};

const stepLabel = {
    fontSize: "12px",
};

const sectionTitle = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "10px",
};

const items = {
    listStyle: "none",
    padding: 0,
    color: "#e5e7eb",
    lineHeight: "1.8",
};

/* STATUS COLORS */
function badgeStyle(status) {
    switch (status) {
        case "Pending":
            return { background: "#78350f", color: "#fde68a" };
        case "Approved":
            return { background: "#1e3a8a", color: "#bfdbfe" };
        case "Shipped":
            return { background: "#064e3b", color: "#bbf7d0" };
        case "Delivered":
            return { background: "#022c22", color: "#86efac" };
        default:
            return {};
    }
}
