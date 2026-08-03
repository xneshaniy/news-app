"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  preferences: {
    categories: string[];
    countries: string[];
    notifications: boolean;
    newsletter: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("registered-users") || "[]");
    const found = users.find((u: User & { password: string }) => u.email === email && u.password === password);
    if (found) {
      const userData = { ...found };
      delete (userData as User & { password?: string }).password;
      setUser(userData);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("registered-users") || "[]");
    if (users.find((u: User & { password: string }) => u.email === email)) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
      joinedAt: new Date().toISOString(),
      preferences: {
        categories: [],
        countries: [],
        notifications: true,
        newsletter: false,
      },
      password,
    };

    users.push(newUser);
    localStorage.setItem("registered-users", JSON.stringify(users));

    const userData = { ...newUser };
    delete (userData as User & { password?: string }).password;
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      const users = JSON.parse(localStorage.getItem("registered-users") || "[]");
      const idx = users.findIndex((u: User & { password: string }) => u.id === user.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem("registered-users", JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
