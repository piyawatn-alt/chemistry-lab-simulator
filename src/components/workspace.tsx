"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Atom,
  Search,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { useReadingList } from "@/hooks/use-reading-list";
import { articles, searchArticles, courseForArticle } from "@/data/knowledge";
import { KnowledgeHome } from "@/components/knowledge/home";
import {
  ArticleReader,
  Discover,
  JournalHeading,
  ReadingShelf,
  Tools,
  KnowledgeAbout,
} from "@/components/knowledge/pages";
import { Explorer, DecayExperiment } from "@/components/simulators/explorer";
import { FlameTest } from "@/components/simulators/flame-test";
import { ExperimentLab } from "@/components/simulators/experiment-lab";
import { ExperimentGallery } from "@/components/simulators/experiment-gallery";
import { experimentForPath } from "@/data/experiments";
const navigation = [
  { href: "/discover", label: "เนื้อหาทั้งหมด" },
  { href: "/grades/4", label: "ม.4" },
  { href: "/grades/5", label: "ม.5" },
  { href: "/grades/6", label: "ม.6" },
  { href: "/tools", label: "ทดลองและเครื่องมือ" },
];
export default function Workspace({ path }: { path: string }) {
  const list = useReadingList();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const found = query.trim() ? searchArticles(query).slice(0, 5) : [];
  const article = articles.find((a) => `read/${a.id}` === path);
  const topic = path.startsWith("topics/") ? path.slice(7) : undefined;
  const grade = path.startsWith("grades/") ? path.slice(7) : undefined;
  const course = path.startsWith("courses/") ? path.slice(8) : undefined;
  return (
    <div className="knowledge-site">
      <a href="#main-content" className="skip-link">
        ข้ามไปยังเนื้อหา
      </a>
      <header className="journal-header">
        <div className="journal-nav-wrap">
          <Link
            className="journal-brand"
            href="/"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          >
            <span>
              <Atom size={25} />
            </span>
            <strong>
              ChemLab <b>RX</b>
              <small>CHEMISTRY CONTENT LIBRARY</small>
            </strong>
          </Link>
          <nav
            aria-label="เมนูหลัก"
            className={open ? "journal-nav is-open" : "journal-nav"}
          >
            {navigation.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                aria-current={`/${path}` === n.href ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="journal-nav-actions">
            <Link
              href="/saved"
              aria-label="เก็บไว้อ่าน"
              className={path === "saved" ? "is-active" : ""}
            >
              <Bookmark size={19} />
              {list.saved.length > 0 && <small>{list.saved.length}</small>}
            </Link>
            <button
              aria-label="เปิดเมนู"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      <div className="journal-searchbar">
        <div>
          <span>CHEMISTRY REFERENCE · ม.4 / ม.5 / ม.6</span>
          <div className="journal-global-search">
            <Search size={16} />
            <input
              aria-label="ค้นหาเนื้อหา"
              placeholder="ค้นหาหัวข้อเนื้อหา หรือรหัสวิชา"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
            />
            {query && (
              <button aria-label="ล้างการค้นหา" onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            )}
            {query.trim() && (
              <div className="journal-search-results">
                {found.length ? (
                  found.map((a) => (
                    <Link
                      key={a.id}
                      href={`/read/${a.id}`}
                      onClick={() => setQuery("")}
                    >
                      <span>
                        <small>{`ม.${courseForArticle(a).grade} · ${courseForArticle(a).code}`}</small>
                        {a.title}
                      </span>
                      <ArrowUpRight size={18} />
                    </Link>
                  ))
                ) : (
                  <p>ไม่พบเนื้อหา ลองค้นหาชื่อหัวข้อหรือรหัสวิชา</p>
                )}
                <Link href="/discover" onClick={() => setQuery("")}>
                  เปิดคลังเนื้อหาทั้งหมด <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <main id="main-content" className="journal-main" aria-busy={!list.ready}>
        {list.error && (
          <p role="alert" className="knowledge-storage-error">
            {list.error}
          </p>
        )}
        {!path ? (
          <KnowledgeHome list={list} />
        ) : article ? (
          <ArticleReader key={article.id} article={article} list={list} />
        ) : path === "discover" || topic || grade || course ? (
          <Discover
            key={path}
            list={list}
            topic={topic}
            grade={grade}
            course={course}
          />
        ) : path === "saved" ? (
          <ReadingShelf list={list} />
        ) : path === "tools" ? (
          <Tools />
        ) : path === "about" ? (
          <KnowledgeAbout />
        ) : path === "explorer" ? (
          <>
            <JournalHeading
              eyebrow="MOLECULE EXPLORER"
              title="โครงสร้างโมเลกุลและหมู่ฟังก์ชัน"
              description="แตะอะตอม ดูพันธะ แล้วลองสังเกตหมู่ฟังก์ชันด้วยตัวเอง ไม่ต้องอ่านเรื่องอื่นมาก่อน"
            />
            <Explorer />
            <div className="tool-related">
              <span>เนื้อหาที่เกี่ยวข้อง</span>
              <Link href="/read/small-groups-big-difference">
                หมู่ฟังก์ชันของสารอินทรีย์ <ArrowRight size={17} />
              </Link>
            </div>
          </>
        ) : path === "tools/experiments" ? (
          <>
            <JournalHeading
              eyebrow="EXPLORE THE VIRTUAL LAB"
              title="การทดลองเคมีแบบแอนิเมชัน"
              description="เลือกการทดลองได้อิสระ ปรับตัวแปร ดูผล และเชื่อมโยงกับเนื้อหาเคมี ม.4–ม.6"
            />
            <ExperimentGallery />
          </>
        ) : experimentForPath(path) ? (
          <ExperimentLab key={path} id={experimentForPath(path)!.id} />
        ) : path === "tools/flame-test" ? (
          <>
            <JournalHeading
              eyebrow="FLAME TEST SIMULATOR"
              title="ทดลองสีเปลวไฟ"
              description="เลือกสาร ดูแอนิเมชัน และเชื่อมโยงสีของแสงกับระดับพลังงานของอิเล็กตรอน"
            />
            <FlameTest />
          </>
        ) : path === "tools/kinetics" ? (
          <>
            <JournalHeading
              eyebrow="REACTION VISUALIZER"
              title="กราฟความเข้มข้นกับเวลา"
              description="ขยับตัวแปรเพื่อดูความเข้มข้นกับเวลาในแบบจำลองปฏิกิริยาอันดับหนึ่ง"
            />
            <DecayExperiment />
            <div className="tool-related">
              <span>อ่านเส้นกราฟให้ออก</span>
              <Link href="/read/why-reactions-slow-down">
                อัตราปฏิกิริยาและแบบจำลองอันดับหนึ่ง <ArrowRight size={17} />
              </Link>
            </div>
          </>
        ) : null}
      </main>
      <footer className="journal-footer">
        <div>
          <Link className="journal-brand" href="/">
            <span>
              <Atom size={23} />
            </span>
            <strong>
              ChemLab <b>RX</b>
            </strong>
          </Link>
          <p>แหล่งรวมเนื้อหาเคมีระดับมัธยมศึกษาปีที่ 4–6</p>
        </div>
        <div>
          <Link href="/discover">คลังเนื้อหา</Link>
          <Link href="/tools">เครื่องมือสำรวจ</Link>
          <Link href="/about">แนวทางและแหล่งข้อมูล</Link>
        </div>
        <div className="journal-footer-bottom">
          <span>© {new Date().getFullYear()} ChemLab RX</span>
          <span>เพื่อความเข้าใจทางเคมี ไม่ใช่คำแนะนำทางการแพทย์</span>
          <span>CHEMISTRY CONTENT LIBRARY</span>
        </div>
      </footer>
    </div>
  );
}
