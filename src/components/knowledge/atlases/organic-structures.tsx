import { AtlasSvg, AtlasArrow } from "./atlas-kit";

const palette = { carbon: "#375b57", oxygen: "#b96345", nitrogen: "#527da4", sulfur: "#9a7b2b", group: "#6f8087", hydrogen: "#74898b" };
function Atom({ x, y, text, type = "carbon", r = 20 }: { x: number; y: number; text: string; type?: keyof typeof palette; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={palette[type]} /><text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={text.length > 2 ? 13 : 17} fill="white">{text}</text></g>;
}
function Bond({ x1, y1, x2, y2, order = 1 }: { x1: number; y1: number; x2: number; y2: number; order?: number }) {
  const length = Math.hypot(x2 - x1, y2 - y1), dx = -(y2-y1)/length*4, dy=(x2-x1)/length*4;
  const offsets = order === 3 ? [-1.4, 0, 1.4] : order === 2 ? [-.8,.8] : [0];
  return <g stroke="#6c8580" strokeWidth="3" strokeLinecap="round">{offsets.map(n => <line key={n} x1={x1+n*dx} y1={y1+n*dy} x2={x2+n*dx} y2={y2+n*dy}/>)}</g>;
}
function Focus({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return <rect x={x} y={y} width={width} height={height} rx="15" stroke="#b96345" strokeWidth="2" strokeDasharray="5 4" fill="#b9634509"/>;
}
function Ring({ cx = 115, cy = 104, radius = 49 }: { cx?: number; cy?: number; radius?: number }) {
  const points = Array.from({length:6},(_,i)=>[cx+radius*Math.cos(i*Math.PI/3),cy+radius*Math.sin(i*Math.PI/3)]);
  return <g><polygon points={points.map(p=>p.join(",")).join(" ")} fill="none" stroke="#375b57" strokeWidth="4"/><circle cx={cx} cy={cy} r={radius*.58} stroke="#375b57" strokeWidth="2.5" fill="none"/></g>;
}
function Carbonyl({ right }: { right: "H" | "R′" | "OH" | "OR′" | "NH₂" | "NHAr" }) {
  return <>
    <Bond x1={59} y1={118} x2={140} y2={118}/><Bond x1={140} y1={118} x2={140} y2={47} order={2}/><Bond x1={140} y1={118} x2={220} y2={118}/>
    {(right === "OH" || right === "OR′") && <Bond x1={220} y1={118} x2={282} y2={118}/>}
    {(right === "NH₂" || right === "NHAr") && <><Bond x1={220} y1={118} x2={267} y2={64}/><Bond x1={220} y1={118} x2={267} y2={166}/></>}
    <Atom x={59} y={118} text="R" type="group"/><Atom x={140} y={118} text="C"/><Atom x={140} y={47} text="O" type="oxygen"/>
    {right === "H" || right === "R′" ? <Atom x={220} y={118} text={right} type={right === "H" ? "hydrogen" : "group"}/> : right === "NH₂" || right === "NHAr" ? <><Atom x={220} y={118} text="N" type="nitrogen"/><Atom x={267} y={64} text="H" type="hydrogen" r={16}/><Atom x={267} y={166} text={right === "NHAr" ? "Ar" : "H"} type={right === "NHAr" ? "group" : "hydrogen"} r={16}/></> : <><Atom x={220} y={118} text="O" type="oxygen"/><Atom x={282} y={118} text={right === "OH" ? "H" : "R′"} type={right === "OH" ? "hydrogen" : "group"}/></>}
  </>;
}
export function OrganicMotif({ id }: { id: string }) {
  const names: Record<string,string> = {
    alcohol:"แอลกอฮอล์: O–H ต่อกับคาร์บอนอิ่มตัว", acid:"คาร์บอกซิล: คาร์บอนเดียวกันต่อ O ด้วยพันธะคู่และ OH", ester:"เอสเทอร์: C(=O) ต่อ O ซึ่งต่อคาร์บอนอีกด้าน", amide:"เอไมด์ปฐมภูมิ: C(=O) ต่อ N โดยตรง", "amide-secondary":"เอไมด์ทุติยภูมิ: C(=O) ต่อ N ซึ่งต่อ H และหมู่อะโรมาติก", phenol:"ฟีนอล: OH ต่อวงเบนซีนโดยตรง", ether:"อีเทอร์: O ต่อ R สองด้าน ไม่มีคาร์บอนิลข้าง O", aldehyde:"แอลดีไฮด์: คาร์บอนิลต่อ H", ketone:"คีโตน: คาร์บอนิลต่อคาร์บอนสองด้าน", amine:"เอมีนปฐมภูมิ: N ต่อ R หนึ่งหมู่และ H สองตัว", haloalkane:"แฮโลแอลเคน: X ต่อคาร์บอนอิ่มตัว", alkene:"แอลคีน: C=C และหมู่แทนที่สี่ตำแหน่ง", alkyne:"แอลไคน์: C สามพันธะ C", arene:"วงเบนซีนแสดงการกระจายอิเล็กตรอนด้วยวงกลม", nitrile:"ไนไตรล์: R–C สามพันธะ N", thiol:"ไทออล: R–S–H", alkane:"แอลเคน: ตัวอย่างส่วนสายโซ่ที่มีพันธะเดี่ยว C–C"
  };
  return <AtlasSvg label={names[id] || id}>
    {id === "alcohol" || id === "thiol" ? <>
      <Focus x={166} y={64} width={129} height={72}/><Bond x1={48} y1={100} x2={120} y2={100}/><Bond x1={120} y1={100} x2={196} y2={100}/><Bond x1={196} y1={100} x2={268} y2={100}/>
      <Atom x={48} y={100} text="R" type="group"/><Atom x={120} y={100} text="CH₂"/><Atom x={196} y={100} text={id === "alcohol" ? "O" : "S"} type={id === "alcohol" ? "oxygen" : "sulfur"}/><Atom x={268} y={100} text="H" type="hydrogen"/>
      <text x="160" y="169" textAnchor="middle" fill="#48695f" fontSize="13">ตัวอย่างหนึ่งรูปแบบของหมู่นี้</text>
    </> : id === "ether" ? <>
      <Focus x={119} y={62} width={82} height={76}/><Bond x1={65} y1={100} x2={160} y2={100}/><Bond x1={160} y1={100} x2={255} y2={100}/>
      <Atom x={65} y={100} text="R" type="group"/><Atom x={160} y={100} text="O" type="oxygen"/><Atom x={255} y={100} text="R′" type="group"/><text x="160" y="168" textAnchor="middle" fill="#48695f" fontSize="13">ไม่มี C=O ติดกับ O</text>
    </> : ["acid","ester","aldehyde","ketone","amide","amide-secondary"].includes(id) ? <>
      <Focus x={108} y={18} width={id === "ketone" ? 65 : id.startsWith("amide") ? 183 : 143} height={id.startsWith("amide") ? 171 : 134}/>
      <Carbonyl right={id === "acid" ? "OH" : id === "ester" ? "OR′" : id === "amide" ? "NH₂" : id === "amide-secondary" ? "NHAr" : id === "aldehyde" ? "H" : "R′"}/>
      {!id.startsWith("amide") && <text x="160" y="181" textAnchor="middle" fill="#48695f" fontSize="13">ดูอะตอมที่ต่อคาร์บอนิลโดยตรง</text>}
    </> : id === "phenol" ? <>
      <Ring/><Focus x={200} y={67} width={108} height={74}/><Bond x1={164} y1={104} x2={230} y2={104}/><Bond x1={230} y1={104} x2={286} y2={104}/><Atom x={230} y={104} text="O" type="oxygen"/><Atom x={286} y={104} text="H" type="hydrogen"/><text x="160" y="181" textAnchor="middle" fill="#48695f" fontSize="13">วงอะโรมาติกต่อ O โดยตรง</text>
    </> : id === "amine" ? <>
      <Focus x={126} y={31} width={147} height={141}/><Bond x1={63} y1={100} x2={161} y2={100}/><Bond x1={161} y1={100} x2={239} y2={57}/><Bond x1={161} y1={100} x2={239} y2={145}/><Atom x={63} y={100} text="R" type="group"/><Atom x={161} y={100} text="N" type="nitrogen"/><Atom x={239} y={57} text="H" type="hydrogen"/><Atom x={239} y={145} text="H" type="hydrogen"/><circle cx="156" cy="64" r="2.7" fill="#527da4"/><circle cx="165" cy="64" r="2.7" fill="#527da4"/>
      <text x="160" y="188" textAnchor="middle" fill="#48695f" fontSize="13">ตัวอย่างเอมีนปฐมภูมิ</text>
    </> : id === "haloalkane" ? <>
      <Focus x={184} y={65} width={80} height={75}/><Bond x1={52} y1={103} x2={139} y2={103}/><Bond x1={139} y1={103} x2={226} y2={103}/><Atom x={52} y={103} text="R" type="group"/><Atom x={139} y={103} text="CH₂"/><Atom x={226} y={103} text="X" type="sulfur"/><text x="160" y="174" textAnchor="middle" fill="#48695f" fontSize="14">X = F, Cl, Br หรือ I</text>
    </> : id === "alkene" ? <>
      <Focus x={91} y={75} width={137} height={63}/><Bond x1={118} y1={107} x2={201} y2={107} order={2}/><Bond x1={118} y1={107} x2={53} y2={48}/><Bond x1={118} y1={107} x2={53} y2={164}/><Bond x1={201} y1={107} x2={266} y2={48}/><Bond x1={201} y1={107} x2={266} y2={164}/><Atom x={118} y={107} text="C"/><Atom x={201} y={107} text="C"/>{[[53,48,"R₁"],[53,164,"R₂"],[266,48,"R₃"],[266,164,"R₄"]].map(([x,y,t])=><Atom key={String(t)} x={Number(x)} y={Number(y)} text={String(t)} type="group" r={19}/>) }
    </> : id === "alkyne" || id === "nitrile" ? <>
      <Focus x={id === "alkyne" ? 98 : 120} y={65} width={id === "alkyne" ? 128 : 151} height={75}/><Bond x1={48} y1={104} x2={124} y2={104}/><Bond x1={124} y1={104} x2={205} y2={104} order={3}/>{id === "alkyne" && <Bond x1={205} y1={104} x2={281} y2={104}/>}
      <Atom x={48} y={104} text="R" type="group"/><Atom x={124} y={104} text="C"/><Atom x={205} y={104} text={id === "nitrile" ? "N" : "C"} type={id === "nitrile" ? "nitrogen" : "carbon"}/>{id === "alkyne" && <Atom x={281} y={104} text="R′" type="group"/>}<text x="160" y="176" textAnchor="middle" fill="#48695f" fontSize="13">สามเส้น = พันธะสาม</text>
    </> : id === "arene" ? <>
      <Focus x={85} y={24} width={150} height={153}/><Ring cx={160} cy={101} radius={58}/><text x="160" y="194" textAnchor="middle" fill="#48695f" fontSize="13">วงกลมแทนอิเล็กตรอน π กระจายบนวง</text>
    </> : id === "alkane" ? <>
      <Bond x1={110} y1={100} x2={208} y2={100}/><Bond x1={110} y1={100} x2={44} y2={100}/><Bond x1={208} y1={100} x2={274} y2={100}/><Bond x1={110} y1={100} x2={110} y2={40}/><Bond x1={110} y1={100} x2={110} y2={161}/><Bond x1={208} y1={100} x2={208} y2={40}/><Bond x1={208} y1={100} x2={208} y2={161}/><Focus x={81} y={67} width={157} height={66}/><Atom x={110} y={100} text="C"/><Atom x={208} y={100} text="C"/>{[[44,100,"R"],[274,100,"R′"],[110,40,"H"],[110,161,"H"],[208,40,"H"],[208,161,"H"]].map(([x,y,t],i)=><Atom key={i} x={Number(x)} y={Number(y)} text={String(t)} type={String(t).startsWith("R") ? "group" : "hydrogen"} r={17}/>) }
    </> : null}
  </AtlasSvg>;
}
export function NumberedChain({ branched = false }: { branched?: boolean }) {
  const positions = [38,117,196,275];
  return <AtlasSvg label={branched ? "สายหลักสี่คาร์บอน มีหมู่เมทิลที่คาร์บอนสอง จึงเป็น 2-methylbutane" : "สายหลักสี่คาร์บอน มีพันธะคู่ระหว่างคาร์บอนสองกับสาม จึงเป็น but-2-ene"}>
    <Bond x1={38} y1={113} x2={117} y2={113}/><Bond x1={117} y1={113} x2={196} y2={113} order={branched ? 1 : 2}/><Bond x1={196} y1={113} x2={275} y2={113}/>
    {branched && <><Bond x1={117} y1={113} x2={117} y2={44}/><Atom x={117} y={44} text="CH₃"/></>}
    {positions.map((x,i)=><g key={x}><Atom x={x} y={113} text={i===0||i===3 ? "CH₃" : branched ? (i===1 ? "CH" : "CH₂") : "CH"}/><text x={x} y={158} textAnchor="middle" fontSize="14" fill="#8d4f38">{i+1}</text></g>)}
    <AtlasArrow x1={36} y1={180} x2={277} y2={180}/>
  </AtlasSvg>;
}
export function CarboxylateComparison() {
  return <AtlasSvg label="คาร์บอกซิเลตเขียนเป็นโครงสร้างเรโซแนนซ์สองรูป ประจุลบกระจายบนออกซิเจนทั้งสอง ไม่ใช่ไอออนสลับไปมาสองชนิด">
    {[false,true].map((swap,i)=>{ const x=75+i*170; return <g key={x}><Bond x1={x-44} y1={109} x2={x} y2={109}/><Bond x1={x} y1={109} x2={x} y2={46} order={swap ? 1 : 2}/><Bond x1={x} y1={109} x2={x+44} y2={151} order={swap ? 2 : 1}/><Atom x={x-44} y={109} text="R" type="group" r={16}/><Atom x={x} y={109} text="C" r={18}/><Atom x={x} y={46} text={swap ? "O⁻" : "O"} type="oxygen" r={19}/><Atom x={x+44} y={151} text={swap ? "O" : "O⁻"} type="oxygen" r={19}/></g>})}
    <text x="161" y="109" textAnchor="middle" fill="#375b57" fontSize="30">↔</text><text x="160" y="191" textAnchor="middle" fill="#48695f" fontSize="13">รูปเขียนเรโซแนนซ์ ไม่ใช่สมดุลสองชนิด</text>
  </AtlasSvg>;
}
export function HydrogenBondSketch({ carbonyl = false }: { carbonyl?: boolean }) {
  if (carbonyl) return <AtlasSvg label="น้ำให้พันธะไฮโดรเจนจาก O-H ไปยัง O ของคาร์บอนิลในเอไมด์ R-C(=O)-NH-Ar; N ของเอไมด์ไม่ใช้เป็นตัวรับในภาพนี้">
    <Bond x1={35} y1={53} x2={75} y2={85}/><Bond x1={75} y1={85} x2={116} y2={85}/>
    <Bond x1={190} y1={85} x2={244} y2={85} order={2}/><Bond x1={244} y1={85} x2={300} y2={85}/><Bond x1={244} y1={85} x2={244} y2={145}/><Bond x1={300} y1={85} x2={300} y2={30}/><Bond x1={300} y1={85} x2={300} y2={145}/>
    <Atom x={35} y={53} text="H" type="hydrogen" r={16}/><Atom x={75} y={85} text="O" type="oxygen" r={19}/><Atom x={116} y={85} text="H" type="hydrogen" r={16}/><Atom x={190} y={85} text="O" type="oxygen" r={19}/><Atom x={244} y={85} text="C" r={19}/><Atom x={300} y={85} text="N" type="nitrogen" r={17}/><Atom x={244} y={145} text="R" type="group" r={17}/><Atom x={300} y={30} text="Ar" type="group" r={17}/><Atom x={300} y={145} text="H" type="hydrogen" r={16}/>
    <line x1="134" y1="85" x2="168" y2="85" stroke="#a5754b" strokeWidth="2.5" strokeDasharray="4 4"/>
    <text x="82" y="145" textAnchor="middle" fill="#48695f" fontSize="13">ผู้ให้ O–H</text><text x="186" y="39" textAnchor="middle" fill="#48695f" fontSize="13">O เป็นตัวรับ</text><text x="155" y="67" textAnchor="middle" fill="#9b6840" fontSize="13">H-bond</text><text x="160" y="191" textAnchor="middle" fill="#48695f" fontSize="13">เส้นประคือแรงระหว่างโมเลกุล</text>
  </AtlasSvg>;
  return <AtlasSvg label="O-H ของน้ำเป็นผู้ให้พันธะไฮโดรเจน และ O ของแอลกอฮอล์เป็นตัวรับ เส้นประเป็นแรงระหว่างโมเลกุล">
    <Bond x1={40} y1={95} x2={97} y2={95}/><Bond x1={97} y1={95} x2={149} y2={95}/><Bond x1={236} y1={95} x2={285} y2={130}/><Bond x1={236} y1={95} x2={273} y2={45}/>
    <Atom x={40} y={95} text="H" type="hydrogen" r={17}/><Atom x={97} y={95} text="O" type="oxygen"/><Atom x={149} y={95} text="H" type="hydrogen" r={17}/><Atom x={236} y={95} text="O" type="oxygen"/><Atom x={285} y={130} text="R" type="group" r={18}/><Atom x={273} y={45} text="H" type="hydrogen" r={17}/>
    <line x1="169" y1="95" x2="215" y2="95" stroke="#a5754b" strokeWidth="2.5" strokeDasharray="5 4"/>
    <text x="98" y="159" textAnchor="middle" fill="#48695f" fontSize="13">ผู้ให้ O–H</text><text x="235" y="29" textAnchor="middle" fill="#48695f" fontSize="13">O เป็นตัวรับ</text><text x="191" y="78" textAnchor="middle" fill="#9b6840" fontSize="13">H-bond</text>
  </AtlasSvg>;
}
export function AromaticNaming() {
  return <AtlasSvg label="เบนซีนมีสูตร C6H6 เมื่อตัด H หนึ่งตำแหน่งเพื่อเป็นหมู่แทนที่ จึงเป็นฟีนิล C6H5 ไม่ใช่ชื่อของสารอะโรมาติกทุกชนิด">
    <Ring cx={77} cy={88} radius={46}/><Ring cx={240} cy={88} radius={46}/><Bond x1={286} y1={88} x2={313} y2={88}/><text x="77" y="164" textAnchor="middle" fill="#375b57" fontSize="15">benzene: C₆H₆</text><text x="240" y="164" textAnchor="middle" fill="#375b57" fontSize="15">phenyl: C₆H₅–</text><text x="159" y="91" textAnchor="middle" fill="#6c8580" fontSize="19">→</text><text x="160" y="190" textAnchor="middle" fill="#48695f" fontSize="13">ฟีนิลเป็นหมู่แทนที่ที่ยึดกับส่วนอื่น</text>
  </AtlasSvg>;
}
