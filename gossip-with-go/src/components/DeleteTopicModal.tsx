import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface DeleteTopicModalProps {
  open: boolean;
  onClose: () => void;
  topicId?: string;
  topicName?: string;
  onDelete?: (topicId: string) => void;
}

export default function DeleteTopicModal({
  open,
  onClose,
  topicId = "",
  topicName = "this topic",
  onDelete,
}: DeleteTopicModalProps) {
  const handleDelete = () => {
    if (onDelete && topicId) {
      onDelete(topicId);
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
          border: "1px solid rgba(239, 68, 68, 0.3)", // Red border for warning
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#ef4444", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
            Delete Topic
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pb: 4, pt: 1 }}>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "secondary.main" }}
            >
              {topicName}
            </Box>
            ?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: 1.6,
            }}
          >
            This action cannot be undone. All posts and comments associated with
            this topic will also be deleted permanently.
          </Typography>
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
          onClick={handleDelete}
          sx={{
            backgroundColor: "#ef4444",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            borderRadius: 1.5,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#dc2626",
              boxShadow: "none",
            },
          }}
        >
          Delete Topic
        </Button>
      </DialogActions>
    </Dialog>
  );
}
