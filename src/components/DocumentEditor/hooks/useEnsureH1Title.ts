import { useCallback } from "react";

type Editor = {
    topLevelBlocks: any[];
    insertBlocks: (blocks: any[], referenceBlock: any, position: "before" | "after") => void;
};

export function useEnsureH1Title(currentTitle: string) {
    const ensureH1Title = useCallback((editor: Editor): string => {
        const blocks = editor.topLevelBlocks;

        if (blocks.length === 0 || blocks[0]?.type !== "heading" || blocks[0]?.props?.level !== 1) {
            const titleBlock = {
                type: "heading",
                props: { level: 1 },
                content: currentTitle,
                children: [],
            };
            editor.insertBlocks([titleBlock], editor.topLevelBlocks[0] || null, "before");
        }

        const first = editor.topLevelBlocks[0];
        const title =
            first?.type === "heading"
                ? (Array.isArray(first.content)
                    ? first.content.map((c: any) => c?.text ?? "").join("")
                    : String(first.content ?? "")) || currentTitle
                : currentTitle;

        return title;
    }, [currentTitle]);

    return { ensureH1Title };
}
