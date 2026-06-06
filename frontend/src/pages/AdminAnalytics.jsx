import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from "chart.js";
import { AdminLayout, useAdminGuard, getAdminHeaders, PageHeader, Card } from "../Components/AdminLayout";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const emotionBarColor = (em) => {
  const e = (em || "").toLowerCase();
  if (["joy", "happiness"].includes(e)) return "#facc15";
  if (["sad", "sadness"].includes(e)) return "#60a5fa";
  if (e === "anxiety") return "#a78bfa";
  if (e === "stress") return "#fb923c";
  if (["anger", "angry"].includes(e)) return "#f87171";
  if (["normal", "neutral"].includes(e)) return "#34d399";
  return "#94a3b8";
};

const TOOLTIP = { backgroundColor: "#0d1424", titleColor: "#f8fafc", bodyColor: "#94a3b8", borderColor: "rgba(255,255,255,0.08)", borderWidth: 1, padding: 10 };
const GRID = { color: "rgba(255,255,255,0.04)" };
const TICKS = { color: "#475569", font: { size: 11 } };

export default function AdminAnalytics() {
  useAdminGuard();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/analytics`, { headers: getAdminHeaders() })
      .then(r => r.json()).then(setAnalytics).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const emotionLabels = (analytics?.emotionBreakdown || []).map(e => e._id || "unknown");

  const emotionBarData = {
    labels: emotionLabels.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    datasets: [{ label: "Entries", data: (analytics?.emotionBreakdown || []).map(e => e.count), backgroundColor: emotionLabels.map(emotionBarColor), borderRadius: 6, borderSkipped: false }],
  };

  const riskDoughnutData = {
    labels: ["Low Risk", "Moderate Risk", "High Risk"],
    datasets: [{ data: [analytics?.riskStats?.lowRisk || 0, analytics?.riskStats?.moderateRisk || 0, analytics?.riskStats?.highRisk || 0], backgroundColor: ["#10b981", "#f59e0b", "#ef4444"], borderWidth: 0, hoverOffset: 6 }],
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
  const dailyMap = {};
  (analytics?.dailyEntries || []).forEach(d => { dailyMap[d._id] = d.count; });

  const lineData = {
    labels: last7.map(d => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" })),
    datasets: [{ label: "Entries", data: last7.map(d => dailyMap[d] || 0), borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.1)", fill: true, tension: 0.4, pointBackgroundColor: "#6366f1", pointRadius: 4, pointHoverRadius: 6 }],
  };

  const baseOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: TOOLTIP }, scales: { x: { ticks: TICKS, grid: GRID }, y: { ticks: TICKS, grid: GRID } } };

  const pills = [
    { label: "Total Entries",    value: analytics?.totalJournals ?? 0,  color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300" },
    { label: "Total Users",      value: analytics?.totalUsers    ?? 0,  color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" },
    { label: "Avg Risk Score",   value: analytics?.riskStats?.avgRisk ? parseFloat(analytics.riskStats.avgRisk).toFixed(1) : "0", color: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
    { label: "High Risk Entries",value: analytics?.riskStats?.highRisk ?? 0, color: "border-red-500/30 bg-red-500/10 text-red-300" },
  ];

  return (
    <AdminLayout collapsed={collapsed} setCollapsed={setCollapsed}>
      <PageHeader title="Analytics" subtitle="Platform-wide emotional intelligence insights" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {pills.map((p, i) => (
              <div key={i} className={`border rounded-xl px-4 py-2 text-xs font-semibold ${p.color}`}>
                {p.label}: <span className="font-extrabold text-sm">{p.value}</span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
            <Card className="p-4 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">🎭 Emotion Distribution</p>
              <div className="h-48 sm:h-56">
                {emotionLabels.length > 0
                  ? <Bar data={emotionBarData} options={baseOpts} />
                  : <div className="h-full flex items-center justify-center text-slate-600 text-sm">No data yet</div>}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">⚠️ Risk Level Breakdown</p>
              <div className="h-48 sm:h-56">
                {(analytics?.totalJournals || 0) > 0
                  ? <Doughnut data={riskDoughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#64748b", padding: 16, font: { size: 11 } } }, tooltip: TOOLTIP } }} />
                  : <div className="h-full flex items-center justify-center text-slate-600 text-sm">No data yet</div>}
              </div>
            </Card>
          </div>

          <Card className="p-4 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">📈 Daily Entries — Last 7 Days</p>
            <div className="h-44 sm:h-52">
              <Line data={lineData} options={{ ...baseOpts, scales: { x: { ticks: TICKS, grid: GRID }, y: { ticks: { ...TICKS, stepSize: 1 }, grid: GRID } } }} />
            </div>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}