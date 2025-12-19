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

interface CreateTopicModalProps {
  open: boolean;
  onClose: () => void;
  onTopicCreated?: () => void;
}

export default function CreateTopicModal({
  open,
  onClose,
  onTopicCreated,
}: CreateTopicModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleCreateTopic(): Promise<void> {
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate input
    if (!title.trim()) {
      setErrorMessage("Please Enter A Title");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/addTopic`,
        {
          method: "POST",
          body: JSON.stringify({
            name: title,
            description: description,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        // Clear form
        setTitle("");
        setDescription("");

        setSuccessMessage("Topic Created Successfully!");

        // Notify parent to refresh
        if (onTopicCreated) {
          onTopicCreated();
        }

        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        const errorData = await response.text();
        setErrorMessage(capitaliseWords(errorData || "Failed To Create Topic"));
      }
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An Unexpected Error Occurred";
      setErrorMessage(capitaliseWords(errMsg));
      console.error("Error creating topic:", error);
    }
  }

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
          Create New Topic
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
            Title
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., Best Practices for Go Concurrency"
            variant="outlined"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 3,
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
            Description (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Provide a brief summary of what this topic is about..."
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          onClick={handleCreateTopic}
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
          Create Topic
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
