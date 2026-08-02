"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSEOMeta } from "@/lib/seo";
import { Mail, MapPin, Send, Check, Loader2, MessageSquare, Clock } from "lucide-react";

const contactChannels = [
  {
    icon: MessageSquare,
    title: "General Feedback",
    description: "Share your thoughts, feature requests, or bug reports.",
    email: "feedback@worldlive.com",
  },
  {
    icon: MapPin,
    title: "News & Corrections",
    description: "Report an error in an article or suggest a correction.",
    email: "news@worldlive.com",
  },
  {
    icon: Mail,
    title: "Advertising & Partnerships",
    description: "Inquire about advertising, sponsorships, or partnerships.",
    email: "partners@worldlive.com",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useSEOMeta("Contact Us | WorldLive", {
    description:
      "Contact the WorldLive team — get in touch about news coverage, advertising, partnerships, corrections, or feedback.",
    canonicalPath: "/contact",
    type: "website",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <BreakingNewsBanner />
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Have a question, feedback, or partnership inquiry? We&apos;d love to
            hear from you. Our team typically responds within 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {contactChannels.map((channel) => (
            <div
              key={channel.title}
              className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                <channel.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-sm mb-1">{channel.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {channel.description}
              </p>
              <a
                href={`mailto:${channel.email}`}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {channel.email}
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : status === "success" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {status === "success" ? "Message Sent!" : "Send Message"}
                </button>
                {status === "error" && (
                  <p className="text-sm text-red-600">Failed to send. Please try again.</p>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm">Response Time</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We aim to respond to all inquiries within 48 hours during business
                days (Mon–Fri).
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm">Head Office</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                WorldLive Digital Media
                <br />
                Digital News Division
                <br />
                Online Publication
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
