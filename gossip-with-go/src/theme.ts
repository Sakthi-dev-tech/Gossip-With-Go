import { createTheme } from "@mui/material/styles";

// Centralized color palette
export const colours = {
  background: {
    primary: "#111922",
    secondary: "#0e141a",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b0b0b0",
  },
  primary: {
    main: "#4a90e2",
    light: "#6ba3e8",
    dark: "#3a7bc8",
  },
  secondary: {
    main: "#f39c12",
    light: "#f5b041",
    dark: "#d68910",
  },
};

// Material-UI theme
export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colours.background.primary,
      paper: colours.background.secondary,
    },
    text: {
      primary: colours.text.primary,
      secondary: colours.text.secondary,
    },
    primary: {
      main: colours.primary.main,
      light: colours.primary.light,
      dark: colours.primary.dark,
    },
    secondary: {
      main: colours.secondary.main,
      light: colours.secondary.light,
      dark: colours.secondary.dark,
    },
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
