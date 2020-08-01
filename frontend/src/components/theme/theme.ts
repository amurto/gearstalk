interface Theme {
  palette: { [key: string]: { [key: string]: string } };
}

export const customTheme: Theme = {
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paper: "#1c233e",
      default: "#001f42",
    },
    primary: {
      light: "rgba(133, 59, 188, 1)",
      main: "#2db1e1",
      dark: "rgba(21, 0, 93, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fff",
      main: "#4c02ad",
      dark: "rgba(166, 0, 173, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "#2db1e1",
      secondary: "#2db1e1",
      disabled: "#000",
      hint: "#000",
    },
  },
};
