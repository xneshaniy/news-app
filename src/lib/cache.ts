interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number = 300000): void {
    this.store.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
    this.stats.sets++;
  }

  delete(key: string): boolean {
    this.stats.deletes++;
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + "%" : "0%",
      size: this.store.size,
    };
  }

  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key);
        removed++;
      }
    }
    return removed;
  }
}

const cache = new MemoryCache();

const CACHE_TTLS: Record<string, number> = {
  "news": 300000,
  "news:search": 120000,
  "weather": 600000,
  "crypto": 30000,
  "stocks": 300000,
  "recommendations": 600000,
  "rss": 300000,
  "ai:summary": 1800000,
  "ai:tags": 1800000,
  "pagespeed": 3600000,
};

export function getCached<T>(key: string): T | null {
  return cache.get<T>(key);
}

export function setCache<T>(key: string, data: T, customTtl?: number): void {
  const ttl = customTtl || Object.entries(CACHE_TTLS).find(([k]) => key.startsWith(k))?.[1] || 300000;
  cache.set(key, data, ttl);
}

export function deleteCache(key: string): boolean {
  return cache.delete(key);
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheStats() {
  return cache.getStats();
}

export function cleanupCache(): number {
  return cache.cleanup();
}

export function withCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) return Promise.resolve(cached);

  return fetcher().then((data) => {
    setCache(key, data, ttl);
    return data;
  });
}

export function createCacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(":");
}

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000;

function maybeCleanup(): void {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now;
    cleanupCache();
  }
}

export function getMaybeCached<T>(key: string): T | null {
  maybeCleanup();
  return cache.get<T>(key);
}
