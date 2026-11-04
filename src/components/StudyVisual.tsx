import { useEffect, useState, type ReactNode } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { M } from "./Math";
const settings: Record<string, [number, number, number, number, string]> = {
  "sequence-synthesis": [1, 6, 1, 2, "Current term index"],
  "integer-constraints": [0, 4, 1, 1, "Admissible factor pair"],
  "congruence-systems": [0, 8, 1, 2, "Progression index k"],
  "valuations-divisors": [5, 50, 5, 20, "Factorial input"],
  "geometric-constructions": [3, 11, 1, 5, "Apex projection along the base"],
  "ratio-geometry": [1, 4, 1, 2, "Fifths of the full side"],
  "circle-synthesis": [6, 12, 1, 8, "Distance from point to circle center"],
  "coordinate-lattice": [2, 8, 1, 2, "Apex x-coordinate"],
  "spatial-geometry": [1, 9, 1, 4, "Cut height from the vertex, in tenths"],
  "constrained-counting": [1, 5, 1, 3, "Number of separated ones"],
  "combinatorial-identities": [
    4,
    10,
    1,
    6,
    "Elements available for a marked subset",
  ],
  "probability-states": [1, 15, 2, 5, "Number of balls, odd values"],
  "invariant-extremal": [1, 16, 1, 12, "Selected integers"],
  "inequalities-domains": [2, 5, 0.25, 3, "Allowed value of x"],
  "log-trig-synthesis": [0, 360, 1, 30, "Angle in degrees"],
  "complex-roots-unity": [3, 12, 1, 7, "Number of roots"],
};
export const studyVisualIds = new Set(Object.keys(settings));
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const choose = (n: number, k: number) =>
  range(k).reduce((v, i) => (v * (n - i)) / (i + 1), 1);
