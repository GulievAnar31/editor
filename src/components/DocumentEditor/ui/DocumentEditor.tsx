import { FC, useCallback, useRef, useState, useEffect } from "react";
import "@blocknote/core/style.css";
import { useSearchParams } from "react-router-dom";

import { useEnsureH1Title } from "../hooks/useEnsureH1Title";
import { useBlockNoteEditor } from "../hooks/useBlockNoteEditor";
import { useSmartAutosave } from "../hooks/useSmartAutosave";
import { useImportFromUrl } from "../hooks/useImportFromUrl";

import { EditorFrame } from "../components/EditorFrame";
import { EditorHeader } from "../components/EditorHeader";
import { EditorArea } from "../components/EditorArea";

interface DocumentEditorProps {
    initialMarkdown?: string;
    onSave?: (markdown: string, title?: string) => void;
    /** Если хотите подменить парсер – передайте свою функцию */
    onImportUrl?: (url: string) => Promise<{ title?: string; markdown: string }>;
    readOnly?: boolean;
    documentTitle?: string;
}

export const DocumentEditor: FC<DocumentEditorProps> = ({
    initialMarkdown = "",
    onSave,
    onImportUrl,
    readOnly = false,
    documentTitle = "Новый документ",
}) => {
    const [title, setTitle] = useState(documentTitle);
    const [dirty, setDirty] = useState(false);

    const intensiveTypingRef = useRef(false);
    const lastTypingRef = useRef(Date.now());
    const autoImportedRef = useRef(false); // чтобы не дёргать импорт дважды

    const { ensureH1Title } = useEnsureH1Title(title);
    const { editor } = useBlockNoteEditor({
        initialMarkdown,
        readOnly,
        ensureH1Title,
        onTitleChange: setTitle,
        onDirty: () => {
            setDirty(true);
            intensiveTypingRef.current = true;
            lastTypingRef.current = Date.now();
        },
    });

    // наш дефолтный парсер с fallback-ом
    const {
        importFromUrl: importFromUrlDefault,
        loading: importLoading,
        error: importError,
    } = useImportFromUrl();

    const [searchParams] = useSearchParams();
    const requestedUrl = searchParams.get("url") ?? undefined;

    const getMarkdown = useCallback(async () => {
        if (!editor) throw new Error("Editor is not ready");
        const ensuredTitle = ensureH1Title(editor as any);
        const md = await Promise.resolve(editor.blocksToMarkdown(editor.topLevelBlocks));
        return { title: ensuredTitle, markdown: md };
    }, [editor, ensureH1Title]);

    const saveNow = useCallback(async () => {
        if (!onSave || !dirty || !editor) return;
        try {
            const { title: t, markdown } = await getMarkdown();
            onSave(markdown, t);
            setDirty(false);
        } catch (e) {
            console.error("Ошибка при сохранении:", e);
        }
    }, [onSave, dirty, editor, getMarkdown]);

    const { decrease, increase } = useSmartAutosave({
        enabled: Boolean(onSave && !readOnly),
        isDirty: dirty,
        onSave: saveNow,
        onTypingCheck: () => {
            const since = Date.now() - lastTypingRef.current;
            if (since > 3000) {
                intensiveTypingRef.current = false;
                decrease();
            } else if (intensiveTypingRef.current) {
                increase();
            }
        },
    });

    const handleLog = useCallback(async () => {
        try {
            const { title: t, markdown } = await getMarkdown();
            console.group("[DocumentEditor] Markdown dump");
            console.log("Title:", t);
            console.log("Markdown:\n", markdown);
            console.groupEnd();
        } catch (e) {
            console.error("Не удалось получить markdown:", e);
        }
    }, [getMarkdown]);

    const handleImportUrl = useCallback(
        async (url: string) => {
            if (!editor) return;
            try {
                // используем переданный парсер или дефолтный хук
                const parse = onImportUrl ?? importFromUrlDefault;
                const { title: newTitle, markdown } = await parse(url);

                // добавим H1 если есть заголовок
                const prefixed = `${newTitle ? `# ${newTitle}\n\n` : ""}${markdown}`;
                const blocks = await editor.markdownToBlocks(prefixed);

                editor.replaceBlocks(editor.topLevelBlocks, blocks);
                setTitle(newTitle || "Импортированный документ");
                setDirty(true);
            } catch (e) {
                console.error("Ошибка при импорте URL:", e);
            }
        },
        [editor, onImportUrl, importFromUrlDefault]
    );

    // Автоимпорт из query-параметра ?url=...
    useEffect(() => {
        if (!editor) return;
        if (!requestedUrl) return;
        if (autoImportedRef.current) return;

        autoImportedRef.current = true;
        handleImportUrl(requestedUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, requestedUrl]);

    return (
        <EditorFrame
            header={
                <EditorHeader
                    title={importLoading ? "Загружаю страницу..." : title}
                    dirty={dirty}
                    readOnly={readOnly}
                    canSave={!!dirty && !importLoading}
                    onSave={saveNow}
                    onLog={editor ? handleLog : undefined}
                    // Кнопка импорта остаётся на всякий случай, но можно и убрать:
                    onImportFromUrl={handleImportUrl}
                />
            }
        // можно вывести ошибку импорта в футере/подвале — см. EditorFrame, если хотите
        // footerHintRight={importError ? "Ошибка импорта: см. консоль" : undefined}
        >
            <EditorArea editor={editor as any} />
        </EditorFrame>
    );
};