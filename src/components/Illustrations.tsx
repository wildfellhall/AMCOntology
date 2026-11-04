import { useId, useState, type ReactNode } from "react";
import { M } from "./Math";
import { NaturalPlate } from "./Manuscript";
export function CompassMark() {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="18" stroke="currentColor" />
      <path
        d="M22 3v7M22 34v7M3 22h7M34 22h7M12 32 22 10l10 22M16 25h12"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="22" cy="22" r="3" fill="var(--accent)" />
      <path d="M8 8l5 5m18 18 5 5" stroke="var(--pencil)" />
    </svg>
  );
}
export function SubjectSketch({
  domain,
  className = "",
}: {
  domain: string;
  className?: string;
}) {
  let art: ReactNode;
  switch (domain) {
    case "Foundations":
      art = (
        <>
          <circle cx="85" cy="85" r="48" />
          <path d="M85 85V37a48 48 0 0 1 48 48Z" fill="var(--accent-wash)" />
          <path d="M37 85h96M85 37v96" />
          <path d="M52 52l66 66" strokeDasharray="3 4" />
          <text x="155" y="80">
            ¾
          </text>
          <path d="M145 96h45" />
          <text x="163" y="122" className="sketch-small">
            a / b
          </text>
        </>
      );
      break;
    case "Algebra":
      art = (
        <>
          <path d="M35 126h166M70 145V30" stroke="var(--art-rule)" />
          <path d="M43 39q65 172 132 0" />
          <circle cx="70" cy="91" r="4" fill="var(--accent)" />
          <circle cx="147" cy="91" r="4" fill="var(--accent)" />
          <text x="127" y="52" className="sketch-small">
            x² + bx + c
          </text>
        </>
      );
      break;
    case "Number theory":
      art = (
        <>
          <path
            d="M112 40 64 86m48-46 48 46M64 86l-27 45m27-45 29 45M160 86l-27 45m27-45 29 45"
            stroke="var(--art-rule)"
          />
          {[
            [112, 35, "60"],
            [64, 82, "6"],
            [160, 82, "10"],
            [37, 136, "2"],
            [93, 136, "3"],
            [133, 136, "2"],
            [189, 136, "5"],
          ].map(([x, y, t]) => (
            <g key={String(x) + y}>
              <circle cx={x} cy={Number(y) - 7} r="15" fill="var(--paper)" />
              <text x={x} y={y} textAnchor="middle" className="sketch-small">
                {t}
              </text>
            </g>
          ))}
        </>
      );
      break;
    case "Geometry":
      art = (
        <>
          <circle
            cx="116"
            cy="87"
            r="57"
            strokeDasharray="2 5"
            stroke="var(--art-rule)"
          />
          <path d="M59 117 116 30l57 87Z" fill="var(--accent-wash)" />
          <path d="M116 30v87M109 117v-7h7" stroke="var(--pencil)" />
          <path d="M59 130h114" />
          <path d="M59 126v8m114-8v8" />
          <text x="110" y="150" className="sketch-small">
            b
          </text>
          <text x="124" y="83" className="sketch-small">
            h
          </text>
        </>
      );
      break;
    case "Counting":
      art = (
        <>
          {Array.from({ length: 4 }, (_, x) =>
            Array.from({ length: 4 }, (_, y) => (
              <g key={`${x}-${y}`}>
                <circle
                  cx={58 + x * 38}
                  cy={34 + y * 35}
                  r="3"
                  fill="var(--accent)"
                />
                {x < 3 && (
                  <path
                    d={`M${58 + x * 38} ${34 + y * 35}h38`}
                    stroke="var(--art-rule)"
                  />
                )}
                {y < 3 && (
                  <path
                    d={`M${58 + x * 38} ${34 + y * 35}v35`}
                    stroke="var(--art-rule)"
                  />
                )}
              </g>
            )),
          )}
          <path d="M58 139v-35h38V69h38V34h38" strokeWidth="3" />
          <text x="185" y="143" className="sketch-small">
            n!
          </text>
        </>
      );
      break;
    case "Probability":
      art = (
        <>
          <g transform="rotate(-12 85 92)">
            <rect
              x="41"
              y="48"
              width="85"
              height="85"
              rx="12"
              fill="var(--paper)"
            />
            {[
              [61, 68],
              [106, 68],
              [84, 91],
              [61, 113],
              [106, 113],
            ].map(([x, y]) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="4"
                fill="var(--accent)"
              />
            ))}
          </g>
          <g transform="rotate(14 152 70)">
            <rect
              x="124"
              y="35"
              width="70"
              height="70"
              rx="9"
              fill="var(--paper)"
            />
            <circle cx="142" cy="53" r="4" fill="var(--pencil)" />
            <circle cx="175" cy="87" r="4" fill="var(--pencil)" />
          </g>
        </>
      );
      break;
    case "Strategy":
      art = (
        <>
          <path
            d="M38 125 90 85l46 35 56-76M90 85l38-45M136 120l55 20"
            stroke="var(--art-rule)"
            strokeDasharray="4 4"
          />
          <path d="M38 125 90 85l38-45" strokeWidth="2.5" />
          {[
            [38, 125],
            [90, 85],
            [136, 120],
            [192, 44],
            [128, 40],
            [191, 140],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 4 ? 10 : 7}
              fill={i === 4 ? "var(--accent-wash)" : "var(--paper)"}
            />
          ))}
          <path d="m121 39 5 5 8-9" stroke="var(--pencil)" />
        </>
      );
      break;
    default:
      art = (
        <>
          <circle cx="115" cy="86" r="55" />
          <path d="M40 86h150M115 15v140" stroke="var(--art-rule)" />
          <path d="M115 86 154 47v39Z" fill="var(--accent-wash)" />
          <path d="M132 86a17 17 0 0 0-5-12" stroke="var(--pencil)" />
          <circle cx="154" cy="47" r="4" fill="var(--accent)" />
          <text x="163" y="47" className="sketch-small">
            z
          </text>
          <text x="127" y="108" className="sketch-small">
            θ
          </text>
        </>
      );
  }
  return (
    <svg
      viewBox="0 0 230 175"
      className={`subject-sketch ${className}`}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {art}
    </svg>
  );
}
export function PracticeSketch({
  kind,
}: {
  kind: "formula" | "method" | "mixed";
}) {
  return (
    <NaturalPlate
      kind={
        kind === "formula"
          ? "astronomy"
          : kind === "method"
            ? "botany"
            : "optics"
      }
      className={`practice-sketch practice-sketch-${kind}`}
    />
  );
}
export function FractionPreview() {
  const [parts, setParts] = useState(8);
  const pattern = useId().replaceAll(":", "");
  const wedge = (i: number, total: number, cx: number) => {
    const a = (i * 2 * Math.PI) / total - Math.PI / 2,
      b = ((i + 1) * 2 * Math.PI) / total - Math.PI / 2;
    return `M${cx} 107 L${cx + 66 * Math.cos(a)} ${107 + 66 * Math.sin(a)} A66 66 0 0 1 ${cx + 66 * Math.cos(b)} ${107 + 66 * Math.sin(b)}Z`;
  };
  return (
    <div className="fraction-preview">
      <div className="figure-heading">
        <span>Fig. I · Equivalent fractions</span>
        <span className="figure-hint">Try it below</span>
      </div>
      <svg
        viewBox="0 0 390 230"
        role="img"
        aria-label={`Three quarters equals ${(parts * 3) / 4} over ${parts}. Both circles have the same shaded area.`}
      >
        <defs>
          <pattern
            id={pattern}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity=".32"
            />
          </pattern>
        </defs>
        {[4, parts].map((count, k) => (
          <g key={k}>
            {Array.from({ length: count }, (_, i) => (
              <path
                key={i}
                d={wedge(i, count, k ? 285 : 104)}
                fill={i < count * 0.75 ? `url(#${pattern})` : "var(--paper)"}
                stroke="var(--accent)"
                strokeWidth="1.15"
              />
            ))}
            <circle
              cx={k ? 285 : 104}
              cy="107"
              r="69"
              fill="none"
              stroke="var(--accent)"
              opacity=".25"
            />
            <text
              x={k ? 285 : 104}
              y="205"
              textAnchor="middle"
              className="fraction-caption"
            >
              {k ? `${(parts * 3) / 4} / ${parts}` : "3 / 4"}
            </text>
          </g>
        ))}
        <path
          d="M188 102h15m-15 9h15"
          stroke="var(--pencil)"
          strokeWidth="1.7"
        />
        <path
          d="M130 20q60-25 125 2m-4-7 5 8-10 1"
          fill="none"
          stroke="var(--pencil)"
          strokeWidth="1.1"
        />
        <text x="195" y="14" textAnchor="middle" className="annotation">
          same area
        </text>
      </svg>
      <div className="partition-controls">
        <span>Divide the circle into</span>
        <div aria-label="Number of equal parts">
          {[4, 8, 12].map((n) => (
            <button
              key={n}
              aria-pressed={parts === n}
              onClick={() => setParts(n)}
            >
              {n} parts
            </button>
          ))}
        </div>
      </div>
      <p className="fraction-result" aria-live="polite">
        <M>{`$\\dfrac34=\\dfrac{${(parts * 3) / 4}}{${parts}}$`}</M>
        <span>The pieces change size; the fraction stays the same.</span>
      </p>
    </div>
  );
}
