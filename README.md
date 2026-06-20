# 🚀 InventoryX – Enterprise Inventory & PC Builder Platform

**InventoryX** is a full-stack, enterprise-grade **Inventory Management System integrated with an intelligent PC Builder engine**, designed to simulate real-world business workflows with secure architecture, scalable backend design, and a modern user experience.

This project demonstrates **production-level engineering practices**, including role-based systems, modular APIs, and domain-specific logic (hardware compatibility engine).

 

## 📌 Project Overview

InventoryX enables organizations to:

* Efficiently manage inventory and product lifecycle
* Handle user orders and transactions
* Enforce role-based system access
* Build custom PC configurations with real-time compatibility validation

It reflects a **hybrid system combining e-commerce workflows with inventory control and system configuration logic**.

 

## 🧠 Core Capabilities

### 🔐 Authentication & Authorization

* Secure JWT-based authentication
* Role-based access control (`Admin` / `User`)
* Protected backend routes and frontend guards
* Encrypted password storage using bcrypt

 

### 👤 User System

* Seamless registration and login flow
* Intelligent dashboard with personalized insights
* Product browsing with category filtering
* Real-time stock visibility indicators
* Cart management (add, update, remove)
* Order placement and lifecycle tracking
* Order cancellation with immediate UI updates

 

### 🛠️ Admin System

* Dedicated admin dashboard with system insights
* Full product lifecycle management (CRUD)
* Inventory and stock monitoring
* Supplier and transaction handling
* Data-driven reporting via REST APIs
* Real-time low-stock alerts

 

### 🧠 PC Builder Engine (Advanced Module)

A specialized feature inspired by real-world platforms like PCPartPicker:

* Component-based configuration system:

  * CPU, Motherboard, RAM, GPU, Storage, PSU
* Compatibility validation engine:

  * CPU ↔ Motherboard (Socket matching)
  * RAM ↔ Motherboard (Type validation)
  * PSU wattage sufficiency checks
* Dynamic pricing system
* Full build integration into cart workflow

 

## 🏗️ System Architecture

The application follows a **modular full-stack architecture** ensuring scalability and maintainability:

```
InventoryX/
│
├── backend/
│   ├── controllers/      # Business logic layer
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & security layer
│   ├── db.js             # Database connection
│   └── server.js         # Entry point
│
├── frontend/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-based views
│   ├── user/             # User module
│   ├── pcbuilder/        # PC Builder logic
│   ├── Context/          # Global state management
│   └── services/         # API integrations
│
└── database/
    ├── schema.sql
    └── seed_data.sql
```

 

## ⚙️ Technology Stack

### Frontend

* React (Vite) – High-performance UI framework
* React Router – Client-side routing
* Axios – API communication
* Context API – State management
* Framer Motion – UI animations

 

### Backend

* Node.js – Runtime environment
* Express.js – REST API framework
* MySQL – Relational database
* JWT – Authentication mechanism
* bcrypt – Secure password hashing

 

## 🔄 System Workflow

1. User authentication via JWT
2. Role-based routing (Admin/User)
3. Product browsing or PC configuration
4. Cart operations and validation
5. Order placement
6. Order lifecycle tracking
7. Admin-side inventory and analytics management

 

## 📊 API Design

The backend exposes structured REST APIs:

* **Authentication**

  * `/api/auth/login`
  * `/api/auth/register`

* **Products**

  * `/api/products/*`

* **Cart**

  * `/api/cart/*`

* **Orders**

  * `/api/orders/*`

* **Dashboard Analytics**

  * `/api/dashboard/summary`
  * `/api/dashboard/low-stock`
  * `/api/dashboard/top-products`
  * `/api/dashboard/monthly-sales`

 

## 🎨 User Experience & Design

* Modern dark-themed interface
* Glassmorphism UI elements
* Smooth transitions and animations
* Responsive dashboard layouts
* Clean separation between user and admin interfaces

 

## 🎯 Practical Applications

This system is suitable for:

* Inventory management solutions for small businesses
* E-commerce backend simulation
* Hardware configuration platforms
* Academic and portfolio demonstrations of full-stack expertise

 

## 🚀 Future Roadmap

* Payment gateway integration (Stripe/Razorpay)
* Real-time updates using WebSockets
* Email notification system
* Advanced analytics dashboard
* Cloud-native deployment (AWS / Docker)
* AI-based configuration recommendations

 

## ⚙️ Setup & Installation

```bash
# Clone repository
git clone https://github.com/YashSurve2006/Inventory-Management-Website.git

# Backend setup
cd backend
npm install
npm start

# Frontend setup
cd frontend
npm install
npm run dev
```

Configure database credentials in `db.js` before running.

 

## 📌 Key Strengths of This Project

* Demonstrates **full-stack system design**
* Implements **real-world business logic**
* Showcases **secure authentication practices**
* Includes **domain-specific problem solving (PC Builder)**
* Built with **scalable and modular architecture**

 

## 👨‍💻 Author

**Yash Surve**
Computer Science Student | Full Stack Developer | Networking Enthusiast

 

## 📄 License

This project is developed for **educational and demonstration purposes**.

 
