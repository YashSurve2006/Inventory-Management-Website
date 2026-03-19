import axios from "axios";

export const API_URL = "http://localhost:5000/api";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

/* =====================================================
   🔐 AUTH TOKEN INTERCEPTOR
   Reads token from ix_user
===================================================== */
api.interceptors.request.use(
    (config) => {

        const saved = localStorage.getItem("ix_user");

        if (saved) {
            try {

                const user = JSON.parse(saved);

                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }

            } catch (err) {
                console.error("Token parse error", err);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ===================== AUTH ===================== */

export const loginUser = (data) =>
    api.post("/auth/login", data);

export const registerUser = (data) =>
    api.post("/auth/register", data);

/* ===================== PRODUCTS ===================== */

export const addProduct = (data) =>
    api.post("/products/add", data);

export const getProducts = () =>
    api.get("/products");

export const updateProduct = (id, data) =>
    api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
    api.delete(`/products/${id}`);

/* ===================== SUPPLIERS ===================== */

export const addSupplier = (data) =>
    api.post("/suppliers/add", data);

export const getSuppliers = () =>
    api.get("/suppliers");

/* ===================== TRANSACTIONS ===================== */

export const addTransaction = (data) =>
    api.post("/transactions/add", data);

export const getTransactions = () =>
    api.get("/transactions");

/* ===================== DASHBOARD ===================== */

// ================= DASHBOARD =================

// summary cards
export const getDashboardSummary = () =>
    api.get("/dashboard/summary");

// top products
export const getTopSellingProducts = () =>
    api.get("/dashboard/top-products");

// low stock
export const getLowStockProducts = () =>
    api.get("/dashboard/low-stock");

// recent activity
export const getRecentActivity = () =>
    api.get("/dashboard/recent-activity");

// category stock chart
export const getCategoryStock = () =>
    api.get("/dashboard/category-stock");

// monthly sales chart
export const getMonthlySales = () =>
    api.get("/dashboard/monthly-sales");

/* ===================== CART ===================== */

export const addToCart = (productId) =>
    api.post("/cart/add", { productId });

export const getCart = () =>
    api.get("/cart");

export const updateCartQty = (data) =>
    api.put("/cart/update", data);

export const removeFromCart = (productId) =>
    api.delete(`/cart/${productId}`);

/* ===================== ORDERS ===================== */

export const placeOrder = () =>
    api.post("/user/orders/place");

export const getMyOrders = () =>
    api.get("/user/orders/my");

export const cancelOrder = (orderId) =>
    api.delete(`/user/orders/${orderId}`);

/* ===================== EXPORT ===================== */

export default api;