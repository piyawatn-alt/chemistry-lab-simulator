"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Info,
  ClipboardCheck,
  ArrowUpRight,
  Hexagon,
  ChartNoAxesCombined,
  Beaker,
  FlaskConical,
  Atom,
  Sparkles,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Library,
} from "lucide-react";
import { PageHeading, CourseCards, Stat } from "@/components/shared/learning";
import { Button } from "@/components/ui/button";
import { lessons } from "@/data/curriculum";
import { emptyProgress, type Progress } from "@/lib/storage/progress";
import type { ProgressStore as Store } from "@/hooks/use-progress";
export function Curriculum() {
  const [grade, setGrade] = useState("all");
  return (
    <>
      <PageHeading
        title="เส้นทางการเรียนรู้ของคุณ"
        subtitle="เลือกวิชา แล้วเรียนรู้ผ่านคำอธิบาย กิจกรรม และแบบทดสอบ"
      />
      <div className="tabs" aria-label="กรองระดับชั้น">
        {["all", "ม.4", "ม.5", "ม.6"].map((g) => (
          <button
            aria-pressed={grade === g}
            className={grade === g ? "selected" : ""}
            key={g}
            onClick={() => setGrade(g)}
          >
            {g === "all" ? "ทุกระดับชั้น" : g}
          </button>
        ))}
      </div>
      <CourseCards grade={grade} />
      <p className="data-note">
        <Info size={16} /> ชื่อรายวิชาอ้างอิงจากขอบเขตโครงการ
        บทเรียนและจุดประสงค์เป็นตัวอย่างที่โครงการจัดทำ
        ไม่ใช่สารบัญหรือผลการเรียนรู้อย่างเป็นทางการของโรงเรียน
      </p>
    </>
  );
}

