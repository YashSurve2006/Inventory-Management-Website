import { NavLink, useNavigate } from "react-router-dom";

export default function UserNavbar() {
    const navigate = useNavigate();

    const links = [
        { name: "Dashboard", path: "/user/dashboard" },
        { name: "Products", path: "/user/products" },
        { name: "Cart", path: "/user/cart" },
        { name: "Orders", path: "/user/orders" },
        { name: "Profile", path: "/user/profile" },
    ];

    return (
        <div style={nav}>
            {/* LOGO */}
            <div
                style={logo}
                onClick={() => navigate("/user/dashboard")}
            >
                InventoryX
            </div>

            {/* NAV LINKS */}
            <div style={menu}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        style={({ isActive }) => ({
                            ...btn,
                            background: isActive
                                ? "rgba(99,102,241,0.18)"
                                : "transparent",
                            color: isActive ? "#ffffff" : "#c7d2fe",
                        })}
                    >
                        {link.name}
                    </NavLink>
                ))}
            </div>

            {/* LOGOUT */}
            <button
                style={logout}
                onClick={() => {
                    localStorage.removeItem("ix_user");
                    navigate("/login", { replace: true });
                }}
            >
                Logout
            </button>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const nav = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 40px",
    background: "rgba(2,6,23,0.95)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
};

const logo = {
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
    cursor: "pointer",
};

const menu = {
    display: "flex",
    gap: "14px",
};

const btn = {
    padding: "8px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.25s ease",
};

const logout = {
    padding: "8px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#7f1d1d",
    color: "#fecaca",
    fontWeight: "600",
    cursor: "pointer",
};
