"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Star, Tag, Users, Image, FileText,
  MessageSquare, Megaphone, Mail, Search, Settings,
  ChevronLeft, ChevronRight, Shield, Zap, BarChart3,
  Menu, X, Globe, Clock, Newspaper, Share2, Bell,
  CreditCard, Lock, Database, LogOut,
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { divider: "Content" },
  { href: "/admin/posts", icon: FileText, label: "Posts & Drafts" },
  { href: "/admin/featured", icon: Star, label: "Featured Stories" },
  { href: "/admin/categories", icon: Tag, label: "Categories & Tags" },
  { href: "/admin/authors", icon: Users, label: "Authors" },
  { href: "/admin/media", icon: Image, label: "Media Library" },
  { divider: "Users & Engagement" },
  { href: "/admin/users", icon: Users, label: "User Management" },
  { href: "/admin/comments", icon: MessageSquare, label: "Comments" },
  { divider: "Monetization" },
  { href: "/admin/advertisements", icon: Megaphone, label: "Advertisements" },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { divider: "Marketing" },
  { href: "/admin/newsletters", icon: Mail, label: "Newsletters" },
  { href: "/admin/social", icon: Share2, label: "Social Media" },
  { divider: "Data Sources" },
  { href: "/admin/sources", icon: Database, label: "News Sources" },
  { divider: "Security & System" },
  { href: "/admin/security", icon: Shield, label: "Security Center" },
  { href: "/admin/notifications", icon: Bell, label: "Email & Push" },
  { divider: "Configuration" },
  { href: "/admin/seo", icon: Search, label: "SEO Settings" },
  { href: "/admin/settings", icon: Settings, label: "Website Settings" },
  { href: "/admin/integrations", icon: Globe, label: "API & Integrations" },
  { href: "/admin/rbac", icon: Shield, label: "Roles & Permissions" },
  { href: "/admin/ai-tools", icon: Zap, label: "AI Tools" },
  { href: "/admin/activity", icon: BarChart3, label: "Activity Logs" },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Admin Panel</p>
              <p className="text-[10px] text-gray-400">WorldLive CMS</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sidebarItems.map((item, i) => {
          if ("divider" in item) {
            return collapsed ? (
              <div key={i} className="h-px bg-gray-200 dark:bg-gray-700/50 my-2" />
            ) : (
              <p key={i} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">
                {item.divider}
              </p>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href, item.exact)
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Globe className="w-4 h-4" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 lg:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
