"use client";

import { useState } from "react";
import {
  CreditCard, Users, DollarSign, TrendingUp, CheckCircle,
  XCircle, Star, Zap, Crown, Shield, Eye, Edit3,
  BarChart3, Calendar, ArrowUpRight, ArrowDownRight,
  Package, Gift, RefreshCw, Settings, Mail,
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  subscribers: number;
  revenue: number;
  color: string;
  icon: React.ElementType;
  popular?: boolean;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "cancelled" | "past_due" | "trial";
  since: string;
  nextBilling: string;
  totalPaid: number;
}

const MOCK_PLANS: SubscriptionPlan[] = [
  { id: "free", name: "Free", price: 0, interval: "forever", features: ["5 articles/day", "Basic categories", "Email newsletter"], subscribers: 12450, revenue: 0, color: "from-gray-500 to-gray-600", icon: Package },
  { id: "monthly", name: "Premium Monthly", price: 9.99, interval: "month", features: ["Unlimited articles", "All categories", "Ad-free reading", "Offline mode", "Priority support"], subscribers: 3456, revenue: 34525, color: "from-blue-500 to-blue-600", icon: Star, popular: true },
  { id: "annual", name: "Premium Annual", price: 79.99, interval: "year", features: ["Everything in Monthly", "Save 33%", "Exclusive content", "Early access", "API access"], subscribers: 1234, revenue: 98707, color: "from-purple-500 to-purple-600", icon: Crown },
  { id: "enterprise", name: "Enterprise", price: 299, interval: "month", features: ["Custom API limits", "White-label options", "Dedicated support", "Custom integrations", "SLA guarantee"], subscribers: 45, revenue: 13455, color: "from-orange-500 to-orange-600", icon: Shield },
];

const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: "sub1", name: "TechCorp Inc.", email: "billing@techcorp.com", plan: "Enterprise", status: "active", since: "Jan 2025", nextBilling: "Aug 1, 2026", totalPaid: 3588 },
  { id: "sub2", name: "Sarah Chen", email: "sarah@personal.com", plan: "Premium Annual", status: "active", since: "Mar 2025", nextBilling: "Mar 1, 2027", totalPaid: 159.98 },
  { id: "sub3", name: "Media Group LLC", email: "admin@mediagroup.com", plan: "Premium Monthly", status: "active", since: "Jun 2025", nextBilling: "Aug 1, 2026", totalPaid: 129.87 },
  { id: "sub4", name: "John Doe", email: "john@email.com", plan: "Premium Monthly", status: "past_due", since: "Feb 2026", nextBilling: "Overdue", totalPaid: 49.95 },
  { id: "sub5", name: "Emily Watson", email: "emily@writer.co", plan: "Premium Annual", status: "cancelled", since: "Jan 2025", nextBilling: "N/A", totalPaid: 79.99 },
  { id: "sub6", name: "News Agency Pro", email: "team@newsagency.com", plan: "Enterprise", status: "trial", since: "Jul 2026", nextBilling: "Aug 7, 2026", totalPaid: 0 },
];

export default function SubscriptionMembership() {
  const [plans] = useState(MOCK_PLANS);
  const [subscribers] = useState(MOCK_SUBSCRIBERS);
  const [activeTab, setActiveTab] = useState<"plans" | "subscribers" | "analytics" | "settings">("plans");

  const totalRevenue = plans.reduce((s, p) => s + p.revenue, 0);
  const totalSubscribers = plans.reduce((s, p) => s + p.subscribers, 0);
  const mrr = plans.filter((p) => p.interval === "month").reduce((s, p) => s + p.price * p.subscribers, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-500" />
            Subscription & Membership
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage plans, billing, and subscribers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Total Revenue</span></div>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +18% this month</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">MRR</span></div>
          <p className="text-2xl font-bold">${mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +12% MoM</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-purple-500" /><span className="text-xs text-gray-500">Subscribers</span></div>
          <p className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +8% this month</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-orange-500" /><span className="text-xs text-gray-500">Churn Rate</span></div>
          <p className="text-2xl font-bold">2.4%</p>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-1"><ArrowDownRight className="w-3 h-3" /> -0.3% vs last month</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        {[
          { key: "plans", label: "Plans" },
          { key: "subscribers", label: "Subscribers" },
          { key: "analytics", label: "Analytics" },
          { key: "settings", label: "Settings" },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.id} className={`bg-white dark:bg-gray-800/50 rounded-xl border-2 p-6 relative ${plan.popular ? "border-blue-500" : "border-gray-200 dark:border-gray-700/50"}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">MOST POPULAR</span>}
                <div className={`w-10 h-10 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-sm text-gray-400">/{plan.interval}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs"><CheckCircle className="w-3 h-3 text-green-500 shrink-0" /> {f}</li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 dark:border-gray-700/50 pt-4 mt-auto">
                  <p className="text-sm font-semibold">{plan.subscribers.toLocaleString()} subscribers</p>
                  <p className="text-xs text-gray-400">${plan.revenue.toLocaleString()} revenue</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "subscribers" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700/50 text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-3">Subscriber</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Since</th>
                  <th className="px-4 py-3">Next Billing</th>
                  <th className="px-4 py-3">Total Paid</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{sub.name}</p>
                      <p className="text-xs text-gray-400">{sub.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{sub.plan}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${sub.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : sub.status === "cancelled" ? "bg-red-100 dark:bg-red-900/30 text-red-600" : sub.status === "past_due" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
                        {sub.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{sub.since}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{sub.nextBilling}</td>
                    <td className="px-4 py-3 text-sm font-medium">${sub.totalPaid.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-yellow-500 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"><Edit3 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
          <h3 className="font-semibold mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {plans.filter((p) => p.revenue > 0).map((plan) => (
              <div key={plan.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{plan.name}</span>
                  <span className="font-medium">${plan.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-3 bg-gradient-to-r ${plan.color} rounded-full`} style={{ width: `${(plan.revenue / totalRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Free Trial Period</p><p className="text-xs text-gray-400">Offer 7-day free trial for new subscribers</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Automatic Renewal</p><p className="text-xs text-gray-400">Enable automatic subscription renewal</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Grace Period</p><p className="text-xs text-gray-400">7-day grace period for failed payments</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div><p className="font-medium text-sm">Dunning Emails</p><p className="text-xs text-gray-400">Send automatic emails for failed payments</p></div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
