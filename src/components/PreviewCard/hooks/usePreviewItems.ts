import { useEffect, useState } from "react";

export type PreviewItem = {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    loading?: boolean;
    error?: string;
};

async function fetchPreview(url: string) {
    const res = await fetch(url, { credentials: "omit", mode: "cors" });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const ogTitle = (doc.querySelector('meta[property="og:title"]') as HTMLMetaElement)?.content || "";
    const ogDesc = (doc.querySelector('meta[property="og:description"]') as HTMLMetaElement)?.content || "";
    const ogImg = (doc.querySelector('meta[property="og:image"]') as HTMLMetaElement)?.content || "";

    return {
        title: ogTitle || doc.title || url,
        description: ogDesc || doc.querySelector("p")?.textContent?.trim() || "",
        image: ogImg || doc.querySelector<HTMLImageElement>("img")?.src || "",
    };
}

export function usePreviewItems(initial: string[]) {
    const [items, setItems] = useState<PreviewItem[]>(initial.map((url) => ({ url, loading: true })));

    useEffect(() => {
        Promise.all(
            initial.map(async (url) => {
                try {
                    const data = await fetchPreview(url);
                    return { url, ...data, loading: false };
                } catch {
                    return { url, loading: false, error: "Ошибка загрузки (CORS?)" };
                }
            }),
        ).then(setItems);
    }, [initial]);

    const addItem = async (url: string) => {
        setItems((prev) => [{ url, loading: true }, ...prev]);
        try {
            const data = await fetchPreview(url);
            setItems((prev) => prev.map((it) => (it.url === url ? { ...it, ...data, loading: false } : it)));
        } catch {
            setItems((prev) => prev.map((it) => (it.url === url ? { ...it, loading: false, error: "Ошибка загрузки" } : it)));
        }
    };

    return { items, addItem };
}