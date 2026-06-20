import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { motion } from "framer-motion";

import {
    getCart,
    getMyOrders
} from "../../api";

/* ======================================================
   SAFE USER LOADER
====================================================== */

function getUserFromStorage() {

    try {

        const saved =
            localStorage.getItem(
                "ix_user"
            );

        if (!saved)
            return null;

        return JSON.parse(saved);

    }

    catch {

        return null;

    }

}

/* ======================================================
   MAIN DASHBOARD
====================================================== */

export default function UserDashboard() {

    const navigate =
        useNavigate();

    /* ================= STATE ================= */

    const [username,
        setUsername] =
        useState("User");

    const [cartCount,
        setCartCount] =
        useState(0);

    const [orders,
        setOrders] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    /* ======================================================
       LOAD USER
    ====================================================== */

    useEffect(() => {

        const user =
            getUserFromStorage();

        if (user?.name)
            setUsername(user.name);

        else if (user?.username)
            setUsername(user.username);

    }, []);

    /* ======================================================
       LOAD DASHBOARD DATA
    ====================================================== */

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const [

                cartRes,
                orderRes

            ] =
            await Promise.all([

                getCart(),
                getMyOrders()

            ]);

            /* ---------------- CART SAFE ---------------- */

            const cartData =
                cartRes.data;

            let cartItems =
                [];

            if (
                Array.isArray(cartData)
            )
                cartItems =
                    cartData;

            else if (
                cartData.cart
            )
                cartItems =
                    cartData.cart;

            else if (
                cartData.items
            )
                cartItems =
                    cartData.items;

            setCartCount(
                cartItems.length
            );

            /* ---------------- ORDERS SAFE ---------------- */

            const orderData =
                orderRes.data;

            let orderItems =
                [];

            if (
                Array.isArray(orderData)
            )
                orderItems =
                    orderData;

            else if (
                orderData.orders
            )
                orderItems =
                    orderData.orders;

            else if (
                orderData.data
            )
                orderItems =
                    orderData.data;

            setOrders(
                orderItems
            );

        }

        catch (err) {

            console.error(
                "Dashboard load failed",
                err
            );

        }

        finally {

            setLoading(false);

        }

    }

    /* ======================================================
       LAST ORDER
    ====================================================== */

    const lastOrder =
        orders.length > 0
            ? orders[0]
            : {
                id: "—",
                status:
                    "No Orders",
                eta: "—"
            };

    const today =
        new Date()
            .toDateString();

    /* ======================================================
       NAVIGATION
    ====================================================== */

    const goBrowseProducts =
        () =>
            navigate(
                "/browse-products"
            );

    const goCart =
        () =>
            navigate(
                "/cart"
            );

    const goMyOrders =
        () =>
            navigate(
                "/my-orders"
            );

    const goPCBuilder =
        () =>
            navigate(
                "/pc-builder"
            );

    const goProfile =
        () =>
            navigate(
                "/profile"
            );

    /* ======================================================
       LOADING UI
    ====================================================== */

    if (loading) {

        return (

            <UserLayout>

                <div
                    style={
                        loadingBox
                    }
                >

                    Loading dashboard...

                </div>

            </UserLayout>

        );

    }

    /* ======================================================
       UI
    ====================================================== */

    return (

        <UserLayout>

            {/* HEADER */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 10
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                style={
                    header
                }
            >

                <h1
                    style={
                        greeting
                    }
                >

                    Welcome,

                    <span
                        style={
                            highlight
                        }
                    >

                        {" "}
                        {username}

                    </span>

                </h1>

                <p
                    style={
                        subText
                    }
                >

                    {today}
                    {" • "}
                    Your dashboard overview

                </p>

            </motion.div>

            {/* STATS */}

            <div
                style={
                    statsGrid
                }
            >

                <StatCard
                    value={
                        cartCount
                    }
                    label="Items in Cart"
                    desc="Ready for checkout"
                />

                <StatCard
                    value={
                        orders.length
                    }
                    label="Total Orders"
                    desc="Placed successfully"
                />

                <StatCard
                    value={
                        lastOrder.status
                    }
                    label="Last Order Status"
                    desc="Latest order update"
                />

                <StatCard
                    value={
                        lastOrder.eta
                    }
                    label="Estimated Delivery"
                    desc="Delivery timeline"
                />

            </div>

            {/* LATEST ORDER */}

            <motion.div
                style={
                    orderCard
                }
            >

                <h3
                    style={
                        sectionTitle
                    }
                >

                    Latest Order

                </h3>

                <div
                    style={
                        orderRow
                    }
                >

                    <span
                        style={
                            orderId
                        }
                    >

                        {lastOrder.id}

                    </span>

                    <span
                        style={
                            orderBadge
                        }
                    >

                        {lastOrder.status}

                    </span>

                </div>

                <p
                    style={
                        orderDesc
                    }
                >

                    Track your order progress in real time.

                </p>

            </motion.div>

            {/* QUICK ACTIONS */}

            <motion.div
                style={
                    bottomGrid
                }
            >

                <div
                    style={
                        bottomCard
                    }
                >

                    <h3
                        style={
                            sectionTitle
                        }
                    >

                        Quick Actions

                    </h3>

                    <div
                        style={
                            actionGrid
                        }
                    >

                        <ActionItem
                            text="Browse Products"
                            onClick={
                                goBrowseProducts
                            }
                        />

                        <ActionItem
                            text="View Cart"
                            onClick={
                                goCart
                            }
                        />

                        <ActionItem
                            text="Track Orders"
                            onClick={
                                goMyOrders
                            }
                        />

                        <ActionItem
                            text="PC Builder"
                            onClick={
                                goPCBuilder
                            }
                        />

                        <ActionItem
                            text="Profile Settings"
                            onClick={
                                goProfile
                            }
                        />

                    </div>

                </div>

                <div
                    style={
                        bottomCard
                    }
                >

                    <h3
                        style={
                            sectionTitle
                        }
                    >

                        Account Insights

                    </h3>

                    <ul
                        style={
                            insightList
                        }
                    >

                        <li>
                            • You have
                            {" "}
                            <b>
                                {cartCount}
                            </b>
                            {" "}
                            item(s) in your cart
                        </li>

                        <li>
                            • Orders can be tracked anytime
                        </li>

                        <li>
                            • Inventory updates in real time
                        </li>

                        <li>
                            • Secure checkout enabled
                        </li>

                    </ul>

                </div>

            </motion.div>

        </UserLayout>

    );

}

