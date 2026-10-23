"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Flame, Play, RotateCcw, ArrowRight } from "lucide-react";

const samples = [
  {
    id: "na",
    name: "โซเดียมคลอไรด์",
    formula: "NaCl",
    ion: "Na⁺",
    color: "#ffcb45",
    label: "เหลืองสว่าง",
    hint: "โซเดียมให้สีเหลืองเด่น แม้มีปริมาณเล็กน้อยก็อาจบดบังสีอื่นได้",
  },
  {
    id: "k",
    name: "โพแทสเซียมคลอไรด์",
    formula: "KCl",
    ion: "K⁺",
    color: "#c7a4ff",
    label: "ม่วงอ่อน",
    hint: "สีม่วงอ่อนของโพแทสเซียมมักสังเกตยากเมื่อมีโซเดียมปนอยู่",
  },
  {
    id: "li",
    name: "ลิเทียมคลอไรด์",
    formula: "LiCl",
    ion: "Li⁺",
    color: "#ff527b",
    label: "แดงเข้ม",
    hint: "ลิเทียมให้สีแดงเข้ม ตัวอย่างของเกลือโลหะที่ให้สีต่างจากโซเดียม",
  },
  {
    id: "ca",
    name: "แคลเซียมคลอไรด์",
    formula: "CaCl₂",
    ion: "Ca²⁺",
    color: "#ff8951",
    label: "ส้มแดง / แดงอิฐ",
    hint: "แคลเซียมให้สีส้มแดงหรือแดงอิฐ ต่างจากสีเหลืองของโซเดียม",
  },
  {
    id: "sr",
    name: "สตรอนเชียมคลอไรด์",
    formula: "SrCl₂",
    ion: "Sr²⁺",
    color: "#ff4054",
    label: "แดงสด",
    hint: "สตรอนเชียมให้สีแดงสด สีใกล้กันจึงไม่ได้แปลว่าเป็นสารชนิดเดียวกัน",
  },
  {
    id: "cu",
    name: "คอปเปอร์(II) คลอไรด์",
    formula: "CuCl₂",
    ion: "Cu²⁺",
    color: "#57e7bf",
    label: "เขียวอมฟ้า",
    hint: "สารประกอบทองแดงอาจให้สีเขียวถึงเขียวอมฟ้า ขึ้นกับสารประกอบและสภาวะ",
  },
];

