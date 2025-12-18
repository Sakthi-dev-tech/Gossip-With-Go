import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FloatingAppBar from "../components/FloatingAppBar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Post } from "../types/Posts";

export default function PostsPage() {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([])
  const location = useLocation();
  const {topicId, title, description} = location.state;

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
        topicName="Go Language"
        topicId={topicId}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, mt: 14, px: { xs: 2, md: "15%" }, pb: 8 }}>
        {/* Breadcrumbs for quick backwards navigation */}
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{ color: "text.secondary" }}
            />
          }
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link
            component={RouterLink}
            to="/topics"
            underline="hover"
            color="text.secondary"
          >
            Topics
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>

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

        {/* Posts List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
