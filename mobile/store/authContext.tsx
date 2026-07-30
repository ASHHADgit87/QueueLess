import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, AuthResponse } from "../types/user";
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { authService } from "../services/authService";
import { LoginFormValues, RegisterFormValues } from "../utils/validation";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedToken = await getStoredToken();
      if (savedToken) {
        try {
          const me = await authService.getMe();
          setToken(savedToken);
          setUser(me);
          connectSocket(savedToken);
        } catch {
          await clearStoredToken();
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const handleAuthSuccess = useCallback(async (data: AuthResponse) => {
    await setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
    connectSocket(data.token);
  }, []);

  const login = useCallback(
    async (values: LoginFormValues) => {
      const data = await authService.login(values);
      await handleAuthSuccess(data);
    },
    [handleAuthSuccess],
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      const data = await authService.register(values);
      await handleAuthSuccess(data);
    },
    [handleAuthSuccess],
  );

  const logout = useCallback(async () => {
    disconnectSocket();
    await clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authService.getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
};
