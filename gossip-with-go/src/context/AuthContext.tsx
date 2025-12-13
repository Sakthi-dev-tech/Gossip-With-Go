import { stringify } from "querystring";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    const tk = localStorage.getItem("authToken");

    if (tk) {
      // TODO: check token validity
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<string> => {
    console.log("Authenticating...");
    console.log(`API URL: ${apiUrl}:${apiPort}/login`);

    try {
      const response = await fetch(`${apiUrl}:${apiPort}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Store token if backend returns one
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        setIsAuthenticated(true);
        return "success";
      } else {
        const errorText = await response.text();
        console.log("Login failed:", errorText);
        setIsAuthenticated(false);
        return errorText || "Login failed";
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      return error instanceof Error ? error.message : "Network error";
    }
  };

  const logout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
