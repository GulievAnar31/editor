import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DocumentEditor } from "./components/DocumentEditor";

const theme = createTheme({
  palette: {
    primary: { main: "#1d6b60" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            py: 4,
            minHeight: 0,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
          >
            <DocumentEditor />
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;