import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FloatingAppBar from "../components/FloatingAppBar";
import CommentBox from "../components/CommentBox";
import { useLocation, useNavigate } from "react-router-dom";
import { getRelativeTime } from "../functions/TimeFormatter";
import { Comment } from "../types/Comments";
import { useEffect, useState } from "react";
import { getCookie } from "../functions/Cookies";
import { jwtDecode } from "jwt-decode";
import CustomSnackbar from "../components/CustomSnackbar";
import { capitaliseWords } from "../functions/TextFormatter";
import { authenticatedFetch } from "../functions/AuthenticatedFetch";

// Interface for JWT payload
interface JWTPayload {
  user_id: number;
  username: string;
  exp: number;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    title,
    content,
    username,
    user_id,
    created_at,
    post_id,
    topic_title,
    topic_description,
  } = location.state;

  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formattedDate = getRelativeTime(created_at);

  // Get current user ID from JWT token
  const getCurrentUserId = (): number | null => {
    const token =
      localStorage.getItem("access_token") || getCookie("access_token");
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
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate input
    if (!comment.trim()) {
      setErrorMessage("Please Enter A Comment");
      return;
    }

    try {
      const response = await authenticatedFetch(
        `${process.env.REACT_APP_API_URL}/addComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment, post_id: post_id }),
        }
      );

      if (response.ok) {
        setComment("");
        setSuccessMessage("Comment Posted Successfully!");
        fetchComments();
      } else {
        const errorData = await response.text();
        setErrorMessage(capitaliseWords(errorData || "Failed To Post Comment"));
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "An Unexpected Error Occurred";
      setErrorMessage(capitaliseWords(errMsg));
      console.error("Error posting comment:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await authenticatedFetch(
        `${process.env.REACT_APP_API_URL}/fetchComments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: post_id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data !== null) {
          setComments(data);
        } else {
          setComments([]);
        }
      } else {
        const errorData = await response.text();
        setErrorMessage(
          capitaliseWords(errorData || "Failed To Fetch Comments")
        );
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "An Unexpected Error Occurred";
      setErrorMessage(capitaliseWords(errMsg));
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
        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
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
          {topic_title && (
            <Box
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "secondary.main",
                  fontWeight: 600,
                  letterSpacing: 1,
                  fontSize: "0.75rem",
                }}
              >
                Topic
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  fontWeight: 700,
                  mb: topic_description ? 0.5 : 0,
                }}
              >
                {topic_title}
              </Typography>
              {topic_description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                  }}
                >
                  {topic_description}
                </Typography>
              )}
            </Box>
          )}

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

          {comments
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((comment) => (
              <CommentBox
                key={comment.id}
                commentId={comment.id}
                username={comment.username}
                content={comment.content}
                user_id={comment.user_id}
                created_at={comment.created_at}
                isOwner={comment.user_id === currentUserId}
                refreshComments={fetchComments}
              />
            ))}
        </Box>
      </Box>

      <CustomSnackbar
        open={!!errorMessage}
        handleClose={() => setErrorMessage("")}
        message={errorMessage}
        severity="error"
      />
      <CustomSnackbar
        open={!!successMessage}
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
        severity="success"
      />
    </Box>
  );
}
