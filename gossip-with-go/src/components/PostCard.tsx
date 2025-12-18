import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router";
import { useState } from "react";
import UpdatePostModal from "./UpdatePostModal";
import DeletePostModal from "./DeletePostModal";
import { Post } from "../types/Posts";
import { getRelativeTime } from "../functions/TimeFormatter";

interface PostCardProps {
  post: Post;
  topicName?: string;
}

export default function PostCard({ post, topicName }: PostCardProps) {
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

  const formattedDate = getRelativeTime(post.created_at);

  return (
    <>
      <Card
        sx={{
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 4,
          mb: 3,
          overflow: "visible",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "& .action-buttons": {
              opacity: 1,
            },
          },
        }}
        elevation={0}
      >
        <CardContent sx={{ p: 3.5, "&:last-child": { pb: 3.5 } }}>
          {/* Header: Author & Meta */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {post.username}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon
                    sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {formattedDate}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {topicName && (
              <Chip
                label={topicName}
                size="small"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "text.secondary",
                  borderRadius: "8px",
                  height: 24,
                  fontSize: "0.75rem",
                }}
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                mb: 1.5,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              {post.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.content}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(`/post`, { state: { post_id: post.id } })}
              sx={{
                color: "secondary.main",
                fontWeight: 600,
                textTransform: "none",
                p: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  color: "secondary.light",
                  textDecoration: "underline",
                },
              }}
            >
              Read full post
            </Button>

            <Box
              className="action-buttons"
              sx={{
                opacity: { xs: 1, md: 0.7 },
                transition: "opacity 0.2s",
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setOpenUpdateModal(true)}
                sx={{
                  color: "text.secondary",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  "&:hover": {
                    color: "primary.main",
                    borderColor: "primary.main",
                    bgcolor: "rgba(56, 189, 248, 0.08)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setOpenDeleteModal(true)}
                sx={{
                  color: "text.secondary",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  "&:hover": {
                    color: "error.main",
                    borderColor: "error.main",
                    bgcolor: "rgba(239, 68, 68, 0.08)",
                  },
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
        postId={post.id.toString()}
        currentTitle={post.title}
        currentContent={post.content}
        topicName={topicName}
        onUpdate={handleUpdate}
      />

      <DeletePostModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        postId={post.id.toString()}
        postTitle={post.title}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}
