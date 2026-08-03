"use client";

import { useState, useEffect } from "react";
import { Trash2, Mail, Shield, Search, UserPlus, Check, KeyRound, AlertCircle } from "lucide-react";

interface Author {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "author";
  bio: string;
  status: "active" | "inactive";
  createdAt: string;
}

const ROLES = [
  { value: "admin", label: "Admin", color: "bg-red-100 dark:bg-red-900/30 text-red-600", description: "Full access to all features" },
  { value: "editor", label: "Editor", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", description: "Can edit and publish content" },
  { value: "author", label: "Author", color: "bg-green-100 dark:bg-green-900/30 text-green-600", description: "Can create and draft content" },
];

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newAuthor, setNewAuthor] = useState<{ name: string; email: string; password: string; role: "admin" | "editor" | "author"; bio: string }>({
    name: "",
    email: "",
    password: "",
    role: "author",
    bio: "",
  });

  const loadAuthors = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/authors");
      if (!res.ok) throw new Error("Failed to load authors");
      const data = await res.json();
      setAuthors(data.authors || []);
    } catch {
      setLoadError("Could not load authors. Check that you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  const addAuthor = async () => {
    if (!newAuthor.name || !newAuthor.email || !newAuthor.password) {
      showNotice("error", "Name, email and password are required");
      return;
    }
    try {
      const res = await fetch("/api/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAuthor),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add author");
      setAuthors((prev) => [data.author, ...prev]);
      setNewAuthor({ name: "", email: "", password: "", role: "author", bio: "" });
      setShowAddForm(false);
      showNotice("success", `Author ${data.author.email} created. They can now log in with the password you set.`);
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to add author");
    }
  };

  const deleteAuthor = async (id: string) => {
    const author = authors.find((a) => a.id === id);
    if (!confirm(`Delete author ${author?.email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/authors?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete author");
      setAuthors((prev) => prev.filter((a) => a.id !== id));
      showNotice("success", "Author deleted.");
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to delete author");
    }
  };

  const toggleStatus = async (author: Author) => {
    try {
      const res = await fetch(`/api/admin/authors?id=${author.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: author.status === "active" ? "inactive" : "active" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setAuthors((prev) => prev.map((a) => (a.id === author.id ? { ...a, status: data.author.status } : a)));
      showNotice("success", `${author.email} is now ${data.author.status}.`);
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to update status");
    }
  };

  const changeRole = async (author: Author, role: "admin" | "editor" | "author") => {
    try {
      const res = await fetch(`/api/admin/authors?id=${author.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      setAuthors((prev) => prev.map((a) => (a.id === author.id ? { ...a, role: data.author.role } : a)));
      showNotice("success", `${author.email} role updated to ${role}.`);
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to update role");
    }
  };

  const resetPassword = async (author: Author) => {
    const password = prompt(`Enter a new password for ${author.email} (min 8 characters):`);
    if (!password) return;
    if (password.length < 8) {
      showNotice("error", "Password must be at least 8 characters");
      return;
    }
    try {
      const res = await fetch(`/api/admin/authors?id=${author.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Failed to reset password");
      showNotice("success", `Password reset for ${author.email}.`);
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Failed to reset password");
    }
  };

  const filtered = authors.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || a.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleConfig = {
    admin: { color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
    editor: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
    author: { color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your writing team. Each author logs in with their own email and password.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Author
        </button>
      </div>

      {notice && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm ${
            notice.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {notice.message}
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 mb-6 text-amber-700 dark:text-amber-400 text-sm">
        <p className="font-semibold mb-1">Author Login Notice</p>
        <p>
          Each author has a separate email address and password. Please use your own
          login credentials to access your account. Do not use our email address or
          password.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {ROLES.map((role) => {
          const count = authors.filter((a) => a.role === role.value).length;
          return (
            <div key={role.value} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${role.color}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-gray-500">{role.label}s</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Add New Author</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full name" value={newAuthor.name} onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input type="email" placeholder="Email address (their login)" value={newAuthor.email} onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="Password (min 8 chars, their login)"
                value={newAuthor.password}
                onChange={(e) => setNewAuthor({ ...newAuthor, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <select value={newAuthor.role} onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value as "admin" | "editor" | "author" })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label} - {r.description}</option>)}
            </select>
            <input placeholder="Bio" value={newAuthor.bio} onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm md:col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addAuthor} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Add Author</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search authors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[{ value: "all", label: "All" }, ...ROLES.map((r) => ({ value: r.value, label: r.label }))].map((r) => (
              <button key={r.value} onClick={() => setFilterRole(r.value)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterRole === r.value ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading authors...</div>
        ) : loadError ? (
          <div className="p-8 text-center text-sm text-red-500">{loadError}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No authors found. Add your first author above.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((author) => (
              <div key={author.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{author.name.slice(0, 1).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{author.name}</p>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${roleConfig[author.role].color}`}>
                      {author.role}
                    </span>
                    {author.status === "inactive" && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {author.email}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <select value={author.role} onChange={(e) => changeRole(author, e.target.value as "admin" | "editor" | "author")} className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800">
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <button
                    onClick={() => resetPassword(author)}
                    className="flex items-center gap-1 p-1.5 text-xs text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Reset password"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleStatus(author)} className={`p-1.5 rounded-lg transition-colors ${author.status === "active" ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title={author.status === "active" ? "Deactivate" : "Activate"}>
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteAuthor(author.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
