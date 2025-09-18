import { Card, Container, Divider, Box, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
    header: ReactNode;
    children: ReactNode;
    footerHintLeft?: string;
    footerHintRight?: string;
};

export function EditorFrame({
    header,
    children,
    footerHintLeft = "⌘/Ctrl + S — сохранить",
    footerHintRight = "Markdown экспорт — через кнопку «Log»",
}: Props) {
    return (
        <Container
            maxWidth="lg"
            // контейнер растягивается вместе с основной областью страницы
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                py: 3,
                minHeight: 0, // обязательно, чтобы внутренние элементы могли занимать 100% высоты
            }}
        >
            <Card
                elevation={8}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: (t) =>
                        t.palette.mode === "dark" ? "background.paper" : "grey.50",
                    border: (t) => `1px solid ${t.palette.divider}`,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,      // карточка тянется
                    minHeight: 0, // и позволяет дочерним блокам занимать всю высоту
                }}
            >
                {/* верхняя панель (передаётся готовым ReactNode) */}
                {header}

                {/* контентная зона: растягивается и может скроллиться внутри (если ребёнок так настроен) */}
                <Box
                    component="section"
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {children}
                </Box>

                {/* футер карточки — всегда внизу */}
                <Divider />
                <Box
                    component="footer"
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        {footerHintLeft}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {footerHintRight}
                    </Typography>
                </Box>
            </Card>
        </Container>
    );
}