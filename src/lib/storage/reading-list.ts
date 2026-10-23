import { articles } from "@/data/knowledge";
export const READING_LIST_KEY = "chemlab-rx:reading-list:v1";
export function parseReadingList(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value)
      ? Array.from(
          new Set(
            value.filter(
              (id): id is string =>
                typeof id === "string" && articles.some((a) => a.id === id),
            ),
          ),
        )
      : [];
  } catch {
    return [];
  }
}
