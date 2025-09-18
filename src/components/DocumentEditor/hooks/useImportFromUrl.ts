import { useCallback, useState } from "react";
import TurndownService from "turndown";
import { Readability } from "@mozilla/readability";

export type ImportResult = { title?: string; markdown: string };

export function useImportFromUrl() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const normalizeUrl = (url: string) => {
        try {
            const u = new URL(url.trim());
            return u.toString();
        } catch {
            return `https://${url.trim()}`;
        }
    };

    /** грубый fallback, когда Readability ничего не дала */
    const fallbackExtractHTML = (doc: Document): { title?: string; html: string } => {
        const title =
            doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
            doc.querySelector("title")?.textContent ||
            undefined;

        const pick = (...sels: string[]) => sels.map((s) => doc.querySelector(s)).find(Boolean) as HTMLElement | null;

        const candidate =
            pick("article") ||
            pick('main') ||
            pick('[role="main"]') ||
            pick('#content') ||
            pick('.content') ||
            pick('body');

        const clone = candidate ? candidate.cloneNode(true) as HTMLElement : doc.body.cloneNode(true) as HTMLElement;

        // Удаляем шум
        clone.querySelectorAll("script, style, noscript, iframe, nav, footer, header, [role=banner], [role=contentinfo], .ads, [class*='ad-']").forEach(el => el.remove());

        // Иногда встречаются инлайновые стили с белым текстом/итп — вычищаем
        clone.querySelectorAll<HTMLElement>("[style]").forEach(el => el.removeAttribute("style"));

        return { title, html: clone.innerHTML };
    };

    const importFromUrl = useCallback(
        async (url: string): Promise<ImportResult> => {
            setLoading(true);
            setError(null);

            const finalUrl = normalizeUrl(url);

            try {
                const res = await fetch(finalUrl, {
                    // mode по умолчанию "cors"
                    credentials: "omit",
                });

                // Если сайт не разрешает CORS → браузер бросит TypeError до сюда,
                // либо res.ok=false, либо res.type==="opaque" (тело недоступно).
                if (!res.ok || res.type === "opaque") {
                    throw new Error(
                        res.type === "opaque"
                            ? "Страница не разрешает CORS: контент нельзя прочитать на фронте."
                            : `HTTP ${res.status}`
                    );
                }

                const html = await res.text();
                const doc = new DOMParser().parseFromString(html, "text/html");

                // Помогаем Readability правильно резолвить относительные ссылки
                try {
                    Object.defineProperty(doc, "URL", { value: finalUrl, configurable: true });
                } catch { /* noop */ }

                // 1) Пытаемся извлечь «основной текст» Readability
                const article = new Readability(doc).parse();

                let articleTitle = article?.title?.trim();
                let articleHTML = article?.content || "";

                // 2) Фоллбек, если Readability не нашла полезного
                if (!articleHTML) {
                    const fb = fallbackExtractHTML(doc);
                    articleTitle = articleTitle || fb.title;
                    articleHTML = fb.html;
                }

                const td = new TurndownService({
                    headingStyle: "atx",
                    codeBlockStyle: "fenced",
                });
                const markdown = td.turndown(articleHTML);

                return { title: articleTitle, markdown };
            } catch (e: any) {
                if (e?.name === "TypeError" || /CORS|opaque/i.test(String(e?.message))) {
                    setError("Эту страницу нельзя прочитать с фронта: сайт не разрешает CORS.");
                    throw new Error("CORS_BLOCKED");
                }
                setError(e);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { importFromUrl, loading, error };
}