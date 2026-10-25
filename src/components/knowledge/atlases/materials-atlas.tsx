"use client";
import type { ReactNode } from "react";
import { AtlasArrow, AtlasCard, AtlasNode, AtlasSvg, VisualAtlas } from "./atlas-kit";

export const materialAtlasIds = ["polymers-around-us", "redox-galvanic-cells", "electrolysis-faraday", "chemical-models", "experimental-data", "chemical-safety"];
const teal = "#2e7163", blue = "#527da4", rust = "#b96345", ink = "#28463f";
function Label({ x, y, children, color = ink, size = 14, anchor = "middle" }: { x: number; y: number; children: ReactNode; color?: string; size?: number; anchor?: "middle" | "start" | "end" }) {
  return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontFamily="Inter, Noto Sans Thai, sans-serif">{children}</text>;
}
function Box({ x, y, width, height = 40, children, color = "#e1eee6" }: { x: number; y: number; width: number; height?: number; children: ReactNode; color?: string }) {
  return <g><rect x={x} y={y} width={width} height={height} rx="9" fill={color} stroke="#b9d1c3"/><Label x={x + width/2} y={y + height/2 + 5}>{children}</Label></g>;
}
function Chains({ branched = false, crosslinked = false }: { branched?: boolean; crosslinked?: boolean }) {
  return <g fill="none" stroke={teal} strokeWidth="5" strokeLinecap="round">
    <path d="M25 61Q55 31 85 61T145 61 205 61 265 61L295 61M25 121Q55 91 85 121T145 121 205 121 265 121L295 121"/>
    {branched && <path d="M85 61V28L105 18M145 121V156L166 173M205 61V88L228 101"/>}
    {crosslinked && <path d="M85 61V121M205 61V121" stroke={rust}/>}
  </g>;
}
function Beakers({ electrolytic = false }: { electrolytic?: boolean }) {
  return <g>
    <path d={electrolytic ? "M36 108v63q0 8 8 8h233q8 0 8-8v-63" : "M36 108v63q0 8 8 8h77q8 0 8-8v-63M192 108v63q0 8 8 8h77q8 0 8-8v-63"} fill="#e2eeed" stroke="#8aa99a" strokeWidth="2"/>
    <rect x="64" y="90" width="19" height="65" fill="#8aa49b"/><rect x="235" y="90" width="19" height="65" fill="#bd7959"/>
    <path d="M73 90V47h172v43" fill="none" stroke="#66897b" strokeWidth="2.5"/>
    {electrolytic ? <><rect x="124" y="30" width="70" height="33" rx="6" fill="#fff" stroke="#91ad9d"/><Label x={138} y={52}>+</Label><Label x={181} y={52}>−</Label><Label x={160} y={119} size={13}>ไอออนในอิเล็กโทรไลต์</Label><AtlasArrow x1={129} y1={134} x2={190} y2={134} color={blue}/><Label x={116} y={139} color={blue}>+</Label><AtlasArrow x1={190} y1={151} x2={129} y2={151} color={rust}/><Label x={203} y={156} color={rust}>−</Label></> : <><AtlasArrow x1={108} y1={47} x2={212} y2={47}/><Label x={160} y={30}>e⁻ ผ่านลวด</Label><path d="M113 139V91h91v48" fill="none" stroke="#c1d4c5" strokeWidth="15"/><AtlasArrow x1={147} y1={91} x2={113} y2={126} color={blue}/><AtlasArrow x1={171} y1={91} x2={204} y2={126} color={rust}/></>}
  </g>;
}
function Axes({ xLabel = "เวลา (s)", yLabel = "[A] (mol/L)" }: { xLabel?: string; yLabel?: string }) {
  return <g><path d="M44 32v128h241" fill="none" stroke="#8ca99a" strokeWidth="2"/><Label x={12} y={22} anchor="start" size={13}>{yLabel}</Label><Label x={278} y={187} anchor="end" size={13}>{xLabel}</Label></g>;
}
function Target({ x, label, offset = false, scattered = false }: { x: number; label: string; offset?: boolean; scattered?: boolean }) {
  const points = scattered ? [[-19,-15],[24,-8],[-10,24],[19,19]] : [[-4,-4],[3,1],[-2,5],[5,-3]];
  return <g>{[28,18,7].map(r=><circle key={r} cx={x} cy="97" r={r} fill="none" stroke="#b6cfc0" strokeWidth="1.5"/>)}{points.map(([px,py],i)=><circle key={i} cx={x+px+(offset?20:0)} cy={97+py+(offset?-10:0)} r="3.2" fill={offset?rust:teal}/>)}<Label x={x} y={153} size={13}>{label}</Label></g>;
}
function Polymers() {
  return <VisualAtlas title="พอลิเมอร์: อ่านจากหน่วยเล็กสู่สายโซ่" intro="เทียบพันธะ หน่วยซ้ำ และการจัดสายโซ่ เพื่อเชื่อมโครงสร้างกับสมบัติของวัสดุ" legend="เส้นเขียวแทนสายโซ่ · เส้นส้มแทนจุดเชื่อมขวาง ไม่ใช่ขนาดหรือมุมพันธะจริง" note="พอลิเมอร์ชนิดเดียวกันอาจมีสมบัติต่างกันตามมวลโมเลกุล การแตกแขนง การจัดเรียง และอุณหภูมิ ภาพเป็นการเปรียบเทียบเชิงแนวคิด">
    <AtlasCard title="แบบเติม: เปิดพันธะคู่แล้วต่อสาย" subtitle="Addition polymerization" formula="n CH₂=CH₂ → [–CH₂–CH₂–]ₙ" example="เอทีน → พอลิเอทิลีน (PE)" insight="หน่วยซ้ำของ PE มีคาร์บอนสองอะตอม แต่พันธะคู่ของเอทีนไม่ได้คงอยู่ในหน่วยซ้ำ" caution="n บอกจำนวนหน่วยซ้ำ ไม่ใช่จำนวนคาร์บอนทั้งหมด">
      <AtlasSvg label="เอทีนมีพันธะคู่ระหว่าง CH2 สองกลุ่ม เปลี่ยนเป็นหน่วยซ้ำสายพอลิเอทิลีนที่มีพันธะเดี่ยวและปลายพันธะต่อออกนอกวงเล็บ"><Label x={65} y={53}>มอนอเมอร์</Label><Label x={66} y={106} size={20}>CH₂=CH₂</Label><AtlasArrow x1={128} y1={100} x2={172} y2={100}/><Label x={239} y={53}>หน่วยซ้ำ</Label><path d="M189 72h-7v61h7M288 72h7v61h-7" stroke={teal} fill="none" strokeWidth="2"/><Label x={239} y={106} size={20}>CH₂–CH₂</Label><path d="M165 99h26m94 0h29" stroke={teal} strokeWidth="2"/><Label x={306} y={144}>n</Label><Label x={160} y={180}>C=C → C–C ในสายโซ่</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="แบบควบแน่น: ต่อพร้อมปล่อยโมเลกุลเล็ก" subtitle="Condensation example" formula="R–COOH + HO–R′ → R–COO–R′ + H₂O" example="การสร้างพันธะเอสเทอร์หนึ่งตำแหน่ง" insight="เมื่อมอนอเมอร์มีตำแหน่งทำปฏิกิริยามากพอ การสร้างพันธะซ้ำอาจให้พอลิเอสเทอร์เป็นสายยาว" caution="ตัวอย่างนี้ปล่อยน้ำ แต่พอลิเมอไรเซชันแบบควบแน่นไม่ได้ปล่อยน้ำทุกระบบ" tone="blue">
      <AtlasSvg label="หมู่คาร์บอกซิลและหมู่ไฮดรอกซิลให้พันธะเอสเทอร์และน้ำหนึ่งโมเลกุลต่อการสร้างพันธะหนึ่งตำแหน่ง"><Box x={20} y={28} width={116}>–COOH</Box><Box x={183} y={28} width={116}>HO–</Box><Label x={160} y={55}>+</Label><AtlasArrow x1={160} y1={79} x2={160} y2={113}/><Box x={29} y={131} width={156} color="#dbeaf3">–C(=O)–O–</Box><Label x={210} y={158}>+</Label><AtlasNode x={265} y={152} label="H₂O" color={blue} radius={27}/></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="สายตรงกับสายแตกแขนง" subtitle="Packing and branching" example="PE ที่มีแขนงต่างกันอาจจัดเรียงและมีความหนาแน่นต่างกัน" insight="แขนงมีผลต่อการเรียงตัวของสายโซ่ จึงสัมพันธ์กับส่วนผลึก ความหนาแน่น และสมบัติทางกล" caution="ไม่ใช้จำนวนแขนงเพียงปัจจัยเดียวตัดสินสมบัติของพอลิเมอร์ทุกชนิด" tone="amber">
      <AtlasSvg label="สายโซ่หนึ่งคู่เรียงตัวใกล้กัน ส่วนสายแตกแขนงมีส่วนยื่นออกจากแนวสายหลัก"><g transform="translate(0,-7)"><Chains branched/></g><Label x={160} y={194}>มองทั้งสายหลักและแขนง</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="จุดเชื่อมขวางจำกัดการเลื่อนผ่าน" subtitle="Crosslinked network" example="โครงข่ายเชื่อมหลายสายเข้าด้วยกัน" insight="จุดเชื่อมขวางผูกสายโซ่เข้าด้วยกัน สมบัติจึงขึ้นกับชนิดและความหนาแน่นของจุดเชื่อมด้วย" caution="เส้นหนึ่งเส้นแทนสายโซ่ยาว ไม่ใช่พันธะเดี่ยวหนึ่งพันธะ" tone="purple">
      <AtlasSvg label="สายโซ่สองเส้นเชื่อมกันด้วยพันธะเชื่อมขวางสีส้มสองตำแหน่ง"><Chains crosslinked/><Label x={160} y={174} color={rust}>สีส้ม = จุดเชื่อมระหว่างสาย</Label></AtlasSvg>
    </AtlasCard>
  </VisualAtlas>;
}
function Redox() {
  return <VisualAtlas title="รีดอกซ์และกัลวานิก: แยกประจุ ขั้ว และเส้นทาง" intro="อ่านครึ่งปฏิกิริยาควบคู่กับภาพวงจร อย่าสับสนทิศอิเล็กตรอนกับการเคลื่อนที่ของไอออน" note="ตัวอย่างเซลล์ Zn/Zn²⁺ และ Cu²⁺/Cu ภาพไม่แสดงองค์ประกอบทุกส่วนหรือมาตราส่วนจริง ค่า E° เป็นศักย์รีดักชันมาตรฐานที่ 25 °C">
    <AtlasCard title="เสีย e⁻ = ออกซิเดชัน / รับ e⁻ = รีดักชัน" subtitle="Oxidation and reduction" formula="Zn → Zn²⁺ + 2e⁻ · Cu²⁺ + 2e⁻ → Cu" insight="ในปฏิกิริยารวม จำนวนอิเล็กตรอนที่เสียต้องเท่ากับจำนวนที่รับ อิเล็กตรอนไม่เหลือในสมการรวม" example="Zn + Cu²⁺ → Zn²⁺ + Cu">
      <AtlasSvg label="สังกะสีเสียอิเล็กตรอนสองตัวและไอออนทองแดงรับอิเล็กตรอนสองตัว"><AtlasNode x={57} y={58} label="Zn"/><AtlasArrow x1={89} y1={58} x2={205} y2={58}/><AtlasNode x={255} y={58} label="Zn²⁺" radius={29}/><Label x={151} y={38}>เสีย 2e⁻</Label><AtlasNode x={57} y={142} label="Cu²⁺" color={rust} radius={29}/><AtlasArrow x1={99} y1={142} x2={211} y2={142} color={rust}/><AtlasNode x={255} y={142} label="Cu" color={rust}/><Label x={151} y={121}>รับ 2e⁻</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="Zn เป็นแอโนด (−), Cu เป็นแคโทด (+)" subtitle="Galvanic Zn–Cu cell" insight="อิเล็กตรอนผ่านลวดจาก Zn ไป Cu ส่วน NO₃⁻ ผ่านสะพานเกลือไปฝั่ง Zn และ K⁺ ไปฝั่ง Cu เพื่อช่วยรักษาสมดุลประจุ" caution="ไม่มีอิเล็กตรอนไหลผ่านสารละลายแทนไอออนในภาพวงจรนี้" tone="blue">
      <AtlasSvg label="เซลล์กัลวานิก Zn แอโนดลบอยู่ซ้าย Cu แคโทดบวกอยู่ขวา อิเล็กตรอนผ่านลวดไปขวา ส่วนไนเตรตไปซ้ายและโพแทสเซียมไปขวาผ่านสะพานเกลือ"><Beakers/><Label x={65} y={80}>Zn (−)</Label><Label x={252} y={80}>Cu (+)</Label><Label x={79} y={166} size={13}>Zn²⁺ เพิ่ม</Label><Label x={239} y={166} size={13}>Cu²⁺ ลด</Label><Label x={157} y={111} size={13}>KNO₃</Label><Label x={160} y={197} size={13}>NO₃⁻ ← สะพานเกลือ → K⁺</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="เลขออกซิเดชันต้องรวมได้ประจุสุทธิ" subtitle="Oxidation numbers" formula="Mn + 4(−2) = −1 → Mn = +7" example="MnO₄⁻: O แต่ละตัว −2 จึงได้ Mn +7" insight="เลขออกซิเดชันใช้ติดตามการเปลี่ยนแปลงอิเล็กตรอนตามข้อตกลง ไม่ใช่ประจุจริงของแต่ละอะตอมในทุกพันธะ" caution="O ไม่ได้เป็น −2 ทุกกรณี เช่น เพอร์ออกไซด์" tone="amber">
      <AtlasSvg label="ไอออนเปอร์แมงกาเนตมีแมงกานีสเลขออกซิเดชันบวกเจ็ด และออกซิเจนสี่อะตอมลบสอง รวมเป็นลบหนึ่ง ไม่ใช่ภาพโครงสร้างพันธะจริง">{[[75,42],[245,42],[75,146],[245,146]].map(([x,y],i)=><g key={i}><path d={`M${x} ${y}L160 93`} stroke="#b6cdbf" strokeDasharray="4 4"/><AtlasNode x={x} y={y} label="−2" color={teal} radius={22}/></g>)}<AtlasNode x={160} y={93} label="+7" color={rust} radius={28}/><Label x={160} y={193}>ผลรวม = −1 ของ MnO₄⁻</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="หาศักย์เซลล์จากศักย์รีดักชัน" subtitle="Standard cell potential" formula="E°cell = E°cathode − E°anode" example="0.34 − (−0.76) = 1.10 V" insight="ใช้ค่ารีดักชันทั้งสองขั้วในสูตรเดียวกัน แม้ครึ่งปฏิกิริยาที่แอโนดเกิดย้อนทิศจากตาราง" caution="ไม่คูณค่า E° ตามสัมประสิทธิ์เมื่อดุลอิเล็กตรอน" tone="purple">
      <AtlasSvg label="ระดับศักย์รีดักชัน Cu2+/Cu บวก0.34โวลต์สูงกว่า Zn2+/Zn ลบ0.76โวลต์ ผลต่าง1.10โวลต์"><path d="M32 48H208M32 143H208" stroke={teal} strokeWidth="2"/><Label x={122} y={38}>Cu²⁺/Cu: +0.34 V</Label><Label x={122} y={169}>Zn²⁺/Zn: −0.76 V</Label><AtlasArrow x1={235} y1={140} x2={235} y2={52} color={blue}/><Label x={278} y={109} color={blue}>1.10 V</Label><Label x={160} y={195} size={13}>ภายใต้เงื่อนไขมาตรฐาน</Label></AtlasSvg>
    </AtlasCard>
  </VisualAtlas>;
}
function Electrolysis() {
  return <VisualAtlas title="อิเล็กโทรลิซิส: จากแหล่งจ่ายไฟสู่ปริมาณสาร" intro="ตามเส้นทางพลังงาน ระบุปฏิกิริยาที่ขั้ว แล้วแปลงกระแสและเวลาเป็นจำนวนโมล" note="ภาพเป็นเซลล์ทั่วไปเชิงแนวคิด การทำนายผลิตภัณฑ์จริงต้องรู้สาร อิเล็กโทรด ความเข้มข้น และเงื่อนไข ตัวอย่าง Cu สมมติประสิทธิภาพกระแส 100%">
    <AtlasCard title="แอโนด (+) / แคโทด (−) ในเซลล์อิเล็กโทรไลต์" subtitle="External electrical energy" insight="แหล่งจ่ายไฟดึงอิเล็กตรอนจากแอโนดและส่งไปแคโทด ไอออนเคลื่อนในอิเล็กโทรไลต์ร่วมกันเพื่อปิดวงจร แอโนดเกิดออกซิเดชันและแคโทดเกิดรีดักชันเสมอ" caution="เครื่องหมายขั้วต่างจากกัลวานิก แต่ชื่อปฏิกิริยาที่ขั้วไม่เปลี่ยน">
      <AtlasSvg label="แหล่งจ่ายไฟขั้วบวกต่อแอโนดซ้าย ขั้วลบต่อแคโทดขวา ขั้วทั้งสองจุ่มในอิเล็กโทรไลต์อ่างเดียวกัน แคตไอออนเคลื่อนไปแคโทดและแอนไอออนไปแอโนด"><Beakers electrolytic/><Label x={70} y={83}>แอโนด +</Label><Label x={250} y={83}>แคโทด −</Label><Label x={77} y={169} size={13}>ออกซิเดชัน</Label><Label x={239} y={169} size={13}>รีดักชัน</Label><AtlasArrow x1={73} y1={75} x2={73} y2={50}/><AtlasArrow x1={245} y1={51} x2={245} y2={76}/><Label x={160} y={195} size={13}>พลังงานไฟฟ้าขับปฏิกิริยา</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="Cu²⁺ รับ 2e⁻ แล้วเกาะที่แคโทด" subtitle="Cathodic copper deposition" formula="Cu²⁺ + 2e⁻ → Cu(s)" insight="Cu หนึ่งโมลต้องใช้อิเล็กตรอนสองโมล จำนวนอิเล็กตรอน z มาจากครึ่งปฏิกิริยาที่ดุลแล้ว" caution="ภาพจุดเป็นสัญลักษณ์ ไม่ใช่มาตราส่วนจำนวนไอออนหรือความหนาชั้นโลหะ" tone="blue">
      <AtlasSvg label="ไอออนทองแดงบวกสองเคลื่อนไปใกล้แคโทด รับอิเล็กตรอนจากขั้ว และกลายเป็นทองแดงโลหะ"><rect x="229" y="34" width="27" height="135" fill="#91aaa0"/><rect x="215" y="79" width="14" height="90" fill="#bf7957"/><Label x={242} y={22}>แคโทด −</Label><AtlasNode x={66} y={107} label="Cu²⁺" color={blue} radius={29}/><AtlasArrow x1={110} y1={107} x2={192} y2={107} color={blue}/><Label x={154} y={77}>รับ 2e⁻</Label><Label x={188} y={187}>ชั้น Cu(s) เกาะบนขั้ว</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="กระแส × เวลา = ประจุไฟฟ้า" subtitle="Charge from current" formula="Q = It" example="I = 2.00 A, t = 965 s → Q = 1,930 C" insight="1 A เท่ากับ 1 C/s จึงต้องเปลี่ยนเวลาเป็นวินาทีให้ตรงหน่วยก่อนแทนค่า" caution="ใช้ Q = It เมื่อกระแสคงที่ ถ้ากระแสเปลี่ยนต้องรวมพื้นที่ใต้กราฟ I–t" tone="amber">
      <AtlasSvg label="กราฟกระแสคงที่2แอมแปร์เป็นเวลา965วินาที พื้นที่สี่เหลี่ยมใต้กราฟคือประจุ1930คูลอมบ์"><Axes xLabel="" yLabel="กระแส (A)"/><rect x="45" y="66" width="215" height="94" fill="#d8e9de"/><path d="M45 66H260" stroke={teal} strokeWidth="3"/><Label x={28} y={72}>2</Label><Label x={260} y={178} size={13}>965</Label><Label x={154} y={116}>พื้นที่ = 1,930 C</Label><Label x={32} y={178} size={13}>0</Label><Label x={280} y={198} anchor="end" size={13}>เวลา (s)</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="กฎฟาราเดย์: ประจุ → e⁻ → โลหะ" subtitle="Faraday's law" formula="n(e⁻) = Q/F · n(Cu) = n(e⁻)/2" example="ใช้ F ≈ 96,500 C/mol → Cu ≈ 0.635 g" insight="Q = 1,930 C ให้ e⁻ 0.0200 mol จึงได้ Cu 0.0100 mol คูณมวลโมลาร์ประมาณ 63.5 g/mol" caution="ผลจริงลดลงได้เมื่อมีปฏิกิริยาข้างเคียงหรือประสิทธิภาพกระแสต่ำกว่า 100%" tone="purple">
      <AtlasSvg label="ประจุ1930คูลอมบ์หารค่าคงตัวฟาราเดย์เป็นอิเล็กตรอน0.0200โมล หารสองเป็นทองแดง0.0100โมล แล้วคูณมวลโมลาร์เป็น0.635กรัม"><Box x={29} y={18} width={262}>1,930 C ÷ F</Box><AtlasArrow x1={160} y1={63} x2={160} y2={82}/><Box x={29} y={88} width={262} color="#e1eaf3">0.0200 mol e⁻ ÷ 2</Box><AtlasArrow x1={160} y1={132} x2={160} y2={150}/><Box x={29} y={155} width={262} color="#f4e9db">0.0100 mol Cu → 0.635 g</Box></AtlasSvg>
    </AtlasCard>
  </VisualAtlas>;
}
function Models() {
  const times = [0, 10, 20, 30, 40];
  const measured = [1, .62, .39, .21, .14];
  const model = (t: number) => Math.exp(-.05*t);
  const curve = Array.from({length:41},(_,i)=>`${44+i*5},${160-110*model(i)}`).join(" ");
  return <VisualAtlas title="อ่านแบบจำลองอย่างมีหลักฐาน" intro="เชื่อมสมการกับกราฟ แล้วมองทั้งจุดที่ตรง จุดที่ต่าง และช่วงที่ยังไม่มีข้อมูล" note="จุดผลวัดและผลต่างในแผ่นภาพเป็นข้อมูลสมมติสำหรับฝึกอ่านแบบจำลอง ไม่ใช่ผลทดลองของสารจริง เส้นอันดับหนึ่งกำหนด [A]₀ = 1.00 mol/L และ k = 0.0500 s⁻¹">
    <AtlasCard title="ระบุตัวแปรก่อนอ่านเส้นกราฟ" subtitle="Variables and units" formula="[A] = [A]₀ e⁻ᵏᵗ" example="t = 20.0 s → [A] ≈ 0.368 mol/L" insight="[A]₀ เป็นค่าเริ่มต้น ส่วน k กำหนดความเร็วการลดลง ต้องรู้หน่วยและเงื่อนไขก่อนใช้สมการ" caution="รูปเส้นโค้งเพียงอย่างเดียวไม่ได้ยืนยันอันดับปฏิกิริยา">
      <AtlasSvg label="กราฟแบบจำลองอันดับหนึ่งเริ่มความเข้มข้น1โมลต่อลิตร ลดลงถึงประมาณ0.368เมื่อเวลา20วินาที"><Axes/><polyline points={curve} fill="none" stroke={teal} strokeWidth="3"/><path d="M144 160V119.53H44" stroke={blue} strokeDasharray="4 4" fill="none"/><circle cx="144" cy="119.53" r="5" fill={blue}/><Label x={193} y={101} color={blue}>0.368</Label><Label x={144} y={177} size={13}>20</Label><Label x={27} y={54} size={13}>1.0</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="จุดข้อมูลกับเส้นทำนายเป็นคนละสิ่ง" subtitle="Observation versus prediction" example="จุดสีส้ม = ข้อมูลสมมติ / เส้นเขียว = ผลคำนวณ" insight="ต้องตรวจข้อมูลหลายเวลา รวมความไม่แน่นอนและการทำซ้ำ ไม่ปรับหรือลบข้อมูลเพื่อให้เส้นดูพอดี" tone="blue">
      <AtlasSvg label="จุดข้อมูลสมมติห้าเวลาวางใกล้แต่ไม่ตรงกับเส้นอันดับหนึ่งทั้งหมด"><Axes/><polyline points={curve} fill="none" stroke={teal} strokeWidth="3"/>{times.map((t,i)=><circle key={t} cx={44+t*5} cy={160-measured[i]*110} r="4.5" fill={rust}/>)}<Label x={217} y={65} size={13} color={rust}>ข้อมูลสมมติ</Label><Label x={224} y={89} size={13} color={teal}>เส้นแบบจำลอง</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="ผลต่างบอกสิ่งที่เส้นยังอธิบายไม่หมด" subtitle="Residual = observed − predicted" formula="0.390 − 0.368 = 0.022 mol/L" insight="ตรวจว่าผลต่างกระจายรอบศูนย์หรือมีแนวโน้มเป็นระบบ แต่ต้องพิจารณาความไม่แน่นอนประกอบ" caution="ผลต่างหนึ่งจุดไม่พอตัดสินว่าแบบจำลองถูกหรือผิดทั้งหมด" tone="amber">
      <AtlasSvg label="กราฟผลต่างระหว่างข้อมูลสมมติกับแบบจำลองอยู่ทั้งด้านบวกและลบของเส้นศูนย์ จุดเวลา20วินาทีมีผลต่างประมาณบวก0.022โมลต่อลิตร"><path d="M44 32v128h241M44 105H285" fill="none" stroke="#90ac9e" strokeWidth="1.5"/><Label x={15} y={20} anchor="start" size={13}>ผลต่าง (mol/L)</Label><Label x={280} y={184} anchor="end" size={13}>เวลา (s)</Label><Label x={24} y={110} size={13}>0</Label>{times.map((t,i)=>{const y=105-(measured[i]-model(t))*1500;return <g key={t}><path d={`M${44+t*5} 105V${y}`} stroke={blue} strokeWidth="2"/><circle cx={44+t*5} cy={y} r="4.5" fill={rust}/></g>;})}<Label x={154} y={56} color={rust} size={13}>20 s: +0.022</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="ช่วงที่วัดได้ไม่เท่ากับทุกช่วงที่ทำนาย" subtitle="Assumptions and extrapolation" example="เส้นประอยู่นอกช่วงข้อมูลสมมติ" insight="กราฟในช่วงอุณหภูมิหรือเวลาหนึ่งไม่ได้รับรองว่าใช้ได้เมื่อเงื่อนไขเปลี่ยน ต้องตรวจสมมติฐานและหลักฐานเพิ่ม" caution="อันดับหนึ่งนี้สมมติอุณหภูมิคงที่ ผสมสม่ำเสมอ และไม่มีปฏิกิริยาย้อนกลับ" tone="purple">
      <AtlasSvg label="กรอบซ้ายเป็นช่วงที่มีข้อมูล ส่วนเส้นประขวาเป็นการคาดการณ์ออกนอกช่วง ต้องมีหลักฐานเพิ่ม"><rect x="44" y="34" width="140" height="127" fill="#e1eee5"/><rect x="184" y="34" width="102" height="127" fill="#f4eadf"/><Axes xLabel="ตัวแปรที่ศึกษา" yLabel="ผลตอบสนอง"/><path d="M48 139Q118 118 184 93" fill="none" stroke={teal} strokeWidth="3"/><path d="M184 93Q240 72 280 49" fill="none" stroke={rust} strokeWidth="3" strokeDasharray="6 5"/>{[[63,135],[95,126],[131,112],[169,99]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill={teal}/>)}<Label x={112} y={58} size={13}>มีข้อมูล</Label><Label x={236} y={140} size={13} color={rust}>ยังไม่ตรวจ</Label></AtlasSvg>
    </AtlasCard>
  </VisualAtlas>;
}
function Experimental() {
  return <VisualAtlas title="การทดลองและข้อมูล: เห็นตัวแปร เห็นความคลาดเคลื่อน" intro="วางแผนสิ่งที่จะเปลี่ยน สิ่งที่จะวัด และสิ่งที่ต้องคงที่ ก่อนสรุปจากตัวเลขหรือกราฟ" note="เป้าและตัวเลขทั้งหมดเป็นภาพหรือข้อมูลสมมติเพื่ออธิบายความหมาย ไม่ใช่ผลวัดจริง ความสัมพันธ์จากกราฟเพียงอย่างเดียวไม่ยืนยันเหตุ–ผล">
    <AtlasCard title="แยกตัวแปรต้น ตาม และควบคุม" subtitle="Independent, dependent, controlled" example="ศึกษาอุณหภูมิกับอัตราปฏิกิริยาของระบบหนึ่ง" insight="เปลี่ยนอุณหภูมิ วัดอัตรา และคงปัจจัยอื่นที่เกี่ยวข้อง เช่น ความเข้มข้นเริ่มต้น ปริมาตร และวิธีวัด" caution="การเปลี่ยนหลายปัจจัยพร้อมกันทำให้แปลผลว่าปัจจัยใดเป็นสาเหตุได้ยาก">
      <AtlasSvg label="เปลี่ยนอุณหภูมิเป็นตัวแปรต้น วัดอัตราเป็นตัวแปรตาม โดยควบคุมความเข้มข้นเริ่มต้นและปริมาตร"><Box x={20} y={28} width={116}>เปลี่ยน T</Box><AtlasArrow x1={144} y1={48} x2={177} y2={48}/><Box x={185} y={28} width={116} color="#e2eaf3">วัดอัตรา</Box><path d="M60 100H260" stroke="#b2ccbd" strokeWidth="2"/><Box x={28} y={118} width={123} color="#f5ecdd">คง [A]₀</Box><Box x={169} y={118} width={123} color="#f5ecdd">คงปริมาตร</Box><Label x={160} y={187}>ควบคุมวิธีและเงื่อนไขให้เทียบกันได้</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="แม่นกับเที่ยงเป็นคนละประเด็น" subtitle="Accuracy ≠ precision" insight="ความแม่นคือใกล้ค่าอ้างอิง ความเที่ยงคือผลวัดซ้ำอยู่ใกล้กัน เป้าที่กระจุกแต่เยื้องกลางแสดงว่าเที่ยงแต่ไม่แม่น" caution="การวัดซ้ำมากไม่ได้ลบความคลาดเคลื่อนเชิงระบบโดยอัตโนมัติ" tone="blue">
      <AtlasSvg label="เป้าซ้ายผลวัดกระจุกใกล้จุดอ้างอิง กลางกระจุกแต่ห่างจุดอ้างอิง ขวากระจายรอบจุดอ้างอิง"><Target x={57} label="แม่นและเที่ยง"/><Target x={159} label="เที่ยงแต่ไม่แม่น" offset/><Target x={263} label="กระจาย" scattered/><Label x={160} y={187} size={13}>กลางเป้า = ค่าอ้างอิง</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="ค่าเฉลี่ยต้องมีบริบทของการกระจาย" subtitle="Mean and measurement spread" formula="ค่าเฉลี่ย = (10.1 + 10.2 + 10.0)/3 = 10.1 mL" example="ข้อมูลปริมาตรสมมติ 3 ครั้ง" insight="รายงานหน่วย จำนวนซ้ำ วิธีวัด และความไม่แน่นอนที่เหมาะสม ค่าเฉลี่ยเพียงอย่างเดียวไม่บอกความแม่นของวิธี" caution="ทศนิยมเพิ่มไม่ได้ทำให้เครื่องมือมีความละเอียดมากขึ้น" tone="amber">
      <AtlasSvg label="ผลวัดสมมติ10.0 10.1 และ10.2มิลลิลิตรกระจายรอบค่าเฉลี่ย10.1มิลลิลิตร"><path d="M36 109H284" stroke="#8da99b" strokeWidth="2"/>{[62,160,258].map((x,i)=><g key={x}><path d={`M${x} 100v18`} stroke={teal} strokeWidth="2"/><circle cx={x} cy="82" r="7" fill={i===1?rust:teal}/><Label x={x} y={140}>{["10.0","10.1","10.2"][i]}</Label></g>)}<AtlasArrow x1={160} y1={42} x2={160} y2={69} color={rust}/><Label x={160} y={29} color={rust}>ค่าเฉลี่ย 10.1 mL</Label><Label x={160} y={185} size={13}>ยังต้องประเมินความไม่แน่นอน</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="อ่านกราฟพร้อมแกน หน่วย และเงื่อนไข" subtitle="Evidence before conclusion" insight="กราฟช่วยแสดงแนวโน้ม แต่ต้องรู้ว่าจุดแต่ละจุดมาจากอะไร ทำซ้ำหรือไม่ และมีตัวแปรแทรกซ้อนใด" caution="ไม่เลือกทิ้งจุดที่ไม่ตรงสมมติฐานโดยไม่ตรวจและเปิดเผยเหตุผล" tone="purple">
      <AtlasSvg label="จุดอัตราปฏิกิริยาสมมติเพิ่มตามอุณหภูมิ กราฟระบุหน่วยและไม่มีเส้นฟิตที่อ้างว่าเป็นกฎสากล"><Axes xLabel="อุณหภูมิ (°C)" yLabel="อัตรา (mol/L/s)"/>{[[70,137],[115,124],[160,97],[205,76],[250,46]].map(([x,y],i)=><g key={i}><path d={`M${x} ${y-8}v16m-4-16h8m-8 16h8`} stroke="#9eafa4" strokeWidth="1.5"/><circle cx={x} cy={y} r="4.5" fill={teal}/></g>)}<Label x={168} y={40} size={13}>ข้อมูลสมมติ</Label><Label x={160} y={198} size={13}>แนวโน้ม ≠ หลักฐานเหตุ–ผลเพียงลำพัง</Label></AtlasSvg>
    </AtlasCard>
  </VisualAtlas>;
}
function Safety() {
  return <VisualAtlas title="อ่านความปลอดภัยจากข้อมูล ไม่เดาจากรูปลักษณ์" intro="ใช้ชื่อสาร ความเข้มข้น ฉลาก และ SDS ประกอบการประเมินความเสี่ยงและวิธีควบคุม" note="แผนภาพนี้เป็นสื่ออ่านข้อมูล ไม่ใช่ขั้นตอนทดลองหรือการจัดการเหตุรั่วไหลจริง ต้องใช้ SDS ที่ตรงกับสารและแนวทางของผู้รับผิดชอบสถานที่">
    <AtlasCard title="ตรวจชื่อสารและความเข้มข้นให้ตรงกัน" subtitle="Label ↔ safety data sheet" insight="ฉลากบอกข้อมูลอันตรายเบื้องต้น ส่วน SDS อธิบายการจัดเก็บ การควบคุมการสัมผัส การปฐมพยาบาล และข้อมูลอื่นอย่างละเอียด" caution="ชื่อสารคล้ายกันหรือความเข้มข้นต่างกัน ไม่ได้ใช้ข้อมูลแทนกันได้เสมอไป">
      <AtlasSvg label="ขวดสารที่มีชื่อและความเข้มข้นเชื่อมกับเอกสารSDSฉบับที่ตรงกัน ไม่แสดงสัญลักษณ์อันตรายสมมติเป็นGHSจริง"><rect x="58" y="24" width="43" height="16" rx="3" fill={teal}/><path d="M57 40h46v21q16 10 16 23v86H41V84q0-13 16-23z" fill="#e1ede5" stroke="#88a695" strokeWidth="2"/><rect x="48" y="88" width="64" height="58" rx="5" fill="white"/><Label x={80} y={111} size={13}>ชื่อสาร</Label><Label x={80} y={132} size={13}>ความเข้มข้น</Label><AtlasArrow x1={132} y1={103} x2={175} y2={103}/><rect x="189" y="33" width="101" height="139" rx="6" fill="white" stroke="#a6beb0" strokeWidth="2"/><Label x={240} y={64} size={20} color={teal}>SDS</Label>{[84,103,122,141].map(y=><path key={y} d={`M203 ${y}h74`} stroke="#c0d2c7" strokeWidth="3"/>)}<Label x={160} y={195} size={13}>ตรวจชนิด ความเข้มข้น และฉบับข้อมูล</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="อันตรายกับโอกาสสัมผัสต้องพิจารณาคู่กัน" subtitle="Hazard and exposure" example="ปริมาณ ความเข้มข้น เส้นทางและระยะเวลาสัมผัสมีผลต่อความเสี่ยง" insight="สารมีอันตรายไม่ได้บอกระดับความเสี่ยงของทุกสถานการณ์เพียงค่าเดียว ต้องดูเงื่อนไขการใช้และมาตรการควบคุม" caution="ไม่มีกลิ่นหรือสี ไม่ได้แปลว่าปลอดภัย" tone="blue">
      <AtlasSvg label="ข้อมูลอันตรายและข้อมูลการสัมผัสสองด้านรวมกันในการประเมินความเสี่ยง ไม่ใช่สูตรคูณเชิงปริมาณ"><Box x={16} y={25} width={129}>อันตรายของสาร</Box><Box x={175} y={25} width={129} color="#e1eaf3">โอกาสสัมผัส</Box><AtlasArrow x1={82} y1={76} x2={131} y2={113}/><AtlasArrow x1={239} y1={76} x2={190} y2={113} color={blue}/><Box x={66} y={124} width={188} color="#f5e8d8">ประเมินความเสี่ยง</Box><Label x={160} y={190} size={13}>ตามสถานการณ์และวิธีควบคุม</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="ลดอันตรายที่ต้นทางก่อนพึ่ง PPE" subtitle="Hierarchy of controls" insight="เลือกวิธีลดหรือแทนที่อันตราย ตามด้วยการควบคุมทางวิศวกรรม วิธีทำงาน และอุปกรณ์ป้องกันส่วนบุคคลที่เหมาะกับสาร" caution="ถุงมือทุกชนิดไม่ได้ทนสารทุกชนิด และ PPE ไม่ทดแทนระบบควบคุมอื่น" tone="amber">
      <AtlasSvg label="ลำดับการควบคุมห้าระดับจากการกำจัดอันตราย การทดแทน วิศวกรรม วิธีทำงาน และอุปกรณ์ป้องกันส่วนบุคคล"><g>{["กำจัดอันตราย", "ทดแทน", "วิศวกรรม", "วิธีทำงาน", "PPE"].map((label,i)=><g key={label}><rect x={23+i*15} y={15+i*35} width={274-i*30} height="29" rx="5" fill={["#c2ddcc","#d0e4d6","#dceadd","#eee9d7","#f1dec9"][i]}/><Label x={160} y={35+i*35} size={13}>{label}</Label></g>)}</g><Label x={160} y={192} size={13}>เลือกให้เหมาะกับงานและสารจริง</Label></AtlasSvg>
    </AtlasCard>
    <AtlasCard title="แยกของเสีย ติดฉลาก ส่งตามระบบ" subtitle="Chemical waste management" insight="ต้องรู้ส่วนประกอบก่อนเลือกภาชนะและกลุ่มของเสีย ไม่รวมสารที่เข้ากันไม่ได้ และส่งให้ผู้รับผิดชอบตามระบบของสถานที่" caution="ไม่เทลงท่อหรือผสมรวมโดยไม่มีข้อมูล แม้สารละลายดูใส" tone="purple">
      <AtlasSvg label="ของเสียในภาชนะสามใบถูกแยกตามข้อมูลชนิดสาร มีฉลาก และส่งตามระบบ ไม่ได้แสดงว่าภาชนะทั่วไปใช้ได้กับของเสียทุกชนิด">{[60,160,260].map((x,i)=><g key={x}><rect x={x-19} y="40" width="38" height="14" rx="3" fill={[teal,blue,rust][i]}/><rect x={x-27} y="55" width="54" height="88" rx="8" fill={["#dcecdf","#dce7f0","#f0e3d9"][i]} stroke="#9db7a6"/><rect x={x-22} y="85" width="44" height="33" rx="4" fill="white"/><Label x={x} y={107} size={13}>{["ชนิด A","ชนิด B","รอข้อมูล"][i]}</Label></g>)}<Label x={160} y={171}>แยกตามองค์ประกอบและความเข้ากันได้</Label><Label x={160} y={194} size={13}>ขอข้อมูลก่อนจัดการสารที่ไม่ทราบชนิด</Label></AtlasSvg>
    </AtlasCard>
  </VisualAtlas>;
}
export function MaterialsAtlas({ articleId }: { articleId: string }) {
  switch (articleId) {
    case "polymers-around-us": return <Polymers/>;
    case "redox-galvanic-cells": return <Redox/>;
    case "electrolysis-faraday": return <Electrolysis/>;
    case "chemical-models": return <Models/>;
    case "experimental-data": return <Experimental/>;
    case "chemical-safety": return <Safety/>;
    default: return null;
  }
}
