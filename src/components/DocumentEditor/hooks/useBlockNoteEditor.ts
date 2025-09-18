import { useState } from "react";
import { useBlockNote } from "@blocknote/react";
import type { BlockNoteEditor } from "@blocknote/core";

type Options = {
    initialMarkdown: string;
    readOnly: boolean;
    onTitleChange?: (title: string) => void;
    ensureH1Title: (editor: any) => string;
    onDirty?: () => void;
};

export function useBlockNoteEditor({
    initialMarkdown,
    readOnly,
    onTitleChange,
    ensureH1Title,
    onDirty,
}: Options) {
    const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

    const instance = useBlockNote({
        editable: !readOnly,
        onEditorReady: async (ed) => {
            setEditor(ed);
            if (initialMarkdown) {
                try {
                    const blocks = await ed.markdownToBlocks(initialMarkdown);
                    ed.replaceBlocks(ed.topLevelBlocks, blocks);
                } catch (e) {
                    console.error("Ошибка при загрузке markdown:", e);
                }
            }
            const title = ensureH1Title(ed);
            onTitleChange?.(title);
        },
        onEditorContentChange: (ed) => {
            onDirty?.();
            const blocks = ed.topLevelBlocks;
            if (blocks[0]?.type === "heading" && blocks[0]?.props?.level === 1) {
                const title =
                    Array.isArray(blocks[0].content)
                        ? blocks[0].content.map((c: any) => c?.text ?? "").join("")
                        : String(blocks[0].content ?? "");
                onTitleChange?.(title);
            }
        },
    }, [initialMarkdown, readOnly]);

    return { editor: instance ?? editor };
}
