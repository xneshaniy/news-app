"use client";

import { useState } from "react";
import {
  Users, UserPlus, Shield, Ban, CheckCircle, XCircle,
  Eye, Edit3, Trash2, Search, Mail, Activity,
  X,
} from "lucide-react";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "super_admin" | "admin" | "editor" | "author" | "moderator" | "user";
  status: "active" | "suspended" | "pending" | "blocked";
  verified: boolean;
  joinDate: string;
  lastActive: string;
  articles: number;
  comments: number;
  twoFactor: boolean;
  lastIP: string;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah@worldlive.com", avatar: "SC", role: "super_admin", status: "active", verified: true, joinDate: "2025-01-15", lastActive: "2 min ago", articles: 234, comments: 1205, twoFactor: true, lastIP: "192.168.1.100" },
  { id: "u2", name: "Marcus Johnson", email: "marcus@worldlive.com", avatar: "MJ", role: "admin", status: "active", verified: true, joinDate: "2025-02-20", lastActive: "15 min ago", articles: 189, comments: 890, twoFactor: true, lastIP: "10.0.0.55" },
  { id: "u3", name: "Emma Wilson", email: "emma@writers.co", avatar: "EW", role: "editor", status: "active", verified: true, joinDate: "2025-03-10", lastActive: "1 hour ago", articles: 156, comments: 678, twoFactor: false, lastIP: "172.16.0.22" },
  { id: "u4", name: "David Park", email: "david@news.io", avatar: "DP", role: "author", status: "active", verified: true, joinDate: "2025-04-05", lastActive: "3 hours ago", articles: 87, comments: 345, twoFactor: false, lastIP: "203.0.113.44" },
  { id: "u5", name: "Lisa Rodriguez", email: "lisa@media.com", avatar: "LR", role: "moderator", status: "active", verified: true, joinDate: "2025-05-12", lastActive: "30 min ago", articles: 23, comments: 2340, twoFactor: true, lastIP: "198.51.100.77" },
  { id: "u6", name: "James Brown", email: "james@test.com", avatar: "JB", role: "user", status: "suspended", verified: false, joinDate: "2025-06-01", lastActive: "2 days ago", articles: 0, comments: 45, twoFactor: false, lastIP: "192.0.2.33" },
  { id: "u7", name: "Aisha Patel", email: "aisha@design.co", avatar: "AP", role: "author", status: "active", verified: true, joinDate: "2025-07-20", lastActive: "5 hours ago", articles: 67, comments: 234, twoFactor: true, lastIP: "198.51.100.12" },
  { id: "u8", name: "Tom Anderson", email: "tom@spam.com", avatar: "TA", role: "user", status: "blocked", verified: false, joinDate: "2025-08-15", lastActive: "1 week ago", articles: 0, comments: 890, twoFactor: false, lastIP: "203.0.113.99" },
];

const LOGIN_HISTORY = [
  { user: "Sarah Chen", ip: "192.168.1.100", location: "New York, US", device: "Chrome / Windows", time: "2 min ago", success: true },
  { user: "Marcus Johnson", ip: "10.0.0.55", location: "London, UK", device: "Safari / macOS", time: "15 min ago", success: true },
  { user: "James Brown", ip: "192.0.2.33", location: "Unknown", device: "Firefox / Linux", time: "2 hours ago", success: false },
  { user: "Tom Anderson", ip: "203.0.113.99", location: "Berlin, DE", device: "Chrome / Windows", time: "1 day ago", success: true },
  { user: "Emma Wilson", ip: "172.16.0.22", location: "Toronto, CA", device: "Edge / Windows", time: "1 hour ago", success: true },
];

