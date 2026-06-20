import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/user",
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
    const saved = localStorage.getItem("ix_user");
    if (saved) {
        const { token } = JSON.parse(saved);
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }
    return req;
});

export const getUserProducts = async () => {
    return API.get("/products");
};
