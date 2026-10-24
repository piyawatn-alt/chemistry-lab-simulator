import Link from "next/link";
import { ArrowUpRight, Flame, FlaskConical } from "lucide-react";
import { experiments } from "@/data/experiments";

export function ExperimentGallery() {
  return (
    <section className="experiment-gallery" aria-label="เลือกการทดลองจำลอง">
      <div className="experiment-gallery-heading">
        <div>
          <span className="journal-kicker">TOUCH · OBSERVE · UNDERSTAND</span>
          <h2>เลือกเรื่องที่อยากลอง</h2>
          <p>ปรับตัวแปร ดูการเปลี่ยนแปลง แล้วอ่านเหตุผลทางเคมีได้ในหน้าเดียว</p>
        </div>
        <span className="experiment-count">
          <FlaskConical size={18} /> {experiments.length + 2} การทดลอง
        </span>
      </div>
      <div className="experiment-cards">
        <Link
          href="/tools/ionization"
          className="experiment-card"
          style={{ "--experiment-accent": "#95c6a6" } as React.CSSProperties}
        >
          <div className="experiment-card-picture">
            <span className="experiment-card-symbol">pH / pKa</span>
            <b>PHARMACEUTICAL CHEMISTRY</b>
          </div>
          <div className="experiment-card-copy">
            <span>เคมีเชื่อมเภสัช</span>
            <h3>pH การแตกตัว และการละลาย</h3>
            <p>
              เทียบกรดอ่อนกับเบสอ่อน เก็บผลจริง ส่งออก CSV
              และเขียนบันทึกสิ่งที่เรียนรู้
            </p>
            <strong>
              เปิดการทดลอง <ArrowUpRight size={17} />
            </strong>
          </div>
        </Link>
        <Link
          href="/tools/flame-test"
          className="experiment-card"
          style={{ "--experiment-accent": "#f2bc62" } as React.CSSProperties}
        >
          <div className="experiment-card-picture">
            <Flame size={64} strokeWidth={1} />
            <span className="experiment-card-dots">
              <i />
              <i />
              <i />
            </span>
            <b>Na · K · Cu</b>
          </div>
          <div className="experiment-card-copy">
            <span>ม.4 · โครงสร้างอะตอม</span>
            <h3>ทดลองสีเปลวไฟ</h3>
            <p>เลือกเกลือโลหะ 6 ชนิด ดูเปลวไฟเปลี่ยนสีและเทียบผล</p>
            <strong>
              เปิดการทดลอง <ArrowUpRight size={17} />
            </strong>
          </div>
        </Link>
        {experiments.map((e) => (
          <Link
            href={`/tools/${e.id}`}
            key={e.id}
            className="experiment-card"
            style={{ "--experiment-accent": e.color } as React.CSSProperties}
          >
            <div
              className={`experiment-card-picture experiment-preview-${e.id}`}
            >
              <span className="experiment-card-symbol">{e.symbol}</span>
              <span className="experiment-card-dots">
                <i />
                <i />
                <i />
              </span>
              <b>{e.category}</b>
            </div>
            <div className="experiment-card-copy">
              <span>
                {e.grade} · {e.category}
              </span>
              <h3>{e.title}</h3>
              <p>{e.short}</p>
              <strong>
                เปิดการทดลอง <ArrowUpRight size={17} />
              </strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
