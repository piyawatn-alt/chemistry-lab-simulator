export type Progress = {
  completed: string[];
  scores: Record<string, number>;
  lastLesson: string | null;
  explored: string[];
  updatedAt: string | null;
};
export const emptyProgress: Progress = {
  completed: [],
  scores: {},
  lastLesson: null,
  explored: [],
  updatedAt: null,
};
export const STORAGE_KEY = "chemlab-rx:progress:v1";
export function readProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      !p ||
      !Array.isArray(p.completed) ||
      !Array.isArray(p.explored) ||
      typeof p.scores !== "object" ||
      p.scores === null
    )
      return emptyProgress;
    return {
      completed: p.completed.filter((s: unknown) => typeof s === "string"),
      explored: p.explored.filter((s: unknown) => typeof s === "string"),
      scores: Object.fromEntries(
        Object.entries(p.scores).filter(
          (entry): entry is [string, number] =>
            typeof entry[1] === "number" && entry[1] >= 0 && entry[1] <= 100,
        ),
      ),
      lastLesson: typeof p.lastLesson === "string" ? p.lastLesson : null,
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : null,
    };
  } catch {
    return emptyProgress;
  }
}
