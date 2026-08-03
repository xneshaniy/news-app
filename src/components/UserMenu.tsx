"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { User, LogOut, Settings, Mail, Lock, UserPlus, X, ChevronDown, Save, Bell } from "lucide-react";

export default function UserMenu() {
  const { user, isAuthenticated, login, register, logout, updateProfile } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileNewsletter, setProfileNewsletter] = useState(true);
  const [profileNotifications, setProfileNotifications] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const openSettings = () => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfileNewsletter(user.preferences?.newsletter ?? true);
      setProfileNotifications(user.preferences?.notifications ?? true);
    }
    setSettingsSaved(false);
    setShowDropdown(false);
    setShowSettingsModal(true);
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      setError("Name and email are required");
      return;
    }
    updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      preferences: {
        ...(user?.preferences || { categories: [], countries: [], notifications: true, newsletter: true }),
        newsletter: profileNewsletter,
        notifications: profileNotifications,
      },
    });
    setSettingsSaved(true);
    setError("");
    window.setTimeout(() => setShowSettingsModal(false), 1200);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let success = false;
    if (authMode === "login") {
      success = await login(email, password);
      if (!success) setError("Invalid email or password");
    } else {
      if (!name.trim()) { setError("Name is required"); setLoading(false); return; }
      success = await register(name, email, password);
      if (!success) setError("Email already registered");
    }

    setLoading(false);
    if (success) {
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
      setName("");
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full"
          />
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button onClick={openSettings} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                  Account Settings
                </button>
                <button onClick={openSettings} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Newsletter Preferences
                </button>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                <button
                  onClick={() => { logout(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}

        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Account Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile and preferences</p>
                </div>
              </div>

              {settingsSaved && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm px-4 py-2 rounded-lg mb-4">
                  Settings saved successfully.
                </div>
              )}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={saveSettings} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">Preferences</p>
                  <label className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Newsletter</span>
                    <button
                      type="button"
                      onClick={() => setProfileNewsletter(!profileNewsletter)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${profileNewsletter ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${profileNewsletter ? "left-5" : "left-0.5"}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-gray-400" /> Notifications</span>
                    <button
                      type="button"
                      onClick={() => setProfileNotifications(!profileNotifications)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${profileNotifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${profileNotifications ? "left-5" : "left-0.5"}`} />
                    </button>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-1">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
              {authMode === "login" ? "Sign in to sync your data" : "Join WorldLive today"}
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "register" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setError(""); }}
                className="text-blue-600 hover:underline font-medium"
              >
                {authMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
