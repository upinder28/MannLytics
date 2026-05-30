import { useState } from "react";
import { useNavigate } from "react-router-dom";
import pic from "../assets/logo pic.png";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid credentials."); return; }
      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminLoggedIn", "true");
      navigate("/admin/dashboard");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-600/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-[#0d1424] border border-white/[0.08] rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />
              <img src={pic} className="relative w-14 h-14 rounded-2xl shadow-lg" alt="logo" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5">
              <FaLock className="text-[10px]" /> Mannlytics · Restricted Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@mannlytics.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                  {showPw ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">
                <span className="text-base">⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Not an admin?{" "}
            <span onClick={() => navigate("/login")} className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
              User Login
            </span>
          </p>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          © {new Date().getFullYear()} Mannlytics · All rights reserved
        </p>
      </div>
    </div>
  );
}