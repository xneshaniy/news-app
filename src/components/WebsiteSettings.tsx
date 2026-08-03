"use client";

import { useState } from "react";
import { Globe, Palette, Save, Check, Code, Server, Database, Zap, Sun, Moon } from "lucide-react";

interface WebsiteSettings {
  siteName: string;
  siteTagline: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  darkModeDefault: boolean;
  language: string;
  timezone: string;
  postsPerPage: number;
  commentsEnabled: boolean;
  moderationRequired: boolean;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  cacheEnabled: boolean;
  cacheTtl: number;
  maxUploadSize: number;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  customCss: string;
  customJs: string;
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  siteName: "WorldLive",
  siteTagline: "World News from Every Country",
  logo: "/logo.png",
  favicon: "/favicon.png",
  primaryColor: "#2563eb",
  accentColor: "#7c3aed",
  darkModeDefault: true,
  language: "en",
  timezone: "UTC",
  postsPerPage: 20,
  commentsEnabled: true,
  moderationRequired: true,
  allowRegistration: true,
  maintenanceMode: false,
  cacheEnabled: true,
  cacheTtl: 600,
  maxUploadSize: 10,
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  customCss: "",
  customJs: "",
};

const TIMEZONES = ["UTC", "US/Eastern", "US/Central", "US/Pacific", "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Australia/Sydney"];

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}>
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function WebsiteSettingsPanel() {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"general" | "appearance" | "content" | "advanced" | "system">("general");

  const saveSettings = () => {
    localStorage.setItem("website-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Website Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your website</p>
        </div>
        <button onClick={saveSettings} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 overflow-x-auto">
        {[
          { key: "general", label: "General", icon: Globe },
          { key: "appearance", label: "Appearance", icon: Palette },
          { key: "content", label: "Content", icon: FileText },
          { key: "advanced", label: "Advanced", icon: Code },
          { key: "system", label: "System", icon: Server },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${tab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
        {tab === "general" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input value={settings.siteTagline} onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <input value={settings.logo} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Favicon URL</label>
                <input value={settings.favicon} onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
                  <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option><option value="zh">Chinese</option><option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm">
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {tab === "appearance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer" />
                  <input value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer" />
                  <input value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                {settings.darkModeDefault ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="text-sm font-medium">Default to Dark Mode</p>
                  <p className="text-xs text-gray-400">New visitors see dark theme by default</p>
                </div>
              </div>
              <ToggleSwitch value={settings.darkModeDefault} onChange={(v) => setSettings({ ...settings, darkModeDefault: v })} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["#2563eb", "#7c3aed", "#059669", "#dc2626", "#ea580c", "#0891b2"].map((color) => (
                <button key={color} onClick={() => setSettings({ ...settings, primaryColor: color })} className={`h-16 rounded-xl border-2 transition-all ${settings.primaryColor === color ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800" : "border-transparent hover:border-gray-300"}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        )}

        {tab === "content" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Posts Per Page</label>
                <input type="number" value={settings.postsPerPage} onChange={(e) => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) || 20 })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
            </div>
            {[
              { key: "commentsEnabled" as const, label: "Enable Comments", desc: "Allow readers to comment on articles" },
              { key: "moderationRequired" as const, label: "Comment Moderation", desc: "Require approval before comments appear" },
              { key: "allowRegistration" as const, label: "User Registration", desc: "Allow new user signups" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <ToggleSwitch value={settings[item.key]} onChange={(v) => setSettings({ ...settings, [item.key]: v })} />
              </div>
            ))}
          </div>
        )}

        {tab === "advanced" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Custom CSS</label>
              <textarea value={settings.customCss} onChange={(e) => setSettings({ ...settings, customCss: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono h-32 resize-none" placeholder="/* Custom CSS */" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Custom JavaScript</label>
              <textarea value={settings.customJs} onChange={(e) => setSettings({ ...settings, customJs: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono h-32 resize-none" placeholder="// Custom JS" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Host</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input value={settings.smtpHost} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} placeholder="smtp.example.com" className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                <input value={settings.smtpPort} onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })} placeholder="587" className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                <input value={settings.smtpUser} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} placeholder="Username" className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
            </div>
          </div>
        )}

        {tab === "system" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-gray-400">Show maintenance page to visitors</p>
                </div>
              </div>
              <ToggleSwitch value={settings.maintenanceMode} onChange={(v) => setSettings({ ...settings, maintenanceMode: v })} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Page Cache</p>
                  <p className="text-xs text-gray-400">Cache pages for faster loading</p>
                </div>
              </div>
              <ToggleSwitch value={settings.cacheEnabled} onChange={(v) => setSettings({ ...settings, cacheEnabled: v })} />
            </div>
            {settings.cacheEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">Cache TTL (seconds)</label>
                <input type="number" value={settings.cacheTtl} onChange={(e) => setSettings({ ...settings, cacheTtl: parseInt(e.target.value) || 600 })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Max Upload Size (MB)</label>
              <input type="number" value={settings.maxUploadSize} onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) || 10 })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
  );
}
