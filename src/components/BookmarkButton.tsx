"use client";

import { useState } from "react";
import { Bookmark, Check, Folder } from "lucide-react";
import { Article } from "@/types/news";
import { useBookmarks } from "./BookmarksProvider";

interface BookmarkButtonProps {
  article: Article;
  variant?: "default" | "icon";
}

export default function BookmarkButton({ article, variant = "default" }: BookmarkButtonProps) {
  const { addBookmark, removeBookmark, isBookmarked, getBookmarkFolders } = useBookmarks();
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("General");
  const bookmarked = isBookmarked(article.id);

  const folders = ["General", "Read Later", "Favorites", "Research", "Work", ...getBookmarkFolders()];
  const uniqueFolders = [...new Set(folders)];

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article, selectedFolder);
    }
  };

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg transition-colors ${
            bookmarked
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
          }`}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {bookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (bookmarked) {
            removeBookmark(article.id);
          } else {
            setShowFolderPicker(true);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          bookmarked
            ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        {bookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>

      {showFolderPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowFolderPicker(false)} />
          <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-400 uppercase">Save to folder</p>
            </div>
            {uniqueFolders.map((folder) => (
              <button
                key={folder}
                onClick={() => {
                  setSelectedFolder(folder);
                  addBookmark(article, folder);
                  setShowFolderPicker(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Folder className="w-4 h-4 text-gray-400" />
                {folder}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
