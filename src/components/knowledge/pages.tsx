"use client";
import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";
import {
  articles,
  topics,
  searchArticles,
  topicName,
  type Article,
  readingMinutes,
  courses,
  courseForArticle,
  articlesForCourse,
} from "@/data/knowledge";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleCard } from "./article-card";
import { LearningFigure } from "./learning-figure";
import { contentFigures } from "@/data/knowledge/figures";
import { HighlightedText } from "./highlighted-text";
import { ScientificFormula } from "@/components/ui/scientific-formula";
import { ArticleArt } from "./article-art";
import { ExperimentGallery } from "@/components/simulators/experiment-gallery";
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
export function Discover({
  list,
  topic = "all",
  grade = "all",
  course = "all",
}: {
  list: ReadingList;
  topic?: string;
  grade?: string;
  course?: string;
}) {
  const initialCourse = courses.find((c) => c.id === course);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(initialCourse?.grade || grade);
  const [selectedCourse, setCourse] = useState(course);
  const matching = searchArticles(query).filter((a) => {
    const c = courseForArticle(a);
    return (
      (level === "all" || c.grade === level) &&
      (selectedCourse === "all" || c.id === selectedCourse) &&
      (topic === "all" || a.topic === topic)
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อหัวข้อ เช่น พันธะเคมี ความเข้มข้น หรือหมู่ฟังก์ชัน"
        />
        {query && (
          <button aria-label="ล้างคำค้น" onClick={() => setQuery("")}>
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
      <div className="collection-count">
        <span>{matching.length} หัวข้อเนื้อหา</span>
        <span>คำอธิบาย · ภาพประกอบ · สูตรสำคัญ</span>
      </div>
      {matching.length ? (
        <div className="story-grid collection-grid">
          {matching.map((a) => (
            <ArticleCard key={a.id} article={a} list={list} />
          ))}
        </div>
      ) : (
        <div className="journal-empty">
          <Search size={30} />
          <h2>ไม่พบเนื้อหาที่ตรงกับตัวกรอง</h2>
          <p>เปลี่ยนคำค้น ระดับชั้น หรือรายวิชาเพื่อดูเนื้อหาอื่น</p>
          <button
            className="journal-button"
            onClick={() => {
              setQuery("");
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
      <header className="reader-heading">
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
          <span>เรียบเรียงโดย ChemLab RX</span>
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
      <div className="reader-layout">
        <article className="reader-body">
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
          {a.tool && (
            <div className="reader-tool-invite">
              <span>
                {a.tool === "explorer" ? (
                  <Atom size={26} />
                ) : (
                  <ChartNoAxesCombined size={26} />
                )}
              </span>
              <div>
                <h3>เครื่องมือประกอบหัวข้อนี้</h3>
                <p>
                  {a.tool === "explorer"
                    ? "เปิดภาพโมเลกุล แล้วแตะดูส่วนที่เพิ่งอ่าน"
                    : "ขยับตัวแปร แล้วดูเส้นกราฟเปลี่ยนไป"}
                </p>
                <Link
                  href={a.tool === "explorer" ? "/explorer" : "/tools/kinetics"}
                >
                  เปิดเครื่องมือสำรวจ <ArrowRight size={17} />
                </Link>
              </div>
            </div>
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
              เรียบเรียงเพื่ออธิบายแนวคิดทางเคมี ไม่ใช้แทนคำแนะนำทางการแพทย์
              หรือข้อมูลสำหรับเลือกใช้และกำหนดขนาดยา
            </p>
          </section>
          <div className="reader-tags">
            {a.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        </article>
        <aside className="reader-toc">
          <span className="journal-kicker">ในเรื่องนี้</span>
          {a.sections.map((s, i) => (
            <a href={`#section-${i}`} key={s.title}>
              {s.title}
            </a>
          ))}
          {a.terms?.length && <a href="#glossary">คำศัพท์สำคัญ</a>}
          <a href="#sources">เอกสารอ้างอิงและแหล่งข้อมูล</a>
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
