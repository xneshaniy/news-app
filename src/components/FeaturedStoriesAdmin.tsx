"use client";

import { useState, useEffect } from "react";
import { Star, Plus, Trash2, GripVertical, ExternalLink, Clock, Check, Flame } from "lucide-react";

interface FeaturedStory {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  category: string;
  priority: "high" | "medium" | "low";
  addedAt: string;
  expiresAt?: string;
  active: boolean;
}

const CATEGORIES = [
  "Breaking", "Politics", "Technology", "Sports",
  "Business", "Health", "Science", "Entertainment",
];

export default function FeaturedStoriesAdmin() {
  const [stories, setStories] = useState<FeaturedStory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStory, setNewStory] = useState<{
    title: string;
    description: string;
    url: string;
    image: string;
    category: string;
    priority: "high" | "medium" | "low";
    expiresAt: string;
  }>({
    title: "",
    description: "",
    url: "",
    image: "",
    category: "Breaking",
    priority: "high",
    expiresAt: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("featuredStories");
    if (saved) {
      try {
        setStories(JSON.parse(saved));
      } catch {
        setStories([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("featuredStories", JSON.stringify(stories));
  }, [stories]);

  const addStory = () => {
    if (!newStory.title || !newStory.url) return;

    const story: FeaturedStory = {
      id: `featured-${Date.now()}`,
      title: newStory.title,
      description: newStory.description,
      url: newStory.url,
      image: newStory.image,
      category: newStory.category,
      priority: newStory.priority,
      addedAt: new Date().toISOString(),
      expiresAt: newStory.expiresAt || undefined,
      active: true,
    };

    setStories((prev) => [story, ...prev]);
    setNewStory({
      title: "",
      description: "",
      url: "",
      image: "",
      category: "Breaking",
      priority: "high",
      expiresAt: "",
    });
    setShowAddForm(false);
  };

  const removeStory = (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleActive = (id: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const updatePriority = (id: string, priority: "high" | "medium" | "low") => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, priority } : s))
    );
  };

  const priorityConfig = {
    high: { label: "High", color: "bg-red-100 dark:bg-red-900/30 text-red-600", icon: Flame },
    medium: { label: "Medium", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600", icon: Star },
    low: { label: "Low", color: "bg-gray-100 dark:bg-gray-700 text-gray-600", icon: Star },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-bold">Featured Stories</h2>
          <span className="text-sm text-gray-400 ml-2">
            {stories.filter((s) => s.active).length} active
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Feature Story
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 mb-6">
          <h3 className="font-semibold mb-4">Add Featured Story</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Story title *"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
            <input
              type="url"
              placeholder="Article URL *"
              value={newStory.url}
              onChange={(e) => setNewStory({ ...newStory, url: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newStory.image}
              onChange={(e) => setNewStory({ ...newStory, image: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
            />
            <select
              value={newStory.category}
              onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={newStory.priority}
                onChange={(e) => setNewStory({ ...newStory, priority: e.target.value as "high" | "medium" | "low" })}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="datetime-local"
                placeholder="Expires at"
                value={newStory.expiresAt}
                onChange={(e) => setNewStory({ ...newStory, expiresAt: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <textarea
              placeholder="Description (optional)"
              value={newStory.description}
              onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm h-20 resize-none"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addStory}
              disabled={!newStory.title || !newStory.url}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              Add Featured Story
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {stories.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No featured stories yet</p>
          </div>
        ) : (
          stories.map((story) => {
            const pConfig = priorityConfig[story.priority];
            const isExpired = story.expiresAt && new Date(story.expiresAt) < new Date();

            return (
              <div
                key={story.id}
                className={`bg-white dark:bg-gray-800/50 rounded-xl border p-4 transition-all ${
                  story.active && !isExpired
                    ? "border-gray-200 dark:border-gray-700/50"
                    : "border-gray-200 dark:border-gray-700/50 opacity-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1 text-gray-300 cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {story.image && (
                    <img
                      src={story.image}
                      alt=""
                      className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{story.title}</h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${pConfig.color}`}>
                        {pConfig.label}
                      </span>
                      {!story.active && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                          Inactive
                        </span>
                      )}
                      {isExpired && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                          Expired
                        </span>
                      )}
                    </div>
                    {story.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
                        {story.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(story.addedAt).toLocaleDateString()}
                      </span>
                      <span>{story.category}</span>
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      value={story.priority}
                      onChange={(e) => updatePriority(story.id, e.target.value as "high" | "medium" | "low")}
                      className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      onClick={() => toggleActive(story.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        story.active
                          ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title={story.active ? "Deactivate" : "Activate"}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeStory(story.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
