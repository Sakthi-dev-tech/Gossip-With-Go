import { Box, Button, Grid, Typography } from "@mui/material";
import FloatingAppBar from "../components/FloatingAppBar";
import TopicsBox from "../components/TopicsBox";
import CreateTopicModal from "../components/CreateTopicModal";
import { useEffect, useState } from "react";
import { Topic } from "../types/Topics";

export default function TopicsPage() {
  const [openCreateTopic, setOpenCreateTopic] = useState<boolean>(false);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchTopics`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data: ", data);
        setAllTopics(data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Floating app bar with welcome message and sign out*/}
      <FloatingAppBar username="User" />

      <CreateTopicModal
        open={openCreateTopic}
        onClose={() => setOpenCreateTopic(false)}
      />

      {/* Main content area */}
      <Box sx={{ flex: 1, mt: 12, px: "10%", pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            px: 6,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 32,
              py: 2,
              color: "text.primary",
            }}
          >
            Topics
          </Typography>

          <Button
            sx={{ color: "secondary.main" }}
            onClick={() => setOpenCreateTopic(true)}
          >
            Create Topic
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1, px: 4 }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {allTopics.map((topic) => (
              <Grid size={6} key={topic.id}>
                <TopicsBox
                  topicId={topic.id.toString()}
                  title={topic.name}
                  description={topic.description}
                  user_id={topic.user_id}
                  createdAt={topic.created_at}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
