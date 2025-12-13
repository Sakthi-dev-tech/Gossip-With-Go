import { useState } from "react";
import {
  Button,
  Card,
  TextField,
  Typography,
  Box,
  Fade,
  Collapse,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [visible, setVisible] = useState(true);

  const { login } = useAuth();

  // Handle transition between Login and Register
  const handleToggle = () => {
    setVisible(false);
    setUsername("");
    setPassword("");
    setErrorMessage("");
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
              value={username}
              autoFocus={visible}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              color="secondary"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          {/* Error Message Display */}
          <Collapse in={!!errorMessage}>
            <Alert
              severity="error"
              onClose={() => setErrorMessage("")}
              sx={{
                borderRadius: 2,
                animation: errorMessage ? "shake 0.3s" : "none",
                "@keyframes shake": {
                  "0%, 100%": { transform: "translateX(0)" },
                  "25%": { transform: "translateX(-5px)" },
                  "75%": { transform: "translateX(5px)" },
                },
              }}
            >
              {/* make only the starting letter of each word uppercase */}
              {errorMessage
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </Alert>
          </Collapse>

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
            onClick={async () => {
              // Clear previous error message when user tries again
              setErrorMessage("");

              // Validate that username and password are not empty
              if (!username.trim()) {
                setErrorMessage("Please enter a username");
                return;
              }

              if (!password.trim()) {
                setErrorMessage("Please enter a password");
                return;
              }

              try {
                const result = await login(username, password);
                if (result !== "success") {
                  // Display error message on the page
                  setErrorMessage(result);
                  console.error("Login failed:", result);
                }
              } catch (error) {
                const errMsg =
                  error instanceof Error
                    ? error.message
                    : "An unexpected error occurred";
                setErrorMessage(errMsg);
                console.error("Login error:", error);
              }
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
