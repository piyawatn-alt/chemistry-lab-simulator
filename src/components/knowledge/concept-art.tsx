import type { Article } from "@/data/knowledge";
/** Explanatory diagrams, never physical coordinates or complete lab apparatus. */
export function ConceptArt({ kind }: { kind: Article["visual"] }) {
  return (
    <svg viewBox="0 0 600 360" aria-hidden="true">
      {kind === "hydrocarbon" ? (
        <>
          <g stroke="#99b3a0" strokeWidth="6" strokeLinecap="round">
            <path
              d="M240 174H360M240 186H360M240 180 155 90M240 180 155 270M360 180 445 90M360 180 445 270"
              fill="none"
            />
          </g>
          {[
            { x: 240, y: 180, label: "C" },
            { x: 360, y: 180, label: "C" },
            { x: 155, y: 90, label: "H" },
            { x: 155, y: 270, label: "H" },
            { x: 445, y: 90, label: "H" },
            { x: 445, y: 270, label: "H" },
          ].map((a, i) => (
            <g key={i}>
              <circle
                cx={a.x}
                cy={a.y}
                r={a.label === "C" ? 36 : 25}
                fill={a.label === "C" ? "#547a65" : "white"}
                stroke="#e0e9db"
                strokeWidth="2"
              />
              <text
                x={a.x}
                y={a.y + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="25"
                fill={a.label === "C" ? "white" : "#7c9476"}
              >
                {a.label}
              </text>
            </g>
          ))}
        </>
      ) : kind === "atomic" ? (
        <>
          <g fill="none" stroke="#c2cbd9" strokeWidth="2" strokeDasharray="5 7">
            <ellipse
              cx="300"
              cy="180"
              rx="170"
              ry="90"
              transform="rotate(-25 300 180)"
            />
            <ellipse
              cx="300"
              cy="180"
              rx="170"
              ry="90"
              transform="rotate(45 300 180)"
            />
          </g>
          <circle cx="300" cy="180" r="44" fill="#d6dce6" />
          <circle cx="281" cy="172" r="24" fill="#d1816b" />
          <circle cx="318" cy="186" r="24" fill="#8fa4b8" />
          <g
            fill="white"
            fontSize="17"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <text x="281" y="174">
              p⁺
            </text>
            <text x="318" y="188">
              n⁰
            </text>
          </g>
          <g fill="#65899e">
            <circle cx="145" cy="206" r="12" />
            <circle cx="418" cy="92" r="12" />
            <circle cx="365" cy="298" r="12" />
          </g>
          <text x="145" y="179" fill="#65899e" fontSize="19">
            e⁻
          </text>
        </>
      ) : kind === "gas" ? (
        <>
          <rect
            x="145"
            y="45"
            width="310"
            height="265"
            rx="20"
            fill="#f8fafc"
            stroke="#a1b5c3"
            strokeWidth="4"
          />
          {[
            [185, 110],
            [300, 95],
            [408, 100],
            [230, 190],
            [370, 190],
            [180, 265],
            [300, 260],
            [410, 270],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="#8ba6b9" />
              <path d={`M${x + 20} ${y}h20`} stroke="#bfced7" strokeWidth="3" />
            </g>
          ))}
        </>
      ) : kind === "equilibrium" ? (
        <>
          <g fill="#98b3a0">
            <circle cx="150" cy="150" r="28" />
            <circle cx="150" cy="225" r="28" />
          </g>
          <g fill="#c9aa87">
            <circle cx="435" cy="150" r="28" />
            <circle cx="435" cy="225" r="28" />
          </g>
          <path
            d="M225 155H360L345 140M360 205H225L240 220"
            stroke="#8c9d83"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <g textAnchor="middle" fontSize="24" fill="#6d8469">
            <text x="150" y="300">
              สารตั้งต้น
            </text>
            <text x="435" y="300">
              ผลิตภัณฑ์
            </text>
          </g>
        </>
      ) : kind === "electrochem" ? (
        <>
          <g stroke="#a3b4b0" strokeWidth="3" fill="none">
            <path d="M85 125v155q0 20 20 20h140q20 0 20-20V125M335 125v155q0 20 20 20h140q20 0 20-20V125" />
            <path d="M170 130V60H430V130" />
            <path d="M240 190v-65h120v65" strokeWidth="12" stroke="#a6bfad" />
          </g>
          <path d="M87 200h176v80q0 18-18 18H105q-18 0-18-18Z" fill="#d8e5dd" />
          <path
            d="M337 200h176v80q0 18-18 18H355q-18 0-18-18Z"
            fill="#d3e1ea"
          />
          <rect x="150" y="125" width="30" height="140" rx="5" fill="#8fa0a0" />
          <rect x="420" y="125" width="30" height="140" rx="5" fill="#c88e6e" />
          <path
            d="M260 42h90l-10-8"
            stroke="#6a8e74"
            strokeWidth="3"
            fill="none"
          />
          <text x="300" y="28" textAnchor="middle" fill="#6a8e74" fontSize="18">
            e⁻
          </text>
          <g fontSize="22" fill="#658073" textAnchor="middle">
            <text x="164" y="335">
              Zn
            </text>
            <text x="435" y="335">
              Cu
            </text>
          </g>
        </>
      ) : (
        <>
          <rect
            x="215"
            y="85"
            width="170"
            height="170"
            rx="6"
            transform="rotate(45 300 170)"
            fill="white"
            stroke="#c87866"
            strokeWidth="8"
          />
          <text
            x="300"
            y="210"
            textAnchor="middle"
            fontSize="120"
            fontWeight="600"
            fill="#435e54"
          >
            !
          </text>
          <text
            x="300"
            y="320"
            textAnchor="middle"
            fontSize="20"
            fill="#74876c"
          >
            อ่านฉลากและเอกสาร SDS
          </text>
        </>
      )}
    </svg>
  );
}
