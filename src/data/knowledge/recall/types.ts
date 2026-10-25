/** A mnemonic is a bounded memory aid, separate from a quantitative relationship. */
export type MemoryAid = {
  id: string;
  title: string;
  chant: string;
  meaning: string;
  boundary: string;
};
export type FormulaReference = {
  id: string;
  title: string;
  expression: string;
  variables: { symbol: string; meaning: string; unit?: string }[];
  useWhen: string;
  caution: string;
  example: { given: string; steps: string[]; result: string };
};
export type RecallGuide = {
  articleId: string;
  coreIdea: string;
  thinkingSteps: [string, string, string];
  memoryAids: MemoryAid[];
  formulas: FormulaReference[];
};
