import { Box, Button, Grid, Typography } from "@mui/material";
import FloatingAppBar from "../components/FloatingAppBar";
import TopicsBox from "../components/TopicsBox";

export default function TopicsPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Floating app bar with welcome message and sign out*/}
      <FloatingAppBar username="User" />

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

          <Button sx={{ color: "secondary.main" }}>Create Topic</Button>
        </Box>

        <Box sx={{ flexGrow: 1, px: 4 }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={6}>
              <TopicsBox
                title="Advanced Patterns"
                description="Exploring advanced concurrency patterns in Go."
                postCount={28}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Microservices with Go"
                description="Building scalable microservices using Go and gRPC."
                postCount={56}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Go Internals"
                description="Understanding the Go runtime, garbage collector, and scheduler."
                postCount={15}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Advanced Patterns"
                description="Exploring advanced concurrency patterns in Go."
                postCount={28}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Microservices with Go"
                description="Building scalable microservices using Go and gRPC."
                postCount={56}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Go Internals"
                description="Understanding the Go runtime, garbage collector, and scheduler."
                postCount={15}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Advanced Patterns"
                description="Exploring advanced concurrency patterns in Go."
                postCount={28}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Microservices with Go"
                description="Building scalable microservices using Go and gRPC."
                postCount={56}
              />
            </Grid>
            <Grid size={6}>
              <TopicsBox
                title="Go Internals"
                description="Understanding the Go runtime, garbage collector, and scheduler."
                postCount={15}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
