import { FC, useCallback, useRef, useState } from "react";
import "@blocknote/core/style.css";

import { useEnsureH1Title } from "../hooks/useEnsureH1Title";
import { useBlockNoteEditor } from "../hooks/useBlockNoteEditor";
import { useSmartAutosave } from "../hooks/useSmartAutosave";

import { EditorFrame } from "../components/EditorFrame";
import { EditorHeader } from "../components/EditorHeader";
import { EditorArea } from "../components/EditorArea";

interface DocumentEditorProps {
    initialMarkdown?: string;
    onSave?: (markdown: string, title?: string) => void;
    readOnly?: boolean;
    documentTitle?: string;
}

export const DocumentEditor: FC<DocumentEditorProps> = ({
    initialMarkdown = "",
    onSave,
    readOnly = false,
    documentTitle = "Новый документ",
}) => {
    const [title, setTitle] = useState(documentTitle);
    const [dirty, setDirty] = useState(false);

    const intensiveTypingRef = useRef(false);
    const lastTypingRef = useRef(Date.now());

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

    return (
        <EditorFrame
            header={
                <EditorHeader
                    title={title}
                    dirty={dirty}
                    readOnly={readOnly}
                    canSave={!!dirty}
                    onSave={saveNow}
                    onLog={editor ? handleLog : undefined}
                />
            }
        >
            <EditorArea editor={editor as any} />
        </EditorFrame>
    );
};