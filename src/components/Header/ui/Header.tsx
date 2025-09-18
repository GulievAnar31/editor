import {
    AppBar,
    Box,
    Container,
    Toolbar,
} from "@mui/material";
import Logo from "../../../assets/logo.svg";

export function Header() {
    return (
        <Box component="header" sx={{ position: "sticky", top: 0, zIndex: (t) => t.zIndex.appBar }}>
            <AppBar
                elevation={0}
                position="static"
                sx={{
                    bgcolor: "primary.main",
                    backgroundImage:
                        "radial-gradient(1200px 200px at 50% 0%, rgba(255,255,255,0.08), transparent)",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ minHeight: 64 }}>
                        <Box
                            component="img"
                            src={Logo}
                            alt="ITMO"
                            sx={{ height: 32, mx: "auto" }}
                        />
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}