import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTransactions, addTransaction, getProducts, getSuppliers } from "../api";

export default function Transactions() {
  /* ---------------------------------------------------------
      LOAD REAL TRANSACTIONS FROM DATABASE
  --------------------------------------------------------- */

  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    loadProducts();
    loadSuppliers();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setList(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [txForm, setTxForm] = useState({
    product_id: "",
    supplier_id: "",
    quantity: 1,
    type: "IN"
  });

  /* ---------------------------------------------------------
      FILTER + SEARCH
  --------------------------------------------------------- */

  const filtered = useMemo(() => {
    return list.filter((t) => {
      const productName = (t.product_name || "").toLowerCase();
      const matchesText = productName.includes(search.toLowerCase());
      const matchesType = filter === "ALL" || t.type === filter;
      return matchesText && matchesType;
    });
  }, [list, search, filter]);

  /* ---------------------------------------------------------
      BUTTON STYLE FUNCTION
  --------------------------------------------------------- */
  const filterBtn = (id, label) => (
    <button
      key={id}
      onClick={() => setFilter(id)}
      className={`px-4 py-2 rounded-xl border text-sm font-medium transition
        ${filter === id ? "bg-indigo-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}
      `}
    >
      {label}
    </button>
  );

  /* ---------------------------------------------------------
      ADD TRANSACTION HANDLER
  --------------------------------------------------------- */

  const openAdd = () => {
    setTxForm({ product_id: products[0]?.id || "", supplier_id: suppliers[0]?.id || "", quantity: 1, type: "IN" });
    setAddOpen(true);
  };

  const submitTx = async () => {
    if (!txForm.product_id || !txForm.quantity || !txForm.type) {
      return alert("Please select product, quantity and type.");
    }

    try {
      await addTransaction({
        product_id: Number(txForm.product_id),
        supplier_id: txForm.supplier_id ? Number(txForm.supplier_id) : null,
        quantity: Number(txForm.quantity),
        type: txForm.type
      });

      alert("Transaction saved.");
      setAddOpen(false);
      await loadData();
      await loadProducts(); // update product quantities shown elsewhere
    } catch (err) {
      alert("Error saving transaction: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="px-8 py-6 w-full">
      {/* ----------------------------------------------
          PAGE HEADER
      ---------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">Transactions</h1>
          <p className="text-slate-500 mt-1">Complete log of stock movement</p>
        </div>

        <div>
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl bg-accent text-white shadow"
          >
            + Add Transaction
          </button>
        </div>
      </motion.div>

      {/* ----------------------------------------------
          SEARCH + FILTER CONTAINER
      ---------------------------------------------- */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-wrap items-center justify-between gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="px-4 py-3 border rounded-xl w-full md:w-72"
        />

        <div className="flex gap-3">
          {filterBtn("ALL", "All")}
          {filterBtn("IN", "Stock In")}
          {filterBtn("OUT", "Stock Out")}
        </div>
      </div>

      {/* ----------------------------------------------
          DATA TABLE
      ---------------------------------------------- */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b">
                <th className="py-3">Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Supplier</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b text-sm hover:bg-slate-50"
                >
                  <td className="py-3">{new Date(t.date).toISOString().split("T")[0]}</td>
                  <td className="font-medium">{t.product_name}</td>

                  <td
                    className={`font-semibold ${t.type === "IN" ? "text-emerald-600" : "text-rose-600"
                      }`}
                  >
                    {t.type}
                  </td>

                  <td>{t.quantity}</td>
                  <td>{t.supplier_name}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 py-10 text-sm">
              No transactions found.
            </div>
          )}
        </div>
      </motion.div>

      {/* ------------------ ADD TRANSACTION MODAL ------------------ */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setAddOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Transaction</h3>
                <button onClick={() => setAddOpen(false)} className="text-xl">✕</button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm text-slate-600">Product</label>
                <select
                  value={txForm.product_id}
                  onChange={(e) => setTxForm((s) => ({ ...s, product_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">-- select product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (stock: {p.quantity ?? 0})
                    </option>
                  ))}
                </select>

                <label className="text-sm text-slate-600">Supplier (optional)</label>
                <select
                  value={txForm.supplier_id}
                  onChange={(e) => setTxForm((s) => ({ ...s, supplier_id: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">-- none --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <label className="text-sm text-slate-600">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={txForm.quantity}
                  onChange={(e) => setTxForm((s) => ({ ...s, quantity: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <div>
                  <label className="text-sm text-slate-600">Type</label>
                  <div className="mt-2 flex gap-3">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="txType" checked={txForm.type === "IN"} onChange={() => setTxForm((s) => ({ ...s, type: "IN" }))} />
                      <span className="ml-1">IN</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="txType" checked={txForm.type === "OUT"} onChange={() => setTxForm((s) => ({ ...s, type: "OUT" }))} />
                      <span className="ml-1">OUT</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button className="px-4 py-2 border rounded-lg" onClick={() => setAddOpen(false)}>Cancel</button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={submitTx}>Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
