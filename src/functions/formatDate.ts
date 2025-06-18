export interface FormatDateTimeOptions {
    weekday: "short" | "long" | "narrow";
    day: "2-digit" | "numeric";
    month: "short" | "long" | "narrow" | "numeric" | "2-digit";
    year: "numeric" | "2-digit";
    hour: "2-digit" | "numeric";
    minute: "2-digit" | "numeric";
    // second: "2-digit" | "numeric";
}

export type FormatDateTimeInput = Date | string | number | null | undefined;

export const formatDateTime = (t: FormatDateTimeInput): string => {
    const d = t
        ? t instanceof Date
            ? t
            : new Date(t)
        : null;

    return d && !isNaN(d.getTime())
        ? d.toLocaleString(undefined, {
                weekday: "short",
                day:     "2-digit",
                month:   "short",
                year:    "numeric",
                hour:    "2-digit",
                minute:  "2-digit",
                // second: "2-digit"
            } as FormatDateTimeOptions)
        : "";
};