"use client";

import { useState, useEffect } from "react";
import {
  Mail, Send, Bell, Clock, CheckCircle, XCircle,
  Plus, Trash2, Edit3, Eye, BarChart3, Users,
  Settings, ToggleLeft, ToggleRight, RefreshCw,
  FileText, AlertTriangle, Zap, Globe, Server, Key, MessageSquare,
} from "lucide-react";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: "sent" | "draft" | "scheduled" | "failed";
  recipients: number;
  opened: number;
  clicked: number;
  sentAt?: string;
  scheduledFor?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  lastEdited: string;
  uses: number;
  category: string;
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  channels: string[];
  enabled: boolean;
  lastTriggered: string;
}

interface EmailLog {
  id: string;
  type: string;
  to: string;
  subject: string;
  provider: string;
  status: "sent" | "failed";
  error?: string;
  timestamp: string;
}

interface EmailConfigResponse {
  adminEmail: string;
  recoveryEmail: string;
  fromName: string;
  fromEmail: string;
  provider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpSecure: boolean;
  smtpPass?: string;
  resendConfigured: boolean;
  features: Record<string, boolean>;
}

const EMAIL_FEATURES: { key: string; label: string; desc: string }[] = [
  { key: "passwordReset", label: "Password Reset Emails", desc: "Send reset codes for forgotten passwords" },
  { key: "accountRecovery", label: "Account Recovery Emails", desc: "Send recovery codes for locked accounts" },
  { key: "loginOtp", label: "Login Verification (OTP)", desc: "Send one-time login verification codes" },
  { key: "twoFactor", label: "Two-Factor Authentication", desc: "Send 2FA codes when enabled" },
  { key: "securityAlert", label: "Security Alert Emails", desc: "Notify on suspicious activity" },
  { key: "newLogin", label: "New Login Notifications", desc: "Alert when a new device signs in" },
  { key: "passwordChange", label: "Password Change Confirmations", desc: "Confirm password changes by email" },
  { key: "emailChangeVerify", label: "Email Change Verification", desc: "Verify email address changes" },
  { key: "adminNotification", label: "Admin Notifications", desc: "Notify admins of system events" },
  { key: "contactNotification", label: "Contact Form Notifications", desc: "Forward contact form submissions" },
  { key: "registrationVerify", label: "Registration Verification", desc: "Verify new user registrations" },
  { key: "welcome", label: "Welcome Emails", desc: "Send welcome emails to new subscribers" },
  { key: "newsletter", label: "Newsletter Emails", desc: "Deliver newsletter campaigns" },
  { key: "systemError", label: "System Error Notifications", desc: "Alert on system failures" },
  { key: "backupMaintenance", label: "Backup & Maintenance", desc: "Notify about backup/maintenance tasks" },
];

const MOCK_CAMPAIGNS: EmailCampaign[] = [
  { id: "c1", name: "Weekly Digest", subject: "This Week in News - Top Stories", status: "sent", recipients: 12450, opened: 7890, clicked: 2340, sentAt: "2 hours ago" },
  { id: "c2", name: "Breaking: Climate Summit", subject: "BREAKING: Historic Climate Agreement Reached", status: "sent", recipients: 15670, opened: 12340, clicked: 5670, sentAt: "1 day ago" },
  { id: "c3", name: "Monthly Premium Newsletter", subject: "Premium Content Roundup - July 2026", status: "scheduled", recipients: 3456, opened: 0, clicked: 0, scheduledFor: "Aug 1, 2026" },
  { id: "c4", name: "Welcome Series - Day 1", subject: "Welcome to WorldLive!", status: "sent", recipients: 890, opened: 845, clicked: 567, sentAt: "3 days ago" },
  { id: "c5", name: "Re-engagement Campaign", subject: "We Miss You - Come Back for Premium Content", status: "draft", recipients: 0, opened: 0, clicked: 0 },
];

const MOCK_TEMPLATES: EmailTemplate[] = [
  { id: "t1", name: "Weekly Digest", subject: "This Week in News", lastEdited: "2 days ago", uses: 24, category: "Newsletter" },
  { id: "t2", name: "Breaking News Alert", subject: "BREAKING: {headline}", lastEdited: "1 week ago", uses: 12, category: "Alerts" },
  { id: "t3", name: "Welcome Email", subject: "Welcome to WorldLive, {name}!", lastEdited: "3 days ago", uses: 890, category: "Onboarding" },
  { id: "t4", name: "Premium Upgrade", subject: "Unlock Premium Content Today", lastEdited: "5 days ago", uses: 45, category: "Marketing" },
  { id: "t5", name: "Comment Reply", subject: "New reply to your comment", lastEdited: "1 day ago", uses: 234, category: "Engagement" },
];

