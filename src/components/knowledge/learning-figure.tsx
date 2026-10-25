"use client";
import { useId, type ReactNode } from "react";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Recycle,
  Database,
  GitBranch,
  CheckCircle2,
} from "lucide-react";
import type { FigureSpec } from "@/data/knowledge/figures";
import { SupplementaryDiagram } from "./supplementary-diagrams";
const green = "#527c65",
  orange = "#db8168",
  blue = "#7897b3";
function Sketch({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <svg
      className="learning-sketch"
      viewBox="0 0 320 230"
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>{label}</title>
      {children}
    </svg>
  );
}
function Panel({
  title,
  detail,
  children,
  tone = "green",
}: {
  title: string;
  detail: string;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <div className={`learning-panel tone-${tone}`}>
      <h4>{title}</h4>
      {children}
      <p>{detail}</p>
    </div>
  );
}
function Dot({
  x,
  y,
  label,
  fill = green,
  r = 18,
}: {
  x: number;
  y: number;
  label: string;
  fill?: string;
  r?: number;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        stroke={fill === "white" ? "#b6cabb" : "white"}
        strokeWidth="2"
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={fill === "white" ? "#607e66" : "white"}
        fontSize={label.length > 2 ? 12 : 16}
        fontFamily="Inter, Noto Sans Thai, sans-serif"
        fontWeight="500"
      >
        {label}
      </text>
    </g>
  );
}
function Arrow() {
  return (
    <span className="learning-arrow" aria-hidden="true">
      <ArrowRight size={23} />
    </span>
  );
}
function Beaker({
  level = 0.5,
  count = 6,
  fill = "#bad9cc",
  species = "solute",
}: {
  level?: number;
  count?: number;
  fill?: string;
  species?: string;
}) {
  const y = 190 - level * 130;
  return (
    <>
      <path
        d="M65 42V180Q65 196 82 196H238Q255 196 255 180V42"
        fill="white"
        stroke="#9db7a7"
        strokeWidth="3"
      />
      <path
        d={`M67 ${y}H253V180Q253 194 238 194H82Q67 194 67 180Z`}
        fill={fill}
      />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          data-species={species}
          cx={100 + (i % 3) * 60}
          cy={
            y +
            Math.min(14, (190 - y) / 4) +
            (Math.floor(i / 3) * (190 - y)) / 2
          }
          r="7"
          fill={green}
        />
      ))}
    </>
  );
}
function FunctionalPanels() {
  return (
    <div className="learning-panels two">
      <Panel
        title="แอลกอฮอล์: เอทานอล"
        detail="O–H ต่อกับคาร์บอนอิ่มตัว จัดเป็นหมู่แอลกอฮอล์"
      >
        <Sketch label="CH3 เชื่อม CH2 เชื่อม O เชื่อม H มีกรอบเน้น O-H">
          <rect
            x="189"
            y="81"
            width="116"
            height="78"
            rx="25"
            fill="#dcefdc"
            stroke="#81b38a"
            strokeDasharray="4 4"
          />
          <path d="M45 120H270" stroke="#99b6a3" strokeWidth="5" />
          <Dot x={45} y={120} label="CH₃" r={26} />
          <Dot x={125} y={120} label="CH₂" r={26} />
          <Dot x={217} y={120} label="O" fill={orange} r={23} />
          <Dot x={278} y={120} label="H" fill="white" />
          <text
            x="248"
            y="195"
            textAnchor="middle"
            fill="#67915e"
            fontSize="16"
          >
            หมู่ –OH
          </text>
        </Sketch>
      </Panel>
      <Panel
        title="กรดคาร์บอกซิลิก: กรดเอทาโนอิก"
        detail="C=O กับ O–H ต่อคาร์บอนเดียวกัน รวมเป็นหมู่คาร์บอกซิล"
      >
        <Sketch label="CH3 เชื่อม C ที่พันธะคู่กับ O และพันธะเดี่ยวกับ O-H">
          <rect
            x="99"
            y="28"
            width="209"
            height="150"
            rx="25"
            fill="#dcefdc"
            stroke="#81b38a"
            strokeDasharray="4 4"
          />
          <path
            d="M40 137H282M128 137V60M139 137V60"
            fill="none"
            stroke="#99b6a3"
            strokeWidth="5"
          />
          <Dot x={40} y={137} label="CH₃" r={26} />
          <Dot x={134} y={137} label="C" r={25} />
          <Dot x={134} y={59} label="O" fill={orange} r={23} />
          <Dot x={222} y={137} label="O" fill={orange} r={23} />
          <Dot x={282} y={137} label="H" fill="white" />
          <text
            x="206"
            y="210"
            textAnchor="middle"
            fill="#67915e"
            fontSize="16"
          >
            ทั้งส่วนนี้คือ –COOH
          </text>
        </Sketch>
      </Panel>
    </div>
  );
}
function BondWater() {
  return (
    <>
      <path
        d="M160 80 85 160M160 80 235 160"
        fill="none"
        stroke="#a9bfc9"
        strokeWidth="7"
      />
      <Dot x={160} y={80} label="O" fill={orange} r={30} />
      <Dot x={85} y={160} label="H" fill="white" r={23} />
      <Dot x={235} y={160} label="H" fill="white" r={23} />
      <path
        d="M103 133 132 103M217 133 188 103"
        stroke={green}
        strokeWidth="3"
      />
      <path
        d="M132 103 117 105M132 103 130 118M188 103 203 105M188 103 190 118"
        stroke={green}
        strokeWidth="3"
        fill="none"
      />
      <text x="160" y="25" textAnchor="middle" fill="#8a6c56" fontSize="15">
        O ดึงอิเล็กตรอนมากกว่า
      </text>
    </>
  );
}
function StructuralAtom({ ion = false }: { ion?: boolean }) {
  return (
    <>
      <circle
        cx="160"
        cy="115"
        r="64"
        fill="#edf3e8"
        stroke="#bad0b0"
        strokeWidth="2"
      />
      <circle cx="160" cy="115" r="37" fill="#d9e8d1" />
      <text x="160" y="110" textAnchor="middle" fill="#527447" fontSize="17">
        11 p⁺
      </text>
      <text x="160" y="132" textAnchor="middle" fill="#6f8865" fontSize="15">
        12 n⁰
      </text>
      {Array.from({ length: ion ? 10 : 11 }, (_, i) => {
        const a = (i * Math.PI * 2) / (ion ? 10 : 11);
        return (
          <circle
            data-particle="electron"
            key={i}
            cx={160 + 84 * Math.cos(a)}
            cy={115 + 84 * Math.sin(a)}
            r="7"
            fill={blue}
          />
        );
      })}
      <text x="160" y="223" textAnchor="middle" fill="#61815b" fontSize="16">
        {ion ? "10 อิเล็กตรอน" : "11 อิเล็กตรอน"}
      </text>
    </>
  );
}
function Hydrocarbon({ order }: { order: 1 | 2 | 3 }) {
  const h = order === 1 ? 6 : order === 2 ? 4 : 2;
  return (
    <>
      <g stroke="#a0baa5" strokeWidth="5">
        {Array.from({ length: order }, (_, i) => (
          <line
            key={i}
            x1="113"
            y1={113 + (i - (order - 1) / 2) * 9}
            x2="207"
            y2={113 + (i - (order - 1) / 2) * 9}
          />
        ))}
        {h === 6 && (
          <>
            <path d="M113 113H45M207 113H275" />
            <Dot x={45} y={113} label="H" fill="white" />
            <Dot x={275} y={113} label="H" fill="white" />
          </>
        )}
        {h >= 4 && (
          <>
            <path d="M113 113 80 48M113 113 80 178M207 113 240 48M207 113 240 178" />
            <Dot x={80} y={48} label="H" fill="white" />
            <Dot x={80} y={178} label="H" fill="white" />
            <Dot x={240} y={48} label="H" fill="white" />
            <Dot x={240} y={178} label="H" fill="white" />
          </>
        )}
        {h === 2 && (
          <>
            <path d="M113 113H45M207 113H275" />
            <Dot x={45} y={113} label="H" fill="white" />
            <Dot x={275} y={113} label="H" fill="white" />
          </>
        )}
      </g>
      <Dot x={113} y={113} label="C" r={24} />
      <Dot x={207} y={113} label="C" r={24} />
      <text x="160" y="222" textAnchor="middle" fill="#66875c" fontSize="17">
        {h} อะตอม H
      </text>
    </>
  );
}
function PanelSteps({ safety = false }: { safety?: boolean }) {
  const cards = safety
    ? [
        {
          title: "1. อ่านข้อมูล",
          Icon: FileText,
          text: "ชื่อสาร ความเข้มข้น ฉลาก และ SDS",
        },
        {
          title: "2. เลือกการควบคุม",
          Icon: ShieldCheck,
          text: "วิธีใช้ การระบายอากาศ และอุปกรณ์ที่เหมาะกับสาร",
        },
        {
          title: "3. จัดการของเสีย",
          Icon: Recycle,
          text: "แยกตามระบบห้องปฏิบัติการ ไม่ผสมหรือเททิ้งเอง",
        },
      ]
    : [
        {
          title: "1. ข้อมูล",
          Icon: Database,
          text: "ระบุตัวแปร หน่วย และความไม่แน่นอนจากการวัด",
        },
        {
          title: "2. แบบจำลอง",
          Icon: GitBranch,
          text: "กำหนดสมมติฐาน แล้วคำนวณค่าที่คาดการณ์",
        },
        {
          title: "3. ตรวจสอบ",
          Icon: CheckCircle2,
          text: "เปรียบเทียบหลายจุด และปรับแบบจำลองเมื่อจำเป็น",
        },
      ];
  return (
    <div className="learning-step-panels">
      {cards.map((c) => (
        <div key={c.title}>
          <c.Icon size={34} strokeWidth={1.4} />
          <ArrowRight
            className="learning-step-connector"
            size={20}
            aria-hidden="true"
          />
          <h4>{c.title}</h4>
          <p>{c.text}</p>
        </div>
      ))}
    </div>
  );
}
export function LearningFigure({ spec }: { spec: FigureSpec }) {
  const kind = spec.kind;
  return (
    <figure className="learning-figure" aria-label={spec.title}>
      <div className="learning-figure-title">
        <span>ภาพช่วยอธิบาย</span>
        <h3>{spec.title}</h3>
      </div>
      {kind === "dilution" ? (
        <>
          <div className="learning-panels with-arrow">
            <Panel title="ก่อนเจือจาง" detail="25.0 mL · 0.200 mol/L">
              <Sketch label="สารละลายเริ่มต้น มีจุดตัวละลายหกจุด">
                <Beaker level={0.25} count={6} />
              </Sketch>
            </Panel>
            <Arrow />
            <Panel
              title="หลังปรับปริมาตรสุดท้าย"
              detail="100.0 mL · 0.0500 mol/L"
            >
              <Sketch label="ปริมาตรสารละลายเพิ่ม แต่ยังมีจุดตัวละลายหกจุดเท่าเดิม">
                <Beaker level={1} count={6} fill="#d8eade" />
              </Sketch>
            </Panel>
          </div>
          <div className="visual-conclusion">
            เติมตัวทำละลาย → ปริมาตรเพิ่ม 4 เท่า → ความเข้มข้นเหลือ ¼<br />
            <strong>จำนวนโมลยังเท่าเดิม: 0.00500 mol</strong>
          </div>
        </>
      ) : kind === "gas-compression" ? (
        <div className="learning-panels with-arrow">
          {[1, 0.5].map((v, i) => (
            <Panel
              key={i}
              title={i ? "อัดให้ปริมาตรเหลือครึ่งหนึ่ง" : "ก่อนอัด"}
              detail={i ? "V₂ = ½V₁ · P₂ = 2P₁" : "V₁ · P₁"}
            >
              <Sketch label={`อนุภาคแก๊สหกจุดในปริมาตรสัมพัทธ์ ${v}`}>
                <rect
                  x="60"
                  y={195 - v * 145}
                  width="200"
                  height={v * 145}
                  rx="8"
                  fill="#edf3f6"
                  stroke="#9eb4be"
                  strokeWidth="3"
                />
                <rect
                  x="58"
                  y={185 - v * 145}
                  width="204"
                  height="13"
                  rx="3"
                  fill="#a7b7b7"
                />
                {Array.from({ length: 6 }, (_, n) => (
                  <circle
                    key={n}
                    data-species="gas"
                    cx={97 + (n % 3) * 63}
                    cy={195 - v * 145 + 27 + Math.floor(n / 3) * (v * 145 - 45)}
                    r="8"
                    fill={blue}
                  />
                ))}
                <text
                  x="160"
                  y="224"
                  textAnchor="middle"
                  fill="#6b8895"
                  fontSize="15"
                >
                  n และ T คงที่
                </text>
              </Sketch>
            </Panel>
          ))}
        </div>
      ) : kind === "functional-groups" ? (
        <FunctionalPanels />
      ) : kind === "atom-ion" ? (
        <>
          <div className="learning-panels with-arrow">
            <Panel title="อะตอม Na เป็นกลาง" detail="โปรตอน 11 = อิเล็กตรอน 11">
              <Sketch label="Na มีโปรตอนสิบเอ็ด นิวตรอนสิบสอง อิเล็กตรอนสิบเอ็ด">
                <StructuralAtom />
              </Sketch>
            </Panel>
            <Arrow />
            <Panel
              title="ไอออน Na⁺"
              detail="เสีย e⁻ 1 ตัว · นิวเคลียสไม่เปลี่ยน"
            >
              <Sketch label="Na+ มีโปรตอนสิบเอ็ด นิวตรอนสิบสอง อิเล็กตรอนสิบ">
                <StructuralAtom ion />
              </Sketch>
            </Panel>
          </div>
          <div className="visual-conclusion">
            Na → Na⁺ + e⁻
            <br />
            <strong>เปลี่ยนจำนวนอิเล็กตรอน ไม่ใช่จำนวนโปรตอน</strong>
          </div>
        </>
      ) : kind === "electron-shells" ? (
        <div className="learning-panels two">
          <Panel
            title="ภาพช่วยนับระดับพลังงานหลัก"
            detail="Na เป็นกลาง: อิเล็กตรอน 11 ตัว"
          >
            <Sketch label="ระดับพลังงานหลักสามชั้น มีอิเล็กตรอนสอง แปด และหนึ่งตัว">
              <circle cx="160" cy="115" r="18" fill="#b7d1ad" />
              <text
                x="160"
                y="119"
                textAnchor="middle"
                fontSize="11"
                fill="#456a3d"
              >
                Na
              </text>
              {[34, 65, 97].map((r, j) => (
                <g key={r}>
                  <circle
                    cx="160"
                    cy="115"
                    r={r}
                    stroke="#c6d6c1"
                    fill="none"
                    strokeDasharray="4 5"
                  />
                  {Array.from({ length: [2, 8, 1][j] }, (_, i) => {
                    const a = (i * Math.PI * 2) / [2, 8, 1][j] - 0.8;
                    return (
                      <circle
                        key={i}
                        data-particle="electron"
                        cx={160 + r * Math.cos(a)}
                        cy={115 + r * Math.sin(a)}
                        r="6"
                        fill={j === 2 ? orange : blue}
                      />
                    );
                  })}
                </g>
              ))}
            </Sketch>
          </Panel>
          <div className="energy-level-labels">
            <div>
              <b>n = 1</b>
              <span>2 ตัว → 1s²</span>
            </div>
            <div>
              <b>n = 2</b>
              <span>8 ตัว → 2s² 2p⁶</span>
            </div>
            <div>
              <b>n = 3</b>
              <span>1 ตัว → 3s¹</span>
            </div>
            <p>สีส้มคือเวเลนซ์อิเล็กตรอนชั้นนอกสุดของ Na ในตัวอย่างนี้</p>
          </div>
        </div>
      ) : kind === "polarity" ? (
        <div className="learning-panels two">
          <Panel
            title="H₂O: รูปร่างงอ"
            detail="ขั้วพันธะไม่หักล้าง → โมเลกุลมีขั้ว"
          >
            <Sketch label="น้ำรูปงอ ลูกศรจาก H ทั้งสองเข้าหา O">
              <BondWater />
            </Sketch>
          </Panel>
          <Panel
            title="CO₂: เส้นตรงและสมมาตร"
            detail="ขั้วพันธะหักล้าง → โมเลกุลไม่มีขั้ว"
          >
            <Sketch label="CO2 เส้นตรง ลูกศรจาก C ชี้ออกไป O สองด้านเท่ากัน">
              <path
                d="M65 110H255M65 121H255"
                stroke="#a7bbc3"
                strokeWidth="5"
              />
              <Dot x={65} y={115} label="O" fill={orange} r={28} />
              <Dot x={160} y={115} label="C" r={27} />
              <Dot x={255} y={115} label="O" fill={orange} r={28} />
              <path
                d="M140 65H78L90 55M180 65H242L230 55"
                fill="none"
                stroke={green}
                strokeWidth="3"
              />
              <text
                x="160"
                y="200"
                textAnchor="middle"
                fill="#66875e"
                fontSize="15"
              >
                ทิศตรงข้าม ขนาดเท่ากัน
              </text>
            </Sketch>
          </Panel>
        </div>
      ) : kind === "solubility" ? (
        <div className="learning-panels two">
          <Panel title="ในผลึก" detail="Na⁺ และ Cl⁻ ยึดอยู่ในโครงผลึก">
            <Sketch label="ไอออนบวกและลบสลับกันในส่วนของผลึก NaCl">
              <path
                d="M105 65H215V170H105ZM105 65 215 170M215 65 105 170"
                fill="none"
                stroke="#c8d8bf"
                strokeWidth="3"
              />
              {[
                [105, 65, "Na⁺"],
                [215, 65, "Cl⁻"],
                [105, 170, "Cl⁻"],
                [215, 170, "Na⁺"],
              ].map(([x, y, label], i) => (
                <Dot
                  key={i}
                  x={+x}
                  y={+y}
                  label={String(label)}
                  fill={label === "Na⁺" ? blue : green}
                  r={28}
                />
              ))}
            </Sketch>
          </Panel>
          <Panel
            title="เมื่อล้อมด้วยโมเลกุลน้ำ"
            detail="ด้าน O หันหา Na⁺ · ด้าน H หันหา Cl⁻"
          >
            <Sketch label="O ด้านลบบางส่วนหันเข้าหา Na+ และ H ด้านบวกบางส่วนหันเข้าหา Cl-">
              <Dot x={85} y={115} label="Na⁺" fill={blue} r={29} />
              <Dot x={235} y={115} label="Cl⁻" fill={green} r={29} />
              {[0, Math.PI].map((angle, i) => {
                const y = i ? 180 : 50;
                return (
                  <g key={angle}>
                    <path
                      d={`M65 ${y} 85 ${y + (i ? -20 : 20)} 105 ${y}`}
                      fill="none"
                      stroke="#b4c8ca"
                      strokeWidth="3"
                    />
                    <Dot
                      x={85}
                      y={y + (i ? -20 : 20)}
                      label="O"
                      fill={orange}
                      r={13}
                    />
                    <Dot x={65} y={y} label="H" fill="white" r={10} />
                    <Dot x={105} y={y} label="H" fill="white" r={10} />
                    <path
                      d={`M215 ${y + (i ? -20 : 20)} 235 ${y} 255 ${y + (i ? -20 : 20)}`}
                      fill="none"
                      stroke="#b4c8ca"
                      strokeWidth="3"
                    />
                    <Dot x={235} y={y} label="O" fill={orange} r={13} />
                    <Dot
                      x={215}
                      y={y + (i ? -20 : 20)}
                      label="H"
                      fill="white"
                      r={10}
                    />
                    <Dot
                      x={255}
                      y={y + (i ? -20 : 20)}
                      label="H"
                      fill="white"
                      r={10}
                    />
                  </g>
                );
              })}
            </Sketch>
          </Panel>
        </div>
      ) : null}
      {kind === "stoichiometry" ? (
        <>
          <div className="learning-panels with-arrow">
            <Panel title="ก่อนเกิดปฏิกิริยา" detail="2H₂ + O₂">
              <Sketch label="สองโมเลกุล H2 และหนึ่งโมเลกุล O2 รวมไฮโดรเจนสี่และออกซิเจนสอง">
                <path
                  d="M65 65H115M65 160H115M225 75V150"
                  stroke="#a5b9be"
                  strokeWidth="5"
                />
                {[
                  [65, 65],
                  [115, 65],
                  [65, 160],
                  [115, 160],
                ].map(([x, y], i) => (
                  <Dot key={i} x={x} y={y} label="H" fill="white" r={23} />
                ))}
                <Dot x={225} y={75} label="O" fill={orange} r={26} />
                <Dot x={225} y={150} label="O" fill={orange} r={26} />
              </Sketch>
            </Panel>
            <Arrow />
            <Panel title="หลังเกิดปฏิกิริยา" detail="2H₂O">
              <Sketch label="สองโมเลกุลน้ำ รวมไฮโดรเจนสี่และออกซิเจนสอง">
                {[90, 235].map((x) => (
                  <g key={x}>
                    <path
                      d={`M${x - 30} 145 ${x} 95 ${x + 30} 145`}
                      fill="none"
                      stroke="#a5b9be"
                      strokeWidth="5"
                    />
                    <Dot x={x} y={95} label="O" fill={orange} r={27} />
                    <Dot x={x - 30} y={145} label="H" fill="white" r={21} />
                    <Dot x={x + 30} y={145} label="H" fill="white" r={21} />
                  </g>
                ))}
              </Sketch>
            </Panel>
          </div>
          <div className="visual-conclusion">
            ก่อน: H 4 + O 2 = หลัง: H 4 + O 2<br />
            <strong>ดุลด้วยสัมประสิทธิ์ ไม่เปลี่ยนเลขห้อยในสูตร</strong>
          </div>
        </>
      ) : kind === "half-life" ? (
        <div className="learning-panels three">
          {[8, 4, 2].map((count, i) => (
            <Panel
              key={count}
              title={["เริ่มต้น", "ผ่าน 1 ครึ่งชีวิต", "ผ่าน 2 ครึ่งชีวิต"][i]}
              detail={["100% ของค่าเริ่มต้น", "เหลือ 50%", "เหลือ 25%"][i]}
            >
              <Sketch label={`ปริมาณสัมพัทธ์ ${count} จุด จากเริ่มต้นแปดจุด`}>
                <rect
                  x="40"
                  y="35"
                  width="240"
                  height="165"
                  rx="12"
                  fill="#f8fbf5"
                  stroke="#d6e3cd"
                />
                {Array.from({ length: count }, (_, j) => (
                  <circle
                    data-particle="remaining"
                    key={j}
                    cx={77 + (j % 4) * 55}
                    cy={95 + Math.floor(j / 4) * 55}
                    r="16"
                    fill={green}
                  />
                ))}
                <text
                  x="160"
                  y="226"
                  textAnchor="middle"
                  fill="#66875d"
                  fontSize="16"
                >
                  {["[A]₀", "[A]₀ / 2", "[A]₀ / 4"][i]}
                </text>
              </Sketch>
            </Panel>
          ))}
        </div>
      ) : kind === "hydrocarbons" ? (
        <div className="learning-panels three">
          {([1, 2, 3] as const).map((order, i) => (
            <Panel
              key={order}
              title={["เอเทน · C₂H₆", "เอทีน · C₂H₄", "เอไทน์ · C₂H₂"][i]}
              detail={["C–C พันธะเดี่ยว", "C=C พันธะคู่", "C≡C พันธะสาม"][i]}
            >
              <Sketch
                label={
                  [
                    "เอเทนมีคาร์บอนสอง ไฮโดรเจนหก",
                    "เอทีนมีคาร์บอนสอง ไฮโดรเจนสี่",
                    "เอไทน์มีคาร์บอนสอง ไฮโดรเจนสอง",
                  ][i]
                }
              >
                <Hydrocarbon order={order} />
              </Sketch>
            </Panel>
          ))}
        </div>
      ) : kind === "activation" ? (
        <>
          <Sketch label="เส้นทางไม่มีตัวเร่งมีจุดสูงกว่าเส้นทางมีตัวเร่ง แต่พลังงานสารตั้งต้นและผลิตภัณฑ์เท่ากันทั้งสองเส้น">
            <path
              d="M27 25V207H300"
              fill="none"
              stroke="#b7c7af"
              strokeWidth="2"
            />
            <path
              d="M43 169C90 169 103 24 154 35S232 194 284 194"
              fill="none"
              stroke={orange}
              strokeWidth="4"
            />
            <path
              d="M43 169C90 169 103 100 154 112S232 194 284 194"
              fill="none"
              stroke={green}
              strokeWidth="4"
            />
            <path
              d="M65 168V45M59 53 65 45 71 53M89 168V119M83 127 89 119 95 127"
              stroke="#9ba98e"
              strokeWidth="2"
              fill="none"
            />
            <text x="12" y="22" fill="#78936d" fontSize="13">
              พลังงาน
            </text>
            <text
              x="155"
              y="226"
              textAnchor="middle"
              fill="#78936d"
              fontSize="12"
            >
              พิกัดการดำเนินปฏิกิริยา (ไม่ใช่เวลา)
            </text>
          </Sketch>
          <div className="figure-color-legend">
            <span>
              <i style={{ background: orange }} />
              ไม่มีตัวเร่ง: อุปสรรคสูงกว่า
            </span>
            <span>
              <i style={{ background: green }} />
              มีตัวเร่ง: อุปสรรคต่ำกว่า
            </span>
          </div>
          <div className="visual-conclusion">
            ตัวเร่งช่วยให้เร็วขึ้น
            <br />
            <strong>ไม่เปลี่ยน K เมื่ออุณหภูมิเท่าเดิม</strong>
          </div>
        </>
      ) : kind === "equilibrium" ? (
        <>
          <div className="equilibrium-mixture">
            <Panel
              title="A และ B อยู่ร่วมในระบบเดียว"
              detail="ตัวอย่างเฉลี่ย A 2 หน่วย · B 6 หน่วย"
            >
              <Sketch label="สาร A สองหน่วยกับ B หกหน่วยอยู่ร่วมในภาชนะเดียวที่สมดุล">
                <Beaker level={1} count={0} />
                {Array.from({ length: 8 }, (_, i) => (
                  <Dot
                    key={i}
                    x={95 + (i % 4) * 43}
                    y={98 + Math.floor(i / 4) * 57}
                    label={i < 2 ? "A" : "B"}
                    fill={i < 2 ? green : orange}
                    r={14}
                  />
                ))}
              </Sketch>
            </Panel>
          </div>
          <div className="equilibrium-flow">
            <span>
              ไปข้างหน้า <ArrowRight size={21} />
            </span>
            <span>
              <ArrowRight size={21} style={{ transform: "rotate(180deg)" }} />
              ย้อนกลับ
            </span>
            <strong>อัตราไปข้างหน้า = อัตราย้อนกลับ</strong>
          </div>
        </>
      ) : kind === "acid-dissociation" ? (
        <div className="learning-panels two">
          <Panel
            title="กรดแก่: แตกตัวเกือบหมด"
            detail="เริ่มด้วย HA จำนวนเท่ากับภาพขวา"
          >
            <Sketch label="กรดแก่สี่หน่วยแตกเป็น H+ สี่และ A- สี่">
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <Dot
                    x={78 + (i % 2) * 160}
                    y={65 + Math.floor(i / 2) * 100}
                    label="H⁺"
                    fill={orange}
                    r={22}
                  />
                  <Dot
                    x={116 + (i % 2) * 160}
                    y={100 + Math.floor(i / 2) * 100}
                    label="A⁻"
                    fill={blue}
                    r={22}
                  />
                </g>
              ))}
            </Sketch>
          </Panel>
          <Panel
            title="กรดอ่อน: แตกตัวบางส่วน"
            detail="ยังมี HA ที่ไม่แตกตัวอยู่"
          >
            <Sketch label="กรดอ่อนจากสี่หน่วย มี HA สามและ H+ กับ A- อย่างละหนึ่ง">
              {[
                [80, 65],
                [230, 65],
                [80, 165],
              ].map(([x, y], i) => (
                <Dot key={i} x={x} y={y} label="HA" fill={green} r={27} />
              ))}
              <Dot x={215} y={150} label="H⁺" fill={orange} r={22} />
              <Dot x={260} y={190} label="A⁻" fill={blue} r={22} />
            </Sketch>
          </Panel>
        </div>
      ) : kind === "titration" ? (
        <div className="learning-panels three">
          {[0, 1, 2].map((i) => (
            <Panel
              key={i}
              title={
                ["เติมเบส 10.0 mL", "เติมเบส 25.0 mL", "เติมเบส 30.0 mL"][i]
              }
              detail={
                [
                  "ก่อนสมมูล · pH ≈ 1.37",
                  "ที่สมมูล · pH ≈ 7.00",
                  "หลังสมมูล · pH ≈ 11.96",
                ][i]
              }
              tone={i === 1 ? "green" : "blue"}
            >
              <Sketch
                label={
                  [
                    "ก่อนสมมูลมี H3O+ เหลือ",
                    "ที่สมมูลไม่มีกรดหรือเบสส่วนเกินจากการเติม",
                    "หลังสมมูลมี OH- เหลือ",
                  ][i]
                }
              >
                <Beaker
                  level={[0.65, 0.85, 0.95][i]}
                  count={0}
                  fill={["#f4d8cd", "#e5eee0", "#dce7f0"][i]}
                />
                {i === 1 ? (
                  <text
                    x="160"
                    y="155"
                    textAnchor="middle"
                    fill="#739565"
                    fontSize="16"
                  >
                    ไม่มีส่วนเกิน
                  </text>
                ) : (
                  <>
                    <Dot
                      x={123}
                      y={137}
                      label={i === 0 ? "H₃O⁺" : "OH⁻"}
                      fill={i === 0 ? orange : blue}
                      r={27}
                    />
                    {i === 0 && (
                      <Dot x={203} y={155} label="H₃O⁺" fill={orange} r={27} />
                    )}
                  </>
                )}
              </Sketch>
            </Panel>
          ))}
        </div>
      ) : kind === "ester-equilibrium" ? (
        <div className="learning-panels two">
          {[false, true].map((after) => (
            <Panel
              key={String(after)}
              title={after ? "ที่สมดุลในตัวอย่างสมมติ" : "ก่อนเกิดปฏิกิริยา"}
              detail={
                after
                  ? "K = 4.0 · x = 2/3 mol"
                  : "เริ่มกรดและแอลกอฮอล์ชนิดละ 1.00 mol"
              }
            >
              <div
                className="amount-bars"
                role="img"
                aria-label={
                  after
                    ? "กรดและแอลกอฮอล์เหลือชนิดละประมาณ 0.333 mol เอสเทอร์และน้ำมีชนิดละประมาณ 0.667 mol"
                    : "ก่อนเกิดปฏิกิริยา กรดและแอลกอฮอล์มีชนิดละ 1.000 mol เอสเทอร์และน้ำไม่มี"
                }
              >
                {["กรด", "แอลกอฮอล์", "เอสเทอร์", "น้ำ"].map((label, i) => {
                  const amount = after
                    ? i < 2
                      ? 1 / 3
                      : 2 / 3
                    : i < 2
                      ? 1
                      : 0;
                  return (
                    <div key={label}>
                      <span>{label}</span>
                      <div>
                        <i
                          style={{
                            width: `${amount * 100}%`,
                            background: i < 2 ? green : orange,
                          }}
                        />
                      </div>
                      <b>{amount.toFixed(3)} mol</b>
                    </div>
                  );
                })}
              </div>
            </Panel>
          ))}
        </div>
      ) : kind === "polymer" ? (
        <>
          <div className="learning-panels with-arrow">
            <Panel title="มอนอเมอร์: เอทีน" detail="มีพันธะ C=C">
              <Sketch label="เอทีน CH2=CH2 เป็นตัวอย่างมอนอเมอร์">
                <Hydrocarbon order={2} />
              </Sketch>
            </Panel>
            <Arrow />
            <Panel
              title="ส่วนหนึ่งของสายพอลิเอทิลีน"
              detail="เชื่อมต่อเป็นพันธะเดี่ยวซ้ำกัน"
            >
              <Sketch label="หน่วย CH2 เชื่อมต่อเป็นสายด้วยพันธะเดี่ยว">
                <path
                  d="M15 105 72 150 132 105 192 150 252 105 305 150"
                  stroke="#a8b99a"
                  strokeWidth="6"
                  fill="none"
                />
                {[
                  [72, 150],
                  [132, 105],
                  [192, 150],
                  [252, 105],
                ].map(([x, y], i) => (
                  <Dot x={x} y={y} label="CH₂" r={24} key={i} />
                ))}
                <path
                  d="M114 65H102V185H114M211 65H224V185H211"
                  fill="none"
                  stroke="#9aab8b"
                  strokeWidth="2"
                />
                <text x="250" y="208" fill="#799569" fontSize="17">
                  n หน่วยซ้ำ
                </text>
              </Sketch>
            </Panel>
          </div>
          <div className="visual-conclusion">
            n CH₂=CH₂ → [–CH₂–CH₂–]ₙ
            <br />
            <strong>หน่วยซ้ำของสายโซ่ ไม่ใช่โมเลกุลแยกกัน</strong>
          </div>
        </>
      ) : kind === "precision" ? (
        <div className="learning-panels three">
          {["แม่นและเที่ยง", "เที่ยง แต่ไม่แม่น", "ไม่เที่ยง"].map(
            (title, i) => (
              <Panel
                key={title}
                title={title}
                detail={
                  [
                    "ผลซ้ำใกล้กัน และใกล้ค่าอ้างอิง",
                    "ผลซ้ำใกล้กัน แต่ห่างค่าอ้างอิง",
                    "ผลวัดกระจาย ไม่ใกล้กัน",
                  ][i]
                }
              >
                <Sketch label={title}>
                  {[75, 50, 25].map((r) => (
                    <circle
                      cx="160"
                      cy="115"
                      r={r}
                      key={r}
                      fill={r === 25 ? "#e2ecda" : "none"}
                      stroke="#b3c6a7"
                      strokeWidth="2"
                    />
                  ))}
                  <path
                    d="M150 115H170M160 105V125"
                    stroke="#88a075"
                    strokeWidth="2"
                  />
                  {(i === 0
                    ? [
                        [158, 112],
                        [165, 119],
                        [154, 121],
                        [162, 107],
                      ]
                    : i === 1
                      ? [
                          [207, 77],
                          [214, 82],
                          [205, 85],
                          [216, 75],
                        ]
                      : [
                          [110, 73],
                          [205, 80],
                          [128, 166],
                          [210, 153],
                        ]
                  ).map(([x, y], j) => (
                    <circle key={j} cx={x} cy={y} r="6" fill={orange} />
                  ))}
                  <text
                    x="160"
                    y="220"
                    textAnchor="middle"
                    fill="#7b956d"
                    fontSize="14"
                  >
                    กึ่งกลาง = ค่าอ้างอิง
                  </text>
                </Sketch>
              </Panel>
            ),
          )}
        </div>
      ) : kind === "model-process" ? (
        <PanelSteps />
      ) : kind === "safety" ? (
        <PanelSteps safety />
      ) : null}
      {(kind === "galvanic" || kind === "electrolysis") && (
        <>
          <div className="learning-panels two">
            <Panel
              title={
                kind === "galvanic"
                  ? "เซลล์กัลวานิก: จ่ายพลังงาน"
                  : "แอโนด: ต่อขั้วบวกของแหล่งจ่าย"
              }
              detail={
                kind === "galvanic"
                  ? "Zn เป็นแอโนด (−) เกิดออกซิเดชัน"
                  : "เกิดออกซิเดชันเสมอ แต่เครื่องหมายขั้วต่างจากกัลวานิก"
              }
            >
              <Sketch
                label={
                  kind === "galvanic"
                    ? "Zn เสียอิเล็กตรอนเป็น Zn2+ ที่ขั้วแอโนดลบ"
                    : "แอโนดของอิเล็กโทรไลต์เป็นขั้วบวก เกิดออกซิเดชัน"
                }
              >
                <rect
                  x="83"
                  y="50"
                  width="155"
                  height="130"
                  rx="10"
                  fill="#e2ede2"
                  stroke="#a9c1a5"
                />
                <rect
                  x="143"
                  y="34"
                  width="34"
                  height="120"
                  rx="5"
                  fill="#95aaa0"
                />
                <text
                  x="160"
                  y="24"
                  textAnchor="middle"
                  fill="#64825c"
                  fontSize="16"
                >
                  แอโนด {kind === "galvanic" ? "−" : "+"}
                </text>
                <text
                  x="160"
                  y="210"
                  textAnchor="middle"
                  fill="#64825c"
                  fontSize="15"
                >
                  {kind === "galvanic"
                    ? "Zn → Zn²⁺ + 2e⁻"
                    : "สารเสียอิเล็กตรอน"}
                </text>
              </Sketch>
            </Panel>
            <Panel
              title={
                kind === "galvanic"
                  ? "แคโทด: รับอิเล็กตรอน"
                  : "แคโทด: ต่อขั้วลบของแหล่งจ่าย"
              }
              detail={
                kind === "galvanic"
                  ? "Cu²⁺ รับ e⁻ ที่แคโทด (+)"
                  : "เกิดรีดักชันเสมอ ผลิตภัณฑ์ขึ้นกับระบบจริง"
              }
            >
              <Sketch
                label={
                  kind === "galvanic"
                    ? "Cu2+ รับอิเล็กตรอนเป็น Cu ที่แคโทดบวก"
                    : "แคโทดของอิเล็กโทรไลต์เป็นขั้วลบ เกิดรีดักชัน"
                }
              >
                <rect
                  x="83"
                  y="50"
                  width="155"
                  height="130"
                  rx="10"
                  fill="#dde9ef"
                  stroke="#a6bfcb"
                />
                <rect
                  x="143"
                  y="34"
                  width="34"
                  height="120"
                  rx="5"
                  fill="#c59472"
                />
                <text
                  x="160"
                  y="24"
                  textAnchor="middle"
                  fill="#698897"
                  fontSize="16"
                >
                  แคโทด {kind === "galvanic" ? "+" : "−"}
                </text>
                <text
                  x="160"
                  y="210"
                  textAnchor="middle"
                  fill="#698897"
                  fontSize="15"
                >
                  {kind === "galvanic" ? "Cu²⁺ + 2e⁻ → Cu" : "สารรับอิเล็กตรอน"}
                </text>
              </Sketch>
            </Panel>
          </div>
          <div className="electron-flow-strip">
            {kind === "galvanic" ? (
              <>
                <span>Zn / แอโนด (−)</span>
                <span>
                  e⁻ <ArrowRight size={22} /> ผ่านลวดภายนอก
                </span>
                <span>Cu / แคโทด (+)</span>
              </>
            ) : (
              <>
                <span>แหล่งจ่ายไฟฟ้า</span>
                <ArrowRight size={22} />
                <span>ขับปฏิกิริยาในเซลล์</span>
              </>
            )}
          </div>
          <div className="visual-conclusion">
            {kind === "galvanic"
              ? "สะพานเกลือช่วยการเคลื่อนที่ของไอออน ไม่ใช่ทางไหลของอิเล็กตรอน"
              : "กัลวานิก: แอโนด − / แคโทด +   ·   อิเล็กโทรไลต์: แอโนด + / แคโทด −"}
            <br />
            <strong>จำจากปฏิกิริยา: แอโนดออกซิเดชัน · แคโทดรีดักชัน</strong>
          </div>
        </>
      )}
      {(kind === "aspirin" || kind === "paracetamol") && (
        <>
          <div
            className="drug-figure-scroll"
            role="region"
            tabIndex={0}
            aria-label={`โครงสร้าง ${kind} เลื่อนภาพเพื่อดูรายละเอียด`}
          >
            <img
              className="drug-structure-image"
              src={`/diagrams/${kind}.svg`}
              alt={
                kind === "aspirin"
                  ? "โครงสร้างแอสไพริน ระบายสีส้มที่เอสเทอร์และเขียวที่คาร์บอกซิล"
                  : "โครงสร้างพาราเซตามอล ระบายสีส้มที่เอไมด์และเขียวที่ฟีนอล"
              }
              width="760"
              height="400"
              loading="lazy"
            />
          </div>
          <div className="figure-color-legend">
            <span>
              <i style={{ background: "#ffd3a3" }} />
              {kind === "aspirin" ? "เอสเทอร์: C(=O)–O" : "เอไมด์: C(=O)–N"}
            </span>
            <span>
              <i style={{ background: "#b3e3c2" }} />
              {kind === "aspirin"
                ? "คาร์บอกซิล: –COOH"
                : "ฟีนอล: –OH ต่อวงอะโรมาติก"}
            </span>
          </div>
          <div className="visual-conclusion">
            C = คาร์บอน · H = ไฮโดรเจน · O = ออกซิเจน
            {kind === "paracetamol" && " · N = ไนโตรเจน"}
            <br />
            <strong>CH₃ หมายถึง C หนึ่งอะตอมที่มี H ต่ออยู่ 3 อะตอม</strong>
          </div>
          <span className="figure-scroll-hint">
            บนมือถือ เลื่อนภาพด้านข้างเพื่อดูตัวอักษรขนาดใหญ่
          </span>
        </>
      )}
      <SupplementaryDiagram kind={kind} />
      <figcaption>
        <b>อ่านภาพ:</b> {spec.caption}
      </figcaption>
    </figure>
  );
}
