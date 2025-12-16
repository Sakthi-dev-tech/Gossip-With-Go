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

interface UpdateTopicModalProps {
  open: boolean;
  onClose: () => void;
  topicId?: number;
  currentTitle?: string;
  currentDescription?: string;
  onUpdate?: (topicId: number, title: string, description: string) => void;
}

export default function UpdateTopicModal({
  open,
  onClose,
  topicId,
  currentTitle = "",
  currentDescription = "",
  onUpdate,
}: UpdateTopicModalProps) {
  const handleUpdate = () => {
    if (onUpdate && topicId) {
      const title =
        (document.getElementById("topic-title") as HTMLInputElement)?.value ||
        "";
      const description =
        (document.getElementById("topic-description") as HTMLInputElement)
          ?.value || "";
      onUpdate(topicId, title, description);
    }
    onClose();
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
          Update Topic
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
            Topic Title
          </Typography>
          <TextField
            id="topic-title"
            fullWidth
            defaultValue={currentTitle}
            placeholder="e.g., Go Concurrency Patterns"
            variant="outlined"
            size="small"
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
            Description
          </Typography>
          <TextField
            id="topic-description"
            fullWidth
            multiline
            rows={4}
            defaultValue={currentDescription}
            placeholder="Describe what this topic is about..."
            variant="outlined"
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
    </Dialog>
  );
}
