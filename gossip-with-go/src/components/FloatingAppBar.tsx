import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../functions/Cookies";

interface FloatingAppBarProps {
  username?: string;
}

// Interface for JWT payload
interface JWTPayload {
  userID: number;
  username: string;
  exp: number;
}

export default function FloatingAppBar({
  username: usernameProp,
}: FloatingAppBarProps) {
  const { logout } = useAuth();
  const [username, setUsername] = useState<string>(usernameProp || "Gossiper");

  useEffect(() => {
    // Get JWT token from localStorage during production or cookie
    const token = localStorage.getItem("access_token") || getCookie("access_token");
    if (token) {
      try {
        // Decode the JWT token to get the username
        const decoded = jwtDecode<JWTPayload>(token);
        if (decoded.username) {
          setUsername(decoded.username);
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        // Fall back to prop or default if token can't be decoded
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="absolute"
      elevation={4}
      sx={{
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        maxWidth: "1400px",
        borderRadius: 3,
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1,
        }}
      >
        {/* Left side - App name */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            letterSpacing: "-0.5px",
          }}
        >
          Gossip With Go
        </Typography>

        {/* Right side - User info and logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              px: 2,
              py: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Welcome,{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                {username}
              </Typography>
            </Typography>
          </Box>

          {/* Logout button */}
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "text.primary",
              px: 2,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              minWidth: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "orangered",
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
