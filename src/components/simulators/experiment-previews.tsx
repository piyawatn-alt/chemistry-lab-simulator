"use client";

import { useId } from "react";
import type { ExperimentId } from "@/data/experiments";
import "./experiment-refresh.css";

export type ExperimentPreviewId = ExperimentId | "flame-test";

const explanations: Record<ExperimentPreviewId, { title: string; description: string }> = {
  "flame-test": {
    title: "ลวดตัวอย่างเกลือในเปลวไฟ",
    description: "ห่วงลวดนำตัวอย่างโซเดียมคลอไรด์เข้าสู่เปลวไฟ สีเหลืองใช้แทนแสงจากโซเดียม เป็นภาพอธิบาย ไม่ใช่สีที่วัดจริง",
  },
  neutralization: {
    title: "บิวเรตหยดเบสลงในกรด",
    description: "บิวเรตบรรจุ NaOH หยดลงในขวดรูปกรวยที่มี HCl สีในขวดใช้แทนค่า pH ไม่ใช่สีจริงของสารละลาย",
  },
  diffusion: {
    title: "อนุภาคตัวถูกละลายกระจายตัว",
    description: "เปรียบเทียบก่อนและหลังการแพร่ อนุภาคสีฟ้า 12 อนุภาคเท่าเดิมกระจายทั่วภาชนะมากขึ้น ภาพไม่แสดงมาตราส่วนจริง",
  },
  conductivity: {
    title: "ไอออนกับวงจรตรวจการนำไฟฟ้า",
    description: "ขั้วไฟฟ้าสองขั้วอยู่ในสารละลาย NaCl และต่อกับแหล่งสัญญาณสลับและหลอดไฟ ไอออนเคลื่อนที่ได้จึงนำไฟฟ้า ภาพไม่จำลองอิเล็กโทรลิซิส",
  },
  precipitation: {
    title: "ผสมสารละลายให้ตะกอนซิลเวอร์คลอไรด์",
    description: "สารละลาย AgNO3 และ NaCl เทลงในบีกเกอร์ เกิดตะกอนสีขาว AgCl ภาพตะกอนเป็นภาพอธิบาย ไม่ใช่ปริมาณตามมาตราส่วน",
  },
  "gas-pressure": {
    title: "อัดแก๊สปริมาณเดิมที่อุณหภูมิคงที่",
    description: "ลูกสูบสองตำแหน่งมีอนุภาคแก๊ส 12 อนุภาคเท่ากัน เมื่อเพิ่มความดัน ปริมาตรลดลง โดยอุณหภูมิและจำนวนโมลคงที่",
  },
  "temperature-rate": {
    title: "อุณหภูมิกับสัดส่วนผลิตภัณฑ์ในเวลาเท่ากัน",
    description: "เปรียบเทียบปฏิกิริยาสมมติ A เปลี่ยนเป็น B ที่เวลาเท่ากัน ในภาพอุณหภูมิสูงมีผลิตภัณฑ์ B มากกว่า จำนวนอนุภาครวมในแต่ละขวดเท่ากัน",
  },
};

