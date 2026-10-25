"use client";
import type { ReactNode } from "react";
import { AtlasArrow, AtlasCard, AtlasNode, AtlasSvg, VisualAtlas } from "./atlas-kit";

export const foundationAtlasIds = ["atomic-structure", "electrons-periodic-table", "chemical-bonding", "why-water-dissolves", "concentration-is-a-ratio", "mole-stoichiometry", "states-ideal-gas"];
const teal = "#2e7163", blue = "#527da4", rust = "#b96345", ink = "#294e48";
function Label({ x, y, children, color = ink, size = 14, anchor = "middle" }: { x: number; y: number; children: ReactNode; color?: string; size?: number; anchor?: "middle" | "start" | "end" }) {
  return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size}>{children}</text>;
}
function Dots({ points, color = blue, radius = 5 }: { points: number[][]; color?: string; radius?: number }) {
  return <g>{points.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={radius} fill={color}/>)}</g>;
}
function Beaker({ x, y = 45, width = 105, height = 110, fillHeight = 76, points = [] }: { x: number; y?: number; width?: number; height?: number; fillHeight?: number; points?: number[][] }) {
  return <g><path d={`M${x} ${y}V${y+height}H${x+width}V${y}`} fill="#f8fbfa" stroke="#94afa5" strokeWidth="2"/>
    <rect x={x+3} y={y+height-fillHeight} width={width-6} height={fillHeight-3} fill="#dceee8"/>
    <path d={`M${x+3} ${y+height-fillHeight}H${x+width-3}`} stroke="#9ebfb2"/>
    <Dots points={points.map(([px,py])=>[x+px,y+height-fillHeight+py])}/></g>;
}
const six = [[22,18],[54,18],[82,22],[25,50],[55,46],[81,51]];
function Shells({ x, y, counts, name }: { x: number; y: number; counts: number[]; name: string }) {
  return <g>{counts.map((count,shell) => <g key={shell}><circle cx={x} cy={y} r={24+shell*17} fill="none" stroke="#b7cec4"/>{Array.from({length:count},(_,i)=>{
    const a = -Math.PI/2+i*Math.PI*2/count, r = 24+shell*17;
    return <circle key={i} data-atlas-electron="true" cx={x+r*Math.cos(a)} cy={y+r*Math.sin(a)} r="3.5" fill={shell===2?rust:teal}/>;
  })}</g>)}<circle cx={x} cy={y} r="14" fill={teal}/><Label x={x} y={y+5} size={13} color="white">{name}</Label></g>;
}
function Bond({ x1,y1,x2,y2,order=1 }: {x1:number;y1:number;x2:number;y2:number;order?:number}) {
  const d=Math.hypot(x2-x1,y2-y1), dx=-(y2-y1)/d*3, dy=(x2-x1)/d*3;
  return <g stroke="#718e83" strokeWidth="3">{order===2?<><line x1={x1+dx} y1={y1+dy} x2={x2+dx} y2={y2+dy}/><line x1={x1-dx} y1={y1-dy} x2={x2-dx} y2={y2-dy}/></>:<line x1={x1} y1={y1} x2={x2} y2={y2}/>}</g>;
}
function Water({ x, y, scale = 1, rotate = 0, polar = false }: { x:number; y:number; scale?:number; rotate?:number; polar?:boolean }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}><Bond x1={0} y1={0} x2={-29} y2={23}/><Bond x1={0} y1={0} x2={29} y2={23}/><AtlasNode x={0} y={0} label="O" radius={16} color={rust}/><AtlasNode x={-29} y={23} label="H" radius={12} color={blue}/><AtlasNode x={29} y={23} label="H" radius={12} color={blue}/>{polar&&<><Label x={0} y={-26} size={16} color={rust}>δ−</Label><Label x={-49} y={29} size={15}>δ+</Label><Label x={49} y={29} size={15}>δ+</Label></>}</g>;
}
function Hydrogen({ x,y }: {x:number;y:number}) { return <g><Bond x1={x-10} y1={y} x2={x+10} y2={y}/><AtlasNode x={x-12} y={y} label="H" radius={9} color={blue}/><AtlasNode x={x+12} y={y} label="H" radius={9} color={blue}/></g>; }
function Oxygen({ x,y }: {x:number;y:number}) { return <g><Bond x1={x-10} y1={y} x2={x+10} y2={y} order={2}/><AtlasNode x={x-12} y={y} label="O" radius={10} color={rust}/><AtlasNode x={x+12} y={y} label="O" radius={10} color={rust}/></g>; }

