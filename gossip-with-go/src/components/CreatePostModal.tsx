import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  topicName?: string;
  topicId: number;
}

export default function CreatePostModal({
  open,
  onClose,
  topicName,
  topicId
}: CreatePostModalProps) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function createPost() {
    await fetch(`${process.env.REACT_APP_API_URL}/addPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "title": title,
        "content":content,
        "topic_id": topicId
      }),
      credentials: "include",
    });

    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#111827",
          backgroundImage: "none",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Darkened backdrop
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
          Create a New Post
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 4, pt: 1 }}>
        <Box sx={{ mt: 2 }}>
          {topicName && (
            <Typography
              variant="subtitle2"
              sx={{ color: "secondary.main", mb: 2 }}
            >
              Posting in: {topicName}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., What's new in the latest Go release?"
            variant="outlined"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 3,
              // Target the root container of the OutlinedInput
              "& .MuiOutlinedInput-root": { 
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white", // text colour
                // Target the border on hover
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                // Target the border when the input is focused
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                },
              },
              // Style the placeholder text
              "& input::placeholder": {
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Content
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your thoughts, details, and links here..."
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                },
              },
              "& textarea::placeholder": {
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
            mr: 1,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "white",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={createPost}
          sx={{
            backgroundColor: "secondary.main",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            borderRadius: 1.5,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "secondary.dark",
              boxShadow: "none",
            },
          }}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}
