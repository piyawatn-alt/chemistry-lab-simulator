"use client";
import Link from "next/link";
import { BookOpen, ArrowRight, ArrowUpRight } from "lucide-react";
import { lessons } from "@/data/curriculum";

export function PageHeading({
  eyebrow = "YOUR LEARNING JOURNEY",
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function Stat({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${color}`}>
        <Icon size={21} />
      </span>
      <div>
        <p>{label}</p>
        <strong>
          {value} <small>{unit}</small>
        </strong>
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  href,
  action,
}: {
  title: string;
  subtitle: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {href && (
        <Link href={href}>
          {action}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

export function CourseCards({
  compact = false,
  grade = "all",
}: {
  compact?: boolean;
  grade?: string;
}) {
  return (
    <div className="course-grid">
      {lessons
        .filter((l) => grade === "all" || l.grade.startsWith(grade))
        .slice(0, compact ? 4 : 6)
        .map((l, i) => (
          <Link
            className={`course-card course-${i % 4}`}
            key={l.id}
            href={`/lessons/${l.id}`}
          >
            <div className="course-top">
              <span className="course-code">{l.code}</span>
              <span>{l.grade}</span>
            </div>
            <div className="course-symbol">
              {["◎", "n / V", "⇌", "CH₃", "[ ]ₙ", "∑"][lessons.indexOf(l)]}
            </div>
            <h3>{l.title}</h3>
            <div className="course-bottom">
              <span>
                1 บทเรียนตัวอย่าง <span>·</span> 4 ขั้นตอน
              </span>
              <span className="circle-arrow">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
    </div>
  );
}
