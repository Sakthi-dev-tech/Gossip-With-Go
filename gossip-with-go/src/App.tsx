import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import LoginPage from "./screens/Login";
import TopicsPage from "./screens/Topics";
import PostsPage from "./screens/Posts";
import PostDetailPage from "./screens/PostDetail";
import { AuthProvider } from "./context/AuthContext";
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />

            {/* Public Routes (Only accessible if NOT logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="/auth" element={<LoginPage />} />
            </Route>
            {/* Protected Routes (Only accessible if logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/post" element={<PostDetailPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
