import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Layers,
  Atom,
  ChartNoAxesCombined,
} from "lucide-react";
import { articles, courses, articlesForCourse } from "@/data/knowledge";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleArt } from "./article-art";
import { ArticleCard } from "./article-card";
export function KnowledgeHome({ list }: { list: ReadingList }) {
  return (
    <>
      <section className="library-hero">
        <div>
          <span className="journal-kicker">CHEMISTRY CONTENT LIBRARY</span>
          <h1>
            คลังเนื้อหาเคมี
            <br />
            <span>ม.4 · ม.5 · ม.6</span>
          </h1>
          <p>
            รวมเนื้อหาแยกตามระดับชั้นและรายวิชา
            <br />
            พร้อมคำอธิบาย ภาพประกอบ สูตรสำคัญ และเครื่องมือจำลอง
          </p>
          <div className="journal-hero-actions">
            <Link className="journal-button" href="/discover">
              ดูเนื้อหาทั้งหมด <ArrowRight size={17} />
            </Link>
            <Link className="journal-text-link" href="/tools">
              เครื่องมือประกอบเนื้อหา <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="library-hero-index">
          <span className="journal-kicker">CONTENT DIRECTORY</span>
          <h2>เลือกเนื้อหาตามระดับชั้น</h2>
          {["4", "5", "6"].map((grade, i) => (
            <Link key={grade} href={`/grades/${grade}`}>
              <span>ม.{grade}</span>
              <div>
                <strong>
                  {
                    [
                      "พื้นฐานและปริมาณสาร",
                      "ปฏิกิริยาและเคมีอินทรีย์",
                      "วัสดุและการประยุกต์",
                    ][i]
                  }
                </strong>
                <small>
                  {courses
                    .filter((c) => c.grade === grade)
                    .map((c) => c.code)
                    .join(" · ")}
                </small>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="journal-section library-level-section">
        <div className="journal-section-heading">
          <div>
            <span className="journal-kicker">BROWSE BY GRADE</span>
            <h2>เนื้อหาตามระดับชั้น</h2>
          </div>
          <Link href="/discover">
            สารบัญเนื้อหาทั้งหมด <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grade-shelf">
          {["4", "5", "6"].map((grade, i) => (
            <section className={`grade-card grade-${grade}`} key={grade}>
              <Link href={`/grades/${grade}`} className="grade-card-heading">
                <span>
                  ม.<b>{grade}</b>
                </span>
                <div>
                  <small>มัธยมศึกษาปีที่ {grade}</small>
                  <h3>
                    {
                      [
                        "พื้นฐานเคมี",
                        "ปฏิกิริยาและสารอินทรีย์",
                        "พอลิเมอร์และการบูรณาการ",
                      ][i]
                    }
                  </h3>
                </div>
                <ArrowUpRight size={19} />
              </Link>
              <div>
                {courses
                  .filter((c) => c.grade === grade)
                  .map((c) => (
                    <Link href={`/courses/${c.id}`} key={c.id}>
                      <span>
                        {c.code}
                        {c.semester ? ` · เทอม ${c.semester}` : ""}
                      </span>
                      <h4>{c.title}</h4>
                      <small>
                        {articlesForCourse(c.id).length} หัวข้อที่เปิดอ่านได้{" "}
                        <ArrowRight size={14} />
                      </small>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <section className="journal-section">
        <div className="journal-section-heading">
          <div>
            <span className="journal-kicker">CONTENT INDEX</span>
            <h2>สารบัญแยกตามรายวิชา</h2>
          </div>
          <span className="library-count">{articles.length} หัวข้อเนื้อหา</span>
        </div>
        <div className="course-directory">
          {courses.map((c) => (
            <section key={c.id}>
              <header>
                <span className={`course-grade-tag grade-${c.grade}`}>
                  ม.{c.grade}
                </span>
                <div>
                  <span>
                    {c.code}
                    {c.semester ? ` · ภาคเรียนที่ ${c.semester}` : ""}
                  </span>
                  <Link href={`/courses/${c.id}`}>
                    <h3>{c.title}</h3>
                  </Link>
                </div>
                <Link
                  href={`/courses/${c.id}`}
                  aria-label={`ดูเนื้อหา ${c.code}`}
                >
                  <ArrowUpRight size={19} />
                </Link>
              </header>
              <div>
                {articlesForCourse(c.id).map((a, i) => (
                  <Link key={a.id} href={`/read/${a.id}`}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{a.title}</strong>
                    <small>
                      {a.tool ? "มีเครื่องมือประกอบ" : "เนื้อหาและภาพประกอบ"}
                    </small>
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="curriculum-note">
          รายวิชาจัดตามขอบเขตโครงการ แสดงเฉพาะหัวข้อที่มีเนื้อหาแล้ว
          ไม่ใช่สารบัญหรือหลักสูตรฉบับสมบูรณ์อย่างเป็นทางการ
        </p>
      </section>
      <section className="journal-section">
        <div className="journal-section-heading">
          <div>
            <span className="journal-kicker">
              CONTENT WITH VISUAL EXPLANATIONS
            </span>
            <h2>เนื้อหาพร้อมภาพประกอบ</h2>
          </div>
          <Link href="/discover">
            ดูเนื้อหาทั้งหมด <ArrowRight size={17} />
          </Link>
        </div>
        <div className="story-grid">
          {[articles[1], articles[0], articles[6]].map((a) => (
            <ArticleCard key={a.id} article={a} list={list} />
          ))}
        </div>
      </section>
      <section className="interactive-invite">
        <div>
          <span className="journal-kicker">REFERENCE TOOLS</span>
          <h2>
            เครื่องมือประกอบ
            <br />
            การอ่านเนื้อหา
          </h2>
          <p>
            ภาพการเชื่อมต่อของอะตอมและกราฟทางเคมี
            <br />
            สำหรับดูตัวอย่างควบคู่กับคำอธิบาย
          </p>
          <Link className="journal-button" href="/tools">
            ดูเครื่องมือทั้งหมด <ArrowRight size={17} />
          </Link>
        </div>
        <div className="invite-tools">
          <Link href="/explorer">
            <span className="invite-symbol">
              <Atom size={35} strokeWidth={1.2} />
            </span>
            <div>
              <h3>โครงสร้างและหมู่ฟังก์ชัน</h3>
              <p>ภาพอะตอม พันธะ และการระบุหมู่ฟังก์ชัน</p>
            </div>
            <ArrowUpRight size={19} />
          </Link>
          <Link href="/tools/kinetics">
            <span className="invite-symbol">
              <ChartNoAxesCombined size={35} strokeWidth={1.2} />
            </span>
            <div>
              <h3>กราฟความเข้มข้นกับเวลา</h3>
              <p>แบบจำลองอันดับหนึ่งและครึ่งชีวิต</p>
            </div>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}
