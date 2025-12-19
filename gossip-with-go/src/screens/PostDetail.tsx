import {
  Box,
  Typography,
  Divider,
  Button,
  TextField
} from "@mui/material";
import FloatingAppBar from "../components/FloatingAppBar";
import CommentBox from "../components/CommentBox";
import { useLocation } from "react-router-dom";
import { getRelativeTime } from "../functions/TimeFormatter";
import { Comment } from "../types/Comments";
import { useEffect, useState } from "react";
import { getCookie } from "../functions/Cookies";
import { jwtDecode } from "jwt-decode";

// Interface for JWT payload
interface JWTPayload {
  user_id: number;
  username: string;
  exp: number;
}

export default function PostDetailPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const location = useLocation();
  const { title, content, username, user_id, created_at, post_id } = location.state;

  const [comment, setComment] = useState("");

  const formattedDate = getRelativeTime(created_at);

  // Get current user ID from JWT token
  const getCurrentUserId = (): number | null => {
    const token = getCookie("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        return decoded.user_id;
      } catch {
        return null;
      }
    }
    return null;
  };

  let currentUserId = getCurrentUserId();

  const postComment = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "content": comment, "post_id": post_id }),
        credentials: "include",
      });

      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchComments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "post_id": post_id }),
        credentials: "include",
      });
      const data = await response.json();
      if (data !== null) {
        setComments(data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <FloatingAppBar />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, mt: 14, px: { xs: 2, md: "15%" }, pb: 8 }}>

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
            {title}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Posted by <span style={{ color: "#fff" }}>{username}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {formattedDate}
          </Typography>

          <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
          >
            {content}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
                onClick={postComment}
              >
                Post Comment
              </Button>
            </Box>
          </Box>

          {/* Comment List */}

          {
            comments.map((comment) => (
              <CommentBox
                key={comment.id}
                commentId={comment.id}
                username={comment.username}
                content={comment.content}
                user_id={comment.user_id}
                created_at={comment.created_at}
                isOwner={comment.user_id === currentUserId}
              />
            ))
          }
        </Box>
      </Box>
    </Box>
  );
}
