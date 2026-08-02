"use client";

import { useState, useRef, useCallback } from "react";
import {
  Image, Upload, Search, Grid, List, Trash2, Copy,
  File, Film, Music, FileText, Check, X, Plus,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio";
  url: string;
  thumbnail: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  alt: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: "m1", name: "breaking-news-banner.jpg", type: "image", url: "/media/banner.jpg", thumbnail: "https://picsum.photos/seed/m1/200/150", size: "245 KB", uploadedAt: "2 hours ago", uploadedBy: "Sarah Chen", alt: "Breaking news banner" },
  { id: "m2", name: "tech-conference-2026.jpg", type: "image", url: "/media/tech.jpg", thumbnail: "https://picsum.photos/seed/m2/200/150", size: "1.2 MB", uploadedAt: "1 day ago", uploadedBy: "James Wilson", alt: "Tech conference" },
  { id: "m3", name: "interview-clip.mp4", type: "video", url: "/media/interview.mp4", thumbnail: "https://picsum.photos/seed/m3/200/150", size: "24.5 MB", uploadedAt: "3 days ago", uploadedBy: "Maria Garcia", alt: "Interview video" },
  { id: "m4", name: "quarterly-report.pdf", type: "document", url: "/media/report.pdf", thumbnail: "", size: "3.4 MB", uploadedAt: "1 week ago", uploadedBy: "Sarah Chen", alt: "Q4 report" },
  { id: "m5", name: "podcast-episode-12.mp3", type: "audio", url: "/media/podcast.mp3", thumbnail: "", size: "18.7 MB", uploadedAt: "1 week ago", uploadedBy: "Emily Brown", alt: "Podcast episode" },
  { id: "m6", name: "sports-highlights.mp4", type: "video", url: "/media/sports.mp4", thumbnail: "https://picsum.photos/seed/m6/200/150", size: "45.2 MB", uploadedAt: "2 weeks ago", uploadedBy: "David Kim", alt: "Sports highlights" },
];

const TYPE_ICONS = {
  image: Image,
  video: Film,
  document: FileText,
  audio: Music,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileType(file: File): "image" | "video" | "document" | "audio" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "document";
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = media.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    setMedia((prev) => prev.filter((m) => !selectedItems.has(m.id)));
    setSelectedItems(new Set());
  };

  const deleteItem = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const copyUrl = (url: string) => navigator.clipboard?.writeText(url);

  const processFiles = useCallback((files: FileList | File[]) => {
    const newItems: MediaItem[] = Array.from(files).map((file) => {
      const type = getFileType(file);
      const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const objectUrl = URL.createObjectURL(file);
      return {
        id,
        name: file.name,
        type,
        url: objectUrl,
        thumbnail: type === "image" ? objectUrl : "",
        size: formatFileSize(file.size),
        uploadedAt: "Just now",
        uploadedBy: "You",
        alt: file.name.replace(/\.[^/.]+$/, ""),
      };
    });
    setMedia((prev) => [...newItems, ...prev]);
    setUploading(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  }, [processFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{media.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.size > 0 && (
            <button onClick={deleteSelected} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <Trash2 className="w-4 h-4" />
              Delete ({selectedItems.size})
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`bg-white dark:bg-gray-800/50 rounded-xl border-2 overflow-hidden transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-gray-200 dark:border-gray-700/50"
        }`}
      >
        {dragOver && (
          <div className="p-8 text-center border-b border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <Upload className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-600 dark:text-blue-400 font-medium">Drop files here to upload</p>
          </div>
        )}

        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search files"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm outline-none"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[{ value: "all", label: "All" }, { value: "image", label: "Images" }, { value: "video", label: "Videos" }, { value: "document", label: "Docs" }, { value: "audio", label: "Audio" }].map((t) => (
              <button key={t.value} onClick={() => setFilterType(t.value)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterType === t.value ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setView("grid")} aria-label="Grid view" className={`p-1.5 rounded ${view === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} aria-label="List view" className={`p-1.5 rounded ${view === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <File className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No files found</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm text-blue-500 hover:text-blue-600"
            >
              Upload your first file
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {filtered.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              const isSelected = selectedItems.has(item.id);
              return (
                <div key={item.id} onClick={() => toggleSelect(item.id)} className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800" : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"}`}>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.alt} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <Icon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{item.name}</p>
                    <p className="text-white/70 text-[10px]">{item.size}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }} className="p-1 bg-black/50 rounded text-white hover:bg-black/70"><Copy className="w-3 h-3" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-1 bg-black/50 rounded text-white hover:bg-red-600"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              return (
                <div key={item.id} onClick={() => toggleSelect(item.id)} className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors ${selectedItems.has(item.id) ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}>
                  <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4" />
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.uploadedBy} &middot; {item.uploadedAt}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.size}</span>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"><Copy className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
