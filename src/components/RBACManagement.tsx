"use client";

import { useState } from "react";
import {
  Shield, Plus, Edit3, Trash2, Check, X, Users, Lock,
  Eye, EyeOff, Settings, FileText, MessageSquare, BarChart3,
  Globe, Mail, Megaphone, Image, Search, ChevronDown,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
}

const ALL_PERMISSIONS = [
  { id: "posts.read", label: "View Posts", category: "Content" },
  { id: "posts.create", label: "Create Posts", category: "Content" },
  { id: "posts.edit", label: "Edit Posts", category: "Content" },
  { id: "posts.delete", label: "Delete Posts", category: "Content" },
  { id: "posts.publish", label: "Publish Posts", category: "Content" },
  { id: "categories.manage", label: "Manage Categories", category: "Content" },
  { id: "tags.manage", label: "Manage Tags", category: "Content" },
  { id: "media.upload", label: "Upload Media", category: "Content" },
  { id: "media.delete", label: "Delete Media", category: "Content" },
  { id: "comments.read", label: "View Comments", category: "Moderation" },
  { id: "comments.moderate", label: "Moderate Comments", category: "Moderation" },
  { id: "comments.block", label: "Block Users", category: "Moderation" },
  { id: "authors.manage", label: "Manage Authors", category: "Users" },
  { id: "roles.manage", label: "Manage Roles", category: "Users" },
  { id: "ads.manage", label: "Manage Advertisements", category: "Monetization" },
  { id: "ads.view_reports", label: "View Ad Reports", category: "Monetization" },
  { id: "newsletters.manage", label: "Manage Newsletters", category: "Marketing" },
  { id: "newsletters.send", label: "Send Newsletters", category: "Marketing" },
  { id: "seo.manage", label: "Manage SEO Settings", category: "Settings" },
  { id: "settings.manage", label: "Manage Website Settings", category: "Settings" },
  { id: "analytics.view", label: "View Analytics", category: "Analytics" },
  { id: "featured.manage", label: "Manage Featured Stories", category: "Content" },
];

const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access. Can manage all content, users, settings, and configurations.",
    color: "#ef4444",
    userCount: 2,
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    isSystem: true,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can manage and approve content, edit articles, moderate comments, and view analytics.",
    color: "#3b82f6",
    userCount: 5,
    permissions: [
      "posts.read", "posts.create", "posts.edit", "posts.publish",
      "categories.manage", "tags.manage", "media.upload", "media.delete",
      "comments.read", "comments.moderate",
      "featured.manage", "analytics.view", "ads.view_reports",
    ],
    isSystem: true,
  },
  {
    id: "author",
    name: "Author",
    description: "Can create and manage own posts, upload media, and view own analytics.",
    color: "#10b981",
    userCount: 12,
    permissions: [
      "posts.read", "posts.create", "posts.edit",
      "media.upload", "comments.read",
      "analytics.view",
    ],
    isSystem: true,
  },
  {
    id: "contributor",
    name: "Contributor",
    description: "Can create drafts but cannot publish. Limited to own content.",
    color: "#f59e0b",
    userCount: 8,
    permissions: [
      "posts.read", "posts.create", "posts.edit",
      "media.upload", "comments.read",
    ],
    isSystem: false,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access. Can view published content and analytics.",
    color: "#6b7280",
    userCount: 15,
    permissions: [
      "posts.read", "comments.read", "analytics.view",
    ],
    isSystem: false,
  },
];

const CATEGORIES = ["Content", "Moderation", "Users", "Monetization", "Marketing", "Settings", "Analytics"];

export default function RBACManagement() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string>("Content");
  const [newRole, setNewRole] = useState({ name: "", description: "", color: "#6366f1", permissions: [] as string[] });

  const addRole = () => {
    if (!newRole.name) return;
    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      color: newRole.color,
      userCount: 0,
      permissions: newRole.permissions,
      isSystem: false,
    };
    setRoles((prev) => [...prev, role]);
    setNewRole({ name: "", description: "", color: "#6366f1", permissions: [] });
    setShowAddForm(false);
  };

  const deleteRole = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (role?.isSystem) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const togglePermission = (roleId: string, permId: string) => {
    setRoles((prev) => prev.map((r) => {
      if (r.id !== roleId) return r;
      const has = r.permissions.includes(permId);
      return { ...r, permissions: has ? r.permissions.filter((p) => p !== permId) : [...r.permissions, permId] };
    }));
  };

  const toggleNewPermission = (permId: string) => {
    setNewRole((prev) => {
      const has = prev.permissions.includes(permId);
      return { ...prev, permissions: has ? prev.permissions.filter((p) => p !== permId) : [...prev.permissions, permId] };
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage user roles and access control</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Create New Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Role name" value={newRole.name} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <input placeholder="Description" value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <div className="flex items-center gap-3">
              <label className="text-sm">Color</label>
              <input type="color" value={newRole.color} onChange={(e) => setNewRole({ ...newRole, color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Permissions</p>
            {CATEGORIES.map((cat) => {
              const perms = ALL_PERMISSIONS.filter((p) => p.category === cat);
              const allChecked = perms.every((p) => newRole.permissions.includes(p.id));
              return (
                <div key={cat} className="mb-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <input type="checkbox" checked={allChecked} onChange={() => {
                      setNewRole((prev) => ({
                        ...prev,
                        permissions: allChecked ? prev.permissions.filter((p) => !perms.find((pp) => pp.id === p)) : [...new Set([...prev.permissions, ...perms.map((p) => p.id)])],
                      }));
                    }} className="w-3.5 h-3.5" />
                    {cat}
                  </label>
                  <div className="flex flex-wrap gap-2 ml-5">
                    {perms.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-1.5 text-xs">
                        <input type="checkbox" checked={newRole.permissions.includes(perm.id)} onChange={() => toggleNewPermission(perm.id)} className="w-3.5 h-3.5" />
                        {perm.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button onClick={addRole} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Create Role</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: role.color + "20" }}>
                  <Shield className="w-5 h-5" style={{ color: role.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{role.name}</h3>
                    {role.isSystem && <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">System</span>}
                  </div>
                  <p className="text-xs text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{role.userCount} users</span>
                {!role.isSystem && (
                  <button onClick={() => deleteRole(role.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.slice(0, 10).map((permId) => {
                const perm = ALL_PERMISSIONS.find((p) => p.id === permId);
                return perm ? (
                  <span key={permId} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    {perm.label}
                  </span>
                ) : null;
              })}
              {role.permissions.length > 10 && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                  +{role.permissions.length - 10} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
