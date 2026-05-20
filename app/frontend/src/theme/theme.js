import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#aa5c93",
    },

    secondary: {
      main: "#e2d2d2",
    },

    background: {
      default: "#7a2869",
      paper: "#a01919",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",
  },

  shape: {
    borderRadius: 16,
  },
});

export default theme;
