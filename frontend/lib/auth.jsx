"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { aurum, getToken, setToken, getUser, setUser } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    const cached = getUser();
    if (cached) setUserState(cached);
    if (t) {
      aurum.me().then((u) => { setUserState(u); setUser(u); })
        .catch(() => { setToken(null); setUser(null); setUserState(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const r = await aurum.login(username, password);
    setToken(r.token); setUser(r.user); setUserState(r.user);
    return r.user;
  }, []);

  const signup = useCallback(async (body) => {
    const r = await aurum.signup(body);
    setToken(r.token); setUser(r.user); setUserState(r.user);
    return r.user;
  }, []);

  const logout = useCallback(async () => {
    try { await aurum.logout(); } catch {}
    setToken(null); setUser(null); setUserState(null);
    router.push("/");
  }, [router]);

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout, setUser: setUserState }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
