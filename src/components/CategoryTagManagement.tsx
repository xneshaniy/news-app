"use client";

import { useState, useEffect } from "react";
import {
  Tag, Plus, Edit3, Trash2, Check, X, GripVertical,
  Hash, Folder, ChevronDown, ChevronRight, Search,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
  parent: string | null;
  children: Category[];
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Breaking", slug: "breaking", description: "Breaking news stories", color: "#ef4444", postCount: 24, parent: null, children: [] },
  { id: "2", name: "Politics", slug: "politics", description: "Political news & analysis", color: "#3b82f6", postCount: 156, parent: null, children: [] },
  { id: "3", name: "Technology", slug: "technology", description: "Tech news & innovation", color: "#8b5cf6", postCount: 203, parent: null, children: [
    { id: "2a", name: "AI", slug: "ai", description: "Artificial intelligence", color: "#8b5cf6", postCount: 89, parent: "3", children: [] },
    { id: "2b", name: "Cybersecurity", slug: "cybersecurity", description: "Security news", color: "#8b5cf6", postCount: 45, parent: "3", children: [] },
  ]},
  { id: "4", name: "Business", slug: "business", description: "Business & finance", color: "#10b981", postCount: 178, parent: null, children: [] },
  { id: "5", name: "Sports", slug: "sports", description: "Sports news", color: "#f59e0b", postCount: 142, parent: null, children: [] },
  { id: "6", name: "Entertainment", slug: "entertainment", description: "Entertainment news", color: "#ec4899", postCount: 112, parent: null, children: [] },
  { id: "7", name: "Health", slug: "health", description: "Health & wellness", color: "#14b8a6", postCount: 98, parent: null, children: [] },
  { id: "8", name: "Science", slug: "science", description: "Science & discovery", color: "#6366f1", postCount: 87, parent: null, children: [] },
];

const DEFAULT_TAGS: TagItem[] = [
  { id: "t1", name: "Climate Change", slug: "climate-change", count: 45 },
  { id: "t2", name: "Elections", slug: "elections", count: 67 },
  { id: "t3", name: "Artificial Intelligence", slug: "artificial-intelligence", count: 89 },
  { id: "t4", name: "Stock Market", slug: "stock-market", count: 34 },
  { id: "t5", name: "COVID-19", slug: "covid-19", count: 23 },
  { id: "t6", name: "Space", slug: "space", count: 28 },
  { id: "t7", name: "Cryptocurrency", slug: "cryptocurrency", count: 41 },
  { id: "t8", name: "Renewable Energy", slug: "renewable-energy", count: 19 },
];

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#14b8a6", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#6b7280"];

export default function CategoryTagManagement() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [tags, setTags] = useState<TagItem[]>(DEFAULT_TAGS);
  const [tab, setTab] = useState<"categories" | "tags">("categories");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["3"]));

  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "", color: "#3b82f6", parent: "" });
  const [newTag, setNewTag] = useState({ name: "", slug: "" });

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const addCategory = () => {
    if (!newCat.name) return;
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCat.name,
      slug: newCat.slug || generateSlug(newCat.name),
      description: newCat.description,
      color: newCat.color,
      postCount: 0,
      parent: newCat.parent || null,
      children: [],
    };
    setCategories((prev) => [...prev, cat]);
    setNewCat({ name: "", slug: "", description: "", color: "#3b82f6", parent: "" });
    setShowAddForm(false);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addTag = () => {
    if (!newTag.name) return;
    const tag: TagItem = {
      id: `tag-${Date.now()}`,
      name: newTag.name,
      slug: newTag.slug || generateSlug(newTag.name),
      count: 0,
    };
    setTags((prev) => [...prev, tag]);
    setNewTag({ name: "", slug: "" });
  };

  const deleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderCategory = (cat: Category, depth = 0) => {
    const isExpanded = expandedCategories.has(cat.id);
    const hasChildren = cat.children.length > 0;

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800`}
          style={{ paddingLeft: `${16 + depth * 24}px` }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(cat.id)} className="text-gray-400 hover:text-gray-600">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{cat.name}</p>
            <p className="text-xs text-gray-400 truncate">{cat.description}</p>
          </div>

          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {cat.postCount} posts
          </span>

          <div className="flex items-center gap-1">
            <button onClick={() => setEditingId(cat.id)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {isExpanded && hasChildren && cat.children.map((child) => renderCategory(child, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories & Tags</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Organize your content</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {tab === "categories" ? "Category" : "Tag"}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        {(["categories", "tags"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t === "categories" ? `Categories (${categories.length})` : `Tags (${tags.length})`}
          </button>
        ))}
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Add {tab === "categories" ? "Category" : "Tag"}</h3>
          {tab === "categories" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Name" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              <input placeholder="Slug" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              <input placeholder="Description" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm md:col-span-2" />
              <div className="flex gap-3">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-1.5">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setNewCat({ ...newCat, color: c })} className={`w-6 h-6 rounded-full ${newCat.color === c ? "ring-2 ring-offset-2 ring-blue-500" : ""}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <select value={newCat.parent} onChange={(e) => setNewCat({ ...newCat, parent: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
                <option value="">No parent (top-level)</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Tag name" value={newTag.name} onChange={(e) => setNewTag({ ...newTag, name: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              <input placeholder="Slug (auto-generated)" value={newTag.slug} onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <button onClick={tab === "categories" ? addCategory : addTag} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Add {tab === "categories" ? "Category" : "Tag"}
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        {tab === "categories" ? (
          <div>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
              </div>
            </div>
            {categories.map((cat) => renderCategory(cat))}
          </div>
        ) : (
          <div>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input placeholder="Search tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
              </div>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="group flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium">{tag.name}</span>
                  <span className="text-xs text-gray-400">{tag.count}</span>
                  <button onClick={() => deleteTag(tag.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
