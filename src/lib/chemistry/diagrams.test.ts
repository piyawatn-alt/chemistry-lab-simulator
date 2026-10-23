import { test } from "node:test";
import assert from "node:assert/strict";
import { diagrams } from "../../data/molecules/functional-groups";
const expected: Record<string, Record<string, number>> = {
  alcohol: { C: 2, H: 6, O: 1 },
  acid: { C: 2, H: 4, O: 2 },
  ester: { C: 4, H: 8, O: 2 },
  amide: { C: 2, H: 5, O: 1, N: 1 },
};
for (const [name, model] of Object.entries(diagrams)) {
  test(`${name}: curated graph has the correct molecular composition, bonds and connectivity`, () => {
    const counts: Record<string, number> = {};
    for (const a of model.atoms)
      counts[a.element] = (counts[a.element] || 0) + 1;
    assert.deepEqual(counts, expected[name]);
    const ids = new Set(model.atoms.map((a) => a.id));
    assert.equal(ids.size, model.atoms.length);
    const bondKeys = new Set<string>();
    for (const b of model.bonds) {
      assert.ok(ids.has(b.from) && ids.has(b.to));
      assert.notEqual(b.from, b.to);
      const key = [b.from, b.to].sort().join("-");
      assert.ok(!bondKeys.has(key));
      bondKeys.add(key);
    }
    for (const a of model.atoms) {
      const sum = model.bonds
        .filter((b) => b.from === a.id || b.to === a.id)
        .reduce((total, b) => total + b.order, 0);
      assert.equal(
        sum,
        { C: 4, H: 1, O: 2, N: 3 }[a.element],
        `${a.id} neutral valence`,
      );
    }
    const reached = new Set([model.atoms[0].id]);
    while (true) {
      const size = reached.size;
      for (const b of model.bonds) {
        if (reached.has(b.from)) reached.add(b.to);
        if (reached.has(b.to)) reached.add(b.from);
      }
      if (reached.size === size) break;
    }
    assert.equal(reached.size, ids.size);
  });
}
test("highlighted groups distinguish alcohol, acid, ester and amide connectivity", () => {
  assert.equal(diagrams.alcohol.atoms.filter((a) => a.group).length, 2);
  assert.equal(diagrams.acid.atoms.filter((a) => a.group).length, 4);
  assert.equal(diagrams.ester.atoms.filter((a) => a.group).length, 3);
  assert.equal(diagrams.amide.atoms.filter((a) => a.group).length, 5);
  assert.equal(diagrams.alcohol.bonds.filter((b) => b.order === 2).length, 0);
  for (const id of ["acid", "ester", "amide"])
    assert.equal(diagrams[id].bonds.filter((b) => b.order === 2).length, 1);
});
