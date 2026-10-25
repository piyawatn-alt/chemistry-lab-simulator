"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Search, BookOpen, FlaskConical, Atom, Scale, Timer, Droplets, Hexagon, Zap, Ruler, ScanLine, Brain, Sigma, Layers } from "lucide-react";
import { articles, courses, articlesForCourse } from "@/data/knowledge";
import { allRecallGuides, recallGuides } from "@/data/knowledge/recall";
import { author } from "@/data/site";
import { chemistrySubjects } from "@/lib/content/search";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleCard } from "./article-card";
import { ConceptPreview } from "./concept-preview";
import { ExperimentPreview } from "@/components/simulators/experiment-previews";
const subjectIcons = [Atom, Scale, Timer, Droplets, Hexagon, Zap, Ruler];
const visualTopics = [
  { variant: "atom" as const, label: "อะตอม", title: "ชนิดธาตุเริ่มที่จำนวนโปรตอน", text: "Na มี 11 โปรตอน เมื่อเสียอิเล็กตรอนเป็น Na⁺ ก็ยังเป็นโซเดียม เพราะโปรตอนไม่เปลี่ยน", article: "atomic-structure" },
  { variant: "water" as const, label: "โมเลกุล", title: "รูปร่างทำให้ขั้วไม่หักล้างกัน", text: "น้ำมีรูปร่างงอ ด้าน O เป็นลบบางส่วน ด้าน H เป็นบวกบางส่วน จึงจัดเรียงตัวล้อมรอบไอออนได้", article: "why-water-dissolves" },
  { variant: "gas" as const, label: "แก๊ส", title: "เปลี่ยนปริมาตร โดยอนุภาคเท่าเดิม", text: "สำหรับแก๊สอุดมคติ เมื่อ T และ n คงที่ เพิ่มความดันสองเท่า ปริมาตรจะเหลือครึ่งหนึ่ง", article: "states-ideal-gas" },
];
const paths = [
  { label: "อ่านเนื้อหา", description: "เลือกชั้นและหัวข้อที่ต้องการ", href: "/discover", icon: BookOpen, tone: "teal" },
  { label: "ดูภาพสรุป", description: "แผ่นภาพประจำบท 108 ช่อง", href: "/read/small-groups-big-difference#visual-reference", icon: ScanLine, tone: "blue" },
  { label: "สูตรและวิธีจำ", description: "คำท่องสั้น พร้อมความหมาย", href: "/formulas", icon: Brain, tone: "amber" },
  { label: "ลองการทดลอง", description: "ปรับตัวแปร แล้วดูผล", href: "/tools/experiments", icon: FlaskConical, tone: "purple" },
];
export function KnowledgeHome({ list }: { list: ReadingList }) {
  const [visual, setVisual] = useState(0);
  const selected = visualTopics[visual];
  const featured = ["atomic-structure", "why-water-dissolves", "small-groups-big-difference"].map(id => articles.find(a => a.id === id)).filter(a => a !== undefined);
  const formulaCount = allRecallGuides.reduce((sum, guide) => sum + guide.formulas.length, 0);
  const memoryCount = allRecallGuides.reduce((sum, guide) => sum + guide.memoryAids.length, 0);
  return <>
    <section className="clarity-hero">
      <div className="clarity-hero-copy">
        <span className="clarity-eyebrow"><span /> พื้นที่เรียนรู้เคมีด้วยตัวเอง</span>
        <h1>คลังเนื้อหาเคมี<br/><em>ม.4–ม.6</em></h1>
        <p className="clarity-hero-lead">เข้าใจหลักการ <b>เห็นภาพ</b> แล้วจำอย่างมีเหตุผล</p>
        <p className="clarity-hero-description">เนื้อหาที่อธิบายทีละขั้น ภาพสรุปที่เทียบให้เห็นชัด<br className="desktop-break"/> และสูตรที่บอกทั้งวิธีใช้กับเงื่อนไข</p>
        <form action="/discover" className="atlas-search clarity-main-search" role="search">
          <Search size={21} aria-hidden="true"/><input name="q" aria-label="ค้นหาหัวข้อ สูตร หรือคำศัพท์เคมี" placeholder="ค้นหาเนื้อหา เช่น โมล พันธะ หรือ H₂O" required/><button type="submit" aria-label="ค้นหาในคลัง"><ArrowRight size={20}/></button>
        </form>
        <div className="clarity-search-suggestions"><span>เริ่มจาก</span>{["พันธะเคมี", "pH", "หมู่ฟังก์ชัน"].map(term => <Link key={term} href={`/discover?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div>
        <div className="atlas-home-grade-shortcuts"><span>เลือกตามชั้น</span>{["4", "5", "6"].map(grade => <Link key={grade} href={`/grades/${grade}`}>ม.{grade}<ArrowUpRight size={13}/></Link>)}</div>
        <div className="clarity-live-facts"><span><b>{articles.length}</b> บทเนื้อหา</span><span><b>{formulaCount}</b> สูตรและความสัมพันธ์</span><span><b>7</b> การทดลอง</span></div>
      </div>
      <div className="clarity-visual atlas-visual-card">
        <div className="clarity-visual-top"><span>เคมีในภาพเดียว</span><span>0{visual + 1} / 03</span></div>
        <div className="atlas-visual-tabs" role="group" aria-label="เลือกภาพแนวคิดเคมี">{visualTopics.map((item, i) => <button key={item.variant} type="button" aria-pressed={i === visual} onClick={() => setVisual(i)}>{item.label}</button>)}</div>
        <div className="atlas-visual-stage"><ConceptPreview variant={selected.variant}/></div>
        <div className="atlas-visual-copy" aria-live="polite"><h2>{selected.title}</h2><p>{selected.text}</p><Link href={`/read/${selected.article}`}>เปิดคำอธิบายและภาพสรุป <ArrowUpRight size={17}/></Link></div>
      </div>
    </section>
    <nav className="clarity-entry-paths" aria-label="เลือกรูปแบบการสำรวจ">{paths.map(path => <Link key={path.href} href={path.href} className={`clarity-entry path-${path.tone}`}><span><path.icon size={24} strokeWidth={1.7}/></span><div><strong>{path.label}</strong><p>{path.description}</p></div><ArrowUpRight size={17}/></Link>)}</nav>
    <section className="clarity-section" aria-labelledby="grade-heading">
      <div className="clarity-section-heading"><div><span className="clarity-eyebrow">01 / เนื้อหาตามระดับชั้น</span><h2 id="grade-heading">เลือกบทที่ต้องการอ่าน</h2></div><Link href="/discover">ดูเนื้อหาทั้งหมด <ArrowRight size={17}/></Link></div>
      <div className="clarity-grade-grid">{["4", "5", "6"].map((grade, i) => <Link key={grade} href={`/grades/${grade}`} className={`clarity-grade grade-hue-${i}`}><div className="clarity-grade-top"><span>ม.<b>{grade}</b></span><ArrowUpRight size={23}/></div><h3>{["พื้นฐานและปริมาณสาร", "ปฏิกิริยาและสารอินทรีย์", "วัสดุและการประยุกต์"][i]}</h3><p>{courses.filter(course => course.grade === grade).map(course => course.title).join(" · ")}</p><span className="clarity-grade-count">{courses.filter(course => course.grade === grade).reduce((sum, course) => sum + articlesForCourse(course.id).length, 0)} หัวข้อที่เปิดอ่านได้ <ArrowRight size={15}/></span></Link>)}</div>
      <p className="clarity-scope-note">จัดชั้นตามขอบเขตของคลังนี้ โรงเรียนอาจจัดลำดับต่างกัน และยังไม่ใช่สารบัญครบหลักสูตรอย่างเป็นทางการ</p>
    </section>
    <section className="clarity-section" aria-labelledby="subjects-heading">
      <div className="clarity-section-heading"><div><span className="clarity-eyebrow">02 / เนื้อหาตามแนวคิด</span><h2 id="subjects-heading">เชื่อมเรื่องที่เกี่ยวข้องเข้าด้วยกัน</h2></div><span className="clarity-heading-note">เลือกอ่านได้อิสระ</span></div>
      <div className="clarity-subject-grid">{chemistrySubjects.map((subject, i) => {const Icon = subjectIcons[i] || Layers; return <Link className="atlas-subject clarity-subject" href={`/discover?subject=${subject.id}`} key={subject.id}><span className={`clarity-subject-icon hue-${i % 4}`}><Icon size={24} strokeWidth={1.6}/></span><div><h3>{subject.title}</h3><p>{subject.description}</p><small>{subject.articleIds.length} หัวข้อ <ArrowRight size={14}/></small></div></Link>;})}</div>
    </section>
    <section className="clarity-memory-section" aria-labelledby="memory-heading">
      <div className="clarity-section-heading"><div><span className="clarity-eyebrow"><Brain size={15}/>03 / เข้าใจก่อน แล้วค่อยจำ</span><h2 id="memory-heading">คำท่องสั้นที่มีเหตุผลอยู่ข้างหลัง</h2><p>แยกให้ชัดระหว่างคำช่วยจำกับสูตรคำนวณ พร้อมบอกขอบเขตทุกครั้ง</p></div><Link href="/formulas">เปิดคลังสูตรและวิธีจำ <ArrowRight size={17}/></Link></div>
      <div className="clarity-memory-grid">{["mole-stoichiometry", "redox-galvanic-cells", "small-groups-big-difference"].map(id => {const guide = recallGuides[id];const memory = guide?.memoryAids[0];const article = articles.find(item => item.id === id);return memory && article ? <Link className="clarity-memory-card" href={`/read/${id}#memory-guide`} key={id}><span>{article.title}</span><h3>“{memory.chant}”</h3><p>{memory.meaning}</p><div><b>ขอบเขตการจำ</b><p>{memory.boundary}</p></div><strong>อ่านวิธีจำของบทนี้ <ArrowUpRight size={16}/></strong></Link> : null;})}</div>
      <div className="clarity-memory-footer"><span><Sigma size={18}/>{formulaCount} สูตรและความสัมพันธ์</span><span><Brain size={18}/>{memoryCount} คำช่วยจำ</span><p>ทุกสูตรมีความหมายตัวแปร เงื่อนไข และตัวอย่างประกอบ</p></div>
    </section>
    <section className="clarity-section" aria-labelledby="visual-heading">
      <div className="clarity-section-heading"><div><span className="clarity-eyebrow">04 / ภาพสรุปประจำบท</span><h2 id="visual-heading">ดูภาพ แล้วอ่านเหตุผลทีละส่วน</h2><p>24 แผ่นภาพ รวม 108 ช่องอธิบาย เปิดขยายเต็มจอได้</p></div><Link href="/discover">เลือกบทเนื้อหา <ArrowRight size={17}/></Link></div>
      <div className="story-grid">{featured.map(article => <ArticleCard key={article.id} article={article} list={list}/>)}</div>
    </section>
    <section className="clarity-section clarity-lab-section" aria-labelledby="labs-heading">
      <div className="clarity-section-heading"><div><span className="clarity-eyebrow"><FlaskConical size={15}/>05 / จากหลักการสู่สิ่งที่สังเกตได้</span><h2 id="labs-heading">ลองเปลี่ยนตัวแปร แล้วดูผล</h2><p>เชื่อมคำอธิบายกับภาพ ตัวเลข และกราฟในหน้าเดียว</p></div><Link href="/tools/experiments">ดูทั้ง 7 การทดลอง <ArrowRight size={17}/></Link></div>
      <div className="clarity-lab-grid">{[
        {id:"flame-test" as const,title:"สีเปลวไฟของเกลือโลหะ",text:"เลือกสาร เปรียบเทียบสี และอ่านเรื่องระดับพลังงาน"},
        {id:"neutralization" as const,title:"กรด–เบสและค่า pH",text:"ดูสารที่เหลือก่อนและหลังจุดสมมูล"},
        {id:"gas-pressure" as const,title:"ความดันกับปริมาตรแก๊ส",text:"คงอุณหภูมิและจำนวนโมล แล้วกดลูกสูบ"},
      ].map(item => <Link href={`/tools/${item.id}`} className="clarity-lab-card" key={item.id}><ExperimentPreview id={item.id}/><div><h3>{item.title}</h3><p>{item.text}</p><span>เปิดการทดลอง <ArrowUpRight size={17}/></span></div></Link>)}</div>
      <p className="clarity-scope-note">เป็นแบบจำลองเพื่ออธิบายแนวคิด มีสมมติฐานและข้อจำกัดในแต่ละหน้า</p>
    </section>
    <section className="clarity-section clarity-directory" aria-labelledby="directory-heading">
      <div className="clarity-section-heading"><div><span className="clarity-eyebrow">CONTENT DIRECTORY</span><h2 id="directory-heading">สารบัญรายวิชา</h2></div><BookOpen size={23}/></div>
      <div className="atlas-course-list">{courses.map(course => <details key={course.id}><summary><span className="atlas-course-grade">ม.{course.grade}</span><div><h3>{course.title}</h3><span>{course.code} · {articlesForCourse(course.id).length} หัวข้อ</span></div><span className="atlas-expand">+</span></summary><div className="atlas-course-articles">{articlesForCourse(course.id).map((article, i) => <Link href={`/read/${article.id}`} key={article.id}><span>{String(i+1).padStart(2,"0")}</span>{article.title}<ArrowRight size={15}/></Link>)}<Link className="atlas-course-all" href={`/courses/${course.id}`}>เปิดรายวิชานี้ <ArrowUpRight size={15}/></Link></div></details>)}</div>
    </section>
    <section className="clarity-creator" aria-label="ผู้จัดทำ"><div className="creator-monogram" aria-hidden="true">ปน</div><div><span className="clarity-eyebrow">จัดทำโดย</span><h2>{author.name}</h2><p>{author.role} · {author.school}</p></div><Link href="/about">แนวคิดและแหล่งข้อมูลของเว็บไซต์ <ArrowUpRight size={17}/></Link></section>
  </>;
}