function AtomicCards() {
  return [
    <AtlasCard key="notation" title="เลขอะตอมและเลขมวล" subtitle="Atomic notation" formula="A = Z + N" example="²³₁₁Na: โปรตอน 11 นิวตรอน 12" insight="Z บอกจำนวนโปรตอนและชนิดธาตุ ส่วน A นับโปรตอนรวมกับนิวตรอน" caution="เลขมวลเป็นจำนวนเต็ม ไม่ใช่มวลอะตอมเฉลี่ยจากตารางธาตุ">
      <AtlasSvg label="สัญลักษณ์โซเดียม23 มีเลขมวล23เหนือเลขอะตอม11 จำนวนโปรตอน11 นิวตรอน12 และอิเล็กตรอน11เมื่อเป็นกลาง">
        <Label x={132} y={91} size={29}>23</Label><Label x={132} y={129} size={29}>11</Label><Label x={183} y={122} size={55}>Na</Label>
        <AtlasArrow x1={108} y1={83} x2={59} y2={52}/><Label x={52} y={35}>เลขมวล A</Label>
        <AtlasArrow x1={108} y1={126} x2={59} y2={155}/><Label x={63} y={179}>เลขอะตอม Z</Label>
        <Label x={241} y={40}>เป็นกลาง</Label><Label x={241} y={60}>e⁻ = 11</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="isotope" title="ไอโซโทป: ธาตุเดียวกัน" subtitle="Same protons, different neutrons" formula="¹²C และ ¹³C" insight="คาร์บอนทั้งสองชนิดมีโปรตอน 6 เท่ากัน แต่นิวตรอนต่างกัน จึงมีเลขมวลต่างกัน" caution="ไอโซโทปไม่ได้หมายความว่าทุกชนิดเป็นกัมมันตรังสี" tone="blue">
      <AtlasSvg label="คาร์บอน12 มี6โปรตอน6นิวตรอน คาร์บอน13 มี6โปรตอน7นิวตรอน ทั้งคู่มี6อิเล็กตรอนเมื่อเป็นกลาง">
        {[0,1].map(i=><g key={i}><rect x={15+i*160} y="25" width="130" height="142" rx="14" fill={i?"#edf2f8":"#edf5f1"}/><Label x={80+i*160} y={58} size={25}>{i?"¹³C":"¹²C"}</Label><Label x={80+i*160} y={93}>p⁺ = 6</Label><Label x={80+i*160} y={120} color={i?rust:ink}>n = {i?7:6}</Label><Label x={80+i*160} y={147}>e⁻ = 6</Label></g>)}
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="ion" title="ไอออน: เปลี่ยนอิเล็กตรอน" subtitle="Na → Na⁺ + e⁻" formula="ประจุ = จำนวน p⁺ − จำนวน e⁻" insight="Na เสียอิเล็กตรอน 1 ตัว จึงเป็น Na⁺ แต่โปรตอนยังคง 11 และยังเป็นธาตุโซเดียม" caution="วงใช้ช่วยนับระดับพลังงาน ไม่ใช่เส้นทางโคจรจริงของอิเล็กตรอน" tone="amber">
      <AtlasSvg label="อะตอมNaมีอิเล็กตรอน2,8,1 เสีย1ตัวเป็นNaบวกมี2,8 นิวเคลียสไม่เปลี่ยน">
        <Shells x={78} y={89} counts={[2,8,1]} name="Na"/><Shells x={244} y={89} counts={[2,8]} name="Na⁺"/>
        <AtlasArrow x1={149} y1={87} x2={190} y2={87}/><Label x={169} y={66} size={13}>− e⁻</Label>
        <Label x={78} y={169}>11 e⁻ → 2, 8, 1</Label><Label x={244} y={169}>10 e⁻ → 2, 8</Label><Label x={160} y={194}>ทั้งสองมี 11 p⁺ เท่ากัน</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="average" title="มวลอะตอมเป็นค่าเฉลี่ยถ่วงน้ำหนัก" subtitle="Isotopic abundance" formula="มวลเฉลี่ย = Σ(มวลไอโซโทป × สัดส่วน)" example="X สมมติ: 10 u มี 20% และ 11 u มี 80% → 10.8 u" insight="ไอโซโทปที่มีสัดส่วนมากกว่า มีน้ำหนักในการหาค่าเฉลี่ยมากกว่า" caution="ตัวเลขนี้เป็นตัวอย่างสมมติ การคำนวณจริงใช้มวลไอโซโทป ไม่แทนด้วยเลขมวลเสมอ" tone="purple">
      <AtlasSvg label="แถบ20เปอร์เซ็นต์ของไอโซโทปมวล10u และ80เปอร์เซ็นต์ของไอโซโทปมวล11u ให้มวลเฉลี่ย10.8u">
        <rect x="25" y="52" width="54" height="43" rx="5" fill={blue}/><rect x="79" y="52" width="216" height="43" rx="5" fill={teal}/>
        <Label x={52} y={38}>20%</Label><Label x={187} y={38}>80%</Label><Label x={52} y={78} color="white">10 u</Label><Label x={187} y={78} color="white">11 u</Label>
        <AtlasArrow x1={160} y1={110} x2={160} y2={139}/><Label x={160} y={171} size={25}>10.8 u</Label>
      </AtlasSvg>
    </AtlasCard>,
  ];
}
function ElectronCards() {
  return [
    <AtlasCard key="orbitals" title="ออร์บิทัลหนึ่งรองรับได้ 2 e⁻" subtitle="Subshell capacity" formula="s: 2 · p: 6 · d: 10 · f: 14" insight="s, p, d, f มี 1, 3, 5, 7 ออร์บิทัลตามลำดับ ลูกศรคู่ในช่องเดียวแทนสปินตรงข้าม" caution="กล่องเป็นการบันทึกสถานะ ไม่ใช่รูปร่างหรือกล่องที่กักอิเล็กตรอน">
      <AtlasSvg label="sหนึ่งช่อง pสามช่อง dห้าช่อง fเจ็ดช่อง แต่ละช่องใส่อิเล็กตรอนได้สองตัวสปินตรงข้าม">
        {[1,3,5,7].map((n,row)=><g key={n}><Label x={20} y={40+row*45}>{["s","p","d","f"][row]}</Label>{Array.from({length:n},(_,i)=><g key={i}><rect x={48+i*35} y={19+row*45} width="29" height="29" rx="3" fill="#edf5f1" stroke="#9dbbae"/><Label x={62+i*35} y={40+row*45} size={17}>↑↓</Label></g>)}</g>)}
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="sodium-fill" title="Na: ดูอิเล็กตรอนชั้นนอก" subtitle="Ground-state configuration" formula="1s² 2s² 2p⁶ 3s¹" example="Na เป็นกลางมี 11 e⁻; เวเลนซ์อิเล็กตรอน 1 ตัว" insight="ใช้จำนวนอิเล็กตรอนรวมตรวจคำตอบ และดูชั้นพลังงานหลักสูงสุดเพื่อหาเวเลนซ์ของธาตุหมู่หลัก" caution="ลำดับการเติมพื้นฐานมีข้อยกเว้น เช่น Cr และ Cu ไม่ใช้กฎจำอย่างเดียวกับทุกธาตุ" tone="blue">
      <AtlasSvg label="การจัดเรียงโซเดียม:1sสอง 2sสอง 2pหก 3sหนึ่ง รวม11อิเล็กตรอน">
        {[{name:"1s",n:1,e:[2]},{name:"2s",n:1,e:[2]},{name:"2p",n:3,e:[2,2,2]},{name:"3s",n:1,e:[1]}].map((s,row)=><g key={s.name}><Label x={50} y={37+row*46}>{s.name}</Label>{Array.from({length:s.n},(_,i)=><g key={i}><rect x={88+i*48} y={15+row*46} width="40" height="29" rx="3" stroke={row===3?rust:"#a5beb1"} fill={row===3?"#fbefe9":"#edf5f1"}/><Label x={108+i*48} y={36+row*46} size={18}>{s.e[i]===2?"↑↓":"↑"}</Label></g>)}{row===3&&<Label x={243} y={175} color={rust}>ชั้นนอกสุด</Label>}</g>)}
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="periods" title="หมู่กับคาบบอกคนละเรื่อง" subtitle="Groups and periods" insight="ในธาตุหมู่หลัก หลายสมบัติสัมพันธ์กับเวเลนซ์อิเล็กตรอน ส่วนเลขคาบสัมพันธ์กับระดับพลังงานหลักสูงสุดที่มีอิเล็กตรอน" caution="แผนผังเป็นเฉพาะตัวอย่างธาตุหมู่หลัก 2 คาบ ไม่ใช่ตารางธาตุเต็ม" tone="amber">
      <AtlasSvg label="ตัวอย่างคาบ2 Li Be B C N O F Ne และคาบ3 Na Mg Al Si P S Cl Ar แนวนอนคือคาบ แนวตั้งคือหมู่">
        {[['Li','Be','B','C','N','O','F','Ne'],['Na','Mg','Al','Si','P','S','Cl','Ar']].map((row,r)=>row.map((s,c)=><g key={s}><rect x={20+c*36} y={60+r*44} width="31" height="36" rx="4" fill={c===0?"#dcece3":"#eef4f1"} stroke="#aec5b8"/><Label x={35+c*36} y={83+r*44} size={14}>{s}</Label></g>))}
        <AtlasArrow x1={24} y1={151} x2={291} y2={151}/><Label x={160} y={180}>คาบ: อ่านแนวนอน →</Label>
        <AtlasArrow x1={35} y1={23} x2={35} y2={49}/><Label x={119} y={35}>หมู่: อ่านแนวตั้ง ↓</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="trends" title="รัศมีกับพลังงานดึง e⁻ ออก" subtitle="General periodic trends" insight="ในคาบเดียวกัน รัศมีมักลดไปขวา ส่วนพลังงานไอออไนเซชันครั้งที่หนึ่งมักเพิ่มไปขวา; ลงหมู่ รัศมีมักเพิ่ม" caution="เป็นแนวโน้มทั่วไป มีข้อยกเว้น เช่น Be/B และ N/O ในพลังงานไอออไนเซชันครั้งที่หนึ่ง" tone="purple">
      <AtlasSvg label="รัศมีอะตอมโดยทั่วไปเพิ่มไปซ้ายและลงล่าง พลังงานไอออไนเซชันโดยทั่วไปเพิ่มไปขวาและขึ้นบน">
        <rect x="25" y="35" width="115" height="121" rx="10" fill="#e7f1eb"/><rect x="179" y="35" width="115" height="121" rx="10" fill="#e9eff7"/>
        <AtlasArrow x1={118} y1={65} x2={48} y2={65}/><AtlasArrow x1={116} y1={73} x2={116} y2={137}/><Label x={83} y={180}>รัศมีอะตอม</Label>
        <AtlasArrow x1={198} y1={135} x2={269} y2={135} color={blue}/><AtlasArrow x1={200} y1={126} x2={200} y2={57} color={blue}/><Label x={236} y={180}>IE ครั้งที่ 1</Label>
      </AtlasSvg>
    </AtlasCard>,
  ];
}
function BondingCards() {
  return [
    <AtlasCard key="ionic" title="ไอออนิก: ไอออนดึงดูดกัน" subtitle="Electron transfer and ionic lattice" formula="Na → Na⁺ + e⁻ · Cl + e⁻ → Cl⁻" insight="ใช้การถ่ายโอนอิเล็กตรอนช่วยนับประจุ แล้วอธิบายพันธะด้วยแรงดึงดูดระหว่างไอออนต่างประจุในผลึก" caution="NaCl ของแข็งไม่ได้ประกอบด้วยโมเลกุล NaCl แยกคู่กัน และภาพนี้ไม่ใช่กลไกปฏิกิริยาจริงทีละอะตอม">
      <AtlasSvg label="โซเดียมเสียหนึ่งอิเล็กตรอน คลอรีนรับหนึ่ง เกิดNaบวกClลบที่ดึงดูดกัน">
        <AtlasNode x={65} y={70} label="Na" radius={27}/><circle cx="104" cy="70" r="4" fill={rust}/><AtlasNode x={248} y={70} label="Cl" radius={27} color={blue}/>
        <AtlasArrow x1={112} y1={65} x2={207} y2={65} color={rust}/><Label x={160} y={44}>ถ่ายโอน 1 e⁻</Label>
        <AtlasNode x={104} y={147} label="Na⁺" radius={27}/><AtlasNode x={216} y={147} label="Cl⁻" radius={27} color={blue}/><AtlasArrow x1={146} y1={147} x2={173} y2={147}/><AtlasArrow x1={174} y1={147} x2={147} y2={147}/>
        <Label x={160} y={194}>แรงดึงดูดต่างประจุ</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="lewis" title="โคเวเลนต์: ใช้ e⁻ ร่วมกัน" subtitle="Lewis structure of water" formula="H–O–H" insight="น้ำมีคู่ e⁻ พันธะ 2 คู่ และคู่โดดเดี่ยวที่ O อีก 2 คู่ นับรวมเวเลนซ์อิเล็กตรอน 8 ตัว" caution="โครงสร้างลิวอิสบอกการเชื่อมต่อและคู่ e⁻ ไม่ได้บอกมุมพันธะจริงจากภาพเส้นตรง" tone="blue">
      <AtlasSvg label="ลิวอิสของน้ำ Hต่อOต่อH พันธะเดี่ยวสองเส้นแทนอิเล็กตรอนสี่ตัว และออกซิเจนมีคู่โดดเดี่ยวสองคู่รวมอีกสี่ตัว">
        <Bond x1={82} y1={94} x2={238} y2={94}/><AtlasNode x={82} y={94} label="H" color={blue}/><AtlasNode x={160} y={94} label="O" color={rust} radius={27}/><AtlasNode x={238} y={94} label="H" color={blue}/>
        <Dots points={[[151,48],[169,48],[151,140],[169,140]]} color={rust} radius={4}/>
        <Label x={160} y={25}>คู่โดดเดี่ยว 2 คู่</Label><Label x={160} y={185}>คู่พันธะ 2 คู่ + คู่โดดเดี่ยว 2 คู่</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="shape" title="รูปร่างส่งผลต่อขั้วของโมเลกุล" subtitle="CO₂ vs H₂O" insight="CO₂ เป็นเส้นตรง ขั้วพันธะหักล้างกัน; น้ำมีรูปร่างงอ ขั้วพันธะจึงไม่หักล้างกัน" caution="ทั้งสองมีพันธะมีขั้ว แต่ผลรวมขั้วของโมเลกุลต่างกัน ภาพไม่ใช้ขนาดอะตอมตามมาตราส่วน" tone="amber">
      <AtlasSvg label="คาร์บอนไดออกไซด์เป็นเส้นตรง180องศาจึงไม่มีขั้วสุทธิ ส่วนน้ำงอประมาณ104.5องศาจึงมีขั้ว">
        <Bond x1={31} y1={74} x2={127} y2={74} order={2}/><AtlasNode x={31} y={74} label="O" radius={17} color={rust}/><AtlasNode x={79} y={74} label="C" radius={17}/><AtlasNode x={127} y={74} label="O" radius={17} color={rust}/>
        <Label x={79} y={35}>CO₂ · 180°</Label><Label x={79} y={145}>ไม่มีขั้วสุทธิ</Label>
        <Water x={238} y={67} scale={1.15}/><Label x={238} y={35}>H₂O · ≈ 104.5°</Label><Label x={238} y={145}>มีขั้ว</Label>
        <path d="M160 33V159" stroke="#d2e0d9"/>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="intermolecular" title="แรงระหว่างโมเลกุล ≠ พันธะในโมเลกุล" subtitle="Hydrogen bond vs covalent bond" insight="เส้นทึบ O–H อยู่ในโมเลกุลน้ำ ส่วนเส้นประ O···H–O แทนพันธะไฮโดรเจนระหว่างโมเลกุล" caution="เมื่อน้ำเดือด โดยทั่วไปแยกโมเลกุลออกจากกัน ไม่ใช่ตัดทุกพันธะ O–H ให้กลายเป็น H₂ กับ O₂" tone="purple">
      <AtlasSvg label="น้ำสองโมเลกุลเชื่อมด้วยพันธะไฮโดรเจนแบบเส้นประจากOของโมเลกุลแรกไปHของโมเลกุลที่สอง ส่วนO-Hภายในโมเลกุลเป็นเส้นทึบ">
        <Water x={86} y={83}/><Water x={239} y={83} rotate={39}/>
        <path d="M105 83H190" stroke={blue} strokeDasharray="5 5" strokeWidth="2"/>
        <Label x={160} y={41}>O···H–O</Label><Label x={160} y={146}>เส้นประ: พันธะไฮโดรเจน</Label><Label x={160} y={176}>เส้นทึบ: พันธะโคเวเลนต์ O–H</Label>
      </AtlasSvg>
    </AtlasCard>,
  ];
}
function SolubilityCards() {
  return [
    <AtlasCard key="water" title="น้ำมีด้านบวกและลบบางส่วน" subtitle="Polar water molecule" formula="H₂O: รูปร่างงอ → มีขั้ว" insight="O ดึงอิเล็กตรอนในพันธะ O–H ได้มากกว่า H จึงเป็นด้าน δ− ส่วน H เป็นด้าน δ+" caution="δ เป็นประจุบางส่วนของพันธะ ไม่ใช่ O²⁻ หรือ H⁺ แยกอิสระ">
      <AtlasSvg label="โมเลกุลน้ำงอ ออกซิเจนมีประจุลบบางส่วน ไฮโดรเจนสองข้างมีบวกบางส่วน">
        <Water x={160} y={78} scale={1.5} polar/><AtlasArrow x1={118} y1={137} x2={144} y2={108} color={rust}/><AtlasArrow x1={202} y1={137} x2={176} y2={108} color={rust}/><Label x={160} y={185}>อิเล็กตรอนในพันธะเอนเข้าหา O</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="hydration" title="น้ำหันด้านที่เหมาะเข้าหาไอออน" subtitle="Ion–dipole interactions" insight="รอบ Na⁺ ด้าน O หันเข้า; รอบ Cl⁻ ด้าน H หันเข้า เป็นแรงระหว่างไอออนกับขั้วของน้ำ" caution="ภาพแสดงน้ำเพียงบางโมเลกุลเพื่อบอกทิศ ไม่ได้จำลองจำนวนหรือโครงสร้าง hydration shell ทั้งหมด" tone="blue">
      <AtlasSvg label="ไฮเดรชัน Naบวกมีออกซิเจนของน้ำหันเข้าหา ส่วนClลบมีไฮโดรเจนของน้ำหันเข้าหา">
        <AtlasNode x={78} y={105} label="Na⁺" radius={24}/><Water x={78} y={49} scale={.64} rotate={180}/><Water x={78} y={160} scale={.64}/>
        <AtlasNode x={244} y={105} label="Cl⁻" radius={24} color={blue}/><Water x={244} y={39} scale={.64}/><Water x={244} y={169} scale={.64} rotate={180}/>
        <Label x={78} y={195}>O หันเข้า</Label><Label x={244} y={195}>H หันเข้า</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="oil" title="การคนกับการละลายต่างกัน" subtitle="Dispersion vs dissolution" insight="น้ำมันกับน้ำอาจกระจายเป็นหยดเมื่อคน แต่การกระจายชั่วคราวไม่เท่ากับละลายเป็นสารละลายเนื้อเดียว" caution="หลัก “คล้ายละลายคล้าย” เป็นจุดเริ่มต้น ยังต้องดูพลังงาน ขนาดโมเลกุล อุณหภูมิ และข้อมูลการละลายจริง" tone="amber">
      <AtlasSvg label="น้ำกับน้ำมันแยกสองชั้น เมื่อคนเป็นหยดกระจายและอาจกลับแยกชั้น ไม่ใช่การละลาย">
        <Beaker x={25} width={105} fillHeight={83}/><rect x="28" y="72" width="99" height="28" fill="#eac98a"/>
        <Beaker x={190} width={105} fillHeight={83}/><Dots points={[[218,92],[256,87],[239,111],[273,126],[212,134],[246,144]]} color="#d0a34b" radius={8}/>
        <AtlasArrow x1={140} y1={105} x2={178} y2={105}/><Label x={160} y={82}>คน</Label><Label x={77} y={183}>แยกชั้น</Label><Label x={242} y={183}>หยดกระจายชั่วคราว</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="ions" title="ละลายเป็นไอออนหรือเป็นโมเลกุล" subtitle="Dissociation is not the same as dissolving" formula="NaCl(s) → Na⁺(aq) + Cl⁻(aq)" insight="NaCl แยกเป็นไอออนในน้ำ ส่วนน้ำตาลละลายได้โดยส่วนใหญ่ยังเป็นโมเลกุล ไม่ได้แปลว่าต้องมีไอออนมาก" caution="การละลายน้ำได้ ไม่ได้ยืนยันว่าจะนำไฟฟ้าได้ดี" tone="purple">
      <AtlasSvg label="สารละลายเกลือแสดงNaบวกClลบ ส่วนสารละลายน้ำตาลแสดงโมเลกุลน้ำตาลที่ไม่แยกเป็นไอออน">
        <Beaker x={20} width={120} fillHeight={92}/><Beaker x={180} width={120} fillHeight={92}/>
        <Label x={80} y={28}>NaCl ในน้ำ</Label><Label x={240} y={28}>น้ำตาลในน้ำ</Label>
        <AtlasNode x={53} y={96} label="+" radius={15}/><AtlasNode x={105} y={115} label="−" radius={15} color={blue}/><AtlasNode x={58} y={139} label="−" radius={15} color={blue}/><AtlasNode x={105} y={77} label="+" radius={15}/>
        {[[211,93],[267,116],[223,137]].map(([x,y],i)=><g key={i}><rect x={x-18} y={y-9} width="36" height="18" rx="9" fill="#b99d74"/><Label x={x} y={y+5} size={13} color="white">น้ำตาล</Label></g>)}
        <Label x={160} y={188}>aq บอกว่าอยู่ในสารละลายน้ำ</Label>
      </AtlasSvg>
    </AtlasCard>,
  ];
}
function ConcentrationCards() {
  return [
    <AtlasCard key="ratio" title="โมลเท่ากัน ปริมาตรต่างกัน" subtitle="Concentration is a ratio" formula="c = n / V" example="0.10 mol ใน 1.0 L → 0.10 mol/L; ใน 0.50 L → 0.20 mol/L" insight="เมื่อโมลตัวละลายเท่าเดิม แต่ปริมาตรสารละลายลดลง ความเข้มข้นเพิ่มขึ้น" caution="V คือปริมาตรสารละลายทั้งหมด ไม่ใช่ปริมาตรตัวทำละลายก่อนผสม">
      <AtlasSvg label="ตัวละลายหกจุดเท่ากัน ในสารละลายปริมาตรมากและน้อย ความเข้มข้นจึงต่างกัน">
        <Beaker x={25} fillHeight={95} points={six}/><Beaker x={190} fillHeight={55} points={six.map(([x,y])=>[x,y*.55])}/>
        <Label x={78} y={29}>1.0 L</Label><Label x={242} y={29}>0.50 L</Label><Label x={78} y={183}>0.10 mol/L</Label><Label x={242} y={183}>0.20 mol/L</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="amount" title="เข้มข้นเท่ากัน ไม่จำเป็นต้องมีโมลเท่ากัน" subtitle="Amount depends on volume" formula="n = cV" example="c = 0.10 mol/L: 1.0 L มี 0.10 mol แต่ 2.0 L มี 0.20 mol" insight="ต้องรู้ทั้งความเข้มข้นและปริมาตร จึงจะเปรียบเทียบปริมาณตัวละลายทั้งหมดได้" tone="blue">
      <AtlasSvg label="สารละลายความเข้มข้นเท่ากัน ปริมาตร1ลิตรมีจุด4จุด 2ลิตรมี8จุด เพื่อแทนจำนวนโมลที่เพิ่มเป็นสองเท่า">
        <Beaker x={30} width={85} fillHeight={75} points={[[25,20],[60,20],[25,50],[60,50]]}/><Beaker x={165} width={130} fillHeight={98} points={[[20,18],[50,18],[80,18],[110,18],[20,62],[50,62],[80,62],[110,62]]}/>
        <Label x={72} y={29}>1.0 L</Label><Label x={230} y={29}>2.0 L</Label><Label x={72} y={184}>0.10 mol</Label><Label x={230} y={184}>0.20 mol</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="dilution" title="เจือจาง: โมลตัวละลายคงเดิม" subtitle="Same solute, larger final volume" formula="c₁V₁ = c₂V₂" example="0.200 mol/L × 50.0 mL = 0.100 mol/L × 100.0 mL" insight="เติมตัวทำละลายให้ได้ปริมาตรสารละลายสุดท้ายที่ต้องการ ไม่เติมตัวละลายเพิ่ม" caution="สมการนี้ใช้เมื่อไม่มีปฏิกิริยา การสูญเสีย หรือการเพิ่มตัวละลาย; ภาพระดับน้ำเป็นเชิงแนวคิด" tone="amber">
      <AtlasSvg label="ก่อนเจือจางหกจุดใน50มิลลิลิตร หลังเจือจางหกจุดใน100มิลลิลิตร จำนวนตัวละลายเท่าเดิม">
        <Beaker x={25} fillHeight={48} points={six.map(([x,y])=>[x,y*.5])}/><Beaker x={190} fillHeight={96} points={six}/>
        <AtlasArrow x1={140} y1={94} x2={178} y2={94}/><Label x={160} y={72} size={13}>เติมน้ำ</Label>
        <Label x={78} y={183}>50.0 mL</Label><Label x={242} y={183}>100.0 mL</Label><Label x={160} y={28}>n = 0.0100 mol เท่าเดิม</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="units" title="ตรวจหน่วยก่อนแทนค่า" subtitle="mL → L → mol" formula="n = 0.20 mol/L × 0.025 L = 0.0050 mol" example="25 mL ÷ 1000 = 0.025 L" insight="ใช้ L กับความเข้มข้น mol/L เพื่อให้หน่วยลิตรตัดกัน เหลือหน่วย mol" caution="หากใช้ mL แทน L โดยไม่แปลง ผลจะผิดไป 1000 เท่า" tone="purple">
      <AtlasSvg label="25มิลลิลิตรหาร1000เท่ากับ0.025ลิตร แล้วคูณ0.20โมลต่อลิตรเท่ากับ0.0050โมล">
        <rect x="52" y="15" width="216" height="40" rx="8" fill="#e9f1ed"/><Label x={160} y={41} size={19}>25 mL</Label>
        <AtlasArrow x1={100} y1={61} x2={100} y2={82}/><Label x={200} y={77}>÷ 1000</Label>
        <rect x="52" y="87" width="216" height="40" rx="8" fill="#e8eef7"/><Label x={160} y={113} size={19}>0.025 L</Label>
        <AtlasArrow x1={100} y1={134} x2={100} y2={155}/><Label x={202} y={148}>× 0.20 mol/L</Label>
        <Label x={160} y={186} size={21}>0.0050 mol</Label>
      </AtlasSvg>
    </AtlasCard>,
  ];
}
function MoleCards() {
  return [
    <AtlasCard key="conversion" title="จำนวนโมลเชื่อมมวลกับอนุภาค" subtitle="Mass ↔ amount ↔ particles" formula="n = m / M · N = nNₐ" example="น้ำ 36.0 g ÷ 18.0 g/mol = 2.00 mol ≈ 1.20 × 10²⁴ โมเลกุล" insight="มวลโมลาร์ M ทำหน้าที่แปลง g เป็น mol ส่วนค่าคงตัวอาโวกาโดรแปลง mol เป็นจำนวนอนุภาค" caution="ต้องระบุอนุภาคว่าเป็นอะตอม โมเลกุล ไอออน หรือหน่วยสูตร">
      <AtlasSvg label="มวลน้ำ36กรัม หารมวลโมลาร์18กรัมต่อโมล เป็น2โมล คูณค่าคงตัวอาโวกาโดรได้ประมาณ1.20คูณ10ยกกำลัง24โมเลกุล">
        <rect x="20" y="25" width="280" height="42" rx="9" fill="#edf4f0"/><Label x={160} y={53} size={20}>36.0 g</Label>
        <AtlasArrow x1={53} y1={76} x2={53} y2={102}/><Label x={185} y={94}>÷ 18.0 g/mol</Label>
        <Label x={160} y={127} size={23}>2.00 mol</Label><AtlasArrow x1={53} y1={133} x2={53} y2={159}/><Label x={185} y={154}>× 6.02214076 × 10²³ mol⁻¹</Label>
        <Label x={160} y={190}>≈ 1.20 × 10²⁴ โมเลกุล H₂O</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="balanced" title="สัมประสิทธิ์บอกอัตราส่วนโมล" subtitle="Balance atoms before calculating" formula="2H₂ + O₂ → 2H₂O" insight="อัตราส่วน H₂ : O₂ : H₂O = 2 : 1 : 2 ใช้กับจำนวนโมลหรือจำนวนโมเลกุล ไม่ใช่อัตราส่วนมวลโดยตรง" caution="ดุลด้วยสัมประสิทธิ์หน้าสูตร ไม่เปลี่ยนตัวห้อยจนกลายเป็นสารอีกชนิด" tone="blue">
      <AtlasSvg label="สองโมเลกุลไฮโดรเจนรวมกับหนึ่งโมเลกุลออกซิเจนเป็นน้ำสองโมเลกุล อะตอมHสี่และOสองอนุรักษ์">
        <Hydrogen x={52} y={67}/><Hydrogen x={112} y={67}/><Oxygen x={81} y={120}/><AtlasArrow x1={148} y1={94} x2={183} y2={94}/>
        <Water x={241} y={59} scale={.72}/><Water x={241} y={124} scale={.72}/><Label x={160} y={181}>H 4 อะตอม · O 2 อะตอม เท่าเดิม</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="limiting" title="สารกำหนดปริมาณหมดก่อน" subtitle="Limiting reactant" example="H₂ 4 mol + O₂ 3 mol → H₂O 4 mol และ O₂ เหลือ 1 mol" insight="หารโมลตั้งต้นด้วยสัมประสิทธิ์: H₂ ได้ 4/2 = 2; O₂ ได้ 3/1 = 3 ค่าต่ำกว่าคือ H₂ จึงกำหนดผลได้" caution="สารที่มีโมลน้อยกว่า ไม่จำเป็นต้องเป็นสารกำหนดปริมาณ ต้องเทียบกับอัตราส่วนที่ดุลแล้ว" tone="amber">
      <AtlasSvg label="ตั้งต้นH2สี่โมเลกุลและO2สามโมเลกุล ได้H2Oสี่โมเลกุลและO2เหลือหนึ่งโมเลกุล">
        {[35,95].map(x=>[45,85].map(y=><Hydrogen key={`${x}-${y}`} x={x} y={y}/>))}
        {[30,81,132].map(x=><Oxygen key={x} x={x} y={143}/>)}
        <AtlasArrow x1={157} y1={100} x2={182} y2={100}/>
        {[211,279].map(x=>[46,103].map(y=><Water key={`${x}-${y}`} x={x} y={y} scale={.6}/>))}
        <Oxygen x={246} y={161}/><Label x={246} y={193}>O₂ เหลือ</Label><Label x={81} y={193}>ก่อนปฏิกิริยา</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="yield" title="ผลได้จริงเทียบกับผลได้ทฤษฎี" subtitle="Percent yield" formula="ร้อยละผลได้ = (ผลได้จริง / ผลได้ทฤษฎี) × 100" example="8.50 g ÷ 10.0 g × 100 = 85.0%" insight="คำนวณผลได้ทฤษฎีจากสารกำหนดปริมาณก่อน แล้วใช้หน่วยเดียวกันในการหาเปอร์เซ็นต์" caution="ค่าที่ดูเกิน 100% อาจเกิดจากความชื้นหรือสิ่งเจือปน ต้องตรวจข้อมูล ไม่สรุปว่าปฏิกิริยาสร้างมวลเพิ่ม" tone="purple">
      <AtlasSvg label="แท่งผลได้ทฤษฎี10.0กรัมยาวเต็ม และผลได้จริง8.50กรัมยาว85เปอร์เซ็นต์">
        <Label x={28} y={39} anchor="start">ทฤษฎี 10.0 g</Label><rect x="28" y="51" width="264" height="28" rx="6" fill="#dce8e0"/>
        <Label x={28} y={112} anchor="start">จริง 8.50 g</Label><rect x="28" y="124" width="224.4" height="28" rx="6" fill={teal}/><Label x={160} y={188} size={23}>85.0%</Label>
      </AtlasSvg>
    </AtlasCard>,
  ];
}
function GasCards() {
  return [
    <AtlasCard key="phases" title="สถานะต่างกัน การจัดเรียงต่างกัน" subtitle="Solid · liquid · gas" insight="ของแข็งอนุภาคสั่นรอบตำแหน่ง ของเหลวอนุภาคอยู่ใกล้และเลื่อนผ่านกัน ส่วนแก๊สห่างกันและเคลื่อนที่ทั่วภาชนะ" caution="ภาพช่วยเปรียบเทียบการจัดเรียง ไม่ใช่อัตราส่วนระยะห่างจริง และอนุภาคของแข็งไม่ได้หยุดนิ่ง">
      <AtlasSvg label="ของแข็งเก้าจุดเรียงเป็นระเบียบ ของเหลวเก้าจุดใกล้กันไม่เป็นระเบียบ และแก๊สเก้าจุดกระจายทั่วภาชนะ">
        {[9,115,221].map((x,i)=><rect key={i} x={x} y="31" width="90" height="123" rx="6" stroke="#a7bfb2" fill="#f5f9f6"/>)}
        <Dots points={Array.from({length:9},(_,i)=>[28+(i%3)*25,91+Math.floor(i/3)*23])}/>
        <Dots points={[[137,110],[163,109],[186,115],[132,137],[157,137],[186,138],[143,86],[170,87],[190,91]]}/>
        <Dots points={[[239,48],[281,49],[297,81],[254,78],[235,112],[272,106],[298,139],[250,141],[287,124]]}/>
        {["ของแข็ง","ของเหลว","แก๊ส"].map((s,i)=><Label key={s} x={54+i*106} y={185}>{s}</Label>)}
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="boyle" title="เพิ่มความดัน ปริมาตรลด" subtitle="Boyle's law: fixed n, T" formula="P₁V₁ = P₂V₂" example="1.0 atm × 2.0 L = 2.0 atm × 1.0 L" insight="เมื่อจำนวนโมลและอุณหภูมิคงที่ P แปรผกผันกับ V เพิ่ม P สองเท่า จึงเหลือ V ครึ่งหนึ่ง" caution="ใช้กับแก๊สอุดมคติหรือช่วงที่ประมาณได้ ไม่ใช่การอัดเร็วที่อุณหภูมิเปลี่ยน" tone="blue">
      <AtlasSvg label="แก๊สหกอนุภาคปริมาตร2ลิตรที่1บรรยากาศ เทียบหกอนุภาคปริมาตร1ลิตรที่2บรรยากาศ อุณหภูมิคงที่">
        <Beaker x={25} fillHeight={100} points={six}/><Beaker x={190} fillHeight={50} points={six.map(([x,y])=>[x,y*.5])}/>
        <rect x="23" y="53" width="109" height="7" fill="#8aa79a"/><rect x="188" y="103" width="109" height="7" fill="#8aa79a"/>
        <path d="M78 54V26M242 103V26" stroke="#729385" strokeWidth="5"/><AtlasArrow x1={265} y1={29} x2={265} y2={79} color={rust}/>
        <Label x={78} y={182}>2.0 L · 1.0 atm</Label><Label x={242} y={182}>1.0 L · 2.0 atm</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="charles" title="อุ่นแก๊สที่ความดันคงที่" subtitle="Charles's law: fixed n, P" formula="V₁ / T₁ = V₂ / T₂" example="273.15 K → 546.30 K: 1.00 L → 2.00 L ในแบบจำลองอุดมคติ" insight="อุณหภูมิสัมบูรณ์เป็นสองเท่า ปริมาตรจึงเป็นสองเท่า เมื่อ P และ n คงที่" caution="ใช้ T เป็นเคลวิน ห้ามเทียบอัตราส่วนด้วย °C; ภาชนะต้องขยายปริมาตรได้" tone="amber">
      <AtlasSvg label="ลูกสูบแก๊ส1ลิตรที่273.15เคลวินขยายเป็น2ลิตรที่546.30เคลวิน ความดันและจำนวนโมลคงที่">
        <Beaker x={25} fillHeight={50} points={six.map(([x,y])=>[x,y*.5])}/><Beaker x={190} fillHeight={100} points={six}/>
        <rect x="23" y="103" width="109" height="7" fill="#8aa79a"/><rect x="188" y="53" width="109" height="7" fill="#8aa79a"/>
        <path d="M78 103V26M242 53V26" stroke="#729385" strokeWidth="5"/><AtlasArrow x1={160} y1={125} x2={160} y2={74} color={rust}/>
        <Label x={78} y={181}>273.15 K</Label><Label x={242} y={181}>546.30 K</Label>
      </AtlasSvg>
    </AtlasCard>,
    <AtlasCard key="ideal" title="สมการแก๊ส: ให้หน่วย R ตรงกัน" subtitle="Ideal-gas equation" formula="PV = nRT" example="n = 0.100 mol, T = 298.15 K, P = 1.00 atm → V ≈ 2.45 L" insight="ถ้า P เป็น atm และ V เป็น L ใช้ R ≈ 0.08206 L·atm·mol⁻¹·K⁻¹; T = °C + 273.15" caution="แก๊สจริงเบี่ยงเบนได้ โดยเฉพาะความดันสูง อุณหภูมิต่ำ หรือใกล้ควบแน่น" tone="purple">
      <AtlasSvg label="ความสัมพันธ์P,V,n,Tของแก๊สอุดมคติ พร้อมเงื่อนไขอุณหภูมิเป็นเคลวินและค่าRที่ตรงกับหน่วย">
        <rect x="101" y="55" width="118" height="77" rx="15" fill="#e5eee8"/><Label x={160} y={102} size={27}>PV = nRT</Label>
        <Label x={48} y={33}>P: atm</Label><Label x={268} y={33}>V: L</Label><Label x={48} y={175}>n: mol</Label><Label x={268} y={175}>T: K</Label>
        <AtlasArrow x1={65} y1={45} x2={109} y2={64}/><AtlasArrow x1={253} y1={45} x2={211} y2={64}/><AtlasArrow x1={68} y1={151} x2={109} y2={128}/><AtlasArrow x1={251} y1={151} x2={211} y2={128}/>
      </AtlasSvg>
    </AtlasCard>,
  ];
}

