import {
    AppBar,
    Box,
    Container,
    Link,
    Toolbar,
} from "@mui/material";

export function Footer() {
    return (
        <Box component="footer" sx={{ mt: "auto" }}>
            <AppBar
                elevation={0}
                position="static"
                sx={{
                    bgcolor: "primary.main",
                    backgroundImage:
                        "radial-gradient(1200px 200px at 50% 100%, rgba(255,255,255,0.08), transparent)",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: 56,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Link
                            href="/faq"
                            underline="hover"
                            color="inherit"
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                        >
                            FAQ
                        </Link>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}