const MOCK_RULES: NotificationRule[] = [
  { id: "r1", name: "Breaking News Alert", trigger: "New breaking news article published", channels: ["Email", "Push", "SMS"], enabled: true, lastTriggered: "2 hours ago" },
  { id: "r2", name: "Weekly Digest", trigger: "Every Monday at 8:00 AM", channels: ["Email"], enabled: true, lastTriggered: "3 days ago" },
  { id: "r3", name: "New Subscriber Welcome", trigger: "User subscribes to newsletter", channels: ["Email"], enabled: true, lastTriggered: "15 min ago" },
  { id: "r4", name: "Premium Content Alert", trigger: "New premium article published", channels: ["Push", "Email"], enabled: false, lastTriggered: "Never" },
];

export default function EmailNotifications() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [rules, setRules] = useState(MOCK_RULES);
  const [activeTab, setActiveTab] = useState<"campaigns" | "templates" | "rules" | "analytics" | "settings" | "email-system">("campaigns");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [newCampaign, setNewCampaign] = useState({ name: "", subject: "", recipients: "" });
  const [viewingCampaign, setViewingCampaign] = useState<EmailCampaign | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({ name: "", subject: "" });
  const [settings, setSettings] = useState({
    autoSubscribe: true,
    breakingPush: true,
    unsubscribeConfirm: true,
    dailySendLimit: "10,000",
  });
  const [emailConfig, setEmailConfig] = useState<EmailConfigResponse | null>(null);
  const [configDraft, setConfigDraft] = useState<EmailConfigResponse | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [testRecipient, setTestRecipient] = useState("");
  const [sendingType, setSendingType] = useState<string | null>(null);
  const [configSaving, setConfigSaving] = useState(false);

  const loadEmailConfig = async () => {
    try {
      const res = await fetch("/api/email?type=config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEmailConfig(data);
        setConfigDraft(data);
      }
    } catch {
      // ignore network errors
    }
  };

  const loadEmailLogs = async () => {
    try {
      const res = await fetch("/api/email?type=logs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEmailLogs(data.logs || []);
      }
    } catch {
      // ignore network errors
    }
  };

  useEffect(() => {
    loadEmailConfig();
    loadEmailLogs();
  }, []);

  const saveEmailConfig = async () => {
    if (!configDraft) return;
    setConfigSaving(true);
    try {
      const res = await fetch("/api/email/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configDraft),
      });
      const data = await res.json();
      if (res.ok) {
        showNotice("success", "Email configuration saved and persisted.");
        loadEmailConfig();
      } else {
        showNotice("error", data.error || "Failed to save email configuration");
      }
    } catch {
      showNotice("error", "Failed to save email configuration");
    } finally {
      setConfigSaving(false);
    }
  };

  const toggleFeature = (key: string) => {
    if (!configDraft) return;
    setConfigDraft({ ...configDraft, features: { ...configDraft.features, [key]: !configDraft.features[key] } });
  };

  const sendTestEmail = async (type: string) => {
    const to = testRecipient || emailConfig?.adminEmail || "";
    if (!to) {
      showNotice("error", "Set a test recipient email first");
      return;
    }
    setSendingType(type);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type === "test" ? "test" : type,
          to,
          ...(type === "security-alert" ? { details: "Test security alert triggered from admin panel." } : {}),
          ...(type === "new-login" ? { details: "Test new login notification from admin panel." } : {}),
          ...(type === "system-error" ? { component: "Test Component", error: "This is a test system error notification." } : {}),
          ...(type === "backup" ? { message: "This is a test backup & maintenance notification." } : {}),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotice("success", `Test email (${type}) sent successfully.`);
      } else {
        showNotice("error", data.error || `Failed to send test email (${type})`);
      }
      loadEmailLogs();
    } catch {
      showNotice("error", `Failed to send test email (${type})`);
    } finally {
      setSendingType(null);
    }
  };

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) {
      showNotice("error", "Campaign name and subject are required");
      return;
    }
    const campaign: EmailCampaign = {
      id: `c-${Date.now()}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      status: "draft",
      recipients: newCampaign.recipients ? parseInt(newCampaign.recipients) || 0 : 0,
      opened: 0,
      clicked: 0,
    };
    setCampaigns((prev) => [campaign, ...prev]);
    setNewCampaign({ name: "", subject: "", recipients: "" });
    setShowNewCampaign(false);
    showNotice("success", `Campaign "${campaign.name}" created as draft.`);
  };

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteCampaign = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (!confirm(`Delete campaign "${campaign?.name}"? This cannot be undone.`)) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showNotice("success", `Campaign "${campaign?.name}" deleted.`);
  };

  const openEditTemplate = (t: EmailTemplate) => {
    setEditingTemplate(t);
    setTemplateForm({ name: t.name, subject: t.subject });
  };

  const saveTemplate = () => {
    if (!editingTemplate || !templateForm.name.trim() || !templateForm.subject.trim()) return;
    setTemplates((prev) =>
      prev.map((t) => (t.id === editingTemplate.id ? { ...t, name: templateForm.name.trim(), subject: templateForm.subject.trim(), lastEdited: "Just now" } : t))
    );
    setEditingTemplate(null);
    showNotice("success", "Template updated.");
  };

  const deleteTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!confirm(`Delete template "${template?.name}"? This cannot be undone.`)) return;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showNotice("success", `Template "${template?.name}" deleted.`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-500" />
            Email & Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Campaigns, templates, and notification rules</p>
        </div>
        <button onClick={() => setShowNewCampaign(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm ${notice.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
          {notice.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          {notice.message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Send className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Emails Sent</span></div>
          <p className="text-2xl font-bold">28.4K</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Open Rate</span></div>
          <p className="text-2xl font-bold">68.4%</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-yellow-500" /><span className="text-xs text-gray-500">Click Rate</span></div>
          <p className="text-2xl font-bold">23.1%</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">Subscribers</span></div>
          <p className="text-2xl font-bold">15.9K</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        {[
          { key: "campaigns", label: "Campaigns", icon: Send },
          { key: "templates", label: "Templates", icon: FileText },
          { key: "rules", label: "Rules", icon: Bell },
          { key: "analytics", label: "Analytics", icon: BarChart3 },
          { key: "settings", label: "Settings", icon: Settings },
          { key: "email-system", label: "Email System", icon: Server },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "campaigns" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Recipients</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Clicked</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[300px]">{c.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${c.status === "sent" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : c.status === "scheduled" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : c.status === "draft" ? "bg-gray-100 dark:bg-gray-700 text-gray-500" : "bg-red-100 dark:bg-red-900/30 text-red-600"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{c.recipients > 0 ? c.recipients.toLocaleString() : "-"}</td>
                    <td className="px-4 py-3 text-sm">{c.opened > 0 ? `${((c.opened / c.recipients) * 100).toFixed(1)}%` : "-"}</td>
                    <td className="px-4 py-3 text-sm">{c.clicked > 0 ? `${((c.clicked / c.recipients) * 100).toFixed(1)}%` : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewingCampaign(c)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title="View details"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setViewingCampaign(c)} className="p-1.5 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteCampaign(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">{t.category}</span>
                <span className="text-xs text-gray-400">{t.uses} uses</span>
              </div>
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{t.subject}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Edited {t.lastEdited}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditTemplate(t)} className="p-1 text-gray-400 hover:text-blue-500" title="Edit template"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteTemplate(t.id)} className="p-1 text-gray-400 hover:text-red-500" title="Delete template"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "rules" && (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 flex items-center gap-4">
              <button onClick={() => toggleRule(rule.id)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${rule.enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? "translate-x-5" : ""}`} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{rule.name}</p>
                <p className="text-xs text-gray-400">{rule.trigger}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {rule.channels.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-medium">{ch}</span>
                ))}
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">{rule.lastTriggered}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
          <h3 className="font-semibold mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            {campaigns.filter((c) => c.status === "sent").map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{c.name}</span>
                  <span className="font-medium">{((c.opened / c.recipients) * 100).toFixed(1)}% open rate</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${(c.opened / c.recipients) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Auto-Subscribe New Users</p><p className="text-xs text-gray-400">Automatically add new users to newsletter</p></div>
            <button onClick={() => setSettings({ ...settings, autoSubscribe: !settings.autoSubscribe })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.autoSubscribe ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoSubscribe ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Breaking News Push</p><p className="text-xs text-gray-400">Send push notifications for breaking news</p></div>
            <button onClick={() => setSettings({ ...settings, breakingPush: !settings.breakingPush })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.breakingPush ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.breakingPush ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Unsubscribe Confirmation</p><p className="text-xs text-gray-400">Require email confirmation to unsubscribe</p></div>
            <button onClick={() => setSettings({ ...settings, unsubscribeConfirm: !settings.unsubscribeConfirm })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.unsubscribeConfirm ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.unsubscribeConfirm ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Daily Send Limit</p><p className="text-xs text-gray-400">Maximum emails per day</p></div>
            <select value={settings.dailySendLimit} onChange={(e) => setSettings({ ...settings, dailySendLimit: e.target.value })} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"><option>10,000</option><option>25,000</option><option>50,000</option><option>Unlimited</option></select>
          </div>
        </div>
      )}

      {activeTab === "email-system" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Key className="w-4 h-4 text-blue-500" /> Email Delivery Configuration</h3>
                <p className="text-xs text-gray-400 mt-0.5">SMTP / provider settings, admin & recovery email, persisted across restarts</p>
              </div>
              <button onClick={saveEmailConfig} disabled={configSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                {configSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save Config
              </button>
            </div>

            {!emailConfig && (
              <div className="flex items-center gap-2 text-sm text-gray-500"><RefreshCw className="w-4 h-4 animate-spin" /> Loading email configuration...</div>
            )}

            {emailConfig && configDraft && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Administrator Email</label>
                    <input value={configDraft.adminEmail} onChange={(e) => setConfigDraft({ ...configDraft, adminEmail: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    <p className="text-[11px] text-gray-400 mt-1">Primary admin account and default notification recipient</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Permanent Recovery Email</label>
                    <input value={configDraft.recoveryEmail} onChange={(e) => setConfigDraft({ ...configDraft, recoveryEmail: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    <p className="text-[11px] text-gray-400 mt-1">Used for account recovery and password reset</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">From Name</label>
                    <input value={configDraft.fromName} onChange={(e) => setConfigDraft({ ...configDraft, fromName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">From Email</label>
                    <input value={configDraft.fromEmail} onChange={(e) => setConfigDraft({ ...configDraft, fromEmail: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Provider</label>
                  <select value={configDraft.provider} onChange={(e) => setConfigDraft({ ...configDraft, provider: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
                    <option value="resend">Resend (API key)</option>
                    <option value="smtp">SMTP Server</option>
                  </select>
                </div>

                {configDraft.provider === "smtp" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">SMTP Host</label>
                      <input value={configDraft.smtpHost} onChange={(e) => setConfigDraft({ ...configDraft, smtpHost: e.target.value })} placeholder="smtp.gmail.com" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">SMTP Port</label>
                      <input type="number" value={configDraft.smtpPort} onChange={(e) => setConfigDraft({ ...configDraft, smtpPort: parseInt(e.target.value) || 587 })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">SMTP Username</label>
                      <input value={configDraft.smtpUser} onChange={(e) => setConfigDraft({ ...configDraft, smtpUser: e.target.value })} placeholder="your@email.com" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">SMTP Password / App Password</label>
                      <input type="password" onChange={(e) => setConfigDraft({ ...configDraft, smtpPass: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium">Use Secure Connection (TLS/SSL)</span>
                      <button onClick={() => setConfigDraft({ ...configDraft, smtpSecure: !configDraft.smtpSecure })} className={`relative w-11 h-6 rounded-full transition-colors ${configDraft.smtpSecure ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${configDraft.smtpSecure ? "translate-x-5" : ""}`} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Resend API Key</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {emailConfig.resendConfigured ? "Configured (key stored in environment)" : "Not configured"}
                        </p>
                      </div>
                      <Server className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <h3 className="font-semibold mb-1">Email Feature Toggles</h3>
            <p className="text-xs text-gray-400 mb-4">Enable or disable each email feature type</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EMAIL_FEATURES.map((f) => (
                <div key={f.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                  <button onClick={() => toggleFeature(f.key)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${configDraft?.features?.[f.key] ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${configDraft?.features?.[f.key] ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Send className="w-4 h-4 text-green-500" /> Test Email Delivery</h3>
                <p className="text-xs text-gray-400 mt-0.5">Send a test of each email type to verify delivery</p>
              </div>
              <div className="flex items-center gap-2">
                <input value={testRecipient} onChange={(e) => setTestRecipient(e.target.value)} placeholder={emailConfig?.adminEmail || "recipient@example.com"} className="w-64 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: "test", label: "System Test" },
                { key: "password-reset", label: "Password Reset" },
                { key: "account-recovery", label: "Account Recovery" },
                { key: "login-otp", label: "Login OTP" },
                { key: "2fa", label: "2FA Code" },
                { key: "security-alert", label: "Security Alert" },
                { key: "new-login", label: "New Login" },
                { key: "password-changed", label: "Password Changed" },
                { key: "email-change", label: "Email Change Verify" },
                { key: "admin-notification", label: "Admin Notification" },
                { key: "contact", label: "Contact Form" },
                { key: "registration-verify", label: "Registration Verify" },
                { key: "welcome", label: "Welcome" },
                { key: "newsletter", label: "Newsletter" },
                { key: "system-error", label: "System Error" },
                { key: "backup", label: "Backup & Maintenance" },
              ].map((t) => (
                <button key={t.key} onClick={() => sendTestEmail(t.key)} disabled={sendingType === t.key} className="flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium disabled:opacity-50">
                  <span>{t.label}</span>
                  {sendingType === t.key ? <RefreshCw className="w-4 h-4 animate-spin text-blue-500" /> : <Send className="w-4 h-4 text-gray-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Delivery Log</h3>
              <button onClick={loadEmailLogs} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
            </div>
            {emailLogs.length === 0 ? (
              <p className="text-sm text-gray-400">No delivery attempts logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left text-xs font-medium text-gray-500 uppercase">
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">To</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Provider</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {emailLogs.slice(0, 25).map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2 text-xs font-medium">{log.type}</td>
                        <td className="px-4 py-2 text-xs">{log.to}</td>
                        <td className="px-4 py-2 text-xs truncate max-w-[240px]">{log.subject}</td>
                        <td className="px-4 py-2 text-xs">{log.provider}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${log.status === "sent" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {viewingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewingCampaign(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div>
                <h3 className="font-semibold">Campaign Details</h3>
                <p className="text-xs text-gray-400 mt-0.5">{viewingCampaign.name}</p>
              </div>
              <button onClick={() => setViewingCampaign(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subject</span><span className="font-medium text-right">{viewingCampaign.subject}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium capitalize">{viewingCampaign.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Recipients</span><span className="font-medium">{viewingCampaign.recipients.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Opened</span><span className="font-medium">{viewingCampaign.opened.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Clicked</span><span className="font-medium">{viewingCampaign.clicked.toLocaleString()}</span></div>
              {viewingCampaign.sentAt && <div className="flex justify-between"><span className="text-gray-500">Sent</span><span className="font-medium">{viewingCampaign.sentAt}</span></div>}
              {viewingCampaign.scheduledFor && <div className="flex justify-between"><span className="text-gray-500">Scheduled</span><span className="font-medium">{viewingCampaign.scheduledFor}</span></div>}
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700/50">
              <button onClick={() => setViewingCampaign(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditingTemplate(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div>
                <h3 className="font-semibold">Edit Template</h3>
                <p className="text-xs text-gray-400 mt-0.5">Update template name and subject</p>
              </div>
              <button onClick={() => setEditingTemplate(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Template Name</label>
                <input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Subject</label>
                <input value={templateForm.subject} onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700/50">
              <button onClick={() => setEditingTemplate(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
              <button onClick={saveTemplate} disabled={!templateForm.name.trim() || !templateForm.subject.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">Save Template</button>
            </div>
          </div>
        </div>
      )}

      {showNewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowNewCampaign(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div>
                <h3 className="font-semibold">New Campaign</h3>
                <p className="text-xs text-gray-400 mt-0.5">Create a new email campaign</p>
              </div>
              <button onClick={() => setShowNewCampaign(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="e.g. Weekly Digest" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Subject</label>
                <input value={newCampaign.subject} onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })} placeholder="e.g. This Week in News" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Recipients (optional)</label>
                <input type="number" min="0" value={newCampaign.recipients} onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })} placeholder="e.g. 5000" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700/50">
              <button onClick={() => setShowNewCampaign(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
              <button onClick={createCampaign} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
