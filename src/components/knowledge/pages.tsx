"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Atom,
  ChartNoAxesCombined,
  ShieldCheck,
  Highlighter,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  FlaskConical,
  List,
} from "lucide-react";
import {
  articles,
  type Article,
  readingMinutes,
  courses,
  courseForArticle,
} from "@/data/knowledge";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleCard } from "./article-card";
import { ChapterAtlas } from "./atlases/chapter-atlas";
import { LearningFigure } from "./learning-figure";
import { contentFigures, supplementaryFigures } from "@/data/knowledge/figures";
import { HighlightedText } from "./highlighted-text";
import { ScientificFormula } from "@/components/ui/scientific-formula";
import { ArticleArt } from "./article-art";
import { ExperimentGallery } from "@/components/simulators/experiment-gallery";
import { foundationsFor, toolsForArticle } from "@/data/knowledge/connections";
import "@/app/reader-refresh.css";
import { chemistrySubjects, searchContent } from "@/lib/content/search";
export function JournalHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="journal-page-heading">
      <span className="journal-kicker">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
type DiscoverProps = { list: ReadingList; topic?: string; grade?: string; course?: string };
export function Discover(props: DiscoverProps) {
  return <Suspense fallback={<div className="discovery-match-status" role="status">กำลังเปิดคลังเนื้อหา…</div>}><DiscoverContent {...props} /></Suspense>;
}
function DiscoverContent({
  list,
  topic = "all",
  grade = "all",
  course = "all",
}: DiscoverProps) {
  const initialCourse = courses.find((c) => c.id === course);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [level, setLevel] = useState(initialCourse?.grade || grade);
  const [selectedCourse, setCourse] = useState(course);
  const requestedSubject = searchParams.get("subject") || "all";
  const subject = chemistrySubjects.some((item) => item.id === requestedSubject) ? requestedSubject : "all";
  const updateSearch = (nextQuery: string, nextSubject = subject) => {
    const url = new URL(window.location.href);
    if (nextQuery.trim()) url.searchParams.set("q", nextQuery); else url.searchParams.delete("q");
    if (nextSubject !== "all") url.searchParams.set("subject", nextSubject); else url.searchParams.delete("subject");
    window.history.replaceState(null, "", url.pathname + url.search);
  };
  const activeSubject = chemistrySubjects.find((item) => item.id === subject);
  const matching = searchContent(query).filter(({ article: a }) => {
    const c = courseForArticle(a);
    return (
      (level === "all" || c.grade === level) &&
      (selectedCourse === "all" || c.id === selectedCourse) &&
      (topic === "all" || a.topic === topic) &&
      (!activeSubject || activeSubject.articleIds.includes(a.id))
    );
  });
  const currentCourse = courses.find((c) => c.id === selectedCourse);
  return (
    <>
      <JournalHeading
        eyebrow="CHEMISTRY CONTENT LIBRARY"
        title={
          currentCourse
            ? currentCourse.title
            : level === "all"
              ? "คลังเนื้อหาเคมี ม.4–ม.6"
              : `เนื้อหาเคมี ม.${level}`
        }
        description={
          currentCourse
            ? `${currentCourse.code} · ม.${currentCourse.grade}${currentCourse.semester ? ` · ภาคเรียนที่ ${currentCourse.semester}` : ""}`
            : "เลือกระดับชั้น รายวิชา และหัวข้อเนื้อหาที่ต้องการอ่าน"
        }
      />
      <div className="discovery-search">
        <Search size={21} />
        <input
          aria-label="ค้นหาในคลังเนื้อหา"
          value={query}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder="ค้นหาชื่อบท คำศัพท์ไทย–อังกฤษ หรือสูตร เช่น molarity, H₂O, Ksp"
        />
        {query && (
          <button aria-label="ล้างคำค้น" onClick={() => updateSearch("")}>
            ล้าง
          </button>
        )}
      </div>
      <div className="journal-filters" aria-label="ระดับชั้น">
        {["all", "4", "5", "6"].map((g) => (
          <button
            key={g}
            aria-pressed={level === g}
            onClick={() => {
              setLevel(g);
              setCourse("all");
            }}
          >
            {g === "all" ? "ทุกระดับชั้น" : `ม.${g}`}
          </button>
        ))}
      </div>
      <div className="course-filter">
        <label htmlFor="course-select">รายวิชา</label>
        <select
          id="course-select"
          value={selectedCourse}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="all">ทุกรายวิชาในระดับชั้นที่เลือก</option>
          {courses
            .filter((c) => level === "all" || c.grade === level)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} {c.title}
              </option>
            ))}
        </select>
      </div>
      <div className="discovery-subject-filter">
        <span className="discovery-subject-label">หมวดเนื้อหา</span>
        <div className="discovery-subject-options" role="group" aria-label="หมวดเนื้อหา">
          <button aria-pressed={subject === "all"} onClick={() => updateSearch(query, "all")}>ทุกหมวด</button>
          {chemistrySubjects.map((item) => (
            <button key={item.id} aria-pressed={subject === item.id} onClick={() => updateSearch(query, item.id)}>{item.title}</button>
          ))}
        </div>
      </div>
      {activeSubject && <p className="discovery-match-status">{activeSubject.description}</p>}
      <div className="collection-count" role="status" aria-live="polite">
        <span>{matching.length} หัวข้อเนื้อหา{query.trim() ? ` สำหรับ “${query.trim()}”` : ""}</span>
        <span>คำอธิบาย · ภาพประกอบ · สูตรสำคัญ</span>
      </div>
      {matching.length ? (
        query.trim() ? (
          <div className="discovery-results">
            {matching.map(({ article: a, snippet, sectionTitle, sectionIndex }) => {
              const c = courseForArticle(a);
              const saved = list.saved.includes(a.id);
              const href = `/read/${a.id}${sectionIndex !== undefined ? `#section-${sectionIndex}` : ""}`;
              return (
                <article className="discovery-result" key={a.id}>
                  <Link className="discovery-result-art" href={href} aria-label={`อ่าน ${a.title}`}><ArticleArt visual={a.visual} conceptOnly={a.topic === "medicine"} /></Link>
                  <div>
                    <span className="discovery-result-meta">ม.{c.grade} · {c.code} · {c.title}</span>
                    <Link href={href}><h2>{a.title}</h2></Link>
                    <p><HighlightedText text={snippet} phrases={[query.trim()]} /></p>
                    {sectionTitle && <Link className="discovery-result-section" href={href}>ในหัวข้อ: {sectionTitle}<ArrowRight size={14} /></Link>}
                  </div>
                  <button className="discovery-result-save" disabled={!list.ready} aria-pressed={saved} aria-label={`${saved ? "นำออกจาก" : "เพิ่มใน"}รายการอ่าน: ${a.title}`} onClick={() => list.toggle(a.id)}><Bookmark size={18} fill={saved ? "currentColor" : "none"} /></button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="story-grid collection-grid">
            {matching.map(({ article: a }) => <ArticleCard key={a.id} article={a} list={list} />)}
          </div>
        )
      ) : (
        <div className="journal-empty">
          <Search size={30} />
          <h2>ไม่พบเนื้อหาที่ตรงกับตัวกรอง</h2>
          <p>เปลี่ยนคำค้น ระดับชั้น หรือรายวิชาเพื่อดูเนื้อหาอื่น</p>
          <button
            className="journal-button"
            onClick={() => {
              updateSearch("", "all");
              setLevel("all");
              setCourse("all");
            }}
          >
            ดูเนื้อหาทั้งหมด
          </button>
        </div>
      )}
      <p className="curriculum-note">
        การจัดระดับชั้นและรหัสรายวิชาเป็นตัวอย่างของคลังนี้ โรงเรียนอาจจัดลำดับต่างกัน
        ไม่ใช่สารบัญครบหลักสูตรอย่างเป็นทางการ
      </p>
    </>
  );
}
export function ReadingShelf({ list }: { list: ReadingList }) {
  const saved = articles.filter((a) => list.saved.includes(a.id));
  return (
    <>
      <JournalHeading
        eyebrow="YOUR READING SHELF"
        title="เนื้อหาที่บันทึกไว้"
        description="รายการเนื้อหาที่บันทึกไว้สำหรับเปิดอ่านซ้ำบนเบราว์เซอร์นี้"
      />
      {saved.length ? (
        <>
          <p className="collection-count">
            บันทึกไว้ {saved.length} เรื่อง · แตะเครื่องหมายถูกบนการ์ดเพื่อนำออก
          </p>
          <div className="story-grid">
            {saved.map((a) => (
              <ArticleCard key={a.id} article={a} list={list} />
            ))}
          </div>
        </>
      ) : (
        <div className="journal-empty">
          <Bookmark size={33} />
          <h2>ชั้นหนังสือเล็ก ๆ ยังว่างอยู่</h2>
          <p>
            เจอเรื่องที่สนใจ กดสัญลักษณ์บันทึกบนการ์ดหรือในบทความ
            <br />
            แล้วกลับมาอ่านต่อที่นี่ได้
          </p>
          <Link className="journal-button" href="/discover">
            เลือกเนื้อหาที่ต้องการอ่าน <ArrowRight size={17} />
          </Link>
        </div>
      )}
      <p className="shelf-note">
        รายการนี้เก็บในอุปกรณ์ของคุณ ไม่ต้องเข้าสู่ระบบ
        และยังไม่ซิงก์ข้ามอุปกรณ์
      </p>
    </>
  );
}
export function Tools() {
  return (
    <>
      <JournalHeading
        eyebrow="A DIFFERENT WAY TO UNDERSTAND"
        title="เครื่องมือประกอบเนื้อหาเคมี"
        description="การทดลองแบบแอนิเมชัน ภาพโมเลกุล และกราฟจำลอง สำหรับสำรวจแนวคิดเคมีด้วยตัวเอง"
      />
      <ExperimentGallery />
      <h2 className="experiment-tool-heading">
        สำรวจโครงสร้างและกราฟเพิ่มเติม
      </h2>
      <div className="knowledge-tools">
        <Link href="/explorer">
          <ArticleArt visual="acid" />
          <div className="knowledge-tool-copy">
            <span className="journal-kicker">MOLECULE EXPLORER</span>
            <h2>โครงสร้างโมเลกุลและหมู่ฟังก์ชัน</h2>
            <p>
              แตะอะตอม ดูความหมายของพันธะ และสังเกตว่าแอลกอฮอล์ กรดคาร์บอกซิลิก
              เอสเทอร์ เอไมด์ และหมู่อื่น ๆ ต่างกันตรงไหน
            </p>
            <span>
              เปิดภาพโมเลกุล <ArrowUpRight size={19} />
            </span>
          </div>
        </Link>
        <Link href="/tools/kinetics">
          <ArticleArt visual="kinetics" />
          <div className="knowledge-tool-copy">
            <span className="journal-kicker">REACTION VISUALIZER</span>
            <h2>ความเข้มข้นกับเวลาในปฏิกิริยาอันดับหนึ่ง</h2>
            <p>
              ปรับความเข้มข้นเริ่มต้นและค่าคงที่อัตรา
              แล้วดูว่าเส้นกราฟอันดับหนึ่งกับครึ่งชีวิตเปลี่ยนอย่างไร
            </p>
            <span>
              ลองปรับเส้นกราฟ <ArrowUpRight size={19} />
            </span>
          </div>
        </Link>
      </div>
      <div className="knowledge-note">
        <ShieldCheck size={22} />
        <p>
          เครื่องมือแสดงแนวคิดภายใต้สมมติฐานที่ระบุไว้
          แผนภาพโมเลกุลเป็นการเชื่อมต่อ 2 มิติ ไม่ใช่มุมพันธะจริง
          ส่วนกราฟเป็นแบบจำลองเพื่ออธิบายหลักเคมี
        </p>
      </div>
    </>
  );
}
export function ArticleReader({
  article: a,
  list,
}: {
  article: Article;
  list: ReadingList;
}) {
  const [highlightsOn, setHighlightsOn] = useState(true);
  const saved = list.saved.includes(a.id);
  const [activeSection, setActiveSection] = useState("visual-reference");
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLElement>(null);
  const foundations = foundationsFor(a);
  const linkedTools = toolsForArticle(a);
  const sectionLinks = [
    { id: "visual-reference", title: "แผ่นภาพสรุปประจำบท" },
    ...a.sections.map((section, i) => ({ id: `section-${i}`, title: section.title })),
    { id: "article-summary", title: "สรุปท้ายเรื่อง" },
    ...(linkedTools.length ? [{ id: "article-experiments", title: "ทดลองประกอบเรื่องนี้" }] : []),
    ...(a.terms?.length ? [{ id: "glossary", title: "คำศัพท์สำคัญ" }] : []),
    { id: "sources", title: "เอกสารอ้างอิงและแหล่งข้อมูล" },
  ];
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const sections = Array.from(body.querySelectorAll<HTMLElement>("section[id]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const activeOffset = window.matchMedia("(max-width: 760px)").matches ? 110 : 150;
      const current = sections.filter((section) => section.getBoundingClientRect().top <= activeOffset).at(-1);
      setActiveSection(current?.id || "visual-reference");
      const top = body.getBoundingClientRect().top + window.scrollY;
      const available = body.offsetHeight - Math.min(window.innerHeight - 150, body.offsetHeight);
      setProgress(Math.round(Math.max(0, Math.min(1, (window.scrollY - top + 150) / Math.max(available, 1))) * 100));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule, { rootMargin: "-100px 0px -55% 0px", threshold: [0, 0.1] });
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [a.id]);
  const course = courseForArticle(a);
  const related = articles
    .filter(
      (b) =>
        b.id !== a.id &&
        (courseForArticle(b).id === course.id ||
          Boolean(a.tool && b.tool === a.tool)),
    )
    .slice(0, 3);
  return (
    <>
      <div className="article-breadcrumb">
        <Link href="/discover">คลังเนื้อหา</Link>
        <span>/</span>
        <Link href={`/grades/${course.grade}`}>ม.{course.grade}</Link>
        <span>/</span>
        <Link href={`/courses/${course.id}`}>{course.code}</Link>
      </div>
      <header className="reader-heading reader-heading-refresh">
        <span className="journal-kicker">
          {`ม.${course.grade} / ${course.code} / ${course.title}`}
        </span>
        <h1>{a.title}</h1>
        <p>{a.intro}</p>
        <div className="reader-meta">
          <span>
            <BookOpen size={16} />
            อ่านประมาณ {readingMinutes(a)} นาที
          </span>
          <a className="reader-atlas-jump" href="#visual-reference">ดูแผ่นภาพสรุป <ArrowRight size={14} /></a>
          <span>ทบทวนหลักเคมี <time dateTime="2026-10-23">23 ต.ค. 2569</time></span>
          <button
            disabled={!list.ready}
            onClick={() => list.toggle(a.id)}
            aria-pressed={saved}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
            {saved ? "บันทึกไว้อ่านแล้ว" : "เก็บไว้อ่าน"}
          </button>
        </div>
      </header>
      <div className="reader-reading-tools">
        <div>
          <Highlighter size={17} />
          <span>
            สีเหลือง: สาระสำคัญ · กรอบเขียว: ตัวอย่าง · กรอบส้ม: ข้อควรระวัง
          </span>
        </div>
        <button
          aria-pressed={highlightsOn}
          onClick={() => setHighlightsOn((v) => !v)}
        >
          <Highlighter size={16} />
          {highlightsOn ? "ปิดไฮไลต์" : "เปิดไฮไลต์"}
        </button>
      </div>
      <details className="reader-mobile-directory">
        <summary><List size={18} /> สารบัญเรื่องนี้ <ChevronDown size={17} /></summary>
        <nav aria-label="สารบัญบทความบนมือถือ">
          {sectionLinks.map((section) => (
            <a key={section.id} href={`#${section.id}`} aria-current={activeSection === section.id ? "location" : undefined}
              onClick={(event) => { const details = event.currentTarget.closest("details"); if (details) details.open = false; }}>
              {section.title}
            </a>
          ))}
        </nav>
      </details>
      {foundations.length > 0 && (
        <div className="reader-foundations">
          <BookOpen size={18} />
          <div><strong>พื้นฐานที่เกี่ยวข้อง</strong><span>เลือกเปิดอ่านเพิ่มได้ตามต้องการ</span></div>
          <div>{foundations.map((foundation) => <Link key={foundation.id} href={`/read/${foundation.id}`}>{foundation.title}<ArrowUpRight size={14} /></Link>)}</div>
        </div>
      )}
      <div className="reader-layout reader-layout-refresh">
        <article className="reader-body" ref={bodyRef}>
          <div className="reader-takeaway">
            <span className="journal-kicker">สรุปสาระสำคัญ</span>
            {a.keyPoints?.length ? (
              <ul className="key-point-list">
                {a.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : (
              <p>{a.takeaway}</p>
            )}
          </div>
          <section id="visual-reference" className="reader-atlas-section"><ChapterAtlas articleId={a.id} /></section>
          {a.sections.map((s, i) => (
            <section id={`section-${i}`} key={s.title}>
              <h2>{s.title}</h2>
              <p>
                <HighlightedText
                  text={s.text}
                  phrases={s.highlights}
                  enabled={highlightsOn}
                />
              </p>
              {contentFigures[a.id]?.section === s.title && (
                <LearningFigure spec={contentFigures[a.id]} />
              )}
              {supplementaryFigures[a.id]?.filter((spec) => spec.section === s.title).map((spec) => (
                <LearningFigure key={spec.kind} spec={spec} />
              ))}
              {s.formula && (
                <div className="reader-formula">
                  <span>สูตร / ความสัมพันธ์สำคัญ</span>
                  <ScientificFormula text={s.formula} />
                </div>
              )}
              {s.bullets && (
                <ul className="section-point-list">
                  {s.bullets.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div
                  className="content-table-scroll"
                  role="region"
                  aria-label={`ตาราง ${s.title}`}
                  tabIndex={0}
                >
                  <table className="content-table">
                    <thead>
                      <tr>
                        {s.table.headers.map((h) => (
                          <th scope="col" key={h}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {s.example && (
                <aside
                  className="worked-example"
                  aria-label={`ตัวอย่าง ${s.example.title}`}
                >
                  <div className="content-block-label">
                    <Lightbulb size={18} />
                    ตัวอย่างประกอบ
                  </div>
                  <h3>{s.example.title}</h3>
                  <ol>
                    {s.example.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="example-result">
                    <strong>สรุปผล</strong>
                    <p>{s.example.result}</p>
                  </div>
                </aside>
              )}
              {s.note && (
                <aside className="content-caution">
                  <AlertCircle size={19} />
                  <div>
                    <strong>ข้อควรระวัง / จุดที่มักสับสน</strong>
                    <p>{s.note}</p>
                  </div>
                </aside>
              )}
            </section>
          ))}
          <section className="reader-end-summary" id="article-summary">
            <span className="journal-kicker">ทบทวนใจความสำคัญ</span>
            <h2>สรุปท้ายเรื่อง</h2>
            <p>{a.takeaway}</p>
            <a href="#section-0">กลับไปต้นเนื้อหา ↑</a>
          </section>
          {linkedTools.length > 0 && (
            <section className="reader-linked-tools" id="article-experiments">
              <span className="journal-kicker">จากแนวคิดสู่ภาพจำลอง</span>
              <h2>ทดลองประกอบเรื่องนี้</h2>
              <p>ปรับตัวแปรและสังเกตผล ควบคู่กับสมมติฐานที่ระบุในแต่ละเครื่องมือ</p>
              <div>{linkedTools.map((tool) => (
                <Link href={tool.href} key={tool.href}>
                  <span><FlaskConical size={21} /></span>
                  <div><h3>{tool.title}</h3><p>{tool.description}</p></div>
                  <ArrowUpRight size={18} />
                </Link>
              ))}</div>
            </section>
          )}
          {a.terms?.length && (
            <section className="content-glossary" id="glossary">
              <span className="journal-kicker">KEY TERMS</span>
              <h2>คำศัพท์สำคัญ</h2>
              <dl>
                {a.terms.map((t) => (
                  <div key={t.term}>
                    <dt>{t.term}</dt>
                    <dd>{t.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <section className="reader-sources" id="sources">
            <span className="journal-kicker">KEEP EXPLORING</span>
            <h2>เอกสารอ้างอิงและแหล่งข้อมูล</h2>
            {a.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.name}
                <ArrowUpRight size={16} />
              </a>
            ))}
            <p>
              ใช้แหล่งข้อมูลเหล่านี้อ่านรายละเอียดและตรวจเงื่อนไขเพิ่มเติม
              ภาพและตัวอย่างในบทความเป็นสื่ออธิบายแนวคิด ไม่ใช่ผลการทดลองที่วัดจริง
            </p>
          </section>
          <div className="reader-tags">
            {a.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        </article>
        <aside className="reader-toc reader-toc-refresh">
          <span className="journal-kicker">ในเรื่องนี้</span>
          <div className="reader-position">
            <span>ตำแหน่งการอ่าน <b>{progress}%</b></span>
            <div role="progressbar" aria-label="ตำแหน่งการอ่าน" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
          </div>
          <nav aria-label="สารบัญบทความ">
            {sectionLinks.map((section, i) => (
              <a href={`#${section.id}`} key={section.id} aria-current={activeSection === section.id ? "location" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>{section.title}
              </a>
            ))}
          </nav>
          <div>
            <Bookmark size={20} />
            <h3>บันทึกเนื้อหานี้</h3>
            <p>เปิดอ่านซ้ำได้จากรายการเนื้อหาที่บันทึกไว้</p>
            <button onClick={() => list.toggle(a.id)} disabled={!list.ready}>
              {saved ? "นำออกจากรายการอ่าน" : "บันทึกเรื่องนี้"}{" "}
              <ArrowUpRight size={15} />
            </button>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="journal-section">
          <div className="journal-section-heading">
            <div>
              <span className="journal-kicker">RELATED CONTENT</span>
              <h2>เนื้อหาที่เกี่ยวข้อง</h2>
            </div>
          </div>
          <div className="story-grid">
            {related.map((b) => (
              <ArticleCard key={b.id} article={b} list={list} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
export function KnowledgeAbout() {
  return (
    <>
      <JournalHeading
        eyebrow="ABOUT THE CONTENT LIBRARY"
        title="คลังเนื้อหาเคมีระดับมัธยมศึกษาตอนปลาย"
        description="แหล่งรวมเนื้อหา ม.4 ม.5 และ ม.6 พร้อมภาพประกอบและเครื่องมือทางเคมี"
      />
      <div className="knowledge-about">
        <p className="about-lead">
          รวบรวมเนื้อหาโดยจัดตามระดับชั้น รายวิชา และหัวข้อ
          <br />
          สำหรับค้นคว้า อ่านทบทวน และใช้อ้างอิงประกอบการศึกษา
        </p>
        <div className="about-values">
          <section>
            <span>01 / โครงสร้างเนื้อหา</span>
            <h2>ระดับชั้นและรายวิชา</h2>
            <p>
              เนื้อหาแบ่งเป็น ม.4 ม.5 และ ม.6 ภายใต้รายวิชาตามขอบเขตโครงการ
              แสดงเฉพาะหัวข้อที่เปิดอ่านได้แล้ว
              ไม่ได้อ้างว่าเป็นสารบัญครบหลักสูตรของโรงเรียน
            </p>
          </section>
          <section>
            <span>02 / สื่อประกอบ</span>
            <h2>ภาพ สูตร และเครื่องมือ</h2>
            <p>
              หัวข้อเนื้อหามีคำอธิบาย ภาพโครงสร้าง สูตรที่เกี่ยวข้อง
              และเครื่องมือจำลองในหัวข้อที่รองรับ โดยระบุสมมติฐานและข้อจำกัด
            </p>
          </section>
          <section>
            <span>03 / เอกสารอ้างอิง</span>
            <h2>แหล่งข้อมูลตรวจสอบได้</h2>
            <p>
              ใช้แหล่งข้อมูลอย่าง OpenStax และ PubChem
              พร้อมลิงก์อ้างอิงในหน้าเนื้อหา ข้อความเป็นการเรียบเรียงของโครงการ
            </p>
          </section>
        </div>
        <h2>การเข้าถึงเนื้อหา</h2>
        <p>
          เปิดอ่านหัวข้อใดก็ได้โดยไม่ต้องเข้าสู่ระบบ
          ไม่มีคะแนนหรือการบังคับลำดับการอ่าน
          รายการบันทึกเก็บอยู่ในเบราว์เซอร์ของแต่ละอุปกรณ์
        </p>
        <h2>ขอบเขตของเนื้อหา</h2>
        <p>
          เนื้อหา ภาพ และการทดลองจำลองใช้เพื่ออธิบายหลักเคมี
          ควรอ่านเงื่อนไขและข้อจำกัดของแต่ละแบบจำลองประกอบการแปลผล
        </p>
      </div>
    </>
  );
}
