import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { authApi } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    if (token) {
      authApi
        .getMe()
        .then((user) => {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await authApi.register(name, email, password);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
