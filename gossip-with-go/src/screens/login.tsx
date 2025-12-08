import { Button, Card, TextField, Typography, Box } from "@mui/material";

export default function LoginPage() {
  return (
    <div className="background">
      <Card
        variant="elevation"
        elevation={8}
        sx={{
          width: { xs: "90vw", sm: "70vw", md: "50vw", lg: "40vw" },
          maxWidth: "500px",
          padding: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Join The Conversation.
          </Typography>
        </Box>

        <TextField
          label="Username"
          variant="outlined"
          color="secondary"
          required
          fullWidth
          autoFocus
          sx={{ mb: 1 }}
        />

        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Join
        </Button>
      </Card>
    </div>
  );
}
