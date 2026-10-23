import { test } from "node:test";
import assert from "node:assert/strict";
import { firstOrder, checkBasicValence } from "./models";
test("first-order initial condition, half-life and zero-rate conservation", () => {
  assert.equal(firstOrder(2, 0.1, 0), 2);
  assert.ok(Math.abs(firstOrder(2, 0.1, Math.log(2) / 0.1) - 1) < 1e-12);
  assert.equal(firstOrder(2, 0, 100), 2);
});
test("concentration decreases and stays nonnegative", () => {
  assert.ok(firstOrder(1, 0.1, 20) < firstOrder(1, 0.1, 10));
  assert.ok(firstOrder(1, 100, 100) >= 0);
});
test("invalid model inputs rejected", () => {
  for (const args of [
    [-1, 1, 1],
    [1, -1, 1],
    [1, 1, -1],
    [1, NaN, 1],
    [Infinity, 1, 1],
  ])
    assert.throws(
      () => firstOrder(...(args as [number, number, number])),
      RangeError,
    );
});
test("basic valence catches oversubscribed atoms without asserting validity", () => {
  assert.equal(checkBasicValence("O", [1, 1]), true);
  assert.equal(checkBasicValence("O", [2, 1]), false);
  assert.equal(checkBasicValence("H", [2]), false);
  assert.equal(checkBasicValence("C", [3, 1]), true);
  assert.equal(checkBasicValence("N", [4]), false);
});
