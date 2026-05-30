import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EMOTION_SCORE_MAP } from "../utils/moodUtils";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import { fetchJournalHistory } from "../services/api";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

const labelConfig = {
  Suicidal:   { bg: "bg-red-100",    text: "text-red-700",    border: "border-l-red-500",    dot: "🔴" },
  Depression: { bg: "bg-orange-100", text: "text-orange-700", border: "border-l-orange-500", dot: "🟠" },
  Anxiety:    { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-l-yellow-500", dot: "🟡" },
  Stress:     { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-l-blue-500",   dot: "🔵" },
  Normal:     { bg: "bg-green-100",  text: "text-green-700",  border: "border-l-green-500",  dot: "🟢" },
};

const emotionTheme = {
  happiness: ["#facc15", "#fde68a", "#f59e0b", "#fef3c7"],
  joy:       ["#facc15", "#fde68a", "#f59e0b", "#fef3c7"],
  sadness:   ["#60a5fa", "#93c5fd", "#2563eb", "#dbeafe"],
  sad:       ["#60a5fa", "#93c5fd", "#2563eb", "#dbeafe"],
  anger:     ["#f87171", "#fca5a5", "#ef4444", "#fee2e2"],
  angry:     ["#f87171", "#fca5a5", "#ef4444", "#fee2e2"],
  anxiety:   ["#a78bfa", "#c4b5fd", "#8b5cf6", "#ede9fe"],
  stress:    ["#fb923c", "#fdba74", "#f97316", "#ffedd5"],
  neutral:   ["#94a3b8", "#cbd5e1", "#64748b", "#f1f5f9"],
};

const EMOJI_MAP = { happiness:"😊",joy:"😊",sadness:"😢",sad:"😢",anger:"😠",angry:"😠",anxiety:"😟",stress:"😣",neutral:"😐" };

const explanationMap = {
  joy:       "Your text reflects strong positivity and emotional clarity.",
  happiness: "Your words suggest a positive and emotionally balanced state.",
  sad:       "Your text indicates low mood and emotional heaviness.",
  sadness:   "Your words suggest emotional heaviness or distress.",
  angry:     "Your language shows frustration and emotional intensity.",
  anger:     "Your language reflects frustration or tension.",
  anxiety:   "Your text suggests worry, nervousness, or emotional restlessness.",
  stress:    "Your text suggests pressure, overload, or tension.",
  neutral:   "Your tone appears stable with balanced emotional signals.",
};

function DetailedAnalysis() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [trendHistory, setTrendHistory] = useState([]);
  const [trendLoading, setTrendLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const root = document.getElementById("root");
    if (root) root.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const userId = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser") || "user1";

  useEffect(() => {
    if (!userId) return;
    const load = () => fetchJournalHistory(userId).then((data) => {
      if (data && data.length) setTrendHistory(data);
      setTrendLoading(false);
    }).catch(() => setTrendLoading(false));
    // Small delay so the backend has time to finish saving before we fetch
    const timer = setTimeout(load, 500);
    window.addEventListener("focus", load);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", load);
    };
  }, [userId]);

  if (!state) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">No analysis data found.</p>
          <button onClick={() => navigate("/dashboard")} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { result, journal } = state;

  const score = EMOTION_SCORE_MAP[(result?.emotion || "neutral").toLowerCase()] ?? 5;
  const riskScore = Number(result?.riskScore || 0);
  const confidencePercent = Math.round(Number(result?.confidence || 0) * 100);
  const predictedLabel = result?.predicted_label || "Normal";
  const sentimentScore = Number(result?.sentiment_score || 0);
  const cognitiveDistortions = result?.cognitive_distortions || [];
  const behavioralSignals = result?.behavioral_signals || [];

  const emotionKey = (result?.emotion || "neutral").toLowerCase();
  const theme = emotionTheme[emotionKey] || emotionTheme.neutral;
  const labelCfg = labelConfig[predictedLabel] || labelConfig.Normal;

  const riskLabel = ["Depression", "Suicidal"].includes(predictedLabel)
    ? "Risk Score"
    : ["Anxiety", "Stress"].includes(predictedLabel)
    ? "Stress Index"
    : "Wellness Index";
  const riskDisplayValue = riskLabel === "Wellness Index" ? (100 - riskScore).toFixed(1) : riskScore.toFixed(1);
  const riskDisplayColor = riskLabel === "Wellness Index"
    ? "text-green-500"
    : riskScore >= 70 ? "text-red-500" : riskScore >= 40 ? "text-yellow-500" : "text-green-500";
  const riskDisplayStatus = riskLabel === "Wellness Index"
    ? (100 - riskScore) >= 70 ? "Healthy" : (100 - riskScore) >= 40 ? "Moderate" : "Low"
    : riskScore >= 70 ? "High" : riskScore >= 40 ? "Moderate" : "Low";

  const explanation = explanationMap[emotionKey] || "Your emotional tone was analyzed using sentiment and trained model prediction.";

  const stopwords = new Set(["i","am","is","are","was","were","the","a","an","and","or","but","in","on","at","to","for","of","with","my","me","it","its","this","that","so","do","did","be","been","have","has","had","not","no","just","very","really","feel","feeling","felt","like","get","got","can","will","would","could","should","about","from","up","out","if","then","than","too","also","he","she","we","they","you","your","our","their"]);
  const keywords = journal
    ? journal.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w)).slice(0, 6)
    : [result?.emotion || "neutral"];

  const showTrend = trendHistory.length >= 3;

  const trendLabels = trendHistory.map((entry) => {
    const d = new Date(entry.createdAt);
    return [
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    ];
  });

  const trendScores = trendHistory.map((i) => {
    const emo = (i.analysis?.emotion || "neutral").toLowerCase();
    return EMOTION_SCORE_MAP[emo] ?? 5;
  });

  const avg = trendScores.length ? trendScores.reduce((a, b) => a + b, 0) / trendScores.length : score;

  let insight = "";
  if (avg >= 7) insight = "You had a consistently positive emotional pattern.";
  else if (avg >= 4) insight = "Your emotional pattern looks balanced with some variation.";
  else insight = "Your recent entries suggest emotional lows. Take care.";

  let recommendations = [];
  if (predictedLabel === "Suicidal") recommendations = [
    "Please reach out to a trusted person or mental health professional immediately.",
    "Call iCall: 9152987821 or Vandrevala Foundation: 1860-2662-345 (available 24/7).",
    "You are not alone — take it one moment at a time and ask for support.",
  ];
  else if (predictedLabel === "Depression") recommendations = [
    "Establish small daily routines — even a short walk or drinking water counts.",
    "Talk to someone you trust or consider speaking with a counselor.",
    "Be gentle with yourself. Rest is productive when you are struggling.",
  ];
  else if (predictedLabel === "Anxiety") recommendations = [
    "Try a 4-4-4 breathing exercise: inhale 4s, hold 4s, exhale 4s.",
    "Write down your worries to get them out of your head and onto paper.",
    "Limit screen time and take short breaks away from stressors.",
  ];
  else if (predictedLabel === "Stress") recommendations = [
    "Break your tasks into smaller steps and focus on just one at a time.",
    "Take a 10-minute break every hour — step outside or stretch.",
    "Talk to someone about what is overwhelming you today.",
  ];
  else if (score >= 7) recommendations = [
    "Keep up your current positive habits and routines.",
    "This is a great time to set a new goal or help someone around you.",
    "Write down what is working well so you can revisit it on harder days.",
  ];
  else recommendations = [
    "Try a relaxing activity like music, a short walk, or journaling.",
    "Stay hydrated, rest well, and avoid overloading yourself today.",
    "Reach out to a friend or someone you trust for a conversation.",
  ];

  const trendLineData = {
    labels: trendLabels,
    datasets: [{
      label: "Mental Score",
      data: trendScores,
      borderColor: theme[2],
      backgroundColor: `${theme[1]}55`,
      tension: 0.35,
      fill: true,
      pointRadius: 4,
    }],
  };

  const trendLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 28, right: 8, bottom: 0, left: 0 } },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
        align: "top",
        offset: 6,
        font: { size: 13 },
        formatter: (_, ctx) => {
          const entry = trendHistory[ctx.dataIndex];
          const emo = (entry?.analysis?.emotion || "neutral").toLowerCase();
          return EMOJI_MAP[emo] || "😐";
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const entry = trendHistory[ctx.dataIndex];
            const emo = entry?.analysis?.emotion || "neutral";
            return `Score: ${ctx.raw}  ·  ${emo.charAt(0).toUpperCase() + emo.slice(1)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "#cbd5e1" : "#475569", maxRotation: 0, minRotation: 0, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        min: 0, max: 10,
        ticks: { stepSize: 2, color: darkMode ? "#cbd5e1" : "#475569", font: { size: 10 } },
        grid: { color: darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" },
      },
    },
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.width;
    const ph = doc.internal.pageSize.height;
    const margin = 20;
    const contentW = pw - margin * 2;
    let y = 0;

    const userName = sessionStorage.getItem("currentUserName") || localStorage.getItem(`name_${userId}`) || "User";
    const reportDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const reportTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    const checkPage = (needed = 10) => {
      if (y + needed > ph - 18) { doc.addPage(); y = 20; }
    };

    const labelColors = {
      Suicidal:   [220, 38, 38],
      Depression: [234, 88, 12],
      Anxiety:    [202, 138, 4],
      Stress:     [37, 99, 235],
      Normal:     [22, 163, 74],
    };
    const accentRGB = labelColors[predictedLabel] || [99, 102, 241];

    // ── HEADER BAND ──
    doc.setFillColor(...accentRGB);
    doc.rect(0, 0, pw, 42, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Mannlytics", margin, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Mental Health Analysis Report", margin, 25);
    doc.text(`${reportDate} · ${reportTime}`, pw - margin, 25, { align: "right" });
    doc.text(`Prepared for: ${userName}`, pw - margin, 33, { align: "right" });
    doc.text(`Confidence: ${confidencePercent}%`, margin, 33);
    y = 52;

    // ── SECTION HELPER ──
    const sectionTitle = (title) => {
      checkPage(14);
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");
      doc.setDrawColor(...accentRGB);
      doc.setLineWidth(0.6);
      doc.line(margin, y, margin, y + 10);
      doc.setTextColor(...accentRGB);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 4, y + 7);
      y += 14;
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
    };

    const labelText = (label, value, bold = false) => {
      checkPage(8);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(110, 110, 120);
      doc.text(label, margin, y);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(value), margin + 55, y);
      y += 7;
    };

    const scoreBar = (label, value, max, colorRGB) => {
      checkPage(14);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(label, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${value}/${max}`, pw - margin, y, { align: "right" });
      y += 4;
      doc.setFillColor(220, 220, 230);
      doc.roundedRect(margin, y, contentW, 4, 1, 1, "F");
      doc.setFillColor(...colorRGB);
      doc.roundedRect(margin, y, Math.max((value / max) * contentW, 2), 4, 1, 1, "F");
      y += 9;
    };

    const wrappedText = (text, indent = 0, color = [50, 50, 50]) => {
      const lines = doc.splitTextToSize(text, contentW - indent);
      lines.forEach((line) => {
        checkPage(7);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...color);
        doc.text(line, margin + indent, y);
        y += 6;
      });
      y += 2;
    };

    // ── SECTION 1: ANALYSIS SUMMARY ──
    sectionTitle("Analysis Summary");
    labelText("Emotion:", `${(result?.emotion || "neutral").charAt(0).toUpperCase() + (result?.emotion || "neutral").slice(1)}`, true);
    labelText("Predicted Label:", predictedLabel, true);
    labelText("Sentiment:", sentimentScore >= 0.3 ? "Strongly Positive" : sentimentScore >= 0 ? "Mildly Positive" : sentimentScore >= -0.3 ? "Mildly Negative" : "Strongly Negative");
    labelText(`${riskLabel}:`, `${riskDisplayValue} — ${riskDisplayStatus}`);
    y += 2;

    // ── SECTION 2: AI INSIGHT ──
    sectionTitle("AI Insight");
    wrappedText(explanation);
    if (keywords.length) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(110, 110, 120);
      doc.text("Keywords detected:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...accentRGB);
      doc.text(keywords.join("  ·  "), margin, y);
      y += 8;
    }

    // ── SECTION 3: SCORES ──
    sectionTitle("Scores");
    scoreBar("Mental Wellness Score", score, 10, score >= 7 ? [34, 197, 94] : score >= 4 ? [99, 102, 241] : [239, 68, 68]);
    const pdfRiskValue = riskLabel === "Wellness Index" ? Math.min(100 - riskScore, 100) : Math.min(riskScore, 100);
    const pdfRiskColor = riskLabel === "Wellness Index" ? [34, 197, 94] : riskScore >= 70 ? [239, 68, 68] : riskScore >= 40 ? [234, 179, 8] : [34, 197, 94];
    scoreBar(riskLabel, pdfRiskValue, 100, pdfRiskColor);
    scoreBar("Sentiment Polarity", Math.round(Math.abs(sentimentScore) * 100), 100, sentimentScore >= 0 ? [34, 197, 94] : [239, 68, 68]);
    scoreBar("Confidence", confidencePercent, 100, [...accentRGB]);
    y += 2;

    // ── SECTION 4: JOURNAL ENTRY ──
    sectionTitle("Journal Entry");
    wrappedText(journal || "No journal entry provided.");

    // ── SECTION 5: RECOMMENDATIONS ──
    sectionTitle("Recommendations");
    recommendations.forEach((r, i) => {
      checkPage(12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentRGB);
      doc.text(`${i + 1}.`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(r, contentW - 8);
      lines.forEach((line) => {
        checkPage(7);
        doc.text(line, margin + 8, y);
        y += 6;
      });
      y += 3;
    });

    // ── SECTION 6: ADDITIONAL SIGNALS (only if present) ──
    if (cognitiveDistortions.length || behavioralSignals.length) {
      sectionTitle("Additional Signals");
      if (cognitiveDistortions.length) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(110, 110, 120);
        doc.text("Cognitive Distortions:", margin, y);
        y += 5;
        wrappedText(cognitiveDistortions.join(", "), 0, [80, 80, 80]);
      }
      if (behavioralSignals.length) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(110, 110, 120);
        doc.text("Behavioral Signals:", margin, y);
        y += 5;
        wrappedText(behavioralSignals.join(", "), 0, [80, 80, 80]);
      }
    }

    // ── CRISIS BOX (only if high risk or Suicidal) ──
    if (riskScore >= 70 || predictedLabel === "Suicidal") {
      checkPage(28);
      doc.setFillColor(254, 226, 226);
      doc.roundedRect(margin, y, contentW, 24, 3, 3, "F");
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y, contentW, 24, 3, 3, "S");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(185, 28, 28);
      doc.text("You are not alone. Immediate support is available:", margin + 4, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("iCall: 9152987821", margin + 4, y + 15);
      doc.text("Vandrevala Foundation: 1860-2662-345 (24/7)", margin + 4, y + 21);
      y += 30;
    }

    // ── DISCLAIMER ──
    checkPage(16);
    y += 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentW, 14, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(140, 140, 150);
    doc.text("This report is auto-generated by Mannlytics based on your journal entry.", margin + 3, y + 5);
    doc.text("It is not a substitute for professional medical advice, diagnosis, or treatment.", margin + 3, y + 10);
    y += 18;

    // ── FOOTER on every page ──
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFillColor(245, 247, 255);
      doc.rect(0, ph - 12, pw, 12, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 160);
      doc.text("Mannlytics · For personal use only", margin, ph - 4);
      doc.text(`Page ${p} of ${totalPages}`, pw - margin, ph - 4, { align: "right" });
    }

    doc.save(`Mannlytics_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const card = darkMode ? "bg-gray-800" : "bg-white/80";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const heading = darkMode ? "text-white" : "text-gray-800";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 via-white to-indigo-100"}`}>
      <div className="pt-8 px-4 md:px-8 lg:px-16 pb-12">

        {/* PAGE HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-extrabold ${heading}`}>
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Detailed Analysis</span>{" "}🧠
            </h1>
            <p className={`text-sm md:text-base lg:text-lg mt-2 ${muted}`}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              {" · "}
              <span className="font-medium">Confidence: {confidencePercent}%</span>
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => navigate("/dashboard", { replace: true, state: { restoreResult: result, restoreJournal: journal } })}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition ${
                darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white border border-indigo-200 text-slate-700 hover:bg-indigo-50"
              }`}
            >
              <FaArrowLeft size={12} /> <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={downloadPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-md hover:scale-105 transition"
            >
              <FaDownload size={12} /> <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* CRISIS BANNER */}
        {predictedLabel === "Suicidal" && (
          <div className="rounded-2xl bg-red-600 text-white p-4 flex items-center gap-4 shadow-lg mb-6">
            <span className="text-3xl">🆘</span>
            <div>
              <p className="font-bold text-sm">You are not alone. Immediate help is available.</p>
              <p className="text-xs opacity-90 mt-1">iCall: 9152987821 &nbsp;&bull;&nbsp; Vandrevala Foundation: 1860-2662-345 (24/7)</p>
            </div>
          </div>
        )}

        {/* MAIN GRID — dashboard style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT — entry, metrics, charts */}
          <div className="lg:col-span-7 space-y-5">

            {/* ENTRY + AI INSIGHT SIDE BY SIDE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`${card} backdrop-blur-xl p-5 rounded-2xl shadow-md border-l-4`} style={{ borderLeftColor: theme[2] }}>
                <h3 className={`text-base font-extrabold mb-3 ${heading}`}>📝 Your Entry</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{journal || "No journal entry."}</p>
              </div>
              <div className={`${card} backdrop-blur-xl p-5 rounded-2xl shadow-md`}>
                <h3 className={`text-base font-extrabold mb-3 ${heading}`}>🧠 AI Insight</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{explanation}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywords.map((k, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full font-medium">{k}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* METRIC CARDS — 4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-4 rounded-2xl ${card} backdrop-blur-xl shadow`}>
                <p className={`text-xs ${muted}`}>Emotion</p>
                <p className={`text-base font-bold capitalize mt-1 ${heading}`}>{result?.emotion} {EMOJI_MAP[emotionKey] || "😐"}</p>
              </div>
              <div className={`p-4 rounded-2xl ${card} backdrop-blur-xl shadow`}>
                <p className={`text-xs ${muted}`}>Predicted Label</p>
                <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full ${labelCfg.bg} ${labelCfg.text}`}>
                  {labelCfg.dot} {predictedLabel}
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${card} backdrop-blur-xl shadow`}>
                <p className={`text-xs ${muted}`}>Mental Score</p>
                <p className={`text-base font-bold mt-1 ${heading}`}>{score}/10</p>
                <div className={`mt-2 h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div className="h-1.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${score * 10}%` }} />
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${card} backdrop-blur-xl shadow`}>
                <p className={`text-xs ${muted}`}>{riskLabel}</p>
                <p className={`text-base font-bold mt-1 ${riskDisplayColor}`}>{riskDisplayValue}</p>
                <p className={`text-xs mt-1 ${muted}`}>{riskDisplayStatus}</p>
              </div>
            </div>

            {/* MOOD TREND */}
            <div className={`p-6 rounded-2xl ${card} backdrop-blur-xl shadow-md`}>
              <h3 className={`font-extrabold text-base mb-3 ${heading}`}>Mood Trend</h3>
              {trendLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className={`text-sm ${muted} animate-pulse`}>Loading trend...</p>
                </div>
              ) : showTrend ? (
                <>
                  <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}
                    ref={(el) => { if (el) setTimeout(() => { el.scrollLeft = el.scrollWidth; }, 50); }}
                  >
                    <div style={{ minWidth: `${Math.max(trendHistory.length * 80, 320)}px`, height: "240px" }}>
                      <Line key={trendScores.join(",")} data={trendLineData} options={trendLineOptions} plugins={[ChartDataLabels]} />
                    </div>
                  </div>
                  <p className={`text-xs mt-1 text-center ${muted}`}>← swipe to explore →</p>
                  <p className={`text-sm mt-2 ${muted}`}>{insight}</p>
                </>
              ) : (
                <div className={`rounded-2xl border border-dashed p-6 text-center ${darkMode ? "border-slate-700" : "border-slate-300"}`}>
                  <p className={`text-sm ${muted}`}>Trend chart appears after at least 3 analysis entries.</p>
                </div>
              )}
            </div>

            {/* BOTTOM ACTION */}
            <div className="flex justify-start pt-1">
              <button
                onClick={() => navigate("/dashboard", { state: { highlightJournal: true } })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-xl hover:scale-105 transition"
              >
                🧠 Start New Analysis
              </button>
            </div>
          </div>

          {/* RIGHT — highlights, distortions, signals, recommendation */}
          <div className="lg:col-span-5 space-y-5">

            {/* MOOD HIGHLIGHTS */}
            <div className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md`}>
              <h3 className={`text-base font-extrabold mb-5 ${heading}`}>📊 Mood Highlights</h3>

              {/* RING SCORE */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={score >= 7 ? "#22c55e" : score >= 4 ? "#6366f1" : "#ef4444"}
                      strokeWidth="3"
                      strokeDasharray={`${(score / 10) * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-extrabold ${heading}`}>{score}<span className={`text-sm font-medium ${muted}`}>/10</span></span>
                    <span className="text-xl mt-0.5">{EMOJI_MAP[emotionKey] || "😐"}</span>
                  </div>
                </div>
              </div>

              {/* PROGRESS BARS */}
              <div className="space-y-4">
                {/* Confidence */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={muted}>Confidence</span>
                    <span className="font-bold text-cyan-500">{confidencePercent}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div className="h-2 rounded-full bg-cyan-500 transition-all" style={{ width: `${confidencePercent}%` }} />
                  </div>
                </div>

                {/* Sentiment */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={muted}>Sentiment</span>
                    <span className={`font-bold ${sentimentScore >= 0 ? "text-green-500" : "text-red-400"}`}>
                      {sentimentScore >= 0.3 ? "Strongly Positive" : sentimentScore >= 0 ? "Mildly Positive" : sentimentScore >= -0.3 ? "Mildly Negative" : "Strongly Negative"}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(Math.abs(sentimentScore) * 100, 100)}%`,
                        background: sentimentScore >= 0 ? "#22c55e" : "#ef4444",
                      }}
                    />
                  </div>
                </div>

                {/* Wellness / Risk / Stress */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={muted}>{riskLabel}</span>
                    <span className={`font-bold ${riskDisplayColor}`}>{riskDisplayValue} — {riskDisplayStatus}</span>
                  </div>
                  <div className={`h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(parseFloat(riskDisplayValue), 100)}%`,
                        background: riskDisplayColor.includes("green") ? "#22c55e" : riskDisplayColor.includes("yellow") ? "#eab308" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COGNITIVE DISTORTIONS & BEHAVIORAL SIGNALS */}
            {(cognitiveDistortions.length > 0 || behavioralSignals.length > 0) && (
              <div className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md`}>
                <h3 className={`text-base font-extrabold mb-4 ${heading}`}>🔍 Additional Signals</h3>
                {cognitiveDistortions.length > 0 && (
                  <div className="mb-3">
                    <p className={`text-xs font-semibold mb-2 ${muted}`}>Cognitive Distortions</p>
                    <div className="flex flex-wrap gap-2">
                      {cognitiveDistortions.map((d, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
                {behavioralSignals.length > 0 && (
                  <div>
                    <p className={`text-xs font-semibold mb-2 ${muted}`}>Behavioral Signals</p>
                    <div className="flex flex-wrap gap-2">
                      {behavioralSignals.map((s, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RECOMMENDATION */}
            <div className={`${card} backdrop-blur-xl p-6 rounded-2xl shadow-md border-l-4 ${labelCfg.border}`}>
              <h3 className={`text-base font-extrabold mb-4 ${heading}`}>🚀 Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      predictedLabel === "Suicidal" ? "bg-red-500" : predictedLabel === "Depression" ? "bg-orange-500" : predictedLabel === "Anxiety" ? "bg-yellow-500" : predictedLabel === "Stress" ? "bg-blue-500" : "bg-green-500"
                    }`}>{i + 1}</span>
                    <p className={`text-sm leading-relaxed ${muted}`}>{r}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedAnalysis;
