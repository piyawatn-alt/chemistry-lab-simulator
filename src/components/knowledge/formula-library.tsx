"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Lightbulb, Search, SlidersHorizontal, X } from "lucide-react";
import { allRecallGuides } from "@/data/knowledge/recall";
import { articles, courseForArticle } from "@/data/knowledge";
import type { FormulaReference, MemoryAid } from "@/data/knowledge/recall/types";
import { chemistrySubjects, normalizeChemistryText } from "@/lib/content/search";
import { FormulaReferenceCard, MemoryAidCard } from "./recall-guide";
import "./recall.css";

type LibraryEntry = { key: string; articleId: string; articleTitle: string; course: ReturnType<typeof courseForArticle>; kind: "formula"; formula: FormulaReference; searchable: string } | { key: string; articleId: string; articleTitle: string; course: ReturnType<typeof courseForArticle>; kind: "memory"; aid: MemoryAid; searchable: string };
const entries: LibraryEntry[] = allRecallGuides.flatMap(guide => {
  const article = articles.find(item => item.id === guide.articleId);
  if (!article) return [];
  const course = courseForArticle(article);
  const context = `${article.title} ${article.tags.join(" ")} ${course.code} ม.${course.grade}`;
  return [
    ...guide.formulas.map(formula => ({ key: `${article.id}-formula-${formula.id}`, articleId: article.id, articleTitle: article.title, course, kind: "formula" as const, formula, searchable: normalizeChemistryText(`${context} ${formula.title} ${formula.expression} ${formula.useWhen} ${formula.caution} ${formula.variables.map(variable => `${variable.symbol} ${variable.meaning} ${variable.unit || ""}`).join(" ")} ${formula.example.given} ${formula.example.steps.join(" ")} ${formula.example.result}`) })),
    ...guide.memoryAids.map(aid => ({ key: `${article.id}-memory-${aid.id}`, articleId: article.id, articleTitle: article.title, course, kind: "memory" as const, aid, searchable: normalizeChemistryText(`${context} ${aid.title} ${aid.chant} ${aid.meaning} ${aid.boundary}`) })),
  ];
});
// Keep Latin chemistry tokens whole: pH must not match Phenol, nor H2O match H2O2.
// Thai words do not use spaces consistently, so they remain literal substrings.
function matchesTerm(text: string, term: string): boolean {
  let offset = text.indexOf(term);
  while (offset >= 0) {
    const before = text[offset - 1] || "";
    const after = text[offset + term.length] || "";
    const validStart = !/^[a-z0-9]/.test(term) || !/[a-z0-9]/.test(before);
    const validEnd = !/[a-z0-9]$/.test(term) || !/[a-z0-9]/.test(after);
    if (validStart && validEnd) return true;
    offset = text.indexOf(term, offset + 1);
  }
  return false;
}
const formulaCount = entries.filter(entry => entry.kind === "formula").length;
const memoryCount = entries.filter(entry => entry.kind === "memory").length;
const kindOptions = [{ id: "all", title: "ทั้งหมด" }, { id: "formula", title: "สูตรและความสัมพันธ์" }, { id: "memory", title: "คำช่วยจำ" }];
export function FormulaLibrary() {
  return <Suspense fallback={<div className="formula-library-loading" role="status">กำลังเปิดคลังสูตรและคำช่วยจำ…</div>}><FormulaLibraryContent /></Suspense>;
}
function FormulaLibraryContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const requestedKind = searchParams.get("type") || "all";
  const kind = ["all", "formula", "memory"].includes(requestedKind) ? requestedKind : "all";
  const requestedGrade = searchParams.get("grade") || "all";
  const grade = ["all", "4", "5", "6"].includes(requestedGrade) ? requestedGrade : "all";
  const requestedSubject = searchParams.get("subject") || "all";
  const subject = chemistrySubjects.find(item => item.id === requestedSubject);
  const [limit, setLimit] = useState(12);
  const updateFilter = (changes: Record<string, string>) => {
    const url = new URL(window.location.href);
    for (const [name, value] of Object.entries(changes)) {
      if (value.trim() && value !== "all") url.searchParams.set(name, value); else url.searchParams.delete(name);
    }
    window.history.replaceState(null, "", url.pathname + url.search);
    setLimit(12);
  };
  const terms = normalizeChemistryText(query).split(/\s+/).filter(Boolean);
  const found = entries.filter(entry => (kind === "all" || entry.kind === kind) && (grade === "all" || entry.course.grade === grade) && (!subject || subject.articleIds.includes(entry.articleId)) && terms.every(term => matchesTerm(entry.searchable, term)));
  return <div className="formula-library">
    <header className="formula-library-hero"><div><span className="journal-kicker">CHEMISTRY REFERENCE / เข้าใจแล้วค่อยจำ</span><h1>คลังสูตรและคำช่วยจำ</h1><p>ค้นสูตรที่ต้องใช้ อ่านตัวแปรให้ครบ<br className="formula-library-desktop-break" /> แล้วใช้คำท่องสั้นช่วยเชื่อมกลับไปหาหลักการ</p></div><div className="formula-library-stats"><span><BookOpen size={20} /><strong>{formulaCount}</strong> สูตรและความสัมพันธ์</span><span><Lightbulb size={20} /><strong>{memoryCount}</strong> คำช่วยจำ</span><small>จากเนื้อหา {allRecallGuides.length} บทในคลัง</small></div></header>
    <div className="formula-library-legend"><span><i className="legend-formula" /><strong>สูตร</strong> มีตัวแปร เงื่อนไข และตัวอย่างการใช้</span><span><i className="legend-memory" /><strong>คำช่วยจำ</strong> มีความหมายและขอบเขตที่ต้องระวัง</span></div>
    <div className="formula-library-search"><Search size={21} /><input aria-label="ค้นหาสูตรและคำช่วยจำ" placeholder="ค้นหา เช่น pH, โมล, n = m / M หรือ แอโนด" value={query} onChange={event => updateFilter({ q: event.target.value })} autoComplete="off" />{query && <button aria-label="ล้างคำค้นสูตร" onClick={() => updateFilter({ q: "" })}><X size={18} /></button>}</div>
    <div className="formula-library-type-filter" role="group" aria-label="ประเภทเนื้อหาที่ทบทวน">{kindOptions.map(option => <button key={option.id} aria-pressed={kind === option.id} onClick={() => updateFilter({ type: option.id })}>{option.id === "formula" ? <BookOpen size={16} /> : option.id === "memory" ? <Lightbulb size={16} /> : null}{option.title}</button>)}</div>
    <div className="formula-library-filters"><span><SlidersHorizontal size={16} /> เลือกเนื้อหา</span><label>ระดับชั้น<select aria-label="ระดับชั้นของสูตรและคำช่วยจำ" value={grade} onChange={event => updateFilter({ grade: event.target.value })}><option value="all">ทุกระดับชั้น</option>{["4", "5", "6"].map(item => <option key={item} value={item}>ม.{item}</option>)}</select></label><label>หมวดเนื้อหา<select aria-label="หมวดสูตรและคำช่วยจำ" value={subject?.id || "all"} onChange={event => updateFilter({ subject: event.target.value })}><option value="all">ทุกหมวดเนื้อหา</option>{chemistrySubjects.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></div>
    <div className="formula-library-result-count" role="status" aria-live="polite"><span>พบ <strong>{found.length}</strong> รายการ{query.trim() ? ` สำหรับ “${query.trim()}”` : ""}</span><span>เลือกขยายเพื่ออ่านเงื่อนไขและตัวอย่าง</span></div>
    {found.length ? <><div className="formula-library-grid">{found.slice(0, limit).map(entry => <div className={`formula-library-result result-${entry.kind}`} key={entry.key}><div className="formula-library-context"><span>ม.{entry.course.grade} · {entry.course.code}</span><Link href={`/read/${entry.articleId}`}>{entry.articleTitle}</Link></div>{entry.kind === "formula" ? <FormulaReferenceCard formula={entry.formula} compact idPrefix={`${entry.articleId}-`} /> : <MemoryAidCard aid={entry.aid} compact idPrefix={`${entry.articleId}-`} />}<Link className="formula-library-source-link" href={`/read/${entry.articleId}#${entry.kind === "formula" ? `formula-${entry.formula.id}` : `memory-${entry.aid.id}`}`}>อ่านต่อในบท <ArrowRight size={16} /></Link></div>)}</div>{found.length > limit && <button className="formula-library-load-more" onClick={() => setLimit(value => value + 12)}>แสดงอีก {Math.min(12, found.length - limit)} รายการ <span>แสดงแล้ว {Math.min(limit, found.length)} จาก {found.length}</span></button>}</> : <div className="formula-library-empty"><Search size={28} /><h2>ยังไม่พบสูตรหรือคำช่วยจำที่ตรงกัน</h2><p>ลองใช้คำสั้นลง หรือเปลี่ยนระดับชั้นและหมวดเนื้อหา</p><button onClick={() => updateFilter({ q: "", type: "all", grade: "all", subject: "all" })}>ล้างตัวกรองทั้งหมด <ArrowRight size={16} /></button></div>}
    <p className="formula-library-end-note">เลือกอ่านได้อิสระ ไม่ต้องเข้าสู่ระบบ คำช่วยจำช่วยทบทวนหลักการ ส่วนสูตรต้องเลือกใช้ให้ตรงกับเงื่อนไขของโจทย์</p>
  </div>;
}