function Beaker({ x, y, width = 100, height = 90, fill = "#dceff0" }: {
  x: number; y: number; width?: number; height?: number; fill?: string;
}) {
  return (
    <g>
      <path d={`M${x + 3} ${y + 30}h${width - 6}v${height - 37}q0 5 -6 5h-${width - 18}q-6 0 -6 -5z`} fill={fill} />
      <path d={`M${x} ${y}v${height - 8}q0 8 8 8h${width - 16}q8 0 8 -8V${y}`} fill="none" stroke="#678b8c" strokeWidth="2.5" />
      <path d={`M${x + 3} ${y + 30}h${width - 6}`} stroke="#a1c5c5" strokeWidth="1.5" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${x + width - 15} ${y + 44 + i * 16}h8`} stroke="#9eb8b7" strokeWidth="1.5" />)}
    </g>
  );
}

const spreadParticles = [[18, 46], [44, 44], [71, 49], [86, 65], [27, 66], [54, 64], [17, 87], [44, 84], [72, 84], [87, 101], [32, 103], [60, 104]];
const clusteredParticles = [[16, 47], [30, 44], [44, 48], [21, 60], [36, 60], [50, 62], [15, 73], [30, 74], [45, 75], [23, 87], [38, 88], [52, 88]];

function Particles({ points, x = 0, y = 0, color = "#4699ac", radius = 4 }: {
  points: number[][]; x?: number; y?: number; color?: string; radius?: number;
}) {
  return <g>{points.map(([px, py], i) => <circle key={i} cx={px + x} cy={py + y} r={radius} fill={color} />)}</g>;
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path d={`M${x1} ${y}H${x2}m-7 -5 7 5 -7 5`} fill="none" stroke="#6d8e8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
}

function FlamePreview() {
  return (
    <>
      <ellipse cx="169" cy="192" rx="70" ry="6" fill="#dbe5df" />
      <path d="M151 173h36l15 15h-66z" fill="#a4b9b4" stroke="#6b8b83" strokeWidth="2" />
      <path d="M160 135h18v38h-18z" fill="#d4e1db" stroke="#6b8b83" strokeWidth="2" />
      <path d="M169 137C133 122 148 84 170 47c-2 30 37 45 20 75-5 10-12 16-21 15" fill="#edb55d" />
      <path d="M169 138c-19-8-13-27 0-45 4 14 17 27 9 38" fill="#89bfd6" />
      <path d="M303 55 192 103" stroke="#587b7b" strokeWidth="3" />
      <ellipse cx="184" cy="106" rx="10" ry="6" fill="none" stroke="#587b7b" strokeWidth="2.5" transform="rotate(-23 184 106)" />
      <rect x="273" y="46" width="40" height="9" rx="4.5" transform="rotate(-23 293 50)" fill="#284e4c" />
      <text x="67" y="67">NaCl</text>
      <path d="M109 71 168 105" stroke="#839e8d" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="218" y="147" className="preview-note">แสงจากโซเดียม</text>
      <text x="218" y="165" className="preview-note">สีเพื่ออธิบาย</text>
    </>
  );
}

function NeutralizationPreview() {
  return (
    <>
      <path d="M77 194h67M91 194V28h84" fill="none" stroke="#9cb3ac" strokeWidth="3" />
      <rect x="167" y="27" width="18" height="83" rx="3" fill="#e1f0ec" stroke="#6b9390" strokeWidth="2" />
      <path d="M170 63h12v44h-12z" fill="#8fc9ba" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M177 ${40 + i * 15}h6`} stroke="#6b9390" />)}
      <path d="M176 110v15m-8-8h17" stroke="#6b9390" strokeWidth="2.5" />
      <path d="M176 131c-6 8-6 11 0 11s6-3 0-11" fill="#58a798" />
      <path d="M162 145v9l-24 34q-5 7 4 7h67q9 0 4-7l-24-34v-9" fill="#f5faf8" stroke="#6b9390" strokeWidth="2.5" />
      <path d="M155 173h41l12 17h-65z" fill="#c9b4da" />
      <path d="M158 145h35" stroke="#6b9390" strokeWidth="2.5" />
      <text x="213" y="50">NaOH</text>
      <text x="225" y="105" className="preview-note">หยดเบส</text>
      <text x="239" y="166">HCl</text>
      <text x="239" y="186" className="preview-note">สีแทนค่า pH</text>
      <path d="M218 108h-24" stroke="#a5bab0" strokeWidth="1.5" />
    </>
  );
}

function DiffusionPreview() {
  return (
    <>
      <Beaker x={42} y={63} width={104} height={116} />
      <Beaker x={215} y={63} width={104} height={116} />
      <Particles points={clusteredParticles} x={42} y={63} />
      <Particles points={spreadParticles} x={215} y={63} />
      <Arrow x1={163} x2={197} y={123} />
      <text x="94" y="44" textAnchor="middle">เริ่มต้น</text>
      <text x="267" y="44" textAnchor="middle">เวลาผ่านไป</text>
      <text x="180" y="204" textAnchor="middle" className="preview-note">จำนวนอนุภาคเท่าเดิม · กระจายตัวมากขึ้น</text>
    </>
  );
}

function ConductivityPreview() {
  return (
    <>
      <Beaker x={105} y={95} width={151} height={96} fill="#e5f2e9" />
      <path d="M133 119V45h34m26 0h52v75" fill="none" stroke="#6d8e88" strokeWidth="2.5" />
      <circle cx="180" cy="45" r="14" fill="#fff" stroke="#6d8e88" strokeWidth="2" />
      <path d="M171 45q4-11 9 0t9 0" fill="none" stroke="#517f7a" strokeWidth="1.8" />
      <circle cx="245" cy="70" r="15" fill="#f9e8ae" stroke="#ba9b4c" strokeWidth="2" />
      <path d="m238 64 14 12m0-12-14 12" stroke="#ba9b4c" strokeWidth="1.5" />
      <path d="M127 119h12v34h-12zM239 119h12v34h-12z" fill="#a3b8b4" stroke="#5f8580" strokeWidth="1.5" />
      <text x="166" y="143" className="preview-ion">Na⁺</text>
      <text x="206" y="166" className="preview-ion">Cl⁻</text>
      <text x="152" y="178" className="preview-ion">Cl⁻</text>
      <text x="203" y="123" className="preview-ion">Na⁺</text>
      <text x="55" y="47" className="preview-note">สัญญาณสลับ</text>
      <text x="180" y="211" textAnchor="middle" className="preview-note">ไอออนที่เคลื่อนที่ได้ → นำไฟฟ้า</text>
    </>
  );
}

