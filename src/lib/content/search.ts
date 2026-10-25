import { articles, courseForArticle, type Article } from "../../data/knowledge";

export type ChemistrySubject = {
  id: string;
  title: string;
  description: string;
  articleIds: string[];
};

/** Content groups are editorial navigation, not an official curriculum mapping. */
export const chemistrySubjects: ChemistrySubject[] = [
  {
    id: "atoms-bonds",
    title: "อะตอมและพันธะ",
    description: "อนุภาค ตารางธาตุ รูปร่างโมเลกุล และแรงยึดเหนี่ยว",
    articleIds: ["atomic-structure", "electrons-periodic-table", "chemical-bonding", "why-water-dissolves"],
  },
  {
    id: "quantities-solutions",
    title: "โมล สารละลาย และแก๊ส",
    description: "ปริมาณสาร สมการเคมี ความเข้มข้น และสถานะของสาร",
    articleIds: ["mole-stoichiometry", "concentration-is-a-ratio", "states-ideal-gas"],
  },
  {
    id: "reactions-equilibrium",
    title: "อัตราปฏิกิริยาและสมดุล",
    description: "การชน พลังงาน เวลา และปฏิกิริยาไป–กลับ",
    articleIds: ["reaction-rates", "why-reactions-slow-down", "chemical-equilibrium", "esterification-equilibrium"],
  },
  {
    id: "acids-bases",
    title: "กรด–เบส",
    description: "การถ่ายโอนโปรตอน ค่า pH บัฟเฟอร์ และไทเทรต",
    articleIds: ["acids-bases-ph", "strong-acid-base-titration"],
  },
  {
    id: "organic",
    title: "เคมีอินทรีย์",
    description: "โครงสร้าง หมู่ฟังก์ชัน การเรียกชื่อ และปฏิกิริยา",
    articleIds: ["hydrocarbons-nomenclature", "small-groups-big-difference", "carboxyl-vs-alcohol", "esterification-equilibrium", "aspirin-two-groups", "paracetamol-chemistry"],
  },
  {
    id: "materials-electrochem",
    title: "พอลิเมอร์และไฟฟ้าเคมี",
    description: "หน่วยซ้ำ รีดอกซ์ เซลล์ไฟฟ้า และอิเล็กโทรลิซิส",
    articleIds: ["polymers-around-us", "redox-galvanic-cells", "electrolysis-faraday"],
  },
  {
    id: "scientific-practice",
    title: "การทดลองและข้อมูล",
    description: "แบบจำลอง ตัวแปร การประเมินข้อมูล และความปลอดภัย",
    articleIds: ["chemical-models", "experimental-data", "chemical-safety"],
  },
];

export type ContentSearchResult = {
  article: Article;
  score: number;
  sectionTitle?: string;
  sectionIndex?: number;
  snippet: string;
};

/** NFKC folds subscripts/superscripts, without stripping meaningful formula digits. */
export function normalizeChemistryText(text: string): string {
  return text.normalize("NFKC").toLocaleLowerCase("en")
    .replace(/[‐‑‒–—−]/g, "-")
    .replace(/\s+/g, " ").trim();
}

// Synonyms are explicit chemistry vocabulary; no broad article-based recommendations
// are mixed into search. Formula strings are matched as complete Latin tokens.
const synonymSets = [
  ["อะตอม", "atom", "atoms", "atomic"],
  ["ไอโซโทป", "isotope", "isotopes"],
  ["ไอออน", "ion", "ions"],
  ["อิเล็กตรอน", "electron", "electrons"],
  ["ตารางธาตุ", "periodic table", "periodicity"],
  ["พันธะเคมี", "chemical bonding", "chemical bonds"],
  ["พันธะไฮโดรเจน", "hydrogen bond", "hydrogen bonding"],
  ["โมล", "mole", "moles"],
  ["ปริมาณสัมพันธ์", "stoichiometry"],
  ["สารกำหนดปริมาณ", "limiting reagent", "limiting reactant"],
  ["ความเข้มข้นเชิงโมล", "molarity", "molar concentration"],
  ["โมแลลิตี", "molality"],
  ["การเจือจาง", "dilution"],
  ["แก๊ส", "gas", "gases"],
  ["แก๊สอุดมคติ", "ideal gas", "ideal gases"],
  ["อัตราปฏิกิริยา", "อัตราการเกิดปฏิกิริยา", "reaction rate", "reaction rates", "kinetics"],
  ["ครึ่งชีวิต", "half-life", "half life"],
  ["สมดุล", "equilibrium"],
  ["ค่าคงที่สมดุล", "equilibrium constant"],
  ["กรด", "acid", "acids"],
  ["เบส", "base", "bases"],
  ["กรด-เบส", "กรดเบส", "acid-base", "acid/base", "acids and bases", "acid base"],
  ["บัฟเฟอร์", "buffer", "buffers"],
  ["ไทเทรต", "titration", "titrate"],
  ["หมู่ฟังก์ชัน", "functional group", "functional groups"],
  ["แอลกอฮอล์", "alcohol", "alcohols"],
  ["กรดคาร์บอกซิลิก", "carboxylic acid", "carboxylic acids"],
  ["เอสเทอร์", "ester", "esters"],
  ["เอไมด์", "amide", "amides"],
  ["เอมีน", "amine", "amines"],
  ["ฟีนอล", "phenol", "phenols"],
  ["ไฮโดรคาร์บอน", "hydrocarbon", "hydrocarbons"],
  ["อินทรีย์", "organic", "organic chemistry"],
  ["พอลิเมอร์", "polymer", "polymers"],
  ["รีดอกซ์", "redox"],
  ["กัลวานิก", "galvanic", "galvanic cell"],
  ["อิเล็กโทรลิซิส", "electrolysis"],
  ["ความปลอดภัย", "safety"],
  ["น้ำ", "water", "H2O"],
  ["โซเดียมคลอไรด์", "sodium chloride", "NaCl"],
  ["คาร์บอนไดออกไซด์", "carbon dioxide", "CO2"],
  ["พลังงานก่อกัมมันต์", "activation energy", "Ea"],
  ["เอนทัลปี", "enthalpy", "ΔH", "delta h"],
  ["ค่าคงที่ผลคูณการละลาย", "solubility product", "Ksp"],
].map((set) => [...new Set(set.map(normalizeChemistryText))]);

