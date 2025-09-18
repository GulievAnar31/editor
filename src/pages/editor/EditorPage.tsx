import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { DocumentEditor } from "../../components/DocumentEditor";
import { useImportFromUrl } from "../../components/DocumentEditor/hooks/useImportFromUrl";

function useQueryUrl() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search).get("url") || "", [search]);
}

export default function EditorPage() {
    const initialUrl = useQueryUrl();
    const { importFromUrl } = useImportFromUrl();

    const handleImport = (url: string) => importFromUrl(url);

    return (
        <DocumentEditor
            onSave={(md, title) => {
                // бэкенд-сейв
                console.log("SAVE:", { title, md });
            }}
            onImportUrl={handleImport}
        />
    );
}