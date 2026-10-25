"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Search, BookOpen, FlaskConical, Layers, Atom, Compass, Scale, Timer, Droplets, Hexagon, Zap, Ruler } from "lucide-react";
import { articles, courses, articlesForCourse } from "@/data/knowledge";
import { chemistrySubjects } from "@/lib/content/search";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleCard } from "./article-card";
import { ConceptPreview } from "./concept-preview";
import { ExperimentPreview } from "@/components/simulators/experiment-previews";
const subjectIcons = [Atom, Scale, Timer, Droplets, Hexagon, Zap, Ruler];
const visualTopics = [
  { variant: "atom" as const, label: "อะตอม", title: "จากอะตอม สู่สมบัติของสาร", text: "จำนวนโปรตอนบอกชนิดธาตุ ส่วนอิเล็กตรอนเกี่ยวข้องกับการเกิดพันธะและสมบัติทางเคมี", article: "atomic-structure" },
  { variant: "water" as const, label: "โมเลกุล", title: "รูปร่างและขั้ว อธิบายการละลาย", text: "น้ำมีรูปร่างงอและมีขั้ว ด้านออกซิเจนหันเข้าหาไอออนบวกเมื่อจัดเรียงตัวล้อมรอบไอออน", article: "why-water-dissolves" },
  { variant: "gas" as const, label: "แก๊ส", title: "อนุภาคเท่าเดิม ปริมาตรเปลี่ยน", text: "สำหรับแก๊สอุดมคติ เมื่ออุณหภูมิและจำนวนโมลคงที่ เพิ่มความดันเป็นสองเท่า ปริมาตรจะเหลือครึ่งหนึ่ง", article: "states-ideal-gas" },
];
export function KnowledgeHome({ list }: { list: ReadingList }) {
  const [visual, setVisual] = useState(0);
  const selected = visualTopics[visual];
  const featured = ["atomic-structure", "why-water-dissolves", "small-groups-big-difference"].map(id => articles.find(a => a.id === id)).filter(a => a !== undefined);
  return (
    <>
      <section className="atlas-hero">
        <div className="atlas-intro">
          <span className="atlas-eyebrow"><span /> CHEMISTRY, MADE VISIBLE</span>
          <h1>คลังเนื้อหาเคมี<br /><em>ม.4–ม.6</em></h1>
          <p>อ่านหลักการให้เข้าใจ เห็นภาพระดับอนุภาค<br className="desktop-break" /> แล้วลองเปลี่ยนตัวแปรด้วยตัวเอง</p>
          <form action="/discover" className="atlas-search" role="search">
            <Search size={22} aria-hidden="true" />
            <input name="q" aria-label="ค้นหาหัวข้อ สูตร หรือคำศัพท์เคมี" placeholder="ค้นหาเรื่องที่อยากเข้าใจ เช่น โมล หรือ H₂O" required />
            <button type="submit" aria-label="ค้นหาในคลัง"><ArrowRight size={20} /></button>
          </form>
          <div className="atlas-quick-search"><span>ลองค้นหา</span>{["พันธะเคมี", "pH", "หมู่ฟังก์ชัน"].map(term => <Link key={term} href={`/discover?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div>
          <div className="atlas-home-grade-shortcuts"><span>เลือกตามชั้น</span>{["4","5","6"].map(g => <Link key={g} href={`/grades/${g}`}>ม.{g}<ArrowUpRight size={13} /></Link>)}</div>
          <div className="atlas-facts"><span><BookOpen size={16} /> {articles.length} หัวข้อที่เปิดอ่านได้</span><span><FlaskConical size={16} /> 7 การทดลองจำลอง</span></div>
        </div>
        <div className="atlas-visual-card">
          <div className="atlas-visual-top"><span><Compass size={15} /> มองเคมีผ่านภาพ</span><span>0{visual + 1} / 03</span></div>
          <div className="atlas-visual-tabs" role="group" aria-label="เลือกภาพแนวคิดเคมี">{visualTopics.map((item, i) => <button type="button" key={item.variant} aria-pressed={visual === i} onClick={() => setVisual(i)}>{item.label}</button>)}</div>
          <div className="atlas-visual-stage"><ConceptPreview variant={selected.variant} /></div>
          <div className="atlas-visual-copy" aria-live="polite"><h2>{selected.title}</h2><p>{selected.text}</p><Link href={`/read/${selected.article}`}>อ่านแนวคิดนี้ <ArrowUpRight size={17} /></Link></div>
        </div>
      </section>
      <section className="atlas-section atlas-grade-section" aria-labelledby="grade-heading">
        <div className="atlas-section-title"><div><span className="atlas-eyebrow">01 / เลือกตามระดับชั้น</span><h2 id="grade-heading">เปิดอ่านจากเรื่องที่กำลังเรียน</h2></div><Link href="/discover">ดูเนื้อหาทั้งหมด <ArrowRight size={17} /></Link></div>
        <div className="atlas-grades">{["4", "5", "6"].map((grade, i) => <Link key={grade} href={`/grades/${grade}`} className={`atlas-grade atlas-grade-${grade}`}><div className="atlas-grade-number">ม.<strong>{grade}</strong></div><div><h3>{["พื้นฐานและปริมาณสาร", "ปฏิกิริยาและสารอินทรีย์", "วัสดุและการประยุกต์"][i]}</h3><p>{courses.filter(c => c.grade === grade).map(c => c.title).join(" · ")}</p></div><ArrowUpRight size={21} /></Link>)}</div>
        <p className="atlas-scope-note">จัดระดับชั้นตามขอบเขตของคลังนี้ โรงเรียนอาจจัดลำดับเนื้อหาต่างกัน</p>
      </section>
      <section className="atlas-section" aria-labelledby="subjects-heading">
        <div className="atlas-section-title"><div><span className="atlas-eyebrow">02 / เลือกตามหัวข้อ</span><h2 id="subjects-heading">เชื่อมเรื่องที่สงสัยกับหลักเคมี</h2></div><span className="atlas-section-hint">เลือกอ่านได้อิสระ</span></div>
        <div className="atlas-subjects">{chemistrySubjects.map((subject, i) => { const Icon = subjectIcons[i] || Layers; return <Link href={`/discover?subject=${subject.id}`} key={subject.id} className="atlas-subject"><span className={`atlas-subject-icon subject-hue-${i % 4}`}><Icon size={23} strokeWidth={1.5} /></span><div><h3>{subject.title}</h3><p>{subject.description}</p><small>{subject.articleIds.length} หัวข้อ <ArrowRight size={14} /></small></div></Link>; })}</div>
      </section>
      <section className="atlas-section" aria-labelledby="visual-heading">
        <div className="atlas-section-title"><div><span className="atlas-eyebrow">03 / อ่านพร้อมภาพ</span><h2 id="visual-heading">เข้าใจภาพใหญ่ แล้วค่อยลงรายละเอียด</h2></div><Link href="/discover">สำรวจทุกหัวข้อ <ArrowRight size={17} /></Link></div>
        <div className="story-grid">{featured.map(a => <ArticleCard key={a.id} article={a} list={list} />)}</div>
      </section>
      <section className="atlas-section atlas-lab-section" aria-labelledby="labs-heading">
        <div className="atlas-section-title"><div><span className="atlas-eyebrow"><FlaskConical size={15} /> 04 / จากเนื้อหาสู่การทดลอง</span><h2 id="labs-heading">ปรับตัวแปร แล้วสังเกตสิ่งที่เปลี่ยน</h2><p>ภาพ ตัวเลข และคำอธิบาย ช่วยเชื่อมหลักการเข้าด้วยกัน</p></div><Link href="/tools/experiments">ดูทั้ง 7 การทดลอง <ArrowRight size={17} /></Link></div>
        <div className="atlas-lab-grid">{[
          { id: "flame-test" as const, label: "โครงสร้างอะตอม", title: "สีเปลวไฟของเกลือโลหะ", text: "เลือกสาร แล้วเปรียบเทียบสีของแสงที่เห็น" },
          { id: "neutralization" as const, label: "กรด–เบส", title: "หยดเบส สำรวจค่า pH", text: "ดูสารที่เหลือและการเปลี่ยนแปลงใกล้จุดสมมูล" },
          { id: "gas-pressure" as const, label: "สมบัติของแก๊ส", title: "กดลูกสูบ เปลี่ยนปริมาตร", text: "คงอุณหภูมิและจำนวนโมล แล้วเพิ่มความดัน" },
        ].map(e => <Link href={`/tools/${e.id}`} className="atlas-lab-card" key={e.id}><div className="atlas-lab-picture"><ExperimentPreview id={e.id} /></div><div className="atlas-lab-copy"><span>{e.label}</span><h3>{e.title}</h3><p>{e.text}</p><strong>เปิดการทดลอง <ArrowUpRight size={17} /></strong></div></Link>)}</div>
        <p className="atlas-scope-note">การทดลองเป็นแบบจำลองเพื่ออธิบายแนวคิด มีสมมติฐานและข้อจำกัดระบุในแต่ละหน้า</p>
      </section>
      <section className="atlas-section atlas-directory" aria-labelledby="directory-heading">
        <div className="atlas-section-title"><div><span className="atlas-eyebrow">CONTENT DIRECTORY</span><h2 id="directory-heading">สารบัญรายวิชา</h2></div><BookOpen size={23} strokeWidth={1.4} /></div>
        <div className="atlas-course-list">{courses.map(c => <details key={c.id}><summary><span className={`atlas-course-grade grade-${c.grade}`}>ม.{c.grade}</span><div><h3>{c.title}</h3><span>{c.code} · {articlesForCourse(c.id).length} หัวข้อ</span></div><span className="atlas-expand">+</span></summary><div className="atlas-course-articles">{articlesForCourse(c.id).map((a, i) => <Link href={`/read/${a.id}`} key={a.id}><span>{String(i+1).padStart(2,"0")}</span>{a.title}<ArrowRight size={15} /></Link>)}<Link className="atlas-course-all" href={`/courses/${c.id}`}>ดูรายวิชานี้ทั้งหมด <ArrowUpRight size={15} /></Link></div></details>)}</div>
        <div className="atlas-editorial-note"><Atom size={22} /><p>แสดงเฉพาะหัวข้อที่มีเนื้อหาแล้ว พร้อมแหล่งข้อมูลประกอบการอ่าน คลังนี้ยังไม่ใช่สารบัญครบหลักสูตรอย่างเป็นทางการ</p><Link href="/about">แนวทางของคลัง <ArrowUpRight size={16} /></Link></div>
      </section>
    </>
  );
}
