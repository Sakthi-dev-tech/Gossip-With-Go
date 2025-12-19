import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import UpdateCommentModal from "./UpdateCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";

interface CommentBoxProps {
  commentId: number;
  username: string;
  content: string;
  user_id: number;
  created_at: string;
  isOwner?: boolean;
}

export default function CommentBox({
  commentId,
  username,
  content,
  isOwner = false,
}: CommentBoxProps) {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleUpdate = (id: number, updatedContent: string) => {
    // TODO: Call API to update comment
    console.log("Update comment:", id, updatedContent);
  };

  const handleDeleteConfirm = (id: number) => {
    // TODO: Call API to delete comment
    console.log("Delete comment:", id);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 3,
          p: 3,
          mb: 2,
          position: "relative",
        }}
      >
        {/* Edit/Delete Icons - Only visible if user is owner */}
        {isOwner && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setOpenUpdateModal(true)}
              sx={{
                backgroundColor: "rgba(74, 144, 226, 0.2)",
                color: "primary.main",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(74, 144, 226, 0.4)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpenDeleteModal(true)}
              sx={{
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                color: "error.main",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.4)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, fontSize: "0.95rem" }}
          >
            {username}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.6, pr: isOwner ? 8 : 0 }}
        >
          {content}
        </Typography>
      </Box>

      {/* Modals */}
      <UpdateCommentModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        commentId={commentId}
        currentContent={content}
        onUpdate={handleUpdate}
      />

      <DeleteCommentModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        commentId={commentId}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}