const ROLES: { value: ManagedUser["role"]; label: string }[] = [
  { value: "user", label: "User" },
  { value: "author", label: "Author" },
  { value: "moderator", label: "Moderator" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"users" | "login-history" | "activity">("users");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" as ManagedUser["role"] });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editForm, setEditForm] = useState<ManagedUser | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const initials = newUser.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const user: ManagedUser = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      avatar: initials,
      role: newUser.role,
      status: "active",
      verified: false,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      articles: 0,
      comments: 0,
      twoFactor: false,
      lastIP: "N/A",
    };
    setUsers((prev) => [user, ...prev]);
    setNewUser({ name: "", email: "", role: "user" });
    setShowAddForm(false);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDelete(null);
  };

  const toggleUserStatus = (id: string, newStatus: ManagedUser["status"]) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
  };

  const openEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setEditForm({ ...user });
  };

  const saveEdit = () => {
    if (!editForm) return;
    setUsers((prev) => prev.map((u) => (u.id === editForm.id ? editForm : u)));
    setEditingUser(null);
    setEditForm(null);
  };

  const roleColors: Record<string, string> = {
    super_admin: "bg-red-100 dark:bg-red-900/30 text-red-600",
    admin: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    editor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    author: "bg-green-100 dark:bg-green-900/30 text-green-600",
    moderator: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    user: "bg-gray-100 dark:bg-gray-700 text-gray-600",
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 dark:bg-green-900/30 text-green-600",
    suspended: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    pending: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    blocked: "bg-red-100 dark:bg-red-900/30 text-red-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage users, profiles, and access</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Add New User</h2>
              <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as ManagedUser["role"] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button
                onClick={addUser}
                disabled={!newUser.name.trim() || !newUser.email.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add User
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
                <h3 className="font-bold">Delete User</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{users.find((u) => u.id === confirmDelete)?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteUser(confirmDelete)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingUser(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Edit User</h2>
              <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as ManagedUser["role"] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ManagedUser["status"] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <label className="text-sm font-medium">Verified</label>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, verified: !editForm.verified })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editForm.verified ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${editForm.verified ? "left-6" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <label className="text-sm font-medium">Two-Factor Auth</label>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, twoFactor: !editForm.twoFactor })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${editForm.twoFactor ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${editForm.twoFactor ? "left-6" : "left-1"}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <p className="text-2xl font-bold text-yellow-600">{users.filter((u) => u.status === "suspended").length}</p>
          <p className="text-xs text-gray-500">Suspended</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <p className="text-2xl font-bold text-red-600">{users.filter((u) => u.status === "blocked").length}</p>
          <p className="text-xs text-gray-500">Blocked</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        {[
          { key: "users", label: "Users" },
          { key: "login-history", label: "Login History" },
          { key: "activity", label: "Activity" },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              <option value="all">All Roles</option>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Articles</th>
                    <th className="px-4 py-3">Comments</th>
                    <th className="px-4 py-3">2FA</th>
                    <th className="px-4 py-3">Last Active</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{user.avatar}</div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${roleColors[user.role]}`}>{user.role.replace(/_/g, " ")}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusColors[user.status]}`}>{user.status}</span></td>
                      <td className="px-4 py-3 text-sm">{user.articles}</td>
                      <td className="px-4 py-3 text-sm">{user.comments.toLocaleString()}</td>
                      <td className="px-4 py-3">{user.twoFactor ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{user.lastActive}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title="View"><Eye className="w-3.5 h-3.5" /></button>
                          <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                          {user.status === "active" ? (
                            <button onClick={() => toggleUserStatus(user.id, "suspended")} className="p-1.5 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title="Suspend"><Ban className="w-3.5 h-3.5" /></button>
                          ) : user.status === "suspended" ? (
                            <button onClick={() => toggleUserStatus(user.id, "active")} className="p-1.5 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Activate"><CheckCircle className="w-3.5 h-3.5" /></button>
                          ) : (
                            <button onClick={() => toggleUserStatus(user.id, "active")} className="p-1.5 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Unblock"><CheckCircle className="w-3.5 h-3.5" /></button>
                          )}
                          {user.status !== "blocked" && (
                            <button onClick={() => toggleUserStatus(user.id, "blocked")} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Block"><Ban className="w-3.5 h-3.5" /></button>
                          )}
                          <button onClick={() => setConfirmDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "login-history" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {LOGIN_HISTORY.map((login, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full ${login.success ? "bg-green-500" : "bg-red-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{login.user}</p>
                  <p className="text-xs text-gray-400">{login.ip} · {login.location} · {login.device}</p>
                </div>
                <span className={`text-xs font-medium ${login.success ? "text-green-600" : "text-red-600"}`}>{login.success ? "Success" : "Failed"}</span>
                <span className="text-xs text-gray-400">{login.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
          <div className="space-y-4">
            {[
              { user: "Sarah Chen", action: "Published article", detail: "AI Breakthrough in Medicine", time: "2 min ago", icon: CheckCircle, color: "text-green-500" },
              { user: "Marcus Johnson", action: "Moderated comment", detail: "Approved 5 comments on Politics", time: "15 min ago", icon: Shield, color: "text-blue-500" },
              { user: "Emma Wilson", action: "Updated article", detail: "Stock Market Analysis Q3", time: "1 hour ago", icon: Edit3, color: "text-yellow-500" },
              { user: "James Brown", action: "Account suspended", detail: "Violation of community guidelines", time: "2 hours ago", icon: Ban, color: "text-red-500" },
              { user: "David Park", action: "Created draft", detail: "New Technology Trends 2026", time: "3 hours ago", icon: Edit3, color: "text-purple-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className={`mt-0.5 ${item.color}`}><item.icon className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">{item.user}</span> {item.action}</p>
                  <p className="text-xs text-gray-400">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
