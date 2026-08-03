"use client";

import { useState } from "react";
import { Plus, Send, Trash2, Search, Users, BarChart3, Clock, Eye, Edit3, Calendar, X, FileText } from "lucide-react";

interface Newsletter {
  id: string;
  subject: string;
  preview: string;
  content: string;
  status: "draft" | "scheduled" | "sent";
  subscribers: number;
  openRate: number;
  clickRate: number;
  sentAt?: string;
  scheduledFor?: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
}

const INITIAL_NEWSLETTERS: Newsletter[] = [
  { id: "n1", subject: "Weekly Tech Roundup - AI Breakthroughs", preview: "This week's top tech stories including GPT-5 announcement...", content: "", status: "sent", subscribers: 4521, openRate: 45.2, clickRate: 12.3, sentAt: "2 hours ago" },
  { id: "n2", subject: "Breaking: Global Climate Agreement Signed", preview: "World leaders have signed a historic climate agreement...", content: "", status: "sent", subscribers: 4521, openRate: 62.1, clickRate: 18.7, sentAt: "2 days ago" },
  { id: "n3", subject: "Market Weekly: Record Highs Continue", preview: "Stock markets reached new all-time highs this week...", content: "", status: "draft", subscribers: 0, openRate: 0, clickRate: 0 },
  { id: "n4", subject: "Upcoming: Space Exploration Special", preview: "Next week we cover the latest in space exploration...", content: "", status: "scheduled", subscribers: 4521, openRate: 0, clickRate: 0, scheduledFor: "2026-08-01 08:00" },
];

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: "s1", email: "reader1@example.com", name: "Alex Thompson", subscribedAt: "2 months ago", status: "active" },
  { id: "s2", email: "reader2@example.com", name: "Sam Wilson", subscribedAt: "1 month ago", status: "active" },
  { id: "s3", email: "reader3@example.com", name: "Jordan Lee", subscribedAt: "3 weeks ago", status: "active" },
  { id: "s4", email: "former@example.com", name: "Casey Morgan", subscribedAt: "4 months ago", status: "unsubscribed" },
  { id: "s5", email: "reader5@example.com", name: "Riley Davis", subscribedAt: "1 week ago", status: "active" },
];

const STATUS_CONFIG = {
  draft: { color: "bg-gray-100 dark:bg-gray-700 text-gray-600", label: "Draft" },
  scheduled: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", label: "Scheduled" },
  sent: { color: "bg-green-100 dark:bg-green-900/30 text-green-600", label: "Sent" },
};

