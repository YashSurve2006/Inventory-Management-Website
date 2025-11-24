import axios from "axios";

export const API_URL = "http://localhost:5000/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("ix_token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // ignore
    }
    return config;
}, (error) => Promise.reject(error));

// PRODUCTS
export const addProduct = (data) => api.post("/products/add", data);
export const getProducts = () => api.get("/products");
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// SUPPLIERS
export const addSupplier = (data) => api.post("/suppliers/add", data);
export const getSuppliers = () => api.get("/suppliers");

// TRANSACTIONS
export const addTransaction = (data) => api.post("/transactions/add", data);
export const getTransactions = () => api.get("/transactions");

// AUTH
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const updateProduct = (id, data) =>
    api.put(`/products/${id}`, data);
