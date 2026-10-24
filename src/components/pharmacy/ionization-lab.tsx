"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Download,
  RotateCcw,
  FlaskConical,
} from "lucide-react";
import { ionization, type IonizationKind } from "@/lib/chemistry/ionization";
import { useLearningJournal } from "@/hooks/use-learning-journal";
export function downloadText(
  name: string,
  text: string,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function IonizationLab() {
  const [kind, setKind] = useState<IonizationKind>("acid");
  const [ph, setPh] = useState(4.5);
  const [pka, setPka] = useState(4.5);
  const [message, setMessage] = useState("");
  const { journal, update, ready, storageError } = useLearningJournal();
  const r = ionization(kind, ph, pka);
  const charged = Math.round(r.ionizedFraction * 48);
  const percent = (fraction: number) =>
    fraction > 0 && fraction < 0.00005
      ? "<0.01"
      : fraction < 1 && fraction > 0.99995
        ? ">99.99"
        : (fraction * 100).toFixed(2);
  function save() {
    const snapshot = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      kind,
      ph,
      pka,
    };
    update({
      ...journal,
      snapshots: [...journal.snapshots.slice(-19), snapshot],
    });
    setMessage(
      "บันทึกเงื่อนไขและผลแล้ว ไปเขียนสิ่งที่เรียนรู้ต่อในสมุดการเรียนรู้ได้",
    );
  }
  function csv() {
    const rows = ["pH,pKa,model,ionized_percent,neutral_percent,S_over_S0"];
    for (let p = 0; p <= 14; p += 0.25) {
      const x = ionization(kind, p, pka);
      rows.push(
        [
          p,
          pka,
          kind,
          (100 * x.ionizedFraction).toFixed(6),
          (100 * x.neutralFraction).toFixed(6),
          x.relativeSolubility.toPrecision(8),
        ].join(","),
      );
    }
    downloadText(
      "chemlab-ionization.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
  }
  return (
    <section className="pharma-lab">
      <Link className="experiment-back" href="/pharmacy">
        <ArrowLeft size={16} /> เคมีสู่เภสัชศาสตร์
      </Link>
      <div className="pharma-heading">
        <span className="journal-kicker">
          PHARMACEUTICAL CHEMISTRY · INTERACTIVE MODEL
        </span>
        <h1>pH เปลี่ยน รูปของสารก็เปลี่ยน</h1>
        <p>
          สำรวจกรดอ่อนและเบสอ่อนสมมติ เชื่อมสมดุลกรด–เบสเข้ากับการละลาย
          แล้วเก็บหลักฐานสิ่งที่คุณสังเกต
        </p>
      </div>
      <div className="ion-workbench">
        <aside className="ion-controls">
          <h2>กำหนดสารสมมติ</h2>
          <div className="ion-kind" aria-label="ชนิดสาร">
            {(["acid", "base"] as const).map((k) => (
              <button
                key={k}
                aria-pressed={kind === k}
                onClick={() => {
                  setKind(k);
                  setMessage("");
                }}
              >
                {k === "acid" ? "กรดอ่อน HA" : "เบสอ่อน B"}
              </button>
            ))}
          </div>
          <p className="ion-control-note">
            {kind === "acid"
              ? "pKa ของกรด HA ที่แตกตัวเป็น H⁺ และ A⁻"
              : "pKa ของคู่กรด BH⁺ ไม่ใช่ pKb ของเบส B"}
          </p>
          <label className="ion-slider">
            pH ของสารละลาย<output>{ph.toFixed(2)}</output>
            <input
              type="range"
              min="0"
              max="14"
              step="0.1"
              value={ph}
              onChange={(e) => {
                setPh(Number(e.target.value));
                setMessage("");
              }}
            />
          </label>
          <label className="ion-slider">
            pKa<output>{pka.toFixed(2)}</output>
            <input
              type="range"
              min="2"
              max="12"
              step="0.1"
              value={pka}
              onChange={(e) => {
                setPka(Number(e.target.value));
                setMessage("");
              }}
            />
          </label>
          <div className="ion-presets">
            {[-1, 0, 1].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setPh(Math.max(0, Math.min(14, pka + d)));
                  setMessage("");
                }}
              >
                pH {d === 0 ? "= pKa" : d < 0 ? "= pKa − 1" : "= pKa + 1"}
              </button>
            ))}
          </div>
          <button
            className="pharma-reset"
            onClick={() => {
              setPh(4.5);
              setPka(4.5);
              setKind("acid");
              setMessage("");
            }}
          >
            <RotateCcw size={15} /> คืนค่าเริ่มต้น
          </button>
        </aside>
        <div className="ion-visual">
          <div className="ion-visual-top">
            <span>ภาพอนุภาคเชิงสัดส่วน</span>
            <span>
              pH {ph.toFixed(1)} · pKa {pka.toFixed(1)}
            </span>
          </div>
          <svg
            viewBox="0 0 560 300"
            role="img"
            aria-label={`รูปไอออน ${(r.ionizedFraction * 100).toFixed(2)} เปอร์เซ็นต์ รูปเป็นกลาง ${(r.neutralFraction * 100).toFixed(2)} เปอร์เซ็นต์`}
          >
            <path
              d="M90 35V250Q90 269 110 269H450Q470 269 470 250V35"
              fill="#254641"
              stroke="#81a79c"
              strokeWidth="2"
            />
            {Array.from({ length: 48 }, (_, i) => (
              <g key={i} data-species={i < charged ? "ionized" : "neutral"}>
                <circle
                  cx={124 + (i % 8) * 44}
                  cy={65 + Math.floor(i / 8) * 34}
                  r="12"
                  fill={i < charged ? "#e9b877" : "#a6cfa5"}
                />
                {i < charged && (
                  <text
                    x={124 + (i % 8) * 44}
                    y={70 + Math.floor(i / 8) * 34}
                    textAnchor="middle"
                    fill="#463424"
                    fontSize="15"
                  >
                    {kind === "acid" ? "−" : "+"}
                  </text>
                )}
              </g>
            ))}
          </svg>
          <div className="ion-legend">
            <span>
              <i /> {kind === "acid" ? "HA" : "B"} · เป็นกลาง
            </span>
            <span>
              <i /> {kind === "acid" ? "A⁻" : "BH⁺"} · ไอออน
            </span>
          </div>
          <p>48 จุดใช้สื่อสัดส่วนโดยปัดจำนวนเต็ม ไม่ใช่จำนวนโมเลกุลจริง</p>
        </div>
      </div>
      <div className="ion-stat-grid">
        <div>
          <span>รูปไอออน</span>
          <strong data-testid="ionized">
            {percent(r.ionizedFraction)}
            <small>%</small>
          </strong>
        </div>
        <div>
          <span>รูปเป็นกลาง</span>
          <strong>
            {percent(r.neutralFraction)}
            <small>%</small>
          </strong>
        </div>
        <div>
          <span>การละลายสัมพัทธ์ · S / S₀</span>
          <strong data-testid="solubility">
            {r.relativeSolubility < 1000
              ? r.relativeSolubility.toFixed(2)
              : r.relativeSolubility.toExponential(2)}
            <small>เท่า</small>
          </strong>
        </div>
      </div>
      <section className="ion-chart-card">
        <div>
          <span className="journal-kicker">ONE VARIABLE AT A TIME</span>
          <h2>สัดส่วนรูปไอออนตลอดช่วง pH</h2>
          <p>เส้นทึบคือสารที่เลือก เส้นประแสดงกรณีอีกชนิดที่ pKa เท่ากัน</p>
        </div>
        <svg
          viewBox="0 0 700 280"
          role="img"
          aria-label="กราฟสัดส่วนไอออนกับ pH ของกรดอ่อนและเบสอ่อน"
        >
          <path d="M60 20V225H670" stroke="#93a48e" fill="none" />
          {[0, 50, 100].map((p) => (
            <g key={p}>
              <path d={`M60 ${225 - p * 1.9}H670`} stroke="#e1e8db" />
              <text x="48" y={230 - p * 1.9} textAnchor="end">
                {p}%
              </text>
            </g>
          ))}
          {(["acid", "base"] as const).map((k) => (
            <path
              key={k}
              d={Array.from(
                { length: 141 },
                (_, i) =>
                  `${i ? "L" : "M"}${(60 + (i / 140) * 610).toFixed(3)} ${(225 - ionization(k, i / 10, pka).ionizedFraction * 190).toFixed(3)}`,
              ).join(" ")}
              stroke={k === kind ? "#477e69" : "#c69e71"}
              strokeWidth={k === kind ? 3 : 2}
              strokeDasharray={k === kind ? undefined : "6 5"}
              fill="none"
            />
          ))}
          <path
            d={`M${(60 + (ph / 14) * 610).toFixed(3)} 20V225`}
            stroke="#97a68d"
            strokeDasharray="3 5"
          />
          <circle
            cx={60 + (ph / 14) * 610}
            cy={225 - r.ionizedFraction * 190}
            r="6"
            fill="#254d3c"
          />
          {[0, 2, 4, 6, 8, 10, 12, 14].map((p) => (
            <text key={p} x={60 + (p / 14) * 610} y="248" textAnchor="middle">
              {p}
            </text>
          ))}
          <text x="365" y="274" textAnchor="middle">
            pH
          </text>
        </svg>
        <div className="ion-insight">
          <FlaskConical size={20} />
          <p>
            {Math.abs(ph - pka) < 0.001
              ? "เมื่อ pH = pKa จะมีรูปไอออนและรูปเป็นกลางเท่ากัน 50 : 50 ทั้งสองชนิด"
              : kind === "acid"
                ? ph > pka
                  ? "pH สูงกว่า pKa: กรดอ่อนอยู่ในรูป A⁻ มากกว่า HA"
                  : "pH ต่ำกว่า pKa: กรดอ่อนอยู่ในรูป HA มากกว่า A⁻"
                : ph > pka
                  ? "pH สูงกว่า pKa ของ BH⁺: เบสอยู่ในรูป B มากกว่า BH⁺"
                  : "pH ต่ำกว่า pKa ของ BH⁺: เบสอยู่ในรูป BH⁺ มากกว่า B"}
          </p>
        </div>
      </section>
      <div className="pharma-actions">
        <button className="journal-button" disabled={!ready} onClick={save}>
          <BookmarkPlus size={17} /> เก็บผลในสมุดการเรียนรู้
        </button>
        <button className="journal-button" onClick={csv}>
          <Download size={17} /> ส่งออกข้อมูลกราฟ CSV
        </button>
        <Link href="/journal">
          เขียนสิ่งที่เรียนรู้ <ArrowRight size={17} />
        </Link>
      </div>
      <p role="status" className="ion-save-status">
        {message}
      </p>
      {storageError && (
        <p role="alert">
          เบราว์เซอร์เก็บข้อมูลไม่ได้ ผลอยู่ในหน้านี้ชั่วคราว ควรส่งออก CSV
          ก่อนออกจากหน้า
        </p>
      )}
      {journal.snapshots.length > 0 && (
        <section className="ion-saved">
          <h2>เงื่อนไขที่คุณกดบันทึก</h2>
          <div>
            {journal.snapshots.slice(-4).map((s) => (
              <article key={s.id}>
                <span>{s.kind === "acid" ? "กรดอ่อน" : "เบสอ่อน"}</span>
                <strong>
                  pH {s.ph.toFixed(1)} / pKa {s.pka.toFixed(1)}
                </strong>
                <p>
                  รูปไอออน{" "}
                  {(
                    ionization(s.kind, s.ph, s.pka).ionizedFraction * 100
                  ).toFixed(2)}
                  %
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
      <div className="pharma-theory">
        <section>
          <span className="journal-kicker">จากสมการสู่สิ่งที่เห็น</span>
          <h2>สมดุลกรด–เบสเชื่อมกับเภสัชอย่างไร</h2>
          <p>
            รูปประจุของสารมีผลต่อปฏิสัมพันธ์กับน้ำและสมดุลการละลาย ในแบบจำลองนี้
            รูปไอออนที่มากขึ้นสัมพันธ์กับการละลายรวมเมื่อเทียบกับการละลายของรูปเป็นกลาง
            แต่การพาสารผ่านเยื่อชีวภาพยังขึ้นกับปัจจัยอื่นอีกหลายอย่าง
          </p>
          <div className="ion-equation">
            {kind === "acid" ? (
              <>
                HA ⇌ H<sup>+</sup> + A<sup>−</sup>
                <br />
                <span>
                  pH = pKa + log<sub>10</sub>{" "}
                  <span className="formula-fraction">
                    <span>
                      [A<sup>−</sup>]
                    </span>
                    <span>[HA]</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                BH<sup>+</sup> ⇌ B + H<sup>+</sup>
                <br />
                <span>
                  pH = pKa + log<sub>10</sub>{" "}
                  <span className="formula-fraction">
                    <span>[B]</span>
                    <span>
                      [BH<sup>+</sup>]
                    </span>
                  </span>
                </span>
              </>
            )}
          </div>
          <p>
            <mark>การละลาย การแตกตัว และการดูดซึมเป็นคนละประเด็น</mark>{" "}
            กราฟนี้ไม่บอกตำแหน่งดูดซึมที่ดีที่สุด ขนาดยา หรือประสิทธิผลของสารยา
          </p>
          <p>
            ที่สมดุลและยังมีของแข็งรูปเป็นกลางเหลืออยู่
            ความเข้มข้นรูปเป็นกลางถูกตรึงที่ S₀ ส่วนการละลายรวม S
            เท่ากับผลรวมของรูปเป็นกลางกับรูปไอออน เมื่อหารด้วย S₀ จึงได้ S/S₀ =
            1 + อัตราส่วนรูปไอออนต่อรูปเป็นกลาง
          </p>
          <Link href="/read/acids-bases-ph">ทบทวนกรด–เบสและบัฟเฟอร์ →</Link>
        </section>
        <aside>
          <h3>เงื่อนไขที่ต้องรู้ก่อนแปลผล</h3>
          <ul>
            <li>
              สารสมมติแตกตัวเพียงหนึ่งตำแหน่ง และใช้ความเข้มข้นแทนแอกทิวิตี
            </li>
            <li>pKa ของเบสในหน้านี้หมายถึง pKa ของคู่กรด BH⁺</li>
            <li>
              S₀ คือการละลายของรูปเป็นกลาง; S/S₀ = 1 +
              อัตราส่วนรูปไอออนต่อรูปเป็นกลาง
            </li>
            <li>
              ความสัมพันธ์การละลายใช้เมื่อมีของแข็งรูปเป็นกลางเหลือเกินและควบคุม
              pH จากภายนอก
            </li>
            <li>
              ไม่รวมเกลือที่ตกตะกอน สารหลายตำแหน่งแตกตัว ความแรงไอออน
              หรือรูปผลึกหลายแบบ ค่าสูงมากเป็นการคาดจากแบบจำลอง
              ไม่ใช่การละลายจริงที่ยืนยันแล้ว
            </li>
          </ul>
          <a
            href="https://openstax.org/books/chemistry-2e/pages/14-6-buffers"
            target="_blank"
            rel="noreferrer"
          >
            OpenStax · Henderson–Hasselbalch ↗
          </a>
        </aside>
      </div>
    </section>
  );
}
