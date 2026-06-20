import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import {
    getCart,
    updateCartQty,
    removeFromCart,
    placeOrder
} from "../../api";

export default function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    /* =========================
       LOAD CART
    ========================= */

    const fetchCart = async () => {
        try {

            const res = await getCart();

            // FIX: backend returns {items,total}
            setCart(res.data.items || []);

        } catch (err) {

            console.error("Failed to load cart", err);

        } finally {

            setLoading(false);

        }
    };

    /* =========================
       QUANTITY UPDATE
    ========================= */

    const handleQty = async (productId, delta) => {

        try {

            await updateCartQty({
                productId,
                delta
            });

            fetchCart();

        } catch (err) {

            console.error("Quantity update failed", err);

        }

    };

    /* =========================
       REMOVE ITEM
    ========================= */

    const handleRemove = async (productId) => {

        if (!window.confirm("Remove this item from cart?")) return;

        try {

            await removeFromCart(productId);

            fetchCart();

        } catch (err) {

            console.error("Remove failed", err);

        }

    };

    /* =========================
       CALCULATIONS
    ========================= */

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);
    /* =========================
       CHECKOUT
    ========================= */

    const handleCheckout = async () => {

        if (!cart.length || processing) return;

        try {

            setProcessing(true);

            await placeOrder();

            alert("Order placed successfully 🎉");

            fetchCart();

        } catch (err) {

            console.error("Checkout failed", err);

            alert("Failed to place order");

        } finally {

            setProcessing(false);

        }

    };

    /* =========================
       UI
    ========================= */

    return (
        <UserLayout>

            <div style={header}>
                <h1 style={title}>Your Cart</h1>
                <p style={subtitle}>Review items before checkout</p>
            </div>

            {loading && <div style={empty}>Loading cart...</div>}

            {!loading && (

                <div style={layout}>

                    {/* ================= CART ITEMS ================= */}

                    <div style={items}>

                        {!cart.length && (
                            <div style={empty}>Your cart is empty 🛒</div>
                        )}

                        {cart.map((item) => (

                            <div key={item.product_id} style={card}>

                                <div>

                                    <h3 style={itemName}>{item.name}</h3>
                                    <p style={price}>₹{item.price}</p>

                                </div>

                                <div style={qtyRow}>

                                    <button
                                        style={qtyBtn}
                                        onClick={() => handleQty(item.product_id, -1)}
                                    >
                                        −
                                    </button>

                                    <span style={qty}>{item.quantity}</span>

                                    <button
                                        style={qtyBtn}
                                        onClick={() => handleQty(item.product_id, 1)}
                                    >
                                        +
                                    </button>

                                    <button
                                        style={removeBtn}
                                        onClick={() => handleRemove(item.product_id)}
                                    >
                                        ✕
                                    </button>

                                </div>

                                <div style={lineTotal}>
                                    ₹{item.price * item.quantity}
                                </div>

                            </div>

                        ))}

                    </div>

                    {/* ================= SUMMARY ================= */}

                    <div style={summary}>

                        <h3 style={summaryTitle}>Order Summary</h3>

                        <div style={row}>
                            <span>Subtotal</span>
                            <span>
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR"
                                }).format(subtotal)}
                            </span>
                        </div>

                        <div style={row}>
                            <span>Tax (18%)</span>
                            <span>
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR"
                                }).format(tax)}
                            </span>
                        </div>

                        <div style={divider}></div>

                        <div style={totalRow}>
                            <span>Total</span>
                            <span>
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR"
                                }).format(total)}
                            </span>
                        </div>


                        <button
                            style={{
                                ...checkoutBtn,
                                opacity: !cart.length || processing ? 0.6 : 1
                            }}
                            disabled={!cart.length || processing}
                            onClick={handleCheckout}
                        >
                            {processing ? "Processing..." : "Proceed to Checkout"}
                        </button>

                    </div>

                </div>

            )}

        </UserLayout>
    );
}

/* =========================
   STYLES
========================= */

const header = { marginBottom: "30px" };

const title = {
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff"
};

const subtitle = {
    color: "#c7d2fe",
    marginTop: "6px"
};

const layout = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px"
};

const items = {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
};

const empty = {
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.06)",
    color: "#e5e7eb",
    textAlign: "center"
};

const card = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    alignItems: "center",
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)"
};

const itemName = {
    fontSize: "17px",
    fontWeight: "700",
    color: "#ffffff"
};

const price = {
    color: "#94a3b8",
    fontSize: "14px"
};

const qtyRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
};

const qtyBtn = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    fontSize: "18px",
    cursor: "pointer"
};

const removeBtn = {
    marginLeft: "6px",
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: "16px",
    cursor: "pointer"
};

const qty = {
    fontWeight: "600",
    color: "#ffffff"
};

const lineTotal = {
    textAlign: "right",
    fontWeight: "700",
    color: "#ffffff"
};

const summary = {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "26px"
};

const summaryTitle = {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "18px",
    color: "#ffffff"
};

const row = {
    display: "flex",
    justifyContent: "space-between",
    color: "#e5e7eb",
    marginBottom: "10px"
};

const divider = {
    height: "1px",
    background: "rgba(255,255,255,0.15)",
    margin: "14px 0"
};

const totalRow = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "20px"
};

const checkoutBtn = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer"
};