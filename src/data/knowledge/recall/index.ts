import { foundationRecall } from "./foundations";
import { reactionRecall } from "./reactions";
import { appliedRecall } from "./applied";
import type { RecallGuide } from "./types";
export type { RecallGuide, MemoryAid, FormulaReference } from "./types";
export const allRecallGuides: RecallGuide[] = [...foundationRecall, ...reactionRecall, ...appliedRecall];
export const recallGuides: Record<string, RecallGuide> = Object.fromEntries(allRecallGuides.map(guide => [guide.articleId, guide]));
