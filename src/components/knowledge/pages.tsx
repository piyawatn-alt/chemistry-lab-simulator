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
} from "lucide-react";
import {
  articles,
  topics,
  searchArticles,
  topicName,
  type Article,
  readingMinutes,
} from "@/data/knowledge";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleCard } from "./article-card";
import { ArticleArt } from "./article-art";
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
}: {
  list: ReadingList;
  topic?: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(topic);
  const found = searchArticles(query).filter(
    (a) => filter === "all" || a.topic === filter,
  );
  return (
    <>
      <JournalHeading
        eyebrow="THE KNOWLEDGE COLLECTION"
        title={topic === "all" ? "ตามความสงสัยของคุณไป" : topicName(topic)}
        description="เลือกเรื่องที่สนใจ ค้นหาคำที่สงสัย หรือเปิดอ่านโดยไม่ต้องเรียงลำดับ"
      />
      <div className="discovery-search">
        <Search size={21} />
        <input
          aria-label="ค้นหาในคลังความรู้"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ลองค้นหา การละลาย แอสไพริน หรือหมู่ฟังก์ชัน"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="ล้างคำค้น">
            ล้าง
          </button>
        )}
      </div>
      <div className="journal-filters" aria-label="หมวดหมู่ความรู้">
        {topics.map((t) => (
          <button
            key={t.id}
            aria-pressed={filter === t.id}
            onClick={() => setFilter(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="collection-count">
        <span>{found.length} เรื่องที่เลือกอ่านได้</span>
        <span>ภาพประกอบ · คำอธิบาย · แหล่งอ้างอิง</span>
      </div>
      {found.length ? (
        <div className="story-grid collection-grid">
          {found.map((a) => (
            <ArticleCard key={a.id} article={a} list={list} />
          ))}
        </div>
      ) : (
        <div className="journal-empty">
          <Search size={30} />
          <h2>ยังไม่พบเรื่องนี้ในคลัง</h2>
          <p>ลองใช้คำสั้นลง เช่น “น้ำ” “เอไมด์” หรือเลือกหมวดอื่น</p>
          <button
            className="journal-button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            กลับไปดูทุกเรื่อง
          </button>
        </div>
      )}
    </>
  );
}
export function ReadingShelf({ list }: { list: ReadingList }) {
  const saved = articles.filter((a) => list.saved.includes(a.id));
  return (
    <>
      <JournalHeading
        eyebrow="YOUR READING SHELF"
        title="เก็บความสงสัย ไว้อ่านต่อ"
        description="เรื่องที่คุณบันทึกไว้บนเบราว์เซอร์นี้ เลือกอ่านตอนไหนก็ได้"
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
            หาเรื่องน่าอ่าน <ArrowRight size={17} />
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
        title="ลองมอง ลองเปลี่ยน แล้วเข้าใจ"
        description="เครื่องมือเล็ก ๆ ที่ช่วยให้เรื่องในบทความมองเห็นได้ชัดขึ้น เปิดใช้ได้ทันที"
      />
      <div className="knowledge-tools">
        <Link href="/explorer">
          <ArticleArt visual="acid" />
          <div className="knowledge-tool-copy">
            <span className="journal-kicker">MOLECULE EXPLORER</span>
            <h2>จากตัวอักษร สู่ภาพของโมเลกุล</h2>
            <p>
              แตะอะตอม ดูความหมายของพันธะ และสังเกตว่าแอลกอฮอล์ กรดคาร์บอกซิลิก
              เอสเทอร์ และเอไมด์ต่างกันตรงไหน
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
            <h2>เมื่อความเข้มข้นค่อย ๆ เปลี่ยนไป</h2>
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
  const saved = list.saved.includes(a.id);
  const related = articles
    .filter((b) => b.id !== a.id && (b.topic === a.topic || b.tool === a.tool))
    .slice(0, 3);
  return (
    <>
      <div className="article-breadcrumb">
        <Link href="/discover">คลังความรู้</Link>
        <span>/</span>
        <Link href={`/topics/${a.topic}`}>{topicName(a.topic)}</Link>
      </div>
      <header className="reader-heading">
        <span className="journal-kicker">
          {topics.find((t) => t.id === a.topic)?.label}
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
      <div className="reader-cover">
        <ArticleArt
          visual={a.visual}
          large
          conceptOnly={a.topic === "medicine"}
        />
        <span>
          ภาพประกอบแนวคิด
          {a.topic === "medicine"
            ? " · เป็นตัวอย่างหมู่ฟังก์ชัน ไม่ใช่โครงสร้างสารยาที่กล่าวถึง"
            : ""}
        </span>
      </div>
      <div className="reader-layout">
        <article className="reader-body">
          <div className="reader-takeaway">
            <span className="journal-kicker">ประเด็นที่อยากชวนจำ</span>
            <p>{a.takeaway}</p>
          </div>
          {a.sections.map((s, i) => (
            <section id={`section-${i}`} key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              {s.formula && <div className="reader-formula">{s.formula}</div>}
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
                <h3>ลองมองเรื่องนี้ด้วยตัวเอง</h3>
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
          <section className="reader-sources" id="sources">
            <span className="journal-kicker">KEEP EXPLORING</span>
            <h2>แหล่งข้อมูลสำหรับอ่านต่อ</h2>
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
          <a href="#sources">แหล่งข้อมูลสำหรับอ่านต่อ</a>
          <div>
            <Bookmark size={20} />
            <h3>เก็บเรื่องนี้ไว้ก่อนก็ได้</h3>
            <p>ความสงสัยไม่จำเป็นต้องจบในครั้งเดียว</p>
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
              <span className="journal-kicker">
                ONE QUESTION LEADS TO ANOTHER
              </span>
              <h2>ถ้ายังสงสัย ลองอ่านเรื่องนี้ต่อ</h2>
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
        eyebrow="ABOUT CHEMLAB RX"
        title="ให้เคมี อยู่ใกล้ความเข้าใจมากขึ้น"
        description="Explore Chemistry, Understand Medicine."
      />
      <div className="knowledge-about">
        <p className="about-lead">
          เราอยากให้การอ่านเรื่องเคมี เริ่มต้นจากคำถามที่คุ้นเคย
          <br />
          แล้วค่อย ๆ พาไปเห็นสิ่งที่ซ่อนอยู่ในระดับโมเลกุล
        </p>
        <div className="about-values">
          <section>
            <span>01 / เรื่องราว</span>
            <h2>เริ่มจากโลกจริง</h2>
            <p>
              น้ำ สารละลาย วัสดุ และโมเลกุลในยา ล้วนมีแนวคิดทางเคมีที่น่าสงสัย
              เลือกอ่านเฉพาะเรื่องที่อยากรู้ได้เลย
            </p>
          </section>
          <section>
            <span>02 / ภาพและเครื่องมือ</span>
            <h2>เปลี่ยนคำอธิบายให้มองเห็น</h2>
            <p>
              แผนภาพอะตอมที่กดได้ และกราฟที่ปรับค่าได้
              เป็นอีกวิธีช่วยทำความเข้าใจ โดยระบุสมมติฐานและข้อจำกัดอย่างชัดเจน
            </p>
          </section>
          <section>
            <span>03 / แหล่งข้อมูล</span>
            <h2>รู้ว่าข้อมูลมาจากไหน</h2>
            <p>
              ทุกบทความมีแหล่งอ้างอิงสำหรับอ่านต่อ เช่น OpenStax และ PubChem
              เนื้อหาเรียบเรียงโดยโครงการ ไม่ใช่บทความวิจัยต้นฉบับ
            </p>
          </section>
        </div>
        <h2>อ่านได้อิสระ เก็บไว้ได้ตามใจ</h2>
        <p>
          ไม่มีลำดับบังคับ ไม่มีคะแนน และไม่ต้องเข้าสู่ระบบ
          รายการที่เก็บไว้อ่านอยู่ในเบราว์เซอร์ของคุณ
        </p>
        <h2>เคมีกับยา ต้องแยกขอบเขตให้ชัด</h2>
        <p>
          บทความเกี่ยวกับสารยาอธิบายโครงสร้างและสมบัติทางเคมี
          ไม่ใช่คำแนะนำให้เลือกใช้ยา เปลี่ยนขนาดยา หรือวินิจฉัยโรค
          ข้อมูลทางสุขภาพควรปรึกษาเภสัชกรหรือแพทย์
        </p>
      </div>
    </>
  );
}
