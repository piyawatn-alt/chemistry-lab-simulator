import { ionization, type IonizationKind } from "../chemistry/ionization";
export const JOURNAL_KEY = "chemlab-rx:learning-journal:v1";
export type Snapshot = {
  id: string;
  createdAt: string;
  kind: IonizationKind;
  ph: number;
  pka: number;
};
export type Reflection = {
  id: string;
  createdAt: string;
  title: string;
  prediction: string;
  observation: string;
  explanation: string;
  limits: string;
  next: string;
  references: string;
};
export type LearningJournal = {
  version: 1;
  profile: { name: string; goal: string; role: string; tools: string };
  snapshots: Snapshot[];
  reflections: Reflection[];
};
export function emptyJournal(): LearningJournal {
  return {
    version: 1,
    profile: { name: "", goal: "", role: "", tools: "" },
    snapshots: [],
    reflections: [],
  };
}
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const field = (v: unknown) => (typeof v === "string" ? v.slice(0, 4000) : "");
function validIdentity(v: Record<string, unknown>) {
  return (
    typeof v.id === "string" &&
    v.id.length > 0 &&
    v.id.length < 100 &&
    typeof v.createdAt === "string" &&
    Number.isFinite(Date.parse(v.createdAt))
  );
}
export function parseJournal(raw: string | null): LearningJournal {
  try {
    const v: unknown = JSON.parse(raw ?? "null");
    if (!record(v) || v.version !== 1) return emptyJournal();
    const p = record(v.profile) ? v.profile : {};
    const snapshots: Snapshot[] = [];
    const reflections: Reflection[] = [];
    if (Array.isArray(v.snapshots))
      for (const x of v.snapshots.slice(-20)) {
        if (
          !record(x) ||
          !validIdentity(x) ||
          (x.kind !== "acid" && x.kind !== "base") ||
          typeof x.ph !== "number" ||
          typeof x.pka !== "number"
        )
          continue;
        try {
          ionization(x.kind, x.ph, x.pka);
        } catch {
          continue;
        }
        if (!snapshots.some((s) => s.id === x.id))
          snapshots.push({
            id: x.id as string,
            createdAt: x.createdAt as string,
            kind: x.kind,
            ph: x.ph,
            pka: x.pka,
          });
      }
    if (Array.isArray(v.reflections))
      for (const x of v.reflections.slice(-50)) {
        if (
          !record(x) ||
          !validIdentity(x) ||
          !field(x.title).trim() ||
          !field(x.observation).trim()
        )
          continue;
        if (!reflections.some((r) => r.id === x.id))
          reflections.push({
            id: x.id as string,
            createdAt: x.createdAt as string,
            title: field(x.title),
            prediction: field(x.prediction),
            observation: field(x.observation),
            explanation: field(x.explanation),
            limits: field(x.limits),
            next: field(x.next),
            references: field(x.references),
          });
      }
    return {
      version: 1,
      profile: {
        name: field(p.name),
        goal: field(p.goal),
        role: field(p.role),
        tools: field(p.tools),
      },
      snapshots,
      reflections,
    };
  } catch {
    return emptyJournal();
  }
}
export function journalMarkdown(j: LearningJournal) {
  const text = [
    "# ChemLab RX — บันทึกการเรียนรู้ด้วยตนเอง",
    "",
    ...Object.entries({
      ผู้จัดทำ: j.profile.name,
      เป้าหมาย: j.profile.goal,
      บทบาทที่ทำจริง: j.profile.role,
      เครื่องมือที่ใช้: j.profile.tools,
    })
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `**${k}:** ${v}`),
    "",
    "## ผลการจำลองที่บันทึกจริง",
  ];
  for (const s of j.snapshots) {
    const r = ionization(s.kind, s.ph, s.pka);
    text.push(
      `- ${s.createdAt}: ${s.kind === "acid" ? "กรดอ่อนสมมติ" : "เบสอ่อนสมมติ (pKa ของ BH+)"}; pH ${s.ph}, pKa ${s.pka}; รูปไอออน ${(r.ionizedFraction * 100).toFixed(2)}%; S/S0 ${r.relativeSolubility.toPrecision(5)}`,
    );
  }
  text.push("", "## บันทึกสะท้อนการเรียนรู้");
  for (const r of j.reflections) {
    text.push("", `### ${r.title}`, `บันทึกเมื่อ ${r.createdAt}`);
    for (const [k, v] of Object.entries({
      คาดการณ์: r.prediction,
      สังเกต: r.observation,
      อธิบายด้วยหลักเคมี: r.explanation,
      ข้อจำกัด: r.limits,
      สิ่งที่จะศึกษาต่อ: r.next,
      อ้างอิง: r.references,
    }))
      if (v.trim()) text.push("", `**${k}**`, v);
  }
  text.push(
    "",
    "## ขอบเขตหลักฐาน",
    "บันทึกนี้ประกอบด้วยข้อความที่ผู้ใช้กรอกและเงื่อนไขจำลองที่กดบันทึก ไม่ใช่ผลทดลองในห้องปฏิบัติการหรือหลักฐานผลทางคลินิก",
    "แบบจำลอง: สารหนึ่งตำแหน่งแตกตัว อุดมคติ; pKa ของกรด HA หรือคู่กรด BH+ ของเบส B; S/S0 ใช้เมื่อมีของแข็งรูปเป็นกลางเหลือเกินและควบคุม pH ภายนอก ไม่ใช้ทำนายการดูดซึมหรือประสิทธิผลของยา",
    "อ้างอิงหลักการ: https://openstax.org/books/chemistry-2e/pages/14-6-buffers",
    "โค้ดโครงงาน: https://github.com/piyawatn-alt/chemistry-lab-simulator",
  );
  return text.join("\n") + "\n";
}

/** Merge a validated backup without replacing existing identities or filled attribution fields. */
export function mergeJournal(
  current: LearningJournal,
  incoming: LearningJournal,
): LearningJournal {
  const merge = <T extends { id: string; createdAt: string }>(
    old: T[],
    added: T[],
    limit: number,
  ) =>
    [...new Map([...added, ...old].map((x) => [x.id, x])).values()]
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
      .slice(-limit);
  return {
    version: 1,
    profile: {
      name: current.profile.name || incoming.profile.name,
      goal: current.profile.goal || incoming.profile.goal,
      role: current.profile.role || incoming.profile.role,
      tools: current.profile.tools || incoming.profile.tools,
    },
    snapshots: merge(current.snapshots, incoming.snapshots, 20),
    reflections: merge(current.reflections, incoming.reflections, 50),
  };
}
