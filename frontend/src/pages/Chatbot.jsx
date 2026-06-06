import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Setting from "./Setting";
import AppNavbar from "../Components/AppNavbar";
import logo from "../assets/logo pic.png";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

import {
  FaRobot,
  FaUser,
  FaChartBar,
  FaBars,
  FaBell,
  FaSignOutAlt,
  FaCog,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaSmile,
  FaHeart,
  FaStar,
  FaLeaf,
  FaBolt,
  FaMoon,
  FaSun,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const QUICK_REPLIES = [
  { label: "😔 I feel sad", text: "I feel sad today" },
  { label: "😰 I'm anxious", text: "I'm feeling anxious" },
  { label: "😤 I'm stressed", text: "I'm really stressed" },
  { label: "😊 I feel good", text: "I'm feeling good today" },
  { label: "😴 Can't sleep", text: "I can't sleep properly" },
  { label: "😠 I'm angry", text: "I'm feeling angry" },
];

const MOOD_TAGS = [
  { emoji: "😊", label: "Happy", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { emoji: "😢", label: "Sad", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { emoji: "😰", label: "Anxious", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { emoji: "😤", label: "Stressed", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { emoji: "😴", label: "Tired", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { emoji: "💪", label: "Strong", color: "bg-green-100 text-green-700 border-green-200" },
];

const BOT_AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-pink-500",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, darkMode }) {
  const isUser = msg.sender === "user";
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 mb-5 transition-all duration-500 ${
        isUser ? "justify-end" : "justify-start"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
          <FaRobot className="text-white text-sm" />
        </div>
      )}

      <div className={`max-w-[85%] md:max-w-[72%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isUser && (
          <span className="text-xs font-semibold text-indigo-500 ml-1">Mannlytics</span>
        )}
        <div className="group relative">
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              isUser
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm"
                : darkMode
                ? "bg-gray-700 text-gray-100 rounded-tl-sm"
                : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
            }`}
          >
            {msg.text}
          </div>
          {!isUser && (
            <button
              onClick={handleCopy}
              className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg text-xs shadow-md ${
                darkMode ? "bg-gray-600 text-gray-200 hover:bg-gray-500" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
              title="Copy message"
            >
              {copied ? "✓" : "⎘"}
            </button>
          )}
        </div>
        <span className={`text-[10px] px-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          {msg.time}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-md">
          <FaUser className="text-white text-sm" />
        </div>
      )}
    </div>
  );
}

// ── Toast Component ──
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-5 py-3 rounded-2xl shadow-lg text-sm flex items-center gap-3 animate-bounce">
      <span>❌ {message}</span>
      <button onClick={onClose} className="font-bold">✕</button>
    </div>
  );
}

function Chatbot() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarState");
    return saved === null ? true : saved === "true";
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [toast, setToast] = useState(null);
  const [showMobileChats, setShowMobileChats] = useState(false);
  const lastSentRef = useRef(0);
  const recognitionRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const getRawEmail = (val) => {
    if (!val) return null;
    try { const p = JSON.parse(val); return p.email || null; } catch { return val; }
  };
  const currentUserEmail = getRawEmail(sessionStorage.getItem("currentUser")) || null;

  const currentUserName =
    sessionStorage.getItem("currentUserName") ||
    localStorage.getItem(`name_${currentUserEmail}`) ||
    "User";

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      if (!currentUserEmail) return;
      try {
        const res = await fetch(`${API_BASE}/api/chats/${encodeURIComponent(currentUserEmail)}`);
        const data = await res.json();
        setChats(data);
      } catch {}
    };
    loadChats();
  }, [currentUserEmail]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello ${currentUserName.split(" ")[0]} 👋 I'm Mannlytics, your personal mental wellness companion. How are you feeling today?`,
      time: now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, loading]);

  const handleMessagesScroll = (e) => {
    const el = e.target;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
  };

  const sendMessage = async (customText) => {
    const userText = (customText ?? input).trim();
    if (!userText || loading) return;

    // Rate limiting — 2 second gap
    const now2 = Date.now();
    if (now2 - lastSentRef.current < 2000) {
      setToast("Please wait a moment before sending again.");
      return;
    }
    lastSentRef.current = now2;

    // XSS sanitize
    const safeText = userText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setInput("");
    setCharCount(0);
    setShowMoodPicker(false);

    const newMessages = [...messages, { sender: "user", text: safeText, time: now() }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: safeText,
          chatId: activeChatId,
          userEmail: currentUserEmail,
          history: messages.slice(1).slice(-10),
        }),
      });

      if (!res.ok) throw new Error("Server error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";
      let metaHandled = false;

      // Add empty bot message to stream into, loading dots hatao
      setLoading(false);
      setMessages((prev) => [...prev, { sender: "bot", text: "", time: now() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const parsed = JSON.parse(line.replace("data: ", ""));

          if (parsed.type === "meta" && !metaHandled) {
            metaHandled = true;
            const { chatId: newChatId, chatTitle } = parsed;
            if (newChatId && !activeChatId) {
              setActiveChatId(newChatId);
              setChats((prev) => [{ _id: newChatId, messages: newMessages, createdAt: new Date(), title: chatTitle }, ...prev]);
            }
          }

          if (parsed.type === "token") {
            botText += parsed.token;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], text: botText };
              return updated;
            });
          }

          if (parsed.type === "error") throw new Error(parsed.message);
        }
      }

    } catch {
      setToast("Connection failed. Please try again. 💙");
      setMessages((prev) => [...prev, { sender: "bot", text: "I'm having trouble connecting right now. Please try again in a moment. 💙", time: now() }]);
    }

    setLoading(false);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    sendMessage(`I'm feeling ${mood.label.toLowerCase()} ${mood.emoji}`);
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = selectedLang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join("");
      setInput(transcript);
      setCharCount(transcript.length);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const toggleDarkMode = useCallback(() => {
    setDarkMode((p) => { localStorage.setItem("darkMode", String(!p)); return !p; });
  }, []);

  const handleCloseMobileChats = useCallback(() => setShowMobileChats(false), []);
  const handleCloseSettings = useCallback(() => setOpenSettings(false), []);
  const handleCloseToast = useCallback(() => setToast(null), []);

  const bg = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-indigo-50 via-white to-purple-50";

  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const inputBg = darkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400";
  const sidebarBg = darkMode ? "bg-gray-800" : "bg-white";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${bg} transition-colors duration-300`}>
      <AppNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* ── MOBILE BOTTOM SHEET ── */}
      {showMobileChats && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseMobileChats} />
          <div className={`absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl z-50 flex flex-col max-h-[92vh] ${darkMode ? "bg-gray-900 text-white" : "bg-white text-slate-800"}`}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <p className="font-semibold text-sm">Chat History</p>
              <button
                onClick={() => {
                  setActiveChatId(null);
                  setMessages([{ sender: "bot", text: `Hello again ${currentUserName.split(" ")[0]} 👋 Starting a new conversation. What's on your mind?`, time: now() }]);
                  setSelectedMood(null);
                  setShowMobileChats(false);
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white px-3 py-1.5 rounded-xl text-xs font-medium"
              >
                <FaPlus className="text-[10px]" /> New Chat
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-3 py-3">
              {chats.length === 0 && (
                <p className={`text-xs px-2 mt-2 ${darkMode ? "text-gray-500" : "text-slate-400"}`}>No chats yet. Start a conversation!</p>
              )}
              {chats.map((chat, i) => {
                const firstUserMsg = chat.messages?.find((m) => m.sender === "user");
                const rawTitle = chat.title || firstUserMsg?.text || "New conversation";
                const displayTitle = rawTitle.trim().split(" ").slice(0, 5).join(" ");
                const isActive = activeChatId === chat._id;
                return (
                  <button
                    key={chat._id || i}
                    onClick={() => {
                      setActiveChatId(chat._id);
                      setMessages(chat.messages?.length ? chat.messages : [{ sender: "bot", text: `Hello ${currentUserName.split(" ")[0]} 👋 How are you feeling?`, time: now() }]);
                      setShowMobileChats(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs mb-1 transition-all ${
                      isActive
                        ? darkMode ? "bg-gray-700 text-white font-medium" : "bg-indigo-50 text-indigo-700 font-medium"
                        : darkMode ? "text-gray-400 hover:bg-gray-800" : "text-slate-600 hover:bg-gray-100"
                    }`}
                  >
                    <p className="truncate">{displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 pt-20 overflow-hidden">

        {/* ── CHAT HISTORY SIDEBAR (desktop only) ── */}
        <div className={`hidden md:flex w-64 flex-shrink-0 flex-col overflow-hidden border-r shadow-sm ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-slate-800"}`}>

        {/* New Chat Button */}
        <div className={`p-3 pt-10 pb-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => {
              setActiveChatId(null);
              setMessages([{ sender: "bot", text: `Hello again ${currentUserName.split(" ")[0]} 👋 Starting a new conversation. What's on your mind?`, time: now() }]);
              setSelectedMood(null);
            }}
            className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 hover:opacity-90 text-white py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-md"
          >
            <FaPlus className="text-xs" /> New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className={`flex-1 overflow-y-auto px-3 pb-3 ${darkMode ? "bg-gray-900" : ""}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 pt-5 ${darkMode ? "text-indigo-400" : "text-indigo-400"}`}>Recents</p>

          {chats.length === 0 && (
            <p className={`text-xs px-2 mt-2 ${darkMode ? "text-gray-500" : "text-slate-400"}`}>No chats yet. Start a conversation!</p>
          )}

          {/* Group chats by date */}
          {(() => {
            const groups = {};
            chats.forEach((chat) => {
              const d = chat.createdAt ? new Date(chat.createdAt) : new Date();
              const today = new Date();
              const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
              let label;
              if (d.toDateString() === today.toDateString()) label = "Today";
              else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
              else label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              if (!groups[label]) groups[label] = [];
              groups[label].push(chat);
            });

            return Object.entries(groups).map(([label, groupChats]) => (
              <div key={label} className="mb-3">
                <p className={`text-[10px] font-semibold px-2 mb-1 ${darkMode ? "text-gray-500" : "text-slate-400"}`}>{label}</p>
                <div className="space-y-0.5">
                  {groupChats.map((chat, i) => {
                    const firstUserMsg = chat.messages?.find((m) => m.sender === "user");
                    const rawTitle = chat.title || firstUserMsg?.text || "New conversation";
                    const words = rawTitle.trim().split(" ");
                    const title = words.slice(0, 5).join(" ");
                    const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);
                    const isActive = activeChatId === chat._id;
                    return (
                      <div key={chat._id || i} className="group relative">
                        <button
                          onClick={() => {
                            setActiveChatId(chat._id);
                            setMessages(
                              chat.messages?.length
                                ? chat.messages
                                : [{ sender: "bot", text: `Hello ${currentUserName.split(" ")[0]} 👋 How are you feeling?`, time: now() }]
                            );
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 pr-8 ${
                            isActive
                              ? darkMode ? "bg-gray-800 text-gray-100 font-medium" : "bg-indigo-50 text-indigo-700 font-medium"
                              : darkMode ? "bg-gray-800 text-gray-400 hover:text-gray-100" : "text-slate-600 hover:bg-gray-100 hover:text-slate-800"
                          }`}
                        >
                          <p className="truncate">{displayTitle}</p>

                        </button>

                        {/* Delete button on hover */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const safeId = /^[a-f\d]{24}$/i.test(chat._id) ? chat._id : null;
                            if (!safeId) return;
                            try {
                              await fetch(`${API_BASE}/api/chat/${safeId}`, {
                                method: "DELETE",
                                headers: { "x-user-email": currentUserEmail || "" },
                              });
                              setChats((p) => p.filter((c) => c._id !== safeId));
                              if (activeChatId === safeId) {
                                setActiveChatId(null);
                                setMessages([{ sender: "bot", text: `Hello ${currentUserName.split(" ")[0]} 👋 How are you feeling today?`, time: now() }]);
                              }
                            } catch {}
                          }}
                          className={`absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all duration-150 ${darkMode ? "hover:bg-red-900/30 text-gray-500 hover:text-red-400" : "hover:bg-red-100 text-slate-400 hover:text-red-500"}`}
                          title="Delete chat"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Bottom branding */}
        <div className={`p-4 border-t flex flex-col items-center gap-1.5 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <img src={logo} alt="Mannlytics" className="w-14 h-14 rounded-xl object-cover" />
          <p className="text-xs font-bold text-indigo-600">Mannlytics</p>
          <p className="text-[10px] text-slate-400">Your AI Companion 💙</p>
        </div>

      </div>

      {/* ── MAIN CHAT ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">


        <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 relative">

          {/* Welcome card when only greeting */}
          {messages.length === 1 && (
            <div className={`mb-6 rounded-2xl md:rounded-3xl p-4 md:p-6 border ${darkMode ? "bg-gray-800/60 border-gray-700" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                  <FaHeart className="text-white text-base md:text-lg" />
                </div>
                <div>
                  {currentUserEmail ? (
                    <>
                      <h3 className="font-bold text-base md:text-lg">
                        {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {currentUserName.split(" ")[0]}! 👋
                      </h3>
                      <p className={`text-xs md:text-sm ${mutedText}`}>How are you feeling today?</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-base md:text-lg">
                        {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}! 👋
                      </h3>
                      <p className="text-xs md:text-sm text-indigo-500 font-medium">
                        <span className="cursor-pointer hover:underline" onClick={() => navigate("/login")}>Login</span> to save your chat history 💙
                      </p>
                    </>
                  )}
                </div>
              </div>

              <p className={`text-xs md:text-sm leading-relaxed mb-4 ${mutedText}`}>
                Share how you're feeling, pick a mood, or just start typing. I'm here to listen. 💙
              </p>

              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                {MOOD_TAGS.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood)}
                    className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl border text-xs font-medium transition-all duration-200 hover:scale-105 ${mood.color}`}
                  >
                    <span className="text-sm md:text-base">{mood.emoji}</span>
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} darkMode={darkMode} />
          ))}

          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md flex-shrink-0">
                <FaRobot className="text-white text-sm" />
              </div>
              <div className={`rounded-2xl rounded-tl-sm shadow-sm border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"}`}>
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 md:bottom-24 right-4 md:right-6 z-10 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700 hover:scale-110"
            title="Scroll to latest"
          >
            ↓
          </button>
        )}


        {/* Input area */}
        <div className={`px-3 md:px-6 py-3 md:py-4 border-t ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white/90 border-gray-100"} backdrop-blur-xl`}>

          {/* Mobile Chats Button */}
          <div className="flex md:hidden gap-2 mb-2">
            <button
              onClick={() => setShowMobileChats(true)}
              className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium shadow-sm justify-center ${
                darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }`}
            >
              <FaBars className="text-xs" /> Chat History
            </button>
            <button
              onClick={() => {
                setActiveChatId(null);
                setMessages([{ sender: "bot", text: `Hello again ${currentUserName.split(" ")[0]} 👋 Starting a new conversation. What's on your mind?`, time: now() }]);
                setSelectedMood(null);
              }}
              className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium shadow-sm justify-center bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white"
            >
              <FaPlus className="text-xs" /> New Chat
            </button>
          </div>

          <div className={`flex items-end gap-3 rounded-2xl border p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-400/50 ${darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); sendMessage(); }
                if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); sendMessage(); }
              }}
              placeholder={selectedLang === "hi-IN" ? "आप कैसा महसूस कर रहे हैं..." : selectedLang === "ur-PK" ? "آپ کیسا محسوس کر رہے ہیں..." : selectedLang === "pa-IN" ? "ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ..." : selectedLang === "ar-SA" ? "كيف تشعر الآن..." : selectedLang === "fr-FR" ? "Comment vous sentez-vous..." : selectedLang === "es-ES" ? "¿Cómo te sientes..." : selectedLang === "de-DE" ? "Wie fühlen Sie sich..." : selectedLang === "zh-CN" ? "你现在感觉怎么样..." : selectedLang === "bn-IN" ? "আপনি কেমন অনুভব করছেন..." : "Share how you're feeling... (Enter to send)"}
              rows={1}
              maxLength={500}
              className={`flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed max-h-32 ${darkMode ? "text-white placeholder-gray-500" : "text-gray-800 placeholder-gray-400"}`}
              style={{ minHeight: "24px" }}
            />

            <div className="flex items-center gap-2 flex-shrink-0">
              {charCount > 0 && (
                <span className={`text-xs ${charCount > 450 ? "text-rose-400" : mutedText}`}>
                  {charCount}/500
                </span>
              )}

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-xl transition ${isRecording ? "bg-rose-100 text-rose-500 animate-pulse" : darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-200"}`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <FaStop className="text-sm" /> : <FaMicrophone className="text-sm" />}
              </button>

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>

        </div>
      </div>

      </div>

      {/* Settings modal */}
      {openSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseSettings} />
          <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 z-50 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <button onClick={handleCloseSettings} className="absolute top-4 right-4 text-lg">✖</button>
            <Setting />
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={handleCloseToast} />}

      <style>{`
        textarea { scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default Chatbot;
