import React from "react";
import { motion } from "framer-motion";

export default function BigHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full mb-8"
    >
      {/* Background gradient + holo sheen */}
      <div className="relative overflow-hidden rounded-3xl p-10 shadow-xl bg-linear-to-br from-indigo-600 via-indigo-700 to-slate-900">

        {/* Floating hologram ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 blur-3xl opacity-20"
        />

        {/* Animated glossy shine */}
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: 600 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute top-0 left-0 w-40 h-full bg-white/10 rotate-12 blur-xl opacity-20"
        />

        <div className="relative z-10 flex items-center justify-between">

          {/* Left side text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl"
            >
              {title}
              <span className="text-pink-300">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-slate-200 text-lg mt-3 max-w-xl"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Profile badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-lg border border-white/20 shadow-xl"
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-fuchsia-500 shadow-lg flex items-center justify-center text-white text-xl font-bold">
              Y
            </div>
            <div>
              <div className="text-white font-semibold">Yash Surve</div>
              <div className="text-slate-300 text-sm">Admin</div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