const fmt = (n: number) => Number(n.toFixed(3)).toString();
const text = (x: number, y: number, value: string | number, size = 13) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size}>
    {value}
  </text>
);
const line = (x1: number, y1: number, x2: number, y2: number, dash = false) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="var(--art-rule)"
    strokeWidth="1.4"
    strokeDasharray={dash ? "4 4" : undefined}
  />
);
const dot = (x: number, y: number, r = 4, color = "var(--accent)") => (
  <circle cx={x} cy={y} r={r} fill={color} />
);
export function StudyVisual({ id }: { id: string }) {
  const [min, max, step, initial, label] = settings[id];
  const [n, setN] = useState(initial),
    [playing, setPlaying] = useState(false);
  const reduced =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setInterval(
      () => setN((v) => (v + step > max ? min : Number((v + step).toFixed(3)))),
      1200,
    );
    return () => clearInterval(timer);
  }, [playing, reduced, min, max, step]);
  let heading = "",
    description = "",
    result = "",
    accessible = "",
    drawing: ReactNode = null;
  if (id === "sequence-synthesis") {
    heading = "Subtract a fixed point";
    const a = 2 * 3 ** (n - 1) - 1,
      next = 3 * a + 2;
    description =
      "Predict the next term before advancing. Adding one changes the affine update into multiplication by three.";
    result = String.raw`$a_{${n}}=${a},\qquad a_{${n + 1}}=${next},\qquad a_{n+1}+1=3(a_n+1)$`;
    accessible = `Term ${n} is ${a}. Add one to get ${a + 1}; multiply by three to get ${next + 1}; subtract one to get ${next}.`;
    drawing = (
      <>
        {[
          [65, 70, a, "aₙ"],
          [300, 70, next, "aₙ₊₁"],
          [65, 175, a + 1, "aₙ + 1"],
          [300, 175, next + 1, "aₙ₊₁ + 1"],
        ].map(([x, y, value, name]) => (
          <g key={String(name)}>
            <rect
              x={Number(x) - 43}
              y={Number(y) - 27}
              width="86"
              height="54"
              fill="var(--paper-deep)"
              stroke="var(--art-rule)"
            />
            {text(Number(x), Number(y) - 37, String(name))}
            {text(Number(x), Number(y) + 6, String(value), 19)}
          </g>
        ))}
        {line(110, 70, 255, 70)}
        {text(182, 60, "× 3, then + 2")}
        {line(110, 175, 255, 175)}
        {text(182, 164, "× 3")}
        {line(65, 98, 65, 145, true)}
        {line(300, 98, 300, 145, true)}
        {text(86, 128, "+ 1")}
        {text(321, 128, "+ 1")}
      </>
    );
  } else if (id === "integer-constraints") {
    heading = "Reciprocals become factor pairs";
    const a = [1, 2, 3, 4, 6][n],
      b = 36 / a,
      w = b * 5,
      h = a * 5;
    description =
      "Every positive factor pair of 36 gives a reciprocal solution. The slider lists only the pairs with the first factor no larger than the second.";
    result = String.raw`$(${a}+6,\ ${b}+6)=(${a + 6},\ ${b + 6}),\quad \frac1{${a + 6}}+\frac1{${b + 6}}=\frac16$`;
    accessible = `A rectangle with sides ${a} and ${b} has area 36. The corresponding reciprocal solution is x=${a + 6}, y=${b + 6}.`;
    drawing = (
      <>
        {text(210, 35, "(x − 6)(y − 6) = 36", 20)}
        <rect
          x={210 - w / 2}
          y={125 - h / 2}
          width={w}
          height={h}
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        {text(210, 125 - h / 2 - 14, `y − 6 = ${b}`)}
        {text(210 + w / 2 + 43, 130, `x − 6 = ${a}`, 12)}
        {text(210, 195, "The area stays 36; the side lengths change.")}
      </>
    );
  } else if (id === "congruence-systems") {
    heading = "Intersect three residue conditions";
    const value = 17 + 35 * n,
      residue = value % 9;
    description =
      "Every value on this progression already satisfies the first two congruences. Find the first slider position that also leaves remainder four modulo nine.";
    result = String.raw`$n=17+35(${n})=${value},\quad n\bmod5=2,\quad n\bmod7=3,\quad n\bmod9=${residue}$`;
    accessible = `${value} leaves remainders 2, 3, and ${residue} modulo 5, 7, and 9. Target remainder modulo nine is four.`;
    drawing = (
      <>
        <circle cx="210" cy="119" r="78" fill="none" stroke="var(--art-rule)" />
        {range(9).map((k) => {
          const t = -Math.PI / 2 + (2 * Math.PI * k) / 9,
            cx = 210 + 78 * Math.cos(t),
            cy = 119 + 78 * Math.sin(t);
          return (
            <g key={k}>
              {k === 4 && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="15"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2"
                />
              )}
              {dot(
                cx,
                cy,
                10,
                k === residue ? "var(--accent-wash)" : "var(--panel)",
              )}
              {text(cx, cy + 4, k, 12)}
            </g>
          );
        })}
        {text(210, 115, value, 25)}
        {text(210, 138, "modulo 9")}
        {text(210, 232, "Gold ring: the required remainder")}
      </>
    );
  } else if (id === "valuations-divisors") {
    heading = "Count the prime layers in a factorial";
    const powers = [2, 4, 8, 16, 32],
      counts = powers.map((p) => Math.floor(n / p)),
      total = counts.reduce((a, b) => a + b, 0);
    description =
      "A multiple of eight appears in three layers because it supplies at least three factors of two. Watch the jumps when a new prime power enters the factorial.";
    result = String.raw`$v_2(${n}!)=${counts.join("+")}=${total}$`;
    accessible = `The exponent of two in ${n} factorial is ${total}, from layers ${counts.join(", ")}.`;
    drawing = (
      <>
        {powers.map((p, k) => (
          <g key={p}>
            {text(
              47,
              41 + k * 36,
              `2${["¹", "²", "³", "⁴", "⁵"][k]} = ${p}`,
              12,
            )}
            <rect
              x="90"
              y={25 + k * 36}
              width={counts[k] * 9}
              height="20"
              fill={k % 2 ? "var(--pencil)" : "var(--accent)"}
              opacity=".8"
            />
            {text(108 + counts[k] * 9, 40 + k * 36, counts[k])}
          </g>
        ))}
        {text(210, 232, "Each layer counts an additional copy of the prime.")}
      </>
    );
  } else if (id === "geometric-constructions") {
    heading = "One altitude, two right triangles";
    const apex = 60 + 20 * n;
    description =
      "Move the apex while keeping its altitude fixed. Predict the area, then compare the two right-triangle equations. The foot need not bisect the base.";
    result = String.raw`$h=7,\quad K=\tfrac12(14)(7)=49,\quad AB^2=${n * n + 49},\quad AC^2=${(14 - n) ** 2 + 49}$`;
    accessible = `Base fourteen, height seven, apex projection ${n}. Area remains 49; the two side squares are ${n * n + 49} and ${(14 - n) ** 2 + 49}.`;
    drawing = (
      <>
        <path
          d={`M60 195 L340 195 L${apex} 55Z`}
          fill="var(--accent-wash)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        {line(apex, 55, apex, 195, true)}
        <path d={`M${apex} 184h11v11`} fill="none" stroke="var(--pencil)" />
        {text(apex, 41, "A")}
        {text(48, 213, "B")}
        {text(352, 213, "C")}
        {text(apex + 18, 125, "7")}
        {text((60 + apex) / 2, 215, n)}
        {text((340 + apex) / 2, 215, 14 - n)}
        {text(210, 240, "Equal height does not mean equal sloping sides.", 12)}
      </>
    );
  } else if (id === "ratio-geometry") {
    heading = "A length scale becomes an area scale";
    const t = n / 5,
      ax = 95,
      ay = 30,
      bx = 45,
      by = 195,
      cx = 350,
      cy = 195,
      dx = ax + t * (bx - ax),
      dy = ay + t * (by - ay),
      ex = ax + t * (cx - ax);
    description =
      "The interior segment stays parallel to the base. Predict whether doubling the side fraction doubles or quadruples the shaded area fraction.";
    result = String.raw`$\frac{AD}{AB}=\frac{${n}}5,\qquad\frac{[ADE]}{[ABC]}=\frac{${n * n}}{25}$`;
    accessible = `The small triangle has length scale ${n}/5 and area scale ${n * n}/25.`;
    drawing = (
      <>
        <path
          d={`M${ax} ${ay} L${bx} ${by} L${cx} ${cy}Z`}
          fill="none"
          stroke="var(--art-rule)"
        />
        <path
          d={`M${ax} ${ay} L${dx} ${dy} L${ex} ${dy}Z`}
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        {text(ax, 19, "A")}
        {text(bx, 216, "B")}
        {text(cx, 216, "C")}
        {text(dx - 15, dy + 4, "D")}
        {text(ex + 15, dy + 4, "E")}
        {text(210, 240, "Both the base and the altitude scale.", 12)}
      </>
    );
  } else if (id === "circle-synthesis") {
    heading = "One point, one power";
    const ox = 130,
      oy = 125,
      r = 65,
      scale = 13,
      px = ox + n * scale,
      tx = ox + (scale * 25) / n,
      ty = oy - (scale * 5 * Math.sqrt(n * n - 25)) / n;
    description =
      "Move the external point. Compare tangent squared with outside times whole on the secant through the center. The inside segment alone is not a power factor.";
    result = String.raw`$PT^2=${n * n - 25}=(${n}-5)(${n}+5)=${n - 5}\cdot${n + 5}$`;
    accessible = `Circle radius five, external center distance ${n}. The tangent square and secant product both equal ${n * n - 25}.`;
    drawing = (
      <>
        <circle cx={ox} cy={oy} r={r} fill="none" stroke="var(--art-rule)" />
        {line(ox - r, oy, px, oy)}
        {line(px, oy, tx, ty)}
        {line(ox, oy, tx, ty, true)}
        {dot(px, oy)}
        {dot(tx, ty)}
        {dot(ox, oy, 3)}
        {text(ox - 10, oy + 18, "O")}
        {text(px + 14, oy + 6, "P")}
        {text(tx, ty - 12, "T")}
        {text((px + ox + r) / 2, oy + 24, `outside ${n - 5}`, 11)}
        {text(
          210,
          218,
          `whole secant ${n + 5}; tangent ≈ ${fmt(Math.sqrt(n * n - 25))}`,
        )}
      </>
    );
  } else if (id === "coordinate-lattice") {
    heading = "Boundary points change while area stays fixed";
    const boundary = 8 + gcd(8 - n, 6) + gcd(n, 6),
      interior = 25 - boundary / 2;
    description =
      "The base and altitude stay fixed. Move the lattice apex and count how the sloping-edge gcds alter the boundary and interior counts.";
    result = String.raw`$K=24,\quad B=${boundary},\quad I=24-\frac{${boundary}}2+1=${interior}$`;
    accessible = `Triangle vertices zero-zero, eight-zero, and ${n}-six. Area 24, boundary count ${boundary}, interior count ${interior}.`;
    drawing = (
      <>
        {range(9).map((j) => (
          <g key={j}>
            {line(70 + 30 * j, 25, 70 + 30 * j, 205)}
            {text(70 + 30 * j, 224, j, 10)}
          </g>
        ))}
        {range(7).map((j) => (
          <g key={j}>
            {line(70, 205 - 30 * j, 310, 205 - 30 * j)}
            {text(55, 209 - 30 * j, j, 10)}
          </g>
        ))}
        <path
          d={`M70 205H310L${70 + 30 * n} 25Z`}
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        {range(9).flatMap((a) =>
          range(7).map((b) =>
            b > 0 && a > (n * b) / 6 && a < 8 + ((n - 8) * b) / 6 ? (
              <g key={`${a}-${b}`}>
                {dot(70 + 30 * a, 205 - 30 * b, 3, "var(--gold)")}
              </g>
            ) : null,
          ),
        )}
        {text(210, 244, "Gold points are strictly inside.", 12)}
      </>
    );
  } else if (id === "spatial-geometry") {
    heading = "A parallel cut scales three dimensions";
    const t = n / 10,
      y = 25 + 170 * t,
      rx = 90 * t,
      ry = 18 * t;
    description =
      "The shaded cone is the similar solid. Its height fraction determines its radius fraction; its volume fraction is the cube, not the square, of that scale.";
    result = String.raw`$\frac{h_{small}}{h}=\frac{${n}}{10},\quad\frac{V_{small}}V=\frac{${n ** 3}}{1000},\quad\frac{V_{remaining}}V=\frac{${1000 - n ** 3}}{1000}$`;
    accessible = `The cut is ${n} tenths from the cone vertex. Removed volume fraction ${n ** 3}/1000; remaining fraction ${1000 - n ** 3}/1000.`;
    drawing = (
      <>
        <ellipse
          cx="210"
          cy="195"
          rx="90"
          ry="18"
          fill="none"
          stroke="var(--art-rule)"
        />
        <path
          d="M120 195L210 25L300 195"
          fill="none"
          stroke="var(--art-rule)"
        />
        <path
          d={`M210 25L${210 - rx} ${y}A${rx} ${ry} 0 0 0 ${210 + rx} ${y}Z`}
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        <ellipse
          cx="210"
          cy={y}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="var(--accent)"
          strokeDasharray="3 3"
        />
        {line(210, 25, 210, 195, true)}
        {text(330, 115, `${n}/10 of height`, 12)}
        {text(
          210,
          236,
          "The remaining frustum is not similar to the cone.",
          12,
        )}
      </>
    );
  } else if (id === "constrained-counting") {
    heading = "Separate the ones by choosing gaps";
    const zeros = 10 - n,
      gaps = zeros + 1,
      spacing = 380 / (2 * zeros + 1),
      count = Math.round(choose(gaps, n));
    description =
      "Place the zeros first. One one may occupy each gap, including either end. The picture shows one valid arrangement; the binomial coefficient counts every gap choice.";
    result = String.raw`$\#=\binom{${gaps}}{${n}}=${count}$`;
    accessible = `${zeros} zeros create ${gaps} gaps. Choosing ${n} distinct gaps gives ${count} nonadjacent-one strings.`;
    drawing = (
      <>
        {text(210, 48, `${zeros} zeros · ${gaps} available gaps`, 18)}
        {range(gaps).map((j) => (
          <g key={j}>
            <rect
              x={20 + 2 * j * spacing - 8}
              y="102"
              width="16"
              height="36"
              fill={j < n ? "var(--accent-wash)" : "none"}
              stroke={j < n ? "var(--accent)" : "var(--art-rule)"}
              strokeDasharray={j < n ? undefined : "3 3"}
            />
            {j < n && text(20 + 2 * j * spacing, 126, "1")}
            {j < zeros && text(20 + (2 * j + 1) * spacing, 126, "0", 17)}
          </g>
        ))}
        {text(210, 188, "Choose gaps, not adjacent positions.")}
        {text(210, 220, `${n} ones + ${zeros} zeros = 10 places`)}
      </>
    );
  } else if (id === "combinatorial-identities") {
    heading = "Choose the marked member first";
    const value = n * 2 ** (n - 1);
    description =
      "A marked subset can be chosen in either order. After choosing its marked member, every other element has two independent membership choices.";
    result = String.raw`$\sum_{k=0}^{${n}}k\binom{${n}}k=${n}\cdot2^{${n - 1}}=${value}$`;
    accessible = `There are ${n} choices for the marked member and two choices for each of ${n - 1} other elements, giving ${value} marked subsets.`;
    drawing = (
      <>
        {range(n).map((k) => {
          const a = (2 * Math.PI * k) / n - Math.PI / 2,
            cx = 210 + 78 * Math.cos(a),
            cy = 119 + 78 * Math.sin(a);
          return (
            <g key={k}>
              {k !== 0 && line(210, 119, cx, cy, true)}
              {dot(cx, cy, 11, "var(--accent-wash)")}
              {k === 0 && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="12"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="2"
                />
              )}
              {text(cx, cy + 4, k + 1, 11)}
            </g>
          );
        })}
        {text(210, 114, "include")}
        {text(210, 135, "or omit")}
        {text(
          210,
          237,
          "Gold marks the distinguished member in one example.",
          11,
        )}
      </>
    );
  } else if (id === "probability-states") {
    heading = "Two placements, two parity states";
    const numerator = (3 ** n - 3) / 4,
      denominator = 3 ** n,
      d = gcd(numerator, denominator),
      prob = numerator / denominator;
    description =
      "At odd times, exactly one or three boxes have odd occupancy. The arrows represent two more placements. Predict how the probability changes before advancing by two balls.";
    result = String.raw`$b_{n+2}=\frac29+\frac19b_n,\quad b_{${n}}=\frac{${numerator / d}}{${denominator / d}}\approx${prob.toFixed(5)}$`;
    accessible = `After ${n} balls, the probability of all three occupancies being odd is ${numerator / d} over ${denominator / d}.`;
    drawing = (
      <>
        <circle
          cx="105"
          cy="95"
          r="37"
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        <circle
          cx="310"
          cy="95"
          r="37"
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        {text(105, 100, "1 odd")}
        {text(310, 100, "3 odd")}
        <path
          d="M145 77Q207 26 270 77M270 115Q207 165 145 115"
          fill="none"
          stroke="var(--pencil)"
        />
        <path
          d="M260 66L270 77L255 78M158 116L145 115L151 128"
          fill="none"
          stroke="var(--pencil)"
        />
        {text(207, 51, "2/9 →")}
        {text(207, 153, "← 2/3")}
        {text(105, 30, "stay: 7/9", 12)}
        {text(310, 30, "stay: 1/3", 12)}
        <rect
          x="50"
          y="192"
          width="320"
          height="16"
          fill="var(--paper-deep)"
          stroke="var(--art-rule)"
        />
        <rect
          x="50"
          y="192"
          width={320 * prob}
          height="16"
          fill="var(--accent)"
        />
        {text(
          210,
          235,
          `All three odd after ${n} balls: ${(prob * 100).toFixed(2)}%`,
        )}
      </>
    );
  } else if (id === "invariant-extremal") {
    heading = "Odd parts create divisibility chains";
    const selected = new Set(range(Math.min(n, 15)).map((j) => 16 + j));
    if (n === 16) selected.add(8);
    description =
      "The first fifteen selections are 16 through 30 and avoid divisibility pairs. Adding eight repeats an odd-part chain. Any sixteen selections must repeat one of the fifteen chains.";
    result = String.raw`$\text{15 chains}\quad\Longrightarrow\quad\text{16 selections force a divisibility pair}$`;
    accessible = `${n} selected integers are highlighted in fifteen odd-part chains. ${n === 16 ? "Eight and sixteen share the first chain." : "No highlighted pair shares a chain."}`;
    drawing = (
      <>
        {range(15).map((j) => {
          const odd = 2 * j + 1,
            values = [];
          for (let v = odd; v <= 30; v *= 2) values.push(v);
          const col = Math.floor(j / 5),
            row = j % 5;
          return (
            <g key={odd}>
              {values.map((v, k) => (
                <g key={v}>
                  {k > 0 &&
                    line(
                      20 + col * 137 + (k - 1) * 23,
                      35 + row * 37,
                      20 + col * 137 + k * 23,
                      35 + row * 37,
                    )}
                  {dot(
                    20 + col * 137 + k * 23,
                    35 + row * 37,
                    10,
                    selected.has(v) ? "var(--accent-wash)" : "var(--panel)",
                  )}
                  {text(20 + col * 137 + k * 23, 39 + row * 37, v, 11)}
                </g>
              ))}
            </g>
          );
        })}
        {text(
          210,
          235,
          `${n} selected; ${n === 16 ? "a chain contains two selections" : "at most one selected per chain"}`,
          12,
        )}
      </>
    );
  } else if (id === "inequalities-domains") {
    heading = "A bound may be outside the domain";
    const f = (v: number) => v * v + 4 / (v * v),
      px = (v: number) => 40 + 80 * (v - 1),
      py = (v: number) => 205 - 6 * f(v),
      curve = range(81)
        .map((j) => `${j ? "L" : "M"}${px(1 + j / 20)} ${py(1 + j / 20)}`)
        .join(" ");
    description =
      "The usual AM–GM bound is four, attained at √2. Here x is restricted to [2,5]. Compare the allowed curve with the excluded equality point.";
    result = String.raw`$x=${n},\quad x^2+\frac4{x^2}\approx${f(n).toFixed(3)},\qquad\min_{2\le x\le5}=5$`;
    accessible = `Allowed x is ${n}; the expression is approximately ${f(n).toFixed(3)}. The excluded global minimum four is at square root of two; the allowed minimum five is at two.`;
    drawing = (
      <>
        <rect
          x={px(2)}
          y="35"
          width={px(5) - px(2)}
          height="170"
          fill="var(--accent-wash)"
        />
        {line(32, 205, 375, 205)}
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            {line(px(v), 200, px(v), 210)}
            {text(px(v), 227, v)}
          </g>
        ))}
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth="2" />
        {dot(px(n), py(n), 5)}
        <circle
          cx={px(Math.sqrt(2))}
          cy={py(Math.sqrt(2))}
          r="5"
          fill="var(--panel)"
          stroke="var(--pencil)"
        />
        {text(85, 151, "excluded: 4", 12)}
        {text(244, 42, "allowed interval", 12)}
        {text(px(n), py(n) - 12, fmt(f(n)), 12)}
        {text(210, 246, "Equality must satisfy the original restriction.", 12)}
      </>
    );
  } else if (id === "log-trig-synthesis") {
    heading = "One unit vector, two linked coordinates";
    const theta = (n * Math.PI) / 180,
      c = Math.cos(theta),
      s = Math.sin(theta),
      value = 3 * s + 4 * c;
    description =
      "Sine and cosine cannot be maximized independently. Align the unit vector with (4,3) to approach the amplitude five; that direction is about 36.87°.";
    result = String.raw`$3\sin(${n}^\circ)+4\cos(${n}^\circ)\approx${value.toFixed(4)},\quad |3\sin\theta+4\cos\theta|\le5$`;
    accessible = `At ${n} degrees, the expression is approximately ${value.toFixed(4)}. The coefficient direction has cosine four fifths and sine three fifths.`;
    drawing = (
      <>
        <circle cx="210" cy="120" r="82" fill="none" stroke="var(--art-rule)" />
        {line(110, 120, 310, 120)}
        {line(210, 20, 210, 220)}
        <path
          d="M210 120L275.6 70.8"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
        />
        {text(304, 63, "(4/5, 3/5)", 11)}
        <path
          d={`M210 120L${210 + 82 * c} ${120 - 82 * s}`}
          stroke="var(--accent)"
          strokeWidth="2"
        />
        {dot(210 + 82 * c, 120 - 82 * s, 5)}
        {line(210 + 82 * c, 120 - 82 * s, 210 + 82 * c, 120, true)}
        {text(210, 242, "Gold: the positive equality direction", 12)}
      </>
    );
  } else if (id === "complex-roots-unity") {
    heading = "Polygon chords from a root polynomial";
    const pts = range(n).map((k) => [
      210 + 82 * Math.cos((2 * Math.PI * k) / n),
      120 - 82 * Math.sin((2 * Math.PI * k) / n),
    ]);
    description =
      "Each vertex is a root of unity. Predict the chord product before adding another vertex. Removing the root one leaves a polynomial whose value at one is the number of vertices.";
    result = String.raw`$\prod_{k=1}^{${n - 1}}|1-\zeta_k|=${n},\qquad\sum_{k=1}^{${n - 1}}|1-\zeta_k|^2=${2 * n}$`;
    accessible = `Regular ${n}-gon on the unit circle. The product of distances from the marked vertex to the other vertices is ${n}; their squared-distance sum is ${2 * n}.`;
    drawing = (
      <>
        <circle cx="210" cy="120" r="82" fill="none" stroke="var(--art-rule)" />
        <polygon
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="var(--accent-wash)"
          stroke="var(--accent)"
        />
        {pts.slice(1).map(([a, b], k) => (
          <g key={k}>{line(292, 120, a, b, true)}</g>
        ))}
        {pts.map(([a, b], k) => (
          <g key={k}>
            {dot(
              a,
              b,
              k === 0 ? 6 : 4,
              k === 0 ? "var(--gold)" : "var(--accent)",
            )}
          </g>
        ))}
        {text(315, 124, "1")}
        {text(210, 242, `1 + t + ⋯ + tⁿ⁻¹ at t = 1 gives ${n}`, 12)}
      </>
    );
  }
  return (
    <div className="visual contest-visual">
      <div className="visual-heading">{heading}</div>
      <svg viewBox="0 0 420 260" role="img" aria-label={accessible}>
        {drawing}
      </svg>
      <p className="visual-result" aria-live="polite">
        <M>{result}</M>
      </p>
      <p className="small">{description}</p>
      <div className="visual-controls">
        <label>
          {label}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={n}
            onChange={(e) => {
              setPlaying(false);
              setN(Number(e.target.value));
            }}
          />
        </label>
        <button
          className="icon-button"
          aria-label={playing ? "Pause animation" : "Play animation"}
          disabled={reduced}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          className="icon-button"
          aria-label="Reset exploration"
          onClick={() => {
            setPlaying(false);
            setN(initial);
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
