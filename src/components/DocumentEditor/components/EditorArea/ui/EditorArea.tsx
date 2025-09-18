import { Box } from "@mui/material";
import { BlockNoteView } from "@blocknote/react";

type Props = { editor: any };

export function EditorArea({ editor }: Props) {
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                p: { xs: 1.5, sm: 2, md: 2.5 },
                background:
                    "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    borderRadius: 2,
                    overflow: "hidden",
                    p: { xs: 1, sm: 1.5, md: 2 },
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "auto",
                        "&::-webkit-scrollbar": { width: 10 },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(128,128,128,0.3)",
                            borderRadius: 8,
                        },
                    }}
                >
                    <BlockNoteView editor={editor} theme="dark" style={{ height: "100%" }} />
                </Box>
            </Box>
        </Box>
    );
}