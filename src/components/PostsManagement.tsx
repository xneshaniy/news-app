"use client";

import { useState } from "react";
import {
  FileText, Plus, Edit3, Trash2, Eye, Clock, Send,
  Search, Calendar, Tag, User, Filter, CheckCircle,
  AlertCircle, Archive, Globe, ArrowUpRight, Copy,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  status: "published" | "draft" | "scheduled" | "archived";
  author: string;
  category: string;
  tags: string[];
  publishedAt?: string;
  scheduledFor?: string;
  views: number;
  featured: boolean;
}

const INITIAL_POSTS: Post[] = [
  { id: "p1", title: "AI Breakthrough: New Model Achieves Human-Level Reasoning", excerpt: "Researchers announce a major milestone in artificial intelligence...", status: "published", author: "Maria Garcia", category: "Technology", tags: ["AI", "Research"], publishedAt: "2 hours ago", views: 4521, featured: true },
  { id: "p2", title: "Global Climate Summit: Key Takeaways", excerpt: "World leaders gathered to discuss climate action plans...", status: "published", author: "James Wilson", category: "Politics", tags: ["Climate", "UN"], publishedAt: "5 hours ago", views: 3892, featured: false },
  { id: "p3", title: "Stock Markets Hit Record Highs Amid Tech Rally", excerpt: "Major indices reach all-time highs driven by technology stocks...", status: "published", author: "Sarah Chen", category: "Business", tags: ["Markets", "Tech"], publishedAt: "1 day ago", views: 2345, featured: false },
  { id: "p4", title: "Upcoming: Space Tourism Launch Next Month", excerpt: "Private space company announces first commercial flight...", status: "scheduled", author: "Maria Garcia", category: "Science", tags: ["Space"], scheduledFor: "2026-08-15 09:00", views: 0, featured: false },
  { id: "p5", title: "Draft: Interview with Nobel Prize Winner", excerpt: "Exclusive interview covering their groundbreaking research...", status: "draft", author: "Emily Brown", category: "Science", tags: ["Interview"], views: 0, featured: false },
  { id: "p6", title: "Olympics 2028: Host City Prepares", excerpt: "Behind the scenes look at the preparation efforts...", status: "draft", author: "David Kim", category: "Sports", tags: ["Olympics"], views: 0, featured: false },
  { id: "p7", title: "Year in Review: Top Stories of 2025", excerpt: "A comprehensive look back at the biggest news stories...", status: "archived", author: "Sarah Chen", category: "Breaking", tags: ["Year Review"], publishedAt: "2025-12-31", views: 15678, featured: false },
];

const STATUS_CONFIG = {
  published: { color: "bg-green-100 dark:bg-green-900/30 text-green-600", icon: CheckCircle, label: "Published" },
  draft: { color: "bg-gray-100 dark:bg-gray-700 text-gray-600", icon: FileText, label: "Draft" },
  scheduled: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", icon: Clock, label: "Scheduled" },
  archived: { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600", icon: Archive, label: "Archived" },
};

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());

  const filtered = posts.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    archived: posts.filter((p) => p.status === "archived").length,
  };

  const toggleSelect = (id: string) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage articles, drafts, and scheduled content</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
        {(["all", "published", "draft", "scheduled", "archived"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${filter === f ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="text-gray-400">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
          </div>
          {selectedPosts.size > 0 && (
            <button className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs font-medium">
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedPosts.size})
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((post) => {
            const config = STATUS_CONFIG[post.status];
            const StatusIcon = config.icon;
            return (
              <div key={post.id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <input type="checkbox" checked={selectedPosts.has(post.id)} onChange={() => toggleSelect(post.id)} className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{post.title}</h3>
                    {post.featured && <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">Featured</span>}
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full flex items-center gap-1 ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{post.category}</span>
                    {post.publishedAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.publishedAt}</span>}
                    {post.scheduledFor && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.scheduledFor}</span>}
                    {post.views > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPosts((prev) => prev.filter((p) => p.id !== post.id))} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
