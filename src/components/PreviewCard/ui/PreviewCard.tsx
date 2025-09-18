import {
    Card, CardActionArea, CardContent, CardMedia, Chip,
    Stack, Typography, Box, Skeleton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PreviewItem } from "../hooks/usePreviewItems";

export const PreviewCard: React.FC<{ item: PreviewItem }> = ({ item }) => {
    const navigate = useNavigate();
    const accent = { bg: "linear-gradient(135deg, #1d6b60 0%, #2aa27f 100%)" };

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                border: (t) => `1px solid ${t.palette.divider}`,
                transition: "transform .15s ease, box-shadow .15s ease",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 8 },
            }}
            elevation={0}
        >
            <CardActionArea
                onClick={() => navigate(`/editor?url=${encodeURIComponent(item.url)}`)}
                disabled={!!item.error || !!item.loading}
                sx={{ height: "100%", alignItems: "stretch" }}
            >
                {item.loading ? (
                    <Skeleton variant="rectangular" height={180} />
                ) : item.image ? (
                    <CardMedia component="img" height="180" image={item.image} alt={item.title || item.url} />
                ) : (
                    <Box sx={{
                        height: 180, background: accent.bg, display: "grid",
                        placeItems: "center", color: "white", fontWeight: 700, letterSpacing: .5
                    }}>
                        PREVIEW
                    </Box>
                )}

                <CardContent sx={{ minHeight: 140 }}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {item.title || item.url}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}>
                            {item.error ? item.error : (item.description || "Описание не найдено")}
                        </Typography>
                        <Chip
                            label={new URL(item.url).hostname}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ alignSelf: "flex-start" }}
                        />
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
