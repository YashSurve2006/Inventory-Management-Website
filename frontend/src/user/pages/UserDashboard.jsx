import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import { getCart } from "../../api";
import { motion } from "framer-motion";

/* TEMP LAST ORDER (LOCKED AS REQUESTED) */
const LAST_ORDER = {
    id: "ORD-1021",
    status: "Shipped",
    eta: "2 Days",
    items: ["Printer Ink Cartridge"],
};

export default function UserDashboard() {
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    async function fetchCart() {
        try {
            const res = await getCart();
            setCartCount(res.data.length);
        } catch {
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    }

    const today = new Date().toDateString();

    return (
        <UserLayout>
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={header}
            >
                <h1 style={greeting}>
                    Good afternoon, <span style={highlight}>User</span>
                </h1>
                <p style={subText}>
                    {today} • Here’s a quick overview of your account activity
                </p>
            </motion.div>

            {/* STATS */}
            <div style={statsGrid}>
                <StatCard
                    value={loading ? "…" : cartCount}
                    label="Items in Cart"
                    desc={
                        cartCount > 0
                            ? "Ready for checkout"
                            : "Your cart is empty"
                    }
                />

                <StatCard
                    value="5"
                    label="Total Orders"
                    desc="Placed so far"
                />

                <StatCard
                    value={LAST_ORDER.status}
                    label="Last Order Status"
                    desc="Currently in transit"
                />

                <StatCard
                    value={LAST_ORDER.eta}
                    label="Estimated Delivery"
                    desc="Based on latest update"
                />
            </div>

            {/* LAST ORDER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={orderCard}
            >
                <h3 style={sectionTitle}>Latest Order</h3>

                <div style={orderRow}>
                    <span style={orderId}>{LAST_ORDER.id}</span>
                    <span style={orderBadge}>{LAST_ORDER.status}</span>
                </div>

                <p style={orderDesc}>
                    Your order is currently <b>on the way</b>. Estimated delivery
                    within <b>{LAST_ORDER.eta}</b>.
                </p>

                <ul style={itemList}>
                    {LAST_ORDER.items.map((i, idx) => (
                        <li key={idx}>• {i}</li>
                    ))}
                </ul>
            </motion.div>

            {/* QUICK ACTIONS & INSIGHTS */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={bottomGrid}
            >
                {/* QUICK ACTIONS */}
                <div style={bottomCard}>
                    <h3 style={sectionTitle}>Quick Actions</h3>

                    <div style={actionGrid}>
                        <ActionItem text="Browse Products" />
                        <ActionItem text="View Cart" />
                        <ActionItem text="Track Orders" />
                        <ActionItem text="Need Support?" />
                    </div>
                </div>

                {/* INSIGHTS */}
                <div style={bottomCard}>
                    <h3 style={sectionTitle}>Account Insights</h3>

                    <ul style={insightList}>
                        <li>• You have <b>{cartCount}</b> item(s) waiting in your cart</li>
                        <li>• Prices and stock update in real time</li>
                        <li>• Orders can be tracked from the Orders page</li>
                        <li>• Contact support for bulk or urgent requests</li>
                    </ul>
                </div>
            </motion.div>
        </UserLayout>
    );
}

/* ================= COMPONENTS ================= */

function StatCard({ value, label, desc }) {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 220 }}
            style={statCard}
        >
            <div style={statValue}>{value}</div>
            <div style={statLabel}>{label}</div>
            <div style={statDesc}>{desc}</div>
        </motion.div>
    );
}

function ActionItem({ text }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={actionItem}
        >
            {text}
        </motion.div>
    );
}

/* ================= STYLES ================= */

const header = { marginBottom: "36px" };

const greeting = {
    fontSize: "36px",
    fontWeight: "900",
    color: "#ffffff",
};

const highlight = {
    background: "linear-gradient(90deg,#22c55e,#4ade80)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
};

const subText = { marginTop: "6px", color: "#c7d2fe" };

const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "22px",
    marginBottom: "36px",
};

const statCard = {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "26px",
};

const statValue = { fontSize: "36px", fontWeight: "900", color: "#ffffff" };
const statLabel = { fontSize: "15px", fontWeight: "700", color: "#e5e7eb" };
const statDesc = { fontSize: "12px", color: "#94a3b8" };

const orderCard = {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "26px",
    padding: "28px",
    marginTop: "30px",
};

const sectionTitle = {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "14px",
};

const orderRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
};

const orderId = { fontWeight: "700", color: "#e5e7eb" };

const orderBadge = {
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#064e3b",
    color: "#bbf7d0",
    fontSize: "12px",
};

const orderDesc = { color: "#cbd5f5", marginBottom: "12px" };

const itemList = {
    listStyle: "none",
    padding: 0,
    color: "#e5e7eb",
    lineHeight: "1.8",
};

const bottomGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "26px",
    marginTop: "40px",
};

const bottomCard = {
    background: "rgba(255,255,255,0.06)",
    borderRadius: "26px",
    padding: "26px",
};

const actionGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
};

const actionItem = {
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
    cursor: "pointer",
};

const insightList = {
    listStyle: "none",
    padding: 0,
    color: "#e5e7eb",
    lineHeight: "1.9",
    fontSize: "14px",
};