function alternatives(text: string): string[] {
  return synonymSets.find((set) => set.includes(text)) || [text];
}

function matches(haystack: string, needle: string): boolean {
  let offset = haystack.indexOf(needle);
  while (offset !== -1) {
    const before = haystack[offset - 1] || "";
    const after = haystack[offset + needle.length] || "";
    // Prevent `ion` matching concentration / `mol` matching polymer / H2 matching H2O.
    const startOkay = !/^[a-z0-9]/.test(needle) || !/[a-z0-9]/.test(before);
    const endOkay = !/[a-z0-9]$/.test(needle) || !/[a-z0-9]/.test(after);
    if (startOkay && endOkay) return true;
    offset = haystack.indexOf(needle, offset + 1);
  }
  return false;
}

function anyMatch(text: string, terms: string[]): boolean {
  return terms.some((term) => matches(text, term));
}

function sectionText(section: Article["sections"][number]): string {
  return [section.text, section.formula, section.note, ...(section.bullets || []),
    section.example?.title, ...(section.example?.steps || []), section.example?.result,
    ...(section.table?.headers || []), ...(section.table?.rows.flat() || [])].filter(Boolean).join(" · ");
}

const indexed = articles.map((article) => {
  const course = courseForArticle(article);
  const sections = article.sections.map((section) => ({
    title: normalizeChemistryText(section.title),
    text: normalizeChemistryText(sectionText(section)),
    original: sectionText(section),
  }));
  const fields = {
    title: normalizeChemistryText(article.title),
    intro: normalizeChemistryText(`${article.intro} ${article.dek} ${article.takeaway}`),
    tags: normalizeChemistryText(article.tags.join(" ")),
    terms: normalizeChemistryText((article.terms || []).map((term) => `${term.term} ${term.meaning}`).join(" ")),
    course: normalizeChemistryText(`${course.code} ม.${course.grade} ${course.title}`),
  };
  return { article, fields, sections, full: Object.values(fields).concat(sections.map((s) => `${s.title} ${s.text}`)).join(" ") };
});

function contextualSnippet(text: string, terms: string[]): string {
  const normalized = normalizeChemistryText(text);
  const positions = terms.map((term) => normalized.indexOf(term)).filter((position) => position >= 0);
  const at = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, at - 45);
  const end = Math.min(text.length, start + 195);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/** All query tokens must occur; recognized multiword terms stay together. */
export function searchContent(query: string): ContentSearchResult[] {
  const q = normalizeChemistryText(query);
  if (!q) return articles.map((article) => ({ article, score: 0, snippet: article.intro }));
  const knownPhrase = synonymSets.some((set) => set.includes(q));
  const groups = (knownPhrase ? [q] : q.split(/\s+/)).map(alternatives);
  const terms = groups.flat();
  return indexed.flatMap(({ article, fields, sections, full }) => {
    if (!groups.every((group) => anyMatch(full, group))) return [];
    const score = groups.reduce((sum, group) => sum +
      (anyMatch(fields.title, group) ? 100 : 0) +
      (anyMatch(fields.tags, group) ? 45 : 0) +
      (anyMatch(fields.intro, group) ? 30 : 0) +
      (anyMatch(fields.terms, group) ? 20 : 0) +
      (anyMatch(fields.course, group) ? 4 : 0), 0) + (matches(fields.title, q) ? 100 : 0);
    const rankedSections = sections.map((section, index) => ({
      ...section, index,
      score: groups.reduce((sum, group) => sum + (anyMatch(section.title, group) ? 35 : 0) + (anyMatch(section.text, group) ? 8 : 0), 0) + (matches(section.title, q) ? 25 : 0),
    })).sort((a, b) => b.score - a.score);
    const best = rankedSections[0];
    return [{
      article,
      score: score + (best?.score || 0),
      ...(best?.score ? { sectionTitle: article.sections[best.index].title, sectionIndex: best.index } : {}),
      snippet: best?.score ? contextualSnippet(best.original, terms) : contextualSnippet(article.intro, terms),
    }];
  }).sort((a, b) => b.score - a.score);
}
