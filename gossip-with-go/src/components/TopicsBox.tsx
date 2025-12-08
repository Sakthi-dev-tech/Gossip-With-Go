import { Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router";

interface TopicsBoxProps {
  title?: string;
  description?: string;
  createdAgo?: string;
  postCount?: number;
}

export default function TopicsBox({
  title = "Latest Go 1.21 Features",
  description = "A deep dive into the new features and improvements in the latest version of Go.",
  createdAgo = "2 days ago",
  postCount = 42,
}: TopicsBoxProps) {
  const navigate = useNavigate();

  return (
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
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          border: "1px solid rgba(74, 144, 226, 0.3)",
        },
      }}
      elevation={0}
      onClick={() => navigate("/post")}
    >
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
          Created: {createdAgo} • Posts: {postCount}
        </Typography>
      </CardContent>
    </Card>
  );
}
