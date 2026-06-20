import React from "react";
import { motion } from "framer-motion";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-lg p-6 z-10 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">{title}</div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border">Close</button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
}
