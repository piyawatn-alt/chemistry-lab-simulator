import { diagrams } from "@/data/molecules/functional-groups";
import type { Article } from "@/data/knowledge";
export function ArticleArt({
  visual,
  large = false,
  conceptOnly = false,
}: {
  visual: Article["visual"];
  large?: boolean;
  conceptOnly?: boolean;
}) {
  const model = diagrams[visual];
  return (
    <div
      className={`story-art art-${visual} ${large ? "art-large" : ""}`}
      aria-hidden="true"
    >
      {model ? (
        <svg viewBox="0 0 740 430">
          <g>
            {model.bonds
              .filter((b) => {
                const a = model.atoms.find((a) => a.id === b.from)!;
                const c = model.atoms.find((a) => a.id === b.to)!;
                return (
                  (a.element !== "H" || a.group) &&
                  (c.element !== "H" || c.group)
                );
              })
              .map((b, i) => {
                const a = model.atoms.find((a) => a.id === b.from)!;
                const c = model.atoms.find((a) => a.id === b.to)!;
                const dx = c.x - a.x,
                  dy = c.y - a.y,
                  d = Math.hypot(dx, dy),
                  nx = (-dy / d) * 6,
                  ny = (dx / d) * 6;
                return (
                  <g
                    key={i}
                    stroke="#9ab8a9"
                    strokeWidth="6"
                    strokeLinecap="round"
                  >
                    {b.order === 2 ? (
                      <>
                        <line
                          x1={a.x + nx}
                          y1={a.y + ny}
                          x2={c.x + nx}
                          y2={c.y + ny}
                        />
                        <line
                          x1={a.x - nx}
                          y1={a.y - ny}
                          x2={c.x - nx}
                          y2={c.y - ny}
                        />
                      </>
                    ) : (
                      <line x1={a.x} y1={a.y} x2={c.x} y2={c.y} />
                    )}
                  </g>
                );
              })}
          </g>
          {model.atoms
            .filter((a) => a.element !== "H" || a.group)
            .map((a) => (
              <g key={a.id}>
                {a.group && (
                  <circle
                    cx={a.x}
                    cy={a.y}
                    r="52"
                    fill="#c6e3cd"
                    opacity=".6"
                  />
                )}
                <circle
                  cx={a.x}
                  cy={a.y}
                  r={a.element === "H" ? 26 : 37}
                  fill={
                    a.element === "O"
                      ? "#da8067"
                      : a.element === "N"
                        ? "#7d9fc6"
                        : a.element === "H"
                          ? "#fff"
                          : "#466a60"
                  }
                  stroke="white"
                  strokeWidth="3"
                />
                <text
                  x={a.x}
                  y={a.y + 2}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill={a.element === "H" ? "#718a7d" : "white"}
                  fontSize="27"
                  fontFamily="Inter"
                  fontWeight="500"
                >
                  {a.element}
                </text>
              </g>
            ))}
        </svg>
      ) : visual === "water" ? (
        <svg viewBox="0 0 600 360">
          <g stroke="#abc7cd" strokeWidth="15" strokeLinecap="round">
            <path d="M300 150 180 260M300 150 420 260" fill="none" />
          </g>
          <circle cx="300" cy="150" r="59" fill="#d98069" />
          <circle cx="180" cy="260" r="38" fill="#fff" />
          <circle cx="420" cy="260" r="38" fill="#fff" />
          <g
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="36"
            fill="white"
          >
            <text x="300" y="153">
              O
            </text>
            <text x="180" y="263" fill="#7495a0">
              H
            </text>
            <text x="420" y="263" fill="#7495a0">
              H
            </text>
          </g>
          <text x="300" y="55" textAnchor="middle" fontSize="18" fill="#73929b">
            δ−
          </text>
          <g fontSize="17" fill="#73929b">
            <text x="125" y="245">
              δ+
            </text>
            <text x="463" y="245">
              δ+
            </text>
          </g>
        </svg>
      ) : visual === "kinetics" ? (
        <svg viewBox="0 0 600 360">
          <path
            d="M100 70v210h410"
            fill="none"
            stroke="#bdcabb"
            strokeWidth="2"
          />
          <path
            d="M110 90C200 95 200 245 500 265"
            fill="none"
            stroke="#718960"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M110 90C200 95 200 245 500 265V280H110Z"
            fill="#d9e3c9"
            opacity=".5"
          />
          <circle
            cx="240"
            cy="201"
            r="10"
            fill="#f1b86c"
            stroke="white"
            strokeWidth="3"
          />
          <text x="365" y="110" fontSize="27" fill="#879575" fontFamily="Inter">
            [A]₀ e⁻ᵏᵗ
          </text>
        </svg>
      ) : visual === "concentration" ? (
        <svg viewBox="0 0 600 360">
          <g stroke="#9fadb8" strokeWidth="3" fill="none">
            <path d="M130 70v190q0 25 25 25h90q25 0 25-25V70M340 70v190q0 25 25 25h90q25 0 25-25V70" />
          </g>
          <path
            d="M132 190H268V260Q268 283 245 283H155Q132 283 132 260Z"
            fill="#b0c9d7"
          />
          <path
            d="M342 120H478V260Q478 283 455 283H365Q342 283 342 260Z"
            fill="#d2e2e9"
          />
          {[
            [160, 225],
            [190, 245],
            [235, 218],
            [380, 190],
            [430, 250],
            [405, 145],
          ].map(([x, y], i) => (
            <circle cx={x} cy={y} r="7" fill="#688b9d" key={i} />
          ))}
          <text
            x="300"
            y="330"
            textAnchor="middle"
            fontSize="19"
            fill="#6f8795"
          >
            เทียบปริมาณ กับความเข้มข้น
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 600 360">
          <g fill="none" stroke="#b09a85" strokeWidth="7" strokeLinecap="round">
            <path d="M60 210 130 140 200 210 270 140 340 210 410 140 480 210 550 140" />
          </g>
          {[60, 130, 200, 270, 340, 410, 480, 550].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={i % 2 === 0 ? 210 : 140}
              r="20"
              fill={i % 2 === 0 ? "#bda88f" : "#e0ceaf"}
              stroke="#f8f1e4"
              strokeWidth="4"
            />
          ))}
          <text
            x="300"
            y="295"
            textAnchor="middle"
            fontSize="25"
            fill="#a78f73"
            fontFamily="Inter"
          >
            [ — CH₂ — CH₂ — ]ₙ
          </text>
        </svg>
      )}
      <span className="art-caption">
        {model
          ? conceptOnly
            ? `ตัวอย่างหมู่${visual === "ester" ? "เอสเทอร์" : "เอไมด์"} · ไม่ใช่โครงสร้างสารยา`
            : `${model.formula} · แผนภาพย่อ ซ่อน H ที่ต่อกับ C`
          : visual === "water"
            ? "H₂O · ภาพอธิบายขั้วของโมเลกุล"
            : visual === "kinetics"
              ? "FIRST-ORDER REACTION"
              : visual === "concentration"
                ? "AN ILLUSTRATION OF CONCENTRATION"
                : "REPEATING UNITS"}
      </span>
    </div>
  );
}
