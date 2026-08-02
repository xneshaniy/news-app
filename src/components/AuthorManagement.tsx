"use client";

import { useState } from "react";
import {
  Users, Plus, Edit3, Trash2, Mail, Shield, Search,
  MoreVertical, UserPlus, Check, X, ExternalLink, Clock,
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "editor" | "author";
  bio: string;
  articlesCount: number;
  joinedAt: string;
  lastActive: string;
  status: "active" | "inactive";
}

const ROLES = [
  { value: "admin", label: "Admin", color: "bg-red-100 dark:bg-red-900/30 text-red-600", description: "Full access to all features" },
  { value: "editor", label: "Editor", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", description: "Can edit and publish content" },
  { value: "author", label: "Author", color: "bg-green-100 dark:bg-green-900/30 text-green-600", description: "Can create and draft content" },
];

const INITIAL_AUTHORS: Author[] = [
  { id: "a1", name: "Sarah Chen", email: "sarah@worldlive.dpdns.org", avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=2563eb&color=fff", role: "admin", bio: "Editor-in-Chief with 15 years in journalism", articlesCount: 342, joinedAt: "2024-01-15", lastActive: "2 min ago", status: "active" },
  { id: "a2", name: "James Wilson", email: "james@worldlive.dpdns.org", avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=8b5cf6&color=fff", role: "editor", bio: "Senior editor covering politics and policy", articlesCount: 287, joinedAt: "2024-03-20", lastActive: "15 min ago", status: "active" },
  { id: "a3", name: "Maria Garcia", email: "maria@worldlive.dpdns.org", avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=ec4899&color=fff", role: "author", bio: "Technology and AI correspondent", articlesCount: 156, joinedAt: "2024-06-10", lastActive: "1 hour ago", status: "active" },
  { id: "a4", name: "David Kim", email: "david@worldlive.dpdns.org", avatar: "https://ui-avatars.com/api/?name=David+Kim&background=10b981&color=fff", role: "author", bio: "Sports reporter covering major leagues", articlesCount: 98, joinedAt: "2024-08-05", lastActive: "3 hours ago", status: "active" },
  { id: "a5", name: "Emily Brown", email: "emily@worldlive.dpdns.org", avatar: "https://ui-avatars.com/api/?name=Emily+Brown&background=f59e0b&color=fff", role: "editor", bio: "Health and science editor", articlesCount: 213, joinedAt: "2024-02-28", lastActive: "2 days ago", status: "inactive" },
];

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>(INITIAL_AUTHORS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [newAuthor, setNewAuthor] = useState<{ name: string; email: string; role: "admin" | "editor" | "author"; bio: string }>({ name: "", email: "", role: "author", bio: "" });

  const addAuthor = () => {
    if (!newAuthor.name || !newAuthor.email) return;
    const author: Author = {
      id: `author-${Date.now()}`,
      name: newAuthor.name,
      email: newAuthor.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newAuthor.name)}&background=3b82f6&color=fff`,
      role: newAuthor.role,
      bio: newAuthor.bio,
      articlesCount: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "Just now",
      status: "active",
    };
    setAuthors((prev) => [author, ...prev]);
    setNewAuthor({ name: "", email: "", role: "author", bio: "" });
    setShowAddForm(false);
  };

  const deleteAuthor = (id: string) => setAuthors((prev) => prev.filter((a) => a.id !== id));

  const toggleStatus = (id: string) => {
    setAuthors((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a));
  };

  const changeRole = (id: string, role: "admin" | "editor" | "author") => {
    setAuthors((prev) => prev.map((a) => a.id === id ? { ...a, role } : a));
  };

  const filtered = authors.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase());
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your writing team</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add Author
        </button>
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
            <input type="email" placeholder="Email address" value={newAuthor.email} onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <select value={newAuthor.role} onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value as "admin" | "editor" | "author" })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label} - {r.description}</option>)}
            </select>
            <input placeholder="Bio" value={newAuthor.bio} onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
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

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((author) => (
            <div key={author.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
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
                <p className="text-xs text-gray-500 truncate">{author.bio}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{author.articlesCount} articles</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {author.lastActive}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <select value={author.role} onChange={(e) => changeRole(author.id, e.target.value as "admin" | "editor" | "author")} className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800">
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <button onClick={() => toggleStatus(author.id)} className={`p-1.5 rounded-lg transition-colors ${author.status === "active" ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title={author.status === "active" ? "Deactivate" : "Activate"}>
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => deleteAuthor(author.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
