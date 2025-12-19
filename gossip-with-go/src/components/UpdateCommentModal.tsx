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
import CustomSnackbar from "./CustomSnackbar";
import { capitaliseWords } from "../functions/TextFormatter";

interface UpdateCommentModalProps {
  open: boolean;
  onClose: () => void;
  commentId: number;
  currentContent?: string;
  onUpdate: (commentId: number, content: string) => void;
}

export default function UpdateCommentModal({
  open,
  onClose,
  commentId,
  currentContent = "",
  onUpdate,
}: UpdateCommentModalProps) {
  const [updatedContent, setUpdatedContent] = useState(currentContent);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate input
    if (!updatedContent.trim()) {
      setErrorMessage("Please Enter Content");
      return;
    }

    try {
      await onUpdate(commentId, updatedContent);
      setSuccessMessage("Comment Updated Successfully!");

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An Unexpected Error Occurred";
      setErrorMessage(capitaliseWords(errMsg));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#111827", // Dark background
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
          Update Comment
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 4, pt: 1 }}>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Comment
          </Typography>
          <TextField
            id="comment-content"
            fullWidth
            multiline
            rows={4}
            defaultValue={currentContent}
            placeholder="Share your thoughts..."
            variant="outlined"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
                },
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
          onClick={handleUpdate}
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
          Update
        </Button>
      </DialogActions>

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
    </Dialog>
  );
}
