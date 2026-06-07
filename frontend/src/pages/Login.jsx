import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";

import authSideImg from "../assets/signup-side.jpeg";
import pic from "../assets/logo pic.png";
import api from "../utils/axios";
import { auth, provider } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const handleStorage = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(
    () => parseInt(sessionStorage.getItem("loginAttempts") || "0")
  );

  const dm = darkMode;

  const errorCls = `text-xs px-3 py-2.5 rounded-xl border ${dm ? "text-red-400 bg-red-950/60 border-red-800" : "text-red-600 bg-red-50 border-red-200"}`;
  const successCls = `text-xs px-3 py-2.5 rounded-xl border ${dm ? "text-green-400 bg-green-950/60 border-green-800" : "text-green-700 bg-green-50 border-green-200"}`;
  const inputCls = `w-full h-12 px-4 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-indigo-400 ${dm ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-[#f8fbff] border-[#dbe4ff] text-slate-900"}`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");
    setResetMessage("");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUserName");
    try {
      setIsSubmitting(true);
      const normalizedEmail = email.trim().toLowerCase();
      const res = await api.post("/auth/login", { email: normalizedEmail, password });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("currentUser", res.data.user.email);
      sessionStorage.setItem("currentUserName", res.data.user.name);
      sessionStorage.removeItem("loginAttempts");
      if (res.data.user.photo) {
        localStorage.setItem(`profilePic_${res.data.user.email}`, res.data.user.photo);
      }
      navigate(redirectTo);
    } catch (error) {
      setLoginAttempts((prev) => {
        const next = prev + 1;
        sessionStorage.setItem("loginAttempts", next);
        if (next >= 5) {
          setFormError("Too many failed attempts. Please reset your password or try again later.");
        } else {
          setFormError(error?.response?.data?.message || "Login failed. Please check your credentials and try again.");
        }
        return next;
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError("");
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Firebase user:", user?.email, user?.displayName, user?.uid);
      const res = await api.post("/auth/google", {
        name: user.displayName || "User",
        email: (user.email || "").toLowerCase(),
        photo: user.photoURL || "",
        uid: user.uid,
      });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("currentUser", res.data.user.email);
      sessionStorage.setItem("currentUserName", res.data.user.name);
      if (res.data.user.photo) {
        localStorage.setItem(`profilePic_${res.data.user.email}`, res.data.user.photo);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error?.code, error?.message);
      setFormError(error?.response?.data?.message || error?.message || "Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setFormError("");
    setResetMessage("");
    if (!email.trim()) { setFormError("Please enter your email address first."); return; }
    try {
      setIsResetting(true);
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setResetMessage("Password reset link has been sent to your email.");
    } catch (error) {
      setFormError(error?.message || "Unable to send reset email.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={`h-screen overflow-y-auto font-[Poppins,sans-serif] ${dm ? "bg-[#111827]" : "bg-[#f8fafc]"}`}>

      {/* HEADER */}
      <header
        onClick={() => navigate("/")}
        onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        role="button"
        tabIndex={0}
        aria-label="Go to homepage"
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center gap-3 px-5 md:px-12 cursor-pointer backdrop-blur-xl border-b ${dm ? "bg-gray-900/97 border-gray-700" : "bg-white/96 border-gray-100"}`}
      >
        <img src={pic} alt="Mannlytics logo" className="h-12 w-16 rounded-xl object-cover" />
        <div>
          <h2 className="m-0 text-xl font-extrabold text-indigo-600 leading-tight">Mannlytics</h2>
          <p className="m-0 text-xs text-gray-500 mt-0.5">AI-Powered Emotional Intelligence</p>
        </div>
      </header>

      {/* BODY */}
      <div className="flex min-h-[calc(100vh-80px)] mt-20">

        {/* LEFT IMAGE — hidden on mobile */}
        <div className="hidden md:flex flex-[1.1] relative overflow-hidden" style={{ background: dm ? "#0f172a" : "linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)" }}>
          <div className={`absolute w-80 h-80 rounded-full blur-3xl opacity-40 -top-10 -left-10 animate-pulse ${dm ? "bg-indigo-800" : "bg-blue-300"}`} />
          <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-30 -bottom-10 -right-10 animate-pulse ${dm ? "bg-cyan-900" : "bg-indigo-300"}`} />
          <img
            src={authSideImg}
            alt="Mannlytics"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "70% center", transform: "scale(0.68)", transformOrigin: "center center", animation: "authFloat 5s ease-in-out infinite" }}
          />
          <div className="absolute inset-0" style={{ background: dm ? "linear-gradient(135deg,rgba(15,23,42,0.45) 0%,rgba(99,102,241,0.15) 100%)" : "linear-gradient(135deg,rgba(15,23,42,0.12) 0%,rgba(99,102,241,0.08) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-white font-bold text-lg">Your Mental Wellness Journey</p>
              <p className="text-white/70 text-sm mt-1">Reflect. Understand. Feel better.</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className={`flex-1 flex items-center justify-center px-5 py-6 overflow-y-auto ${dm ? "bg-[#1f2937]" : "bg-gradient-to-b from-[#eff6ff] via-[#e0ecff] to-[#eef4ff]"}`}>
          <div
            className="w-full max-w-md rounded-3xl p-6 md:p-10 shadow-2xl"
            style={{ background: dm ? "rgba(31,41,55,0.98)" : "rgba(255,255,255,0.96)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.3)", animation: "authSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div className="text-center mb-7">
              <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${dm ? "text-slate-100" : "text-slate-800"}`}>Welcome back</h2>
              <p className={`mt-2 text-sm ${dm ? "text-slate-400" : "text-slate-500"}`}>Log in to continue your wellness journey.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${dm ? "text-slate-300" : "text-slate-700"}`}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${dm ? "text-slate-300" : "text-slate-700"}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className={`text-xs font-semibold bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${dm ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-500 hover:underline"}`}
                >
                  {isResetting ? "Sending reset link..." : "Forgot Password?"}
                </button>
              </div>

              {formError && <p className={errorCls}>{formError}</p>}
              {resetMessage && <p className={successCls}>{resetMessage}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-1 rounded-2xl text-white font-bold text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#4f46e5 0%,#0ea5e9 100%)", boxShadow: "0 10px 24px rgba(79,70,229,0.28)" }}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className={`flex-1 h-px ${dm ? "bg-gray-600" : "bg-[#dbe4ff]"}`} />
              <span className="text-xs font-bold text-slate-400 tracking-widest">OR</span>
              <div className={`flex-1 h-px ${dm ? "bg-gray-600" : "bg-[#dbe4ff]"}`} />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className={`w-full h-12 rounded-2xl border flex items-center justify-center gap-2.5 text-sm font-semibold cursor-pointer disabled:opacity-70 ${dm ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-[#dbe4ff] text-slate-700"}`}
            >
              <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="Google" className="w-5 h-5" />
              {isGoogleLoading ? "Please wait..." : "Continue with Google"}
            </button>

            <p className={`mt-5 text-center text-sm ${dm ? "text-slate-400" : "text-slate-500"}`}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")} className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
