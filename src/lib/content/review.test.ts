import { test } from "node:test";
import assert from "node:assert/strict";
import { articles, searchArticles } from "../../data/knowledge";
import { addReviewedCoverage } from "../../data/knowledge/reviewed-content";
import { enrichExistingArticles } from "../../data/knowledge/study-guides";
import { expandedArticles } from "../../data/knowledge/expanded-content";
import { groups } from "../../data/molecules/groups";
import { diagrams } from "../../data/molecules/functional-groups";
import verification from "../../data/molecules/verification.json";

test("functional reference has all ten core families and links every one to a verified diagram", () => {
  const core = [
    "alcohol",
    "phenol",
    "ether",
    "aldehyde",
    "ketone",
    "acid",
    "ester",
    "amine",
    "amide",
    "haloalkane",
  ];
  assert.deepEqual(
    groups
      .filter((g) => g.category === "หมู่หลัก")
      .map((g) => g.id)
      .sort(),
    core.sort(),
  );
  assert.deepEqual(
    groups.map((g) => g.id).sort(),
    Object.keys(diagrams).sort(),
  );
  assert.deepEqual(
    groups.map((g) => g.id).sort(),
    verification.structures.map((g) => g.id).sort(),
  );
  const article = articles.find((a) => a.id === "small-groups-big-difference")!;
  const table = article.sections.find(
    (s) => s.title === "ตารางเปรียบเทียบหมู่ฟังก์ชันพื้นฐาน",
  )!.table!;
  assert.equal(table.rows.length, 10);
  for (const g of groups) {
    assert.ok(g.hbond && g.pitfall && g.description && g.smiles);
    assert.ok(searchArticles(g.english).includes(article));
  }
});
test("context distinguishes carbonyl families and nitrogen substitution instead of counting atoms", () => {
  const amine = groups.find((g) => g.id === "amine")!,
    amide = groups.find((g) => g.id === "amide")!,
    phenol = groups.find((g) => g.id === "phenol")!;
  assert.ok(amine.formula.includes("R₃N"));
  assert.ok(amide.formula.includes("NR′R″"));
  assert.ok(amine.hbond.includes("ตติยภูมิไม่มี N–H"));
  assert.ok(amide.hbond.includes("N ของเอไมด์"));
  assert.ok(phenol.pitfall.includes("CH₂"));
});
test("all current topics identify a section-level reference and have unique section titles", () => {
  assert.equal(articles.length, 24);
  for (const a of articles) {
    assert.ok(
      a.sources.some((s) => /\/pages\/|pubchem|osha/.test(s.url)),
      a.id,
    );
    assert.ok(
      new Set(a.sections.map((s) => s.title)).size === a.sections.length,
      a.id,
    );
  }
});
test("reviewed standard-state and empirical-formula examples match their stated units", () => {
  const gas = articles
    .find((a) => a.id === "states-ideal-gas")!
    .sections.find((s) => s.title === "เงื่อนไขมาตรฐานและหน่วยความดัน")!.text;
  assert.ok(gas.includes((0.082057 * 273.15).toFixed(3)));
  assert.ok(gas.includes(((8.314462618 * 273.15) / 100).toFixed(3)));
  const empirical = articles
    .find((a) => a.id === "mole-stoichiometry")!
    .sections.find((s) => s.title === "สูตรเอมพิริคัลและสูตรโมเลกุล")!.example!;
  const multiplier = 180 / (12 + 2 + 16);
  assert.ok(empirical.steps.join(" ").includes(`= ${multiplier}`));
  assert.ok(empirical.result.includes("C₆H₁₂O₆"));
});

test("review enrichment is repeatable without duplicating sections or changing imported templates", () => {
  const copy = structuredClone(articles),
    original = structuredClone(copy);
  enrichExistingArticles(copy);
  addReviewedCoverage(copy);
  enrichExistingArticles(copy);
  addReviewedCoverage(copy);
  assert.deepEqual(copy, original);
  for (const article of expandedArticles)
    assert.ok(
      !article.sections.some(
        (s) => s.title === "เงื่อนไขมาตรฐานและหน่วยความดัน",
      ),
      "Imported templates must remain unmodified",
    );
});
