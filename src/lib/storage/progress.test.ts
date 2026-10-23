import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyProgress, readProgress } from "./progress";
function storageReturning(value: string | null) {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => value },
  });
}
test("fresh and corrupted progress never invent activity", () => {
  for (const value of [
    null,
    "{bad json",
    "{}",
    '{"completed":[],"explored":[],"scores":null}',
  ]) {
    storageReturning(value);
    assert.deepEqual(readProgress(), emptyProgress);
  }
});
test("valid persisted activity survives and malformed fields are discarded", () => {
  storageReturning(
    JSON.stringify({
      completed: ["organic", 3],
      explored: ["acid", false],
      scores: { organic: 100, bad: 999, wrong: "50" },
      lastLesson: "organic",
      updatedAt: "2026-01-01T00:00:00Z",
    }),
  );
  assert.deepEqual(readProgress(), {
    completed: ["organic"],
    explored: ["acid"],
    scores: { organic: 100 },
    lastLesson: "organic",
    updatedAt: "2026-01-01T00:00:00Z",
  });
});
test("blocked local storage is safe to read", () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("Blocked storage");
    },
  });
  assert.deepEqual(readProgress(), emptyProgress);
  Reflect.deleteProperty(globalThis, "localStorage");
});
