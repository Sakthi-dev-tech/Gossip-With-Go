import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If alr authenticated, redirect to main page
  return isAuthenticated ? <Navigate to="/topics" /> : <Outlet />;
};
