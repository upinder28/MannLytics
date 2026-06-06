import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import toast, { Toaster } from "react-hot-toast";

export default function Settings({ onClose }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    // apply on mount
    document.body.classList.toggle("dark", localStorage.getItem("darkMode") === "true");

    // sync when profile page toggles dark mode
    const handleDarkModeSync = () => {
      const isDark = localStorage.getItem("darkMode") === "true";
      setDarkMode(isDark);
      document.body.classList.toggle("dark", isDark);
    };

    window.addEventListener("darkModeUpdate", handleDarkModeSync);
    return () => window.removeEventListener("darkModeUpdate", handleDarkModeSync);
  }, []);
  const [notifications, setNotifications] = useState(true);
const [isEditing, setIsEditing] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  // LOAD USER
  useEffect(() => {
 const storedUser =
  sessionStorage.getItem("currentUser") ||
  localStorage.getItem("currentUser");

if (!storedUser) return;

let email = storedUser;

// 🔥 FIX: if object stored
try {
  const parsed = JSON.parse(storedUser);
  email = parsed.email;
} catch {
  email = storedUser;
}

  // 🔥 BACKEND DATA LOAD
  fetch(`${import.meta.env.VITE_API_URL}/user/${email}`)
    .then(res => res.json())
    .then(data => {
      setUser({
        name: data.name || "",
        email: data.email || "",
        password: "",
      });
      setNotifications(data.notifications ?? true);
    })
    .catch(err => console.error(err));

  const handleProfileUpdate = () => {
    setUser(prev => ({
      ...prev,
      name: sessionStorage.getItem("currentUserName") || prev.name,
    }));
  };

  window.addEventListener("profileUpdate", handleProfileUpdate);
  return () => window.removeEventListener("profileUpdate", handleProfileUpdate);

}, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = async () => {
    if (!oldPassword || !user.password || !confirmPassword) {
      return toast.error("Please fill in all password fields");
    }
    if (user.password !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (user.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          oldPassword,
          newPassword: user.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Failed to update password");
      toast.success("Password updated successfully!");
      setOldPassword("");
      setUser(prev => ({ ...prev, password: "" }));
      setConfirmPassword("");
    } catch {
      toast.error("Error updating password");
    }
  };

  const handleToggleNotifications = (value) => {
    setNotifications(value);
    if (!user.email) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, notifications: value }),
    }).catch(() => {});
  };

  const handleSave = () => {
  if (!user.email) return;

  // 🔥 BACKEND API CALL
  fetch(`${import.meta.env.VITE_API_URL}/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      darkMode: darkMode,
      notifications: notifications,
      ...(user.password && { password: user.password }),
    }),
  })
    .then(res => res.json())
    .then(() => {
      sessionStorage.setItem("currentUserName", user.name);
      window.dispatchEvent(new Event("profileUpdate"));
      setIsEditing(false);
      toast.success("Changes saved successfully!");
    })
    .catch(() => {
      toast.error("Error saving changes");
    });
};

  return (
    <div className={`w-full ${ darkMode ? "bg-gray-800 text-white" : "bg-white" } rounded-3xl flex flex-col max-h-[90vh]`}>

        {/* HEADER — sticky, never scrolls */}
        <div className={`flex justify-between items-center px-4 sm:px-8 pt-8 pb-4 border-b flex-shrink-0 ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-white"
        } rounded-t-3xl`}>
          <div>
            <h1 className="text-3xl font-bold text-indigo-600">Settings ⚙️</h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              Manage your account & preferences
            </p>
          </div>
          <button
            onClick={() => onClose ? onClose() : navigate("/profile")}
            className="text-gray-400 hover:bg-red-100 hover:text-red-600 text-xl transition w-9 h-9 flex items-center justify-center rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT ONLY */}
        <div className="px-4 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">

        {/* PROFILE SECTION */}
<div className={`p-5 border rounded-xl ${ darkMode ? "border-gray-600" : "" }`}>

  {/* HEADER + EDIT BUTTON */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-indigo-600">👤 Profile Information</h2>

    <button
      onClick={() => setIsEditing(!isEditing)}
      className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-200 transition"
    >
      {isEditing ? "Cancel" : "Edit"}
    </button>
  </div>

  {/* INPUTS */}
  <div className="space-y-3">
    
    {/* NAME */}
    <input
      type="text"
      name="name"
      value={user.name}
      onChange={handleChange}
      disabled={!isEditing}
      placeholder="Your Name"
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
        !isEditing ? (darkMode ? "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-600" : "bg-gray-100 cursor-not-allowed") : darkMode ? "bg-gray-700 text-white border-gray-600" : ""
      }`}
    />

    {/* EMAIL (ALWAYS DISABLED) */}
    <input
      type="email"
      name="email"
      value={user.email}
      disabled
      className={`w-full p-3 border rounded-lg cursor-not-allowed ${ darkMode ? "bg-gray-600 text-gray-300 border-gray-600" : "bg-gray-100" }`}
    />
  </div>

  {/* SAVE BUTTON (INSIDE SECTION OPTIONAL) */}
  {isEditing && (
    <div className="mt-4 text-right">
      <button
        onClick={handleSave}
        className="text-sm border border-indigo-500 text-indigo-600 px-4 py-1 rounded-full hover:bg-indigo-50 transition"
      >
        Save Profile
      </button>
    </div>
  )}