export default function NewsletterManagement() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(INITIAL_NEWSLETTERS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [tab, setTab] = useState<"campaigns" | "subscribers">("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [showAddSubscriber, setShowAddSubscriber] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "newsletter" | "subscriber"; id: string } | null>(null);
  const [composeData, setComposeData] = useState({ subject: "", preview: "", content: "" });
  const [newSubscriber, setNewSubscriber] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeSubscribers = subscribers.filter((s) => s.status === "active").length;

  const createNewsletter = () => {
    if (!composeData.subject.trim()) return;
    if (editingId) {
      setNewsletters((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? { ...n, subject: composeData.subject.trim(), preview: composeData.preview.trim() || composeData.subject.trim(), content: composeData.content }
            : n
        )
      );
    } else {
      const nl: Newsletter = {
        id: `n-${Date.now()}`,
        subject: composeData.subject.trim(),
        preview: composeData.preview.trim() || composeData.subject.trim(),
        content: composeData.content,
        status: "draft",
        subscribers: 0,
        openRate: 0,
        clickRate: 0,
      };
      setNewsletters((prev) => [nl, ...prev]);
    }
    setComposeData({ subject: "", preview: "", content: "" });
    setEditingId(null);
    setShowCompose(false);
  };

  const editNewsletter = (nl: Newsletter) => {
    setEditingId(nl.id);
    setComposeData({ subject: nl.subject, preview: nl.preview, content: nl.content });
    setShowCompose(true);
  };

  const sendNewsletter = (id: string) => {
    setNewsletters((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "sent", subscribers: activeSubscribers, sentAt: "Just now" } : n
      )
    );
  };

  const scheduleNewsletter = (id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    setNewsletters((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "scheduled", subscribers: activeSubscribers, scheduledFor: tomorrow.toISOString().slice(0, 16).replace("T", " ") } : n
      )
    );
  };

  const deleteItem = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "newsletter") {
      setNewsletters((prev) => prev.filter((n) => n.id !== confirmDelete.id));
    } else {
      setSubscribers((prev) => prev.filter((s) => s.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
  };

  const addSubscriber = () => {
    if (!newSubscriber.email.trim() || !newSubscriber.name.trim()) return;
    const sub: Subscriber = {
      id: `s-${Date.now()}`,
      email: newSubscriber.email.trim(),
      name: newSubscriber.name.trim(),
      subscribedAt: "Just now",
      status: "active",
    };
    setSubscribers((prev) => [sub, ...prev]);
    setNewSubscriber({ name: "", email: "" });
    setShowAddSubscriber(false);
  };

  const filteredSubscribers = subscribers.filter(
    (s) => s.email.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Newsletters</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage email campaigns and subscribers</p>
        </div>
        <div className="flex gap-2">
          {tab === "subscribers" && (
            <button onClick={() => setShowAddSubscriber(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Subscriber
            </button>
          )}
          <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCompose(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editingId ? "Edit Campaign" : "Create Campaign"}</h2>
              <button onClick={() => setShowCompose(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Newsletter subject line..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preview Text</label>
                <input
                  type="text"
                  value={composeData.preview}
                  onChange={(e) => setComposeData({ ...composeData, preview: e.target.value })}
                  placeholder="Brief preview shown in email client..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                  placeholder="Write your newsletter content here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-500">
                <p>This will be sent to <strong>{activeSubscribers}</strong> active subscribers.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCompose(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={createNewsletter} disabled={!composeData.subject.trim()} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {editingId ? "Save Changes" : "Save Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddSubscriber(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Add Subscriber</h2>
              <button onClick={() => setShowAddSubscriber(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddSubscriber(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={addSubscriber} disabled={!newSubscriber.name.trim() || !newSubscriber.email.trim()} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Add Subscriber
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
                <h3 className="font-bold">Delete {confirmDelete.type === "newsletter" ? "Campaign" : "Subscriber"}</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={deleteItem} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{activeSubscribers}</p>
              <p className="text-xs text-gray-500">Active Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Send className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">{newsletters.filter((n) => n.status === "sent").length}</p>
              <p className="text-xs text-gray-500">Campaigns Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><BarChart3 className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold">
                {newsletters.filter((n) => n.status === "sent").length > 0
                  ? (newsletters.filter((n) => n.status === "sent").reduce((sum, n) => sum + n.openRate, 0) / newsletters.filter((n) => n.status === "sent").length).toFixed(1)
                  : "0.0"}%
              </p>
              <p className="text-xs text-gray-500">Avg Open Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        {(["campaigns", "subscribers"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t === "campaigns" ? `Campaigns (${newsletters.length})` : `Subscribers (${activeSubscribers})`}
          </button>
        ))}
      </div>

      {tab === "campaigns" ? (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {newsletters.map((newsletter) => {
              const config = STATUS_CONFIG[newsletter.status];
              return (
                <div key={newsletter.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{newsletter.subject}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{newsletter.preview}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        {newsletter.sentAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{newsletter.sentAt}</span>}
                        {newsletter.scheduledFor && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{newsletter.scheduledFor}</span>}
                        {newsletter.status === "sent" && (
                          <>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{newsletter.openRate}% opens</span>
                            <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{newsletter.clickRate}% clicks</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {newsletter.status === "draft" && (
                        <>
                          <button onClick={() => sendNewsletter(newsletter.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                            <Send className="w-3 h-3" />
                            Send Now
                          </button>
                          <button onClick={() => scheduleNewsletter(newsletter.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <Calendar className="w-3 h-3" />
                            Schedule
                          </button>
                        </>
                      )}
                      <button onClick={() => editNewsletter(newsletter)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmDelete({ type: "newsletter", id: newsletter.id })} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {newsletters.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No campaigns yet. Create your first one!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input placeholder="Search subscribers by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredSubscribers.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {sub.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{sub.name}</p>
                  <p className="text-xs text-gray-400">{sub.email}</p>
                </div>
                <span className="text-xs text-gray-400">{sub.subscribedAt}</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${sub.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                  {sub.status}
                </span>
                <button onClick={() => setConfirmDelete({ type: "subscriber", id: sub.id })} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {filteredSubscribers.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No subscribers found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
