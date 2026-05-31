import { useEffect, useState } from "react";
import { AdminLayout, useAdminGuard, getAdminHeaders, PageHeader, StatCard, Card, emotionColor } from "../Components/AdminLayout";

export default function AdminDashboard() {
  useAdminGuard();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentJournals, setRecentJournals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, jRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/analytics`, { headers: getAdminHeaders() }),
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/journals`,  { headers: getAdminHeaders() }),
        ]);
        setAnalytics(await aRes.json());
        const j = await jRes.json();
        setRecentJournals(Array.isArray(j) ? j.slice(0, 8) : []);
      } catch { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const topEmotion = analytics?.emotionBreakdown?.[0]?._id || "—";

  const statCards = [
    { label: "Total Users",    value: analytics?.totalUsers   ?? "—", emoji: "👥", color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Total Entries",  value: analytics?.totalJournals ?? "—", emoji: "📝", color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
    { label: "Avg Risk Score", value: analytics?.riskStats?.avgRisk ? parseFloat(analytics.riskStats.avgRisk).toFixed(1) : "—", emoji: "⚠️", color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Top Emotion",    value: topEmotion, emoji: "🧠", color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <AdminLayout collapsed={collapsed} setCollapsed={setCollapsed}>
      <PageHeader title="Overview" subtitle="Platform-wide mental health data summary" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((c, i) => <StatCard key={i} {...c} />)}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Emotion Breakdown */}
            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">🎭 Emotion Breakdown</p>
              {!analytics?.emotionBreakdown?.length ? (
                <p className="text-slate-600 text-sm">No data yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.emotionBreakdown.map(({ _id: emotion, count }) => {
                    const pct = Math.round((count / (analytics.totalJournals || 1)) * 100);
                    return (
                      <div key={emotion}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="capitalize text-slate-300 font-medium">{emotion || "unknown"}</span>
                          <span className="text-slate-500">{count}x · {pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">🕐 Recent Activity</p>
              {!recentJournals.length ? (
                <p className="text-slate-600 text-sm">No entries yet.</p>
              ) : (
                <ul className="space-y-2">
                  {recentJournals.map((entry, i) => (
                    <li key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] px-3 py-2.5 rounded-xl">
                      <div>
                        <p className="text-slate-300 text-xs font-medium truncate max-w-[160px]">{entry.userId}</p>
                        <p className="text-slate-600 text-xs mt-0.5">
                          {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-semibold ${emotionColor(entry.analysis?.emotion)}`}>
                        {entry.analysis?.emotion || "unknown"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Risk Distribution */}
            <Card className="p-6 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">⚠️ Risk Distribution</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Low Risk",      value: analytics?.riskStats?.lowRisk      ?? 0, color: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
                  { label: "Moderate Risk", value: analytics?.riskStats?.moderateRisk ?? 0, color: "text-amber-400",   bg: "bg-amber-500/10",   bar: "bg-amber-500"   },
                  { label: "High Risk",     value: analytics?.riskStats?.highRisk     ?? 0, color: "text-red-400",     bg: "bg-red-500/10",     bar: "bg-red-500"     },
                ].map((item, i) => {
                  const total = (analytics?.riskStats?.lowRisk ?? 0) + (analytics?.riskStats?.moderateRisk ?? 0) + (analytics?.riskStats?.highRisk ?? 0);
                  const pct = total ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={i} className={`${item.bg} border border-white/[0.07] rounded-2xl p-5`}>
                      <p className="text-slate-500 text-xs font-medium mb-2">{item.label}</p>
                      <p className={`text-3xl font-extrabold ${item.color}`}>{item.value}</p>
                      <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-1.5 rounded-full ${item.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-slate-600 text-xs mt-1.5">{pct}% of total</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
}