import { test } from "node:test";
import assert from "node:assert/strict";
import { parseReadingList } from "./reading-list";
test("reading list treats missing, corrupt and wrong-shaped storage as empty", () => {
  for (const input of [null, "not json", "{}", "null", "42"])
    assert.deepEqual(parseReadingList(input), []);
});
test("reading list preserves known articles and removes duplicate and stale ids", () => {
  assert.deepEqual(
    parseReadingList(
      JSON.stringify([
        "aspirin-two-groups",
        "aspirin-two-groups",
        "deleted",
        null,
        42,
        "why-water-dissolves",
      ]),
    ),
    ["aspirin-two-groups", "why-water-dissolves"],
  );
});
