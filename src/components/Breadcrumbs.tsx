"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto whitespace-nowrap">
      <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-gray-700 dark:text-gray-300 font-medium" aria-current="page">
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
