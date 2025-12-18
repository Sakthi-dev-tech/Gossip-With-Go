import { Typography, Card, CardContent, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../functions/Cookies";
import { getRelativeTime } from "../functions/TimeFormatter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateTopicModal from "./UpdateTopicModal";
import DeleteTopicModal from "./DeleteTopicModal";

interface TopicsBoxProps {
  title?: string;
  description?: string;
  createdAt?: string;
  user_id: number;
  username: string;
  topicId?: number;
  onTopicChanged?: () => void;
}

// Interface for JWT payload
interface JWTPayload {
  user_id: number;
  username: string;
  exp: number;
}

export default function TopicsBox({
  title,
  description,
  createdAt,
  user_id,
  username,
  topicId,
  onTopicChanged,
}: TopicsBoxProps) {
  const navigate = useNavigate();
  const [isOP, setIsOP] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    // Get JWT token from access_token cookie
    const token = getCookie("access_token");
    if (token) {
      try {
        // Decode the JWT token to get the userID
        const decoded = jwtDecode<JWTPayload>(token);
        // Check if the current user is the OP of this topic
        setIsOP(decoded.user_id === user_id);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }, [user_id]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    setOpenUpdateModal(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    setOpenDeleteModal(true);
  };

  const handleUpdate = async (
    id: number,
    updatedTitle: string,
    updatedDescription: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/updateTopic`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: updatedTitle,
            description: updatedDescription,
            id: id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Update topic:", id, updatedTitle, updatedDescription);
        // Notify parent to refresh topics list
        if (onTopicChanged) {
          onTopicChanged();
        }
      }
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/deleteTopic`,
        {
          method: "DELETE",
          body: JSON.stringify({
            id: id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Delete topic:", id);
        // Notify parent to refresh topics list
        if (onTopicChanged) {
          onTopicChanged();
        }
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 4,
          padding: 3,
          boxSizing: "border-box",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          position: "relative",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            border: "1px solid rgba(74, 144, 226, 0.3)",
          },
        }}
        elevation={0}
        onClick={() => navigate(
          "/posts",
          {
            state: { topicId }
          }
        )}
      >
        {/* Edit and Delete Icons - Only visible if user is owner */}
        {isOP && (
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
              onClick={handleEdit}
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
              onClick={handleDelete}
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

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "0 !important",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              flex: 1,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "secondary.main",
              fontWeight: 600,
              mt: 2,
              display: "block",
              fontSize: "0.85rem",
            }}
          >
            Created by {username} •{" "}
            {createdAt ? getRelativeTime(createdAt) : "recently"}
          </Typography>
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdateTopicModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        topicId={topicId}
        currentTitle={title}
        currentDescription={description}
        onUpdate={handleUpdate}
      />

      <DeleteTopicModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        topicId={topicId}
        topicName={title}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}
