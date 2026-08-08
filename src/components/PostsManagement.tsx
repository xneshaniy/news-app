"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Plus, Edit3, Trash2, Clock, User, X, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminArticle {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  canonicalUrl: string;
  image: string | null;
  publishedAt: string;
  source: string;
  author: string | null;
  category: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditorState {
  id: string | null;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  image: string;
}

const EMPTY_EDITOR: EditorState = {
  id: null,
  title: "",
  description: "",
  content: "",
  author: "",
  category: "General",
  image: "",
};

const CATEGORY_OPTIONS = ["Breaking", "Politics", "Business", "Technology", "Sports", "Entertainment", "Health", "Science", "General"];

export default function PostsManagement() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [viewArticle, setViewArticle] = useState<AdminArticle | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", pageSize: "50" });
      if (searchQuery) params.set("search", searchQuery);
      if (filter !== "all") params.set("author", filter);
      const res = await fetch(`/api/admin/articles?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openNewArticle = () => {
    setEditor({ ...EMPTY_EDITOR });
  };

  const openEditArticle = (article: AdminArticle) => {
    setEditor({
      id: article.id,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      author: article.author || "",
      category: article.category || "General",
      image: article.image || "",
    });
  };

  const saveArticle = async () => {
    if (!editor) return;
    if (!editor.title.trim()) return;

    setSaving(true);
    setError("");
    try {
      if (editor.id) {
        await fetch(`/api/admin/articles/${editor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editor.title,
            description: editor.description,
            content: editor.content,
            image: editor.image,
            author: editor.author,
            category: editor.category,
          }),
        });
      } else {
        await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editor.title,
            description: editor.description,
            content: editor.content,
            image: editor.image,
            author: editor.author,
            category: editor.category,
            canonicalUrl: `https://worldlive.dpdns.org/manual/${editor.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80)}`,
          }),
        });
      }
      await fetchArticles();
      setEditor(null);
    } catch {
      setError("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setConfirmDelete(null);
      await fetchArticles();
    } catch {
      setError("Failed to delete article");
    }
  };

  const bulkDelete = async () => {
    for (const id of selectedArticles) {
      try {
        await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      } catch {
        // continue with others
      }
    }
    setSelectedArticles(new Set());
    await fetchArticles();
  };

  const filtered = articles.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const counts = {
    all: articles.length,
    newsapi: articles.filter((a) => a.source === "newsapi").length,
    gnews: articles.filter((a) => a.source === "gnews").length,
    mediastack: articles.filter((a) => a.source === "mediastack").length,
    worldnewsapi: articles.filter((a) => a.source === "worldnewsapi").length,
    newsapiAi: articles.filter((a) => a.source === "newsapiAi").length,
    apitube: articles.filter((a) => a.source === "apitube").length,
    manual: articles.filter((a) => a.source === "Manual").length,
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage {articles.length} articles stored in the database
          </p>
        </div>
        <button onClick={openNewArticle} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setEditor(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold">{editor.id ? "Edit Article" : "New Article"}</h2>
              <button onClick={() => setEditor(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={editor.title} onChange={(e) => setEditor({ ...editor, title: e.target.value })} placeholder="Article title..." className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={editor.description} onChange={(e) => setEditor({ ...editor, description: e.target.value })} placeholder="Short summary..." rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea value={editor.content} onChange={(e) => setEditor({ ...editor, content: e.target.value })} placeholder="Article content..." rows={8} className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input type="text" value={editor.author} onChange={(e) => setEditor({ ...editor, author: e.target.value })} placeholder="Author name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={editor.category} onChange={(e) => setEditor({ ...editor, category: e.target.value })} className={inputClass}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" value={editor.image} onChange={(e) => setEditor({ ...editor, image: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setEditor(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={saveArticle} disabled={!editor.title.trim() || saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editor.id ? "Save Changes" : "Create Article"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setViewArticle(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> View Article</h2>
              <button onClick={() => setViewArticle(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">{viewArticle.source}</span>
                {viewArticle.category && <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">{viewArticle.category}</span>}
                {viewArticle.country && <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 dark:bg-green-900/30 text-green-600">{viewArticle.country.toUpperCase()}</span>}
              </div>
              <h1 className="text-2xl font-bold mb-2">{viewArticle.title}</h1>
              {viewArticle.description && <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{viewArticle.description}</p>}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{viewArticle.author || viewArticle.source}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(viewArticle.publishedAt).toLocaleDateString()}</span>
              </div>
              {viewArticle.image && (
                <img src={viewArticle.image} alt={viewArticle.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              {viewArticle.content && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {viewArticle.content}
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <a href={`/article/${viewArticle.id}`} target="_blank" className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View on Site
              </a>
              <button onClick={() => { openEditArticle(viewArticle); setViewArticle(null); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold">Delete Article</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteArticle(confirmDelete.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
        {(["all", "newsapi", "gnews", "mediastack", "worldnewsapi", "newsapiAi", "apitube", "manual"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${filter === f ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {f === "all" ? "All" : f === "manual" ? "Manual" : f.replace(/newsapi/gi, "NewsAPI")}
            <span className="text-gray-400">({counts[f as keyof typeof counts]})</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
          <div className="relative flex-1">
            <input placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
          </div>
          <button onClick={fetchArticles} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
            <Loader2 className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {selectedArticles.size > 0 && (
            <button onClick={bulkDelete} className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs font-medium">
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedArticles.size})
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading articles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No articles found</h2>
            <p className="text-gray-500 dark:text-gray-400">Articles will appear here once the news APIs fetch them</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((article) => (
              <div key={article.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedArticles.has(article.id)}
                  onChange={() => setSelectedArticles((prev) => {
                    const next = new Set(prev);
                    if (next.has(article.id)) next.delete(article.id);
                    else next.add(article.id);
                    return next;
                  })}
                  className="w-4 h-4"
                />
                {article.image && (
                  <img src={article.image} alt="" className="w-16 h-12 object-cover rounded-md flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{article.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">{article.source}</span>
                    {article.category && <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">{article.category}</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1">{article.description || ""}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author || article.source}</span>
                    <Link href={`/article/${article.id}`} target="_blank" className="flex items-center gap-1 text-blue-500 hover:underline">
                      <ExternalLink className="w-3 h-3" /> View
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditArticle(article)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewArticle(article)} className="p-1.5 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="View">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(article)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}