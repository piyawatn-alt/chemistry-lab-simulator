import catalog from "@/data/molecules/functional-group-catalog.json";
import { AtlasArrow, AtlasCard, AtlasSvg, VisualAtlas, type AtlasTone } from "./atlas-kit";
import { AromaticNaming, CarboxylateComparison, HydrogenBondSketch, NumberedChain, OrganicMotif } from "./organic-structures";

export const organicAtlasIds = ["small-groups-big-difference", "hydrocarbons-nomenclature", "carboxyl-vs-alcohol", "aspirin-two-groups", "paracetamol-chemistry"];
const naming: Record<string,string> = {
  alcohol: "ชื่อหลักใช้คำลงท้าย -ol เช่น ethanol",
  acid: "ชื่อกรดสายเปิดตัวอย่างลงท้าย -oic acid เช่น ethanoic acid",
  ester: "อ่านส่วนแอลคิลก่อน แล้วส่วน alkanoate เช่น ethyl ethanoate",
  amide: "ชื่อหลักตัวอย่างลงท้าย -amide เช่น ethanamide",
  phenol: "phenol เป็นชื่อโครงหลักที่ยอมรับและใช้กันทั่วไป",
  ether: "ชื่อระบบใช้ alkoxy- เป็นคำหน้า เช่น methoxyethane ไม่ใช่คำลงท้าย -oxy",
  aldehyde: "ชื่อหลักตัวอย่างลงท้าย -al เช่น ethanal",
  ketone: "ชื่อหลักใช้ -one พร้อมตำแหน่งเมื่อจำเป็น เช่น propanone",
  amine: "ชื่อหลักตัวอย่างใช้ -amine เช่น methanamine",
  haloalkane: "ใช้คำหน้า fluoro-, chloro-, bromo- หรือ iodo- เช่น chloroethane",
  alkene: "ใช้ -ene ระบุตำแหน่งพันธะคู่ เช่น but-1-ene",
  alkyne: "ใช้ -yne ระบุตำแหน่งพันธะสาม เช่น but-1-yne",
  arene: "benzene เป็นโครงหลักในตัวอย่างนี้ ส่วน phenyl คือหมู่ C₆H₅–",
  nitrile: "ชื่อหลักตัวอย่างใช้ -nitrile เช่น ethanenitrile",
  thiol: "ชื่อหลักตัวอย่างใช้ -thiol เช่น ethanethiol",
};
const shortInsights: Record<string,string> = {
  alcohol: "–OH ต่อกับคาร์บอนอิ่มตัว จึงเป็นแอลกอฮอล์; คาร์บอนที่ถือ –OH อาจต่อคาร์บอนหนึ่ง สอง หรือสามด้านได้",
  acid: "C=O และ –OH อยู่บนคาร์บอนตัวเดียวกัน รวมเป็นหมู่คาร์บอกซิลหนึ่งหมู่",
  ester: "มองหา C(=O)–O–C โดย O ด้านนอกคาร์บอนิลต่อส่วนคาร์บอนอีกด้าน",
  amide: "N ต่อกับคาร์บอนของ C=O โดยตรง ภาพแสดงเอไมด์ปฐมภูมิ; ยังมีชนิด –NHR และ –NR₂",
  phenol: "O ของ –OH ต่อกับคาร์บอนวงอะโรมาติกโดยตรง ถ้ามี CH₂ คั่น จะเป็นแอลกอฮอล์",
  ether: "O เชื่อมส่วนคาร์บอนสองด้านด้วยพันธะเดี่ยว และไม่มีคาร์บอนิลติด O ในหมู่นี้",
  aldehyde: "คาร์บอนของ C=O ต่อ H อย่างน้อยหนึ่งตัว จึงอ่านหมู่ –CHO ได้",
  ketone: "คาร์บอนของ C=O ต่อคาร์บอนทั้งสองด้าน ต้องดูอะตอมข้างคาร์บอนิลด้วย",
  amine: "ภาพเป็นเอมีนปฐมภูมิ R–NH₂; เอมีนทุติยภูมิ R₂NH และตติยภูมิ R₃N มีหมู่คาร์บอนต่อ N สองและสามหมู่",
  haloalkane: "แฮโลเจนต่อกับคาร์บอนอิ่มตัว แยกจากแฮโลแอรีนซึ่ง X ต่อวงอะโรมาติกโดยตรง",
  alkene: "C=C เป็นตำแหน่งไม่อิ่มตัว ส่วนที่แทน R₁–R₄ ในภาพอาจเป็น H หรือหมู่คาร์บอน",
  alkyne: "C≡C มีพันธะสามระหว่างคาร์บอน ถ้าปลายด้านหนึ่งต่อ H จะเป็นแอลไคน์ปลายสาย",
  arene: "วงกลมใช้แทนอิเล็กตรอน π ที่กระจายบนวงเบนซีน ไม่ใช่พันธะเดี่ยวสลับคู่ที่แยกอิสระเหมือนแอลคีน",
  nitrile: "สามเส้นนี้เชื่อม C กับ N จึงเป็นไนไตรล์ ไม่ใช่แอลไคน์ซึ่งเป็น C≡C",
  thiol: "–SH มี S เป็นอะตอมสำคัญ จึงเป็นไทออลและไม่ใช้สมบัติของ –OH แทนตรง ๆ",
};
function toneFor(id: string): AtlasTone {
  return ["amine","amide","nitrile"].includes(id) ? "purple" : ["alkene","alkyne","arene"].includes(id) ? "blue" : id === "haloalkane" || id === "thiol" ? "amber" : "teal";
}
function GroupCard({ id }: { id: string }) {
  const item = catalog.find(group => group.id === id)!;
  return <AtlasCard title={item.name} subtitle={`${item.english} · ${item.category}`} formula={item.formula} example={item.example} insight={`${shortInsights[id]} ${naming[id]}`} caution={item.pitfall} tone={toneFor(id)}><OrganicMotif id={id}/></AtlasCard>;
}
function AlkaneCard() {
  return <AtlasCard title="แอลเคน" subtitle="Alkane · โครงสร้างอ้างอิง" formula="CₙH₂ₙ₊₂" example="อีเทน CH₃–CH₃" insight="ไฮโดรคาร์บอนอิ่มตัวที่มีพันธะเดี่ยว สูตรนี้ใช้กับแอลเคนสายเปิด ชื่อหลักลงท้าย -ane เช่น ethane" caution="แอลเคนไม่ใช่หมู่ฟังก์ชันเฉพาะ; สูตรสายเปิดนี้ไม่ใช้กับไซโคลแอลเคน" tone="blue"><OrganicMotif id="alkane"/></AtlasCard>;
}
function FunctionalPoster() {
  const order = ["alcohol","ether","aldehyde","ketone","acid","ester","amine","amide","phenol","haloalkane","alkene","alkyne","arene","nitrile","thiol"];
  return <VisualAtlas title="แผ่นภาพหมู่ฟังก์ชันและโครงสร้างอินทรีย์" intro="เทียบอะตอมที่เชื่อมติดกัน สูตรทั่วไป ตัวอย่างชื่อ และจุดที่ใช้แยกชนิดสาร" legend="กรอบเส้นประเน้นส่วนที่ใช้สังเกต · R และ R′ แทนส่วนคาร์บอนที่อาจต่างกัน · Ar แทนหมู่อะโรมาติก · อ่านข้อยกเว้นของแต่ละกลุ่มประกอบ" note="แยก 10 หมู่หลักออกจากตัวอย่างพันธะ/โครงสร้าง 3 แบบและกลุ่มเพิ่มเติม 2 แบบ พร้อมแอลเคนเป็นภาพอ้างอิง ไม่ใช่รายชื่อหมู่ฟังก์ชันทั้งหมด กติกาชื่อที่แสดงเป็นเบื้องต้นสำหรับตัวอย่างง่าย สารหลายหมู่ต้องพิจารณาลำดับความสำคัญเพิ่ม" initialCount={6}>
    {order.map(id => <GroupCard key={id} id={id}/>)}<AlkaneCard/>
  </VisualAtlas>;
}
function HydrocarbonPoster() {
  return <VisualAtlas title="อ่านโครงสร้าง แล้วประกอบชื่อสารอินทรีย์" intro="มองชนิดพันธะ เลือกสายหลัก ให้หมายเลข และแยกชื่อของวงออกจากชื่อหมู่แทนที่" note="ตัวอย่างเป็นโครงสร้างสองมิติ ไม่แสดงมุมพันธะจริง สูตร CₙH₂ₙ และ CₙH₂ₙ₋₂ ใช้ตามเงื่อนไขสายเปิดและจำนวนพันธะไม่อิ่มตัวที่ระบุ ไม่ใช้ระบุชนิดสารจากสูตรอย่างเดียว">
    <AtlasCard title="พันธะเดี่ยว คู่ และสาม" subtitle="Saturation and bond order" formula="C–C / C=C / C≡C" example="ethane · ethene · ethyne" insight="เส้นหนึ่ง สอง และสามเส้นแทนพันธะเดี่ยว คู่ และสามตามลำดับ แอลคีนหนึ่งพันธะคู่สายเปิดมีสูตร CₙH₂ₙ ส่วนแอลไคน์หนึ่งพันธะสามสายเปิดมีสูตร CₙH₂ₙ₋₂" caution="ไซโคลแอลเคนก็มีสูตร CₙH₂ₙ ได้ สูตรอย่างเดียวจึงแยกจากแอลคีนไม่ได้" tone="blue"><AtlasSvg label="เปรียบเทียบอีเทน C2H6 เอทีน C2H4 และอีไทน์ C2H2 ด้วยเส้นพันธะหนึ่ง สอง และสามเส้น">{[1,2,3].map((order,i)=><g key={order} transform={`translate(0 ${i*62})`}><text x="35" y="40" fontSize="16" fill="#375b57">{["CH₃","CH₂","CH"][i]}</text>{Array.from({length:order},(_,j)=><line key={j} x1="110" y1={35+(j-(order-1)/2)*5} x2="204" y2={35+(j-(order-1)/2)*5} stroke="#537c6b" strokeWidth="3"/>)}<text x="228" y="40" fontSize="16" fill="#375b57">{["CH₃","CH₂","CH"][i]}</text></g>)}</AtlasSvg></AtlasCard>
    <AtlasCard title="ให้ตำแหน่งพันธะคู่ชัดเจน" subtitle="But-2-ene" formula="CH₃–CH=CH–CH₃" example="but-2-ene: สายหลัก 4 C พันธะคู่เริ่มที่ C-2" insight="เลือกสายหลักที่มีพันธะคู่ แล้วให้หมายเลขตำแหน่งที่เหมาะสม คำว่า but- บอกคาร์บอนสี่ตัว และ -2-ene บอกตำแหน่งพันธะคู่" caution="โครงสร้างแบบย่อนี้ยังไม่ได้กำหนดไอโซเมอร์ E หรือ Z" tone="teal"><NumberedChain/></AtlasCard>
    <AtlasCard title="แยกสายหลักออกจากกิ่ง" subtitle="2-Methylbutane" formula="CH₃–CH(CH₃)–CH₂–CH₃" example="2-methylbutane" insight="สายหลักยาวที่สุดในตัวอย่างมี 4 C จึงเป็น butane ส่วน CH₃ ที่เป็นกิ่งอยู่ตำแหน่ง 2 เป็น methyl" caution="แม้มีคาร์บอนรวม 5 ตัว ก็ไม่เรียก pentane เมื่อการเชื่อมต่อเป็นกิ่งแบบนี้" tone="amber"><NumberedChain branched/></AtlasCard>
    <AtlasCard title="เบนซีนและฟีนิล" subtitle="Benzene ≠ phenyl" formula="C₆H₆ / C₆H₅–" example="methylbenzene มี CH₃ ต่อวงเบนซีน" insight="เบนซีนเป็นสารหนึ่งชนิด ฟีนิลคือหมู่ที่เหลือเมื่อแทน H หนึ่งตำแหน่งด้วยจุดเชื่อมต่อกับส่วนอื่น ไม่ใช่ชื่อเรียกรวมสารอะโรมาติก" caution="วงคาร์บอนทุกวงไม่ได้เป็นอะโรมาติก และ aromatic ไม่ได้หมายถึงมีกลิ่นหอมเสมอ" tone="purple"><AromaticNaming/></AtlasCard>
  </VisualAtlas>;
}
function AcidAlcoholPoster() {
  return <VisualAtlas title="เห็น –OH เหมือนกัน แต่สมบัติต่างกัน" intro="ดูว่าคาร์บอนข้าง O มี C=O หรือไม่ แล้วเชื่อมโครงสร้างกับคู่เบสและแรงระหว่างโมเลกุล" note="สมบัติจริงขึ้นกับโครงสร้างทั้งโมเลกุล ตัวทำละลาย และอุณหภูมิ ภาพเรโซแนนซ์เป็นวิธีเขียนสารชนิดเดียว ไม่ใช่สองสารที่เปลี่ยนกลับไปมา">
    <AtlasCard title="แอลกอฮอล์" subtitle="Alcohol" formula="R–OH" example="เอทานอล CH₃CH₂OH" insight="O–H ต่อกับคาร์บอนอิ่มตัว และไม่เป็นส่วนหนึ่งของหมู่ –COOH ในบริบททั่วไปแอลกอฮอล์เป็นกรดอ่อนกว่ากรดคาร์บอกซิลิก" caution="ชื่อที่ลงท้าย -ol ไม่ได้แปลว่าสมบัติเหมือนกันทุกโมเลกุล"><OrganicMotif id="alcohol"/></AtlasCard>
    <AtlasCard title="กรดคาร์บอกซิลิก" subtitle="Carboxylic acid" formula="R–C(=O)–OH" example="กรดเอทาโนอิก CH₃COOH" insight="–OH เป็นส่วนหนึ่งของหมู่คาร์บอกซิลทั้งชุด จึงไม่แยกเป็นแอลกอฮอล์อีกหมู่" caution="C=O ในกรดคาร์บอกซิลิกก็ไม่ใช่หมู่คีโตน" tone="rose"><OrganicMotif id="acid"/></AtlasCard>
    <AtlasCard title="คู่เบสคาร์บอกซิเลต" subtitle="Resonance-stabilized conjugate base" formula="R–COOH ⇌ R–COO⁻ + H⁺" example="CH₃COOH ให้คู่เบส CH₃COO⁻" insight="ประจุลบกระจายบน O สองตำแหน่งของคาร์บอกซิเลต ช่วยอธิบายว่าทำไมโดยทั่วไปกรดคาร์บอกซิลิกเสียโปรตอนได้ง่ายกว่าแอลกอฮอล์" caution="สมการย่อใช้ H⁺; ในสารละลายน้ำอธิบายการถ่ายโอนโปรตอนไปยังน้ำเป็น H₃O⁺" tone="blue"><CarboxylateComparison/></AtlasCard>
    <AtlasCard title="พันธะไฮโดรเจนและการละลาย" subtitle="Intermolecular interactions" formula="O–H ··· O" example="น้ำจัดแรงยึดเหนี่ยวกับ O ของสารอินทรีย์ได้" insight="O–H เป็นผู้ให้ และ O ที่มีคู่อิเล็กตรอนเหมาะสมเป็นตัวรับของพันธะไฮโดรเจน เส้นประแสดงแรงระหว่างโมเลกุล" caution="ส่วนไฮโดรคาร์บอนที่ยาวขึ้นและการเกิดไอออนมีผลต่อการละลาย จึงดู –OH อย่างเดียวไม่ได้" tone="amber"><HydrogenBondSketch/></AtlasCard>
  </VisualAtlas>;
}
function MoleculeImage({ kind }: { kind: "aspirin" | "paracetamol" }) {
  return <img src={`/diagrams/${kind}.svg`} alt={kind === "aspirin" ? "โครงสร้างจริงของแอสไพริน C9H8O4 พร้อมเน้นหมู่เอสเทอร์และคาร์บอกซิล" : "โครงสร้างจริงของพาราเซตามอล C8H9NO2 พร้อมเน้นหมู่เอไมด์และฟีนอล"} width={740} height={430} loading="lazy"/>;
}
function AspirinHydrolysis() {
  return <AtlasSvg label="ไฮโดรไลซิสเอสเทอร์ของแอสไพรินด้วยน้ำให้กรดซาลิไซลิกและกรดแอซีติก ภายใต้เงื่อนไขเหมาะสม">
    <rect x="17" y="28" width="126" height="55" rx="10" fill="#e4efe7" stroke="#a5c2b0"/><text x="80" y="51" textAnchor="middle" fill="#375b57" fontSize="14">แอสไพริน</text><text x="80" y="72" textAnchor="middle" fill="#375b57" fontSize="15">C₉H₈O₄</text>
    <text x="211" y="62" textAnchor="middle" fill="#8d4f38" fontSize="16">+ H₂O</text><AtlasArrow x1={80} y1={91} x2={80} y2={120}/>
    <rect x="17" y="129" width="136" height="55" rx="10" fill="#f6ebe4" stroke="#d7b599"/><text x="85" y="151" textAnchor="middle" fill="#375b57" fontSize="13">กรดซาลิไซลิก</text><text x="85" y="173" textAnchor="middle" fill="#375b57" fontSize="15">C₇H₆O₃</text>
    <text x="168" y="160" textAnchor="middle" fill="#375b57" fontSize="20">+</text><rect x="184" y="129" width="122" height="55" rx="10" fill="#e9eef5" stroke="#afc2d5"/><text x="245" y="151" textAnchor="middle" fill="#375b57" fontSize="13">กรดแอซีติก</text><text x="245" y="173" textAnchor="middle" fill="#375b57" fontSize="15">C₂H₄O₂</text>
    <text x="197" y="107" textAnchor="middle" fill="#48695f" fontSize="13">น้ำเข้าร่วมปฏิกิริยา</text>
  </AtlasSvg>;
}
function AspirinPoster() {
  return <VisualAtlas title="อ่านโครงสร้างแอสไพรินทีละส่วน" intro="ตัวอย่างสารอินทรีย์หนึ่งโมเลกุลที่มีหลายหมู่ โดยอ่านการเชื่อมต่อจริงแทนการนับจำนวน O" note="โครงสร้างทั้งโมเลกุลสร้างจากข้อมูล SMILES และตรวจสูตรด้วย RDKit เทียบอ้างอิง PubChem ในบท ภาพหมู่ทั่วไปเป็นภาพขยายแนวคิด ไม่ใช่การเปลี่ยนโครงสร้างแอสไพริน การไฮโดรไลซิสขึ้นกับเงื่อนไข ไม่ใช้อนุมานอายุผลิตภัณฑ์">
    <AtlasCard title="โครงสร้างทั้งโมเลกุล" subtitle="Acetylsalicylic acid" formula="C₉H₈O₄" example="แอสไพรินมี 1 เอสเทอร์ และ 1 คาร์บอกซิล" insight="เริ่มจากวงเบนซีน แล้วดูหมู่ที่ยื่นออกมา สีแยกหมู่ช่วยติดตาม O ทั้งสี่อะตอม แต่ต้องอ่านพันธะประกอบ" caution="สูตรโมเลกุลอย่างเดียวไม่ระบุตำแหน่งหรือการเชื่อมต่อทั้งหมด"><MoleculeImage kind="aspirin"/></AtlasCard>
    <AtlasCard title="ส่วนเอสเทอร์" subtitle="Ester motif" formula="R–C(=O)–O–Ar" example="C=O ต่อ O ซึ่งต่อกับคาร์บอนของวง" insight="แอสไพรินมีเอสเทอร์ที่เชื่อมหมู่อะเซทิลกับ O บนวงอะโรมาติก จึงไม่มี –OH ฟีนอลอิสระที่ตำแหน่งนี้" caution="ภาพขยายเป็นสูตรทั่วไป R–C(=O)–O–R′; ในแอสไพริน R′ เป็นส่วนอะโรมาติก" tone="amber"><OrganicMotif id="ester"/></AtlasCard>
    <AtlasCard title="ส่วนคาร์บอกซิล" subtitle="Carboxyl motif" formula="Ar–C(=O)–OH" example="–COOH ต่อกับวงเบนซีน" insight="O–H นี้อยู่ในหมู่คาร์บอกซิลและให้คู่เบสคาร์บอกซิเลตได้ ไม่ใช่หมู่แอลกอฮอล์หรือฟีนอล" caution="การเกิดไอออนขึ้นกับ pH และเงื่อนไข ไม่ใช่ว่า –COOH ทุกโมเลกุลแตกตัวทั้งหมดเสมอ" tone="rose"><OrganicMotif id="acid"/></AtlasCard>
    <AtlasCard title="การไฮโดรไลซ์ส่วนเอสเทอร์" subtitle="Chemical transformation" formula="C₉H₈O₄ + H₂O → C₇H₆O₃ + C₂H₄O₂" example="กรดซาลิไซลิก + กรดแอซีติก" insight="น้ำเข้าร่วมปฏิกิริยาที่พันธะเอสเทอร์และได้ผลิตภัณฑ์ที่มีโครงสร้างต่างจากเดิม" caution="สมการสรุปผลิตภัณฑ์ ไม่บอกอัตรา เวลา หรือเงื่อนไขการเก็บรักษาโดยลำพัง" tone="blue"><AspirinHydrolysis/></AtlasCard>
  </VisualAtlas>;
}
function ParacetamolPoster() {
  return <VisualAtlas title="เอไมด์และฟีนอลในพาราเซตามอล" intro="ตามหาว่า N ต่อกับอะไร และ –OH ต่อกับวงโดยตรงหรือไม่ เพื่อแยกหมู่ที่หน้าตาคล้ายกัน" note="โครงสร้างทั้งโมเลกุลตรวจสูตร C₈H₉NO₂ และหมู่กับข้อมูลอ้างอิง PubChem ผ่านชุดข้อมูลภาพของโครงการ ภาพขยายหมู่ทั่วไปไม่แสดงทุกส่วนของโมเลกุล สมบัติทั้งสารต้องพิจารณาโครงสร้างและสภาวะร่วมกัน">
    <AtlasCard title="โครงสร้างทั้งโมเลกุล" subtitle="Paracetamol / acetaminophen" formula="C₈H₉NO₂" example="มีเอไมด์ 1 หมู่และฟีนอล 1 หมู่" insight="–OH ต่อวงเบนซีนโดยตรง ส่วน N ต่อกับคาร์บอนของ C=O โดยตรง จึงจัดเป็นฟีนอลกับเอไมด์" caution="ไม่เรียกส่วน N นี้เป็นเอมีนแยกอีกหมู่เพียงเพราะพบ N"><MoleculeImage kind="paracetamol"/></AtlasCard>
    <AtlasCard title="เอไมด์ที่มี N–H" subtitle="Secondary amide in this molecule" formula="CH₃–C(=O)–NH–Ar" example="N ต่อคาร์บอนิล วงอะโรมาติก และ H" insight="พาราเซตามอลมีเอไมด์ทุติยภูมิ: N ต่อ H หนึ่งตัวและวงอะโรมาติกอีกด้าน โดยยังต่อกับคาร์บอนิลโดยตรง" caution="เอไมด์ไม่ใช่เอมีนทั่วไป เพราะคู่อิเล็กตรอนของ N เกี่ยวข้องกับระบบคาร์บอนิล" tone="purple"><OrganicMotif id="amide-secondary"/></AtlasCard>
    <AtlasCard title="ฟีนอล" subtitle="Phenolic hydroxyl" formula="Ar–OH" example="–OH ต่อคาร์บอนวงโดยตรง" insight="ไม่มี CH₂ คั่นระหว่างวงกับ O จึงเป็นฟีนอล ไม่ใช่แอลกอฮอล์แบบเบนซิลแอลกอฮอล์" caution="การมี –OH ไม่ได้ทำให้สารทุกตัวละลายน้ำได้เท่ากัน" tone="rose"><OrganicMotif id="phenol"/></AtlasCard>
    <AtlasCard title="แยกผู้ให้และตัวรับ H-bond" subtitle="Hydrogen-bond roles" formula="O–H ··· O=C" example="น้ำให้ H-bond ไปยัง O ของคาร์บอนิล" insight="O ของเอไมด์รับพันธะไฮโดรเจนได้ ส่วน N–H ของเอไมด์เป็นผู้ให้ได้ N ของเอไมด์ทั่วไปไม่ใช่ตัวรับที่ดี" caution="การนับผู้ให้/ตัวรับอย่างเดียวไม่ทำนายการละลายของสารทั้งโมเลกุลได้ครบ" tone="blue"><HydrogenBondSketch carbonyl/></AtlasCard>
  </VisualAtlas>;
}
export function OrganicAtlas({ articleId }: { articleId: string }) {
  if (articleId === "small-groups-big-difference") return <FunctionalPoster/>;
  if (articleId === "hydrocarbons-nomenclature") return <HydrocarbonPoster/>;
  if (articleId === "carboxyl-vs-alcohol") return <AcidAlcoholPoster/>;
  if (articleId === "aspirin-two-groups") return <AspirinPoster/>;
  if (articleId === "paracetamol-chemistry") return <ParacetamolPoster/>;
  return null;
}
