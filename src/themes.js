import { createTheme, styled, Typography } from "@mui/material";

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#191970",
    },
    secondary: {
      main: "#ffd700",
    },
    backgroundColor: "#eeeeee",
  },
});

export const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBlock: "2rem",
}));
