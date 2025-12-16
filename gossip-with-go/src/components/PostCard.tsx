import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { useState } from "react";
import UpdatePostModal from "./UpdatePostModal";
import DeletePostModal from "./DeletePostModal";

interface PostCardProps {
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  commentCount: number;
  postId?: string;
  topicName?: string;
}

export default function PostCard({
  author,
  timeAgo,
  title,
  content,
  commentCount,
  postId = "",
  topicName,
}: PostCardProps) {
  const navigate = useNavigate();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleUpdate = (
    id: string,
    updatedTitle: string,
    updatedContent: string
  ) => {
    // TODO: Call API to update post
    console.log("Update post:", id, updatedTitle, updatedContent);
  };

  const handleDeleteConfirm = (id: string) => {
    // TODO: Call API to delete post
    console.log("Delete post:", id);
  };
  return (
    <>
      <Card
        sx={{
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 3,
          mb: 2,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          },
        }}
        elevation={0}
      >
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
          {/* Author and Time */}
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mb: 1,
              fontSize: "0.85rem",
            }}
          >
            {author} • {timeAgo}
          </Typography>

          {/* Title */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
              fontSize: "1.25rem",
            }}
          >
            {title}
          </Typography>

          {/* Content Preview */}
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {content}
          </Typography>

          {/* Footer Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              component="button"
              underline="none"
              sx={{
                color: "secondary.main",
                fontWeight: 600,
                fontSize: "0.9rem",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => {
                navigate(`/post`);
              }}
            >
              Read Comments ({commentCount})
            </Link>

            <Box>
              <IconButton
                size="small"
                onClick={() => setOpenUpdateModal(true)}
                sx={{
                  color: "text.secondary",
                  mr: 1,
                  "&:hover": { color: "text.primary" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setOpenDeleteModal(true)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdatePostModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        postId={postId}
        currentTitle={title}
        currentContent={content}
        topicName={topicName}
        onUpdate={handleUpdate}
      />

      <DeletePostModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        postId={postId}
        postTitle={title}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}