export function FlameTest() {
  const [selected, setSelected] = useState(samples[0]);
  const [phase, setPhase] = useState<"ready" | "heating" | "result">("ready");
  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => {
    if (phase !== "heating") return;
    const timer = setTimeout(() => {
      setPhase("result");
      setHistory((previous) =>
        previous.includes(selected.id) ? previous : [...previous, selected.id],
      );
    }, 1800);
    return () => clearTimeout(timer);
  }, [phase, selected]);
  const active = phase === "result";
  return (
    <section className="flame-lab" aria-label="การทดลองจำลองสีเปลวไฟ">
      <div className="flame-lab-intro">
        <span className="journal-kicker">VIRTUAL EXPERIMENT · ม.4</span>
        <h2>สารต่างกัน แสงก็ต่างสี</h2>
        <p>
          เลือกเกลือโลหะ 1 ชนิด แล้วนำตัวอย่างเข้าสู่เปลวไฟจำลอง
          สังเกตสีและเทียบผลได้ทันที
        </p>
      </div>
      <div className="flame-workbench">
        <div className="flame-samples">
          <h3>
            <span>01</span> เลือกสารตัวอย่าง
          </h3>
          <div className="flame-sample-grid">
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === selected.id}
                disabled={phase === "heating"}
                onClick={() => {
                  setSelected(s);
                  setPhase("ready");
                }}
                style={{ "--sample-color": s.color } as CSSProperties}
              >
                <span className="sample-bottle" aria-hidden="true">
                  <i />
                </span>
                <strong>{s.formula}</strong>
                <small>{s.name}</small>
              </button>
            ))}
          </div>
          <p className="flame-small">
            ใช้เกลือของโลหะเป็นตัวอย่าง ไม่ใช่โลหะธาตุบริสุทธิ์
          </p>
        </div>
        <div className="flame-stage-panel">
          <div
            className="flame-stage"
            data-phase={phase}
            style={
              {
                "--flame-color": active ? selected.color : "#65bfff",
              } as CSSProperties
            }
          >
            <span className="flame-stage-label">โต๊ะทดลองเสมือน</span>
            <svg
              viewBox="0 0 600 390"
              role="img"
              aria-label={
                active
                  ? `เปลวไฟ${selected.label}จาก${selected.name}`
                  : "ตะเกียงและห่วงลวดสำหรับนำสารเข้าสู่เปลวไฟ"
              }
            >
              <defs>
                <radialGradient id="flame-glow">
                  <stop stopColor="var(--flame-color)" stopOpacity=".3" />
                  <stop
                    offset="1"
                    stopColor="var(--flame-color)"
                    stopOpacity="0"
                  />
                </radialGradient>
                <linearGradient id="flame-body" x1="0" y1="1" x2="0" y2="0">
                  <stop stopColor="#5d9bff" />
                  <stop offset=".35" stopColor="var(--flame-color)" />
                  <stop
                    offset="1"
                    stopColor="var(--flame-color)"
                    stopOpacity=".3"
                  />
                </linearGradient>
              </defs>
              <ellipse
                cx="300"
                cy="207"
                rx="153"
                ry="168"
                fill="url(#flame-glow)"
              />
              <path d="M40 340H560" stroke="#4b5b67" />
              <ellipse cx="300" cy="343" rx="105" ry="12" fill="#090e17" />
              <g className="flame-dance">
                <path
                  d="M300 285C230 278 241 229 263 195C280 166 280 135 305 93C298 156 353 180 352 228C368 264 335 290 300 285Z"
                  fill="url(#flame-body)"
                />
                <path
                  d="M301 281C270 274 277 250 288 228C296 209 299 201 302 181C309 215 332 250 321 268C317 278 310 281 301 281Z"
                  fill="#e9f5ff"
                  opacity=".85"
                />
              </g>
              <rect
                x="285"
                y="280"
                width="30"
                height="49"
                rx="5"
                fill="#869ba5"
              />
              <rect
                x="290"
                y="287"
                width="20"
                height="18"
                rx="3"
                fill="#405468"
              />
              <path d="M269 329H331L346 343H254Z" fill="#a5b6bc" />
              <path
                d="M315 317H385Q405 317 420 337"
                fill="none"
                stroke="#556b7c"
                strokeWidth="9"
              />
              <g className="flame-probe">
                <path d="M491 112L336 192" stroke="#a9bdc6" strokeWidth="5" />
                <path
                  d="M489 112L548 82"
                  stroke="#d6ab78"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="326"
                  cy="198"
                  rx="13"
                  ry="6"
                  transform="rotate(-27 326 198)"
                  fill="none"
                  stroke="#d3e0e4"
                  strokeWidth="3"
                />
                <circle cx="326" cy="198" r="4" fill={selected.color} />
              </g>
              <text
                x="300"
                y="378"
                textAnchor="middle"
                fill="#a6bac7"
                fontSize="14"
              >
                ตะเกียง · เปลวไฟพื้นฐานสีน้ำเงิน
              </text>
            </svg>
            <div className="flame-status" role="status" aria-live="polite">
              {phase === "ready"
                ? "พร้อมทดลอง · ยังไม่ได้ใส่ตัวอย่าง"
                : phase === "heating"
                  ? `กำลังนำ ${selected.formula} เข้าเปลวไฟ…`
                  : `${selected.formula} → ${selected.label}`}
            </div>
          </div>
          <div className="flame-actions">
            <button
              className="journal-button"
              disabled={phase === "heating"}
              onClick={() => {
                setPhase("heating");
              }}
            >
              <Play size={17} />
              {active ? "ทดลองซ้ำ" : "นำสารเข้าเปลวไฟ"}
            </button>
            <button
              className="journal-button"
              onClick={() => {
                setPhase("ready");
                setHistory([]);
              }}
            >
              <RotateCcw size={16} />
              เริ่มใหม่
            </button>
          </div>
        </div>
        <div className="flame-result">
          <span className="journal-kicker">02 · สังเกตผล</span>
          <h3>{selected.name}</h3>
          <span className="flame-formula">{selected.formula}</span>
          <p>
            ไอออนโลหะในสารตัวอย่าง <strong>{selected.ion}</strong>
          </p>
          <div
            className="flame-color-result"
            style={{ "--sample-color": selected.color } as CSSProperties}
          >
            <i aria-hidden="true" />
            <strong>{active ? selected.label : "รอผลการทดลอง"}</strong>
          </div>
          <p>
            {active
              ? selected.hint
              : "กดนำสารเข้าเปลวไฟ แล้วสังเกตสีที่เปลี่ยนจากสีน้ำเงินพื้นฐาน"}
          </p>
          <p className="flame-small">
            สีบนหน้าจอเป็นภาพแทนสีที่สังเกตได้ ไม่ใช่สเปกตรัมที่วัดจริง
          </p>
        </div>
      </div>
      <div className="flame-history">
        <h3>
          เปรียบเทียบสารที่ลองแล้ว{" "}
          <span>
            {history.length} / {samples.length}
          </span>
        </h3>
        {history.length ? (
          <div className="flame-history-items">
            {history.map((id) => {
              const s = samples.find((sample) => sample.id === id)!;
              return (
                <div key={id}>
                  <i style={{ background: s.color }} />
                  <strong>{s.formula}</strong>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p>
            ผลแต่ละสารจะปรากฏที่นี่หลังทดลอง ลองเลือกสารใหม่เพื่อเปรียบเทียบสี
          </p>
        )}
      </div>
      <div className="flame-explanation">
        <div>
          <span className="journal-kicker">เข้าใจสิ่งที่เห็น</span>
          <h2>ทำไมเปลวไฟจึงเปลี่ยนสี?</h2>
          <p>
            ความร้อนทำให้สารเข้าสู่สถานะแก๊สและกระตุ้นอนุภาคที่เปล่งแสง
            เมื่ออิเล็กตรอนกลับสู่ระดับพลังงานต่ำลง จะปล่อยพลังงานออกมาเป็นแสง
          </p>
          <p>
            <mark>
              ช่องว่างระหว่างระดับพลังงานต่างกัน
              จึงให้แสงที่มีความยาวคลื่นต่างกัน
            </mark>{" "}
            หลายเส้นแสงรวมกันเป็นสีที่ตาเห็น
            สีจึงสัมพันธ์กับชนิดของโลหะในตัวอย่าง
          </p>
          <p className="flame-small">
            แบบจำลองนี้ย่อการเปลี่ยนระดับพลังงานเหลือหนึ่งครั้ง
            ผู้เปล่งแสงจริงอาจเป็นอะตอมหรือชนิดอนุภาคอื่น
            ไม่ใช่ไอออนในเกลือเริ่มต้นเสมอไป
          </p>
        </div>
        <ol className="flame-energy">
          <li>
            <span>1</span>
            <div>
              <strong>รับพลังงานจากความร้อน</strong>
              <p>อิเล็กตรอนขึ้นสู่ระดับพลังงานสูง</p>
              <b aria-hidden="true">● ↑ ━━━</b>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>กลับสู่ระดับพลังงานต่ำ</strong>
              <p>ปล่อยพลังงานส่วนต่างออกมาเป็นแสง</p>
              <b style={{ color: selected.color }} aria-hidden="true">
                ● ↓ 〰 ✦
              </b>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>สังเกตสีของแสง</strong>
              <p>เช่น โซเดียมให้สีเหลืองเด่น</p>
              <b>ΔE = hν = hc/λ</b>
            </div>
          </li>
        </ol>
      </div>
      <div className="knowledge-note">
        <Flame size={24} />
        <p>
          กิจกรรมนี้เป็นการจำลองบนหน้าจอ การทดลองจริงใช้เปลวไฟและสารเคมี
          ควรทำในห้องปฏิบัติการภายใต้ผู้ดูแล
          สีเพียงอย่างเดียวไม่เพียงพอยืนยันชนิดของสารผสม
        </p>
      </div>
      <div className="tool-related">
        <span>อ่านต่อเรื่องระดับพลังงาน</span>
        <Link href="/read/electrons-periodic-table">
          อิเล็กตรอนและตารางธาตุ <ArrowRight size={17} />
        </Link>
      </div>
      <p className="flame-small">
        อ้างอิง:{" "}
        <a
          href="https://edu.rsc.org/experiments/flame-tests/729.article"
          target="_blank"
          rel="noreferrer"
        >
          Royal Society of Chemistry · Flame tests
        </a>
      </p>
    </section>
  );
}
