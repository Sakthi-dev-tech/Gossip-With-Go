import { Box, Button, Grid, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FloatingAppBar from "../components/FloatingAppBar";
import TopicsBox from "../components/TopicsBox";
import CreateTopicModal from "../components/CreateTopicModal";
import { useEffect, useState } from "react";
import { Topic } from "../types/Topics";

export default function TopicsPage() {
  const [openCreateTopic, setOpenCreateTopic] = useState<boolean>(false);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      if (data === null) {
        return;
      }
      setAllTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  // fetch topics on first load
  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Floating app bar with welcome message and sign out*/}
      <FloatingAppBar username="User" />

      <CreateTopicModal
        open={openCreateTopic}
        onClose={() => setOpenCreateTopic(false)}
        onTopicCreated={fetchTopics}
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

        {/* Search Bar */}
        <Box sx={{ px: 6, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search topics by name, description, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.main",
                },
              },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, px: 4 }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {allTopics
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .filter((topic) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  topic.name.toLowerCase().includes(query) ||
                  topic.description.toLowerCase().includes(query) ||
                  topic.username.toLowerCase().includes(query)
                );
              })
              .map((topic) => (
                <Grid size={6} key={topic.id}>
                  <TopicsBox
                    topicId={topic.id}
                    title={topic.name}
                    description={topic.description}
                    user_id={topic.user_id}
                    username={topic.username}
                    createdAt={topic.created_at}
                    onTopicChanged={fetchTopics}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
