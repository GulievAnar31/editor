import { Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

export const AddUrlForm: React.FC<{ onAdd: (url: string) => void }> = ({ onAdd }) => {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if (!input.trim()) return;
        onAdd(input.trim());
        setInput("");
    };

    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
                fullWidth
                label="Вставьте URL страницы"
                placeholder="https://example.com/article"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ px: 3 }}>
                Добавить
            </Button>
        </Stack>
    );
};