export function QuizList({ progress: p }: { progress: Progress }) {
  return (
    <>
      <PageHeading
        title="แบบทดสอบความเข้าใจ"
        subtitle="ไม่ใช่แค่คะแนน แต่คือโอกาสค้นพบว่ายังสงสัยตรงไหน"
      />
      <div className="list-grid">
        {lessons.map((l) => (
          <Link
            key={l.id}
            href={`/lessons/${l.id}`}
            className="panel quiz-list-item"
          >
            <span className="stat-icon mint">
              <ClipboardCheck size={22} />
            </span>
            <div>
              <span className="tiny-label">{l.code}</span>
              <h3>{l.topic}</h3>
              <p>เรียนรู้ → ฝึก → ทดลอง → แบบทดสอบ 1 ข้อ</p>
            </div>
            <span>
              {p.scores[l.id] !== undefined
                ? `${p.scores[l.id]}%`
                : "เริ่มเรียน"}{" "}
              <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      <p className="data-note">
        แบบทดสอบอยู่ในขั้นตอนที่ 4 ของแต่ละบทเรียน คะแนนแสดงผลครั้งล่าสุด
        ไม่ใช่คะแนนเฉลี่ยทุกครั้ง
      </p>
    </>
  );
}

export function Labs() {
  return (
    <>
      <PageHeading
        title="ห้องทดลองแห่งความสงสัย"
        subtitle="เรียนรู้จากการสังเกต เปลี่ยนตัวแปร แล้วตั้งคำถามใหม่"
      />
      <div className="lab-grid">
        {[
          {
            title: "Functional Group Explorer",
            th: "สำรวจหมู่ฟังก์ชัน",
            desc: "แยกแยะกลุ่มอะตอม และเชื่อมโยงสมบัติของสาร",
            href: "/explorer",
            icon: Hexagon,
          },
          {
            title: "Chemical Kinetics",
            th: "กิจกรรมอัตราปฏิกิริยาอันดับหนึ่ง",
            desc: "ปรับความเข้มข้นและค่าคงที่อัตราในบทเรียน แบบจำลอง 0 และ 2 จะเพิ่มใน Phase 2",
            href: "/lessons/kinetics",
            icon: ChartNoAxesCombined,
          },
          {
            title: "Acid–Base Titration",
            th: "การไทเทรตกรด–เบส",
            desc: "ความเข้มข้น จุดสมมูล และเส้นโค้ง pH",
            icon: Beaker,
          },
          {
            title: "Esterification",
            th: "ปฏิกิริยาเอสเทอริฟิเคชัน",
            desc: "สำรวจองค์ประกอบของระบบที่สมดุล",
            icon: FlaskConical,
          },
          {
            title: "Molecular Builder",
            th: "สร้างโมเลกุล",
            desc: "เรียนรู้ผ่านการเชื่อมต่ออะตอม",
            icon: Atom,
          },
          {
            title: "Electrochemical Cell",
            th: "เซลล์ไฟฟ้าเคมี",
            desc: "เชื่อมปฏิกิริยารีดอกซ์กับพลังงานไฟฟ้า",
            icon: Sparkles,
          },
        ].map((l) => (
          <section className="panel lab-card" key={l.title}>
            <span className={`stat-icon ${l.href ? "mint" : "neutral"}`}>
              <l.icon size={25} />
            </span>
            <span className={`pill ${l.href ? "" : "muted"}`}>
              {l.href ? "พร้อมเรียนรู้" : "Coming Soon · Phase 2"}
            </span>
            <h2>{l.th}</h2>
            <span className="tiny-label">{l.title}</span>
            <p>{l.desc}</p>
            {l.href && (
              <Button variant="outline" asChild>
                <Link href={l.href}>
                  เริ่มสำรวจ <ArrowRight size={16} />
                </Link>
              </Button>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

export function ProgressView({ store }: { store: Store }) {
  const p = store.progress;
  const [confirm, setConfirm] = useState(false);
  const scores = Object.values(p.scores);
  return (
    <>
      <PageHeading
        title="ทุกก้าวของการเรียนรู้ มีความหมาย"
        subtitle="ข้อมูลจริงจากการใช้งานบนเบราว์เซอร์นี้ บันทึกอัตโนมัติโดยไม่ต้องเข้าสู่ระบบ"
      />
      <div className="stats-grid">
        <Stat
          icon={BookOpen}
          label="เรียนจบแล้ว"
          value={`${p.completed.length}`}
          unit={`/ ${lessons.length} บทเรียน`}
          color="mint"
        />
        <Stat
          icon={ClipboardCheck}
          label="ทำแบบทดสอบแล้ว"
          value={`${scores.length}`}
          unit="/ 6 แบบทดสอบ"
          color="blue"
        />
        <Stat
          icon={Hexagon}
          label="สำรวจแล้ว"
          value={`${p.explored.length}`}
          unit="/ 4 หมู่ฟังก์ชัน"
          color="lilac"
        />
      </div>
      <section className="panel">
        <h2>บันทึกการเรียนรู้</h2>
        {!p.updatedAt && (
          <p className="notice">
            ยังไม่มีกิจกรรม เริ่มบทเรียนแรก แล้วกลับมาดูเส้นทางของคุณที่นี่
          </p>
        )}
        {lessons.map((l) => (
          <div key={l.id} className="progress-row">
            <div>
              <span className="tiny-label">{l.code}</span>
              <h3>{l.topic}</h3>
            </div>
            <span className="pill">
              {p.completed.includes(l.id)
                ? "เรียนจบแล้ว"
                : p.scores[l.id] !== undefined
                  ? "กำลังทบทวน"
                  : "ยังไม่เริ่ม"}
            </span>
            <span>
              {p.scores[l.id] !== undefined ? `${p.scores[l.id]}%` : "—"}
            </span>
            <Link href={`/lessons/${l.id}`} aria-label={`เปิด ${l.topic}`}>
              <ArrowUpRight size={19} />
            </Link>
          </div>
        ))}
      </section>
      <div className="panel reset-panel">
        <div>
          <h3>จัดการข้อมูลของคุณ</h3>
          <p>
            ข้อมูลอยู่ในเครื่องนี้เท่านั้น ยังไม่รองรับการซิงก์ข้ามอุปกรณ์
            การล้างข้อมูลเว็บไซต์จะลบความก้าวหน้า
          </p>
        </div>
        {confirm ? (
          <div className="actions">
            <Button
              onClick={() => {
                store.update(() => emptyProgress);
                setConfirm(false);
              }}
            >
              ยืนยันลบความก้าวหน้า
            </Button>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              ยกเลิก
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setConfirm(true)}>
            <RotateCcw size={15} />
            ล้างความก้าวหน้า
          </Button>
        )}
      </div>
    </>
  );
}

export function ComingSoon({ kind }: { kind: string }) {
  return (
    <>
      <PageHeading
        title={kind === "builder" ? "พื้นที่สร้างโมเลกุล" : "คลังโมเลกุลยา"}
        subtitle="กำลังเตรียมประสบการณ์ที่ตรวจสอบได้และมีความหมายต่อการเรียนรู้"
      />
      <section className="panel coming-soon">
        <span className="stat-icon mint">
          {kind === "builder" ? <Atom size={30} /> : <Library size={30} />}
        </span>
        <span className="pill">
          Coming Soon · {kind === "builder" ? "Phase 2" : "Phase 3"}
        </span>
        <h2>
          {kind === "builder"
            ? "เริ่มจากความเข้าใจ ก่อนสร้างโมเลกุล"
            : "สำรวจโลกของยา ผ่านพื้นฐานเคมี"}
        </h2>
        <p>
          {kind === "builder"
            ? "ตัวแก้ไขโมเลกุล การตรวจสอบโครงสร้าง และการบันทึกโมเลกุลยังไม่เปิดใช้งาน"
            : "รายการแอสไพริน พาราเซตามอล และไอบูโพรเฟน พร้อมโครงสร้างที่ตรวจสอบแล้วจะเพิ่มในระยะถัดไป"}
        </p>
        <Button asChild>
          <Link href="/explorer">
            สำรวจหมู่ฟังก์ชันที่พร้อมใช้งาน <ArrowRight size={16} />
          </Link>
        </Button>
      </section>
    </>
  );
}

export function About() {
  return (
    <>
      <PageHeading
        title="ChemLab RX"
        subtitle="Explore Chemistry, Understand Medicine."
      />
      <section className="panel about-panel">
        <span className="eyebrow">จากความสงสัย สู่ความเข้าใจ</span>
        <h2>
          เคมีที่มองเห็น ทดลองได้
          <br />
          และเชื่อมโยงกับโลกของยา
        </h2>
        <p>
          โครงการเพื่อการเรียนรู้เคมีของนักเรียนมัธยมศึกษาตอนปลาย ม.4–ม.6
          และแฟ้มสะสมผลงานด้านเภสัชศาสตร์ เน้นการสร้างความเข้าใจผ่านการลงมือทำ
        </p>
        <h3>วิธีเรียนรู้</h3>
        <p>
          เรียนรู้ → ฝึกแบบมีคำแนะนำ → ทดลองอิสระ → แบบทดสอบ
          ทุกบทเรียนย้อนกลับไปทบทวนได้ และบันทึกความก้าวหน้าในอุปกรณ์ของคุณ
        </p>
        <h3>ขอบเขต Phase 1</h3>
        <p>
          บทเรียนตัวอย่าง 6 วิชา สำรวจหมู่ฟังก์ชัน 4 กลุ่ม
          กิจกรรมกราฟอันดับหนึ่ง และแบบทดสอบ รายวิชาอ้างอิงจากขอบเขตโครงการ
          เนื้อหาไม่ใช่หลักสูตรอย่างเป็นทางการของโรงเรียน
        </p>
        <h3>แหล่งเรียนรู้เพิ่มเติม</h3>
        <ul>
          <li>
            <a
              href="https://openstax.org/details/books/chemistry-2e"
              target="_blank"
              rel="noreferrer"
            >
              OpenStax Chemistry 2e — พันธะ ปริมาณสาร และจลนศาสตร์ ↗
            </a>
          </li>
          <li>
            <a
              href="https://goldbook.iupac.org/"
              target="_blank"
              rel="noreferrer"
            >
              IUPAC Gold Book — ศัพท์เคมีและนิยาม ↗
            </a>
          </li>
          <li>
            <a
              href="https://pubchem.ncbi.nlm.nih.gov/"
              target="_blank"
              rel="noreferrer"
            >
              PubChem — ข้อมูลสารและโครงสร้างโมเลกุล ↗
            </a>
          </li>
        </ul>
        <p className="notice">
          เพื่อการศึกษาเท่านั้น ไม่ใช้เป็นคำแนะนำทางการแพทย์หรือการกำหนดขนาดยา
          ข้อความเชื่อมโยงเภสัชศาสตร์อธิบายหลักเคมีพื้นฐาน
          ไม่ใช่การรับรองประสิทธิผลทางคลินิก
        </p>
      </section>
    </>
  );
}
