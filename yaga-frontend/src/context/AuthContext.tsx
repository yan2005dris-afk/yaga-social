import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type FC,
  type ReactNode,
} from "react";
import { authApi } from "../api/auth";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
} from "../types/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("yaga_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("yaga_token"),
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("yaga_token");
    localStorage.removeItem("yaga_refresh_token");
    localStorage.removeItem("yaga_user");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("yaga_token");
      if (storedToken) {
        try {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
          localStorage.setItem("yaga_user", JSON.stringify(currentUser));
        } catch {
          const storedRefreshToken = localStorage.getItem("yaga_refresh_token");
          if (storedRefreshToken) {
            try {
              const res = await authApi.refresh(storedRefreshToken);
              localStorage.setItem("yaga_token", res.token);
              localStorage.setItem("yaga_refresh_token", res.refreshToken);
              localStorage.setItem("yaga_user", JSON.stringify(res.user));
              setToken(res.token);
              setUser(res.user);
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    void initAuth();
  }, [logout]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("yaga_token", response.token);
      localStorage.setItem("yaga_refresh_token", response.refreshToken);
      localStorage.setItem("yaga_user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(credentials);
      localStorage.setItem("yaga_token", response.token);
      localStorage.setItem("yaga_refresh_token", response.refreshToken);
      localStorage.setItem("yaga_user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
