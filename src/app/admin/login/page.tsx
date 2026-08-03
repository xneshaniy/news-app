"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, AlertCircle, ShieldCheck, UserCircle2, Info, Mail } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<"admin" | "author">("admin");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [authorPassword, setAuthorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  useEffect(() => {
    fetch("/api/admin/recovery-email")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) setRecoveryEmail(data.email);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body =
        mode === "admin"
          ? JSON.stringify({ password })
          : JSON.stringify({ email, password: authorPassword });

      const res = await fetch(
        mode === "admin" ? "/api/admin/login" : "/api/admin/author-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">WorldLive Admin Panel</p>
          </div>

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("admin");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "admin"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("author");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "author"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <UserCircle2 className="w-4 h-4" />
              Author
            </button>
          </div>

          {mode === "author" && (
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg mb-6">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-0.5">Author Login Notice</p>
                <p>
                  Each author has a separate email address and password. Please
                  use your own login credentials to access your account. Do not
                  use our email address or password.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "author" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@worldlive.dpdns.org"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={mode === "admin" ? password : authorPassword}
                  onChange={(e) =>
                    mode === "admin"
                      ? setPassword(e.target.value)
                      : setAuthorPassword(e.target.value)
                  }
                  placeholder={
                    mode === "admin" ? "Enter admin password" : "Enter your author password"
                  }
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : mode === "admin" ? "Sign In as Admin" : "Sign In as Author"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700/50">
            <button
              type="button"
              onClick={() => setShowForgot(!showForgot)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showForgot ? "Hide" : "Forgot your password?"}
            </button>

            {showForgot && (
              <div className="mt-3 flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-0.5">Forgot your password?</p>
                  <p className="mb-1">
                    Your registered personal email address is:
                  </p>
                  <p className="font-mono font-bold text-base mb-1">
                    {recoveryEmail || "admin@worldlive.dpdns.org"}
                  </p>
                  <p>
                    Use this email address to reset your password. If you no
                    longer have access to this email, please contact support.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-6">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
