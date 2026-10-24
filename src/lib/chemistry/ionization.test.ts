import { test } from "node:test";
import assert from "node:assert/strict";
import { ionization } from "./ionization";
test("pH = pKa gives equal species and S/S0 = 2 for both model types", () => {
  for (const kind of ["acid", "base"] as const) {
    const r = ionization(kind, 4.5, 4.5);
    assert.equal(r.ionizedFraction, 0.5);
    assert.equal(r.neutralFraction, 0.5);
    assert.equal(r.relativeSolubility, 2);
  }
});
test("a one-unit shift changes the ratio tenfold in opposite directions for acid and base", () => {
  assert.equal(ionization("acid", 5.5, 4.5).ionizedToNeutral, 10);
  assert.equal(ionization("base", 5.5, 4.5).ionizedToNeutral, 0.1);
  assert.ok(
    ionization("acid", 7, 4.5).ionizedFraction >
      ionization("acid", 3, 4.5).ionizedFraction,
  );
  assert.ok(
    ionization("base", 7, 4.5).ionizedFraction <
      ionization("base", 3, 4.5).ionizedFraction,
  );
});
test("fraction conservation, solubility identities and finite boundary results", () => {
  for (const kind of ["acid", "base"] as const)
    for (const ph of [0, 2, 7, 12, 14])
      for (const pka of [0, 4.5, 14]) {
        const r = ionization(kind, ph, pka);
        assert.ok(Math.abs(r.ionizedFraction + r.neutralFraction - 1) < 1e-12);
        assert.ok(
          Math.abs(r.relativeSolubility * r.neutralFraction - 1) < 1e-12,
        );
        assert.ok(Number.isFinite(r.logRelativeSolubility));
      }
});
test("rejects invalid model inputs", () => {
  for (const [ph, pka] of [
    [NaN, 4],
    [3, Infinity],
    [-1, 3],
    [15, 4],
    [3, -1],
  ])
    assert.throws(() => ionization("acid", ph, pka), RangeError);
});
