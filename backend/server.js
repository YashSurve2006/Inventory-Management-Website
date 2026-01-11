import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import "./db.js";

// ROUTES
import productRoutes from "./routes/products.js";
import supplierRoutes from "./routes/suppliers.js";
import transactionRoutes from "./routes/transactions.js";
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reports.js";
import userRoutes from "./routes/users.js";
import profileRoutes from "./routes/profile.js";
import dashboardRoutes from "./routes/dashboard.js";
import userProductRoutes from "./routes/user/products.js";
import userProfileRoutes from "./routes/user/profile.js";
import userOrderRoutes from "./routes/user/orders.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express(); // ✅ app FIRST

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static("uploads"));

// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

// USER MODULES
app.use("/api/user/products", userProductRoutes);
app.use("/api/user/profile", userProfileRoutes);
app.use("/api/user/orders", userOrderRoutes);

// CART
app.use("/api/cart", cartRoutes);

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
