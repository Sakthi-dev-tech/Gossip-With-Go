import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie } from "../functions/Cookies";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string>;
  register: (username: string, password: string) => Promise<string>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if a JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If we can't decode it, treat it as expired
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("access_token") || getCookie("access_token");

    if (token) {
      if (isTokenExpired(token)) {
        console.log("Token is expired, clearing storage");
        deleteCookie("access_token");
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
      } else {
        // Token exists and is valid, mark user as authenticated
        setIsAuthenticated(true);
      }
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<string> => {
    console.log("Authenticating...");

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Save token to localStorage for user info access using JS
        if (data.token) {
          localStorage.setItem("access_token", data.token);
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

  const register = async (
    username: string,
    password: string
  ): Promise<string> => {
    console.log("Registering...");

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        await response.json();
        // we do not set authenticated is true, forcing user to sign in
        return "success";
      } else {
        const errorText = await response.text();
        console.log("Register failed:", errorText);
        setIsAuthenticated(false);
        return errorText || "Register failed";
      }
    } catch (error) {
      console.error("Register error:", error);
      setIsAuthenticated(false);
      return error instanceof Error ? error.message : "Network error";
    }
  };

  const logout = () => {
    console.log("Logging out...");
    deleteCookie("access_token");
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
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
