// src/pages/Products.jsx

import React, { useEffect, useMemo, useState } from "react";
import BigHeader from "../components/ui/BigHeader";
import AnalyticsCard from "../components/ui/AnalyticsCard";
import { motion, AnimatePresence } from "framer-motion";

import { getProducts, deleteProduct, addProduct, updateProduct } from "../api";

/* ---------------- Modal ---------------- */

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
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose}>✕</button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Input Field ---------------- */

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

/* ---------------- Product Form ---------------- */

function ProductForm({ form, setForm }) {

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="grid grid-cols-2 gap-4">

      <Field
        label="Product Name"
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
      />

      <Field
        label="Category"
        value={form.category || ""}
        onChange={(e) => update("category", e.target.value)}
      />

      <Field
        label="Brand"
        value={form.brand || ""}
        onChange={(e) => update("brand", e.target.value)}
      />

      <Field
        type="number"
        label="Price"
        value={form.price || ""}
        onChange={(e) => update("price", Number(e.target.value))}
      />

      <Field
        type="number"
        label="Stock"
        value={form.stock || ""}
        onChange={(e) => update("stock", Number(e.target.value))}
      />

      <Field
        label="CPU Socket"
        value={form.socket || ""}
        onChange={(e) => update("socket", e.target.value)}
      />

      <Field
        label="RAM Type"
        value={form.ram_type || ""}
        onChange={(e) => update("ram_type", e.target.value)}
      />

      <Field
        type="number"
        label="PSU Wattage"
        value={form.wattage || ""}
        onChange={(e) => update("wattage", Number(e.target.value))}
      />

      <Field
        label="Storage Type"
        value={form.storage_type || ""}
        onChange={(e) => update("storage_type", e.target.value)}
      />

      <Field
        label="GPU Size"
        value={form.size || ""}
        onChange={(e) => update("size", e.target.value)}
      />

    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Products() {

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const emptyForm = {
    name: "",
    category: "",
    brand: "",
    price: 0,
    stock: 0,
    socket: "",
    ram_type: "",
    wattage: 0,
    storage_type: "",
    size: ""
  };

  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  /* ---------------- Load Products ---------------- */

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch products error", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------------- Search Filter ---------------- */

  const filtered = useMemo(() => {

    const q = query.toLowerCase();

    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );

  }, [products, query]);

  /* ---------------- Add Product ---------------- */

  async function handleAdd() {

    try {

      await addProduct(addForm);

      setAddOpen(false);
      setAddForm(emptyForm);

      loadProducts();

    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  }

  /* ---------------- Edit ---------------- */

  function handleEditClick(p) {

    setEditForm(p);
    setEditOpen(true);

  }

  async function handleEditSave() {

    try {

      await updateProduct(editForm.id, editForm);

      setEditOpen(false);
      loadProducts();

    } catch (err) {

      console.error(err);
      alert("Update failed");

    }
  }

  /* ---------------- Delete ---------------- */

  async function handleDelete(id) {

    if (!window.confirm("Delete this product?")) return;

    try {

      await deleteProduct(id);
      loadProducts();

    } catch (err) {

      console.error(err);
      alert("Delete failed");

    }

  }

  /* ---------------- Analytics ---------------- */

  const totalValue = products.reduce(
    (sum, p) => sum + (p.stock || 0) * (p.price || 0),
    0
  );

  const lowStock = products.filter((p) => (p.stock || 0) < 5).length;

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading products...
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="p-8">

      <BigHeader
        title="Products"
        subtitle="Manage inventory, compatibility & pricing"
      />

      {/* Analytics */}

      <div className="grid grid-cols-3 gap-4 mt-6">

        <AnalyticsCard
          title="Total SKUs"
          value={products.length}
          color="#7c3aed"
        />

        <AnalyticsCard
          title="Stock Value"
          value={"₹ " + totalValue.toLocaleString()}
          color="#06b6d4"
        />

        <AnalyticsCard
          title="Low Stock Items"
          value={lowStock}
          color="#ef4444"
        />

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow p-6 mt-6">

        <div className="flex justify-between mb-6">

          <input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg w-80"
          />

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
            onClick={() => setAddOpen(true)}
          >
            + Add Product
          </button>

        </div>

        <table className="w-full text-sm">

          <thead>
            <tr className="text-slate-500 border-b">
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Brand</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((p) => (

              <tr key={p.id} className="border-b hover:bg-slate-50">

                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td>₹ {Number(p.price).toLocaleString()}</td>
                <td>{p.brand}</td>

                <td className="text-right space-x-2">

                  <button
                    className="px-3 py-1 border rounded"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Add Modal */}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Product">

        <ProductForm form={addForm} setForm={setAddForm} />

        <div className="flex justify-end gap-3 mt-4">

          <button
            className="px-4 py-2 border rounded"
            onClick={() => setAddOpen(false)}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded"
            onClick={handleAdd}
          >
            Add
          </button>

        </div>

      </Modal>

      {/* Edit Modal */}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Product">

        <ProductForm form={editForm} setForm={setEditForm} />

        <div className="flex justify-end gap-3 mt-4">

          <button
            className="px-4 py-2 border rounded"
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded"
            onClick={handleEditSave}
          >
            Save
          </button>

        </div>

      </Modal>

    </div>
  );
}