"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Star, Tag, Users, Image, FileText,
  MessageSquare, Megaphone, Mail, Search, Settings,
  ChevronLeft, ChevronRight, Shield, Zap, BarChart3,
  Menu, X, Globe, Share2, Bell,
  CreditCard, Database, LogOut, UserCog,
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true, roles: ["admin", "editor", "author"] },
  { divider: "Content" },
  { href: "/admin/posts", icon: FileText, label: "Posts & Drafts", roles: ["admin", "editor", "author"] },
  { href: "/admin/featured", icon: Star, label: "Featured Stories", roles: ["admin", "editor"] },
  { href: "/admin/categories", icon: Tag, label: "Categories & Tags", roles: ["admin", "editor"] },
  { href: "/admin/authors", icon: Users, label: "Authors", roles: ["admin"] },
  { href: "/admin/media", icon: Image, label: "Media Library", roles: ["admin", "editor", "author"] },
  { divider: "Users & Engagement" },
  { href: "/admin/users", icon: Users, label: "User Management", roles: ["admin"] },
  { href: "/admin/comments", icon: MessageSquare, label: "Comments", roles: ["admin", "editor"] },
  { divider: "Monetization" },
  { href: "/admin/advertisements", icon: Megaphone, label: "Advertisements", roles: ["admin"] },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions", roles: ["admin"] },
  { divider: "Marketing" },
  { href: "/admin/newsletters", icon: Mail, label: "Newsletters", roles: ["admin", "editor"] },
  { href: "/admin/social", icon: Share2, label: "Social Media", roles: ["admin", "editor"] },
  { divider: "Data Sources" },
  { href: "/admin/sources", icon: Database, label: "News Sources", roles: ["admin"] },
  { divider: "Security & System" },
  { href: "/admin/security", icon: Shield, label: "Security Center", roles: ["admin"] },
  { href: "/admin/notifications", icon: Bell, label: "Email & Push", roles: ["admin", "editor"] },
  { divider: "Configuration" },
  { href: "/admin/seo", icon: Search, label: "SEO Settings", roles: ["admin"] },
  { href: "/admin/settings", icon: Settings, label: "Website Settings", roles: ["admin"] },
  { href: "/admin/integrations", icon: Globe, label: "API & Integrations", roles: ["admin"] },
  { href: "/admin/rbac", icon: Shield, label: "Roles & Permissions", roles: ["admin"] },
  { href: "/admin/ai-tools", icon: Zap, label: "AI Tools", roles: ["admin", "editor", "author"] },
  { href: "/admin/activity", icon: BarChart3, label: "Activity Logs", roles: ["admin"] },
  { divider: "Account" },
  { href: "/admin/account", icon: UserCog, label: "Account Settings", roles: ["admin", "editor", "author"] },
];

interface SessionInfo {
  role: "admin" | "editor" | "author";
  type: "admin" | "author";
  name: string;
  email?: string;
}

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSession(data);
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const canView = (roles?: string[]) => {
    if (!roles) return true;
    if (!session) return true;
    return roles.includes(session.role);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const visibleItems = sidebarItems.filter((item) => !("href" in item) || canView(item.roles));

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
        {visibleItems.map((item, i) => {
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
        {session && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {session.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{session.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{session.role}</p>
            </div>
          </div>
        )}
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
