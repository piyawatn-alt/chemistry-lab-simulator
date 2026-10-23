"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Atom,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  Hexagon,
  Library,
  ClipboardCheck,
  ChartNoAxesCombined,
  Info,
  Search,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
  House,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessons } from "@/data/curriculum";
import { useProgress } from "@/hooks/use-progress";
import { PageHeading } from "@/components/shared/learning";
import { Dashboard } from "@/components/dashboard/dashboard";
import { LessonView } from "@/components/lessons/lesson-view";
import { Explorer } from "@/components/simulators/explorer";
import {
  Curriculum,
  QuizList,
  Labs,
  ProgressView,
  ComingSoon,
  About,
} from "@/components/pages/learning-pages";
const navigation = [
  { href: "", label: "หน้าหลัก", en: "Dashboard", icon: House },
  { href: "lessons", label: "บทเรียน", en: "Lessons", icon: BookOpen },
  { href: "labs", label: "ห้องทดลอง", en: "Simulators", icon: FlaskConical },
  {
    href: "builder",
    label: "สร้างโมเลกุล",
    en: "Molecule Builder",
    icon: Hexagon,
  },
  { href: "drugs", label: "คลังโมเลกุลยา", en: "Drug Library", icon: Library },
  { href: "quizzes", label: "แบบทดสอบ", en: "Quizzes", icon: ClipboardCheck },
  {
    href: "progress",
    label: "ความก้าวหน้า",
    en: "Progress",
    icon: ChartNoAxesCombined,
  },
  { href: "about", label: "เกี่ยวกับโครงการ", en: "About", icon: Info },
];
const link = (path: string) => "/" + path;
export default function Workspace({ path }: { path: string }) {
  const store = useProgress();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const active = path.split("/")[0];
  const current = navigation.find((n) => n.href === active);
  const lesson = lessons.find((l) => path === `lessons/${l.id}`);
  const results = lessons.filter((l) =>
    (l.title + l.topic + l.code + l.grade)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            <Atom size={26} />
          </span>
          <span>
            ChemLab <b>RX</b>
            <small>CHEMISTRY MEETS POSSIBILITY</small>
          </span>
        </Link>
        <div className="nav-label">LEARNING SPACE</div>
        <nav aria-label="เมนูหลัก">
          {navigation.map((n) => (
            <Link
              onClick={() => setOpen(false)}
              className={`nav-item ${active === n.href ? "active" : ""}`}
              href={link(n.href)}
              key={n.href}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {active === n.href && <span className="active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="mini-icon">
            <GraduationCap size={21} />
          </span>
          <strong>จากห้องเรียน สู่โลกของยา</strong>
          <p>
            เรียนรู้ทีละนิด
            <br />
            สร้างความเข้าใจที่ยั่งยืน
          </p>
          <Link href="/about">
            รู้จัก ChemLab RX <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="profile">
          <span className="avatar">S</span>
          <div>
            <strong>พื้นที่การเรียนรู้ของคุณ</strong>
            <small>นักสำรวจเคมี · Local profile</small>
          </div>
          <span className="online" />
        </div>
      </aside>
      {open && (
        <button
          className="scrim"
          aria-label="ปิดเมนู"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              aria-label="เปิดเมนู"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
            <span>พื้นที่การเรียนรู้</span>
            <ChevronRight size={14} />
            <strong>{current?.label || "สำรวจหมู่ฟังก์ชัน"}</strong>
          </div>
          <div className="search-wrap">
            <Search size={17} />
            <input
              aria-label="ค้นหาบทเรียน"
              placeholder="ค้นหาบทเรียน หัวข้อ หรือรหัสวิชา..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <>
                <button aria-label="ล้างการค้นหา" onClick={() => setSearch("")}>
                  <X size={15} />
                </button>
                <div className="search-results">
                  {results.length ? (
                    results.map((l) => (
                      <Link
                        href={`/lessons/${l.id}`}
                        onClick={() => setSearch("")}
                        key={l.id}
                      >
                        <BookOpen size={16} />
                        <span>
                          {l.topic}
                          <small>
                            {l.code} · {l.grade}
                          </small>
                        </span>
                        <ArrowUpRight size={15} />
                      </Link>
                    ))
                  ) : (
                    <p>ไม่พบบทเรียน ลองค้นหา “อินทรีย์” หรือ “ม.5”</p>
                  )}
                </div>
              </>
            )}
          </div>
          <span className="top-status">
            <span /> พร้อมเรียนรู้
          </span>
        </header>
        <main key={path} aria-busy={!store.ready}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {store.error && (
              <p className="notice" role="alert">
                {store.error}
              </p>
            )}
            {!path ? (
              <Dashboard store={store} />
            ) : lesson ? (
              <LessonView key={lesson.id} lesson={lesson} store={store} />
            ) : path === "lessons" ? (
              <Curriculum />
            ) : path === "explorer" ? (
              <>
                <PageHeading
                  eyebrow="INTERACTIVE LEARNING"
                  title="สำรวจหมู่ฟังก์ชัน"
                  subtitle="ลองเลือกหมู่ฟังก์ชัน แล้วสังเกตว่าอะตอมเชื่อมต่อกันอย่างไร"
                />
                <Explorer store={store} />
              </>
            ) : path === "labs" ? (
              <Labs />
            ) : path === "quizzes" ? (
              <QuizList progress={store.progress} />
            ) : path === "progress" ? (
              <ProgressView store={store} />
            ) : path === "about" ? (
              <About />
            ) : ["builder", "drugs"].includes(path) ? (
              <ComingSoon kind={path} />
            ) : (
              <>
                <PageHeading
                  title="ไม่พบหน้านี้"
                  subtitle="กลับไปสำรวจบทเรียนและกิจกรรมที่พร้อมใช้งาน"
                />
                <Button asChild>
                  <Link href="/">กลับหน้าหลัก</Link>
                </Button>
              </>
            )}
          </motion.div>
          <footer>
            <span>© {new Date().getFullYear()} ChemLab RX</span>
            <span>
              Explore Chemistry, Understand Medicine.
              <span className="footer-dot"> · </span>สร้างความเข้าใจ
              ผ่านการลงมือทำ
            </span>
            <span className="version">PHASE 01</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
