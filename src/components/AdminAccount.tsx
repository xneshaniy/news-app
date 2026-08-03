"use client";

import { useState, useEffect } from "react";
import { Lock, Mail, KeyRound, Save, AlertCircle, CheckCircle, User } from "lucide-react";

export default function AdminAccount() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/account")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) {
          setCurrentEmail(data.email);
          setNewEmail(data.email);
        }
      })
      .catch(() => {});
  }, []);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 5000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!currentPassword) {
      showNotice("error", "Enter your current password to make changes.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      showNotice("error", "New password must be at least 8 characters.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showNotice("error", "New passwords do not match.");
      return;
    }
    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      showNotice("error", "Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail !== currentEmail ? newEmail : undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentEmail(data.email);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showNotice("success", "Account updated successfully.");
      } else {
        showNotice("error", data.error || "Failed to update account.");
      }
    } catch {
      showNotice("error", "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            Account Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Change your admin email address and password</p>
        </div>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm ${notice.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
          {notice.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {notice.message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Registered Email</label>
          <p className="text-xs text-gray-400 mb-2">This email is used for password recovery.</p>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700/50 pt-5">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <p className="text-xs text-gray-400 mb-2">Leave blank to keep your current password.</p>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
              minLength={8}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm New Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
              minLength={8}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700/50 pt-5">
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <p className="text-xs text-gray-400 mb-2">Required to confirm changes.</p>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
