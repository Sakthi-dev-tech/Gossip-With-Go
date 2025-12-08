import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FloatingAppBar from "../components/FloatingAppBar";
import PostCard from "../components/PostCard";
import { Link as RouterLink } from "react-router-dom";

export default function PostsPage() {
  const posts = [
    {
      id: 1,
      author: "John Doe",
      timeAgo: "2 hours ago",
      title: "Best Practices for Concurrency in Go",
      content:
        "Let's discuss some of the best practices and common pitfalls when dealing with goroutines and channels in Go. What are your favorite patterns and techniques for writing clean, efficient, and bug-free concurrent code?...",
      commentCount: 14,
    },
    {
      id: 2,
      author: "Sarah Smith",
      timeAgo: "1 day ago",
      title: "Understanding Go's Error Handling Philosophy",
      content:
        "Coming from other languages, Go's explicit `if err != nil` pattern can feel verbose. I'd love to hear how others have embraced this and what the community thinks about the proposals for new error handling mechanisms.",
      commentCount: 32,
    },
    {
      id: 3,
      author: "Mike Chen",
      timeAgo: "3 days ago",
      title: "Showcase: A CLI Tool I Built with Cobra",
      content:
        "Just wanted to share a small project I built using the Cobra library for creating powerful CLI applications. It was a fantastic experience, and I'm open to feedback and questions about the development process!",
      commentCount: 8,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <FloatingAppBar />

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
            Home
          </Link>
          <Typography color="text.primary">Go Language</Typography>
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
              Go Language
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontSize: "1.1rem" }}
            >
              A place to discuss all things related to the Go programming
              language.
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
          >
            Create Post
          </Button>
        </Box>

        {/* Posts List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              author={post.author}
              timeAgo={post.timeAgo}
              title={post.title}
              content={post.content}
              commentCount={post.commentCount}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
