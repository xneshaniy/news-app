"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, X, Check } from "lucide-react";

export default function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      setSubscribed(localStorage.getItem("push-subscribed") === "true");
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      localStorage.setItem("push-subscribed", "true");
      setSubscribed(true);
      setShowPrompt(false);
      showLocalNotification("WorldLive", "You'll now receive breaking news notifications!");
    }
  };

  const showLocalNotification = (title: string, body: string) => {
    if (permission === "granted") {
      new Notification(title, {
        body,
        icon: "/icons/icon-192x192.svg",
        badge: "/icons/icon-96x96.svg",
      } as NotificationOptions);
      setLastNotification(title);
      setTimeout(() => setLastNotification(null), 5000);
    }
  };

  const unsubscribe = () => {
    localStorage.removeItem("push-subscribed");
    setSubscribed(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (subscribed && permission === "granted") {
        const headlines = [
          "Breaking: Major tech merger announced",
          "Markets reach new all-time highs",
          "Science breakthrough in quantum computing",
          "Sports championship results are in",
        ];
        const headline = headlines[Math.floor(Math.random() * headlines.length)];
        showLocalNotification("Trending Now", headline);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [subscribed, permission]);

  if (typeof window === "undefined" || !("Notification" in window)) return null;

  return (
    <>
      <button
        onClick={() => {
          if (subscribed) {
            unsubscribe();
          } else if (permission === "granted") {
            requestPermission();
          } else {
            setShowPrompt(true);
          }
        }}
        className={`p-2 rounded-lg transition-colors ${
          subscribed
            ? "bg-green-100 dark:bg-green-900/30 text-green-600"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        }`}
        title={subscribed ? "Notifications enabled" : "Enable notifications"}
      >
        {subscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
      </button>

      {lastNotification && (
        <div className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 max-w-sm animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{lastNotification}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Notification sent</p>
            </div>
            <button onClick={() => setLastNotification(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Stay Updated</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
              Get breaking news notifications delivered straight to your device
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrompt(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Not now
              </button>
              <button
                onClick={requestPermission}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
