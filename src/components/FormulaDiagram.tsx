import type { ReactNode } from "react";
const ink = "var(--accent)",
  gold = "var(--gold)",
  red = "var(--pencil)",
  leaf = "var(--botanical)";
function Label({
  x,
  y,
  children,
  color = ink,
  size = 17,
}: {
  x: number;
  y: number;
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={color}
      stroke="none"
      fontSize={size}
    >
      {children}
    </text>
  );
}
function Line({
  x1,
  y1,
  x2,
  y2,
  color = ink,
  dash = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  dash?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.7}
      strokeDasharray={dash ? "5 5" : undefined}
    />
  );
}
function Algebra({ rows, step }: { rows: string[]; step: number }) {
  return (
    <>
      {rows.map((row, i) => (
        <g
          key={i}
          opacity={i <= step ? 1 : 0}
          transform={`translate(0 ${i <= step ? 0 : 12})`}
          className="formula-move"
        >
          <Label
            x={300}
            y={68 + i * 58}
            size={i === step ? 24 : 20}
            color={i === step ? ink : "var(--muted)"}
          >
            {row}
          </Label>
          {i < 3 && (
            <path
              d={`M292 ${95 + i * 58}h16m-11-4 4 4-4 4`}
              stroke={gold}
              fill="none"
            />
          )}
        </g>
      ))}
    </>
  );
}
export function FormulaDiagram({
  scene,
  step,
  worked,
  description,
}: {
  scene: string;
  step: number;
  worked: boolean;
  description: string;
}) {
  let drawing: ReactNode;
  switch (scene) {
    case "circle":
      drawing = (
        <>
          <circle
            cx="300"
            cy="147"
            r="91"
            fill="none"
            stroke={gold}
            opacity={worked || step > 0 ? 1 : 0}
            className="formula-move"
          />
          <circle
            cx="300"
            cy="147"
            r="72"
            fill="var(--gold-wash)"
            fillOpacity=".35"
            stroke={gold}
            opacity={worked || step > 0 ? 1 : 0}
            className="formula-move"
          />
          {Array.from({ length: 6 }, (_, i) => {
            const angle =
              ((i * 60 + (step === 1 && !worked ? 60 : 0)) * Math.PI) / 180;
            const x =
                !worked && step === 0
                  ? 150 + i * 60
                  : 300 + 91 * Math.sin(angle),
              y = !worked && step === 0 ? 130 : 147 - 91 * Math.cos(angle);
            const enemy = i % 2 === 1;
            return (
              <g
                key={i}
                transform={`translate(${x} ${y})`}
                className="formula-move"
              >
                <circle
                  r="19"
                  fill="var(--paper)"
                  stroke={worked && enemy ? red : ink}
                  strokeWidth={i === 0 && step >= 2 ? 3 : 1.5}
                />
                <Label x={0} y={1} color={worked && enemy ? red : ink}>
                  {worked ? (i === 0 ? "G" : enemy ? "E" : "F") : i + 1}
                </Label>
              </g>
            );
          })}
          <Label x={300} y={!worked && step === 0 ? 207 : 145} size={22}>
            {worked
              ? step === 3
                ? "2! × 3! = 12"
                : step === 2
                  ? "3!"
                  : step === 1
                    ? "2!"
                    : "E · F"
              : step < 2
                ? step === 0
                  ? "6! labeled arrangements"
                  : "6 rotations"
                : "5!"}
          </Label>
          <Label x={300} y={282} size={15}>
            {worked
              ? "E = enemy · F = friend · G = Gauss"
              : "A fixed anchor removes rotational copies"}
          </Label>
        </>
      );
      break;
    case "bars":
      {
        const positions = worked && step === 2 ? "******||||" : "**|*|**|*|";
        drawing = (
          <>
            <Label x={300} y={45}>
              {worked
                ? "6 missing pips · 5 distinguished dice"
                : "Stars are objects; bars separate bins"}
            </Label>
            {positions.split("").map((c, i) => (
              <g
                key={i}
                transform={`translate(${88 + i * 47} 124)`}
                className="formula-move"
              >
                {c === "*" ? (
                  <g fill="var(--gold-wash)" stroke={gold}>
                    <path d="M0-12 3-3 12 0 3 3 0 12-3 3-12 0-3-3Z" />
                  </g>
                ) : (
                  <line y1="-25" y2="25" stroke={red} strokeWidth="3" />
                )}
                <Label x={0} y={50} size={13}>
                  {i + 1}
                </Label>
              </g>
            ))}
            <path d="M77 202v9h446v-9" fill="none" stroke={gold} />
            <Label x={300} y={240} size={25}>
              {worked
                ? [
                    "d₁ + d₂ + d₃ + d₄ + d₅ = 24",
                    "10 choose 4 = 210",
                    "6 | 0 | 0 | 0 | 0  is invalid",
                    "210 − 5 = 205",
                  ][step]
                : [
                    "N stars + k − 1 bars",
                    "N + k − 1 positions",
                    "Choose the k − 1 bars",
                    "Lower bounds first; upper bounds next",
                  ][step]}
            </Label>
          </>
        );
      }
      break;
    case "venn":
      drawing = (
        <>
          <rect
            x="65"
            y="45"
            width="470"
            height="205"
            rx="2"
            fill={step === 3 ? "var(--leaf-wash)" : "none"}
            stroke={gold}
          />
          <circle
            cx="245"
            cy="146"
            r="80"
            fill="var(--diagram-fill)"
            fillOpacity=".5"
            stroke={ink}
          />
          <circle
            cx="355"
            cy="146"
            r="80"
            fill="var(--petal-wash)"
            fillOpacity=".7"
            stroke={red}
          />
          {step >= 1 && (
            <path
              d="M300 88A80 80 0 0 1 300 204A80 80 0 0 1 300 88Z"
              fill="var(--gold-wash)"
              stroke={gold}
            />
          )}
          <Label x={220} y={145}>
            A
          </Label>
          <Label x={380} y={145} color={red}>
            B
          </Label>
          {step >= 1 && (
            <Label x={300} y={145} size={15}>
              {worked ? "8" : "A ∩ B"}
            </Label>
          )}
          <Label x={300} y={278} size={22}>
            {worked
              ? [
                  "U: 1024 subsets",
                  "|A| = 32     |B| = 128",
                  "Seven required elements",
                  "1024 − 32 − 128 + 8 = 872",
                ][step]
              : [
                  "Count A and B",
                  "Overlap counted twice",
                  "Subtract one overlap",
                  "Keep the complement",
                ][step]}
          </Label>
        </>
      );
      break;
    case "grid":
      drawing = (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <Line
              key={"x" + i}
              x1={180 + i * 40}
              y1={36}
              x2={180 + i * 40}
              y2={276}
              color="var(--line)"
            />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <Line
              key={"y" + i}
              x1={180}
              y1={36 + i * 40}
              x2={380}
              y2={36 + i * 40}
              color="var(--line)"
            />
          ))}
          <path
            d="M180 276h40v-80h80v-80h80V36"
            stroke={ink}
            strokeWidth="3"
            fill="none"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={step === 0 ? 0.65 : step === 1 ? 0.35 : 0}
            className="formula-move"
          />
          {[
            [180, 276, "(0,0)"],
            [220, 196, "(1,2)"],
            [300, 116, "(3,4)"],
            [380, 76, "(5,5)"],
            [380, 36, "(5,6)"],
          ].map(([x, y, t], i) => (
            <g
              key={i}
              opacity={i === 0 || i === 4 || step > 0 ? 1 : 0}
              className="formula-move"
            >
              <circle cx={+x} cy={+y} r="4" fill={red} />
              <Label x={+x + (i === 0 ? -40 : 48)} y={+y} size={14}>
                {t}
              </Label>
            </g>
          ))}
          <Label x={95} y={130} size={23}>
            {worked
              ? step === 3
                ? "408"
                : step === 2
                  ? "54"
                  : "462"
              : "R / U"}
          </Label>
        </>
      );
      break;
    case "probability":
      drawing = (
        <>
          <rect
            x="175"
            y="32"
            width="240"
            height="240"
            fill="var(--leaf-wash)"
            stroke={ink}
          />
          <g opacity={step > 0 ? 1 : 0} className="formula-move">
            <path
              d="M175 32H355L175 212ZM235 272H415V92Z"
              fill="var(--paper)"
              stroke={gold}
            />
            <path
              d="M175 212 355 32M235 272 415 92"
              stroke={red}
              strokeWidth="2"
            />
          </g>
          <Line x1={175} y1={272} x2={415} y2={32} dash />
          <Label x={300} y={299} size={15}>
            Alex’s arrival →
          </Label>
          <Label x={113} y={147} size={15}>
            Bob
          </Label>
          <Label x={159} y={275} size={13}>
            0
          </Label>
          <Label x={430} y={275} size={13}>
            60
          </Label>
          <Label x={159} y={32} size={13}>
            60
          </Label>
          <Label x={300} y={145} size={22}>
            {step === 3 ? "7 / 16" : step > 0 ? "|x − y| ≤ 15" : "Ω"}
          </Label>
          {step >= 2 && (
            <>
              <Label x={220} y={75} size={15}>
                miss
              </Label>
              <Label x={370} y={230} size={15}>
                miss
              </Label>
            </>
          )}
        </>
      );
      break;
    case "indicators":
      drawing = (
        <>
          <Label x={300} y={42}>
            {worked
              ? "Five selected integers among thirty"
              : "Count each adjacent pair once"}
          </Label>
          {Array.from({ length: 30 }, (_, i) => {
            const selected = [0, 1, 2, 9, 19].includes(i);
            const x = 75 + (i % 15) * 32,
              y = i < 15 ? 106 : 196;
            return (
              <g key={i}>
                {i % 15 < 14 && (
                  <Line
                    x1={x + 4}
                    y1={y}
                    x2={x + 28}
                    y2={y}
                    color={step >= 1 && i < 2 ? red : "var(--line)"}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={selected && step >= 1 ? 7 : 4}
                  fill={selected && step >= 1 ? ink : "var(--paper)"}
                  stroke={ink}
                  className="formula-move"
                />
                <Label x={x} y={y + 23} size={12}>
                  {i + 1}
                </Label>
              </g>
            );
          })}
          <path
            d="M523 106q36 40 0 65L75 171v20"
            stroke="var(--line)"
            fill="none"
          />
          <Label x={300} y={270} size={23}>
            {worked
              ? [
                  "29 candidate pairs",
                  "Fix a pair; choose 3 of the other 28",
                  "P(pair) = 20 / (30 × 29)",
                  "29 × P(pair) = 2/3",
                ][step]
              : [
                  "X = I₁ + I₂ + ⋯ + I₂₉",
                  "Each I is zero or one",
                  "Overlapping pairs may coexist",
                  "E[X] = E[I₁] + ⋯ + E[I₂₉]",
                ][step]}
          </Label>
        </>
      );
      break;
    case "roots":
      drawing = (
        <Algebra
          step={step}
          rows={
            worked
              ? [
                  "r + s = −2;    rs = −5/3",
                  "(r + s)³ = r³ + s³ + 3rs(r + s)",
                  "r³ + s³ = −8 − 10",
                  "r³ + s³ = −18",
                ]
              : [
                  "a(x − r)(x − s)",
                  "ax² − a(r + s)x + ars",
                  "−a(r + s) = b;    ars = c",
                  "r³ + s³ = (r + s)³ − 3rs(r + s)",
                ]
          }
        />
      );
      break;
    case "reduction":
      drawing = (
        <Algebra
          step={step}
          rows={
            worked
              ? [
                  "x² + x⁻² = 3",
                  "x⁴ + x⁻⁴ = 7",
                  "x⁸ − 7x⁴ + 1 = 0",
                  "x³ × 0 = 0",
                ]
              : [
                  "P(x) = (x − a)Q(x) + R",
                  "P(a) = 0 × Q(a) + R",
                  "g(x) = 0 ⇒ P(x) = R(x)",
                  "Find the vanishing factor",
                ]
          }
        />
      );
      break;
    case "series":
      drawing = worked ? (
        <Algebra
          step={step}
          rows={[
            "S(a) = 12/(1 − a)",
            "S(a)S(−a) = 144/(1 − a²)",
            "S(a) + S(−a) = 24/(1 − a²)",
            "Sum = product ÷ 6 = 336",
          ]}
        />
      ) : (
        <>
          {[0, 1].map((row) => (
            <g
              key={row}
              transform={`translate(${step > 0 && row === 1 ? 60 : 0} 0)`}
              className="formula-move"
              opacity={row === 0 || step > 0 ? 1 : 0}
            >
              {["a", "ar", "ar²", "ar³", "…", "arⁿ⁻¹"].map((term, i) => (
                <g
                  key={term}
                  opacity={
                    step >= 2 && i > 0 && !(row === 1 && i === 5) ? 0.15 : 1
                  }
                >
                  <rect
                    x={86 + i * 60}
                    y={80 + row * 85}
                    width={54}
                    height={48}
                    fill={i === 0 ? "var(--gold-wash)" : "var(--accent-wash)"}
                    stroke={gold}
                  />
                  <Label x={113 + i * 60} y={104 + row * 85} size={17}>
                    {row === 1
                      ? ["ar", "ar²", "ar³", "ar⁴", "…", "arⁿ"][i]
                      : term}
                  </Label>
                </g>
              ))}
            </g>
          ))}
          <Label x={300} y={263} size={23}>
            {step < 2
              ? "Align S and rS"
              : step === 2
                ? "(1 − r)S = a − arⁿ"
                : "For |r| < 1, the tail tends to zero"}
          </Label>
        </>
      );
      break;
    case "telescope":
      drawing = worked ? (
        <Algebra
          step={step}
          rows={[
            "1/m − 1/n = 1/29",
            "n = 29m/(29 − m)",
            "n + 29 = 841/(29 − m)",
            "m = 28;    n = 812;    m + n = 840",
          ]}
        />
      ) : (
        <>
          {["1/m", "−1/(m+1)", "+1/(m+1)", "−1/(m+2)", "…", "−1/n"].map(
            (t, i) => (
              <g
                key={t}
                opacity={step >= 2 && i > 0 && i < 5 ? 0.2 : 1}
                className="formula-move"
              >
                <Label
                  x={115 + (i % 2) * 270}
                  y={65 + Math.floor(i / 2) * 70}
                  size={22}
                >
                  {t}
                </Label>
                {step >= 2 && i > 0 && i < 4 && (
                  <Line
                    x1={55 + (i % 2) * 270}
                    y1={80 + Math.floor(i / 2) * 70}
                    x2={175 + (i % 2) * 270}
                    y2={50 + Math.floor(i / 2) * 70}
                    color={red}
                  />
                )}
              </g>
            ),
          )}
          <Label x={300} y={280} size={23}>
            {step >= 2 ? "Only the endpoints survive" : "Split, align, cancel"}
          </Label>
        </>
      );
      break;
    case "divisors":
      drawing = (
        <>
          <Label x={300} y={42}>
            {worked
              ? "768 = 3 × 2⁸; 384 = 3 × 2⁷"
              : "Each divisor chooses one exponent of each prime"}
          </Label>
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(${85 + i * 53} 0)`}>
              {[0, 1].map((j) => (
                <g
                  key={j}
                  opacity={worked && step >= 2 && i < 8 ? 0.14 : 1}
                  className="formula-move"
                >
                  <circle
                    cy={105 + j * 75}
                    r="17"
                    fill={i === 8 ? "var(--gold-wash)" : "var(--paper)"}
                    stroke={i === 8 ? gold : ink}
                  />
                  <Label x={0} y={105 + j * 75} size={13}>
                    {Math.pow(2, i) * (j ? 3 : 1)}
                  </Label>
                </g>
              ))}
            </g>
          ))}
          <Label x={300} y={252} size={22}>
            {worked && step >= 2
              ? "Only the new reciprocal-power term remains"
              : "Every positive divisor appears once"}
          </Label>
          {worked && step === 3 && (
            <Label x={300} y={285} size={23}>
              4 / (3 × 256) = 1/192
            </Label>
          )}
        </>
      );
      break;
    case "clock":
      drawing = (
        <>
          {Array.from({ length: 17 }, (_, i) => {
            let a = (i * 2 * Math.PI) / 17;
            return (
              <g key={i}>
                <circle
                  cx={300 + 105 * Math.sin(a)}
                  cy={148 - 105 * Math.cos(a)}
                  r="3"
                  fill={gold}
                />
                <Label
                  x={300 + 126 * Math.sin(a)}
                  y={148 - 126 * Math.cos(a)}
                  size={13}
                >
                  {i}
                </Label>
              </g>
            );
          })}
          {(worked
            ? [[5, 16, 15, 4][step]]
            : [5, 14, 6, 15].slice(0, step + 1)
          ).map((i, j) => {
            let a = (i * 2 * Math.PI) / 17;
            return (
              <Line
                key={j}
                x1={300}
                y1={148}
                x2={300 + 101 * Math.sin(a)}
                y2={148 - 101 * Math.cos(a)}
                color={worked || j === step ? red : "var(--line)"}
              />
            );
          })}
          <circle cx="300" cy="148" r="36" fill="var(--paper)" stroke={gold} />
          <Label x={300} y={148}>
            {worked
              ? ["N mod 17", "9k mod 17", "k mod 17", "N mod 17"][step]
              : "mod 17"}
          </Label>
          <Label x={300} y={297} size={17}>
            {worked
              ? ["N = 5 + 9k", "9k ≡ 16", "k ≡ 15", "140 = 17 × 8 + 4"][step]
              : "An arithmetic progression winds around a residue circle"}
          </Label>
        </>
      );
      break;
    case "border":
      drawing = (
        <>
          <rect
            x="145"
            y="55"
            width={worked ? 300 : 310}
            height={worked ? 125 : 180}
            fill="var(--gold-wash)"
            stroke={gold}
          />
          <rect
            x={worked ? 170 : 145}
            y={worked ? 80 : 55}
            width={worked ? 250 : 230}
            height={worked ? 75 : 125}
            fill="var(--accent-wash)"
            stroke={ink}
            className="formula-move"
          />
          {!worked && (
            <>
              <Line x1={375} y1={55} x2={375} y2={235} />
              <Line x1={145} y1={180} x2={455} y2={180} />
              <rect
                x="375"
                y="180"
                width="80"
                height="55"
                fill={step >= 1 ? "var(--petal-wash)" : "var(--paper)"}
                stroke={gold}
                className="formula-move"
              />
              <Label x={415} y={209}>
                ab
              </Label>
              <Label x={260} y={115}>
                xy
              </Label>
            </>
          )}
          <Label x={300} y={30}>
            {worked ? "outer length b" : "Complete the missing corner"}
          </Label>
          <Label x={108} y={147}>
            {worked ? "a" : "y+a"}
          </Label>
          <Label x={300} y={148} size={23}>
            {worked
              ? step === 0
                ? "(a−2)(b−2)"
                : step === 1
                  ? "(a−4)(b−4)=8"
                  : step === 2
                    ? "1×8 or 2×4"
                    : "(5,12) and (6,8)"
              : ""}
          </Label>
          <Label x={300} y={280} size={18}>
            {worked
              ? "The border is one foot wide on all four sides"
              : "(x + b)(y + a) = c + ab"}
          </Label>
        </>
      );
      break;
    case "triangle":
      drawing = (
        <g transform="translate(30 0)">
          <path
            d="M190 257H290L190 17Z"
            fill="var(--gold-wash)"
            fillOpacity=".3"
            stroke={ink}
            strokeWidth="2"
          />
          {worked ? (
            <>
              <Label x={231} y={280}>
                5
              </Label>
              <Label x={165} y={135}>
                12
              </Label>
              <Label x={265} y={128}>
                13
              </Label>
              {step >= 1 && (
                <>
                  <circle cx="230" cy="217" r="40" fill="none" stroke={leaf} />
                  <circle cx="230" cy="217" r="3" fill={leaf} />
                  <Label x={205} y={215} size={15}>
                    I
                  </Label>
                </>
              )}
              {step >= 2 && (
                <>
                  <circle cx="240" cy="137" r="3" fill={red} />
                  <Label x={257} y={142} color={red}>
                    O
                  </Label>
                  <Line
                    x1={240}
                    y1={137}
                    x2={230}
                    y2={217}
                    color={red}
                    dash={step < 3}
                  />
                </>
              )}
              {step === 3 && (
                <Label x={390} y={195} size={20}>
                  OI = √65/2
                </Label>
              )}
            </>
          ) : (
            <>
              <circle cx="230" cy="217" r="40" fill="none" stroke={leaf} />
              {[
                [190, 217],
                [230, 257],
                [267, 201],
              ].map(([x, y], i) => (
                <Line
                  key={i}
                  x1={230}
                  y1={217}
                  x2={x}
                  y2={y}
                  color={leaf}
                  dash
                />
              ))}
              <Label x={345} y={110} size={22}>
                {step < 2 ? "K = rs" : "K = abc / 4R"}
              </Label>
              {step >= 2 && (
                <circle cx="240" cy="137" r="130" fill="none" stroke={gold} />
              )}
            </>
          )}
        </g>
      );
      break;
    case "polygon":
      drawing = (
        <>
          <path
            d="M145 255 215 115 355 45 425 255Z"
            stroke={ink}
            fill="var(--gold-wash)"
            fillOpacity=".4"
            strokeWidth="2"
          />
          {step >= 1 && (
            <>
              <path
                d="M145 255 381.25 123.75 425 255Z"
                fill="var(--diagram-fill)"
                stroke={ink}
              />
              <Line
                x1={381.25}
                y1={123.75}
                x2={381.25}
                y2={255}
                dash
                color={red}
              />
              <circle cx="381.25" cy="123.75" r="4" fill={red} />
              <Label x={432} y={117} size={15}>
                E
              </Label>
            </>
          )}
          {[
            [125, 273, "A (0,0)"],
            [180, 100, "B (1,2)"],
            [355, 22, "C (3,3)"],
            [452, 273, "D (4,0)"],
          ].map(([x, y, t]) => (
            <Label key={t} x={+x} y={+y} size={14}>
              {t}
            </Label>
          ))}
          <Label x={300} y={295} size={20}>
            {worked
              ? ["K = 15/2", "[ADE] = 2y", "y = 15/8", "E = (27/8, 15/8)"][step]
              : [
                  "Oriented triangles",
                  "Signed areas add",
                  "Close the boundary",
                  "Take the absolute value last",
                ][step]}
          </Label>
        </>
      );
      break;
    case "amgm":
      {
        let values = step < 2 ? [3, 5, 7] : [5, 5, 5];
        drawing = (
          <>
            <Label x={300} y={40}>
              {worked
                ? "A + 1, M + 1, C + 1 have sum 15"
                : "Equalize factors while preserving their sum"}
            </Label>
            {values.map((v, i) => (
              <g key={i}>
                <rect
                  x={170 + i * 100}
                  y={240 - v * 23}
                  width="60"
                  height={v * 23}
                  fill={i === 1 ? "var(--gold-wash)" : "var(--accent-wash)"}
                  stroke={i === 1 ? gold : ink}
                  className="formula-move"
                />
                <Label x={200 + i * 100} y={263}>
                  {v}
                </Label>
              </g>
            ))}
            <Line x1={145} y1={125} x2={455} y2={125} color={red} dash />
            <Label x={485} y={125} size={14}>
              mean 5
            </Label>
            <Label x={300} y={300} size={20}>
              {worked && step === 3
                ? "125 − 13 = 112"
                : step >= 2
                  ? "5 × 5 × 5 = 125"
                  : "3 × 5 × 7 = 105"}
            </Label>
          </>
        );
      }
      break;
    case "logs":
      drawing = (
        <Algebra
          step={step}
          rows={
            worked
              ? [
                  "log₍₃ₓ₎ 4 = log₍₂ₓ₎ 8",
                  "2 ln(2x) = 3 ln(3x)",
                  "ln x = ln(4/27)",
                  "x = 4/27;    p + q = 31",
                ]
              : ["bʸ = a", "ln(bʸ) = ln a", "y ln b = ln a", "y = ln a / ln b"]
          }
        />
      );
      break;
    case "complex":
      drawing = worked ? (
        <>
          <Line x1={90} y1={230} x2={485} y2={230} />
          <Line x1={390} y1={270} x2={390} y2={45} />
          <Label x={510} y={230}>
            Re
          </Label>
          <Label x={390} y={27}>
            Im
          </Label>
          <Line
            x1={105}
            y1={164.4}
            x2={465}
            y2={164.4}
            color="var(--line)"
            dash
          />
          <path
            d={`M390 230L${step >= 1 ? 127.6 : 406.4} 164.4`}
            fill="none"
            stroke={ink}
            strokeWidth="3"
            className="formula-move"
          />
          {step >= 1 && (
            <>
              <path
                d="M390 230L406.4 164.4"
                fill="none"
                stroke={gold}
                strokeWidth="2"
              />
              <path d="M400 195Q365 175 350 213" fill="none" stroke={red} />
              <Label x={330} y={100} color={red}>
                × 4i
              </Label>
            </>
          )}
          <Label x={461} y={146} size={15}>
            z + n
          </Label>
          {step >= 1 && (
            <Label x={170} y={143} size={15}>
              z = −656 + 164i
            </Label>
          )}
          <Label x={300} y={295} size={18}>
            {step === 3
              ? "The horizontal translation is n = 697"
              : "Both vectors end at imaginary coordinate 164"}
          </Label>
        </>
      ) : step < 3 ? (
        <>
          <Line x1={125} y1={165} x2={475} y2={165} />
          <Line x1={300} y1={280} x2={300} y2={40} />
          <path
            d="M300 165 420 85M300 165 420 245"
            stroke={ink}
            fill="none"
            strokeWidth="2"
          />
          <Line x1={420} y1={85} x2={420} y2={245} dash color={gold} />
          <Label x={448} y={70} size={18}>
            c + di
          </Label>
          <Label x={448} y={262} size={18}>
            c − di
          </Label>
          <Label x={190} y={100} size={20}>
            {step === 0
              ? "Reflect in the real axis"
              : step === 1
                ? "Product: c² + d²"
                : "Collect real and imaginary parts"}
          </Label>
        </>
      ) : (
        <>
          <Line x1={100} y1={230} x2={490} y2={230} />
          <Line x1={300} y1={280} x2={300} y2={30} />
          <path
            d="M300 230 420 150"
            stroke={gold}
            strokeWidth="2"
            fill="none"
          />
          <path d="M300 230 220 110" stroke={ink} strokeWidth="3" fill="none" />
          <path d="M380 177Q310 120 247 150" stroke={red} fill="none" />
          <Label x={445} y={143} size={17}>
            x + yi
          </Label>
          <Label x={198} y={89} size={17}>
            −y + xi
          </Label>
          <Label x={300} y={295} size={19}>
            Multiplication by i preserves length
          </Label>
        </>
      );
      break;
    default:
      drawing = null;
  }
  return (
    <svg
      className="formula-diagram"
      viewBox="0 0 600 330"
      role="img"
      aria-label={description}
    >
      <path
        d="M18 58V18h40M542 18h40v40M18 272v40h40M542 312h40v-40"
        fill="none"
        stroke="var(--line)"
      />
      <g fontFamily="var(--serif)">{drawing}</g>
    </svg>
  );
}
