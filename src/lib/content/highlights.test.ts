import { test } from "node:test";
import assert from "node:assert/strict";
import { highlightParts } from "./highlights";
import { articles, courses, articlesForCourse } from "../../data/knowledge";
test("literal highlights preserve every character and select repeated Thai phrases", () => {
  const text = "จำนวนโมลคงเดิม และจำนวนโมลไม่เปลี่ยน";
  const parts = highlightParts(text, ["จำนวนโมล"]);
  assert.equal(parts.map((p) => p.text).join(""), text);
  assert.equal(parts.filter((p) => p.highlighted).length, 2);
});
test("overlapping phrases use longest match, empty and regex-like phrases stay safe", () => {
  assert.deepEqual(highlightParts("mol/L and mol", ["mol", "mol/L", ""]), [
    { text: "mol/L", highlighted: true },
    { text: " and ", highlighted: false },
    { text: "mol", highlighted: true },
  ]);
  const text = "<script> & [A]₀ = 1.0";
  assert.equal(
    highlightParts(text, ["[A]₀", "<script>"])
      .map((p) => p.text)
      .join(""),
    text,
  );
  assert.deepEqual(highlightParts("", ["x"]), []);
});
test("all articles have real source excerpts, key points, terms and structured supporting content", () => {
  for (const a of articles) {
    assert.ok((a.keyPoints?.length || 0) >= 3, a.id);
    assert.ok((a.terms?.length || 0) >= 3, a.id);
    assert.ok(
      a.sections.some((s) => s.example || s.table || s.bullets),
      a.id,
    );
    assert.ok(
      a.sections.some((s) => s.note),
      a.id,
    );
    assert.ok(
      a.sections.some((s) => s.highlights?.length),
      a.id,
    );
    for (const s of a.sections) {
      for (const h of s.highlights || [])
        assert.ok(h.length > 0 && s.text.includes(h), `${a.id}: ${h}`);
      if (s.table)
        for (const row of s.table.rows)
          assert.equal(row.length, s.table.headers.length, a.id);
    }
  }
  for (const c of courses) assert.ok(articlesForCourse(c.id).length >= 3, c.id);
});
test("worked numerical examples agree with their stated simplified models", () => {
  function example(id: string, section: string) {
    const a = articles.find((a) => a.id === id);
    assert.ok(a);
    const s = a.sections.find((s) => s.title === section);
    assert.ok(s?.example);
    return s.example.result;
  }
  assert.ok(
    example("states-ideal-gas", "ตัวอย่างการคำนวณปริมาตร").includes(
      (0.1 * 0.082057 * 298.15).toFixed(2),
    ),
  );
  assert.ok(
    example("chemical-equilibrium", "นิพจน์สมดุลและการคำนวณ").includes(
      (0.4 ** 2 / (0.2 * 0.2)).toFixed(1),
    ),
  );
  assert.ok(
    example("acids-bases-ph", "กรดอ่อนและการประมาณสมดุล").includes(
      (-Math.log10(Math.sqrt(1.8e-5 * 0.1))).toFixed(2),
    ),
  );
  assert.ok(
    example("strong-acid-base-titration", "pH ก่อนถึงจุดสมมูล").includes(
      (-Math.log10((0.0025 - 0.001) / 0.035)).toFixed(2),
    ),
  );
  assert.ok(
    example("strong-acid-base-titration", "ที่สมมูลและหลังสมมูล").includes(
      (14 + Math.log10((0.003 - 0.0025) / 0.055)).toFixed(2),
    ),
  );
  assert.ok(
    example("redox-galvanic-cells", "การคำนวณศักย์เซลล์มาตรฐาน").includes(
      (0.34 - -0.76).toFixed(2),
    ),
  );
  assert.ok(
    example("electrolysis-faraday", "ความสัมพันธ์ประจุกับปริมาณสาร").includes(
      ((1 * 1930 * 63.5) / (2 * 96500)).toFixed(3),
    ),
  );
  assert.ok(
    example(
      "esterification-equilibrium",
      "ตัวอย่างองค์ประกอบสมดุลแบบอุดมคติ",
    ).includes((2 / 3).toFixed(3)),
  );
  assert.ok(
    example(
      "why-reactions-slow-down",
      "ตัวอย่างคำนวณความเข้มข้นและครึ่งชีวิต",
    ).includes(Math.exp(-0.05 * 20).toFixed(3)),
  );
});
