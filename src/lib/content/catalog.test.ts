import { test } from "node:test";
import assert from "node:assert/strict";
import {
  articles,
  courses,
  courseForArticle,
  articlesForCourse,
  searchArticles,
} from "../../data/knowledge";
test("every content entry belongs to a valid grade and subject, and every subject has readable content", () => {
  assert.equal(new Set(articles.map((a) => a.id)).size, articles.length);
  for (const a of articles) {
    const c = courseForArticle(a);
    assert.ok(c);
    assert.ok(["4", "5", "6"].includes(c.grade));
    assert.ok(a.sections.length > 0);
    assert.ok(a.sources.length > 0);
  }
  for (const c of courses) assert.ok(articlesForCourse(c.id).length > 0);
});
test("content headings are subject headings rather than questions", () => {
  for (const a of articles)
    for (const title of [a.title, ...a.sections.map((s) => s.title)])
      assert.ok(!/[?？]|ทำไม|หรือไม่|อย่างไร/.test(title), title);
});
test("catalog search supports course code, grade and chemistry terms", () => {
  assert.ok(
    searchArticles("ว31222").some((a) => a.id === "concentration-is-a-ratio"),
  );
  assert.ok(searchArticles("ม.6").some((a) => a.id === "chemical-models"));
  assert.ok(
    searchArticles("Functional groups").some(
      (a) => a.id === "small-groups-big-difference",
    ),
  );
});
