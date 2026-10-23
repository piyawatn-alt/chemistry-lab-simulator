"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Sparkles,
  Target,
  CheckCircle2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/shared/learning";
import { Explorer, DecayExperiment } from "@/components/simulators/explorer";
import type { Lesson } from "@/data/curriculum";
import type { ProgressStore as Store } from "@/hooks/use-progress";
export function LessonView({
  lesson: l,
  store,
}: {
  lesson: Lesson;
  store: Store;
}) {
  const [stage, setStage] = useState(0);
  const [guided, setGuided] = useState(false);
  const [saved, setSaved] = useState(false);
  const names = ["เรียนรู้", "ฝึกแบบมีคำแนะนำ", "ทดลองอิสระ", "แบบทดสอบ"];
  function go(n: number) {
    setStage(n);
    store.update((p) => ({ ...p, lastLesson: l.id }));
  }
  return (
    <>
      <Link className="back-link" href="/lessons">
        ← กลับไปหน้าบทเรียน
      </Link>
      <PageHeading
        eyebrow={`${l.code} / ${l.grade}`}
        title={l.topic}
        subtitle={l.subtitle}
      >
        <Button
          variant="outline"
          onClick={() => {
            setStage(0);
            setGuided(false);
            setSaved(false);
          }}
        >
          <RotateCcw size={15} />
          เริ่มบทเรียนใหม่
        </Button>
      </PageHeading>
      <div className="lesson-steps" aria-label="ขั้นตอนการเรียนรู้">
        {names.map((n, i) => (
          <button
            key={n}
            className={stage === i ? "current" : ""}
            onClick={() => go(i)}
            aria-current={stage === i ? "step" : undefined}
          >
            <span>{i + 1}</span>
            <div>
              {n}
              <small>
                {["Learn", "Guided Practice", "Free Experiment", "Quiz"][i]}
              </small>
            </div>
          </button>
        ))}
      </div>
      <div className="lesson-layout">
        <div>
          {stage === 0 ? (
            <section className="panel lesson-content">
              <span className="tiny-label">LEARN · ทำความเข้าใจก่อนลงมือ</span>
              <h2>{l.topic}</h2>
              <p>{l.text}</p>
              <div className="formula-box">{l.formula}</div>
              <div className="callout warning">
                <Lightbulb size={20} />
                <div>
                  <strong>ความเข้าใจคลาดเคลื่อนที่พบบ่อย</strong>
                  <p>{l.misconception}</p>
                </div>
              </div>
              <div className="callout">
                <Sparkles size={20} />
                <div>
                  <strong>Chemistry to Pharmacy</strong>
                  <p>{l.pharmacy}</p>
                </div>
              </div>
              <Button onClick={() => go(1)}>
                ไปฝึกด้วยกัน <ArrowRight size={16} />
              </Button>
            </section>
          ) : stage === 1 ? (
            <section className="panel lesson-content">
              <span className="tiny-label">GUIDED PRACTICE</span>
              <h2>ลองคิดไปด้วยกัน</h2>
              <p>
                1. อ่านสูตรสำคัญ: <strong>{l.formula}</strong>
              </p>
              <p>2. อ่านโจทย์ แล้วลองอธิบายคำตอบด้วยคำพูดของคุณเอง</p>
              <h3>{l.question.prompt}</h3>
              <details>
                <summary>ขอคำใบ้</summary>
                <p>{l.question.hint}</p>
              </details>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={guided}
                  onChange={(e) => setGuided(e.target.checked)}
                />
                ฉันลองคิดและพร้อมตรวจสอบความเข้าใจแล้ว
              </label>
              <Button disabled={!guided} onClick={() => go(2)}>
                ไปทดลองอิสระ <ArrowRight size={16} />
              </Button>
            </section>
          ) : stage === 2 ? (
            <>
              {l.experiment === "groups" ? (
                <Explorer store={store} />
              ) : (
                <DecayExperiment />
              )}
              <div className="panel reflection">
                <h3>หยุดคิดสักนิด</h3>
                <p>
                  {l.experiment === "groups"
                    ? "เอสเทอร์กับกรดคาร์บอกซิลิกต่างกันที่การเชื่อมต่อใด? ลองสลับดูทั้งสองตัวอย่าง"
                    : "เมื่อเพิ่ม k เป็นสองเท่า ครึ่งชีวิตเปลี่ยนอย่างไร? ลองปรับกราฟเพื่อตรวจสอบ"}
                </p>
                <Button onClick={() => go(3)}>
                  ตรวจสอบความเข้าใจ <ArrowRight size={16} />
                </Button>
              </div>
            </>
          ) : (
            <Quiz
              key={l.id}
              lesson={l}
              onComplete={(score) => {
                store.update((p) => ({
                  ...p,
                  scores: { ...p.scores, [l.id]: score },
                  completed:
                    score === 100
                      ? Array.from(new Set([...p.completed, l.id]))
                      : p.completed,
                  lastLesson: l.id,
                }));
                setSaved(true);
              }}
              saved={saved}
            />
          )}
        </div>
        <aside>
          <section className="panel objectives">
            <span className="tiny-label">
              <Target size={16} /> เป้าหมายของบทเรียน
            </span>
            <h3>เมื่อเรียนจบ คุณจะ...</h3>
            {l.objectives.map((o) => (
              <p key={o}>
                <CheckCircle2 size={17} />
                {o}
              </p>
            ))}
            <div className="divider" />
            <span className="tiny-label">ความก้าวหน้าของบทเรียน</span>
            <div className="progress-track">
              <span style={{ width: `${((stage + 1) / 4) * 100}%` }} />
            </div>
            <small>ขั้นตอนที่ {stage + 1} จาก 4</small>
            <p className="small-text">
              ผ่านแบบทดสอบเพื่อบันทึกว่าเรียนจบ
              สามารถย้อนกลับไปทบทวนได้ทุกขั้นตอน
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

function Quiz({
  lesson: l,
  onComplete,
  saved,
}: {
  lesson: Lesson;
  onComplete: (score: number) => void;
  saved: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hint, setHint] = useState(false);
  const q = l.question;
  return (
    <section className="panel quiz">
      <span className="tiny-label">KNOWLEDGE CHECK · 1 คำถาม</span>
      <h2>{q.prompt}</h2>
      <p>เลือกคำตอบที่เหมาะสมที่สุด แล้วตรวจสอบความเข้าใจ</p>
      <fieldset disabled={submitted}>
        <legend className="sr-only">ตัวเลือกคำตอบ</legend>
        {q.choices.map((c, i) => (
          <label
            key={c}
            className={`answer ${selected === i ? "chosen" : ""} ${submitted && q.answer === i ? "correct" : ""}`}
          >
            <input
              type="radio"
              name="answer"
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
            <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
            {c}
            {submitted && q.answer === i && <Check size={18} />}
          </label>
        ))}
      </fieldset>
      {hint && !submitted && <p className="notice">{q.hint}</p>}
      {submitted ? (
        <div
          role="status"
          className={`feedback ${selected === q.answer ? "success" : "retry"}`}
        >
          <strong>
            {selected === q.answer
              ? "ถูกต้อง! เข้าใจเพิ่มขึ้นอีกขั้นแล้ว"
              : "ยังไม่ถูก ลองทบทวนอีกนิด"}
          </strong>
          <p>{q.explanation}</p>
          <p>
            {saved ? "บันทึกคะแนนล่าสุดแล้ว · " : ""}
            {selected === q.answer
              ? "บทเรียนนี้เรียนจบแล้ว ✓"
              : "กลับไปอ่านบทเรียน หรือกดลองใหม่ได้เลย"}
          </p>
        </div>
      ) : null}
      <div className="actions">
        {submitted ? (
          <Button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
              setHint(false);
            }}
          >
            <RotateCcw size={16} />
            ลองอีกครั้ง
          </Button>
        ) : (
          <>
            <Button
              disabled={selected === null}
              onClick={() => {
                setSubmitted(true);
                onComplete(selected === q.answer ? 100 : 0);
              }}
            >
              ตรวจคำตอบ <ArrowRight size={16} />
            </Button>
            <Button variant="ghost" onClick={() => setHint(true)}>
              <Lightbulb size={16} />
              ขอคำใบ้
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
