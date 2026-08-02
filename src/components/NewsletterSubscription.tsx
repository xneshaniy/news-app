"use client";

import { useState } from "react";
import { Mail, Check, Loader2, X } from "lucide-react";

interface NewsletterSubscriptionProps {
  variant?: "inline" | "modal" | "sidebar";
}

export default function NewsletterSubscription({ variant = "inline" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showModal, setShowModal] = useState(false);
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>([]);

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
    setSubscribedEmails(saved);
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleUnsubscribe = (unsubEmail: string) => {
    const saved = JSON.parse(localStorage.getItem("newsletter-subscriptions") || "[]");
    const updated = saved.filter((e: string) => e !== unsubEmail);
    localStorage.setItem("newsletter-subscriptions", JSON.stringify(updated));
    setSubscribedEmails(updated);
  };

  if (variant === "sidebar") {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <Mail className="w-8 h-8 mb-3 opacity-80" />
        <h3 className="text-lg font-bold mb-2">Daily Digest</h3>
        <p className="text-sm text-blue-100 mb-4">
          Get the top stories delivered to your inbox every morning
        </p>
        <form onSubmit={handleSubscribe} className="space-y-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-sm placeholder:text-white/60 outline-none focus:border-white/60 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-4 py-2.5 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === "success" ? (
              <Check className="w-4 h-4" />
            ) : null}
            {status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Subscribe to Newsletter
        </button>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Stay Informed</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
                Subscribe to our newsletter for daily curated news
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "success" ? (
                    <Check className="w-4 h-4" />
                  ) : null}
                  {status === "success" ? "You're subscribed!" : "Subscribe to Newsletter"}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
      <form onSubmit={handleSubscribe} className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <input
          type="email"
          placeholder="Subscribe to newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {status === "success" ? "✓" : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
