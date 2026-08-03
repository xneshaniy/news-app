"use client";

import Header from "@/components/Header";
import { useBookmarks } from "@/components/BookmarksProvider";
import { Bookmark, Folder, Trash2, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, getBookmarkFolders, getBookmarksByFolder } = useBookmarks();
  const [selectedFolder, setSelectedFolder] = useState("All");
  const folders = ["All", ...getBookmarkFolders()];
  const filteredBookmarks = getBookmarksByFolder(selectedFolder);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Bookmark className="w-6 h-6 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold">Bookmarks</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFolder === folder
                  ? "bg-yellow-500 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-yellow-300"
              }`}
            >
              <Folder className="w-4 h-4" />
              {folder}
              {folder !== "All" && (
                <span className="text-xs opacity-70">
                  ({bookmarks.filter((b) => b.folder === folder).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {selectedFolder === "All" ? "No bookmarks yet" : `No bookmarks in "${selectedFolder}"`}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Bookmark articles to save them for later reading
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Browse News
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex gap-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                      {bookmark.folder}
                    </span>
                    <span className="text-xs text-gray-400">
                      Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href={`/article/${encodeURIComponent(bookmark.article.id)}`}
                    className="group"
                  >
                    <h3 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {bookmark.article.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {bookmark.article.source.name}
                  </p>
                  {bookmark.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Tag className="w-3 h-3 text-gray-400" />
                      {bookmark.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors shrink-0"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
