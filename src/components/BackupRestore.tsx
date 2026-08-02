"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Check, AlertTriangle, Database, Trash2 } from "lucide-react";

const STORAGE_KEYS = [
  "favorites", "bookmarks", "reading-history", "user",
  "rssFeeds", "featuredStories", "newsletter-subscriptions",
  "readArticles", "pwa-install-dismissed",
];

interface BackupData {
  version: string;
  timestamp: string;
  data: Record<string, string>;
}

export default function BackupRestore() {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "importing">("idle");
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [dataSize, setDataSize] = useState("0 B");
  const [counts, setCounts] = useState({ favorites: 0, bookmarks: 0, history: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let total = 0;
    for (const key of STORAGE_KEYS) {
      const value = localStorage.getItem(key);
      if (value) total += value.length;
    }
    if (total < 1024) setDataSize(`${total} B`);
    else if (total < 1024 * 1024) setDataSize(`${(total / 1024).toFixed(1)} KB`);
    else setDataSize(`${(total / (1024 * 1024)).toFixed(1)} MB`);

    setCounts({
      favorites: JSON.parse(localStorage.getItem("favorites") || "[]").length,
      bookmarks: JSON.parse(localStorage.getItem("bookmarks") || "[]").length,
      history: JSON.parse(localStorage.getItem("reading-history") || "[]").length,
    });
  }, [status]);

  const exportData = () => {
    const data: Record<string, string> = {};
    let totalSize = 0;

    for (const key of STORAGE_KEYS) {
      const value = localStorage.getItem(key);
      if (value) {
        data[key] = value;
        totalSize += value.length;
      }
    }

    const backup: BackupData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      data,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `globalnews-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLastBackup(new Date().toISOString());
    localStorage.setItem("last-backup", new Date().toISOString());
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const importData = async (file: File) => {
    setStatus("importing");
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);

      if (!backup.data || !backup.version) {
        throw new Error("Invalid backup file");
      }

      let imported = 0;
      for (const [key, value] of Object.entries(backup.data)) {
        if (STORAGE_KEYS.includes(key)) {
          localStorage.setItem(key, value);
          imported++;
        }
      }

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        window.location.reload();
      }, 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure? This will delete all your data including favorites, bookmarks, and reading history.")) {
      for (const key of STORAGE_KEYS) {
        localStorage.removeItem(key);
      }
      window.location.reload();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">Backup & Restore</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{counts.favorites}</p>
          <p className="text-xs text-gray-500">Favorites</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-purple-600">{counts.bookmarks}</p>
          <p className="text-xs text-gray-500">Bookmarks</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-green-600">{counts.history}</p>
          <p className="text-xs text-gray-500">Read</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">Total data size: {dataSize}</p>

      <div className="space-y-2">
        <button
          onClick={exportData}
          disabled={status === "success"}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {status === "success" ? (
            <><Check className="w-4 h-4" /> Exported!</>
          ) : (
            <><Download className="w-4 h-4" /> Export Backup</>
          )}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={status === "importing"}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          {status === "importing" ? (
            <><Upload className="w-4 h-4 animate-spin" /> Importing...</>
          ) : (
            <><Upload className="w-4 h-4" /> Import Backup</>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importData(file);
            e.target.value = "";
          }}
          className="hidden"
        />

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5" />
            Invalid backup file
          </div>
        )}

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={clearAllData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
