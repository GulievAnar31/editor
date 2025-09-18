import {
    AppBar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { useState } from "react";

type Props = {
    title: string;
    dirty: boolean;
    readOnly: boolean;
    canSave: boolean;
    onSave?: () => void;
    onLog?: () => void;
    onImportFromUrl?: (url: string) => void;
    onPreview?: () => void;
};

export function EditorHeader({
    title,
    dirty,
    readOnly,
    canSave,
    onSave,
    onLog,
    onImportFromUrl,
    onPreview,
}: Props) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");

    const handleImport = () => {
        if (onImportFromUrl && url.trim()) {
            onImportFromUrl(url.trim());
        }
        setUrl("");
        setOpen(false);
    };

    return (
        <>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    backdropFilter: "saturate(1.2) blur(8px)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1.5,
                    }}
                >
                    {/* Заголовок + статус */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            noWrap
                            title={title || "Без названия"}
                            sx={{ fontWeight: 600 }}
                        >
                            {title || "Без названия"}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Chip
                                size="small"
                                label={dirty ? "Изменения не сохранены" : "Все сохранено"}
                                color={dirty ? "warning" : "success"}
                                variant="outlined"
                            />
                            {readOnly && <Chip size="small" label="Read-only" variant="outlined" />}
                        </Stack>
                    </Box>

                    {/* Действия */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* Предпросмотр */}
                        <Tooltip title="Предпросмотр" placement="bottom">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={onPreview}
                                    disabled={!onPreview}
                                    aria-label="Предпросмотр"
                                >
                                    <VisibilityRoundedIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        {/* Импорт из URL */}
                        <Tooltip title="Импорт из URL" placement="bottom">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={() => setOpen(true)}
                                    disabled={readOnly} // ✅ только readOnly блокирует
                                    aria-label="Импорт из URL"
                                >
                                    <LinkRoundedIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        {/* Лог в консоль */}
                        <Tooltip title="Вывести текущий Markdown в консоль" placement="bottom">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={onLog}
                                    disabled={!onLog}
                                    aria-label="Лог Markdown"
                                >
                                    <TerminalRoundedIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        {/* Сохранить */}
                        {onSave && !readOnly && (
                            <Tooltip title="Сохранить (Ctrl/Cmd + S)" placement="bottom">
                                <span>
                                    <Button
                                        onClick={onSave}
                                        disabled={!canSave}
                                        variant="contained"
                                        startIcon={<SaveRoundedIcon />}
                                        aria-label="Сохранить документ"
                                    >
                                        Сохранить
                                    </Button>
                                </span>
                            </Tooltip>
                        )}
                    </Stack>
                </Box>

                {dirty && (
                    <LinearProgress
                        color="warning"
                        sx={{ borderRadius: 0, opacity: 0.7 }}
                        aria-label="Идёт автосохранение"
                    />
                )}
            </AppBar>

            {/* Диалог импорта */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Импорт из URL</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Введите URL"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button
                        onClick={handleImport}
                        variant="contained"
                        disabled={!url.trim()}
                    >
                        Импортировать
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}