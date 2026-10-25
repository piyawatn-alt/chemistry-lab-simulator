import { test } from "node:test";
import assert from "node:assert/strict";
import { articles } from "../../data/knowledge";
import { chemistrySubjects, normalizeChemistryText, searchContent } from "./search";

test("subject navigation covers every published article without dangling or repeated entries", () => {
  const ids = new Set(articles.map((article) => article.id));
  assert.equal(new Set(chemistrySubjects.map((subject) => subject.id)).size, chemistrySubjects.length);
  const covered = new Set<string>();
  for (const subject of chemistrySubjects) {
    assert.ok(subject.articleIds.length > 0);
    assert.equal(new Set(subject.articleIds).size, subject.articleIds.length);
    for (const id of subject.articleIds) {
      assert.ok(ids.has(id), `${subject.id}: missing ${id}`);
      covered.add(id);
    }
  }
  assert.deepEqual([...covered].sort(), [...ids].sort());
});

test("chemical notation search folds Unicode indices and charges but keeps formula identity", () => {
  assert.equal(normalizeChemistryText(" H₂O "), "h2o");
  assert.equal(normalizeChemistryText("Ca²⁺"), "ca2+");
  assert.equal(normalizeChemistryText("ΔH − Ea"), "δh - ea");
  assert.deepEqual(searchContent("H₂O").map((r) => r.article.id), searchContent("H2O").map((r) => r.article.id));
  assert.equal(searchContent("C99H999O").length, 0);
});

test("Thai and English chemistry synonyms rank the directly relevant article first", () => {
  for (const [query, id] of [
    ["functional groups", "small-groups-big-difference"],
    ["molarity", "concentration-is-a-ratio"],
    ["equilibrium", "chemical-equilibrium"],
    ["acid/base", "acids-bases-ph"],
    ["isotopes", "atomic-structure"],
    ["ΔH", "reaction-rates"],
  ]) assert.equal(searchContent(query)[0]?.article.id, id, query);
  assert.ok(searchContent("NaCl").some((result) => result.article.id === "chemical-bonding"));
  assert.ok(searchContent("ว31222").some((result) => result.article.id === "mole-stoichiometry"));
  assert.ok(searchContent("ม.6").some((result) => result.article.id === "chemical-models"));
});

test("matched sections supply real source snippets and valid deep-link anchors", () => {
  const result = searchContent("Ksp").find((item) => item.article.id === "chemical-equilibrium");
  assert.ok(result);
  assert.equal(typeof result.sectionIndex, "number");
  const section = result.article.sections[result.sectionIndex!];
  assert.equal(result.sectionTitle, section.title);
  assert.ok(result.snippet.length > 0 && result.snippet.length <= 197);
  assert.ok(result.snippet.includes("Ksp"));
  const raw = result.snippet.replace(/^…|…$/g, "");
  assert.ok([section.text, section.formula, section.note, ...(section.bullets || [])].some((text) => text?.includes(raw)));
});

test("unrelated multiword queries do not fall back to broad recommendations", () => {
  assert.equal(searchContent("molarity elephant").length, 0);
  assert.equal(searchContent("nothing-matches-987654").length, 0);
  assert.equal(searchContent("  ").length, articles.length);
  const ions = searchContent("ion");
  assert.ok(ions.some((result) => result.article.id === "atomic-structure"));
  assert.ok(!ions.some((result) => result.article.id === "experimental-data"));
});
