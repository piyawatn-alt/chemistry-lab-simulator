import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Search,
  MoveUpRight,
  ChartNoAxesCombined,
} from "lucide-react";
import { articles, topics } from "@/data/knowledge";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleArt } from "./article-art";
import { ArticleCard } from "./article-card";
export function KnowledgeHome({ list }: { list: ReadingList }) {
  return (
    <>
      <section className="journal-hero">
        <div className="journal-hero-copy">
          <span className="journal-kicker">
            <span />A LITTLE CURIOSITY. A WHOLE NEW WORLD.
          </span>
          <h1>
            เรื่องใกล้ตัว
            <br />
            มี<span>เคมี</span>ซ่อนอยู่<span className="journal-period">.</span>
          </h1>
          <p>
            จากน้ำหนึ่งแก้ว ถึงโมเลกุลในยา
            <br />
            ชวนมองสิ่งคุ้นเคย ผ่านเรื่องราวที่เข้าใจได้
          </p>
          <div className="journal-hero-actions">
            <Link className="journal-button" href="/discover">
              ตามความสงสัยไปกัน <ArrowRight size={17} />
            </Link>
            <Link className="journal-text-link" href="/tools">
              ลองสำรวจด้วยตัวเอง <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="journal-hero-note">
            <span />
            อ่านได้ทุกเรื่อง · เลือกเริ่มตรงไหนก็ได้
          </div>
        </div>
        <Link className="hero-feature" href={`/read/${articles[0].id}`}>
          <div className="hero-feature-label">
            <span>THE SMALL DETAILS</span>
            <ArrowUpRight size={20} />
          </div>
          <ArticleArt visual="alcohol" large />
          <div className="hero-feature-copy">
            <span className="journal-kicker">เริ่มจากความสงสัยเล็ก ๆ</span>
            <h2>
              หมู่เล็ก ๆ ที่เปลี่ยนสมบัติ
              <br />
              ของทั้งโมเลกุล
            </h2>
            <span className="hero-feature-action">
              ไปทำความรู้จักหมู่ฟังก์ชัน <ArrowRight size={17} />
            </span>
          </div>
        </Link>
      </section>
      <div className="journal-intro-line">
        <span>เคมีที่เชื่อมโยงกับชีวิตจริง</span>
        <span>
          อ่านเรื่องที่สนใจ <i /> มองผ่านภาพ <i /> ลองด้วยเครื่องมือ
        </span>
        <span>CHEMISTRY, MADE CLOSER.</span>
      </div>
      <section className="journal-section">
        <div className="journal-section-heading">
          <div>
            <span className="journal-kicker">FOLLOW YOUR CURIOSITY</span>
            <h2>เริ่มจากเรื่องที่คุณสงสัย</h2>
          </div>
          <Link href="/discover">
            สำรวจทุกเรื่อง <ArrowRight size={17} />
          </Link>
        </div>
        <div className="topic-shelf">
          {topics.slice(1).map((t, i) => (
            <Link
              href={`/topics/${t.id}`}
              className={`topic-tile topic-color-${i}`}
              key={t.id}
            >
              <span className="topic-number">
                0{i + 1} <ArrowUpRight size={18} />
              </span>
              <div className="topic-symbol">
                {["C–O–H", "H₂O", "RX", "[A]₀"][i]}
              </div>
              <h3>{t.name}</h3>
              <p>{t.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="journal-section">
        <div className="journal-section-heading">
          <div>
            <span className="journal-kicker">WORTH A CLOSER LOOK</span>
            <h2>เรื่องใกล้ตัว ที่น่ารู้ให้ลึกขึ้น</h2>
          </div>
          <Link href="/discover">
            ดูเรื่องทั้งหมด <ArrowRight size={17} />
          </Link>
        </div>
        <div className="story-grid">
          {[articles[1], articles[2], articles[5]].map((a) => (
            <ArticleCard key={a.id} article={a} list={list} />
          ))}
        </div>
      </section>
      <section className="interactive-invite">
        <div>
          <span className="journal-kicker">
            <Sparkles size={14} /> NOT JUST SOMETHING TO READ
          </span>
          <h2>
            บางเรื่อง เข้าใจง่ายขึ้น
            <br />
            เมื่อได้ลองมองเอง
          </h2>
          <p>
            แตะอะตอมเพื่อดูว่าเชื่อมกันอย่างไร
            <br />
            หรือขยับตัวแปร แล้วสังเกตเส้นกราฟที่เปลี่ยนไป
          </p>
          <Link href="/tools" className="journal-button">
            เปิดเครื่องมือสำรวจ <ArrowRight size={17} />
          </Link>
        </div>
        <div className="invite-tools">
          <Link href="/explorer">
            <span className="invite-symbol">
              C — <b>O</b> — H
            </span>
            <div>
              <h3>มองโมเลกุลให้เห็นภาพ</h3>
              <p>แตะ ดูพันธะ และลองหาหมู่ฟังก์ชัน</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
          <Link href="/tools/kinetics">
            <span className="invite-symbol invite-curve">
              <ChartNoAxesCombined size={40} strokeWidth={1.2} />
            </span>
            <div>
              <h3>อ่านความเปลี่ยนแปลงของสาร</h3>
              <p>ปรับความเข้มข้น แล้วเปรียบเทียบกราฟ</p>
            </div>
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
      <section className="journal-section">
        <div className="journal-section-heading">
          <div>
            <span className="journal-kicker">IDEAS TO KEEP EXPLORING</span>
            <h2>ต่อยอดความสงสัย</h2>
          </div>
          <Link href="/discover">
            ค้นหาเรื่องที่สนใจ <Search size={17} />
          </Link>
        </div>
        <div className="reading-links">
          {[articles[3], articles[4], articles[6], articles[7]].map((a, i) => (
            <Link href={`/read/${a.id}`} key={a.id}>
              <span>0{i + 1}</span>
              <div>
                <small>{topics.find((t) => t.id === a.topic)?.name}</small>
                <h3>{a.title}</h3>
              </div>
              <MoveUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