</div>

        {/* SECURITY SECTION */}
        <div className={`p-5 border rounded-xl ${ darkMode ? "border-gray-600" : "" }`}>
          <h2 className="text-lg font-semibold mb-4 text-indigo-600">
            🔐 Security
          </h2>
  <div className="space-y-3">

    {/* CURRENT PASSWORD */}
    <div className="relative">
      <input
        type={showOldPw ? "text" : "password"}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Current Password"
        className={`w-full p-3 border rounded-lg pr-10 ${ darkMode ? "bg-gray-700 text-white border-gray-600" : "" }`}
      />
      <span onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
        {showOldPw ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* NEW PASSWORD */}
    <div className="relative">
      <input
        type={showNewPw ? "text" : "password"}
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="New Password"
        className={`w-full p-3 border rounded-lg pr-10 ${ darkMode ? "bg-gray-700 text-white border-gray-600" : "" }`}
      />
      <span onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
        {showNewPw ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* CONFIRM PASSWORD */}
    <div className="relative">
      <input
        type={showConfirmPw ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        className={`w-full p-3 border rounded-lg pr-10 ${ darkMode ? "bg-gray-700 text-white border-gray-600" : "" }`}
      />
      <span onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
        {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

  </div>

  <div className="flex justify-between items-center mt-3">
    <p className={`text-xs mt-3 ${ darkMode ? "text-gray-400" : "text-gray-400" }`}>Make sure password is strong 🔒</p>
    <button
      className="text-sm text-indigo-600 hover:underline"
      onClick={async () => {
        if (!user.email) return toast.error("Email not found");
        try {
          await sendPasswordResetEmail(auth, user.email);
          toast.success("Reset link sent to your email!");
        } catch (err) {
          toast.error(err.message);
        }
      }}
    >
      Forgot Password?
    </button>
  </div>

  <div className="mt-4 text-right">
    <button
      onClick={handlePasswordSave}
      className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      Save Password
    </button>
  </div>
   </div>


        {/* NOTIFICATION PREFERENCES */}
        <div className={`p-5 border rounded-xl ${ darkMode ? "border-gray-600" : "" }`}>
          <h2 className="text-lg font-semibold mb-1 text-indigo-600">🔔 Notifications</h2>
          <p className="text-xs text-gray-400 mb-4">Turn on to receive gentle check-ins and well-being reminders 💜</p>

          <div className={`flex items-center justify-between p-3 rounded-xl ${ darkMode ? "bg-gray-700" : "bg-gray-50" }`}>
            <div>
              <p className={`text-sm font-medium ${ darkMode ? "text-gray-200" : "text-gray-700" }`}>Enable Notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">Gentle reminders based on your mood activity</p>
            </div>
            <div
              onClick={() => handleToggleNotifications(!notifications)}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                notifications ? "bg-indigo-500" : "bg-gray-300"
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                notifications ? "translate-x-5" : "translate-x-0"
              }`} />
            </div>
          </div>
        </div>

<div className={`p-5 border border-red-200 rounded-xl ${ darkMode ? "bg-red-900/20" : "bg-red-50" }`}>
  <h2 className="text-lg font-semibold mb-3 text-red-500">⚠️ Delete Account</h2>
  <p className={`text-sm mb-4 ${ darkMode ? "text-gray-300" : "text-gray-600" }`}>
    Deleting your account will permanently remove all your data. This action cannot be undone.
  </p>
  {!confirmDelete ? (
    <button
      className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
      onClick={() => setConfirmDelete(true)}
    >
      Delete Account
    </button>
  ) : (
    <div className={`p-3 rounded-lg ${ darkMode ? "bg-gray-700" : "bg-white" } space-y-2`}>
      <p className="text-sm font-medium text-red-500">Are you sure? This cannot be undone.</p>
      <div className="flex gap-3">
        <button
          className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
          onClick={async () => {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${user.email}`, { method: "DELETE" });
              if (!res.ok) throw new Error();
              sessionStorage.clear();
              localStorage.removeItem(`moodHistory_${user.email}`);
              localStorage.removeItem(`journalStreak_${user.email}`);
              localStorage.removeItem(`lastDate_${user.email}`);
              window.dispatchEvent(new Event("profileUpdate"));
              if (onClose) onClose();
              navigate("/");
            } catch {
              toast.error("Failed to delete account");
              setConfirmDelete(false);
            }
          }}
        >
          Yes, Delete
        </button>
        <button
          className={`px-4 py-1.5 rounded-lg text-sm border transition ${ darkMode ? "border-gray-500 text-gray-300 hover:bg-gray-600" : "border-gray-300 text-gray-600 hover:bg-gray-100" }`}
          onClick={() => setConfirmDelete(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

        </div>
      <Toaster position="top-center" />
    </div>
  );
}