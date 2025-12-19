import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import UpdatePostModal from "./UpdatePostModal";
import DeletePostModal from "./DeletePostModal";
import { Post } from "../types/Posts";
import { getRelativeTime } from "../functions/TimeFormatter";
import { getCookie } from "../functions/Cookies";

// Interface for JWT payload
interface JWTPayload {
  user_id: number;
  username: string;
  exp: number;
}

interface PostCardProps {
  title: string;
  content: string;
  id: number;
  username: string;
  user_id: number;
  created_at: string;
  onPostChanged?: () => void;
}

export default function PostCard({ title, content, id, username, user_id, created_at, onPostChanged }: PostCardProps) {
  const navigate = useNavigate();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  const currentUserId = getCurrentUserId();
  const isOwner = currentUserId !== null && currentUserId === user_id;

  const handleUpdate = async (
    id: number,
    updatedTitle: string,
    updatedContent: string
  ) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/updatePost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "title": updatedTitle, "content": updatedContent, "id": id }),
      credentials: "include",
    });
    // Refresh the posts list after update
    onPostChanged?.();
  };

  const handleDeleteConfirm = async (id: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/deletePost`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "id": id }),
      credentials: "include",
    });
    // Refresh the posts list after delete
    onPostChanged?.();
  };

  const formattedDate = getRelativeTime(created_at);

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
                  {username}
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
              {title}
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
              {content}
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
              onClick={() => navigate(`/post`, {
                state: {
                  post_id: id,
                  title: title,
                  content,
                  username,
                  user_id,
                  created_at
                }
              })}
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

            {isOwner && (
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
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdatePostModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        postId={id}
        currentTitle={title}
        currentContent={content}
        topicName={title}
        onUpdate={handleUpdate}
      />

      <DeletePostModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        postId={id}
        postTitle={title}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}
