import { useEffect, useState } from "react";
import { FaEnvelope, FaEdit } from "react-icons/fa";
import AppNavbar from "../Components/AppNavbar";
import Settings from "./Setting";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", next);
    document.body.classList.toggle("dark", next);
    window.dispatchEvent(new Event("darkModeUpdate"));
  };

  const [user, setUser] = useState({
    name: "",
    email: "",
    joinedAt: ""
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const email = sessionStorage.getItem("currentUser");
      const name = sessionStorage.getItem("currentUserName");
      if (email || name) {
        setUser({
          name: name || "User",
          email: email || "",
        });
      }
    };

    loadUser();

    const email = sessionStorage.getItem("currentUser");
    if (email) {
      fetch(`${import.meta.env.VITE_API_URL}/user/${email}`)
        .then(res => res.json())
        .then(data => {
          if (data?.createdAt) {
            setUser(prev => ({
              ...prev,
              joinedAt: new Date(data.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            }));
          }
        })
        .catch(() => {});
    }

    window.addEventListener("profileUpdate", loadUser);
    return () => window.removeEventListener("profileUpdate", loadUser);
  }, []);

  const [stats, setStats] = useState({
    lastEmotion: "--",
    totalEntries: 0,
    streak: 0,
    recent: []
  });

  useEffect(() => {
    const update = () => {
      const email = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
      if (!email) return;

      const history = JSON.parse(localStorage.getItem(`moodHistory_${email}`)) || [];
      const streak = localStorage.getItem(`journalStreak_${email}`) || 0;

      setStats({
        lastEmotion: history.length ? history[history.length - 1].emotion : "--",
        totalEntries: history.length,
        streak: streak,
        recent: [...history].reverse().slice(0, 5)
      });
    };

    const email = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
    if (email) {
      fetch(`${import.meta.env.VITE_API_URL}/journal/history/${email}`)
        .then(r => r.json())
        .then(data => {
          const key = `moodHistory_${email}`;
          // Merge MongoDB + localStorage (keep both, deduplicate by date+emotion)
          const dbEntries = Array.isArray(data) ? data.map(e => ({
            id: e._id,
            score: Number(e.analysis?.score || e.score || 0),
            confidence: Number(((e.analysis?.confidence || e.confidence || 0) * 100).toFixed(1)),
            riskScore: Number((e.analysis?.riskScore || e.riskScore || 0).toFixed(2)),
            sentimentScore: Number((e.analysis?.sentiment_score || e.sentimentScore || 0).toFixed(3)),
            emotion: e.analysis?.emotion || e.emotion || "neutral",
            emoji: e.analysis?.emoji || e.emoji || "",
            predictedLabel: e.analysis?.predicted_label || e.predictedLabel || "Normal",
            journal: e.text || e.journal || "",
            day: new Date(e.createdAt).toLocaleDateString("en-US", { weekday: "short" }),
            createdAt: e.createdAt,
          })) : [];

          // Replace localStorage with MongoDB data (source of truth)
          const merged = dbEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          localStorage.setItem(key, JSON.stringify(merged));

          // Streak: count consecutive days going back from today OR yesterday
          const uniqueDays = [...new Set(merged.map(e => new Date(e.createdAt).toDateString()))]
            .sort((a, b) => new Date(b) - new Date(a));

          let s = 0;
          let checkDate = new Date(); checkDate.setHours(0,0,0,0);
          // Allow streak if last entry was yesterday
          const lastDay = uniqueDays[0] ? new Date(uniqueDays[0]) : null;
          if (lastDay) {
            const yesterday = new Date(checkDate); yesterday.setDate(yesterday.getDate() - 1);
            if (lastDay.toDateString() !== checkDate.toDateString() &&
                lastDay.toDateString() !== yesterday.toDateString()) {
              // streak broken
              s = 0;
            } else {
              if (lastDay.toDateString() === yesterday.toDateString()) {
                checkDate = yesterday;
              }
              for (const dayStr of uniqueDays) {
                const d = new Date(dayStr); d.setHours(0,0,0,0);
                if (d.getTime() === checkDate.getTime()) { s++; checkDate.setDate(checkDate.getDate() - 1); }
                else if (d.getTime() < checkDate.getTime()) break;
              }
            }
          }

          localStorage.setItem(`journalStreak_${email}`, s);
          window.dispatchEvent(new Event("storage"));
          update();
        })
        .catch(() => update());
    } else {
      update();
    }

    window.addEventListener("profileUpdate", update);
    return () => window.removeEventListener("profileUpdate", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, []);

  const getHistorySuggestions = (emotion) => {
    const mood = (emotion || "").toLowerCase();
    if (mood === "joy" || mood === "happiness") return [
      "Keep doing what is making you feel light and happy.",
      "Write one good thing about today in your journal.",
      "Share this positive moment with someone close."
    ];
    if (mood === "sad" || mood === "sadness") return [
      "Take a short walk or sit in fresh air for a few minutes.",
      "Listen to calm music and avoid isolating yourself too much.",
      "Talk to someone you trust, even briefly."
    ];
    if (mood === "anxiety") return [
      "Try a 4-4-4 breathing exercise for one minute.",
      "Focus only on the next small task, not everything at once.",
      "Drink water and step away from the screen for a moment."
    ];
    if (mood === "stress") return [
      "Take a short break and relax your shoulders and jaw.",
      "Break your work into one small manageable step.",
      "Avoid multitasking for the next few minutes."
    ];
    if (mood === "anger" || mood === "angry") return [
      "Pause before reacting and take a slow breath.",
      "Step away from the triggering situation for a moment.",
      "Write down what upset you before responding."
    ];
    return [
      "Keep tracking your mood daily for better emotional insights.",
      "Write a few more lines if you want a clearer analysis.",
      "Take a small pause and notice how your body feels right now."
    ];
  };

  const [animatedWidths, setAnimatedWidths] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const email = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
      const history = JSON.parse(localStorage.getItem(`moodHistory_${email}`)) || [];
      const now = new Date();
      const thisMonth = history.filter(e => {
        const d = new Date(e.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const emotionCount = {};
      thisMonth.forEach(e => {
        const em = (e.emotion || "neutral").toLowerCase();
        emotionCount[em] = (emotionCount[em] || 0) + 1;
      });
      const total = thisMonth.length;
      const widths = {};
      Object.entries(emotionCount).forEach(([emotion, count]) => {
        widths[emotion] = Math.round((count / total) * 100);
      });
      setAnimatedWidths(widths);
    }, 100);
    return () => clearTimeout(timer);
  }, [stats]);

  const pageBg = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100";

  return (
    <div className={`min-h-screen w-full ${pageBg}`}>

      <AppNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="pt-20 sm:pt-28 px-3 sm:px-6 lg:px-20 w-full pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10 w-full">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* PROFILE CARD */}
            <div className={`${ darkMode ? "bg-gray-800" : "bg-white/80" } backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-xl text-center w-full mx-auto`}>

              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-4 border-indigo-200 bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                {user.name?.charAt(0)}
              </div>

              <h2 className="mt-4 font-extrabold text-indigo-600 text-xl sm:text-2xl">
                {user.name}
              </h2>
              <p className={`text-sm font-medium flex justify-center gap-2 mt-1 break-all ${ darkMode ? "text-gray-300" : "text-gray-600" }`}>
                <FaEnvelope className="mt-1 shrink-0" /> {user.email}
              </p>
              <p className={`text-sm font-medium mt-3 ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>
                📅 Joined {user.joinedAt || "--"}
              </p>
              <p className={`text-sm font-medium mt-1 ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>
                🔥 {Number(stats.streak)} Day Streak
              </p>
              <button
                onClick={() => setSettingsOpen(true)}
                className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition shadow-md"
              >
                <FaEdit className="inline mr-2" />
                Edit Profile
              </button>
            </div>



          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-3 space-y-8">

            {/* MOOD SUMMARY + LAST JOURNAL */}
            {(() => {
              const email = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
              const history = JSON.parse(localStorage.getItem(`moodHistory_${email}`)) || [];
              const now = new Date();
              const thisMonth = history.filter(e => {
                const d = new Date(e.createdAt);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              });
              const emotionCount = {};
              thisMonth.forEach(e => {
                const em = (e.emotion || "neutral").toLowerCase();
                emotionCount[em] = (emotionCount[em] || 0) + 1;
              });
              const sortedEmotions = Object.entries(emotionCount).sort((a, b) => b[1] - a[1]);
              const total = thisMonth.length;
              const emotionColor = (em) => {
                if (["joy","happiness"].includes(em)) return "bg-yellow-400";
                if (["sad","sadness"].includes(em)) return "bg-blue-400";
                if (em === "anxiety") return "bg-purple-400";
                if (em === "stress") return "bg-orange-400";
                if (["anger","angry"].includes(em)) return "bg-red-400";
                return "bg-indigo-400";
              };
              const lastEntry = history[history.length - 1];
              const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                  {/* MOOD SUMMARY */}
                  <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${ darkMode ? "bg-gray-800" : "bg-white/80" } backdrop-blur-xl`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-semibold text-sm sm:text-base ${ darkMode ? "text-white" : "text-gray-800" }`}>📊 Mood Summary</h3>
                      <span className="text-xs text-gray-400">{monthName}</span>
                    </div>
                    {total === 0 ? (
                      <p className="text-sm text-gray-400">No entries this month yet ✍️</p>
                    ) : (
                      <div className="space-y-3">
                        {sortedEmotions.map(([emotion, count]) => (
                          <div key={emotion}>
                            <div className="flex justify-between mb-1">
                              <span className={`text-xs capitalize font-medium ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>{emotion}</span>
                              <span className={`text-xs ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>{count}x</span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${ darkMode ? "bg-gray-700" : "bg-gray-100" }`}>
                              <div className={`h-2 rounded-full ${emotionColor(emotion)} transition-all duration-700 ease-out`} style={{ width: `${animatedWidths[emotion] || 0}%` }} />
                            </div>
                          </div>
                        ))}
                        <p className={`text-xs mt-1 ${ darkMode ? "text-gray-500" : "text-gray-400" }`}>{total} {total === 1 ? "entry" : "entries"} this month</p>
                      </div>
                    )}
                  </div>

                  {/* LAST JOURNAL */}
                  <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${ darkMode ? "bg-gray-800" : "bg-white/80" } backdrop-blur-xl`}>
                    <h3 className={`font-semibold text-sm sm:text-base mb-4 ${ darkMode ? "text-white" : "text-gray-800" }`}>🗒️ Last Journal</h3>
                    {!lastEntry ? (
                      <p className="text-sm text-gray-400">No entries yet. Write your first one! ✍️</p>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>
                            {new Date(lastEntry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                            ["joy","happiness"].includes((lastEntry.emotion||"").toLowerCase()) ? "bg-yellow-100 text-yellow-700" :
                            ["sad","sadness"].includes((lastEntry.emotion||"").toLowerCase()) ? "bg-blue-100 text-blue-700" :
                            (lastEntry.emotion||"").toLowerCase() === "anxiety" ? "bg-purple-100 text-purple-700" :
                            (lastEntry.emotion||"").toLowerCase() === "stress" ? "bg-orange-100 text-orange-700" :
                            ["anger","angry"].includes((lastEntry.emotion||"").toLowerCase()) ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>{lastEntry.emotion} {lastEntry.emoji}</span>
                        </div>
                        {lastEntry.journal && (
                          <p className={`text-sm leading-relaxed line-clamp-3 mb-3 ${ darkMode ? "text-gray-300" : "text-gray-600" }`}>
                            "{lastEntry.journal}"
                          </p>
                        )}
                        <div className="flex gap-2">
                          {[
                            { label: "Score", value: `${lastEntry.score}/10` },
                            { label: "Confidence", value: `${lastEntry.confidence}%` },
                            { label: "Risk", value: lastEntry.riskScore },
                          ].map((item, i) => (
                            <div key={i} className={`text-center p-2 rounded-xl flex-1 ${ darkMode ? "bg-gray-700" : "bg-gray-50" }`}>
                              <p className={`text-xs ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>{item.label}</p>
                              <p className="font-bold text-indigo-500">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* RECENT JOURNAL ENTRIES */}
            <div className={`${ darkMode ? "bg-gray-800/80" : "bg-white/80" } backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`font-semibold text-lg ${ darkMode ? "text-white" : "" }`}>
                  📔 Recent Journal Entries
                </h3>
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="text-sm text-indigo-500 hover:text-indigo-700 hover:underline transition"
                >
                  View All →
                </button>
              </div>
              {stats.recent.length === 0 ? (
                <p className="text-sm text-gray-500">No journal entries yet ✍️</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {stats.recent.map((item) => (
                    <li
                      key={item.id || item.createdAt}
                      className={`p-3 rounded-lg flex flex-wrap justify-between items-center gap-2 ${ darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-50" }`}
                    >
                      <span className={`text-xs sm:text-sm ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>
                        {new Date(item.createdAt).toDateString()}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                        ["joy","happiness"].includes((item.emotion||"").toLowerCase()) ? "bg-yellow-100 text-yellow-700" :
                        ["sad","sadness"].includes((item.emotion||"").toLowerCase()) ? "bg-blue-100 text-blue-700" :
                        (item.emotion||"").toLowerCase() === "anxiety" ? "bg-purple-100 text-purple-700" :
                        (item.emotion||"").toLowerCase() === "stress" ? "bg-orange-100 text-orange-700" :
                        ["anger","angry"].includes((item.emotion||"").toLowerCase()) ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {item.emotion} {item.emoji}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* HISTORY MODAL */}
      {historyOpen && (() => {
        const email = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
        const all = JSON.parse(localStorage.getItem(`moodHistory_${email}`)) || [];
        const sorted = [...all].reverse();
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8"
            onClick={() => setHistoryOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className={`relative z-10 w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${ darkMode ? "bg-gray-800 text-white" : "bg-white" }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center px-6 py-4 border-b flex-shrink-0 ${ darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-100" }`}>
                <h3 className="text-lg font-bold text-indigo-600">📔 All Journal Entries</h3>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="text-gray-400 hover:bg-red-100 hover:text-red-600 w-8 h-8 flex items-center justify-center rounded-lg transition text-xl"
                >✕</button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                {sorted.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No journal entries yet ✍️</p>
                ) : (
                  <ul className="space-y-3">
                    {sorted.map((item, i) => (
                      <li key={item.id || item.createdAt || i} className={`p-4 rounded-xl ${ darkMode ? "bg-gray-700" : "bg-gray-50" }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              {" "}
                              {new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className={`text-sm font-semibold mt-1 capitalize ${ darkMode ? "text-white" : "text-gray-800" }`}>
                              {item.emotion} {item.emoji}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Score</p>
                            <p className="font-bold text-indigo-500">{item.score}/10</p>
                          </div>
                        </div>
                        <div className="flex gap-3 flex-wrap mb-2">
                          {item.predictedLabel && (
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">{item.predictedLabel}</span>
                          )}
                          {item.riskScore !== undefined && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">Risk: {item.riskScore}</span>
                          )}
                          {item.confidence !== undefined && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">Confidence: {item.confidence}%</span>
                          )}
                        </div>
                        {item.journal && (
                          <p className={`text-xs mt-1 line-clamp-2 ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>
                            "{item.journal}"
                          </p>
                        )}
                        <div className="mt-3 space-y-1">
                          <p className="text-xs font-semibold text-indigo-500">💡 Suggestions</p>
                          {getHistorySuggestions(item.emotion).map((s, si) => (
                            <p key={si} className={`text-xs ${ darkMode ? "text-gray-400" : "text-gray-500" }`}>• {s}</p>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* SETTINGS MODAL */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8"
          onClick={() => setSettingsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Settings onClose={() => setSettingsOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
