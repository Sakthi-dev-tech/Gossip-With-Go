import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FloatingAppBar from "../components/FloatingAppBar";
import TopicsBox from "../components/TopicsBox";
import CreateTopicModal from "../components/CreateTopicModal";
import { useEffect, useState } from "react";
import { Topic } from "../types/Topics";
import CustomSnackbar from "../components/CustomSnackbar";
import { capitaliseWords } from "../functions/TextFormatter";
import { authenticatedFetch } from "../functions/AuthenticatedFetch";

export default function TopicsPage() {
  const [openCreateTopic, setOpenCreateTopic] = useState<boolean>(false);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTopics = async () => {
    try {
      const response = await authenticatedFetch(
        `${process.env.REACT_APP_API_URL}/fetchTopics`
      );

      if (!response.ok) {
        const errorData = await response.text();
        setErrorMessage(capitaliseWords(errorData || "Failed To Fetch Topics"));
        return;
      }

      const data = await response.json();
      if (data === null) {
        return;
      }
      setAllTopics(data);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "An Unexpected Error Occurred";
      setErrorMessage(capitaliseWords(errMsg));
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
            px: { xs: 2, sm: 3, md: 6 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 24, sm: 28, md: 32 },
              py: { xs: 1, md: 2 },
              color: "text.primary",
            }}
          >
            Topics
          </Typography>

          <Button
            sx={{
              color: "secondary.main",
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              px: { xs: 1.5, sm: 2, md: 3 },
              py: { xs: 0.5, sm: 1 },
            }}
            onClick={() => setOpenCreateTopic(true)}
          >
            Create Topic
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ px: 2, mb: 4 }}>
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

        <Box sx={{ flexGrow: 1, px: 2 }}>
          {/* Topics Grid */}
          {/* dynamically returns the required number of columns depending on
          number of topics and screen width */}
          {(() => {
            const filteredTopics = allTopics
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .filter((topic) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  topic.name.toLowerCase().includes(query) ||
                  topic.description.toLowerCase().includes(query) ||
                  topic.username.toLowerCase().includes(query)
                );
              });

            const topicCount = filteredTopics.length;

            return (
              <Grid
                container
                alignItems={"center"}
                spacing={{ xs: 2, sm: 2, md: 3, lg: 4 }}
                // sets the number of columns based on the number of topics
                columns={{
                  xs: Math.min(topicCount, 1) * 12,
                  sm: Math.min(topicCount, 2) * 6,
                  md: Math.min(topicCount, 3) * 4,
                }}
                sx={{ flexGrow: 1 }}
              >
                {filteredTopics.map((topic) => (
                  // make each topic take up the same amount of columns
                  // out of the total above
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.id}>
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
            );
          })()}
        </Box>
      </Box>

      <CustomSnackbar
        open={!!errorMessage}
        handleClose={() => setErrorMessage("")}
        message={errorMessage}
        severity="error"
      />
    </Box>
  );
}
