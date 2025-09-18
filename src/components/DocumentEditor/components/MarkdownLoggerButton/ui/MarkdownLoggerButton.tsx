import { memo } from "react";

type Props = {
    disabled?: boolean;
    getMarkdown: () => Promise<{ title: string; markdown: string }>;
};

export const MarkdownLoggerButton = memo(function MarkdownLoggerButton({
    disabled,
    getMarkdown,
}: Props) {
    const onClick = async () => {
        try {
            const { title, markdown } = await getMarkdown();
            console.group("[DocumentEditor] Markdown dump");
            console.log("Title:", title);
            console.log("Markdown:\n", markdown);
            console.groupEnd();
        } catch (e) {
            console.error("Не удалось получить markdown:", e);
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="absolute bottom-4 right-4 mr-40 px-3 py-2 text-xs rounded-md bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600"
            title="Вывести текущий markdown в консоль"
        >
            Log markdown
        </button>
    );
});
