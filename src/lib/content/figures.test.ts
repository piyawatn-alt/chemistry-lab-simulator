import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { articles } from "../../data/knowledge";
import { contentFigures, figureKinds } from "../../data/knowledge/figures";
test("every content entry has an explanatory figure attached to a real section", () => {
  for (const a of articles) {
    const f = contentFigures[a.id];
    assert.ok(f, a.id);
    assert.ok(figureKinds.includes(f.kind));
    assert.ok(
      a.sections.some((s) => s.title === f.section),
      `${a.id}: ${f.section}`,
    );
    assert.ok(f.title.length > 5 && f.caption.length > 10);
  }
});
test("generated drug figures match formulas and functional groups in the source references", () => {
  const meta = JSON.parse(
    readFileSync("public/diagrams/molecules.json", "utf8"),
  );
  const expected = {
    aspirin: { C: 9, H: 8, O: 4 },
    paracetamol: { C: 8, H: 9, N: 1, O: 2 },
  };
  for (const item of meta) {
    assert.deepEqual(item.formula, expected[item.id as keyof typeof expected]);
    assert.equal(item.groups.length, 2);
    assert.equal(item.layout, "2D explanatory coordinates");
    const svg = readFileSync(`public/diagrams/${item.id}.svg`, "utf8");
    assert.ok(svg.includes("<svg"));
    assert.ok(svg.includes("class='atom-4'"));
    assert.ok(!svg.includes("<script"));
  }
  assert.equal(meta.length, 2);
  assert.equal(
    meta.find((m: { id: string }) => m.id === "aspirin").groups[0].atoms.length,
    3,
  );
});
