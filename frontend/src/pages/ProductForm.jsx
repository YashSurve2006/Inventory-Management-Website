import React, { useState } from "react";
import { addProduct } from "../api";   // ✅ ADDED

export default function ProductForm({ initial = null, onSave }) {
  const [form, setForm] = useState(initial || { name: "", category: "", qty: 0, price: 0 });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  // ✅ REVISED SUBMIT FUNCTION — sends data to MySQL
  const submit = async (e) => {
    e.preventDefault();

    try {
      await addProduct({
        name: form.name,
        category: form.category,
        quantity: form.qty,
        price: form.price,
      });

      alert("Product saved to database!");

      if (onSave) onSave(form);

    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow">

      <h3 className="font-semibold text-lg mb-4">Product</h3>
      <div className="grid grid-cols-2 gap-4">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" className="border p-3 rounded" />
        <input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Category" className="border p-3 rounded" />
        <input value={form.qty} onChange={(e) => update("qty", Number(e.target.value))} placeholder="Quantity" type="number" className="border p-3 rounded" />
        <input value={form.price} onChange={(e) => update("price", Number(e.target.value))} placeholder="Price" type="number" className="border p-3 rounded" />
      </div>
      <div className="mt-4 text-right">
        <button type="submit" className="px-4 py-2 rounded-lg bg-accent text-white">Save</button>
      </div>
    </form>

  );
}
