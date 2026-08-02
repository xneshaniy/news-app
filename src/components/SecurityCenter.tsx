"use client";

import { useState } from "react";
import {
  Shield, Lock, Key, Eye, EyeOff, CheckCircle, XCircle,
  Smartphone, Globe, Clock, AlertTriangle, Ban,
  Download, RefreshCw, Search, Filter, User,
  LogIn, LogOut, Settings, Fingerprint, ShieldAlert,
} from "lucide-react";

interface LoginEntry {
  id: string;
  user: string;
  email: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  time: string;
  success: boolean;
  twoFactor: boolean;
}

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  time: string;
  severity: "info" | "warning" | "critical";
}

interface IPEntry {
  ip: string;
  location: string;
  requests: number;
  lastSeen: string;
  status: "allowed" | "blocked" | "monitoring";
  country: string;
}

const MOCK_LOGINS: LoginEntry[] = [
  { id: "l1", user: "Sarah Chen", email: "sarah@globalnews.com", ip: "192.168.1.100", location: "New York, US", device: "Windows 11", browser: "Chrome 128", time: "2 min ago", success: true, twoFactor: true },
  { id: "l2", user: "Marcus Johnson", email: "marcus@globalnews.com", ip: "10.0.0.55", location: "London, UK", device: "macOS 15", browser: "Safari 18", time: "15 min ago", success: true, twoFactor: true },
  { id: "l3", user: "Unknown", email: "hacker@evil.com", ip: "203.0.113.99", location: "Berlin, DE", device: "Linux", browser: "Firefox 128", time: "1 hour ago", success: false, twoFactor: false },
  { id: "l4", user: "Emma Wilson", email: "emma@writers.co", ip: "172.16.0.22", location: "Toronto, CA", device: "Windows 11", browser: "Edge 128", time: "1 hour ago", success: true, twoFactor: false },
  { id: "l5", user: "Tom Anderson", email: "tom@spam.com", ip: "192.0.2.33", location: "Unknown", device: "Linux", browser: "Chrome 128", time: "3 hours ago", success: false, twoFactor: false },
  { id: "l6", user: "David Park", email: "david@news.io", ip: "198.51.100.44", location: "Seoul, KR", device: "macOS 15", browser: "Chrome 128", time: "5 hours ago", success: true, twoFactor: false },
];

const MOCK_AUDIT: AuditEntry[] = [
  { id: "a1", user: "Sarah Chen", action: "Updated site settings", target: "Website Configuration", ip: "192.168.1.100", time: "10 min ago", severity: "info" },
  { id: "a2", user: "Marcus Johnson", action: "Deleted user account", target: "Tom Anderson", ip: "10.0.0.55", time: "30 min ago", severity: "warning" },
  { id: "a3", user: "Unknown", action: "Failed login attempt (5x)", target: "Admin account", ip: "203.0.113.99", time: "1 hour ago", severity: "critical" },
  { id: "a4", user: "Lisa Rodriguez", action: "Approved 12 comments", target: "Comment Moderation", ip: "198.51.100.77", time: "2 hours ago", severity: "info" },
  { id: "a5", user: "Sarah Chen", action: "Exported user data", target: "User Management", ip: "192.168.1.100", time: "3 hours ago", severity: "warning" },
  { id: "a6", user: "System", action: "Auto-backup completed", target: "Database", ip: "localhost", time: "6 hours ago", severity: "info" },
];

