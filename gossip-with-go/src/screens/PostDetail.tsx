import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Breadcrumbs,
  Link,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import FloatingAppBar from "../components/FloatingAppBar";

export default function PostDetailPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <FloatingAppBar />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, mt: 14, px: { xs: 2, md: "15%" }, pb: 8 }}>
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
          <Link
            component={RouterLink}
            to="/posts"
            underline="hover"
            color="text.secondary"
          >
            Go Language
          </Link>
          <Typography color="text.primary">Post Detail</Typography>
        </Breadcrumbs>

        {/* Post Container */}
        <Box
          sx={{
            backgroundColor: "rgba(30, 41, 59, 0.4)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 3,
            p: 4,
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              lineHeight: 1.2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Exploring the new features in Go 1.21
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Posted by <span style={{ color: "#fff" }}>gopher_dev</span> on 2
            hours ago
          </Typography>

          <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
          >
            The Go team has just released Go 1.21, and it's packed with a ton of
            exciting new features and improvements. This version continues Go's
            tradition of focusing on simplicity, reliability, and efficiency,
            while also introducing some long-awaited enhancements that will make
            developers' lives even easier.
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
          >
            One of the most significant additions is the new 'slices' package,
            which provides a collection of utility functions for working with
            slices. This includes functions for sorting, searching, and
            manipulating slice data, reducing the need for boilerplate code that
            many of us have written time and time again. We'll dive into some
            examples of how to use this new package to write cleaner, more
            concise code.
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            Another major highlight is the improved performance of the garbage
            collector, which now boasts lower latency and better overall
            efficiency. This is great news for applications that require
            low-latency responses, such as web servers and real-time systems.
            The compiler has also seen some optimizations, resulting in faster
            build times and smaller binary sizes. We'll look at some benchmarks
            to see these improvements in action.
          </Typography>
        </Box>

        {/* Comments Section */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Comments
          </Typography>

          {/* Add Comment Box */}
          <Box
            sx={{
              backgroundColor: "rgba(30, 41, 59, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 3,
              p: 3,
              mb: 4,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Add a comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What are your thoughts?"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "text.primary",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0ea5e9", // Sky blue focus
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "secondary.main",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#ffaa00ff",
                  },
                }}
              >
                Post Comment
              </Button>
            </Box>
          </Box>

          {/* Comment List */}

          {/* Comment 1 */}
          <Box
            sx={{
              backgroundColor: "rgba(30, 41, 59, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 3,
              p: 3,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {/* Fallback avatar if no image */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, fontSize: "0.95rem" }}
              >
                JaneSmith
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.6 }}
            >
              Great overview! I'm really excited about the new 'slices' package.
              It's going to clean up so much of my code.
            </Typography>
          </Box>

          {/* Comment 2 */}
          <Box
            sx={{
              backgroundColor: "rgba(30, 41, 59, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 3,
              p: 3,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, fontSize: "0.95rem" }}
              >
                CodeWizard
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.6 }}
            >
              I've been testing the new PGO (Profile Guided Optimization)
              features and the results are promising. Definitely worth looking
              into for production workloads.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
