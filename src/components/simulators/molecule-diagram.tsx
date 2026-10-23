"use client";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  MousePointer2,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  diagrams,
  elementNames,
  type DiagramAtom,
} from "@/data/molecules/functional-groups";
const stages = ["ดูภาพรวม", "เน้นหมู่ฟังก์ชัน", "ลองชี้ด้วยตัวเอง"];
export function MoleculeDiagram({
  groupId,
  name,
  example,
}: {
  groupId: string;
  name: string;
  example: string;
}) {
  const [bondInfo, setBondInfo] = useState("");
  const model = diagrams[groupId];
  const [stage, setStage] = useState(0);
  const [showH, setShowH] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const atom = model.atoms.find((a) => a.id === selected);
  const visible = model.atoms.filter(
    (a) => showH || a.element !== "H" || a.group,
  );
  const visibleIds = new Set(visible.map((a) => a.id));
  const bonds = model.bonds.filter(
    (b) => visibleIds.has(b.from) && visibleIds.has(b.to),
  );
  const hydrogenCount = (a: DiagramAtom) =>
    model.bonds.filter((b) => {
      const other = b.from === a.id ? b.to : b.to === a.id ? b.from : null;
      return other && model.atoms.find((n) => n.id === other)?.element === "H";
    }).length;
  function choose(id: string) {
    setSelected(id);
    if (stage === 2)
      setFeedback(
        model.atoms.find((a) => a.id === id)?.group ? "correct" : "retry",
      );
  }
  function inspectBond(from: DiagramAtom, to: DiagramAtom, order: number) {
    setSelected(null);
    setFeedback(null);
    setBondInfo(
      `${order === 2 ? "พันธะคู่: เส้นสองเส้น แทนอิเล็กตรอนร่วมพันธะ 2 คู่" : "พันธะเดี่ยว: เส้นหนึ่งเส้น แทนอิเล็กตรอนร่วมพันธะ 1 คู่"} ระหว่าง${elementNames[from.element]}กับ${elementNames[to.element]}`,
    );
  }
  function next(n: number) {
    setBondInfo("");
    setStage(n);
    setSelected(null);
    setFeedback(null);
  }
  return (
    <section className="molecule-lab" aria-label={`ภาพโมเลกุล ${example}`}>
      <div className="molecule-stage-header">
        <div>
          <span className="eyebrow">MOLECULE SPOTLIGHT</span>
          <h3>{example}</h3>
        </div>
        <span className="molecule-formula">{model.formula}</span>
      </div>
      <div className="visual-steps">
        {stages.map((s, i) => (
          <button key={s} onClick={() => next(i)} aria-pressed={stage === i}>
            <span>{i + 1}</span>
            {s}
          </button>
        ))}
      </div>
      <div className="molecule-toolbar">
        <span>
          <MousePointer2 size={15} /> แตะอะตอมหรือเส้นพันธะเพื่อดูรายละเอียด
        </span>
        <button aria-pressed={showH} onClick={() => setShowH((v) => !v)}>
          {showH ? <EyeOff size={15} /> : <Eye size={15} />}แสดง H ทุกอะตอม
        </button>
      </div>
      <div className={`molecule-canvas stage-${stage}`}>
        <span className="diagram-badge">ภาพการเชื่อมต่อ 2 มิติ</span>
        <svg
          viewBox="0 0 740 430"
          aria-label={`โครงสร้าง ${example} กดเลือกอะตอมเพื่อเรียนรู้`}
        >
          <defs>
            <pattern
              id={`dots-${groupId}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#dbe8e4" />
            </pattern>
          </defs>
          <rect width="740" height="430" fill={`url(#dots-${groupId})`} />
          {bonds.map((b, i) => {
            const from = model.atoms.find((a) => a.id === b.from)!;
            const to = model.atoms.find((a) => a.id === b.to)!;
            const dx = to.x - from.x,
              dy = to.y - from.y,
              length = Math.hypot(dx, dy);
            const nx = (-dy / length) * 6,
              ny = (dx / length) * 6;
            const highlight = stage === 1 && from.group && to.group;
            return (
              <g
                key={i}
                className={`diagram-bond ${highlight ? "highlighted" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${b.order === 2 ? "พันธะคู่" : "พันธะเดี่ยว"} ${from.element} กับ ${to.element}`}
                onClick={() => inspectBond(from, to, b.order)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inspectBond(from, to, b.order);
                  }
                }}
              >
                <line
                  className="bond-hit"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="transparent"
                  strokeWidth="30"
                />
                {b.order === 2 ? (
                  <>
                    <line
                      x1={from.x + nx}
                      y1={from.y + ny}
                      x2={to.x + nx}
                      y2={to.y + ny}
                    />
                    <line
                      x1={from.x - nx}
                      y1={from.y - ny}
                      x2={to.x - nx}
                      y2={to.y - ny}
                    />
                  </>
                ) : (
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                )}
              </g>
            );
          })}
          {visible.map((a) => {
            const highlighted = stage === 1 && a.group;
            const h = hydrogenCount(a);
            return (
              <g
                key={a.id}
                role="button"
                tabIndex={0}
                aria-label={`${elementNames[a.element]} ${a.id}`}
                aria-pressed={selected === a.id}
                className={`diagram-atom element-${a.element} ${highlighted ? "highlighted" : ""} ${selected === a.id ? "selected" : ""}`}
                onClick={() => {
                  setBondInfo("");
                  choose(a.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setBondInfo("");
                    choose(a.id);
                  }
                }}
              >
                <circle className="atom-hit-area" cx={a.x} cy={a.y} r="45" />
                {highlighted && (
                  <circle className="atom-halo" cx={a.x} cy={a.y} r="48" />
                )}
                <circle
                  className="atom-body"
                  cx={a.x}
                  cy={a.y}
                  r={a.element === "H" ? 25 : 35}
                />
                <text
                  x={a.x}
                  y={a.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {a.element}
                </text>
                {!showH && a.element === "C" && h > 0 && (
                  <g>
                    <rect
                      x={a.x - 22}
                      y={a.y + 40}
                      width="44"
                      height="23"
                      rx="11"
                      fill="white"
                      stroke="#dbe5e1"
                    />
                    <text
                      className="hydrogen-count"
                      x={a.x}
                      y={a.y + 52}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {h} H
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        <div className="element-legend">
          {(["C", "O", "N", "H"] as const)
            .filter((e) => model.atoms.some((a) => a.element === e))
            .map((e) => (
              <span key={e}>
                <i className={`legend-${e}`} />
                {e} <small>{elementNames[e]}</small>
              </span>
            ))}
        </div>
      </div>
      <div className="diagram-explanation" aria-live="polite">
        {bondInfo ? (
          <>
            <Lightbulb size={20} />
            <div>
              <strong>อ่านเส้นพันธะ</strong>
              <p>{bondInfo}</p>
            </div>
          </>
        ) : atom ? (
          <>
            <span className={`selected-element element-${atom.element}`}>
              {atom.element}
            </span>
            <div>
              <strong>
                {elementNames[atom.element]} ·{" "}
                {
                  model.bonds.filter(
                    (b) => b.from === atom.id || b.to === atom.id,
                  ).length
                }{" "}
                อะตอมที่เชื่อมต่อ
              </strong>
              <p>
                {stage === 2
                  ? feedback === "correct"
                    ? `ใช่เลย! อะตอมนี้อยู่ในหมู่${name} ${model.explanation}`
                    : `ลองอีกนิด อะตอมนี้อยู่ในส่วนไฮโดรคาร์บอน ${model.clue}`
                  : `${atom.group ? `อะตอมนี้เป็นส่วนหนึ่งของหมู่${name}` : "อะตอมนี้อยู่ในส่วนไฮโดรคาร์บอน"}${atom.element === "C" && hydrogenCount(atom) > 0 ? ` · มี H ต่ออยู่ ${hydrogenCount(atom)} อะตอม กดแสดง H เพื่อดูทั้งหมด` : ""}`}
              </p>
            </div>
          </>
        ) : (
          <>
            <Lightbulb size={21} />
            <div>
              <strong>
                {stage === 0
                  ? "เริ่มจากสี แล้วค่อยดูการเชื่อมต่อ"
                  : stage === 1
                    ? `วงสีเขียวคือหมู่${name}`
                    : "ตาคุณแล้ว: แตะอะตอมหนึ่งตัวที่อยู่ในหมู่ฟังก์ชัน"}
              </strong>
              <p>
                {stage === 0
                  ? "วงกลมแต่ละวงแทนอะตอม เส้นเชื่อมแทนพันธะ ตัวเลข H ใต้ C บอกจำนวนไฮโดรเจนที่ซ่อนไว้"
                  : stage === 1
                    ? model.explanation
                    : model.clue}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="diagram-bottom">
        <span>
          {feedback === "correct" ? (
            <>
              <CheckCircle2 size={16} /> หาหมู่ฟังก์ชันเจอแล้ว!
            </>
          ) : (
            "เป็นแผนภาพการเชื่อมต่อ ไม่ใช่รูปร่างหรือมุมพันธะจริง"
          )}
        </span>
        {stage < 2 ? (
          <Button
            variant="outline"
            onClick={() => {
              setBondInfo("");
              next(stage + 1);
            }}
          >
            {stage === 0 ? "ดูส่วนที่สำคัญ" : "ลองหาเอง"}
            <ArrowRight size={15} />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setBondInfo("");
              setShowH(false);
              next(0);
            }}
          >
            <RotateCcw size={15} />
            ดูใหม่ทีละขั้น
          </Button>
        )}
      </div>
    </section>
  );
}
