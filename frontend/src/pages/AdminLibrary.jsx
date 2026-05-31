import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { AdminLayout, useAdminGuard, getAdminHeaders, PageHeader, Card } from "../Components/AdminLayout";

const TAGS = ["Condition", "Emotion", "Wellness", "Crisis"];
const TAG_COLORS = {
  Condition: "bg-blue-500/20 text-blue-300",
  Emotion:   "bg-orange-500/20 text-orange-300",
  Wellness:  "bg-emerald-500/20 text-emerald-300",
  Crisis:    "bg-red-500/20 text-red-300",
};
const EMPTY = { title: "", emoji: "📄", tag: "Condition", definition: "", overview: "", dailyImpact: "", symptoms: "", coping: "", seek: "", feels: "", crisis: false };

function ArticleModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?._id;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (initial?._id) setForm({ ...initial, symptoms: Array.isArray(initial.symptoms) ? initial.symptoms.join("\n") : (initial.symptoms || ""), coping: Array.isArray(initial.coping) ? initial.coping.join("\n") : (initial.coping || "") });
  }, []);

  const handleSave = async () => {
    if (!form.title.trim() || !form.definition.trim()) { setError("Title and definition are required."); return; }
    setLoading(true); setError("");
    const payload = { ...form, symptoms: form.symptoms ? form.symptoms.split("\n").map(s => s.trim()).filter(Boolean) : [], coping: form.coping ? form.coping.split("\n").map(s => s.trim()).filter(Boolean) : [] };
    try {
      const url = isEdit ? `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/library/${initial._id}` : `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/library`;
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: getAdminHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Save failed."); return; }
      onSave(data.article);
    } catch { setError("Cannot connect to server."); } finally { setLoading(false); }
  };

  const Field = ({ label, hint, children }) => (
    <div className="col-span-2">
      <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">
        {label} {hint && <span className="normal-case font-normal text-slate-600">— {hint}</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#0d1424] border border-white/[0.1] rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-extrabold text-base">{isEdit ? "✏️ Edit Article" : "➕ Add New Article"}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition p-1"><FaTimes /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Title *">
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Depression" className={`${inputCls} h-10`} />
          </Field>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Emoji</label>
            <input value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="📄" className={`${inputCls} h-10`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Tag</label>
            <select value={form.tag} onChange={e => set("tag", e.target.value)} className={`${inputCls} h-10 bg-[#0d1424]`}>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <Field label="Definition *" hint="short 1-2 line summary shown on card">
            <textarea value={form.definition} onChange={e => set("definition", e.target.value)} rows={2} placeholder="Short definition..." className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Overview" hint="Overview tab">
            <textarea value={form.overview} onChange={e => set("overview", e.target.value)} rows={3} placeholder="Detailed overview..." className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Daily Impact" hint="Daily Impact tab">
            <textarea value={form.dailyImpact} onChange={e => set("dailyImpact", e.target.value)} rows={2} placeholder="How does this affect daily life..." className={`${inputCls} resize-none`} />
          </Field>
          <Field label="What It Feels Like" hint="Feels tab">
            <textarea value={form.feels} onChange={e => set("feels", e.target.value)} rows={2} placeholder="Describe the subjective experience..." className={`${inputCls} resize-none`} />
          </Field>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Symptoms <span className="normal-case font-normal text-slate-600">— one per line</span></label>
            <textarea value={form.symptoms} onChange={e => set("symptoms", e.target.value)} rows={5} placeholder={"Persistent sadness\nLoss of interest\nFatigue"} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Coping Strategies <span className="normal-case font-normal text-slate-600">— one per line</span></label>
            <textarea value={form.coping} onChange={e => set("coping", e.target.value)} rows={5} placeholder={"Exercise daily\nTalk to someone\nJournal your thoughts"} className={`${inputCls} resize-none`} />
          </div>

          <Field label="When To Seek Help">
            <textarea value={form.seek} onChange={e => set("seek", e.target.value)} rows={2} placeholder="Seek help if..." className={`${inputCls} resize-none`} />
          </Field>

          <div className="col-span-2 flex items-center gap-3">
            <input type="checkbox" id="crisis" checked={form.crisis} onChange={e => set("crisis", e.target.checked)} className="w-4 h-4 accent-red-500" />
            <label htmlFor="crisis" className="text-sm text-slate-400 font-medium">Mark as Crisis topic <span className="text-slate-600 font-normal">(shows urgent red badge in library)</span></label>
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-3 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 rounded-xl transition disabled:opacity-50">
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Article"}
          </button>
          <button onClick={onClose} className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-bold py-2.5 rounded-xl transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

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

export default function AdminLibrary() {
  useAdminGuard();
  const [collapsed, setCollapsed] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/library`, { headers: getAdminHeaders() })
      .then(r => r.json()).then(d => setArticles(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = (article) => {
    setArticles(prev => { const exists = prev.find(a => a._id === article._id); return exists ? prev.map(a => a._id === article._id ? article : a) : [article, ...prev]; });
    setModal(null);
  };

  const handleDelete = async () => {
    const id = confirmDelete; setConfirmDelete(null);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/library/${id}`, { method: "DELETE", headers: getAdminHeaders() }).catch(() => {});
    setArticles(prev => prev.filter(a => a._id !== id));
  };

  return (
    <AdminLayout collapsed={collapsed} setCollapsed={setCollapsed}>
      <PageHeader
        title="Library Articles"
        subtitle={`${articles.length} article${articles.length !== 1 ? "s" : ""} total`}
        action={
          <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-[0_4px_14px_rgba(99,102,241,0.3)]">
            <FaPlus size={11} /> Add Article
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-sm mb-4">No articles yet.</p>
          <button onClick={() => setModal("add")} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition">Add First Article</button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <Card key={article._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl shadow-lg">
                    {article.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${TAG_COLORS[article.tag] || "bg-slate-500/20 text-slate-300"}`}>{article.tag}</span>
                      {article.crisis && <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold animate-pulse">⚠️ Crisis</span>}
                    </div>
                    <p className="text-white font-extrabold text-base">{article.title}</p>
                    <p className="text-slate-500 text-xs leading-5 mt-1 line-clamp-2 max-w-2xl">{article.definition}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setModal(article)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition text-xs font-semibold">
                    <FaEdit size={10} /> Edit
                  </button>
                  <button onClick={() => setConfirmDelete(article._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs font-semibold">
                    <FaTrash size={10} /> Delete
                  </button>
                </div>
              </div>

              {/* Section indicators */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "Overview",     value: article.overview,    icon: "📖" },
                  { label: "Daily Impact", value: article.dailyImpact, icon: "📅" },
                  { label: "Feels Like",   value: article.feels,       icon: "💭" },
                  { label: "Symptoms",     value: article.symptoms?.length, icon: "🔍", count: true },
                  { label: "Coping",       value: article.coping?.length,   icon: "🌿", count: true },
                  { label: "Seek Help",    value: article.seek,        icon: "🏥" },
                ].map(({ label, value, icon, count }) => (
                  <div key={label} className={`rounded-lg px-2.5 py-1 text-xs border flex items-center gap-1 ${(count ? value > 0 : !!value) ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300" : "border-white/[0.05] bg-white/[0.03] text-slate-600"}`}>
                    <span>{icon}</span>
                    <span className="font-semibold">{label}</span>
                    {count ? <span className="text-slate-500">({value || 0})</span> : <span>{value ? "✓" : "—"}</span>}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {(modal === "add" || (modal && modal._id)) && (
        <ArticleModal initial={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {confirmDelete && (
        <ConfirmDialog message="Delete this article? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
      )}
    </AdminLayout>
  );
}