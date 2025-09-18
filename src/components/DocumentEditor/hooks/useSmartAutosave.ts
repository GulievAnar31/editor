import { useCallback, useEffect, useRef, useState } from "react";

type SaveFn = () => void;

export function useSmartAutosave(opts: {
    enabled: boolean;
    minMs?: number;
    maxMs?: number;
    stepMs?: number;
    isDirty: boolean;
    onSave: SaveFn;
    onTypingCheck?: () => void;
}) {
    const {
        enabled,
        minMs = 5000,
        maxMs = 30000,
        stepMs = 5000,
        isDirty,
        onSave,
        onTypingCheck,
    } = opts;

    const [interval, setIntervalMs] = useState(maxMs);
    const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const decrease = useCallback(() => setIntervalMs(prev => Math.max(minMs, prev - stepMs)), [minMs, stepMs]);
    const increase = useCallback(() => setIntervalMs(prev => Math.min(maxMs, prev + stepMs)), [maxMs, stepMs]);

    const controls = { decrease, increase, setIntervalMs };

    useEffect(() => {
        if (!enabled) return;

        const setup = () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = setTimeout(() => {
                if (isDirty) onSave();
                setup();
            }, interval);
        };

        typingCheckRef.current = setInterval(() => {
            onTypingCheck?.();
        }, 2000);

        setup();

        const onVisibility = () => {
            if (document.visibilityState === "hidden" && isDirty) onSave();
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
            if (typingCheckRef.current) clearInterval(typingCheckRef.current);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [enabled, interval, isDirty, onSave, onTypingCheck]);

    return { intervalMs: interval, ...controls };
}
