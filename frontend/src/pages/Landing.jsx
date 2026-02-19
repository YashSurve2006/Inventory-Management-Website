import React from "react";
import { Link } from "react-router-dom";
export default function Landing() {
    return (
        <div className="w-full min-h-screen text-slate-800">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl" />
                <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-8 py-32 text-white">
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Inventory<span className="text-yellow-300">X</span>
                    </h1>

                    <p className="max-w-3xl text-xl text-white/90 leading-relaxed mb-6">
                        A modern, web-based inventory management system designed to simplify,
                        automate, and centralize inventory operations for organizations.
                    </p>

                    <p className="max-w-3xl text-white/80 leading-relaxed mb-10">
                        InventoryX enables administrators and users to manage products,
                        suppliers, orders, and transactions efficiently through a secure,
                        role-based, and scalable platform.
                    </p>

                    <div className="flex gap-5">
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-semibold shadow-lg hover:bg-slate-100 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-4 rounded-xl bg-black/30 backdrop-blur border border-white/30 font-semibold hover:bg-black/40 transition"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= PROBLEM & SOLUTION ================= */}
            <section className="bg-gradient-to-b from-slate-50 to-blue-50 py-24">
                <div className="max-w-7xl mx-auto px-8">

                    <div className="max-w-4xl mb-20">
                        <h2 className="text-3xl font-bold mb-6">Problem Statement</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Many organizations still depend on spreadsheets, paper registers,
                            or disconnected tools to manage inventory and orders. These manual
                            methods often lead to inaccurate data, duplicate entries, lack of
                            real-time visibility, and delayed decision-making.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            As business operations grow, managing inventory manually becomes
                            inefficient and error-prone, highlighting the need for a secure,
                            centralized, and automated inventory management system.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-6">Proposed Solution</h2>
                        <p className="max-w-4xl text-slate-600 leading-relaxed mb-12">
                            InventoryX provides a complete role-based solution where
                            administrators and users interact with the system through
                            dedicated dashboards, ensuring data security, transparency, and
                            operational efficiency.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Centralized Data Management",
                                    color: "text-blue-700",
                                    desc: "All products, suppliers, orders, and transactions are stored in a single database, ensuring consistency and reliability."
                                },
                                {
                                    title: "Secure Role-Based Access",
                                    color: "text-teal-700",
                                    desc: "Different permissions for admins and users prevent unauthorized access and improve system security."
                                },
                                {
                                    title: "Efficient Order Processing",
                                    color: "text-purple-700",
                                    desc: "Users can place and track orders while administrators monitor transactions in real time."
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-6 border hover:shadow-xl transition"
                                >
                                    <h3 className={`text-xl font-semibold mb-3 ${item.color}`}>
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ================= CORE CAPABILITIES ================= */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-3xl font-bold mb-12">Core Capabilities</h2>

                    <div className="grid md:grid-cols-2 gap-12 text-slate-600">
                        <ul className="space-y-4">
                            <li>• Secure authentication using JWT</li>
                            <li>• Product and supplier management</li>
                            <li>• Cart and order placement system</li>
                            <li>• Transaction history and reports</li>
                        </ul>
                        <ul className="space-y-4">
                            <li>• RESTful API based backend</li>
                            <li>• Role-based dashboards</li>
                            <li>• Responsive and modern UI</li>
                            <li>• Scalable database-driven architecture</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================= WORKFLOW ================= */}
            <section className="bg-slate-900 py-24 text-white">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-3xl font-bold mb-6">System Workflow</h2>
                    <p className="max-w-4xl text-slate-300 leading-relaxed mb-6">
                        InventoryX follows a client-server architecture. The frontend
                        application communicates with the backend through REST APIs.
                        Authentication is handled using JWT, business logic is processed on
                        the server, and all data is stored securely in a MySQL database.
                    </p>
                    <p className="text-slate-300 font-semibold">
                        React Frontend → REST APIs → Node.js & Express → MySQL Database
                    </p>
                </div>
            </section>

            {/* ================= MODULES ================= */}
            <section className="bg-gradient-to-b from-blue-50 to-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-3xl font-bold mb-12">System Modules</h2>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-white border rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4 text-blue-700">
                                Administrator Module
                            </h3>
                            <p className="text-slate-600 mb-3">
                                The admin module provides full control over system operations.
                            </p>
                            <ul className="text-slate-600 space-y-2">
                                <li>• Manage products and suppliers</li>
                                <li>• Monitor transactions</li>
                                <li>• Generate reports</li>
                                <li>• Manage users</li>
                            </ul>
                        </div>

                        <div className="bg-white border rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4 text-teal-700">
                                User Module
                            </h3>
                            <p className="text-slate-600 mb-3">
                                The user module focuses on ease of use and order management.
                            </p>
                            <ul className="text-slate-600 space-y-2">
                                <li>• Browse products</li>
                                <li>• Add to cart and place orders</li>
                                <li>• Track order history</li>
                                <li>• Manage profile</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= TECH STACK ================= */}
            <section className="bg-gradient-to-r from-indigo-100 to-cyan-100 py-16">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                    <p className="text-slate-700">
                        React • Tailwind CSS • Node.js • Express.js • MySQL • REST APIs • JWT
                    </p>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="border-t py-10 text-center text-slate-500 text-sm">
                <p>
                    Developed by <b>Yash</b> | B.Sc. Computer Science Mini Project
                </p>
                <p className="mt-1">InventoryX © 2026</p>
            </footer>
        </div>
    );
}