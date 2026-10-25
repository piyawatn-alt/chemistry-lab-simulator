import Link from "next/link";
import { ArrowUpRight, FlaskConical } from "lucide-react";
import { experiments } from "@/data/experiments";
import { ExperimentPreview } from "./experiment-previews";

export function ExperimentGallery() {
  return (
    <section className="experiment-gallery" aria-label="เลือกการทดลองจำลอง">
      <div className="experiment-gallery-heading">
        <div>
          <span className="journal-kicker">INTERACTIVE CHEMISTRY</span>
          <h2>เลือกเรื่องที่อยากลอง</h2>
          <p>ปรับตัวแปร ดูการเปลี่ยนแปลง แล้วอ่านเหตุผลทางเคมีได้ในหน้าเดียว</p>
        </div>
        <span className="experiment-count">
          <FlaskConical size={18} /> 7 การทดลอง
        </span>
      </div>
      <div className="experiment-cards">
        <Link
          href="/tools/flame-test"
          className="experiment-card"
          style={{ "--experiment-accent": "#f2bc62" } as React.CSSProperties}
        >
          <div className="experiment-card-picture">
            <ExperimentPreview id="flame-test" />
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
              <ExperimentPreview id={e.id} />
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
      <p className="experiment-preview-note">
        ภาพตัวอย่างใช้สื่อแนวคิด สี ขนาด และจำนวนอนุภาคไม่ใช่มาตราส่วนจริง
        แต่ละการทดลองระบุเงื่อนไขและข้อจำกัดของแบบจำลองไว้ภายใน
      </p>
    </section>
  );
}
