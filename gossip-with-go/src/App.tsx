import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import LoginPage from "./screens/Login";
import TopicsPage from "./screens/Topics";
import PostsPage from "./screens/Posts";
import PostDetailPage from "./screens/PostDetail";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/post" element={<PostDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
