# 🏬 Inventory Management Website

A full-stack **Inventory Management System** designed to efficiently manage products, carts, orders, and user roles.  
The application provides **separate dashboards for users and administrators**, ensuring secure access, clarity of responsibilities, and a smooth user experience.

This project demonstrates modern web development practices with a clean UI, structured workflow, and role-based access control.

---

## ✨ Features

### 👤 User Panel
- Secure login and registration
- Role-based redirection after login
- Browse available products
- Search and filter products by category
- Live stock indicators (In Stock / Low Stock / Out of Stock)
- Add products to cart
- Update cart items dynamically
- Remove products from cart
- Place orders directly from cart
- Order tracking interface
- User dashboard displaying:
  - Cart summary
  - Total orders overview
  - Latest order status
  - Estimated delivery information
- Smooth animations and modern UI design

---

### 🛠️ Admin Panel
- Role-based admin access
- Dedicated admin dashboard
- Product management (add, update, delete)
- Inventory quantity management
- Supplier management
- Transaction overview and monitoring
- Protected admin-only routes

---

## 🔐 Security
- Role-based access control (`user` / `admin`)
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected backend APIs
- Secure frontend route handling

---

## 🧱 Technology Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Framer Motion
- Modern CSS styling

### Backend
- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT)
- bcrypt

---

## 🔄 Application Workflow

1. User logs in or registers
2. System verifies user role
3. User is redirected to:
   - User Dashboard (regular users)
   - Admin Dashboard (administrators)
4. Users browse products and manage cart
5. Orders are placed from the cart
6. Users track order status
7. Admin manages inventory and system data

---

## 🎨 User Interface Highlights
- Glassmorphism-style cards
- Responsive dashboard layout
- Animated transitions
- Clean and minimal design
- Clear separation between user and admin views

---

## 🎯 Use Case

This project is ideal for:
- Academic submissions
- Demonstrating full-stack development skills
- Learning role-based authentication and authorization
- Portfolio and resume projects

---

## 🚀 Future Enhancements
- Online payment integration
- Real-time order status updates
- Email notifications
- Advanced analytics and reporting
- Cloud deployment

---

## 📜 License

This project is intended for **educational and demonstration purposes**.
