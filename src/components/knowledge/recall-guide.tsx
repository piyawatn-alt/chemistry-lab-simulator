"use client";
import Link from "next/link";
import { BookOpen, ChevronDown, Lightbulb, NotebookPen, ShieldCheck, Sparkles } from "lucide-react";
import { recallGuides } from "@/data/knowledge/recall";
import type { FormulaReference, MemoryAid } from "@/data/knowledge/recall/types";
import { ScientificFormula } from "@/components/ui/scientific-formula";
import "./recall.css";

export function MemoryAidCard({ aid, idPrefix = "", compact = false }: { aid: MemoryAid; idPrefix?: string; compact?: boolean }) {
  return <article className={`recall-memory-card${compact ? " is-compact" : ""}`} id={`${idPrefix}memory-${aid.id}`}>
    <div className="recall-card-label"><Lightbulb size={16} /><span>คำช่วยจำ</span></div>
    <h3>{aid.title}</h3>
    <blockquote>{aid.chant}</blockquote>
    {compact ? <details className="recall-card-details"><summary>ความหมายและขอบเขต <ChevronDown size={16} /></summary><p className="recall-meaning">{aid.meaning}</p><div className="recall-boundary"><ShieldCheck size={16} /><p><strong>อย่าจำเกินเงื่อนไข</strong>{aid.boundary}</p></div></details> : <><p className="recall-meaning">{aid.meaning}</p><div className="recall-boundary"><ShieldCheck size={16} /><p><strong>อย่าจำเกินเงื่อนไข</strong>{aid.boundary}</p></div></>}
  </article>;
}
function FormulaDetails({ formula }: { formula: FormulaReference }) {
  return <>
    <dl className="recall-variables">{formula.variables.map((variable, index) => <div key={`${variable.symbol}-${index}`}><dt>{variable.symbol}</dt><dd>{variable.meaning}{variable.unit && <span className="recall-variable-unit">หน่วย {variable.unit}</span>}</dd></div>)}</dl>
    <div className="recall-boundary"><ShieldCheck size={16} /><p><strong>เงื่อนไขที่ต้องเช็ก</strong>{formula.caution}</p></div>
    <details className="recall-worked-example"><summary><NotebookPen size={17} /> ตัวอย่างการใช้ทีละขั้น <ChevronDown size={16} /></summary><div><p className="recall-example-given">{formula.example.given}</p><ol>{formula.example.steps.map((step, index) => <li key={index}>{step}</li>)}</ol><p className="recall-example-result"><strong>ผลที่ได้</strong>{formula.example.result}</p></div></details>
  </>;
}
export function FormulaReferenceCard({ formula, idPrefix = "", compact = false }: { formula: FormulaReference; idPrefix?: string; compact?: boolean }) {
  return <article className={`recall-formula-card${compact ? " is-compact" : ""}`} id={`${idPrefix}formula-${formula.id}`}>
    <div className="recall-card-label"><BookOpen size={16} /><span>สูตรและความสัมพันธ์</span></div>
    <h3>{formula.title}</h3>
    <div className="recall-equation" role="region" aria-label={`สูตร ${formula.title}`} tabIndex={0}><ScientificFormula text={formula.expression} explain={false} /></div>
    <div className="recall-use-when"><span>ใช้เมื่อ</span><p>{formula.useWhen}</p></div>
    {compact ? <details className="recall-card-details"><summary>ตัวแปร เงื่อนไข และตัวอย่าง <ChevronDown size={16} /></summary><FormulaDetails formula={formula} /></details> : <FormulaDetails formula={formula} />}
  </article>;
}
export function ChapterRecall({ articleId }: { articleId: string }) {
  const guide = recallGuides[articleId];
  if (!guide) return null;
  return <div className="chapter-recall">
    <header className="chapter-recall-heading"><div><span className="journal-kicker">UNDERSTAND · REMEMBER · APPLY</span><h2>สูตรและคำช่วยจำประจำบท</h2><p>จำคำสั้นให้เห็นหลักการ แล้วตรวจเงื่อนไขก่อนนำไปใช้</p></div><Link href="/formulas">เปิดคลังสูตรและคำช่วยจำ <BookOpen size={16} /></Link></header>
    <div className="recall-memory-heading"><Sparkles size={18} /><h3>ท่องสั้น แล้วแปลความหมายให้ได้</h3><span>{guide.memoryAids.length} คำช่วยจำ</span></div>
    <div className="recall-memory-grid">{guide.memoryAids.map(aid => <MemoryAidCard key={aid.id} aid={aid} />)}</div>
    {guide.formulas.length > 0 ? <><div className="recall-formula-heading"><BookOpen size={18} /><h3>เลือกสูตรพร้อมเงื่อนไข</h3><span>{guide.formulas.length} ความสัมพันธ์</span></div><div className="recall-formula-grid">{guide.formulas.map(formula => <FormulaReferenceCard key={formula.id} formula={formula} />)}</div></> : <p className="recall-qualitative-note">บทนี้เน้นหลักคิดและการแยกความหมาย ใช้คำช่วยจำประกอบการอ่านภาพและตัวอย่างในบท</p>}
    <p className="recall-source-note">คำช่วยจำเป็นวิธีเรียบเรียงเพื่อช่วยทบทวน อ่านคำอธิบายและเอกสารอ้างอิงของบทประกอบเสมอ</p>
  </div>;
}
