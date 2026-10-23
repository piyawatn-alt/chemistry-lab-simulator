"use client";
import Link from "next/link";
import {
  Atom,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Clock,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageHeading,
  Stat,
  SectionTitle,
  CourseCards,
} from "@/components/shared/learning";
import { lessons } from "@/data/curriculum";
import type { ProgressStore as Store } from "@/hooks/use-progress";
function MolecularArt() {
  return (
    <div
      className="molecular-art"
      aria-label="ภาพประกอบเครือข่ายโมเลกุล ไม่ใช่โครงสร้างสารเฉพาะ"
    >
      <svg viewBox="0 0 400 300" role="img">
        <defs>
          <radialGradient id="sphere">
            <stop stopColor="#fff" />
            <stop offset=".55" stopColor="#b9e0d8" />
            <stop offset="1" stopColor="#5f9d94" />
          </radialGradient>
          <radialGradient id="dark">
            <stop stopColor="#91b6b0" />
            <stop offset="1" stopColor="#234e4b" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="#83aaa3" strokeWidth="9" strokeLinecap="round">
          <path d="M85 165 149 112 219 148 229 223M149 112 158 46M219 148 286 101 342 132M219 148 281 201M85 165 51 117M85 165 106 230" />
        </g>
        {[
          [85, 165, 25],
          [149, 112, 29],
          [219, 148, 31],
          [286, 101, 25],
          [229, 223, 19],
          [158, 46, 17],
          [342, 132, 17],
          [51, 117, 15],
          [106, 230, 16],
          [281, 201, 16],
        ].map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={i === 2 || i === 0 ? "url(#dark)" : "url(#sphere)"}
            stroke="#fff"
            strokeOpacity=".7"
            strokeWidth="1.5"
          />
        ))}
        <g fill="#568b83" fontSize="11" fontFamily="monospace">
          <text x="25" y="45">
            CHEMISTRY IN EVERY CONNECTION
          </text>
          <text x="275" y="260">
            C · H · O · N
          </text>
        </g>
        <circle
          cx="200"
          cy="150"
          r="128"
          stroke="#76a99e"
          strokeOpacity=".2"
          fill="none"
          strokeDasharray="3 7"
        />
      </svg>
      <span className="art-tag">
        <span /> A world of connections
      </span>
    </div>
  );
}

