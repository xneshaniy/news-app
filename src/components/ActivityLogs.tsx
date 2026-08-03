"use client";

import { useState } from "react";
import { Search, User, FileText, Settings, Shield, Eye, CheckCircle, AlertCircle, Info, XCircle, Download } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  category: "content" | "user" | "system" | "security" | "monetization";
  detail: string;
  user: string;
  ip: string;
  timestamp: string;
  severity: "success" | "warning" | "info" | "error";
}

const MOCK_LOGS: LogEntry[] = [
  { id: "l1", action: "Article Published", category: "content", detail: "AI Breakthrough: New Model Achieves Human-Level Reasoning", user: "Sarah Chen", ip: "192.168.1.100", timestamp: "2 min ago", severity: "success" },
  { id: "l2", action: "Comment Approved", category: "content", detail: "Comment by John Doe on 'Climate Summit'", user: "James Wilson", ip: "192.168.1.101", timestamp: "5 min ago", severity: "success" },
  { id: "l3", action: "Spam Detected", category: "security", detail: "Bot comment flagged on 'Market Update'", user: "System", ip: "0.0.0.0", timestamp: "8 min ago", severity: "warning" },
  { id: "l4", action: "User Login", category: "user", detail: "Maria Garcia logged in from Chrome/Windows", user: "Maria Garcia", ip: "192.168.1.102", timestamp: "12 min ago", severity: "info" },
  { id: "l5", action: "Ad Campaign Created", category: "monetization", detail: "New banner ad 'Summer Sale' created", user: "Sarah Chen", ip: "192.168.1.100", timestamp: "22 min ago", severity: "info" },
  { id: "l6", action: "Settings Updated", category: "system", detail: "SEO settings modified - meta description changed", user: "Sarah Chen", ip: "192.168.1.100", timestamp: "1 hour ago", severity: "info" },
  { id: "l7", action: "Backup Failed", category: "system", detail: "Automatic backup could not complete - storage full", user: "System", ip: "0.0.0.0", timestamp: "2 hours ago", severity: "error" },
  { id: "l8", action: "Role Changed", category: "security", detail: "David Kim promoted from Author to Editor", user: "Sarah Chen", ip: "192.168.1.100", timestamp: "3 hours ago", severity: "warning" },
  { id: "l9", action: "Newsletter Sent", category: "monetization", detail: "Weekly Tech Roundup sent to 4,521 subscribers", user: "James Wilson", ip: "192.168.1.101", timestamp: "4 hours ago", severity: "success" },
  { id: "l10", action: "Article Deleted", category: "content", detail: "Duplicate article removed: 'Stock Update'", user: "James Wilson", ip: "192.168.1.101", timestamp: "5 hours ago", severity: "warning" },
];

const SEVERITY_CONFIG = {
  success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  warning: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  content: <FileText className="w-4 h-4 text-blue-500" />,
  user: <User className="w-4 h-4 text-purple-500" />,
  system: <Settings className="w-4 h-4 text-gray-500" />,
  security: <Shield className="w-4 h-4 text-red-500" />,
  monetization: <Eye className="w-4 h-4 text-green-500" />,
};

export default function ActivityLogs() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filtered = logs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const categoryCounts = {
    all: logs.length,
    content: logs.filter((l) => l.category === "content").length,
    user: logs.filter((l) => l.category === "user").length,
    system: logs.filter((l) => l.category === "system").length,
    security: logs.filter((l) => l.category === "security").length,
    monetization: logs.filter((l) => l.category === "monetization").length,
  };

  const exportLogs = () => {
    const csv = ["Action,Category,Detail,User,IP,Severity,Timestamp"]
      .concat(
        filtered.map((l) =>
          [l.action, l.category, l.detail, l.user, l.ip, l.severity, l.timestamp]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track all system and user activities</p>
        </div>
        <button onClick={exportLogs} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`p-3 rounded-xl border text-center transition-all ${filterCategory === cat ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
          >
            <div className="text-lg font-bold">{count}</div>
            <div className="text-xs text-gray-500 capitalize">{cat}</div>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none" />
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {["all", "success", "warning", "info", "error"].map((s) => (
              <button key={s} onClick={() => setFilterSeverity(s)} className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${filterSeverity === s ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((log) => {
            const config = SEVERITY_CONFIG[log.severity];
            const Icon = config.icon;
            return (
              <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="mt-0.5">{CATEGORY_ICONS[log.category]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{log.action}</span>
                    <span className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${config.bg} ${config.color}`}>
                      <Icon className="w-2.5 h-2.5" />
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{log.detail}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                    <span>{log.user}</span>
                    <span>{log.ip}</span>
                    <span>{log.timestamp}</span>
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
