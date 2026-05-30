import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AiAnalysis from "./pages/AiAnalysis";
import ProgressTracking from "./pages/ProgressTracking";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import Setting from "./pages/Setting";
import SafeSpace from "./pages/Safespace";
import DetailedAnalysis from "./pages/DetailedAnalysis";
import MentalHealthLibrary from "./pages/MentalHealthLibrary";


import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLibrary from "./pages/AdminLibrary";
import AdminSafeSpace from "./pages/AdminSafeSpace";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  const token = sessionStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-analysis" element={<AiAnalysis />} />
        <Route path="/progress" element={<ProgressTracking />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/safe-space" element={<SafeSpace />} />
        <Route path="/detailed-analysis" element={<DetailedAnalysis/>}/>
        <Route path="/library" element={<ProtectedRoute><MentalHealthLibrary/></ProtectedRoute>}/>




        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
        <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
        <Route path="/admin/library" element={<AdminProtectedRoute><AdminLibrary /></AdminProtectedRoute>} />
        <Route path="/admin/safespace" element={<AdminProtectedRoute><AdminSafeSpace /></AdminProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
