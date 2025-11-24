import React, { useEffect, useState } from "react";

// ✅ ADDED: API imports
import { addSupplier, getSuppliers } from "../api";

export default function Suppliers() {

  // ❗ REPLACED dummy data → now loads from DB
  const [suppliers, setSuppliers] = useState([]);

  // ✅ Load suppliers from MySQL
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    }
  };

  // ✅ Add supplier handler (simple popup form)
  const handleAddSupplier = async () => {
    const name = prompt("Enter supplier name:");
    if (!name) return;

    const contact = prompt("Enter supplier contact number:");
    const address = prompt("Enter supplier address:");

    try {
      await addSupplier({ name, contact, address });
      await loadSuppliers(); // refresh list
    } catch (err) {
      alert("Error adding supplier: " + err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">Suppliers</h2>

        {/* ❗ CHANGED: connected to DB */}
        <button
          className="py-3 px-4 rounded-xl bg-accent text-white"
          onClick={handleAddSupplier}
        >
          + Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">
                {s.name[0]}
              </div>
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-slate-500">{s.contact}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-500">{s.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
