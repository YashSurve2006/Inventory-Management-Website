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

            const res =
                await getProducts();

            setProducts(res.data);

            const uniqueCats = [
                "All",
                ...new Set(
                    res.data.map(
                        (p) => p.category
                    )
                ),
            ];

            setCategories(
                uniqueCats
            );

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    const handleAddToCart =
        async (productId) => {

            try {

                await addToCart(
                    productId
                );

                setAddedId(
                    productId
                );

                setTimeout(
                    () =>
                        setAddedId(null),
                    1500
                );

            }

            catch {

                console.error(
                    "Add to cart failed"
                );

            }

        };

    const filteredProducts =
        products.filter(
            (p) =>
                (
                    category ===
                        "All" ||
                    p.category ===
                        category
                ) &&
                p.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );

    return (

        <UserLayout>

            {/* HEADER */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 12
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.4
                }}
                style={header}
            >

                <h1 style={title}>

                    Browse Products

                </h1>

                <p style={subtitle}>

                    Discover and add items to your cart instantly

                </p>

            </motion.div>

            {/* FILTERS */}

            <div style={filters}>

                <input
                    style={searchBox}
                    placeholder="🔍 Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <div style={categoryRow}>

                    {categories.map(
                        (cat) => (

                            <motion.button
                                key={cat}
                                whileHover={{
                                    scale: 1.05
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={() =>
                                    setCategory(
                                        cat
                                    )
                                }
                                style={{
                                    ...categoryBtn,

                                    background:
                                        category ===
                                        cat
                                            ? activeGradient
                                            : inactiveGradient,

                                    color:
                                        category ===
                                        cat
                                            ? "#fff"
                                            : "#c7d2fe",
                                }}
                            >

                                {cat}

                            </motion.button>

                        )
                    )}

                </div>

            </div>

            {/* PRODUCTS GRID */}

            <div style={grid}>

                {loading &&

                    [...Array(6)].map(
                        (_, i) => (

                            <SkeletonCard
                                key={i}
                            />

                        )
                    )

                }

                {!loading &&
                    filteredProducts.map(
                        (p) => {

                            const isAdded =
                                addedId ===
                                p.id;

                            return (

                                <motion.div
                                    key={p.id}
                                    style={card}
                                    whileHover={{
                                        y: -6
                                    }}
                                >

                                    <div>

                                        <h3
                                            style={
                                                productName
                                            }
                                        >

                                            {p.name}

                                        </h3>

                                        <p
                                            style={
                                                productCategory
                                            }
                                        >

                                            {p.category}

                                        </p>

                                    </div>

                                    <div
                                        style={
                                            bottomRow
                                        }
                                    >

                                        <span
                                            style={
                                                price
                                            }
                                        >

                                            ₹{p.price}

                                        </span>

                                        <motion.button
                                            onClick={() =>
                                                handleAddToCart(
                                                    p.id
                                                )
                                            }
                                            style={{
                                                ...addBtn,

                                                background:
                                                    isAdded
                                                        ? successGradient
                                                        : addBtn.background,
                                            }}
                                            whileTap={{
                                                scale: 0.95
                                            }}
                                        >

                                            <AnimatePresence>

                                                {isAdded ? (

                                                    <motion.span
                                                        key="added"
                                                        initial={{
                                                            scale: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            scale: 1,
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            scale: 0,
                                                        }}
                                                    >

                                                        ✓ Added

                                                    </motion.span>

                                                ) : (

                                                    <motion.span
                                                        key="add"
                                                        initial={{
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                        }}
                                                    >

                                                        Add to Cart

                                                    </motion.span>

                                                )}

                                            </AnimatePresence>

                                        </motion.button>

                                    </div>

                                </motion.div>

                            );

                        }
                    )}

                {!loading &&
                    filteredProducts.length === 0 && (

                        <motion.div
                            style={empty}
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                        >

                            No products found

                        </motion.div>

                    )}

            </div>

        </UserLayout>

    );

}

/* ================= SKELETON ================= */

function SkeletonCard() {

    return (

        <div style={skeletonCard} />

    );

}

/* ================= STYLES ================= */

const header = {
    marginBottom: "36px",
};

const title = {
    fontSize: "36px",
    fontWeight: "900",
    color: "#ffffff",
};

const subtitle = {
    marginTop: "8px",
    color: "#94a3b8",
};

const filters = {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "36px",
};

const searchBox = {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#020617",
    color: "#ffffff",
};

const categoryRow = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
};

const categoryBtn = {
    padding: "8px 18px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
};

const grid = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
};

const card = {
    background:
        "rgba(255,255,255,0.06)",
    borderRadius: "22px",
    padding: "22px",
    border:
        "1px solid rgba(255,255,255,0.08)",
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
    background:
        "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#022c22",
    fontWeight: "700",
    cursor: "pointer",
};

const empty = {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    borderRadius: "18px",
    background:
        "rgba(255,255,255,0.05)",
    color: "#94a3b8",
};

const skeletonCard = {
    height: "120px",
    borderRadius: "22px",
    background:
        "linear-gradient(90deg,#020617,#111827,#020617)",
};

const activeGradient =
    "linear-gradient(135deg,#6366f1,#4f46e5)";

const inactiveGradient =
    "rgba(255,255,255,0.08)";

const successGradient =
    "linear-gradient(135deg,#22c55e,#16a34a)";