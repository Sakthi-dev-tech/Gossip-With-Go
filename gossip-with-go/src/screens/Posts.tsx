import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FloatingAppBar from "../components/FloatingAppBar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Post } from "../types/Posts";
import { authenticatedFetch } from "../functions/AuthenticatedFetch";

export default function PostsPage() {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { topicId, title, description } = location.state;

  const fetchPosts = async () => {
    const response = await authenticatedFetch(
      `${process.env.REACT_APP_API_URL}/fetchPosts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic_id: topicId }),
      }
    );
    const data = await response.json();
    if (data !== null) {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [openCreatePost]);

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
      <Box sx={{ flex: 1, mt: 14, px: "10%", pb: 8 }}>
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
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3, md: 6 },
            mb: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: 24, sm: 28, md: 32 },
                color: "text.primary",
                mb: description ? 1 : 0,
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.6,
                  fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
                }}
              >
                {description}
              </Typography>
            )}
          </Box>

          <Button
            sx={{
              color: "secondary.main",
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              px: { xs: 1.5, sm: 2, md: 3 },
              py: { xs: 0.5, sm: 1 },
              flexShrink: 0,
            }}
            onClick={() => setOpenCreatePost(true)}
          >
            Create Post
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ px: 2, mb: 4 }}>
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

        <Box sx={{ flexGrow: 1, px: 2 }}>
          {/* Posts List */}
          {/* dynamically returns the required number of columns depending on
          number of posts and screen width */}
          {(() => {
            const filteredPosts = posts
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .filter((post) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  post.title.toLowerCase().includes(query) ||
                  post.content.toLowerCase().includes(query) ||
                  post.username.toLowerCase().includes(query)
                );
              });

            const postCount = filteredPosts.length;

            return (
              <Grid
                container
                spacing={{ xs: 2, sm: 2, md: 3, lg: 4 }}
                columns={{
                  xs: Math.min(postCount, 1) * 12,
                  sm: Math.min(postCount, 2) * 6,
                  md: Math.min(postCount, 3) * 4,
                }}
                sx={{ flexGrow: 1 }}
              >
                {filteredPosts.map((post) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                    <PostCard
                      title={post.title}
                      content={post.content}
                      id={post.id}
                      username={post.username}
                      user_id={post.user_id}
                      created_at={post.created_at}
                      onPostChanged={fetchPosts}
                      topic_title={title}
                      topic_description={description}
                    />
                  </Grid>
                ))}
              </Grid>
            );
          })()}
        </Box>
      </Box>
    </Box>
  );
}
