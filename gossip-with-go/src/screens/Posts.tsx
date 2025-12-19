import { Box, Typography, Button, IconButton, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FloatingAppBar from "../components/FloatingAppBar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Post } from "../types/Posts";

export default function PostsPage() {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { topicId, title, description } = location.state;

  const fetchPosts = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic_id: topicId }),
      credentials: "include",
    });
    const data = await response.json();
    if (data !== null) {
      setPosts(data);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [openCreatePost])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <FloatingAppBar />
      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        topicName={title}
        topicId={topicId}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, mt: 14, px: { xs: 2, md: "15%" }, pb: 8 }}>
        {/* Back Button */}
        <IconButton
          onClick={() => navigate("/topics")}
          sx={{
            mb: 3,
            color: "text.secondary",
            "&:hover": {
              color: "secondary.main",
              backgroundColor: "rgba(239, 175, 103, 0.1)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 6,
          }}
        >
          <Box sx={{ maxWidth: "700px" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem" }}
            >
              {description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "secondary.main",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: 2,
              boxShadow: "0 4px 14px rgba(239, 175, 103, 0.4)",
              "&:hover": {
                backgroundColor: "#f08812ff",
                boxShadow: "0 6px 20px rgba(242, 126, 9, 0.6)",
              },
            }}
            onClick={() => setOpenCreatePost(true)}
          >
            Create Post
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search posts by title or content or author name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                },
              },
            }}
          />
        </Box>

        {/* Posts List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {posts
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .filter((post) => {
              if (!searchQuery) return true;
              const query = searchQuery.toLowerCase();
              return (
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.username.toLowerCase().includes(query)
              );
            })
            .map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                content={post.content}
                id={post.id}
                username={post.username}
                user_id={post.user_id}
                created_at={post.created_at}
                onPostChanged={fetchPosts}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
}
