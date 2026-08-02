"use client";

import { useState } from "react";
import { Share2, Copy, Check, Mail, ExternalLink, MessageSquare, Send, Globe } from "lucide-react";
import { getShareUrls } from "@/lib/constants";

interface ShareButtonsProps {
  title: string;
  url: string;
  compact?: boolean;
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ShareButtons({ title, url, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const shareUrls = getShareUrls({ title, url });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-[#1DA1F2]"
          title="Share on Twitter"
        >
          <TwitterIcon className="w-4 h-4" />
        </a>
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-[#4267B2]"
          title="Share on Facebook"
        >
          <FacebookIcon className="w-4 h-4" />
        </a>
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-[#25D366]"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4" />
        </a>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-blue-500"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg text-sm font-medium hover:bg-[#1DA1F2]/20 transition-colors"
        >
          <TwitterIcon className="w-4 h-4" />
          Twitter
        </a>
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-[#4267B2]/10 text-[#4267B2] rounded-lg text-sm font-medium hover:bg-[#4267B2]/20 transition-colors"
        >
          <FacebookIcon className="w-4 h-4" />
          Facebook
        </a>
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg text-sm font-medium hover:bg-[#0A66C2]/20 transition-colors"
        >
          <LinkedinIcon className="w-4 h-4" />
          LinkedIn
        </a>
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-[#25D366]/10 text-[#25D366] rounded-lg text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4" />
          WhatsApp
        </a>
      </div>

      {showAll && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <a
            href={shareUrls.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-[#0088cc]/10 text-[#0088cc] rounded-lg text-sm font-medium hover:bg-[#0088cc]/20 transition-colors"
          >
            <Send className="w-4 h-4" />
            Telegram
          </a>
          <a
            href={shareUrls.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-[#FF5700]/10 text-[#FF5700] rounded-lg text-sm font-medium hover:bg-[#FF5700]/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Reddit
          </a>
          <a
            href={shareUrls.email}
            className="flex items-center gap-2 px-3 py-2 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}

      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        {showAll ? "Show less" : "More sharing options"}
      </button>
    </div>
  );
}
