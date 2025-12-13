import { useState } from "react";
import { Button, Card, TextField, Typography, Box, Fade } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [visible, setVisible] = useState(true);

  const { login } = useAuth();

  // Handle transition between Login and Register
  const handleToggle = () => {
    setVisible(false);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setVisible(true);
    }, 300); // Wait for the fade-out animation to finish
  };

  return (
    <div className="background">
      <Fade in={visible} timeout={300}>
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
            backgroundColor: "background.paper",
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
              {isLogin ? "Welcome Back." : "Join The Conversation."}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {isLogin
                ? "Login to continue gossiping."
                : "Create an account to start gossiping."}
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Username"
              variant="outlined"
              color="secondary"
              required
              fullWidth
              autoFocus={visible}
            />
            <TextField
              label="Password"
              variant="outlined"
              color="secondary"
              type="password"
              required
              fullWidth
            />
          </Box>

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
            onClick={() => {
              login("token");
            }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Box
                component="span"
                onClick={handleToggle}
                sx={{
                  color: "secondary.main",
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                    color: "secondary.light",
                  },
                }}
              >
                {isLogin ? "Register" : "Login"}
              </Box>
            </Typography>
          </Box>
        </Card>
      </Fade>
    </div>
  );
}
