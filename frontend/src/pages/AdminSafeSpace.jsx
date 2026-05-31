import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { AdminLayout, useAdminGuard, getAdminHeaders, PageHeader, Card } from "../Components/AdminLayout";

const CATEGORIES = ["music", "mini-games", "meditation", "therapy", "funny-videos", "dance-videos", "breathing", "affirmations", "other"];
const MEDIA_TYPES = ["text", "video", "audio", "game", "link"];
const EMPTY = { title: "", description: "", category: "music", mediaType: "text", url: "", duration: "" };

const CAT_EMOJI = { music: "🎵", breathing: "🌬️", "mini-games": "🎮", affirmations: "💜", meditation: "🧘", "funny-videos": "😂", "dance-videos": "💃", therapy: "🤝", other: "✨" };
const CAT_COLOR = { music: "bg-yellow-500/20 text-yellow-300", breathing: "bg-cyan-500/20 text-cyan-300", "mini-games": "bg-green-500/20 text-green-300", affirmations: "bg-purple-500/20 text-purple-300", meditation: "bg-indigo-500/20 text-indigo-300", "funny-videos": "bg-pink-500/20 text-pink-300", "dance-videos": "bg-rose-500/20 text-rose-300", therapy: "bg-sky-500/20 text-sky-300", other: "bg-slate-500/20 text-slate-300" };

function ItemModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initial?._id;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim()) { setError("Title and category are required."); return; }
    setLoading(true); setError("");
    try {
      const url = isEdit ? `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/safespace/${initial._id}` : `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/safespace`;
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: getAdminHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Save failed."); return; }
      onSave(data.item);
    } catch { setError("Cannot connect to server."); } finally { setLoading(false); }
  };

  const inputCls = "w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#0d1424] border border-white/[0.1] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-extrabold text-base">{isEdit ? "✏️ Edit Item" : "➕ Add New Item"}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition p-1"><FaTimes /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Calm Piano Music" className={`${inputCls} h-10`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Short description..." className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={`${inputCls} h-10 bg-[#0d1424]`}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Media Type</label>
              <select value={form.mediaType} onChange={e => set("mediaType", e.target.value)} className={`${inputCls} h-10 bg-[#0d1424]`}>
                {MEDIA_TYPES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">URL <span className="normal-case font-normal text-slate-600">— YouTube / Spotify / Game link</span></label>
            <input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." className={`${inputCls} h-10`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Duration <span className="normal-case font-normal text-slate-600">— optional</span></label>
            <input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 5 min" className={`${inputCls} h-10`} />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-3 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 rounded-xl transition disabled:opacity-50">
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}
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

export default function AdminSafeSpace() {
  useAdminGuard();
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/safespace`, { headers: getAdminHeaders() })
      .then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = (item) => {
    setItems(prev => { const exists = prev.find(i => i._id === item._id); return exists ? prev.map(i => i._id === item._id ? item : i) : [item, ...prev]; });
    setModal(null);
  };

  const handleDelete = async () => {
    const id = confirmDelete; setConfirmDelete(null);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/safespace/${id}`, { method: "DELETE", headers: getAdminHeaders() }).catch(() => {});
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const filtered = filterCat === "all" ? items : items.filter(i => i.category === filterCat);

  return (
    <AdminLayout collapsed={collapsed} setCollapsed={setCollapsed}>
      <PageHeader
        title="Calm Corner"
        subtitle={`${items.length} item${items.length !== 1 ? "s" : ""} total`}
        action={
          <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-[0_4px_14px_rgba(99,102,241,0.3)]">
            <FaPlus size={11} /> Add Item
          </button>
        }
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${filterCat === cat ? "bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]" : "bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:bg-white/[0.08] hover:text-white"}`}>
            {cat === "all" ? "All" : `${CAT_EMOJI[cat]} ${cat}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">💜</p>
          <p className="text-sm mb-4">No items found.</p>
          <button onClick={() => setModal("add")} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition">Add First Item</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(item => (
            <Card key={item._id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-xl flex-shrink-0">
                    {CAT_EMOJI[item.category] || "✨"}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{item.title}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${CAT_COLOR[item.category] || "bg-slate-500/20 text-slate-300"}`}>{item.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-500/20 text-slate-400 capitalize">{item.mediaType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => setModal(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition text-xs font-semibold">
                    <FaEdit size={10} /> Edit
                  </button>
                  <button onClick={() => setConfirmDelete(item._id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs font-semibold">
                    <FaTrash size={10} /> Delete
                  </button>
                </div>
              </div>
              {item.description && <p className="text-slate-500 text-xs leading-5 line-clamp-2">{item.description}</p>}
              <div className="flex items-center justify-between text-xs text-slate-600 mt-auto pt-2 border-t border-white/[0.05]">
                {item.duration ? <span>⏱ {item.duration}</span> : <span />}
                {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition truncate max-w-[160px]">🔗 Open Link</a>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {(modal === "add" || (modal && modal._id)) && (
        <ItemModal initial={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {confirmDelete && (
        <ConfirmDialog message="Delete this item? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
      )}
    </AdminLayout>
  );
}