export function Dashboard({ store }: { store: Store }) {
  const p = store.progress;
  const last = lessons.find((l) => l.id === p.lastLesson);
  const scores = Object.values(p.scores);
  return (
    <>
      <PageHeading
        title="วันนี้ อยากค้นพบอะไรใหม่?"
        subtitle="พื้นที่เล็ก ๆ สำหรับความสงสัย และการค้นพบครั้งใหญ่"
      >
        <span className="pill">
          <span className="status-dot" /> เรียนรู้ได้ในจังหวะของคุณ
        </span>
      </PageHeading>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span /> EXPLORE. EXPERIMENT. UNDERSTAND.
          </span>
          <h2>
            เคมี...ที่เชื่อมโยง
            <br />
            โลกของ<span>ยา</span>
            <span className="heading-period">.</span>
          </h2>
          <p>
            เรียนรู้ ทดลอง สร้าง และค้นพบความสัมพันธ์
            <br className="desktop-break" />
            ระหว่างเคมีกับเภสัชศาสตร์
          </p>
          <div className="actions">
            <Button asChild>
              <Link href="/lessons">
                เริ่มเรียนเลย <ArrowRight size={17} />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/labs">
                <FlaskConical size={17} /> สำรวจห้องทดลอง
              </Link>
            </Button>
          </div>
          <div className="hero-foot">
            <span className="little-line" />
            ออกแบบสำหรับนักเรียน ม.4–ม.6 <span className="dot-sep">·</span>{" "}
            เรียนฟรี ไม่ต้องเข้าสู่ระบบ
          </div>
        </div>
        <MolecularArt />
      </section>
      <div className="stats-grid">
        <Stat
          icon={BookOpen}
          label="บทเรียนที่เรียนจบ"
          value={`${p.completed.length}`}
          unit={`/ ${lessons.length} บทเรียน`}
          color="mint"
        />
        <Stat
          icon={ClipboardCheck}
          label="คะแนนแบบทดสอบเฉลี่ย"
          value={
            scores.length
              ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%`
              : "—"
          }
          unit={
            scores.length
              ? `${scores.length} แบบทดสอบ`
              : "เริ่มทำแบบทดสอบแรกกัน"
          }
          color="blue"
        />
        <Stat
          icon={FlaskConical}
          label="หมู่ฟังก์ชันที่สำรวจ"
          value={`${p.explored.length}`}
          unit="/ 4 หมู่ฟังก์ชัน"
          color="lilac"
        />
      </div>
      <div className="dashboard-columns">
        <div>
          <SectionTitle
            title="เส้นทางการเรียนรู้"
            subtitle="จากพื้นฐานเคมี สู่ความเข้าใจที่เชื่อมโยง"
            href="/lessons"
            action="ดูบทเรียนทั้งหมด"
          />
          <CourseCards compact />
          <SectionTitle
            title="เรียนรู้ผ่านการลงมือทำ"
            subtitle="เปลี่ยนความสงสัย ให้เป็นความเข้าใจ"
            href="/labs"
            action="ดูห้องทดลอง"
          />
          <div className="featured-grid">
            <Link href="/explorer" className="feature-card">
              <div className="feature-visual">
                <span className="formula-art">
                  R—<b>OH</b>
                </span>
                <span className="floating-label">HYDROXYL GROUP</span>
              </div>
              <div className="feature-copy">
                <span className="tiny-label">
                  พร้อมสำรวจ <span className="status-dot" />
                </span>
                <h3>
                  สำรวจหมู่ฟังก์ชัน <ArrowUpRight size={18} />
                </h3>
                <p>โครงสร้างต่างกัน สมบัติเปลี่ยนไปอย่างไร?</p>
              </div>
            </Link>
            <Link href="/lessons/kinetics" className="feature-card">
              <div className="feature-visual blue-visual">
                <svg viewBox="0 0 250 95">
                  <path d="M25 12v65h200" fill="none" stroke="#b0c3d1" />
                  <path
                    d="M30 20C80 20 75 67 220 72"
                    fill="none"
                    stroke="#5d8eaf"
                    strokeWidth="3"
                  />
                  <path
                    d="M30 20C80 20 75 67 220 72V77H30Z"
                    fill="#b7d2e7"
                    fillOpacity=".25"
                  />
                  <text x="185" y="24" fill="#6689a2" fontSize="11">
                    [A] = [A]₀e⁻ᵏᵗ
                  </text>
                </svg>
              </div>
              <div className="feature-copy">
                <span className="tiny-label">กิจกรรมในบทเรียน</span>
                <h3>
                  ติดตามอัตราปฏิกิริยา <ArrowUpRight size={18} />
                </h3>
                <p>ทดลองปรับค่า แล้วดูกราฟเปลี่ยนไป</p>
              </div>
            </Link>
          </div>
        </div>
        <aside className="context-column">
          <section className="panel continue-panel">
            <span className="eyebrow">KEEP YOUR CURIOSITY GOING</span>
            <div className="context-icon">
              <BookOpen size={22} />
            </div>
            <h3>{last ? "เรียนต่อจากครั้งก่อน" : "ก้าวแรกของการค้นพบ"}</h3>
            <p>
              {last
                ? last.topic
                : "เริ่มจากพันธะเล็ก ๆ ที่เชื่อมทุกสิ่งเข้าด้วยกัน"}
            </p>
            <span className="lesson-meta">
              <Clock size={14} /> กิจกรรมสั้น · 4 ขั้นตอน
            </span>
            <Button asChild>
              <Link href={`/lessons/${last?.id || "bonds"}`}>
                {last ? "เรียนต่อ" : "เริ่มบทเรียนแรก"}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </section>
          <section className="pharmacy-card">
            <span className="tiny-label">
              <Sparkles size={14} /> CHEMISTRY TO PHARMACY
            </span>
            <h3>
              เคมีอยู่ใกล้ตัว
              <br />
              กว่าที่คิด
            </h3>
            <p>
              หมู่ฟังก์ชันเล็ก ๆ ในโมเลกุล
              เกี่ยวข้องกับการละลายและความคงตัวของสารยาได้อย่างไร?
            </p>
            <Link href="/lessons/organic">
              ค้นหาคำตอบ <ArrowUpRight size={15} />
            </Link>
            <div className="pharmacy-drawing">
              O<span>∥</span>
              <b>R — C — OH</b>
            </div>
          </section>
          <div className="small-note">
            <Lightbulb size={18} />
            <p>
              ไม่ต้องจำทุกอย่างในครั้งเดียว
              <br />
              <strong>แค่เข้าใจเพิ่มขึ้นทีละนิดก็พอ</strong>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