function PrecipitationPreview() {
  return (
    <>
      <g transform="rotate(125 105 65)">
        <path d="M91 36v48q0 14 14 14t14-14V36" fill="#eef7f3" stroke="#7b9d96" strokeWidth="2" />
        <path d="M94 61v23q0 11 11 11t11-11V61" fill="#c6e5e5" />
        <path d="M88 36h34" stroke="#7b9d96" strokeWidth="2" />
      </g>
      <g transform="rotate(-125 256 65)">
        <path d="M242 36v48q0 14 14 14t14-14V36" fill="#eef7f3" stroke="#7b9d96" strokeWidth="2" />
        <path d="M245 61v23q0 11 11 11t11-11V61" fill="#c6e5e5" />
        <path d="M239 36h34" stroke="#7b9d96" strokeWidth="2" />
      </g>
      <path d="m130 83 20 39m80-39-20 39" stroke="#9abdbb" strokeWidth="3" strokeDasharray="4 5" />
      <Beaker x={126} y={120} width={108} height={75} fill="#bed7d4" />
      {[[140,178],[153,185],[169,176],[183,185],[198,176],[216,184],[145,190],[171,189],[194,191],[211,191]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="5" fill="#fff" stroke="#a6bbb7" strokeWidth=".6" />)}
      <text x="37" y="31">AgNO₃(aq)</text>
      <text x="246" y="31">NaCl(aq)</text>
      <text x="260" y="166">AgCl(s)</text>
      <path d="M252 172 221 183" stroke="#7b9d96" strokeWidth="1.5" />
      <text x="180" y="216" textAnchor="middle" className="preview-note">เกิดตะกอนสีขาว</text>
    </>
  );
}

function GasPreview() {
  const points = [[14,17],[41,13],[67,20],[84,40],[25,38],[53,39],[14,60],[41,59],[72,61],[86,80],[30,81],[59,81]];
  return (
    <>
      <path d="M42 80v110h105V80M215 80v110h105V80" fill="#eef4e6" stroke="#829b75" strokeWidth="2.5" />
      <Particles points={points} x={45} y={91} color="#79a26a" />
      <Particles points={points.map(([x,y])=>[x,y*.51])} x={218} y={137} color="#79a26a" />
      <path d="M40 87h109v9H40zM213 130h109v9H213z" fill="#a8bda2" stroke="#6e8861" strokeWidth="2" />
      <path d="M94 87V53m174 77V53" stroke="#6e8861" strokeWidth="5" />
      <path d="M75 53h38m136 0h38" stroke="#6e8861" strokeWidth="3" />
      <path d="M268 68v25m-5-7 5 7 5-7" fill="none" stroke="#bb8d52" strokeWidth="2.5" />
      <Arrow x1={165} x2={195} y={140} />
      <text x="94" y="30" textAnchor="middle">ปริมาตรมาก</text>
      <text x="268" y="30" textAnchor="middle">ปริมาตรลดลง</text>
      <text x="180" y="214" textAnchor="middle" className="preview-note">เพิ่มความดัน · อุณหภูมิและจำนวนโมลคงที่</text>
    </>
  );
}

function TemperaturePreview() {
  const points = [[27,75],[49,74],[72,74],[18,94],[40,94],[63,94],[85,94],[10,113],[31,113],[52,113],[73,113],[94,113]];
  return (
    <>
      {[42, 213].map((x, i) => (
        <g key={x}>
          <path d={`M${x+38} 55v32l-32 74q-6 14 9 14h74q15 0 9-14l-32-74V55`} fill={i ? "#fcf0e5" : "#ecf5f5"} stroke="#7c9b96" strokeWidth="2.5" />
          <path d={`M${x+34} 55h36`} stroke="#7c9b96" strokeWidth="2.5" />
          {points.map(([px,py], j) => <circle key={j} cx={x+px} cy={49+py} r="4.3" fill={j < (i ? 3 : 8) ? "#64a7ae" : "#db9a67"} />)}
        </g>
      ))}
      <text x="94" y="30" textAnchor="middle">อุณหภูมิต่ำ</text>
      <text x="265" y="30" textAnchor="middle">อุณหภูมิสูง</text>
      <text x="180" y="78" textAnchor="middle" className="preview-note">A → B</text>
      <circle cx="111" cy="203" r="4" fill="#64a7ae" /><text x="122" y="207" className="preview-note">A</text>
      <circle cx="154" cy="203" r="4" fill="#db9a67" /><text x="165" y="207" className="preview-note">B</text>
      <text x="212" y="207" className="preview-note">เวลาเท่ากัน</text>
    </>
  );
}

/** A qualitative apparatus diagram, never a measured experimental result. */
export function ExperimentPreview({ id }: { id: ExperimentPreviewId }) {
  const titleId = useId();
  const descriptionId = useId();
  const spec = explanations[id];
  return (
    <svg className={`experiment-preview-diagram diagram-${id}`} viewBox="0 0 360 230" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
      <title id={titleId}>{spec.title}</title>
      <desc id={descriptionId}>{spec.description}</desc>
      {id === "flame-test" ? <FlamePreview /> : id === "neutralization" ? <NeutralizationPreview /> : id === "diffusion" ? <DiffusionPreview /> : id === "conductivity" ? <ConductivityPreview /> : id === "precipitation" ? <PrecipitationPreview /> : id === "gas-pressure" ? <GasPreview /> : <TemperaturePreview />}
    </svg>
  );
}
