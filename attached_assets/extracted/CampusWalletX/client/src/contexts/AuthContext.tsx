import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUserAndLoad = useCallback((userData: User | null) => {
    setUser(userData);
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { queryClient } = await import("@/lib/queryClient");
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    logout,
    refreshUser,
    setUser: setUserAndLoad
  }), [user, isLoading, logout, refreshUser, setUserAndLoad]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
