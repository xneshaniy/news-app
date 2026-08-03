import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import fs from "fs";
import path from "path";

export type AuthorRole = "admin" | "editor" | "author";

export interface AuthorAccount {
  id: string;
  name: string;
  email: string;
  role: AuthorRole;
  bio: string;
  salt: string;
  hash: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface PublicAuthor {
  id: string;
  name: string;
  email: string;
  role: AuthorRole;
  bio: string;
  status: "active" | "inactive";
  createdAt: string;
}

const SEED_SALT = "worldlive-author-salt-v1";
const DEFAULT_SEED_PASSWORD = "worldlive2025";

const SEED_AUTHORS: Array<Omit<AuthorAccount, "salt" | "hash">> = [
  { id: "a1", name: "Sarah Chen", email: "sarah@worldlive.dpdns.org", role: "admin", bio: "Editor-in-Chief with 15 years in journalism", status: "active", createdAt: "2024-01-15" },
  { id: "a2", name: "James Wilson", email: "james@worldlive.dpdns.org", role: "editor", bio: "Senior editor covering politics and policy", status: "active", createdAt: "2024-03-20" },
  { id: "a3", name: "Maria Garcia", email: "maria@worldlive.dpdns.org", role: "author", bio: "Technology and AI correspondent", status: "active", createdAt: "2024-06-10" },
  { id: "a4", name: "David Kim", email: "david@worldlive.dpdns.org", role: "author", bio: "Sports reporter covering major leagues", status: "active", createdAt: "2024-08-05" },
  { id: "a5", name: "Emily Brown", email: "emily@worldlive.dpdns.org", role: "editor", bio: "Health and science editor", status: "inactive", createdAt: "2024-02-28" },
];

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function newSalt(): string {
  return randomBytes(16).toString("hex");
}

function matchesPassword(password: string, salt: string, expectedHash: string): boolean {
  const candidate = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function toPublic(a: AuthorAccount): PublicAuthor {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    role: a.role,
    bio: a.bio,
    status: a.status,
    createdAt: a.createdAt,
  };
}

let memoryStore: AuthorAccount[] | null = null;

function loadStore(): AuthorAccount[] {
  if (memoryStore) return memoryStore;
  try {
    const file = path.join(process.cwd(), "data", "authors.json");
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as AuthorAccount[];
      memoryStore = parsed;
      return parsed;
    }
  } catch {
    // fall through to seed
  }
  memoryStore = SEED_AUTHORS.map((a) => ({
    ...a,
    salt: SEED_SALT,
    hash: hashPassword(DEFAULT_SEED_PASSWORD, SEED_SALT),
  }));
  return memoryStore;
}

function persist() {
  if (!memoryStore) return;
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "authors.json"), JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch {
    // read-only filesystem (e.g. Vercel) — in-memory store still works for this process
  }
}

export function getAuthors(): PublicAuthor[] {
  return loadStore().map(toPublic);
}

export function findAuthorByEmail(email: string): AuthorAccount | null {
  const normalized = email.trim().toLowerCase();
  return loadStore().find((a) => a.email.toLowerCase() === normalized) || null;
}

export function verifyAuthorCredentials(email: string, password: string): PublicAuthor | null {
  const author = findAuthorByEmail(email);
  if (!author) return null;
  if (author.status !== "active") return null;
  if (!matchesPassword(password, author.salt, author.hash)) return null;
  return toPublic(author);
}

export function createAuthor(input: { name: string; email: string; role: AuthorRole; bio?: string; password: string }): { author?: PublicAuthor; error?: string } {
  if (!input.name || !input.email) return { error: "Name and email are required" };
  if (!input.password || input.password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }
  if (findAuthorByEmail(input.email)) return { error: "An author with this email already exists" };
  const salt = newSalt();
  const author: AuthorAccount = {
    id: `a-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    bio: input.bio || "",
    salt,
    hash: hashPassword(input.password, salt),
    status: "active",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  memoryStore = [author, ...loadStore()];
  persist();
  return { author: toPublic(author) };
}

export function updateAuthor(id: string, patch: { name?: string; role?: AuthorRole; bio?: string; status?: "active" | "inactive"; password?: string }): PublicAuthor | null {
  const store = loadStore();
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const current = store[idx];
  const next: AuthorAccount = { ...current };
  if (patch.name !== undefined) next.name = patch.name;
  if (patch.role !== undefined) next.role = patch.role;
  if (patch.bio !== undefined) next.bio = patch.bio;
  if (patch.status !== undefined) next.status = patch.status;
  if (patch.password && patch.password.length >= 8) {
    next.salt = newSalt();
    next.hash = hashPassword(patch.password, next.salt);
  }
  store[idx] = next;
  persist();
  return toPublic(next);
}

export function deleteAuthor(id: string): boolean {
  const store = loadStore();
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  persist();
  return true;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
