import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Stack
} from "@mui/material";

type Props = {
    open: boolean;
    onClose: () => void;
    onImport: (url: string) => void;
};

export function ImportFromUrlDialog({ open, onClose, onImport }: Props) {
    const [url, setUrl] = useState("");

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Импорт из веб-страницы</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        label="URL страницы"
                        placeholder="https://example.com/article"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    onClick={() => { onImport(url.trim()); onClose(); }}
                    variant="contained"
                    disabled={!url.trim()}
                >
                    Импортировать
                </Button>
            </DialogActions>
        </Dialog>
    );
}
