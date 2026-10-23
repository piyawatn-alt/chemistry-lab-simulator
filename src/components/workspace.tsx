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
import { articles, searchArticles, topicName } from "@/data/knowledge";
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
const navigation = [
  { href: "/discover", label: "สำรวจความรู้" },
  { href: "/topics/medicine", label: "เคมีกับยา" },
  { href: "/tools", label: "เครื่องมือสำรวจ" },
  { href: "/about", label: "รู้จักเรา" },
];
export default function Workspace({ path }: { path: string }) {
  const list = useReadingList();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const found = query.trim() ? searchArticles(query).slice(0, 5) : [];
  const article = articles.find((a) => `read/${a.id}` === path);
  const topic = path.startsWith("topics/") ? path.slice(7) : undefined;
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
              <small>CHEMISTRY, MADE CLOSER.</small>
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
          <span>EXPLORE CHEMISTRY, UNDERSTAND MEDICINE.</span>
          <div className="journal-global-search">
            <Search size={16} />
            <input
              aria-label="ค้นหาเรื่องที่สงสัย"
              placeholder="วันนี้ คุณสงสัยเรื่องอะไร?"
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
                        <small>{topicName(a.topic)}</small>
                        {a.title}
                      </span>
                      <ArrowUpRight size={18} />
                    </Link>
                  ))
                ) : (
                  <p>ยังไม่พบเรื่องนี้ ลองค้นหา “น้ำ” หรือ “แอสไพริน”</p>
                )}
                <Link href="/discover" onClick={() => setQuery("")}>
                  เปิดคลังความรู้ทั้งหมด <ArrowRight size={16} />
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
        ) : path === "discover" || topic ? (
          <Discover key={path} list={list} topic={topic} />
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
              title="มองโมเลกุล ให้เห็นความหมาย"
              description="แตะอะตอม ดูพันธะ แล้วลองสังเกตหมู่ฟังก์ชันด้วยตัวเอง ไม่ต้องอ่านเรื่องอื่นมาก่อน"
            />
            <Explorer />
            <div className="tool-related">
              <span>อยากรู้ที่มา?</span>
              <Link href="/read/small-groups-big-difference">
                อ่านเรื่องหมู่เล็ก ๆ ที่เปลี่ยนสมบัติของทั้งโมเลกุล{" "}
                <ArrowRight size={17} />
              </Link>
            </div>
          </>
        ) : path === "tools/kinetics" ? (
          <>
            <JournalHeading
              eyebrow="REACTION VISUALIZER"
              title="ค่อย ๆ เปลี่ยนไป มากแค่ไหน?"
              description="ขยับตัวแปรเพื่อดูความเข้มข้นกับเวลาในแบบจำลองปฏิกิริยาอันดับหนึ่ง"
            />
            <DecayExperiment />
            <div className="tool-related">
              <span>อ่านเส้นกราฟให้ออก</span>
              <Link href="/read/why-reactions-slow-down">
                ทำไมปฏิกิริยาบางอย่างจึงค่อย ๆ ช้าลง? <ArrowRight size={17} />
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
          <p>พื้นที่สำหรับเรื่องเคมี ที่เริ่มต้นจากความสงสัยของคุณ</p>
        </div>
        <div>
          <Link href="/discover">คลังความรู้</Link>
          <Link href="/tools">เครื่องมือสำรวจ</Link>
          <Link href="/about">แนวทางและแหล่งข้อมูล</Link>
        </div>
        <div className="journal-footer-bottom">
          <span>© {new Date().getFullYear()} ChemLab RX</span>
          <span>เพื่อความเข้าใจทางเคมี ไม่ใช่คำแนะนำทางการแพทย์</span>
          <span>STAY CURIOUS.</span>
        </div>
      </footer>
    </div>
  );
}
