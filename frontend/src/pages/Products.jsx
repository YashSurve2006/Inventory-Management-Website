// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from "react";
import BigHeader from "../components/ui/BigHeader";
import AnalyticsCard from "../components/ui/AnalyticsCard";
import { motion, AnimatePresence } from "framer-motion";

// API
import { getProducts, deleteProduct, addProduct, updateProduct } from "../api";

const STORAGE_KEY = "ix_products_v2";

/* ------------------ Helpers ------------------ */

function generateId() {
  return "p_" + Math.random().toString(36).slice(2, 9);
}

function saveProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function loadProductsLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ------------------ Modal Component ------------------ */

function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.98, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="text-xl">✕</button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------ Form UI ------------------ */

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 border rounded-lg mt-1"
      />
    </div>
  );
}

function FormUI({ form, setForm }) {
  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Name" value={form.name || ""} onChange={(e) => update("name", e.target.value)} />
      <Field label="Category" value={form.category || ""} onChange={(e) => update("category", e.target.value)} />
      <Field type="number" label="Stock" value={form.quantity ?? form.stock ?? ""} onChange={(e) => update("quantity", Number(e.target.value))} />
      <Field type="number" label="Price" value={form.price ?? ""} onChange={(e) => update("price", Number(e.target.value))} />
      <Field type="number" label="Minimum Stock (min_quantity)" value={form.min_quantity ?? 10} onChange={(e) => update("min_quantity", Number(e.target.value))} />
      <div /> {/* filler to keep grid alignment */}
    </div>
  );
}

/* =======================================================================
   MAIN COMPONENT
   ======================================================================= */

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  // Add modal form state
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    min_quantity: 10,
  });

  // Edit modal form & visibility
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    min_quantity: 10,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDBProducts();
  }, []);

  async function loadDBProducts() {
    setLoading(true);
    try {
      const res = await getProducts();
      // Expect res.data to be array of products with fields: id,name,category,quantity,price,min_quantity?
      const list = Array.isArray(res.data) ? res.data : [];
      setProducts(list);
      // save backup locally
      try { saveProducts(list); } catch { }
    } catch (err) {
      console.error("Database fetch error", err);
      // fallback to local storage if available
      const local = loadProductsLocal();
      if (local) setProducts(local);
    }
    setLoading(false);
  }

  /* ------------------ Filtered Search ------------------ */
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        String(p.id || "").includes(q)
    );
  }, [products, query]);

  /* ------------------ Add product ------------------ */
  async function handleAdd() {
    try {
      // basic validation
      if (!addForm.name.trim()) return alert("Name is required");
      await addProduct({
        name: addForm.name,
        category: addForm.category,
        quantity: Number(addForm.quantity || 0),
        price: Number(addForm.price || 0),
        min_quantity: Number(addForm.min_quantity || 10),
      });

      // reset & refresh
      setAddOpen(false);
      setAddForm({ name: "", category: "", quantity: 0, price: 0, min_quantity: 10 });
      await loadDBProducts();
    } catch (err) {
      console.error("Add error:", err);
      alert("Error adding product: " + (err.response?.data?.error || err.message));
    }
  }

  /* ------------------ Edit product ------------------ */
  function handleEditClick(p) {
    setEditProduct(p);
    setEditForm({
      id: p.id,
      name: p.name || "",
      category: p.category || "",
      quantity: p.quantity ?? 0,
      price: p.price ?? 0,
      min_quantity: p.min_quantity ?? 10,
    });
    setEditOpen(true);
  }

  async function handleEditSave() {
    if (!editForm || !editForm.id) return alert("Nothing to save");
    try {
      await updateProduct(editForm.id, {
        name: editForm.name,
        category: editForm.category,
        quantity: Number(editForm.quantity || 0),
        price: Number(editForm.price || 0),
        min_quantity: Number(editForm.min_quantity || 10),
      });

      // success UI
      setEditOpen(false);
      setEditProduct(null);
      await loadDBProducts();

    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  }

  /* ------------------ Delete product ------------------ */
  async function handleDelete(id) {
    if (!window.confirm("Remove product permanently?")) return;
    try {
      await deleteProduct(id);
      await loadDBProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting product: " + (err.response?.data?.error || err.message));
    }
  }

  /* ------------------ Calculated stats ------------------ */
  const totalValue = products.reduce((t, p) => t + (p.quantity || 0) * (p.price || 0), 0);
  const lowStockCount = products.filter((p) => (p.quantity || 0) < (p.min_quantity ?? 10)).length;

  /* ------------------ Render ------------------ */
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <BigHeader
        title="Products"
        subtitle="Manage catalogue, stock & pricing — fast and beautiful."
      />

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <AnalyticsCard title="Total SKUs" value={products.length} color="#7c3aed" />
        <AnalyticsCard title="Stock Value" value={"₹ " + totalValue.toLocaleString()} color="#06b6d4" />
        <AnalyticsCard title="Low Stock Items" value={lowStockCount} color="#ef4444" />
      </div>

      {/* Search + Add Button */}
      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg w-80"
            placeholder="Search products by id, name or category..."
          />

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow"
            onClick={() => setAddOpen(true)}
          >
            + Add Product
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-slate-500 border-b">
              <th className="py-3">Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b text-sm hover:bg-slate-50">
                <td className="font-medium">{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>₹ {Number(p.price).toLocaleString()}</td>

                <td className="text-right space-x-2">
                  <button
                    className="px-3 py-1 rounded-md border text-xs"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 rounded-md bg-red-500 text-white text-xs"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Product">
        <FormUI form={addForm} setForm={setAddForm} />
        <div className="flex justify-end mt-4 gap-3">
          <button className="px-4 py-2 border rounded-lg" onClick={() => setAddOpen(false)}>Cancel</button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg" onClick={handleAdd}>Add</button>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Product">
        <FormUI form={editForm} setForm={setEditForm} />
        <div className="flex justify-end mt-4 gap-3">
          <button className="px-4 py-2 border rounded-lg" onClick={() => setEditOpen(false)}>Cancel</button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg" onClick={handleEditSave}>Save</button>
        </div>
      </Modal>
    </div>
  );
}
