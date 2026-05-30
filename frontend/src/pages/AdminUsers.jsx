import { useEffect, useState } from "react";
import { FaSearch, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { AdminLayout, useAdminGuard, getAdminHeaders, PageHeader, Card, emotionColor } from "../Components/AdminLayout";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-[#0d1424] border border-white/[0.1] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="text-white text-sm font-medium mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition">Yes, Delete</button>
          <button onClick={onCancel} className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-bold py-2.5 rounded-xl transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  useAdminGuard();
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [journalsByUser, setJournalsByUser] = useState({});
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, jRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users",   { headers: getAdminHeaders() }),
          fetch("http://localhost:5000/api/admin/journals", { headers: getAdminHeaders() }),
        ]);
        const users = await uRes.json();
        const journals = await jRes.json();
        const grouped = {};
        if (Array.isArray(journals)) journals.forEach(j => { if (!grouped[j.userId]) grouped[j.userId] = []; grouped[j.userId].push(j); });
        setUsers(Array.isArray(users) ? users : []);
        setJournalsByUser(grouped);
      } catch { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async () => {
    const { id } = confirmDelete; setConfirmDelete(null);
    await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: "DELETE", headers: getAdminHeaders() }).catch(() => {});
    setUsers(prev => prev.filter(u => u._id !== id));
    if (expandedUser === id) setExpandedUser(null);
  };

  const handleDeleteJournal = async () => {
    const { id, userId } = confirmDelete; setConfirmDelete(null);
    await fetch(`http://localhost:5000/api/admin/journals/${id}`, { method: "DELETE", headers: getAdminHeaders() }).catch(() => {});
    setJournalsByUser(prev => ({ ...prev, [userId]: (prev[userId] || []).filter(j => j._id !== id) }));
  };

  const filtered = users.filter(u =>
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.name  || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout collapsed={collapsed} setCollapsed={setCollapsed}>
      <PageHeader
        title="Users"
        subtitle={`${users.length} registered user${users.length !== 1 ? "s" : ""}`}
      />

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-sm">No users found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => {
            const journals = journalsByUser[user.email] || [];
            const lastJournal = journals[0];
            const avgRisk = journals.length ? (journals.reduce((s, j) => s + (j.riskScore || 0), 0) / journals.length).toFixed(1) : "0";
            const isExpanded = expandedUser === user._id;

            return (
              <Card key={user._id} className="overflow-hidden">
                {/* User row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer min-w-0" onClick={() => setExpandedUser(isExpanded ? null : user._id)}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : (user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name || "—"}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {journals.length} {journals.length === 1 ? "entry" : "entries"} · Joined {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {lastJournal && (
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-semibold hidden sm:block ${emotionColor(lastJournal.analysis?.emotion)}`}>
                        {lastJournal.analysis?.emotion || "unknown"}
                      </span>
                    )}
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider">Avg Risk</p>
                      <p className={`text-sm font-bold ${parseFloat(avgRisk) >= 70 ? "text-red-400" : parseFloat(avgRisk) >= 40 ? "text-amber-400" : "text-emerald-400"}`}>{avgRisk}</p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete({ type: "user", id: user._id, message: `Delete "${user.name || user.email}"? This will also delete all their journal entries.` })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs font-semibold"
                    >
                      <FaTrash size={10} /> Delete
                    </button>
                    <button onClick={() => setExpandedUser(isExpanded ? null : user._id)} className="text-slate-500 hover:text-white transition p-1">
                      {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                    </button>
                  </div>
                </div>

                {/* Journal history */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06] px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">Journal History ({journals.length})</p>
                    {journals.length === 0 ? (
                      <p className="text-sm text-slate-600">No entries yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {journals.map(entry => (
                          <div key={entry._id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-semibold ${emotionColor(entry.analysis?.emotion)}`}>
                                  {entry.analysis?.emotion || "unknown"}
                                </span>
                                <span className="text-xs text-slate-600">
                                  {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {new Date(entry.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              {entry.text && <p className="text-xs text-slate-500 line-clamp-2">"{entry.text}"</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="bg-white/[0.04] rounded-lg px-2.5 py-1.5 text-center">
                                <p className="text-[10px] text-slate-600">Risk</p>
                                <p className={`text-xs font-bold ${(entry.riskScore || 0) >= 70 ? "text-red-400" : (entry.riskScore || 0) >= 40 ? "text-amber-400" : "text-emerald-400"}`}>{(entry.riskScore || 0).toFixed(1)}</p>
                              </div>
                              <div className="bg-white/[0.04] rounded-lg px-2.5 py-1.5 text-center">
                                <p className="text-[10px] text-slate-600">Conf</p>
                                <p className="text-xs font-bold text-indigo-400">{entry.analysis?.confidence ? `${(entry.analysis.confidence * 100).toFixed(0)}%` : "—"}</p>
                              </div>
                              <button
                                onClick={() => setConfirmDelete({ type: "journal", id: entry._id, userId: user.email, message: "Delete this journal entry? This cannot be undone." })}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs font-semibold"
                              >
                                <FaTrash size={9} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={confirmDelete.message}
          onConfirm={confirmDelete.type === "user" ? handleDeleteUser : handleDeleteJournal}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </AdminLayout>
  );
}