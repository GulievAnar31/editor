// pages/home/HomePage.tsx
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { usePreviewItems } from "../../components/PreviewCard/hooks/usePreviewItems";
import { AddUrlForm } from "../../components/AddUrlForm";
import { PreviewCard } from "../../components/PreviewCard";

const DEFAULT_URLS = [
    "https://www.nur.kz/nurfin/banks/2287665-tri-kita-cifrovogo-faktoringa-udobstvo-dostupnost-operativnost/",
    "https://www.nur.kz/family/gloss/2211650-ot-geroya-lyubovnika-do-umpa-lumpy-luchshie-roli-hyu-granta-i-ego-zhiznennyy-put/",
    "https://www.nur.kz/incident/emergency/2287635-bliznecov-nelzya-razluchat-semya-pogibshego-v-armii-srochnika-obratilas-k-tokaevu/",
];

export default function HomePage() {
    const { items, addItem } = usePreviewItems(DEFAULT_URLS);

    return (
        <Box component="main" sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main" }}>
                        Импорт из интернета
                    </Typography>
                    <Typography color="text.secondary">
                        Добавьте публичный URL — мы подхватим превью. Кликните карточку, чтобы открыть в редакторе.
                    </Typography>
                    <AddUrlForm onAdd={addItem} />
                </Stack>

                <Grid container spacing={2.5}>
                    {items.map((it) => (
                        <Grid key={it.url}>
                            <PreviewCard item={it} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}