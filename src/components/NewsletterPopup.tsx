"use client";

import { useEffect, useState } from "react";
import { Mail, Check, Loader2, X, Sparkles } from "lucide-react";

const DISMISS_KEY = "newsletter-popup-dismissed";
const SUBSCRIBE_DELAY = 12000;

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISS_KEY) === "true";
    if (isDismissed) return;

    const hasSubscribed =
      JSON.parse(localStorage.getItem("newsletter-subscriptions") || "[]").length > 0;
    if (hasSubscribed) return;

    const isStandalone =
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const maybeShow = () => {
      if (localStorage.getItem(DISMISS_KEY) === "true") return;
      setVisible(true);
    };

    timer = setTimeout(maybeShow, SUBSCRIBE_DELAY);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");

    await new Promise((r) => setTimeout(r, 800));

    const saved = JSON.parse(localStorage.getItem("newsletter-subscriptions") || "[]");
    if (saved.includes(email)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }

    saved.push(email);
    localStorage.setItem("newsletter-subscriptions", JSON.stringify(saved));
    localStorage.setItem(DISMISS_KEY, "true");
    setStatus("success");
    setEmail("");

    setTimeout(() => closePopup(), 1800);
  };

  const closePopup = () => {
    setAnimatingOut(true);
    setTimeout(() => setVisible(false), 300);
  };

  const dismissForever = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    closePopup();
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ${
        animatingOut ? "opacity-0" : "opacity-100"
      }`}
      onClick={dismissForever}
    >
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-transform duration-300 ${
          animatingOut ? "scale-95" : "scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <button
          onClick={dismissForever}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close newsletter popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pt-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-500">
              Daily Digest
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-2">Never miss the news that matters</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Get the top stories from around the world delivered to your inbox every morning.
            Join thousands of readers.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold">
              <Check className="w-5 h-5" />
              You&apos;re subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "error" ? (
                  "Already subscribed"
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Get Daily News
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-400 mt-4">
            No spam. Unsubscribe anytime.{" "}
            <button
              onClick={dismissForever}
              className="text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              No thanks
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
