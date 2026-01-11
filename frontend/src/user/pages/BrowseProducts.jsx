import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import { addToCart, getProducts } from "../../api";
import { motion, AnimatePresence } from "framer-motion";

export default function BrowseProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data);

            const uniqueCats = [
                "All",
                ...new Set(res.data.map((p) => p.category)),
            ];
            setCategories(uniqueCats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId);
            setAddedId(productId);

            // reset animation after 1.5s
            setTimeout(() => setAddedId(null), 1500);
        } catch (err) {
            console.error("Add to cart failed");
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            (category === "All" || p.category === category) &&
            p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <UserLayout>
            {/* HEADER */}
            <div style={header}>
                <h1 style={title}>Browse Products</h1>
                <p style={subtitle}>Explore available inventory</p>
            </div>

            {/* FILTERS */}
            <div style={filters}>
                <input
                    style={searchBox}
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div style={categoryRow}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            style={{
                                ...categoryBtn,
                                background:
                                    category === cat
                                        ? "linear-gradient(135deg,#6366f1,#4f46e5)"
                                        : "rgba(255,255,255,0.08)",
                                color: category === cat ? "#fff" : "#c7d2fe",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* PRODUCTS GRID */}
            <div style={grid}>
                {loading && <div style={empty}>Loading products...</div>}

                {!loading &&
                    filteredProducts.map((p) => {
                        const isAdded = addedId === p.id;

                        return (
                            <div key={p.id} style={card}>
                                <h3 style={productName}>{p.name}</h3>
                                <p style={productCategory}>{p.category}</p>

                                <div style={bottomRow}>
                                    <span style={price}>₹{p.price}</span>

                                    <motion.button
                                        onClick={() => handleAddToCart(p.id)}
                                        style={{
                                            ...addBtn,
                                            background: isAdded
                                                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                                : addBtn.background,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={
                                            isAdded
                                                ? {
                                                    boxShadow:
                                                        "0 0 18px rgba(34,197,94,0.9)",
                                                }
                                                : {}
                                        }
                                    >
                                        <AnimatePresence>
                                            {isAdded ? (
                                                <motion.span
                                                    key="added"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                >
                                                    ✓ Added
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="add"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    Add to Cart
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                            </div>
                        );
                    })}

                {!loading && filteredProducts.length === 0 && (
                    <div style={empty}>No products found</div>
                )}
            </div>
        </UserLayout>
    );
}

/* ---------------- STYLES ---------------- */

const header = { marginBottom: "32px" };
const title = { fontSize: "34px", fontWeight: "800", color: "#ffffff" };
const subtitle = { marginTop: "6px", color: "#c7d2fe" };

const filters = {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "34px",
};

const searchBox = {
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    outline: "none",
    background: "#020617",
    color: "#ffffff",
};

const categoryRow = { display: "flex", gap: "12px", flexWrap: "wrap" };

const categoryBtn = {
    padding: "8px 18px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
};

const card = {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "22px",
    padding: "22px",
};

const productName = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
};

const productCategory = {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "18px",
};

const bottomRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const price = {
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
};

const addBtn = {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#022c22",
    fontWeight: "700",
    cursor: "pointer",
};

const empty = {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
};
