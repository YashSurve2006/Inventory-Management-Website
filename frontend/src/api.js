import axios from "axios";

export const API_URL = "http://localhost:5000/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

/* =====================================================
   🔐 AUTH TOKEN INTERCEPTOR (LOCKED)
   Reads token ONLY from ix_user
===================================================== */
api.interceptors.request.use(
    (config) => {
        const saved = localStorage.getItem("ix_user");
        if (saved) {
            const user = JSON.parse(saved);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
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

/* ===================== CART (LOCKED) ===================== */
export const addToCart = (productId) =>
    api.post("/cart/add", { productId });

export const getCart = () =>
    api.get("/cart");

export const updateCartQty = (productId, delta) =>
    api.put("/cart/update", { productId, delta });

export const removeFromCart = (productId) =>
    api.delete(`/cart/remove/${productId}`);

/* ===================== ORDERS (FIXED & LOCKED) ===================== */
export const placeOrder = () =>
    api.post("/user/orders/place");

export const getMyOrders = () =>
    api.get("/user/orders/my");
