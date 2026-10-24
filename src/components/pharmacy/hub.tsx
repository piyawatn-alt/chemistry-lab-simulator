import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  FlaskConical,
  NotebookPen,
  BookOpen,
} from "lucide-react";
export function PharmacyHub() {
  return (
    <div className="pharmacy-hub">
      <section className="pharma-hero">
        <div>
          <span className="journal-kicker">
            CHEMLAB RX · FROM CHEMISTRY TO PHARMACY
          </span>
          <h1>
            เข้าใจเคมี
            <br />
            <em>มองเห็นเภสัชศาสตร์</em>
          </h1>
          <p>
            อ่านโครงสร้าง ทดลองเปลี่ยนตัวแปร และอธิบายผลด้วยหลักฐาน
            พื้นที่เรียนรู้ด้วยตนเองที่เชื่อมเคมี
            ม.ปลายกับคำอธิบายระดับโมเลกุลของสารยา
          </p>
          <div className="pharma-actions">
            <Link className="journal-button" href="/tools/ionization">
              เปิดห้องทดลอง pH <ArrowRight size={17} />
            </Link>
            <Link href="/journal">
              สมุดการเรียนรู้ของฉัน <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="pharma-orbit" aria-hidden="true">
          <span>CHEMISTRY</span>
          <div>
            <Atom size={84} strokeWidth={0.8} />
          </div>
          <strong>โครงสร้าง → สมบัติ → หลักฐาน</strong>
          <i>OBSERVE · EXPLAIN · REFLECT</i>
        </div>
      </section>
      <section className="pharma-three">
        <article>
          <Atom />
          <span>01 / STRUCTURE</span>
          <h2>ดูให้เห็นการเชื่อมต่อ</h2>
          <p>
            เริ่มจากอะตอมและหมู่ฟังก์ชัน
            แยกสิ่งที่เหมือนกันออกจากสิ่งที่ทำให้สมบัติต่างกัน
          </p>
        </article>
        <article>
          <FlaskConical />
          <span>02 / EXPERIMENT</span>
          <h2>เปลี่ยนทีละตัวแปร</h2>
          <p>
            ลองสมมติฐานกับแบบจำลอง เปรียบเทียบเงื่อนไข
            และเก็บค่าที่สังเกตได้จริงในหน้าจอ
          </p>
        </article>
        <article>
          <NotebookPen />
          <span>03 / REFLECTION</span>
          <h2>อธิบายด้วยคำของตัวเอง</h2>
          <p>
            เขียนเหตุผล ข้อจำกัด และคำถามที่จะศึกษาต่อ
            แล้วส่งออกเป็นหลักฐานการเรียนรู้ของคุณ
          </p>
        </article>
      </section>
      <section className="pharma-case-section">
        <div className="pharma-section-title">
          <span className="journal-kicker">MOLECULES WITH A CONTEXT</span>
          <h2>
            สองโมเลกุลที่คุ้นชื่อ
            <br />
            ต่างกันที่การเชื่อมต่อ
          </h2>
          <p>
            ตัวอย่างเพื่อศึกษาโครงสร้างและสมบัติทางเคมี
            ไม่ใช้เปรียบเทียบว่ายาใดเหมาะกับผู้ป่วยมากกว่า
          </p>
        </div>
        <div className="pharma-drug-grid">
          {[
            {
              id: "aspirin",
              name: "แอสไพริน",
              english: "Acetylsalicylic acid",
              formula: "C₉H₈O₄",
              cid: "2244",
              groups: "เอสเทอร์ + คาร์บอกซิล",
              text: "มีคาร์บอกซิลอิสระและเอสเทอร์ การไฮโดรไลซิสของเอสเทอร์ให้กรดซาลิไซลิกและกรดแอซีติกภายใต้เงื่อนไขที่เหมาะสม",
              link: "aspirin-two-groups",
            },
            {
              id: "paracetamol",
              name: "พาราเซตามอล",
              english: "Acetaminophen",
              formula: "C₈H₉NO₂",
              cid: "1983",
              groups: "เอไมด์ + ฟีนอล",
              text: "N ต่อคาร์บอนิลโดยตรงจึงเป็นเอไมด์ ส่วน –OH ต่อวงอะโรมาติกโดยตรงจึงเป็นฟีนอล ไม่จัดเป็นเอมีนและแอลกอฮอล์ทั่วไป",
              link: "paracetamol-chemistry",
            },
          ].map((d) => (
            <article className="pharma-drug" key={d.id}>
              <div>
                <span>{d.english}</span>
                <h3>{d.name}</h3>
                <strong>{d.formula}</strong>
              </div>
              <img
                src={`/diagrams/${d.id}.svg`}
                alt={`โครงสร้าง ${d.name} เน้น${d.groups}`}
                width="760"
                height="400"
              />
              <div>
                <span className="pharma-group-tag">{d.groups}</span>
                <p>{d.text}</p>
                <Link href={`/read/${d.link}`}>
                  อ่านโครงสร้างอย่างละเอียด <ArrowRight size={16} />
                </Link>
                <a
                  className="pharma-source"
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${d.cid}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ข้อมูลสารอ้างอิง · PubChem CID {d.cid} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="pharma-compare-note">
          <strong>สิ่งที่เหมือนกัน</strong>
          <p>
            ทั้งสองมีวงอะโรมาติกและ C=O แต่บริบทการเชื่อมต่อทำให้จัดหมู่ต่างกัน
            การมีคาร์บอนิลไม่แปลว่าเป็นคีโตนเสมอไป และการมี –OH
            ไม่แปลว่าเป็นแอลกอฮอล์เสมอไป
          </p>
        </div>
      </section>
      <section className="pharma-feature">
        <div>
          <span className="journal-kicker">SIGNATURE EXPERIMENT</span>
          <h2>
            จาก pH สู่รูปประจุ
            <br />
            และการละลาย
          </h2>
          <p>
            ปรับ pH และ pKa ดูกราฟกรดอ่อน–เบสอ่อนคู่กัน ส่งออกข้อมูล CSV
            และเก็บเงื่อนไขไว้เปรียบเทียบ
            โดยแยกข้อสรุปที่แบบจำลองรองรับออกจากเรื่องที่ยังบอกไม่ได้
          </p>
          <Link className="journal-button" href="/tools/ionization">
            เริ่มสำรวจแบบจำลอง <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="pharma-feature-visual" aria-hidden="true">
          <b>HA ⇌ H⁺ + A⁻</b>
          <div>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <span>pH = pKa</span>
          <strong>50% : 50%</strong>
          <small>รูปไอออน : รูปเป็นกลาง</small>
        </div>
      </section>
      <section className="pharma-case-section">
        <div className="pharma-section-title">
          <span className="journal-kicker">EXPLORE IN YOUR OWN ORDER</span>
          <h2>เลือกประเด็นที่อยากศึกษา</h2>
        </div>
        <div className="pharma-pathways">
          <Link href="/explorer">
            <Atom />
            <div>
              <span>โครงสร้างและแรงระหว่างโมเลกุล</span>
              <h3>หมู่ฟังก์ชันกับสมบัติของสาร</h3>
              <p>
                สำรวจ 15 ตัวอย่าง แยกการให้และรับพันธะไฮโดรเจน
                พร้อมข้อยกเว้นของแต่ละหมู่
              </p>
            </div>
            <ArrowUpRight />
          </Link>
          <Link href="/tools/ionization">
            <FlaskConical />
            <div>
              <span>สมดุลกรด–เบสและการละลาย</span>
              <h3>กรดอ่อนกับเบสอ่อนที่ pH เดียวกัน</h3>
              <p>
                บันทึกสองเงื่อนไข
                แล้วอธิบายว่าทำไมแนวโน้มการเกิดไอออนจึงสวนทางกัน
              </p>
            </div>
            <ArrowUpRight />
          </Link>
          <Link href="/read/why-reactions-slow-down">
            <BookOpen />
            <div>
              <span>ความคงตัวและแบบจำลอง</span>
              <h3>อุณหภูมิ เวลา และขอบเขตการทำนาย</h3>
              <p>
                ศึกษาจลนศาสตร์อันดับหนึ่ง
                โดยไม่อนุมานวันหมดอายุของผลิตภัณฑ์จริงจากกราฟสมมติ
              </p>
            </div>
            <ArrowUpRight />
          </Link>
        </div>
      </section>
      <section className="pharma-evidence">
        <NotebookPen size={32} />
        <div>
          <span className="journal-kicker">YOUR LEARNING, WITH EVIDENCE</span>
          <h2>ให้ผลงานเล่าได้มากกว่าหน้าตาเว็บ</h2>
          <p>
            เก็บเงื่อนไขที่ทดลอง สิ่งที่คาด สิ่งที่พบ เหตุผล และข้อจำกัด
            พร้อมระบุส่วนที่คุณพัฒนาหรือปรับปรุงจริงและเครื่องมือที่ใช้
            บันทึกเริ่มต้นว่างและเติมจากการทำงานของคุณเอง
          </p>
          <Link className="journal-button" href="/journal">
            เปิดสมุดการเรียนรู้ <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
