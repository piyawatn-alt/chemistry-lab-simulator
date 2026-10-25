"use client";
import { useId, type ReactNode } from "react";
import type { FigureKind } from "@/data/knowledge/figures";
import "./figures-refresh.css";

function Diagram({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  const id = useId();
  return <svg className={wide ? "supplementary-wide-sketch" : "learning-sketch"} viewBox={wide ? "0 0 600 330" : "0 0 320 240"} role="img" aria-labelledby={id}>
    <title id={id}>{label}</title>{children}
  </svg>;
}
function Part({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return <div className="learning-panel"><h4>{title}</h4>{children}<p>{text}</p></div>;
}
function PeriodicGrid({ radius }: { radius: boolean }) {
  return <Diagram label={radius ? "รัศมีอะตอมโดยทั่วไปเพิ่มจากบนลงล่างและจากขวาไปซ้าย" : "พลังงานไอออไนเซชันครั้งที่หนึ่งโดยทั่วไปเพิ่มจากล่างขึ้นบนและจากซ้ายไปขวา"}>
    <text x="166" y="24" textAnchor="middle" fill="#52695b" fontSize="11">แผนผังย่อ · ไม่แสดง f-block</text>
    {[0,1,2,3,4,5,6].map(row => Array.from({ length: 18 }, (_, col) => {
      const omitted = row === 0 ? col !== 0 && col !== 17 : row < 3 && col > 1 && col < 12;
      return omitted ? null : <rect key={`${row}-${col}`} x={58 + col * 12} y={45 + row * 17} width="10" height="14" rx="1.5" fill={radius ? "#d6e8df" : "#dfebf1"} stroke={radius ? "#9dbda8" : "#aac1cf"}/>;
    }))}
    {radius ? <>
      <path d="M37 47V166L30 156M37 166 44 156M266 190H61L71 183M61 190 71 197" stroke="#28705a" strokeWidth="3" fill="none"/>
      <text x="160" y="224" textAnchor="middle" fill="#315e4d" fontSize="15">เพิ่มลงล่าง · เพิ่มไปซ้าย</text>
    </> : <>
      <path d="M37 166V47L30 57M37 47 44 57M61 190H266L256 183M266 190 256 197" stroke="#3f718f" strokeWidth="3" fill="none"/>
      <text x="160" y="224" textAnchor="middle" fill="#3f657d" fontSize="15">เพิ่มขึ้นบน · เพิ่มไปขวา</text>
    </>}
  </Diagram>;
}
function GraphAxes({ rate }: { rate: boolean }) {
  return <>
    <path d="M43 45V195H295" fill="none" stroke="#91aa9e" strokeWidth="2"/>
    <text x="14" y="28" fill="#405b51" fontSize="13">{rate ? "อัตราปฏิกิริยา" : "ความเข้มข้น"}</text>
    <text x="292" y="224" textAnchor="end" fill="#405b51" fontSize="13">เวลา →</text>
    <path d="M210 44V195" fill="none" stroke="#9eada6" strokeWidth="1.5" strokeDasharray="4 4"/>
    <text x="214" y="30" fill="#546e62" fontSize="12">ใกล้สมดุล</text>
    {rate ? <>
      <path d="M46 60C90 99 120 135 160 145S240 150 291 150" fill="none" stroke="#256c57" strokeWidth="3"/>
      <path d="M46 195C90 175 120 157 160 152.5S240 150 291 150" fill="none" stroke="#bb653e" strokeWidth="3" strokeDasharray="8 4"/>
      <text x="253" y="135" textAnchor="middle" fill="#315e4d" fontSize="13">เท่ากัน</text>
    </> : <>
      <path d="M46 60C90 99 120 135 160 145S240 150 291 150" fill="none" stroke="#256c57" strokeWidth="3"/>
      <path d="M46 195C90 156 120 120 160 110S240 105 291 105" fill="none" stroke="#bb653e" strokeWidth="3" strokeDasharray="8 4"/>
      <text x="269" y="94" textAnchor="middle" fill="#944b2c" fontSize="13">[B]</text>
      <text x="269" y="174" textAnchor="middle" fill="#315e4d" fontSize="13">[A]</text>
    </>}
  </>;
}
export function SupplementaryDiagram({ kind }: { kind: FigureKind }) {
  if (kind === "periodic-trends") return <>
    <div className="learning-panels two supplementary-panels">
      <Part title="รัศมีอะตอม" text="ลงหมู่: ระดับพลังงานหลักเพิ่ม · ไปขวาในคาบ: ประจุนิวเคลียสยังผลมักดึงอิเล็กตรอนได้มากขึ้น"><PeriodicGrid radius/></Part>
      <Part title="พลังงานไอออไนเซชันครั้งที่หนึ่ง" text="โดยทั่วไปอะตอมที่ยึดอิเล็กตรอนได้แน่นกว่าต้องใช้พลังงานดึงออกมากกว่า"><PeriodicGrid radius={false}/></Part>
    </div>
    <div className="visual-conclusion"><strong>แนวโน้มช่วยอธิบายภาพรวม แต่ไม่แทนข้อมูลจริงของธาตุแต่ละคู่</strong></div>
  </>;
  if (kind === "mole-map") return <>
    <div className="mole-conversion-map" role="group" aria-label="มวลหารมวลโมลาร์เป็นจำนวนโมล จำนวนโมลคูณค่าคงตัวอาโวกาโดรเป็นจำนวนอนุภาค">
      <div><span>มวลสาร</span><strong>m <small>(g)</small></strong></div>
      <p><span>÷ M <span className="mole-arrow-desktop" aria-hidden="true">→</span><span className="mole-arrow-mobile" aria-hidden="true">↓</span></span><br/><span><span className="mole-arrow-desktop" aria-hidden="true">←</span><span className="mole-arrow-mobile" aria-hidden="true">↑</span> × M</span></p>
      <div className="mole-map-center"><span>จำนวนโมล</span><strong>n <small>(mol)</small></strong></div>
      <p><span>× N<sub>A</sub> <span className="mole-arrow-desktop" aria-hidden="true">→</span><span className="mole-arrow-mobile" aria-hidden="true">↓</span></span><br/><span><span className="mole-arrow-desktop" aria-hidden="true">←</span><span className="mole-arrow-mobile" aria-hidden="true">↑</span> ÷ N<sub>A</sub></span></p>
      <div><span>จำนวนอนุภาค</span><strong>N</strong></div>
    </div>
    <div className="mole-map-worked"><strong>ตัวอย่างน้ำ 18.0 g</strong><p>ใช้ M ≈ 18.0 g/mol → n = 1.00 mol → น้ำประมาณ 6.02 × 10²³ โมเลกุล</p><span>N<sub>A</sub> = 6.02214076 × 10²³ mol⁻¹ เป็นค่าคงตัวนิยามที่แน่นอน แต่ผลลัพธ์ตัวอย่างปัดตามเลขนัยสำคัญของข้อมูล</span></div>
  </>;
  if (kind === "equilibrium-graphs") return <>
    <div className="learning-panels two supplementary-panels">
      <Part title="อัตราทั้งสองทิศทางเข้าใกล้กัน" text="เส้นทึบ: ไปข้างหน้า · เส้นประ: ย้อนกลับ ทั้งสองยังมีค่ามากกว่าศูนย์ที่สมดุล"><Diagram label="อัตราไปข้างหน้าลด อัตราย้อนกลับเพิ่ม จนเท่ากันและยังมากกว่าศูนย์"><GraphAxes rate/></Diagram></Part>
      <Part title="ความเข้มข้นคงที่ได้ที่ค่าต่างกัน" text="ตัวอย่างนี้ B มีมากกว่า A ที่สมดุล ไม่จำเป็นต้องมีปริมาณเท่ากัน"><Diagram label="ความเข้มข้น A ลด B เพิ่ม แล้วแต่ละชนิดคงที่ โดย B มากกว่า A"><GraphAxes rate={false}/></Diagram></Part>
    </div>
    <div className="visual-conclusion"><strong>หยุดเปลี่ยนสุทธิ ≠ หยุดเกิดปฏิกิริยา</strong></div>
  </>;
  if (kind === "salt-bridge") return <>
    <div className="supplementary-scroll" role="region" aria-label="ภาพเซลล์ Zn–Cu เลื่อนแนวนอนเพื่ออ่านป้ายกำกับ" tabIndex={0}>
      <Diagram wide label="ลวดภายนอกส่งอิเล็กตรอนจาก Zn ไป Cu ส่วนสะพานเกลือส่ง NO3- ไปแอโนด Zn และ K+ ไปแคโทด Cu">
        <path d="M120 158V36H480V158" fill="none" stroke="#678478" strokeWidth="3"/>
        <path d="M239 36H359L347 28M359 36 347 44" stroke="#285f51" strokeWidth="3" fill="none"/>
        <text x="300" y="20" textAnchor="middle" fill="#315e4d" fontSize="15">e⁻ ผ่านลวด: Zn → Cu</text>
        <path d="M51 141V262Q51 274 64 274H219Q232 274 232 262V141M368 141V262Q368 274 381 274H536Q549 274 549 262V141" fill="#edf5ef" stroke="#8da99e" strokeWidth="2"/>
        <rect x="103" y="126" width="34" height="109" fill="#90a49b"/>
        <rect x="463" y="126" width="34" height="109" fill="#b87951"/>
        <path d="M198 193V102H402V193" fill="none" stroke="#ccdad0" strokeWidth="25" strokeLinejoin="round"/>
        <path d="M278 102H198V177L191 167M198 177 205 167M322 102H402V177L395 167M402 177 409 167" fill="none" stroke="#4b7664" strokeWidth="2"/>
        <text x="300" y="73" textAnchor="middle" fill="#315e4d" fontSize="14">สะพานเกลือ KNO₃</text>
        <text x="182" y="225" textAnchor="middle" fill="#315e4d" fontSize="15">NO₃⁻ ↓</text>
        <text x="417" y="225" textAnchor="middle" fill="#315e4d" fontSize="15">K⁺ ↓</text>
        <text x="106" y="106" textAnchor="middle" fill="#315e4d" fontSize="16">Zn (−)</text>
        <text x="491" y="106" textAnchor="middle" fill="#835031" fontSize="16">Cu (+)</text>
        <text x="141" y="301" textAnchor="middle" fill="#315e4d" fontSize="15">Zn → Zn²⁺ + 2e⁻</text>
        <text x="460" y="301" textAnchor="middle" fill="#315e4d" fontSize="15">Cu²⁺ + 2e⁻ → Cu</text>
        <text x="141" y="325" textAnchor="middle" fill="#50675c" fontSize="13">แอโนด: สร้าง Zn²⁺ เพิ่ม</text>
        <text x="460" y="325" textAnchor="middle" fill="#50675c" fontSize="13">แคโทด: ใช้ Cu²⁺ ไป</text>
      </Diagram>
    </div>
    <p className="supplementary-scroll-hint">เลื่อนภาพแนวนอนบนจอเล็กเพื่ออ่านป้ายกำกับ</p>
    <div className="visual-conclusion"><strong>อิเล็กตรอนผ่านลวด · ไอออนผ่านสารละลายและสะพานเกลือ</strong></div>
  </>;
  if (kind === "polymer-crosslinks") return <div className="learning-panels two supplementary-panels">
    {[false, true].map(crosslinked => <Part key={String(crosslinked)} title={crosslinked ? "สายโซ่ที่เชื่อมขวาง" : "สายโซ่ที่ไม่เชื่อมขวาง"} text={crosslinked ? "จุดเชื่อมผูกหลายสายเข้าด้วยกัน จึงจำกัดการเลื่อนผ่านกัน" : "สายโซ่ยังมีแรงยึดเหนี่ยวและอาจพันกัน ไม่ได้เป็นเส้นที่เคลื่อนอิสระทั้งหมด"}>
      <Diagram label={crosslinked ? "สายโซ่สามเส้นเชื่อมกันด้วยจุดเชื่อมขวางสีส้ม" : "สายโซ่ยาวสามเส้นไม่มีจุดเชื่อมขวางระหว่างสาย"}>
        <path d="M22 61C60 18 89 98 130 61S200 22 242 61 282 86 302 55M22 121C60 78 89 158 130 121S200 82 242 121 282 146 302 115M22 181C60 138 89 218 130 181S200 142 242 181 282 206 302 175" fill="none" stroke="#3d7b64" strokeWidth="5"/>
        {crosslinked && <g stroke="#b9613b" strokeWidth="5" fill="#b9613b"><path d="M130 61V121M242 121V181"/><circle cx="130" cy="61" r="4"/><circle cx="130" cy="121" r="4"/><circle cx="242" cy="121" r="4"/><circle cx="242" cy="181" r="4"/></g>}
      </Diagram>
    </Part>)}
  </div>;
  return null;
}
