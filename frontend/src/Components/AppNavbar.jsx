import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBell, FaTimes, FaBookOpen, FaWind } from "react-icons/fa";
import pic from "../assets/logo pic.png";
import Setting from "../pages/Setting";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "AI Assistant", path: "/chatbot" },
  { label: "Library", path: "/library" },
  { label: "Support", path: "/support" },
];

export default function AppNavbar({ darkMode, toggleDarkMode, showGetStarted = false, minimal = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);

  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    const val = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser") || "";
    try { JSON.parse(val); return ""; } catch { return val; }
  });
  const [currentUserName, setCurrentUserName] = useState(
    () => sessionStorage.getItem("currentUserName") ||
    localStorage.getItem(`name_${sessionStorage.getItem("currentUser")}`) ||
    "User"
  );

  const currentUserEmailForPic = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser") || "";
  const [profilePic, setProfilePic] = useState(localStorage.getItem(`profilePic_${currentUserEmailForPic}`) || "");

  useEffect(() => {
    const sync = () => setProfilePic(localStorage.getItem(`profilePic_${currentUserEmailForPic}`) || "");
    window.addEventListener("profileUpdate", sync);
    return () => window.removeEventListener("profileUpdate", sync);
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;
    const msgs = [];
    msgs.push({ id: 1, text: "Hope you're doing okay. Want to share how you feel today? 🌿", link: "/dashboard" });

    fetch(`http://localhost:5000/api/user/${currentUserEmail}`)
      .then(r => r.json())
      .then(data => {
        const notifEnabled = data.notifications ?? true;
        if (!notifEnabled) return;
        const history = JSON.parse(localStorage.getItem(`moodHistory_${currentUserEmail}`)) || [];
        const lastEntry = history[history.length - 1];
        const lastEmotion = (lastEntry?.emotion || "").toLowerCase();
        const streak = parseInt(localStorage.getItem(`journalStreak_${currentUserEmail}`) || "0");
        const daysSinceLast = lastEntry ? Math.floor((Date.now() - new Date(lastEntry.createdAt)) / 86400000) : null;

        if (["joy", "happiness"].includes(lastEmotion)) msgs.push({ id: 2, text: "You seem in a good place lately 🌟 Keep it up!", link: "/progress" });
        else if (["sad", "sadness"].includes(lastEmotion)) msgs.push({ id: 3, text: "Feeling low is okay. Be gentle with yourself today 💜", link: "/safe-space" });
        else if (["anxiety", "stress"].includes(lastEmotion)) msgs.push({ id: 4, text: "Try a slow deep breath right now. You've got this 🌬️", link: "/safe-space" });
        if (daysSinceLast !== null && daysSinceLast >= 3) msgs.push({ id: 5, text: `It's been ${daysSinceLast} days since your last entry. We're here 💚`, link: "/dashboard" });
        if (streak >= 7) msgs.push({ id: 6, text: `${streak}-day streak! You're building a powerful habit 🔥`, link: "/progress" });
        else if (streak >= 3) msgs.push({ id: 7, text: `${streak} days in a row 🌟 Don't break your streak today!`, link: "/dashboard" });

        // High risk alert
        const lastRisk = parseInt(localStorage.getItem(`lastRiskScore_${currentUserEmail}`) || "0");
        if (lastRisk >= 70) msgs.unshift({ id: 8, tag: "⚠️ Alert", text: "High stress detected in your last entry. Safe Space is here to help 🌿", link: "/safe-space" });
        else if (["anxiety", "stress", "sad", "sadness"].includes(lastEmotion)) msgs.unshift({ id: 9, tag: "⚠️ Alert", text: "We noticed you're going through a tough time. Safe Space can help right now 🌿", link: "/safe-space" });

        setNotifications([...msgs]);
        setUnreadCount(msgs.length);

        // Show toast for most important notification
        const important = msgs.find(m => m.id === 5) || msgs.find(m => m.id === 3) || msgs.find(m => m.id === 4) || msgs[0];
        if (important) {
          setTimeout(() => {
            setToast(important);
            setTimeout(() => setToast(null), 5000);
          }, 1500);
        }
      })
      .catch(() => {
        setNotifications([...msgs]);
        setUnreadCount(msgs.length);
        setTimeout(() => {
          setToast(msgs[0]);
          setTimeout(() => setToast(null), 5000);
        }, 1500);
      });
  }, [currentUserEmail]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${darkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/90 border-indigo-100"}`}>
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 xl:px-14 py-4">

          {/* LEFT — hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            {/* HAMBURGER — mobile only */}
            <button
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              className="md:hidden flex flex-col justify-center items-center gap-[6px] w-8 h-8"
              onClick={() => setMobileMenuOpen(p => !p)}
            >
              {mobileMenuOpen ? (
                <FaTimes style={{ color: darkMode ? "#ffffff" : "#1e293b", fontSize: "22px" }} />
              ) : (
                <>
                  <span style={{ display: "block", height: "3px", width: "28px", borderRadius: "9999px", backgroundColor: darkMode ? "#ffffff" : "#1e293b" }} />
                  <span style={{ display: "block", height: "3px", width: "20px", borderRadius: "9999px", backgroundColor: darkMode ? "#ffffff" : "#1e293b" }} />
                  <span style={{ display: "block", height: "3px", width: "28px", borderRadius: "9999px", backgroundColor: darkMode ? "#ffffff" : "#1e293b" }} />
                </>
              )}
            </button>

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group transition duration-300">
              <img src={pic} className="h-12 w-12 rounded-2xl object-contain shadow-sm transition duration-300 group-hover:scale-110" />
              <div className="transition duration-300 group-hover:scale-105">
                <p className="text-xl font-bold text-indigo-600 tracking-wide">Mannlytics</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>AI-Powered Mental Health Analytics</p>
              </div>
            </Link>
          </div>

          {/* NAV LINKS — desktop */}
          <div className={`hidden md:flex items-center gap-14 ${minimal ? "!hidden" : ""}`}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    if ((link.label === "Dashboard" || link.label === "Library") && !currentUserEmail) {
                      e.preventDefault();
                      navigate("/login", { state: { from: link.path } });
                    }
                  }}
                  className={`group relative text-[18px] font-semibold transition duration-300 ${isActive ? "text-indigo-600" : darkMode ? "text-white hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"}`}
                >
                  <span className="inline-block group-hover:-translate-y-0.5 transition">{link.label}</span>
                  <span className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
          </div>

          {/* RIGHT — bell + dark mode + avatar */}
          <div className={`flex items-center gap-3 ${minimal ? "!hidden" : ""}`}>
            {currentUserEmail && (
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => { setBellOpen(p => !p); setUnreadCount(0); }}
                  className={`relative h-14 w-14 flex items-center justify-center rounded-full border transition ${darkMode ? "bg-gray-800 border-gray-600 text-gray-300 hover:text-white" : "bg-white border-indigo-200 text-indigo-600"}`}
                >
                  <FaBell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Slide-in Panel */}
                {bellOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
                    <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden transition-all duration-300 ${
                      darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-indigo-100 text-gray-800"
                    }`}>
                      {/* Panel Header */}
                      <div className={`flex items-center justify-between px-4 py-3 border-b ${
                        darkMode ? "border-gray-700 bg-gray-800" : "border-indigo-50 bg-indigo-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <FaBell className="text-indigo-500" size={14} />
                          <p className="text-sm font-bold text-indigo-600">Notifications</p>
                        </div>
                        <button onClick={() => setBellOpen(false)} className={`h-9 w-9 flex items-center justify-center rounded-xl font-bold transition ${
                          darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}>
                          <span style={{fontSize: "18px", lineHeight: 1}}>✕</span>
                        </button>
                      </div>

                      {/* Notifications List */}
                      <ul className="divide-y max-h-80 overflow-y-auto ${
                        darkMode ? 'divide-gray-700' : 'divide-indigo-50'
                      }">
                        {notifications.length === 0 ? (
                          <li className="px-4 py-6 text-sm text-center text-gray-400">No notifications yet.</li>
                        ) : notifications.map(n => (
                          <li
                            key={n.id}
                            onClick={() => { setBellOpen(false); if (n.link) navigate(n.link); }}
                            className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition ${
                              darkMode ? "hover:bg-gray-700/60" : "hover:bg-indigo-50"
                            }`}
                          >
                            <span className="text-lg mt-0.5">{n.text.match(/[\u{1F300}-\u{1FFFF}]/u)?.[0] || "💬"}</span>
                            <div className="flex-1 min-w-0">
                              {n.tag && (
                                <span className="inline-block mb-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-100 text-rose-500">
                                  {n.tag}
                                </span>
                              )}
                              <p className="text-sm leading-relaxed">{n.text}</p>
                              {n.link && n.tag && (
                                <p className="text-xs text-indigo-500 mt-1 font-semibold">Open Safe Space →</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* DARK MODE */}
            <button
              onClick={toggleDarkMode}
              className={`h-14 w-14 flex items-center justify-center rounded-full border transition ${darkMode ? "bg-gray-800 border-gray-600 text-yellow-300" : "bg-white border-indigo-200 text-indigo-600"}`}
            >
              {darkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
            </button>

            {/* AVATAR */}
            {currentUserEmail && (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setOpenDropdown(p => !p)}
                  className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-md overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)" }}
                >
                  {currentUserName?.charAt(0)?.toUpperCase()}
                </div>
                {openDropdown && (
                  <div className={`absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl border p-2 ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-indigo-100 text-gray-800"}`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <p className="font-semibold text-sm">{currentUserName}</p>
                      <p className="text-xs opacity-70 truncate">{currentUserEmail}</p>
                    </div>
                    <div className="py-2 space-y-1">
                      <button onClick={() => { setOpenDropdown(false); navigate("/profile"); }} style={{ backgroundColor: "transparent" }} className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left text-sm ${darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"}`}>👤 Profile</button>
                      <button onClick={() => { setOpenDropdown(false); setOpenSettings(true); }} style={{ backgroundColor: "transparent" }} className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left text-sm ${darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"}`}>⚙️ Settings</button>
                    </div>
                    <div className={`border-t pt-2 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <button
                        onClick={() => {
                          sessionStorage.removeItem("token");
                          sessionStorage.removeItem("currentUser");
                          sessionStorage.removeItem("currentUserName");
                          localStorage.removeItem("currentUser");
                          localStorage.removeItem("currentUserName");
                          setCurrentUserEmail("");
                          setCurrentUserName("User");
                          setProfilePic("");
                          setOpenDropdown(false);
                          window.dispatchEvent(new Event("userLogout"));
                          navigate("/");
                        }}
                        style={{ backgroundColor: "transparent" }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-500 rounded-lg ${darkMode ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* SIDE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 shadow-2xl transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${darkMode ? "bg-gray-900 text-white" : "bg-white text-slate-800"}`}
      >
        <div className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? "border-gray-700" : "border-indigo-100"}`}>
          <div className="flex items-center gap-3">
            <img src={pic} className="h-10 w-10 rounded-xl object-contain" />
            <p className="text-lg font-bold text-indigo-600">Mannlytics</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FaTimes style={{ color: darkMode ? "#ffffff" : "#1e293b", fontSize: "20px" }} />
          </button>
        </div>

        <div className="flex flex-col px-4 py-6 gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if ((link.label === "Dashboard" || link.label === "Library") && !currentUserEmail) {
                    navigate("/login", { state: { from: link.path } });
                  }
                }}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition ${isActive ? "bg-indigo-50 text-indigo-600" : darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {openSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenSettings(false)} />
          <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl z-50 overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <Setting onClose={() => setOpenSettings(false)} />
          </div>
        </div>
      )}

      {/* TOAST POPUP */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-2xl border shadow-2xl p-4 flex items-start gap-3 ${
            darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-indigo-100 text-slate-800"
          }`}
          style={{ animation: "slideInUp 0.4s ease" }}
        >
          <span className="text-2xl mt-0.5">{toast.text.match(/[\u{1F300}-\u{1FFFF}]/u)?.[0] || "🔔"}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold">New Notification</p>
            <p className={`text-xs mt-0.5 leading-relaxed ${darkMode ? "text-gray-300" : "text-slate-500"}`}>
              {toast.text.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").trim()}
            </p>
            {toast.link && (
              <button
                onClick={() => { navigate(toast.link); setToast(null); }}
                className="mt-2 text-xs font-semibold text-indigo-500 hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Open →
              </button>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            className={`h-9 w-9 flex items-center justify-center rounded-xl font-bold shrink-0 transition ${
              darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span style={{fontSize: "18px", lineHeight: 1}}>✕</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
