import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { analyzeJournal } from "../services/api";
import { getSuggestions } from "../utils/moodUtils";
import AppNavbar from "../Components/AppNavbar";
import { FaHeart, FaMicrophone, FaStop } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EMOTION_NOTIFICATIONS = {
  happiness: { text: "You're radiating positivity today! 🌟 Keep spreading those good vibes!", sound: "happy" },
  joy:       { text: "What a wonderful mood you're in! 😊 This energy is contagious!", sound: "happy" },
  sadness:   { text: "It's okay to feel this way. 💙 You're not alone, and this feeling will pass.", sound: "gentle" },
  sad:       { text: "Sending you gentle support. 🌿 Take your time, be kind to yourself.", sound: "gentle" },
  anxiety:   { text: "Take a deep breath. 🌬️ You're safe right now. Try some calming exercises.", sound: "calm" },
  stress:    { text: "You're handling a lot right now. 🌱 Remember to take breaks and breathe.", sound: "calm" },
  anger:     { text: "These feelings are valid. 🔥 Channel this energy into something positive when ready.", sound: "neutral" },
  neutral:   { text: "A balanced state of mind. ⚖️ Perfect time for reflection and planning.", sound: "neutral" },
};

const EMOTION_MAP = {
  happiness: { emoji: "😊", score: 9 },
  joy:       { emoji: "😊", score: 9 },
  sadness:   { emoji: "😢", score: 3 },
  sad:       { emoji: "😢", score: 3 },
  anger:     { emoji: "😠", score: 4 },
  anxiety:   { emoji: "😟", score: 4 },
  stress:    { emoji: "😣", score: 4 },
  neutral:   { emoji: "😐", score: 5 },
};

