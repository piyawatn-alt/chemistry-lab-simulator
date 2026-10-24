import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeJournal,
  emptyJournal,
  parseJournal,
  journalMarkdown,
} from "./learning-journal";
test("journal starts with no invented achievements and tolerates corrupt or unknown data", () => {
  for (const raw of [null, "bad", "[]", '{"version":99}'])
    assert.deepEqual(parseJournal(raw), emptyJournal());
  assert.equal(emptyJournal().reflections.length, 0);
});
test("journal filters invalid snapshots and duplicate identities; export recalculates results", () => {
  const j = emptyJournal();
  j.snapshots = [
    {
      id: "one",
      createdAt: "2026-10-24T08:00:00.000Z",
      kind: "acid",
      ph: 4.5,
      pka: 4.5,
    },
  ];
  const raw = {
    ...j,
    snapshots: [
      ...j.snapshots,
      ...j.snapshots,
      { ...j.snapshots[0], id: "bad", ph: 99 },
    ],
  };
  const parsed = parseJournal(JSON.stringify(raw));
  assert.equal(parsed.snapshots.length, 1);
  const md = journalMarkdown(parsed);
  assert.match(md, /50.00%/);
  assert.match(md, /S\/S0 2.0000/);
});
test("only actual authored reflections survive parsing, with bounded input fields", () => {
  const j = emptyJournal();
  j.reflections = [
    {
      id: "r",
      createdAt: "2026-10-24T08:00:00.000Z",
      title: "pH เท่ากับ pKa",
      observation: "สองรูปมีสัดส่วนเท่ากัน",
      prediction: "",
      explanation: "",
      limits: "",
      next: "",
      references: "",
    },
  ];
  const p = parseJournal(JSON.stringify(j));
  assert.equal(p.reflections.length, 1);
  assert.ok(journalMarkdown(p).includes(j.reflections[0].observation));
  assert.equal(
    parseJournal(
      JSON.stringify({
        ...j,
        reflections: [{ ...j.reflections[0], observation: "" }],
      }),
    ).reflections.length,
    0,
  );
});

test("backup merge preserves existing attribution and identities while recovering missing records", () => {
  const current = emptyJournal();
  current.profile.name = "ผู้ใช้เดิม";
  current.snapshots = [
    {
      id: "same",
      createdAt: "2026-10-24T08:00:00.000Z",
      kind: "acid",
      ph: 4.5,
      pka: 4.5,
    },
  ];
  const incoming = structuredClone(current);
  incoming.profile.name = "ชื่อจากไฟล์";
  incoming.profile.tools = "ข้อมูลแหล่งเครื่องมือ";
  incoming.snapshots[0].ph = 5.5;
  incoming.snapshots.push({ ...incoming.snapshots[0], id: "new" });
  const merged = mergeJournal(current, incoming);
  assert.equal(merged.profile.name, "ผู้ใช้เดิม");
  assert.equal(merged.profile.tools, incoming.profile.tools);
  assert.equal(merged.snapshots.length, 2);
  assert.equal(merged.snapshots.find((s) => s.id === "same")!.ph, 4.5);
});
