import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { motion } from "framer-motion";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");  // optional UI only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwScore, setPwScore] = useState(0);

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  function calculateStrength(pw) {
    let score = 0;
    if (!pw) { setPwScore(0); return; }
    if (pw.length >= 8) score += 1;
    if (pw.match(/[A-Z]/)) score += 1;
    if (pw.match(/[0-9]/)) score += 1;
    if (pw.match(/[^A-Za-z0-9]/)) score += 1;
    if (pw.length >= 12) score += 1;
    setPwScore(score);
  }

  function passwordLabel(score) {
    if (score <= 1) return { label: "Very weak", pct: 20 };
    if (score === 2) return { label: "Weak", pct: 40 };
    if (score === 3) return { label: "Okay", pct: 60 };
    if (score === 4) return { label: "Strong", pct: 80 };
    return { label: "Excellent", pct: 100 };
  }

  function validateFields() {
    if (!name.trim()) return "Full name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "A valid email is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    return null;
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const invalid = validateFields();
    if (invalid) {
      setError(invalid);
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role: "user"
      });

      setSuccessMsg("Account created successfully. Redirecting to login...");
      setTimeout(() => nav("/login"), 900);

    } catch (err) {
      console.error("Register error:", err?.response?.data || err.message);
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const pwMeta = passwordLabel(pwScore);

  function handleFillAdmin(e) {
    e.preventDefault();
    setName("Administrator");
    setUsername("admin");
    setEmail("admin@example.com");
    setPassword("admin@123");
    setConfirm("admin@123");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left panel */}
        <div className="p-8 bg-linear-to-b from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">Create account</h1>
            <p className="text-white/90">Start managing your inventory with InventoryX.</p>
          </div>

          <div className="mt-6">
            <div className="text-sm text-white/80">Accounts registered</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center font-bold">IX</div>
              <div>
                <div className="font-semibold">Database users</div>
                <div className="text-xs text-white/80">Live from MySQL</div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleFillAdmin}
                className="px-4 py-2 bg-white/20 hover:bg-white/25 rounded-lg text-white font-semibold"
              >
                Quick fill sample admin
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Register</h2>
          <p className="text-sm text-slate-500 mb-4">Create an account</p>

          {error && <div className="mb-4 p-3 text-sm text-rose-700 bg-rose-100 rounded-md">{error}</div>}
          {successMsg && <div className="mb-4 p-3 text-sm text-emerald-800 bg-emerald-100 rounded-md">{successMsg}</div>}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username (optional)</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="unique_username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Choose a secure password"
              />
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${pwMeta.pct}%` }}
                  className="h-full bg-emerald-400 transition-all duration-300"
                />
              </div>
              <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                <div>{pwMeta.label}</div>
                <div>{password.length ? `${password.length} chars` : "0 chars"}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Repeat password"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" id="terms" className="h-4 w-4 rounded border-slate-300" required />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the <span className="font-semibold">Terms & Privacy</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-shadow shadow"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>

            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => nav("/login")}
                className="text-indigo-600 font-semibold underline ml-1"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
