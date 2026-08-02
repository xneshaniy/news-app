"use client";

import { useState } from "react";
import {
  MessageSquare, Check, X, Trash2, Search, Filter,
  Flag, Clock, User, MoreVertical, Eye, AlertTriangle,
  CheckCircle, XCircle, MessageCircle, Shield,
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  email: string;
  avatar: string;
  content: string;
  articleTitle: string;
  status: "pending" | "approved" | "spam" | "rejected";
  createdAt: string;
  reported: boolean;
  reportReason?: string;
}

const INITIAL_COMMENTS: Comment[] = [
  { id: "c1", author: "John Doe", email: "john@example.com", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff", content: "Great article! The analysis of the market trends is spot on.", articleTitle: "Tech Giants Report Record Earnings", status: "pending", createdAt: "5 min ago", reported: false },
  { id: "c2", author: "Jane Smith", email: "jane@example.com", avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=ec4899&color=fff", content: "This is misleading information. The data doesn't support these claims.", articleTitle: "Climate Summit Reaches Agreement", status: "pending", createdAt: "12 min ago", reported: true, reportReason: "Misinformation" },
  { id: "c3", author: "SpamBot2000", email: "spam@bot.com", avatar: "https://ui-avatars.com/api/?name=Bot&background=9ca3af&color=fff", content: "Buy cheap products at discount-shop.com!!!", articleTitle: "Market Update", status: "spam", createdAt: "1 hour ago", reported: true, reportReason: "Spam" },
  { id: "c4", author: "Alice Johnson", email: "alice@example.com", avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=10b981&color=fff", content: "I agree with the points about renewable energy. We need more investment.", articleTitle: "Renewable Energy Breakthrough", status: "approved", createdAt: "2 hours ago", reported: false },
  { id: "c5", author: "Bob Wilson", email: "bob@example.com", avatar: "https://ui-avatars.com/api/?name=Bob+Wilson&background=f59e0b&color=fff", content: "Could you provide more details about the methodology?", articleTitle: "AI Research Paper", status: "approved", createdAt: "3 hours ago", reported: false },
  { id: "c6", author: "Troll123", email: "troll@example.com", avatar: "https://ui-avatars.com/api/?name=Troll&background=ef4444&color=fff", content: "This is the worst article I've ever read.", articleTitle: "Sports Championship", status: "rejected", createdAt: "4 hours ago", reported: true, reportReason: "Inappropriate" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 dark:bg-green-900/30 text-green-600", icon: CheckCircle },
  spam: { label: "Spam", color: "bg-red-100 dark:bg-red-900/30 text-red-600", icon: XCircle },
  rejected: { label: "Rejected", color: "bg-gray-100 dark:bg-gray-700 text-gray-600", icon: XCircle },
};

export default function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [filter, setFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = comments.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.author.toLowerCase().includes(searchQuery.toLowerCase()) || c.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, status: Comment["status"]) => {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const approveAll = () => {
    setComments((prev) => prev.map((c) => c.status === "pending" ? { ...c, status: "approved" } : c));
  };

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    spam: comments.filter((c) => c.status === "spam").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Comment Moderation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{counts.pending} pending review</p>
        </div>
        <div className="flex gap-2">
          {counts.pending > 0 && (
            <button onClick={approveAll} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              <Check className="w-4 h-4" />
              Approve All ({counts.pending})
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
        {(["all", "pending", "approved", "spam", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${filter === f ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {f === "pending" && <Clock className="w-3 h-3" />}
            {f === "approved" && <CheckCircle className="w-3 h-3" />}
            {f === "spam" && <XCircle className="w-3 h-3" />}
            {f === "rejected" && <XCircle className="w-3 h-3" />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="text-gray-400">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search comments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((comment) => {
            const config = STATUS_CONFIG[comment.status];
            const StatusIcon = config.icon;
            return (
              <div key={comment.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${comment.reported && comment.status === "pending" ? "border-l-4 border-red-400" : ""}`}>
                <div className="flex items-start gap-3">
                  <img src={comment.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-400">{comment.email}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                      {comment.reported && (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <Flag className="w-3 h-3" />
                          {comment.reportReason}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{comment.content}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>On: {comment.articleTitle}</span>
                      <span>{comment.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {comment.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(comment.id, "approved")} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(comment.id, "rejected")} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(comment.id, "spam")} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Mark as spam">
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteComment(comment.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
