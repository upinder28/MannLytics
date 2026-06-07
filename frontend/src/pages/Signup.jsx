import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword } from "firebase/auth";

import authSideImg from "../assets/signup-side.jpeg";
import pic from "../assets/logo pic.png";
import api from "../utils/axios";
import { auth, provider } from "../firebase";

function Signup() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const handleStorage = () => setDarkMode(localStorage.getItem("darkMode") === "true");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const dm = darkMode;

  const inputCls = `w-full h-11 px-4 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-indigo-400 ${dm ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-[#f8fbff] border-[#dbe4ff] text-slate-900"}`;
  const inputErrCls = `w-full h-11 px-4 pr-12 rounded-2xl border text-sm outline-none focus:ring-2 focus:ring-red-300 ${dm ? "bg-gray-700 border-red-500 text-white placeholder-gray-400" : "bg-[#fffafa] border-red-400 text-slate-900"}`;
  const errorCls = `text-xs px-3 py-2.5 rounded-xl border ${dm ? "text-red-400 bg-red-950/60 border-red-800" : "text-red-600 bg-red-50 border-red-200"}`;

  const getPasswordStrength = (value) => {
    if (!value) return null;
    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*]/.test(value)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (score === 2) return { label: "Fair", color: "bg-orange-400", width: "w-2/4" };
    if (score === 3) return { label: "Good", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(value)) return "Include at least 1 uppercase letter";
    if (!/[0-9]/.test(value)) return "Include at least 1 number";
    if (!/[!@#$%^&*]/.test(value)) return "Include at least 1 special character";
    return "";
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
    if (confirmPassword && value !== confirmPassword) setConfirmError("Passwords do not match");
    else setConfirmError("");
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (!value) { setConfirmError(""); return; }
    setConfirmError(password !== value ? "Passwords do not match" : "");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError("");
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const currentPasswordError = validatePassword(password);
    if (!trimmedName) { setFormError("Full name is required"); return; }
    if (currentPasswordError) { setPasswordError(currentPasswordError); setFormError("Please fix the password requirements"); return; }
    if (password !== confirmPassword) { setConfirmError("Passwords do not match"); setFormError("Please confirm your password correctly"); return; }
    try {
      setIsSubmitting(true);
      const userCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      try {
        const res = await api.post("/auth/signup", { name: trimmedName, email: normalizedEmail, password });
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("currentUser", normalizedEmail);
        sessionStorage.setItem("currentUserName", trimmedName);
        navigate("/dashboard");
      } catch (backendError) {
        await userCred.user.delete();
        throw backendError;
      }
    } catch (error) {
      setFormError(error?.response?.data?.message || error?.message || "Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (!result || !result.user) return;
      const user = result.user;
      try {
        const res = await api.post("/auth/google", {
          name: user.displayName,
          email: user.email.toLowerCase(),
          photo: user.photoURL,
          uid: user.uid,
        });
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("currentUser", res.data.user.email);
        sessionStorage.setItem("currentUserName", res.data.user.name);
        navigate("/dashboard");
      } catch (error) {
        console.error("Google redirect result error:", error);
        setFormError(error?.response?.data?.message || "Google signup failed. Please try again.");
      }
    }).catch((error) => {
      console.error("getRedirectResult error:", error);
    });
  }, [navigate]);

  const handleGoogleSignup = () => {
    setFormError("");
    signInWithRedirect(auth, provider);
  };

  return (
    <div className={`min-h-screen overflow-y-auto font-[Poppins,sans-serif] ${dm ? "bg-[#111827]" : "bg-[#f8fafc]"}`}>

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
              <p className="text-white font-bold text-lg">Start Your Wellness Journey</p>
              <p className="text-white/70 text-sm mt-1">Reflect. Understand. Feel better.</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className={`flex-1 flex items-center justify-center px-5 py-4 md:py-10 overflow-y-auto ${dm ? "bg-[#1f2937]" : "bg-gradient-to-b from-[#eff6ff] via-[#e0ecff] to-[#eef4ff]"}`}>
          <div
            className="w-full max-w-md rounded-3xl p-5 md:p-9 shadow-2xl"
            style={{ background: dm ? "rgba(31,41,55,0.98)" : "rgba(255,255,255,0.96)", border: dm ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.3)", animation: "authSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div className="text-center mb-5">
              <h2 className={`text-2xl font-extrabold tracking-tight ${dm ? "text-slate-100" : "text-slate-800"}`}>Create your account</h2>
              <p className={`mt-1.5 text-sm ${dm ? "text-slate-400" : "text-slate-500"}`}>Join Mannlytics and begin your wellness journey.</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-3">

              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className={`text-sm font-semibold ${dm ? "text-slate-300" : "text-slate-700"}`}>Full Name</label>
                <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" autoFocus className={inputCls} />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className={`text-sm font-semibold ${dm ? "text-slate-300" : "text-slate-700"}`}>Email Address</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputCls} />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className={`text-sm font-semibold ${dm ? "text-slate-300" : "text-slate-700"}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    autoComplete="new-password"
                    className={`${passwordError ? inputErrCls : inputCls} pr-12`}
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
                {password && (() => {
                  const s = getPasswordStrength(password);
                  return (
                    <div className="mt-1.5">
                      <div className="w-full h-1.5 rounded-full bg-gray-200">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${s.color} ${s.width}`} />
                      </div>
                      <p className={`text-xs mt-0.5 font-medium ${
                        s.label === "Weak" ? "text-red-500" :
                        s.label === "Fair" ? "text-orange-400" :
                        s.label === "Good" ? "text-yellow-500" : "text-green-500"
                      }`}>{s.label}</p>
                    </div>
                  );
                })()}
                {passwordError && <p className="text-xs text-red-500 font-medium mt-0.5">{passwordError}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className={`text-sm font-semibold ${dm ? "text-slate-300" : "text-slate-700"}`}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    required
                    autoComplete="new-password"
                    className={`${confirmError ? inputErrCls : inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 bg-transparent border-none cursor-pointer"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmError && <p className="text-xs text-red-500 font-medium mt-0.5">{confirmError}</p>}
              </div>

              {formError && <p className={errorCls}>{formError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-1 rounded-2xl text-white font-bold text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#4f46e5 0%,#0ea5e9 100%)", boxShadow: "0 10px 24px rgba(79,70,229,0.28)" }}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${dm ? "bg-gray-600" : "bg-[#dbe4ff]"}`} />
              <span className="text-xs font-bold text-slate-400 tracking-widest">OR</span>
              <div className={`flex-1 h-px ${dm ? "bg-gray-600" : "bg-[#dbe4ff]"}`} />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              className={`w-full h-11 rounded-2xl border flex items-center justify-center gap-2.5 text-sm font-semibold cursor-pointer disabled:opacity-70 ${dm ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-[#dbe4ff] text-slate-700"}`}
            >
              <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="Google" className="w-5 h-5" />
              {isGoogleLoading ? "Please wait..." : "Continue with Google"}
            </button>

            <p className={`mt-4 text-center text-sm ${dm ? "text-slate-400" : "text-slate-500"}`}>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-indigo-600 font-bold cursor-pointer hover:underline">Log in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