const MOCK_IPS: IPEntry[] = [
  { ip: "192.168.1.100", location: "New York, US", requests: 1234, lastSeen: "2 min ago", status: "allowed", country: "🇺🇸" },
  { ip: "10.0.0.55", location: "London, UK", requests: 890, lastSeen: "15 min ago", status: "allowed", country: "🇬🇧" },
  { ip: "203.0.113.99", location: "Berlin, DE", requests: 567, lastSeen: "1 hour ago", status: "blocked", country: "🇩🇪" },
  { ip: "198.51.100.44", location: "Seoul, KR", requests: 345, lastSeen: "5 hours ago", status: "allowed", country: "🇰🇷" },
  { ip: "192.0.2.33", location: "Unknown", requests: 23, lastSeen: "3 hours ago", status: "monitoring", country: "❓" },
];

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState<"logins" | "audit" | "ip" | "2fa" | "settings">("logins");
  const [search, setSearch] = useState("");
  const [ips, setIps] = useState(MOCK_IPS);

  const toggleIPStatus = (ip: string) => {
    setIps((prev) => prev.map((e) => e.ip === ip ? { ...e, status: e.status === "blocked" ? "allowed" : "blocked" } : e));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Security Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Authentication, monitoring, and audit logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><LogIn className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Successful Logins</span></div>
          <p className="text-2xl font-bold">{MOCK_LOGINS.filter((l) => l.success).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Ban className="w-4 h-4 text-red-500" /><span className="text-xs text-gray-500">Failed Logins</span></div>
          <p className="text-2xl font-bold">{MOCK_LOGINS.filter((l) => !l.success).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><ShieldAlert className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500">Blocked IPs</span></div>
          <p className="text-2xl font-bold">{ips.filter((i) => i.status === "blocked").length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Fingerprint className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">2FA Enabled</span></div>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        {[
          { key: "logins", label: "Login History", icon: LogIn },
          { key: "audit", label: "Audit Logs", icon: Eye },
          { key: "ip", label: "IP Monitoring", icon: Globe },
          { key: "2fa", label: "2FA", icon: Key },
          { key: "settings", label: "Settings", icon: Settings },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "logins" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">2FA</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {MOCK_LOGINS.map((login) => (
                  <tr key={login.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{login.user}</p>
                      <p className="text-xs text-gray-400">{login.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">{login.ip}</td>
                    <td className="px-4 py-3 text-xs">{login.location}</td>
                    <td className="px-4 py-3 text-xs">{login.device} / {login.browser}</td>
                    <td className="px-4 py-3">{login.twoFactor ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${login.success ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"}`}>
                        {login.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{login.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {MOCK_AUDIT.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full ${entry.severity === "critical" ? "bg-red-500" : entry.severity === "warning" ? "bg-yellow-500" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><span className="font-medium">{entry.user}</span> {entry.action}</p>
                  <p className="text-xs text-gray-400">Target: {entry.target} · IP: {entry.ip}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${entry.severity === "critical" ? "bg-red-100 dark:bg-red-900/30 text-red-600" : entry.severity === "warning" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                  {entry.severity}
                </span>
                <span className="text-xs text-gray-400 shrink-0">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "ip" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Requests</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Seen</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {ips.map((entry) => (
                  <tr key={entry.ip} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono">{entry.ip}</td>
                    <td className="px-4 py-3 text-sm">{entry.country} {entry.location}</td>
                    <td className="px-4 py-3 text-sm">{entry.requests}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${entry.status === "allowed" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : entry.status === "blocked" ? "bg-red-100 dark:bg-red-900/30 text-red-600" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{entry.lastSeen}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleIPStatus(entry.ip)} className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${entry.status === "blocked" ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                        {entry.status === "blocked" ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "2fa" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <h3 className="font-semibold mb-4">Two-Factor Authentication Status</h3>
            <div className="space-y-3">
              {[
                { user: "Sarah Chen", enabled: true, method: "Authenticator App" },
                { user: "Marcus Johnson", enabled: true, method: "Authenticator App" },
                { user: "Lisa Rodriguez", enabled: true, method: "SMS" },
                { user: "Emma Wilson", enabled: false, method: "N/A" },
                { user: "David Park", enabled: false, method: "N/A" },
              ].map((item) => (
                <div key={item.user} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{item.user.split(" ").map((n) => n[0]).join("")}</div>
                    <div>
                      <p className="font-medium text-sm">{item.user}</p>
                      <p className="text-xs text-gray-400">{item.enabled ? item.method : "Not configured"}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${item.enabled ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                    {item.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Enforce 2FA for Admins</p><p className="text-xs text-gray-400">Require all admin users to enable 2FA</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Login Rate Limiting</p><p className="text-xs text-gray-400">Limit login attempts to 5 per minute per IP</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Auto-Block Suspicious IPs</p><p className="text-xs text-gray-400">Automatically block IPs with 10+ failed attempts</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Session Timeout</p><p className="text-xs text-gray-400">Auto-logout after 30 minutes of inactivity</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Email Login Notifications</p><p className="text-xs text-gray-400">Notify admins of new login from unknown device</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Audit Log Retention</p><p className="text-xs text-gray-400">Keep audit logs for 90 days</p></div>
            <select className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"><option>30 days</option><option>90 days</option><option>1 year</option><option>Forever</option></select>
          </div>
        </div>
      )}
    </div>
  );
}
