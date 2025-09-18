import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import HomePage from "./pages/home/HomePage";
import EditorPage from "./pages/editor/EditorPage";

const theme = createTheme({
  palette: {
    primary: { main: "#1d6b60" },
    secondary: { main: "#2aa27f" },
    background: { default: "#f6fbf9" },
  },
  shape: { borderRadius: 14 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/editor" element={<EditorPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}