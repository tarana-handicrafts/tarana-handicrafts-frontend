"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore, type ReactNode } from "react";
import {
  getAccessToken, getRefreshToken, getUser,
  setTokens, setUser as storeUser, clearTokens,
  secureFetch
} from "@/lib/secureApiClient";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Use useSyncExternalStore to safely check if we're on the client
const emptySubscribe = () => () => {};
const getIsClient = () => true;
const getServerSnapshot = () => false;

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(emptySubscribe, getIsClient, getServerSnapshot);
  
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === "undefined") return null;
    return getUser();
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getAccessToken();
  });

  // isLoading is false once we know we're on the client (state is already initialized from localStorage)
  const isLoading = !isClient;

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    // Store tokens securely
    setTokens(data.token, data.refreshToken);
    storeUser(data.user);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });
    } catch {
      // Logout even if server request fails
    }
    clearTokens();
    setToken(null);
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await secureFetch(`${API_URL}/api/auth/logout-all`, {
        method: "POST",
      });
    } catch {
      // Continue with local logout
    }
    clearTokens();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated: !!token && !!user, login, logout, logoutAll }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}