/* ======================================================
   COMPONENTS
====================================================== */

function StatCard({
    value,
    label,
    desc
}) {

    return (

        <motion.div
            whileHover={{
                y: -6
            }}
            style={
                statCard
            }
        >

            <div
                style={
                    statValue
                }
            >

                {value}

            </div>

            <div
                style={
                    statLabel
                }
            >

                {label}

            </div>

            <div
                style={
                    statDesc
                }
            >

                {desc}

            </div>

        </motion.div>

    );

}

function ActionItem({
    text,
    onClick
}) {

    return (

        <motion.div
            whileHover={{
                scale: 1.05
            }}
            whileTap={{
                scale: 0.97
            }}
            onClick={
                onClick
            }
            style={
                actionItem
            }
        >

            {text}

        </motion.div>

    );

}

/* ======================================================
   STYLES
====================================================== */

const loadingBox = {
    padding: 40,
    fontSize: 20,
    color: "#94a3b8"
};

const header = {
    marginBottom: 36
};

const greeting = {
    fontSize: 34,
    fontWeight: 900,
    color: "#ffffff"
};

const highlight = {
    background:
        "linear-gradient(90deg,#22c55e,#4ade80)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
};

const subText = {
    marginTop: 6,
    color: "#c7d2fe"
};

const statsGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 22,
    marginBottom: 36
};

const statCard = {
    background:
        "rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 24
};

const statValue = {
    fontSize: 32,
    fontWeight: 900,
    color: "#ffffff"
};

const statLabel = {
    fontSize: 15,
    fontWeight: 700,
    color: "#e5e7eb"
};

const statDesc = {
    fontSize: 12,
    color: "#94a3b8"
};

const orderCard = {
    background:
        "rgba(255,255,255,0.07)",
    borderRadius: 24,
    padding: 26,
    marginTop: 30
};

const sectionTitle = {
    fontSize: 18,
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: 14
};

const orderRow = {
    display: "flex",
    justifyContent: "space-between"
};

const orderId = {
    fontWeight: 700,
    color: "#e5e7eb"
};

const orderBadge = {
    padding: "6px 12px",
    borderRadius: 999,
    background: "#064e3b",
    color: "#bbf7d0"
};

const orderDesc = {
    color: "#cbd5f5"
};

const bottomGrid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 26,
    marginTop: 40
};

const bottomCard = {
    background:
        "rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 24
};

const actionGrid = {
    display: "grid",
    gridTemplateColumns:
        "1fr 1fr",
    gap: 14
};

const actionItem = {
    padding: 14,
    borderRadius: 14,
    background:
        "rgba(255,255,255,0.12)",
    color: "#ffffff",
    textAlign: "center",
    fontWeight: 600,
    cursor: "pointer"
};

const insightList = {
    listStyle: "none",
    padding: 0,
    color: "#e5e7eb",
    lineHeight: 1.9
};