const chapterSpecs: Record<string, { title: string; intro: string; cards: () => ReactNode[] }> = {
  "atomic-structure": { title: "อะตอมหนึ่งภาพ: อ่านเลข นับอนุภาค แยกไอออน", intro: "เทียบเลขอะตอม เลขมวล ไอโซโทป และประจุ โดยดูสิ่งที่เปลี่ยนกับสิ่งที่คงเดิม", cards: AtomicCards },
  "electrons-periodic-table": { title: "อิเล็กตรอนกับตารางธาตุ: จากกล่องสู่แนวโน้ม", intro: "ดูการบันทึกอิเล็กตรอน เวเลนซ์ หมู่ คาบ และทิศทางแนวโน้มที่ต้องอ่านพร้อมข้อยกเว้น", cards: ElectronCards },
  "chemical-bonding": { title: "พันธะและรูปร่าง: แยกแรงให้ถูกระดับ", intro: "เปรียบเทียบการเกิดไอออน การใช้คู่ e⁻ ร่วมกัน รูปร่าง และแรงระหว่างโมเลกุล", cards: BondingCards },
  "why-water-dissolves": { title: "จากขั้วของน้ำ สู่ภาพการละลาย", intro: "เชื่อมด้านบวก–ลบบางส่วนกับทิศของน้ำรอบไอออน และแยกการละลายออกจากการกระจายหยด", cards: SolubilityCards },
  "concentration-is-a-ratio": { title: "ความเข้มข้น: อ่านโมลกับปริมาตรพร้อมกัน", intro: "ใช้ภาพเปรียบเทียบจำนวนตัวละลาย ปริมาตรสุดท้าย การเจือจาง และการแปลงหน่วย", cards: ConcentrationCards },
  "mole-stoichiometry": { title: "โมลและสมการเคมี: นับให้ครบก่อนคำนวณ", intro: "ติดตามอนุภาคผ่านสมการที่ดุลแล้ว เพื่อเชื่อมมวล จำนวนโมล สารกำหนดปริมาณ และผลได้", cards: MoleCards },
  "states-ideal-gas": { title: "อนุภาคและแก๊ส: เปลี่ยนอะไร คงอะไร", intro: "แยกสถานะของสาร และอ่านกฎแก๊สจากตัวแปรที่ถูกตรึงไว้ ก่อนแทนค่าพร้อมหน่วย", cards: GasCards },
};
export function FoundationsAtlas({ articleId }: { articleId: string }) {
  const spec = chapterSpecs[articleId];
  if (!spec) return null;
  return <VisualAtlas title={spec.title} intro={spec.intro} legend="สีและจุดใช้แยกชนิดหรือปริมาณสัมพัทธ์ อ่านป้ายกำกับร่วมด้วย ไม่ใช่สีจริงของอะตอม" note="แผ่นภาพสรุปแนวคิดจากบทนี้ ขนาด ระยะห่าง ปริมาตร และเวลาในภาพไม่ได้ใช้มาตราส่วนจริง สูตรและตัวอย่างใช้ได้ภายใต้เงื่อนไขที่ระบุ">{spec.cards()}</VisualAtlas>;
}
