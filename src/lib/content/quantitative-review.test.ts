import { test } from "node:test";
import assert from "node:assert/strict";
import { articles } from "../../data/knowledge";
import { experiments } from "../../data/experiments";

function example(id: string, section: string) {
  const s = articles
    .find((a) => a.id === id)!
    .sections.find((s) => s.title === section);
  assert.ok(s?.example, `${id}/${section}`);
  return s.example;
}
test("remaining worked examples keep their reported numbers consistent with the specified inputs", () => {
  const checks: [string, string, string[]][] = [
    [
      "atomic-structure",
      "ไอโซโทปและมวลอะตอมเฉลี่ย",
      [(12 * 0.75 + 13 * 0.25).toFixed(2)],
    ],
    [
      "atomic-structure",
      "จำนวนอิเล็กตรอนในไอออน",
      ["p = 11", `n = ${23 - 11}`, `e = ${11 - 1}`],
    ],
    ["mole-stoichiometry", "โมลและจำนวนอนุภาค", ["1.20 × 10²⁴"]],
    [
      "mole-stoichiometry",
      "สารกำหนดปริมาณและสารเหลือ",
      [`${0.5 * 2 * 18} g`, `${(4 / 2 - 0.5 * 2) * 2}.0 g`],
    ],
    [
      "mole-stoichiometry",
      "ผลได้ตามทฤษฎีและผลได้จริง",
      [((15.3 / 18) * 100).toFixed(1) + "%"],
    ],
    [
      "reaction-rates",
      "อัตราเฉลี่ยและสัมประสิทธิ์สมการ",
      [((0.8 - 0.5) / 30).toFixed(3)],
    ],
    [
      "strong-acid-base-titration",
      "สมการสะเทินและจุดสมมูล",
      [(((0.1 * 0.025) / 0.1) * 1000).toFixed(1) + " mL"],
    ],
    [
      "concentration-is-a-ratio",
      "ตัวอย่างคำนวณความเข้มข้นและการเจือจาง",
      [((0.2 * 0.025) / 0.1).toFixed(4)],
    ],
    [
      "why-reactions-slow-down",
      "ตัวอย่างคำนวณความเข้มข้นและครึ่งชีวิต",
      [(Math.log(2) / 0.05).toFixed(1)],
    ],
    [
      "experimental-data",
      "ค่าเฉลี่ยและการรายงานผล",
      [((10.1 + 10.2 + 10) / 3).toFixed(1) + " mL"],
    ],
    [
      "chemical-models",
      "ตัวอย่างการเปรียบเทียบข้อมูลกับผลคำนวณ",
      [(0.39 - Number(Math.exp(-0.05 * 20).toFixed(3))).toFixed(3)],
    ],
  ];
  for (const [id, section, needles] of checks) {
    const e = example(id, section);
    const text = [...e.steps, e.result].join(" ");
    for (const n of needles)
      assert.ok(text.includes(n), `${id}/${section}: ${n}`);
  }
  const half = articles
    .find((a) => a.id === "why-reactions-slow-down")!
    .sections.find((s) => s.title === "สัดส่วนหลังหลายครึ่งชีวิต")!.table!;
  for (const row of half.rows)
    assert.equal(parseFloat(row[2]), 100 / 2 ** Number(row[0]));
});

const sub = "₀₁₂₃₄₅₆₇₈₉",
  sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function species(raw: string) {
  let text = raw.trim().replace(/\((?:aq|s|l|g)\)/g, "");
  const coefficient = Number(text.match(/^\d+/)?.[0] ?? 1);
  text = text.replace(/^\d+/, "");
  const chargeMatch = text.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/);
  const charge = chargeMatch
    ? Number(
        Array.from(chargeMatch[1], (c) => String(sup.indexOf(c))).join("") || 1,
      ) * (chargeMatch[2] === "⁺" ? 1 : -1)
    : 0;
  if (chargeMatch) text = text.slice(0, -chargeMatch[0].length);
  const counts: Record<string, number> = {};
  if (text === "e") return { coefficient, charge, counts };
  text = Array.from(text, (c) =>
    sub.includes(c) ? String(sub.indexOf(c)) : c,
  ).join("");
  const parts = [...text.matchAll(/([A-Z][a-z]?)(\d*)/g)];
  assert.equal(parts.map((p) => p[0]).join(""), text, raw);
  for (const p of parts) counts[p[1]] = (counts[p[1]] ?? 0) + Number(p[2] || 1);
  return { coefficient, charge, counts };
}
function side(text: string) {
  const totals: Record<string, number> = { charge: 0 };
  for (const item of text.split(/\s+\+\s+/)) {
    const s = species(item);
    totals.charge += s.coefficient * s.charge;
    for (const [el, count] of Object.entries(s.counts))
      totals[el] = (totals[el] ?? 0) + count * s.coefficient;
  }
  return totals;
}
test("explicit reaction formulas conserve every element and net charge in content and experiments", () => {
  const formulas = [
    ...articles.flatMap((a) => a.sections.map((s) => s.formula ?? "")),
    ...experiments.map((e) => e.equation),
  ];
  let checked = 0;
  for (const formula of formulas)
    for (const line of formula.split(/\s+·\s+/)) {
      if (!/[→⇌]/.test(line) || /[ก-๙]|aA|\[|^n /.test(line)) continue;
      const [left, right] = line.split(/[→⇌]/);
      assert.deepEqual(side(left), side(right), line);
      checked++;
    }
  assert.ok(checked >= 10, `Only ${checked} reactions checked`);
});