const DAILY_PROMPTS = [
  "Write how you're feeling today...",
  "What's one thing on your mind right now?",
  "How did today go for you?",
  "What emotion are you experiencing?",
  "Describe your current state of mind...",
];

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const journalRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [highlightJournal, setHighlightJournal] = useState(false);
  const [journal, setJournal] = useState("");
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const isAnalyzingRef = useRef(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeSuccess, setAnalyzeSuccess] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [journalError, setJournalError] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [showCalmPopup, setShowCalmPopup] = useState(false);
  const [calmVisited, setCalmVisited] = useState(false);
  const popupTimerRef = useRef(null);
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);
  const [checkinMsg, setCheckinMsg] = useState(null);
  const [checkinFading, setCheckinFading] = useState(false);

  const currentUserEmail =
    sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
  const currentUserName =
    sessionStorage.getItem("currentUserName") ||
    localStorage.getItem(`name_${currentUserEmail}`) ||
    "User";

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", next);
    document.body.classList.toggle("dark", next);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (location.state?.highlightJournal) {
      setHighlightJournal(true);
      setTimeout(() => {
        journalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        journalRef.current?.focus();
      }, 300);
      setTimeout(() => setHighlightJournal(false), 3000);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.restoreResult) {
      setResult(location.state.restoreResult);
      setJournal(location.state.restoreJournal || "");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    };
  }, []);

  // Load streak + notification
  useEffect(() => {
    if (!currentUserEmail) return;
    const saved = localStorage.getItem(`journalStreak_${currentUserEmail}`);
    if (saved) {
      const parsed = parseInt(saved);
      if (!isNaN(parsed)) setStreak(parsed);
    }

    // Mood check-in — show once per day
    const lastCheckin = localStorage.getItem(`moodCheckinDate_${currentUserEmail}`);
    const today = new Date().toDateString();
    if (lastCheckin !== today) {
      setTimeout(() => setShowMoodCheckin(true), 800);
    }
  }, [currentUserEmail]);

  const saveHistoryEntry = (analysisResult, currentJournal) => {
    if (!currentUserEmail) return;
    const key = `moodHistory_${currentUserEmail}`;
    const history = JSON.parse(localStorage.getItem(key)) || [];
    const entry = {
      id: Date.now(),
      score: Number(analysisResult.score || 0),
      confidence: Number(((analysisResult.confidence || 0) * 100).toFixed(1)),
      riskScore: Number((analysisResult.riskScore || 0).toFixed(2)),
      sentimentScore: Number((analysisResult.sentiment_score || 0).toFixed(3)),
      emotion: analysisResult.emotion || "neutral",
      predictedLabel: analysisResult.predicted_label || "Normal",
      journal: currentJournal,
      day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify([...history, entry]));
    window.dispatchEvent(new Event("storage"));
  };

  const analyzeEmotion = async () => {
    if (isAnalyzingRef.current) return;
    if (!journal.trim()) {
      setJournalError(true);
      setTimeout(() => setJournalError(false), 3000);
      return;
    }
    setJournalError(false);
    setAnalyzeError("");
    isAnalyzingRef.current = true;
    setIsAnalyzing(true);
    try {
      const data = await analyzeJournal(journal, currentUserEmail);
      const analysis = data.analysis || data;
      const emotionKey = (analysis.emotion || "neutral").toLowerCase();
      const meta = EMOTION_MAP[emotionKey] || { emoji: "😐", score: 5 };
      const normalizedResult = {
        emotion: analysis.emotion || "neutral",
        emoji: meta.emoji,
        score: analysis.riskScore
          ? Math.min(10, Math.max(1, Math.round(analysis.riskScore / 10)))
          : meta.score,
        predicted_label: analysis.predicted_label || "Normal",
        confidence: analysis.confidence || 0,
        riskScore: analysis.riskScore || 0,
        sentiment_score: analysis.sentiment_score || 0,
        cognitive_distortions: analysis.cognitive_distortions || [],
        behavioral_signals: analysis.behavioral_signals || [],
        suggestions: analysis.suggestions || [],
      };
      setResult(normalizedResult);
      saveHistoryEntry(normalizedResult, journal);
      setHistoryVersion(v => v + 1);
      setAnalyzeSuccess(true);
      setTimeout(() => setAnalyzeSuccess(false), 2000);

      const notificationEmotionKey = (normalizedResult.emotion || "neutral").toLowerCase();
      const notificationData = EMOTION_NOTIFICATIONS[notificationEmotionKey] || EMOTION_NOTIFICATIONS.neutral;
      
      // Dispatch notification event to AppNavbar
      window.dispatchEvent(new CustomEvent('showEmotionNotification', {
        detail: {
          text: notificationData.text,
          emotion: normalizedResult.emotion,
          emoji: normalizedResult.emoji,
          sound: notificationData.sound
        }
      }));

      // show calm corner popup after analysis — once per session
      if (!calmVisited) {
        setTimeout(() => {
          setShowCalmPopup(true);
          popupTimerRef.current = setTimeout(() => setShowCalmPopup(false), 15000);
        }, 800);
      }

      const today = new Date().toDateString();
      const lastDate = localStorage.getItem(`lastDate_${currentUserEmail}`);
      if (lastDate !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem(`journalStreak_${currentUserEmail}`, newStreak);
        localStorage.setItem(`lastDate_${currentUserEmail}`, today);
      }
    } catch (err) {
      console.error(err);
      setAnalyzeError("Something went wrong. Please check your connection and try again.");
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError("Please use Google Chrome for voice input.");
      return;
    }
    setVoiceError("");

    // explicitly request mic permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceError("Microphone access denied. Please allow microphone in your browser settings.");
      return;
    }

    try {
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      let finalTranscript = "";

      recognition.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0]?.transcript || "";
          if (e.results[i].isFinal) finalTranscript += ` ${t}`;
          else interim += t;
        }
        setJournal(`${finalTranscript} ${interim}`.trim());
      };

      recognition.onerror = (e) => {
        setIsRecording(false);
        if (e.error === "not-allowed") setVoiceError("Microphone access denied. Please allow microphone permission.");
        else if (e.error === "no-speech") setVoiceError("No speech detected. Please try again.");
        else if (e.error === "network") setVoiceError("Network error. Please check your connection.");
        else setVoiceError("Voice input failed. Please try again.");
      };

      recognition.onend = () => { setIsRecording(false); if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current); };
      recognition.start();
      setIsRecording(true);
      recordingTimerRef.current = setTimeout(() => { recognition.stop(); }, 60000);
    } catch {
      setIsRecording(false);
      setVoiceError("Could not start voice input. Please try again.");
    }
  };

  const stopRecording = () => { if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current); recognitionRef.current?.stop(); };

  // Emotion snapshot chart
  const detectedKey = (result?.emotion || "neutral").toLowerCase();
  const emotionBars = [
    { label: "Joy", color: "#facc15", keys: ["joy", "happiness"] },
    { label: "Sad", color: "#60a5fa", keys: ["sad", "sadness"] },
    { label: "Anxiety", color: "#a78bfa", keys: ["anxiety"] },
    { label: "Stress", color: "#fb923c", keys: ["stress"] },
    { label: "Anger", color: "#f87171", keys: ["anger", "angry"] },
    { label: "Neutral", color: "#94a3b8", keys: ["neutral"] },
  ];

  const chartData = {
    labels: emotionBars.map((e) => e.label),
    datasets: [{
      data: emotionBars.map((e) => (e.keys.includes(detectedKey) ? 100 : 12)),
      backgroundColor: emotionBars.map((e) => e.color),
      borderRadius: 14,
      borderSkipped: false,
      barThickness: 18,
    }],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => (ctx.raw === 100 ? " Active" : " Inactive") },
      },
    },
    scales: {
      x: { min: 0, max: 100, ticks: { color: darkMode ? "#cbd5e1" : "#64748b", callback: (v) => `${v}%` }, grid: { color: darkMode ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" } },
      y: { ticks: { color: darkMode ? "#f8fafc" : "#1e293b", font: { size: 12, weight: "700" } }, grid: { display: false } },
    },
  };

  // Fix 7 — memoize detectedSuggestions
  const detectedSuggestions = useMemo(() =>
    result
      ? (result.suggestions?.length ? result.suggestions : getSuggestions(detectedKey, result.predicted_label, result.riskScore, result.score))
      : [],
    [result, detectedKey]
  );

  // Stats from history — refreshes after each analysis
  const history = useMemo(
    () => JSON.parse(localStorage.getItem(`moodHistory_${currentUserEmail}`)) || [],
    [currentUserEmail, historyVersion]
  );
  const totalEntries = history.length;
  const todayDone = history.some(e => new Date(e.createdAt).toDateString() === new Date().toDateString());

  const getCalmMessage = () => {
    const e = detectedKey;
    if (["sad", "sadness"].includes(e)) return { title: "Feeling low? 💙", msg: "Some soothing music or comfort notes might help lift your spirits right now." };
    if (["anxiety"].includes(e)) return { title: "Feeling anxious? 🌬️", msg: "Try a breathing exercise — just 2 minutes can calm your mind significantly." };
    if (["stress"].includes(e)) return { title: "Feeling stressed? 🎮", msg: "A quick mini game or dance break might be exactly what you need right now." };
    if (["anger", "angry"].includes(e)) return { title: "Feeling frustrated? 🎧", msg: "Step away for a moment — some calming music or meditation can help reset your mood." };
    if (["joy", "happiness"].includes(e)) return { title: "You're in a great mood! 🎵", msg: "Celebrate this feeling — some upbeat music or a fun game to keep the energy going!" };
    return { title: "Take a moment for yourself 🌿", msg: "Calm Corner has music, breathing exercises, games and more to support your wellbeing." };
  };

  const CHECKIN_MESSAGES = useMemo(() => ({
    Happy:   { msg: "Love that energy! 🌟 Let's capture this feeling — write a journal entry to make the most of today.", color: "text-yellow-500", barColor: "bg-yellow-500", bg: darkMode ? "bg-yellow-500/10" : "bg-yellow-50", border: "border-yellow-200" },
    Neutral: { msg: "A calm day is a good day. ☀️ Ready to reflect? Your journal is waiting.", color: "text-slate-500", barColor: "bg-slate-500", bg: darkMode ? "bg-slate-500/10" : "bg-slate-50", border: "border-slate-200" },
    Sad:     { msg: "It's okay to feel this way. 💙 Let's understand what's going on — write it out and let the AI help.", color: "text-blue-500", barColor: "bg-blue-500", bg: darkMode ? "bg-blue-500/10" : "bg-blue-50", border: "border-blue-200" },
    Anxious: { msg: "Take a breath. 🌬️ You're safe here. Writing down your thoughts can really help ease the mind.", color: "text-violet-500", barColor: "bg-violet-500", bg: darkMode ? "bg-violet-500/10" : "bg-violet-50", border: "border-violet-200" },
    Stressed:{ msg: "You're carrying a lot. 🌿 Let's break it down together — start with a few lines in your journal.", color: "text-orange-500", barColor: "bg-orange-500", bg: darkMode ? "bg-orange-500/10" : "bg-orange-50", border: "border-orange-200" },
    Angry:   { msg: "Frustration is valid. 🔥 Writing it out can help you process and release it. Let's start.", color: "text-red-500", barColor: "bg-red-500", bg: darkMode ? "bg-red-500/10" : "bg-red-50", border: "border-red-200" },
  }), [darkMode]);

  const handleMoodCheckin = async (emoji, label) => {
    const msgData = CHECKIN_MESSAGES[label];
    setCheckinMsg({ emoji, label, ...msgData });
    setCheckinFading(false);
    setShowMoodCheckin(false);
    localStorage.setItem(`moodCheckinDate_${currentUserEmail}`, new Date().toDateString());
    setTimeout(() => setCheckinFading(true), 4100);
    setTimeout(() => { setCheckinMsg(null); setCheckinFading(false); }, 4500);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/mood-checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, label, userEmail: currentUserEmail }),
      });
    } catch { /* silent fail */ }
  };

  const card = darkMode ? "bg-gray-800" : "bg-white/80";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const heading = darkMode ? "text-white" : "text-gray-800";

  const { greeting, emoji: timeEmoji } = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return { greeting: "Good morning", emoji: "☀️" };
    if (h >= 12 && h < 17) return { greeting: "Good afternoon", emoji: "🌤️" };
    if (h >= 17 && h < 21) return { greeting: "Good evening", emoji: "🌙✨" };
    return { greeting: "Hello", emoji: "👋" };
  }, []);

  const dailyPrompt = useMemo(() => DAILY_PROMPTS[new Date().getDate() % DAILY_PROMPTS.length], []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 via-white to-indigo-100"}`}>
      <AppNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="pt-20 sm:pt-24 px-3 sm:px-6 lg:px-16 pb-12">

        {/* GREETING */}
        <div className="mb-6">
          <h1 className={`text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold break-words ${heading}`}>
            {greeting},{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              {currentUserName.split(" ")[0]}
            </span>{" "}
            {timeEmoji}
          </h1>
          <p className={`text-base md:text-lg mt-3 ${muted}`}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Streak", emoji: "🔥", value: streak ? `${streak} days` : "0 days", hint: !streak ? "Start your first entry!" : null, color: "text-orange-500", iconBg: "bg-orange-100" },
            { label: "Total Entries", emoji: "📝", value: totalEntries || "0", hint: !totalEntries ? "Write your first journal" : null, color: "text-indigo-500", iconBg: "bg-indigo-100" },
            { label: "Today", emoji: "✍️", value: todayDone ? "Done ✅" : "Not yet", color: todayDone ? "text-green-500" : "text-rose-400", iconBg: todayDone ? "bg-green-100" : "bg-rose-100" },
          ].map((item) => (
            <div key={item.label} className={`${card} backdrop-blur-xl p-3 rounded-2xl shadow-md flex flex-col items-center justify-between text-center min-h-[100px] ${
              item.label === "Today" ? "col-span-2 md:col-span-1" : ""
            }`}>
              <div className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center text-2xl`}>
                {item.emoji}
              </div>
              <p className={`text-xs font-extrabold ${muted}`}>{item.label}</p>
              <p className={`text-xl font-bold capitalize ${item.color}`}>{item.value}</p>
              {item.hint && <p className={`text-xs ${muted} italic`}>{item.hint}</p>}
            </div>
          ))}
        </div>


        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — JOURNAL + RESULTS */}
          <div className="lg:col-span-3 space-y-5">

            {/* JOURNAL CARD */}
            <div ref={journalRef} className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md transition-all duration-500 ${
              highlightJournal ? "ring-4 ring-indigo-400 ring-offset-2 shadow-indigo-300/50 shadow-xl" : ""
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg sm:text-2xl font-extrabold ${heading}`}>💭 What's On Your Mind?</h2>
                {journal && (
                  <button
                    onClick={() => { setJournal(""); setJournalError(false); setResult(null); }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${darkMode ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"}`}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={journal}
                  onChange={(e) => { setJournal(e.target.value.slice(0, 1000)); if (journalError) setJournalError(false); }}
                  rows={5}
                  maxLength={1000}
                  placeholder={dailyPrompt}
                  className={`w-full border-2 rounded-xl p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 transition ${journalError ? "border-red-400 focus:ring-red-300" : "border-indigo-200 focus:ring-indigo-300"} ${darkMode ? "bg-gray-900 text-gray-100 placeholder-gray-500" : "bg-white text-gray-800 placeholder-gray-400"}`}
                />
                <span className={`absolute bottom-3 right-3 text-xs ${journal.length > 900 ? "text-rose-400" : muted}`}>
                  {journal.length}/1000
                </span>
              </div>
              {journalError && <p className="mt-2 text-xs text-red-500 font-medium">⚠️ Please write something before analyzing.</p>}
              {analyzeError && <p className="mt-2 text-xs text-red-500 font-medium">⚠️ {analyzeError}</p>}
              {voiceError && <p className="mt-2 text-xs text-red-500">{voiceError}</p>}

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={analyzeEmotion}
                  disabled={isAnalyzing || analyzeSuccess}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {isAnalyzing && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isAnalyzing ? "Analyzing..." : analyzeSuccess ? "✓ Done" : "Analyze"}
                </button>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white transition ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"}`}
                >
                  {isRecording ? <FaStop /> : <FaMicrophone />}
                  {isRecording ? "Stop" : "Speak"}
                </button>
                {isRecording && <p className="text-xs text-indigo-500 animate-pulse">Recording...</p>}
              </div>
            </div>

            {/* RESULT + SUGGESTIONS */}
            {result && (
              <>
                {/* RESULT CARD */}
                <div className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md border-l-4 border-indigo-500`}>
                  <h3 className={`text-base font-extrabold mb-3 ${heading}`}>🧠 Analysis Result</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Emotion", value: `${result.emotion} ${result.emoji}` },
                      ["joy", "happiness"].includes(detectedKey)
                        ? { label: "Vibe", value: result.sentiment_score >= 0.6 ? "✨ Excellent" : result.sentiment_score >= 0.3 ? "😊 Good" : "🙂 Decent" }
                        : ["sad", "sadness", "anxiety", "stress", "anger", "angry"].includes(detectedKey)
                        ? { label: "Intensity", value: result.riskScore >= 70 ? "🔴 High" : result.riskScore >= 40 ? "🟡 Moderate" : "🟢 Mild" }
                        : { label: "Risk Score", value: result.riskScore >= 70 ? `${result.riskScore.toFixed(1)} 🔴` : result.riskScore >= 40 ? `${result.riskScore.toFixed(1)} 🟡` : `${result.riskScore.toFixed(1)} 🟢` },
                      { label: "Label", value: result.predicted_label },
                      { label: "Confidence", value: `${Math.round((result.confidence || 0) * 100)}%` },
                    ].map((item) => (
                      <div key={item.label} className={`text-center p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className={`text-xs ${muted}`}>{item.label}</p>
                        <p className="font-bold text-indigo-500 capitalize mt-1 text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUGGESTIONS */}
                <div className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md`}>
                  <h3 className={`text-base font-extrabold mb-4 ${heading}`}>💡 Suggestions For You</h3>
                  <div className="space-y-3">
                    {detectedSuggestions.map((item, i) => (
                      <div key={`suggestion-${i}-${item.slice(0,10)}`} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${darkMode ? "bg-gray-700 text-gray-200" : "bg-indigo-50 text-gray-700"}`}>
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/detailed-analysis", { state: { result, journal } })}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-xl hover:scale-105 transition"
                  >
                    View Detailed Analysis →
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setJournal("");
                      setHighlightJournal(true);
                      setTimeout(() => {
                        journalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                        journalRef.current?.focus();
                      }, 100);
                      setTimeout(() => setHighlightJournal(false), 3000);
                    }}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold border-2 border-indigo-500 transition hover:scale-105 ${
                      darkMode ? "text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25" : "text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    🧠 New Analysis
                  </button>
                  {result.riskScore >= 40 && (
                    <button
                      onClick={() => navigate("/support")}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition hover:scale-105 ${darkMode ? "border-rose-400/40 bg-rose-500/10 text-rose-300" : "border-rose-200 bg-rose-50 text-rose-600"}`}
                    >
                      💙 Overwhelmed? View Support →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT — CHART + RECENT ENTRIES */}
          <div className="lg:col-span-2 space-y-5">

            {/* EMOTION SNAPSHOT */}
            <div className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md`}>
              <h3 className={`text-2xl font-extrabold mb-1 ${heading}`}>🎭 Emotion Pulse</h3>
              <p className={`text-xs mb-4 ${muted}`}>{result ? "Based on current detection" : "Analyze your journal to see results"}</p>
              {result ? (
                <>
                  <div className="h-[260px]">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                  <div className={`mt-4 rounded-xl p-3 ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className={`text-xs ${muted}`}>Current mood</p>
                    <p className={`text-base font-semibold capitalize mt-1 ${heading}`}>
                      {result.emotion} {result.emoji} · {["joy", "happiness"].includes(detectedKey) ? (result.sentiment_score >= 0.6 ? "✨ Excellent" : result.sentiment_score >= 0.3 ? "😊 Good" : "🙂 Decent") : ["sad", "sadness", "anxiety", "stress", "anger", "angry"].includes(detectedKey) ? (result.riskScore >= 70 ? "🔴 High" : result.riskScore >= 40 ? "🟡 Moderate" : "🟢 Mild") : `${result.riskScore.toFixed(1)}`}
                    </p>
                  </div>
                </>
              ) : (
                <div className={`h-[260px] flex flex-col items-center justify-center rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-indigo-50/50"}`}>
                  <div className="text-6xl mb-4 opacity-40 animate-pulse">📊</div>
                  <p className={`text-sm font-medium ${heading}`}>No emotion detected yet</p>
                  <p className={`text-xs mt-2 ${muted} text-center px-6`}>Write in your journal and click Analyze to see your emotion snapshot</p>
                </div>
              )}
            </div>

            {/* WELLNESS CARD — hide risk label for positive emotions */}
            {result && !(["joy", "happiness"].includes(detectedKey)) && (() => {
              const risk = result.riskScore || 0;
              const level = risk >= 70 ? "High" : risk >= 40 ? "Moderate" : "Low";
              const color = risk >= 70 ? "text-red-500" : risk >= 40 ? "text-yellow-500" : "text-green-500";
              const barColor = risk >= 70 ? "bg-red-500" : risk >= 40 ? "bg-yellow-400" : "bg-green-500";
              const desc = risk >= 70 ? "Your current state suggests significant emotional strain. Please take care of yourself." : risk >= 40 ? "Some emotional strain detected. Consider taking a break and practicing self-care." : "Your emotional state looks stable. Keep up the good work!";
              const dot = risk >= 70 ? "🔴" : risk >= 40 ? "🟡" : "🟢";
              return (
                <div className={`${card} backdrop-blur-xl p-5 rounded-2xl shadow-md`}>
                  <h3 className={`text-sm font-extrabold mb-3 ${heading}`}>⚠️ Risk Level</h3>
                  <p className={`text-xl font-bold ${color}`}>{dot} {level} Risk</p>
                  <div className={`mt-2 h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(risk, 100)}%` }} />
                  </div>
                  <p className={`text-xs mt-1 ${muted}`}>{risk.toFixed(1)}/100</p>
                  <p className={`text-sm mt-3 leading-relaxed ${muted}`}>{desc}</p>
                </div>
              );
            })()}

            {/* SENTIMENT METER */}
            {result && (() => {
              const s = result.sentiment_score || 0;
              const pct = Math.min(Math.abs(s) * 100, 100).toFixed(0);
              const label = s >= 0.3 ? "Strongly Positive" : s >= 0 ? "Mildly Positive" : s >= -0.3 ? "Mildly Negative" : "Strongly Negative";
              const barColor = s >= 0.3 ? "bg-green-500" : s >= 0 ? "bg-green-300" : s >= -0.3 ? "bg-orange-400" : "bg-red-500";
              return (
                <div className={`${card} backdrop-blur-xl p-5 rounded-2xl shadow-md`}>
                  <h3 className={`text-sm font-extrabold mb-3 ${heading}`}>💬 Sentiment Meter</h3>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-500 font-medium">😊 Positive</span>
                    <span className="text-red-400 font-medium">😔 Negative</span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className={`text-xs mt-2 ${muted}`}>Score: {s.toFixed(2)} · <span className="font-medium">{label}</span></p>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* MOOD CHECK-IN CONFIRMATION MESSAGE */}
      {checkinMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
              checkinFading ? "checkin-msg-fadeout" : "checkin-msg-pop"
            } ${checkinMsg.bg} ${checkinMsg.border}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0 checkin-emoji-bounce">{checkinMsg.emoji}</span>
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${checkinMsg.color}`}>
                  Feeling {checkinMsg.label}
                </p>
                <p className={`text-sm leading-relaxed font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                  {checkinMsg.msg}
                </p>
              </div>
            </div>
            {/* auto-dismiss progress bar */}
            <div className={`mt-4 h-1 rounded-full overflow-hidden ${ darkMode ? "bg-white/10" : "bg-black/10"}`}>
              <div className={`h-1 rounded-full checkin-progress ${checkinMsg.barColor}`} />
            </div>
          </div>
        </div>
      )}

      {/* MOOD CHECK-IN POPUP */}
      {showMoodCheckin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMoodCheckin(false)} />
          <div className={`relative z-10 w-full max-w-sm rounded-3xl shadow-2xl p-7 ${
            darkMode ? "bg-gray-800 border border-white/10" : "bg-white border border-indigo-100"
          }`}>
            {/* Close */}
            <button
              onClick={() => setShowMoodCheckin(false)}
              className={`absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-sm transition ${
                darkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-400 hover:bg-gray-100"
              }`}
            >✕</button>

            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
              darkMode ? "text-indigo-400" : "text-indigo-500"
            }`}>Daily Check-in</p>
            <h2 className={`text-xl font-extrabold mb-1 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>How are you feeling right now?</h2>
            <p className={`text-xs mb-6 ${ darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Tap an emoji — takes 2 seconds 🙂
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "😊", label: "Happy" },
                { emoji: "😐", label: "Neutral" },
                { emoji: "😔", label: "Sad" },
                { emoji: "😰", label: "Anxious" },
                { emoji: "😣", label: "Stressed" },
                { emoji: "😠", label: "Angry" },
              ].map(({ emoji, label }) => (
                <button
                  key={label}
                  onClick={() => handleMoodCheckin(emoji, label)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition hover:scale-105 ${
                    darkMode
                      ? "bg-white/5 hover:bg-indigo-500/20 border border-white/10"
                      : "bg-indigo-50 hover:bg-indigo-100 border border-indigo-100"
                  }`}
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className={`text-xs font-semibold ${ darkMode ? "text-gray-300" : "text-gray-600"}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CALM CORNER BUTTON + POPUP — both mobile & desktop */}
      <div className="fixed bottom-16 sm:bottom-8 right-4 md:right-8 z-40">

        {/* POPUP — positioned above button */}
        {showCalmPopup && (() => {
          const { title, msg } = getCalmMessage();
          return (
            <div
              onMouseEnter={() => { if (popupTimerRef.current) clearTimeout(popupTimerRef.current); }}
              onMouseLeave={() => { popupTimerRef.current = setTimeout(() => setShowCalmPopup(false), 15000); }}
              className={`calm-popup absolute bottom-full right-0 mb-4 flex flex-col gap-3 rounded-3xl shadow-2xl border p-6 w-80 max-w-[calc(100vw-2rem)] ${
              darkMode ? "bg-gray-800 border-indigo-700/50" : "bg-white border-indigo-100"
            }`}>
              {/* AUTO DISMISS PROGRESS BAR */}
              <div className={`h-1 rounded-full overflow-hidden ${ darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="h-1 bg-indigo-400 rounded-full calm-progress" />
              </div>

              {/* HEADER */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FaHeart className="text-indigo-500 animate-pulse" size={16} />
                  </div>
                  <p className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {title}
                  </p>
                </div>
                <button
                  onClick={() => { setShowCalmPopup(false); if (popupTimerRef.current) clearTimeout(popupTimerRef.current); }}
                  style={{ backgroundColor: "transparent" }}
                  className={`text-lg leading-none flex-shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-lg transition ${
                    darkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* MESSAGE */}
              <p className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>{msg}</p>

              {/* FEATURE PILLS */}
              <div className="flex flex-wrap gap-2">
                {["🎧 Music", "🌬️ Breathing", "🎮 Games", "💜 Affirmations"].map((f) => (
                  <span key={f} className={`text-xs px-3 py-1 rounded-full font-medium ${
                    darkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-50 text-indigo-600"
                  }`}>{f}</span>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => { setCalmVisited(true); setShowCalmPopup(false); if (popupTimerRef.current) clearTimeout(popupTimerRef.current); navigate("/safe-space"); }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition hover:scale-105"
                >
                  Take me there →
                </button>
                <button
                  onClick={() => { setShowCalmPopup(false); if (popupTimerRef.current) clearTimeout(popupTimerRef.current); }}
                  style={{ backgroundColor: "transparent" }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                    darkMode ? "border-gray-600 text-gray-400 hover:bg-gray-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Later
                </button>
              </div>
            </div>
          );
        })()}

        {/* BUTTON */}
        <div
          key="calm-btn"
          onClick={() => { setCalmVisited(true); setShowCalmPopup(false); if (popupTimerRef.current) clearTimeout(popupTimerRef.current); navigate("/safe-space"); }}
          className="cursor-pointer calm-entrance"
        >
          <div className="relative overflow-hidden flex items-center gap-3 bg-indigo-600 text-white px-6 py-3.5 rounded-full calm-float shadow-xl">
            <div className="calm-shimmer" />
            <FaHeart className="text-white animate-pulse flex-shrink-0" size={18} />
            <span className="text-sm font-bold tracking-wide">Calm Corner</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes calmFloat {
          0%, 100% {
            transform: translateY(0px);
            box-shadow: 0 8px 28px rgba(79,70,229,0.45);
          }
          50% {
            transform: translateY(-7px);
            box-shadow: 0 18px 44px rgba(79,70,229,0.75);
          }
        }
        .calm-float {
          animation: calmFloat 3s ease-in-out infinite;
          transition: transform 0.2s ease;
        }
        .calm-float:hover {
          animation: none;
          transform: scale(1.07);
          box-shadow: 0 12px 36px rgba(79,70,229,0.65);
        }

        @keyframes shimmerMove {
          0% { transform: translateX(-100%) rotate(20deg); }
          100% { transform: translateX(300%) rotate(20deg); }
        }
        .calm-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: shimmerMove 2.5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes calmPopup {
          0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
          60% { transform: translateY(4px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .calm-popup {
          animation: calmPopup 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes calmEntrance {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .calm-entrance {
          animation: calmEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes calmProgressBar {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .calm-progress {
          animation: calmProgressBar 15s linear forwards;
        }

        @keyframes checkinMsgPop {
          0% { opacity: 0; transform: scale(0.85); }
          60% { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .checkin-msg-pop {
          animation: checkinMsgPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes emojiBounce {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          70% { transform: translateY(-3px); }
        }
        .checkin-emoji-bounce {
          animation: emojiBounce 0.8s ease forwards;
        }
        @keyframes checkinProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .checkin-progress {
          animation: checkinProgress 4s linear forwards;
        }
        @keyframes checkinMsgFadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); }
        }
        .checkin-msg-fadeout {
          animation: checkinMsgFadeOut 0.4s ease forwards;
        }
      `}</style>

    </div>
  );
}

export default Dashboard;
