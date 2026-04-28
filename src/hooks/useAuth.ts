import { useState, useEffect, useCallback } from "react";
import { auth } from "@/api/client";

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("spotster_token")
  );
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    auth
      .validate()
      .then(() => setChecking(false))
      .catch(() => {
        localStorage.removeItem("spotster_token");
        setToken(null);
        setChecking(false);
      });
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await auth.login(email, password);
    localStorage.setItem("spotster_token", res.access_token);
    setToken(res.access_token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("spotster_token");
    setToken(null);
  }, []);

  return { isAuthenticated: !!token, checking, login, logout };
}
