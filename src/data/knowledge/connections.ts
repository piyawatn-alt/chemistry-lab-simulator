import { articles, type Article } from ".";
import { experiments } from "../experiments";

// Suggestions support free browsing; these are never required steps.
const foundations: Record<string, string[]> = {
  "electrons-periodic-table": ["atomic-structure"],
  "chemical-bonding": ["electrons-periodic-table"],
  "why-water-dissolves": ["chemical-bonding"],
  "mole-stoichiometry": ["atomic-structure"],
  "concentration-is-a-ratio": ["mole-stoichiometry"],
  "states-ideal-gas": ["mole-stoichiometry"],
  "reaction-rates": ["concentration-is-a-ratio"],
  "why-reactions-slow-down": ["reaction-rates"],
  "chemical-equilibrium": ["reaction-rates", "concentration-is-a-ratio"],
  "acids-bases-ph": ["chemical-equilibrium"],
  "strong-acid-base-titration": ["acids-bases-ph", "concentration-is-a-ratio"],
  "hydrocarbons-nomenclature": ["chemical-bonding"],
  "small-groups-big-difference": ["hydrocarbons-nomenclature"],
  "carboxyl-vs-alcohol": ["small-groups-big-difference", "acids-bases-ph"],
  "aspirin-two-groups": ["small-groups-big-difference"],
  "paracetamol-chemistry": ["small-groups-big-difference"],
  "esterification-equilibrium": ["small-groups-big-difference", "chemical-equilibrium"],
  "polymers-around-us": ["hydrocarbons-nomenclature"],
  "redox-galvanic-cells": ["electrons-periodic-table"],
  "electrolysis-faraday": ["redox-galvanic-cells", "mole-stoichiometry"],
  "chemical-models": ["experimental-data"],
};
export function foundationsFor(article: Article) {
  return (foundations[article.id] ?? [])
    .map((id) => articles.find((a) => a.id === id))
    .filter((a): a is Article => Boolean(a));
}
export type RelatedTool = { href: string; title: string; description: string };
export function toolsForArticle(article: Article): RelatedTool[] {
  const tools: RelatedTool[] = experiments
    .filter((e) => e.article === article.id ||
      (article.id === "acids-bases-ph" && e.id === "neutralization") ||
      (article.id === "concentration-is-a-ratio" && e.id === "conductivity") ||
      (article.id === "why-reactions-slow-down" && e.id === "temperature-rate"))
    .map((e) => ({ href: `/tools/${e.id}`, title: e.title, description: e.short }));
  if (["atomic-structure", "electrons-periodic-table"].includes(article.id)) {
    tools.push({ href: "/tools/flame-test", title: "ทดลองสีเปลวไฟ", description: "เปรียบเทียบสีของแสงกับการเปลี่ยนระดับพลังงานของอิเล็กตรอน" });
  }
  if (article.tool) {
    tools.push(article.tool === "explorer"
      ? { href: "/explorer", title: "สำรวจโครงสร้างและหมู่ฟังก์ชัน", description: "แตะอะตอมและพันธะ เปรียบเทียบการเชื่อมต่อของโครงสร้างจริง" }
      : { href: "/tools/kinetics", title: "กราฟความเข้มข้นกับเวลา", description: "ปรับค่าคงที่อัตราและสำรวจครึ่งชีวิตของปฏิกิริยาอันดับหนึ่ง" });
  }
  return tools;
}
