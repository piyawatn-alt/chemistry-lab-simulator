"use client";
import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  Download,
  Printer,
  Trash2,
  NotebookPen,
  ArrowRight,
  Save,
} from "lucide-react";
import { useLearningJournal } from "@/hooks/use-learning-journal";
import {
  journalMarkdown,
  parseJournal,
  mergeJournal,
  type Reflection,
} from "@/lib/storage/learning-journal";
import { ionization } from "@/lib/chemistry/ionization";
import { downloadText } from "./ionization-lab";
const blank = {
  title: "",
  prediction: "",
  observation: "",
  explanation: "",
  limits: "",
  next: "",
  references: "",
};
function date(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
export function LearningJournal() {
  const { journal, update, ready, storageError } = useLearningJournal();
  const [draft, setDraft] = useState(blank);
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState("");
  async function restore(event: ChangeEvent<HTMLInputElement>) {
    const element = event.currentTarget;
    const file = element.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error("ไฟล์ใหญ่เกิน 1 MB");
      const text = await file.text();
      const value: unknown = JSON.parse(text);
      if (
        !value ||
        typeof value !== "object" ||
        !("version" in value) ||
        value.version !== 1
      )
        throw new Error("ไฟล์ไม่ใช่ข้อมูลสำรองเวอร์ชันที่รองรับ");
      const incoming = parseJournal(text);
      if (!incoming.snapshots.length && !incoming.reflections.length)
        throw new Error("ไม่พบบันทึกที่ใช้ได้ในไฟล์นี้");
      update(mergeJournal(journal, incoming));
      setImportStatus(
        "นำเข้าข้อมูลแล้ว รวมบันทึกตามรหัสและเติมข้อมูลผู้จัดทำเฉพาะช่องที่ยังว่าง",
      );
    } catch (error) {
      setImportStatus(
        error instanceof Error
          ? `นำเข้าไม่ได้: ${error.message}`
          : "นำเข้าไฟล์ไม่ได้",
      );
    } finally {
      element.value = "";
    }
  }
  const evidence = journal.snapshots.length + journal.reflections.length;
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.observation.trim()) return;
    const existing = journal.reflections.find((r) => r.id === editing);
    const entry: Reflection = {
      ...draft,
      title: draft.title.trim(),
      observation: draft.observation.trim(),
      id: existing?.id ?? crypto.randomUUID(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    update({
      ...journal,
      reflections: editing
        ? journal.reflections.map((r) => (r.id === editing ? entry : r))
        : [...journal.reflections.slice(-49), entry],
    });
    setDraft(blank);
    setEditing(null);
    setStatus(editing ? "แก้ไขบันทึกแล้ว" : "เก็บบันทึกการเรียนรู้แล้ว");
  }
  return (
    <div className="learning-journal">
      <header className="pharma-heading">
        <span className="journal-kicker">PERSONAL LEARNING JOURNAL</span>
        <h1>
          สิ่งที่ฉันเรียนรู้
          <br />
          <em>มีหลักฐานให้เล่า</em>
        </h1>
        <p>
          เก็บผลจำลองและบันทึกด้วยคำของคุณเอง
          ส่งออกเป็นเอกสารประกอบการเล่าโครงงานและการเรียนรู้ด้วยตนเอง
        </p>
      </header>
      <div className="journal-evidence-summary">
        <div>
          <strong>{journal.snapshots.length}</strong>
          <span>เงื่อนไขที่กดบันทึก</span>
        </div>
        <div>
          <strong>{journal.reflections.length}</strong>
          <span>บันทึกสะท้อนการเรียนรู้</span>
        </div>
        <p>
          เก็บในเบราว์เซอร์นี้เท่านั้น
          <br />
          ส่งออกไฟล์เพื่อสำรองและนำไปใช้บนอุปกรณ์อื่น
        </p>
      </div>
      {storageError && (
        <p className="journal-storage-alert" role="alert">
          เบราว์เซอร์เก็บข้อมูลไม่ได้ ข้อมูลที่กำลังกรอกยังอยู่ในหน้านี้ชั่วคราว
          กรุณาส่งออกไฟล์ก่อนออกจากหน้า
        </p>
      )}
      <div className="journal-export-actions">
        <input
          hidden
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          aria-label="นำเข้าข้อมูล JSON"
          onChange={restore}
        />
        <button disabled={!ready} onClick={() => fileInput.current?.click()}>
          นำเข้า JSON
        </button>
        <button
          disabled={!ready || !evidence}
          onClick={() =>
            downloadText(
              "chemlab-learning-journal.md",
              journalMarkdown(journal),
              "text/markdown;charset=utf-8",
            )
          }
        >
          <Download size={16} /> ส่งออกเอกสาร Markdown
        </button>
        <button
          disabled={!ready || !evidence}
          onClick={() =>
            downloadText(
              "chemlab-learning-journal.json",
              JSON.stringify(journal, null, 2),
              "application/json",
            )
          }
        >
          <Download size={16} /> สำรองข้อมูล JSON
        </button>
        <button disabled={!ready || !evidence} onClick={() => window.print()}>
          <Printer size={16} /> พิมพ์ / บันทึก PDF
        </button>
      </div>
      <p className="journal-import-status" role="status">
        {importStatus}
      </p>
      <section className="journal-profile">
        <div>
          <span className="journal-kicker">PROJECT OWNERSHIP</span>
          <h2>ตัวฉันกับโครงงานนี้</h2>
          <p>
            ระบุบทบาทและเครื่องมือให้ตรงกับสิ่งที่ทำจริง เช่น
            ออกแบบประเด็นเรียนรู้ ตรวจข้อมูล ทดลองใช้ แก้เนื้อหา
            หรือพัฒนาโค้ดส่วนใด พร้อมสิ่งที่มีเครื่องมือหรือผู้ช่วยสนับสนุน
          </p>
        </div>
        <div className="journal-profile-print">
          {Object.entries({
            ผู้จัดทำ: journal.profile.name,
            เป้าหมาย: journal.profile.goal,
            บทบาทที่ทำจริง: journal.profile.role,
            เครื่องมือที่ใช้: journal.profile.tools,
          })
            .filter(([, v]) => v.trim())
            .map(([label, value]) => (
              <p key={label}>
                <strong>{label}</strong>
                <br />
                {value}
              </p>
            ))}
        </div>
        <div className="journal-profile-fields">
          {(
            [
              {
                key: "name",
                label: "ชื่อผู้จัดทำ",
                placeholder: "ชื่อที่ต้องการแสดงในเอกสาร",
              },
              {
                key: "goal",
                label: "เป้าหมายการเรียนรู้",
                placeholder: "ประเด็นเคมีหรือเภสัชที่อยากเข้าใจ",
              },
              {
                key: "role",
                label: "บทบาทที่ฉันทำจริง",
                placeholder: "สิ่งที่รับผิดชอบ ปรับปรุง หรือตรวจสอบด้วยตนเอง",
              },
              {
                key: "tools",
                label: "เครื่องมือและความช่วยเหลือที่ใช้",
                placeholder:
                  "เช่น Next.js, RDKit, AI ช่วยเขียนโค้ด และส่วนที่ตรวจแก้เอง",
              },
            ] as const
          ).map((f) => (
            <label key={f.key}>
              {f.label}
              <textarea
                aria-label={f.label}
                maxLength={2000}
                disabled={!ready}
                rows={f.key === "name" ? 1 : 2}
                value={journal.profile[f.key]}
                placeholder={f.placeholder}
                onChange={(e) =>
                  update({
                    ...journal,
                    profile: { ...journal.profile, [f.key]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>
      <section className="journal-snapshots">
        <div className="pharma-section-title">
          <span className="journal-kicker">RECORDED CONDITIONS</span>
          <h2>ผลจำลองที่บันทึกไว้</h2>
          <p>
            ตัวเลขคำนวณซ้ำจากเงื่อนไขที่บันทึก เก็บสูงสุด 20 เงื่อนไขล่าสุด
            เป็นผลของสารสมมติ ไม่ใช่ผลวัดสารยาจริง
          </p>
        </div>
        {journal.snapshots.length ? (
          <div
            className="journal-table-scroll"
            role="region"
            tabIndex={0}
            aria-label="ตารางผลจำลอง เลื่อนแนวนอนได้"
          >
            <table>
              <thead>
                <tr>
                  <th>บันทึกเมื่อ</th>
                  <th>ชนิด</th>
                  <th>pH / pKa</th>
                  <th>รูปไอออน</th>
                  <th>S/S₀</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {journal.snapshots.map((s) => {
                  const r = ionization(s.kind, s.ph, s.pka);
                  return (
                    <tr key={s.id}>
                      <td>{date(s.createdAt)}</td>
                      <td>{s.kind === "acid" ? "กรดอ่อน" : "เบสอ่อน"}</td>
                      <td>
                        {s.ph.toFixed(1)} / {s.pka.toFixed(1)}
                      </td>
                      <td>{(r.ionizedFraction * 100).toFixed(2)}%</td>
                      <td>{r.relativeSolubility.toPrecision(4)}</td>
                      <td>
                        <button
                          className="journal-delete"
                          aria-label={`ลบเงื่อนไข pH ${s.ph}`}
                          onClick={() =>
                            update({
                              ...journal,
                              snapshots: journal.snapshots.filter(
                                (x) => x.id !== s.id,
                              ),
                            })
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="journal-evidence-empty">
            <NotebookPen size={28} />
            <p>ยังไม่มีผลจำลองที่กดบันทึก</p>
            <Link href="/tools/ionization">
              ลอง pH กับการแตกตัว แล้วเก็บผล <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
      <div className="journal-writing">
        <section className="journal-writing-prompt">
          <span className="journal-kicker">REFLECT, NOT JUST RECORD</span>
          <h2>
            เปลี่ยนสิ่งที่เห็น
            <br />
            ให้เป็นสิ่งที่เข้าใจ
          </h2>
          <p>บันทึกที่ดีเล่าทั้งผลและเหตุผล รวมถึงสิ่งที่ยังสรุปไม่ได้</p>
          <ol>
            <li>ก่อนทดลอง คาดว่าจะเกิดอะไร</li>
            <li>เปลี่ยนตัวแปรใด และเห็นค่าอะไร</li>
            <li>ใช้หลักเคมีใดอธิบาย</li>
            <li>แบบจำลองนี้ยังตอบเรื่องใดไม่ได้</li>
            <li>จะตรวจต่อด้วยแหล่งข้อมูลใด</li>
          </ol>
          <p className="journal-writing-tip">
            ถ้าผลไม่ตรงที่คาด สามารถเขียนสิ่งที่เข้าใจผิดและแก้ความเข้าใจได้
            นั่นเป็นหลักฐานของการเรียนรู้ที่มีความหมาย
          </p>
        </section>
        <form className="journal-reflection-form" onSubmit={submit}>
          <h2>{editing ? "แก้ไขบันทึก" : "เขียนบันทึกใหม่"}</h2>
          <p className="journal-draft-note">
            ข้อความส่วนนี้จะเก็บเมื่อกดบันทึก
            ก่อนออกจากหน้าควรบันทึกหรือส่งออกข้อมูล
          </p>
          <label>
            ชื่อประเด็นที่ศึกษา
            <input
              required
              maxLength={200}
              value={draft.title}
              placeholder="เช่น เปรียบเทียบกรดอ่อนกับเบสอ่อนที่ pH เดียวกัน"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          {(
            [
              {
                key: "prediction",
                label: "สิ่งที่คาดก่อนทดลอง",
                placeholder: "เขียนการคาดการณ์ของคุณก่อนดูผล",
              },
              {
                key: "observation",
                label: "สิ่งที่สังเกตและข้อมูลที่ได้",
                placeholder: "ระบุเงื่อนไขที่ลอง ค่า หรือภาพที่สังเกตได้",
                required: true,
              },
              {
                key: "explanation",
                label: "คำอธิบายด้วยหลักเคมี",
                placeholder: "เชื่อมสิ่งที่เห็นกับสมดุล โครงสร้าง หรือสมการ",
              },
              {
                key: "limits",
                label: "ข้อจำกัดและสิ่งที่ยังสรุปไม่ได้",
                placeholder: "แยกข้อสรุปจากผลจำลองกับสิ่งที่ต้องใช้ข้อมูลจริง",
              },
              {
                key: "next",
                label: "สิ่งที่จะศึกษาต่อ",
                placeholder: "แนวทางทดลองหรืออ่านต่อเพื่อคลายข้อสงสัย",
              },
              {
                key: "references",
                label: "แหล่งอ้างอิงที่ได้อ่าน",
                placeholder: "ชื่อแหล่งข้อมูล ลิงก์ หรือหน้าหนังสือที่ใช้จริง",
              },
            ] as const
          ).map((f) => (
            <label key={f.key}>
              {f.label}
              <textarea
                aria-label={f.label}
                required={"required" in f && f.required}
                maxLength={4000}
                rows={3}
                value={draft[f.key]}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setDraft({ ...draft, [f.key]: e.target.value })
                }
              />
            </label>
          ))}
          <div className="pharma-actions">
            <button className="journal-button" type="submit" disabled={!ready}>
              <Save size={16} />{" "}
              {editing ? "เก็บการแก้ไข" : "บันทึกการเรียนรู้"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setDraft(blank);
                }}
              >
                ยกเลิกแก้ไข
              </button>
            )}
          </div>
          <p role="status">{status}</p>
        </form>
      </div>
      <section className="journal-reflections">
        <h2>บันทึกของฉัน</h2>
        {journal.reflections.length === 0 ? (
          <p className="journal-writing-tip">
            ยังไม่มีบันทึก เริ่มจากสิ่งที่คุณเพิ่งทดลองหรืออ่าน
            แล้วอธิบายด้วยคำของตัวเอง
          </p>
        ) : (
          journal.reflections.map((r) => (
            <article key={r.id}>
              <div>
                <span>{date(r.createdAt)}</span>
                <h3>{r.title}</h3>
              </div>
              {Object.entries({
                คาดการณ์: r.prediction,
                สังเกต: r.observation,
                อธิบายด้วยหลักเคมี: r.explanation,
                ข้อจำกัด: r.limits,
                ศึกษาต่อ: r.next,
                อ้างอิง: r.references,
              })
                .filter(([, v]) => v.trim())
                .map(([label, text]) => (
                  <div key={label}>
                    <strong>{label}</strong>
                    <p>{text}</p>
                  </div>
                ))}
              <div className="journal-entry-actions">
                <button
                  onClick={() => {
                    setEditing(r.id);
                    setDraft({
                      title: r.title,
                      prediction: r.prediction,
                      observation: r.observation,
                      explanation: r.explanation,
                      limits: r.limits,
                      next: r.next,
                      references: r.references,
                    });
                    document
                      .querySelector(".journal-reflection-form")
                      ?.scrollIntoView({ block: "start" });
                  }}
                >
                  แก้ไขบันทึก
                </button>
                <button
                  onClick={() => {
                    update({
                      ...journal,
                      reflections: journal.reflections.filter(
                        (x) => x.id !== r.id,
                      ),
                    });
                    if (editing === r.id) {
                      setEditing(null);
                      setDraft(blank);
                    }
                  }}
                >
                  ลบบันทึก
                </button>
              </div>
            </article>
          ))
        )}
      </section>
      <footer className="journal-print-note">
        <h2>ขอบเขตของหลักฐาน</h2>
        <p>
          ผลจำลองและบันทึกนี้ไม่ใช่ผลทดลองในห้องปฏิบัติการหรือหลักฐานผลทางคลินิก
          ข้อความสะท้อนการเรียนรู้เป็นสิ่งที่ผู้ใช้เขียน เงื่อนไข pH–pKa
          เป็นสารสมมติแบบหนึ่งตำแหน่งแตกตัว
          ข้อมูลการละลายไม่ใช้แทนการดูดซึมหรือประสิทธิผลของยา
        </p>
        <a href="https://github.com/piyawatn-alt/chemistry-lab-simulator">
          โค้ดและเอกสารโครงงาน · GitHub ↗
        </a>
        <p>
          <a href="https://chemistry-lab-simulator-seven.vercel.app/pharmacy">
            เว็บไซต์โครงงาน · ChemLab RX ↗
          </a>{" "}
          ·{" "}
          <a href="https://openstax.org/books/chemistry-2e/pages/14-6-buffers">
            หลักการกรด–เบส · OpenStax ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
