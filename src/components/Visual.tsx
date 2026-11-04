import { useEffect, useState, type ReactNode } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { M } from "./Math";
import { ContestVisual, contestVisualIds } from "./ContestVisual";
import { StudyVisual, studyVisualIds } from "./StudyVisual";
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const choose = (n: number, k: number) => fact(n) / fact(k) / fact(n - k);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const fmt = (n: number) => Number(n.toFixed(3)).toString();
const range = (n: number) =>
  Array.from({ length: Math.max(0, n) }, (_, i) => i);
const configs: Record<string, [number, number, number, string]> = {
  fractions: [1, 11, 1, "Shaded twelfths"],
  ratios: [2, 8, 1, "First part of the ratio"],
  rates: [2, 10, 1, "Outward speed"],
  exponents: [1, 6, 1, "Exponent"],
  linear: [1, 8, 1, "Constant term"],
  statistics: [0, 12, 1, "Move the last value"],
  identities: [1, 8, 1, "Side a"],
  quadratics: [-4, 8, 1, "Vertical shift"],
  vieta: [-3, 7, 1, "First root"],
  polynomials: [-2, 4, 0.25, "Evaluation point"],
  arithmetic: [3, 9, 1, "Number of terms"],
  geometric: [2, 7, 1, "Number of terms"],
  telescoping: [2, 8, 1, "Number of terms"],
  inequalities: [1, 11, 1, "Rectangle width"],
  factors: [1, 6, 1, "Exponent of 2"],
  divisibility: [5, 40, 1, "Factorial input"],
  gcd: [2, 10, 1, "Common scale"],
  modular: [1, 12, 1, "Exponent"],
  diophantine: [4, 14, 1, "Total n"],
  bases: [2, 9, 1, "Base"],
  floor: [-3, 3, 0.25, "Input x"],
  angles: [20, 80, 1, "Angle A, degrees"],
  "triangle-area": [0, 10, 0.25, "Apex position"],
  "right-triangles": [2, 8, 0.25, "First leg"],
  similarity: [1, 5, 0.25, "Scale factor"],
  quadrilaterals: [2, 10, 0.25, "Top base"],
  circles: [30, 330, 10, "Sector angle"],
  "circle-power": [1, 8, 1, "Point position"],
  polygons: [3, 10, 1, "Number of sides"],
  coordinates: [1, 8, 0.25, "Horizontal change"],
  solids: [1, 5, 0.25, "Scale factor"],
  composite: [1, 5, 0.25, "Circle diameter"],
  counting: [2, 5, 1, "First choices"],
  permutations: [3, 7, 1, "Number of objects"],
  combinations: [3, 8, 1, "Number of points"],
  inclusion: [0, 8, 1, "Overlap"],
  "stars-bars": [2, 9, 1, "Identical objects"],
  "geometric-counting": [2, 6, 1, "Grid width"],
  recurrence: [1, 10, 1, "Number of stairs"],
  probability: [2, 12, 1, "Target dice sum"],
  conditional: [1, 8, 1, "Initial red balls"],
  "geometric-probability": [1, 9, 1, "Threshold in tenths"],
  expectation: [1, 9, 1, "Win probability in tenths"],
  invariants: [0, 8, 1, "Moves of +2"],
  extremal: [1, 15, 1, "Objects in four boxes"],
  logarithms: [-3, 5, 1, "Exponent"],
  trigonometry: [0, 360, 15, "Angle, degrees"],
  "trig-geometry": [30, 150, 10, "Included angle"],
  complex: [0, 360, 30, "Rotation, degrees"],
  binomial: [1, 8, 1, "Power n"],
};
export function Visual({ id }: { id: string }) {
  return contestVisualIds.has(id) ? <ContestVisual key={id} id={id}/> : studyVisualIds.has(id) ? <StudyVisual key={id} id={id}/> : <ReferenceVisual key={id} id={id}/>;
}
function ReferenceVisual({ id }: { id: string }) {
  const [min, max, step, label] = configs[id] ?? [1, 8, 1, "Value"];
  const [n, setN] = useState(min + Math.floor((max - min) / step / 2) * step);
  const [playing, setPlaying] = useState(false);
  const reduced =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setInterval(
      () => setN((v) => (v + step > max ? min : Number((v + step).toFixed(3)))),
      900,
    );
    return () => clearInterval(timer);
  }, [playing, min, max, step, reduced]);
  let drawing: ReactNode = null,
    result = "",
    prompt = "Change the value. What changes, and what stays the same?";
  const line = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = "currentColor",
  ) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />
  );
  const text = (x: number, y: number, value: string | number) => (
    <text x={x} y={y} textAnchor="middle">
      {value}
    </text>
  );
  const dot = (x: number, y: number, r = 5) => (
    <circle cx={x} cy={y} r={r} fill="var(--accent)" />
  );
  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill = "var(--accent-wash)",
  ) => (
    <rect x={x} y={y} width={w} height={h} fill={fill} stroke="var(--accent)" />
  );
  const poly = (points: string, fill = "var(--accent-wash)") => (
    <polygon
      points={points}
      fill={fill}
      stroke="var(--accent)"
      strokeWidth="1.5"
    />
  );
  const graph = (
    fn: (x: number) => number,
    xmin = -5,
    xmax = 5,
    ymin = -5,
    ymax = 10,
  ) => {
    const x = (v: number) => 45 + ((v - xmin) / (xmax - xmin)) * 310,
      y = (v: number) => 215 - ((v - ymin) / (ymax - ymin)) * 180;
    return (
      <>
        {line(x(xmin), y(0), x(xmax), y(0), "var(--art-rule)")}
        {line(x(0), y(ymin), x(0), y(ymax), "var(--art-rule)")}
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          points={range(121)
            .map((i) => {
              const v = xmin + ((xmax - xmin) * i) / 120;
              return `${x(v)},${Math.max(15, Math.min(235, y(fn(v))))}`;
            })
            .join(" ")}
        />
      </>
    );
  };
  switch (id) {
    case "fractions":
      drawing = (
        <>
          {range(12).map((i) => (
            <g key={i}>
              {rect(
                38 + i * 27,
                90,
                24,
                65,
                i < n ? "var(--diagram-fill)" : "var(--paper)",
              )}
            </g>
          ))}
          {text(200, 192, `${n} of 12 equal parts`)}
        </>
      );
      result = `$\\frac{${n}}{12}=\\frac{${n / gcd(n, 12)}}{${12 / gcd(n, 12)}}$`;
      prompt = "Does simplifying change the amount shaded?";
      break;
    case "ratios":
      drawing = (
        <>
          {rect(45, 65, n * 32, 35)}
          {rect(45, 135, 96, 35, "var(--petal-wash)")}
          {text(200, 213, `${2 * n} : 6`)}
        </>
      );
      result = `$${n}:3=${2 * n}:6$`;
      break;
    case "rates":
      drawing = (
        <>
          {line(45, 210, 355, 210)}
          {line(45, 210, 45, 35)}
          <polyline
            points={`45,210 ${45 + (240 * (20 / n)) / (20 / n + 5)},60 285,210`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
          />
          {text(200, 238, "time →")}
          {text(210, 35, "20 miles out, 20 miles back")}
        </>
      );
      result = `Average speed $=\\frac{40}{20/${n}+20/4}\\approx ${fmt(40 / (20 / n + 5))}$ mph.`;
      prompt = "Why does averaging the two speeds give the wrong result?";
      break;
    case "exponents":
      drawing = (
        <>
          {range(2 ** n).map((i) => (
            <g key={i}>
              {dot(55 + (i % 16) * 20, 55 + Math.floor(i / 16) * 40, 6)}
            </g>
          ))}
        </>
      );
      result = `$2^{${n}}=${2 ** n}$. One more doubling multiplies the count by 2.`;
      break;
    case "linear":
      drawing = (
        <>
          {line(60, 170, 340, 170)}
          {poly("200,170 185,205 215,205")}
          {rect(85, 105, 60, 50)}
          {rect(150, 105, 60, 50)}
          {rect(215, 130, 30, 25, "var(--petal-wash)")}
          {text(115, 136, "x")}
          {text(180, 136, "x")}
          {text(230, 148, n)}
          {text(305, 145, "16")}
        </>
      );
      result = `$2x+${n}=16 \\Rightarrow x=${fmt((16 - n) / 2)}$. Subtract the same amount from both sides.`;
      break;
    case "statistics": {
      const values = [2, 4, 6, 8, n].sort((a, b) => a - b);
      drawing = (
        <>
          {line(40, 170, 360, 170)}
          {range(13).map((i) => (
            <g key={i}>{text(40 + i * 26.6, 195, i)}</g>
          ))}
          {values.map((v, i) => (
            <g key={i}>
              {dot(
                40 + v * 26.6,
                140 - values.slice(0, i).filter((x) => x === v).length * 20,
                7,
              )}
            </g>
          ))}
        </>
      );
      result = `Mean $=${fmt((20 + n) / 5)}$; median $=${values[2]}$.`;
      prompt = "Which measure responds more strongly to the moving point?";
      break;
    }
    case "identities": {
      const a = n * 16,
        b = 32,
        x = 65,
        y = 25;
      drawing = (
        <>
          {rect(x, y, a, a)}
          {rect(x + a, y, b, a, "var(--leaf-wash)")}
          {rect(x, y + a, a, b, "var(--leaf-wash)")}
          {rect(x + a, y + a, b, b, "var(--paper-deep)")}
          {text(x + a / 2, y + a / 2, `${n}²`)}
          {text(x + a + b / 2, y + a / 2, `2a`)}
          {text(x + a / 2, y + a + b / 2, "2a")}
          {text(x + a + b / 2, y + a + b / 2, 4)}
        </>
      );
      result = `$(${n}+2)^2=${n * n}+4(${n})+4=${(n + 2) ** 2}$`;
      prompt = "Locate each of the four terms in the area model.";
      break;
    }
    case "quadratics":
      drawing = graph((x) => (x - 2) ** 2 + n, -3, 7, -5, 20);
      result = `$y=(x-2)^2+(${n})$. ${n < 0 ? "Two real roots" : n === 0 ? "One repeated real root" : "No real roots"}; discriminant $=${-4 * n}$.`;
      break;
    case "vieta":
      drawing = (
        <>
          {graph((x) => (x - n) * (x - 3), -5, 9, -18, 25)}
          {text(200, 248, `roots: ${n} and 3`)}
        </>
      );
      result = `$(x-(${n}))(x-3)=x^2-(${n + 3})x+(${3 * n})$. Sum $=${n + 3}$, product $=${3 * n}$.`;
      break;
    case "polynomials":
      drawing = (
        <>
          {graph((x) => x * x * x - 2 * x + 1, -3, 5, -15, 50)}
          {text(225, 30, `P(${n}) = ${fmt(n ** 3 - 2 * n + 1)}`)}
        </>
      );
      result = `Dividing $P(x)=x^3-2x+1$ by $x-(${n})$ leaves remainder $P(${n})=${fmt(n ** 3 - 2 * n + 1)}$.`;
      break;
    case "arithmetic":
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {rect(40 + i * 34, 205 - (i + 1) * 18, 28, (i + 1) * 18)}
              {text(54 + i * 34, 228, i + 1)}
            </g>
          ))}
        </>
      );
      result = `$1+\\cdots+${n}=\\frac{${n}(${n}+1)}2=${(n * (n + 1)) / 2}$`;
      prompt = "Pair the first and last terms. What does every pair sum to?";
      break;
    case "geometric":
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {rect(
                40 + (1 - 2 ** -i) * 300,
                75,
                300 * 2 ** (-i - 1),
                90,
                i % 2 ? "var(--petal-wash)" : "var(--accent-wash)",
              )}
            </g>
          ))}
          {line(40, 180, 340, 180)}
          {text(190, 210, "The full bar represents 2")}
        </>
      );
      result = `$1+\\frac12+\\cdots+\\frac1{${2 ** (n - 1)}}=2(1-2^{-${n}})=${fmt(2 * (1 - 2 ** -n))}$`;
      break;
    case "telescoping":
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {text(
                65 + (i % 4) * 90,
                65 + Math.floor(i / 4) * 80,
                `1/${i + 1} − 1/${i + 2}`,
              )}
              {i > 0 &&
                line(
                  45 + (i % 4) * 90,
                  60 + Math.floor(i / 4) * 80,
                  71 + (i % 4) * 90,
                  72 + Math.floor(i / 4) * 80,
                  "var(--pencil)",
                )}
            </g>
          ))}
        </>
      );
      result = `$\\sum_{k=1}^{${n}}(\\frac1k-\\frac1{k+1})=1-\\frac1{${n + 1}}$`;
      prompt = "Which terms survive after neighboring terms cancel?";
      break;
    case "inequalities":
      drawing = (
        <>
          {rect(200 - n * 12, 130 - (12 - n) * 9, n * 24, (12 - n) * 18)}
          {text(200, 245, `${n} × ${12 - n}`)}
        </>
      );
      result = `Perimeter $=24$; area $=${n * (12 - n)}=36-(${n}-6)^2\\le36$.`;
      break;
    case "factors":
      drawing = (
        <>
          {range(n + 1).map((i) =>
            range(3).map((j) => (
              <g key={`${i}-${j}`}>
                {rect(35 + i * 46, 45 + j * 55, 42, 45)}
                {text(56 + i * 46, 73 + j * 55, 2 ** i * 3 ** j)}
              </g>
            )),
          )}
        </>
      );
      result = `$2^{${n}}3^2=${2 ** n * 9}$ has $(${n}+1)(2+1)=${(n + 1) * 3}$ positive divisors.`;
      break;
    case "divisibility":
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {rect(
                30 + (i % 10) * 34,
                35 + Math.floor(i / 10) * 47,
                30,
                34,
                (i + 1) % 5 === 0 ? "var(--diagram-fill)" : "var(--paper)",
              )}
              {text(45 + (i % 10) * 34, 58 + Math.floor(i / 10) * 47, i + 1)}
            </g>
          ))}
        </>
      );
      result = `$v_5(${n}!)=\\lfloor${n}/5\\rfloor+\\lfloor${n}/25\\rfloor=${Math.floor(n / 5) + Math.floor(n / 25)}$`;
      prompt = "Multiples of 25 contribute a second factor of 5.";
      break;
    case "gcd":
      drawing = (
        <>
          {range(7).map((i) => (
            <g key={i}>
              {line(40 + i * 50, 95, 40 + i * 50, 165, "var(--diagram-fill)")}
              {text(40 + i * 50, 195, i * n)}
              {i % 2 === 0 && dot(40 + i * 50, 100, 8)}
              {i % 3 === 0 && dot(40 + i * 50, 155, 8)}
            </g>
          ))}
          {text(200, 40, `Multiples of ${2 * n} and ${3 * n}`)}
        </>
      );
      result = `$\\gcd(${2 * n},${3 * n})=${n}$; $\\operatorname{lcm}(${2 * n},${3 * n})=${6 * n}$.`;
      break;
    case "modular": {
      const r = 2 ** n % 7;
      drawing = (
        <>
          <circle
            cx="200"
            cy="125"
            r="85"
            fill="none"
            stroke="var(--accent-wash)"
          />
          {range(7).map((i) => {
            const a = (i * Math.PI * 2) / 7 - Math.PI / 2;
            return (
              <g key={i}>
                {dot(
                  200 + 85 * Math.cos(a),
                  125 + 85 * Math.sin(a),
                  i === r ? 14 : 4,
                )}
                {text(200 + 108 * Math.cos(a), 131 + 108 * Math.sin(a), i)}
              </g>
            );
          })}
          {text(200, 130, r)}
        </>
      );
      result = `$2^{${n}}\\equiv ${r}\\pmod7$. The residues repeat: $2,4,1$.`;
      break;
    }
    case "diophantine":
      drawing = (
        <>
          {line(40, 210, 355, 210)}
          {line(40, 210, 40, 30)}
          {range(Math.floor(n / 2) + 1).map((y) => (
            <g key={y}>{dot(40 + (n - 2 * y) * 21, 210 - y * 22, 6)}</g>
          ))}
          {text(200, 242, "Nonnegative integer pairs (x, y)")}
        </>
      );
      result = `$x+2y=${n}$ has $\\lfloor${n}/2\\rfloor+1=${Math.floor(n / 2) + 1}$ nonnegative integer solutions.`;
      break;
    case "bases":
      drawing = (
        <>
          {rect(55, 65, 130, 110)}
          {rect(205, 65, 65, 110, "var(--petal-wash)")}
          {rect(290, 65, 45, 110, "var(--paper)")}
          {text(120, 125, `${n}²`)}
          {text(237, 125, n)}
          {text(312, 125, 0)}
          {text(200, 213, "1 · base² + 1 · base + 0")}
        </>
      );
      result = `$110_{${n}}=${n}^2+${n}=${n * n + n}$.`;
      break;
    case "floor":
      drawing = (
        <>
          {line(35, 125, 365, 125, "var(--art-rule)")}
          {line(200, 20, 200, 230, "var(--art-rule)")}
          {range(6).map((i) => (
            <g key={i}>
              {line(
                50 + i * 50,
                125 - (i - 3) * 27,
                100 + i * 50,
                125 - (i - 3) * 27,
              )}
              {dot(50 + i * 50, 125 - (i - 3) * 27, 3)}
            </g>
          ))}
          {dot(200 + n * 50, 125 - Math.floor(n) * 27, 8)}
        </>
      );
      result = `$\\lfloor${n}\\rfloor=${Math.floor(n)}$, while $|${n}|=${Math.abs(n)}$.`;
      prompt = "Watch what happens just to the left of zero.";
      break;
    case "angles": {
      const B = (40 * Math.PI) / 180,
        A = (n * Math.PI) / 180,
        h = 260 / (1 / Math.tan(A) + 1 / Math.tan(B)),
        x = 70 + h / Math.tan(A);
      drawing = (
        <>
          {poly(`70,210 330,210 ${x},${210 - h}`)}
          {text(93, 200, `${n}°`)}
          {text(299, 200, "40°")}
          {text(x, 195 - h, `${140 - n}°`)}
        </>
      );
      result = `$${n}^\\circ+40^\\circ+${140 - n}^\\circ=180^\\circ$`;
      break;
    }
    case "triangle-area":
      drawing = (
        <>
          {poly(`55,210 345,210 ${55 + n * 29},60`)}
          {line(55 + n * 29, 60, 55 + n * 29, 210, "var(--pencil)")}
          {text(200, 235, "base = 10")}
          {text(55 + n * 29 + 22, 140, "h = 6")}
        </>
      );
      result =
        "$A=\\frac12(10)(6)=30$. Sliding the apex preserves base and height.";
      break;
    case "right-triangles":
      drawing = (
        <>
          {poly(`90,205 ${90 + n * 28},205 90,37`)}
          {text(80, 120, 6)}
          {text(100 + n * 14, 230, n)}
          {text(120 + n * 16, 115, `√${fmt(n * n + 36)}`)}
        </>
      );
      result = `$c^2=${n}^2+6^2=${fmt(n * n + 36)}$, so $c\\approx${fmt(Math.sqrt(n * n + 36))}$.`;
      break;
    case "similarity":
      drawing = (
        <>
          {poly("40,220 100,220 40,180", "var(--petal-wash)")}
          {poly(`140,220 ${140 + 42 * n},220 140,${220 - 28 * n}`)}
          {text(200, 40, `Scale factor ${n}`)}
        </>
      );
      result = `Lengths scale by $${n}$; areas scale by $${n}^2=${fmt(n * n)}$.`;
      break;
    case "quadrilaterals":
      drawing = (
        <>
          {poly(`50,210 350,210 ${200 + n * 15},60 ${200 - n * 15},60`)}
          {line(125 - n * 7.5, 135, 275 + n * 7.5, 135, "var(--pencil)")}
          {text(200, 48, n)}
          {text(200, 235, 10)}
          {text(200, 125, `midline = ${fmt((n + 10) / 2)}`)}
        </>
      );
      result = `$A=\\frac{${n}+10}{2}\\cdot5=${fmt((n + 10) * 2.5)}$`;
      break;
    case "circles": {
      const a = (n * Math.PI) / 180,
        x = 200 + 90 * Math.cos(a),
        y = 125 - 90 * Math.sin(a);
      drawing = (
        <>
          <circle
            cx="200"
            cy="125"
            r="90"
            fill="var(--paper)"
            stroke="var(--art-rule)"
          />
          <path
            d={`M200 125 L290 125 A90 90 0 ${n > 180 ? 1 : 0} 0 ${x} ${y} Z`}
            fill="var(--diagram-fill)"
            stroke="var(--accent)"
          />
          {text(200, 130, `${n}°`)}
        </>
      );
      result = `Sector area $=\\frac{${n}}{360}\\pi(3)^2=${fmt(n / 40)}\\pi$.`;
      break;
    }
    case "circle-power": {
      const d = n * 0.3,
        h = Math.sqrt(16 - d * d);
      drawing = (
        <>
          <circle
            cx="200"
            cy="125"
            r="95"
            fill="var(--paper)"
            stroke="var(--accent)"
          />
          {line(105, 125, 295, 125)}
          {line(
            200 + d * 23.75,
            125 - h * 23.75,
            200 + d * 23.75,
            125 + h * 23.75,
          )}
          {dot(200 + d * 23.75, 125, 6)}
          {text(200 + d * 23.75 + 14, 140, "P")}
        </>
      );
      result = `Both chord products equal $4^2-${fmt(d)}^2=${fmt(16 - d * d)}$.`;
      prompt =
        "The products stay equal for a fixed point; their shared value changes as P moves.";
      break;
    }
    case "polygons": {
      const points = range(n).map((i) => [
        200 + 95 * Math.cos((i * 2 * Math.PI) / n - Math.PI / 2),
        130 + 95 * Math.sin((i * 2 * Math.PI) / n - Math.PI / 2),
      ]);
      drawing = (
        <>
          {poly(points.map((p) => p.join(",")).join(" "))}
          {points.slice(2, -1).map((p, i) => (
            <g key={i}>
              {line(points[0][0], points[0][1], p[0], p[1], "var(--pencil)")}
            </g>
          ))}
        </>
      );
      result = `$${n}$ sides: angle sum $=(${n}-2)180^\\circ=${(n - 2) * 180}^\\circ$; diagonals $=${(n * (n - 3)) / 2}$.`;
      break;
    }
    case "coordinates":
      drawing = (
        <>
          {line(45, 210, 355, 210)}
          {line(45, 210, 45, 25)}
          {line(45, 210, 45 + n * 35, 70)}
          {line(45 + n * 35, 70, 45 + n * 35, 210, "var(--diagram-fill)")}
          {dot(45 + n * 35, 70)}
          {dot(45 + n * 17.5, 140)}
          {text(45 + n * 35, 50, `(${n}, 4)`)}
        </>
      );
      result = `Slope $=4/${n}$; distance $=\\sqrt{${fmt(n * n + 16)}}$; midpoint $=(${fmt(n / 2)},2)$.`;
      break;
    case "solids": {
      const w = 20 * n,
        h = 30 * n,
        d = 12 * n,
        x = 140,
        y = 220;
      drawing = (
        <>
          {poly(`${x},${y} ${x + w},${y} ${x + w},${y - h} ${x},${y - h}`)}
          {poly(
            `${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y - h - d} ${x + w},${y - h}`,
            "var(--art-rule)",
          )}
          {poly(
            `${x},${y - h} ${x + d},${y - h - d} ${x + w + d},${y - h - d} ${x + w},${y - h}`,
            "var(--accent-wash)",
          )}
        </>
      );
      result = `Edges $${n},${2 * n},${3 * n}$; volume $=6(${n})^3=${fmt(6 * n ** 3)}$.`;
      break;
    }
    case "composite":
      drawing = (
        <>
          {rect(100, 25, 200, 200)}
          <circle
            cx="200"
            cy="125"
            r={(n / 2 / 6) * 200}
            fill="var(--paper)"
            stroke="var(--accent)"
          />
        </>
      );
      result = `Shaded area $=36-\\pi(${fmt(n / 2)})^2\\approx${fmt(36 - (Math.PI * n * n) / 4)}$.`;
      break;
    case "counting":
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {line(60, 125, 175, 30 + (i * 190) / (n - 1))}
              {dot(175, 30 + (i * 190) / (n - 1))}
              {range(3).map((j) => (
                <g key={j}>
                  {line(
                    175,
                    30 + (i * 190) / (n - 1),
                    300,
                    20 + ((i * 3 + j) * 215) / (3 * n - 1),
                  )}
                  {dot(300, 20 + ((i * 3 + j) * 215) / (3 * n - 1), 3)}
                </g>
              ))}
            </g>
          ))}
          {dot(60, 125)}
        </>
      );
      result = `$${n}$ first choices, then 3 choices: $${n}\\cdot3=${n * 3}$ outcomes.`;
      break;
    case "permutations":
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {rect(25 + i * 49, 75, 42, 65)}
              {text(46 + i * 49, 115, String.fromCharCode(65 + i))}
              {text(46 + i * 49, 172, n - i)}
            </g>
          ))}
        </>
      );
      result = `$${n}!=${fact(n)}$. The available choices decrease after each position.`;
      break;
    case "combinations": {
      const p = range(n).map((i) => [
        200 + 95 * Math.cos((i * 2 * Math.PI) / n),
        125 + 95 * Math.sin((i * 2 * Math.PI) / n),
      ]);
      drawing = (
        <>
          {p.flatMap((a, i) =>
            p
              .slice(i + 1)
              .map((b, j) => (
                <g key={`${i}-${j}`}>
                  {line(a[0], a[1], b[0], b[1], "var(--diagram-fill)")}
                </g>
              )),
          )}
          {p.map((a, i) => (
            <g key={i}>{dot(a[0], a[1], 6)}</g>
          ))}
        </>
      );
      result = `Choosing two endpoints: $\\binom{${n}}2=${choose(n, 2)}$. Order does not create a new pair.`;
      break;
    }
    case "inclusion":
      drawing = (
        <>
          <ellipse
            cx="155"
            cy="125"
            rx="95"
            ry="80"
            fill="var(--accent-wash)"
            fillOpacity=".7"
            stroke="var(--accent)"
          />
          <ellipse
            cx="245"
            cy="125"
            rx="95"
            ry="80"
            fill="var(--petal-wash)"
            fillOpacity=".6"
            stroke="var(--pencil)"
          />
          {text(120, 130, 12 - n)}
          {text(200, 130, n)}
          {text(280, 130, 10 - n)}
          {text(200, 230, "Counts shown; circle areas are schematic.")}
        </>
      );
      result = `$|A\\cup B|=12+10-${n}=${22 - n}$. Subtract the overlap once.`;
      break;
    case "stars-bars":
      drawing = (
        <>
          {range(n + 2).map((i) => (
            <g key={i}>
              {i === Math.floor(n / 3) || i === Math.floor((n * 2) / 3) + 1
                ? line(35 + i * 30, 75, 35 + i * 30, 145)
                : text(35 + i * 30, 120, "★")}
            </g>
          ))}
          {text(200, 200, "Stars are identical; the three groups are labeled.")}
        </>
      );
      result = `$x+y+z=${n}$, all $\\ge0$: $\\binom{${n + 2}}2=${choose(n + 2, 2)}$ distributions.`;
      break;
    case "geometric-counting":
      drawing = (
        <>
          {range(n + 1).map((x) =>
            range(5).map((y) => (
              <g key={`${x}-${y}`}>
                {x < n &&
                  line(
                    40 + x * 48,
                    220 - y * 43,
                    88 + x * 48,
                    220 - y * 43,
                    "var(--accent-wash)",
                  )}
                {y < 4 &&
                  line(
                    40 + x * 48,
                    220 - y * 43,
                    40 + x * 48,
                    177 - y * 43,
                    "var(--accent-wash)",
                  )}
                {text(40 + x * 48, 214 - y * 43, choose(x + y, y))}
              </g>
            )),
          )}
        </>
      );
      result = `Right/up paths across a $${n}\\times4$ grid: $\\binom{${n + 4}}4=${choose(n + 4, 4)}$.`;
      break;
    case "recurrence": {
      const f = [1, 1];
      for (let i = 2; i <= n; i++) f[i] = f[i - 1] + f[i - 2];
      drawing = (
        <>
          {range(n).map((i) => (
            <g key={i}>
              {rect(30 + i * 33, 220 - (i + 1) * 18, 33, (i + 1) * 18)}
              {text(46 + i * 33, 210 - (i + 1) * 18, f[i + 1])}
            </g>
          ))}
        </>
      );
      result = `Steps of size 1 or 2: $f(${n})=${f[n]}$, using $f(n)=f(n-1)+f(n-2)$.`;
      break;
    }
    case "probability": {
      let count = 0;
      drawing = (
        <>
          {range(6).map((i) =>
            range(6).map((j) => {
              const yes = i + j + 2 === n;
              if (yes) count++;
              return (
                <g key={`${i}-${j}`}>
                  {rect(
                    95 + i * 34,
                    20 + j * 34,
                    31,
                    31,
                    yes ? "var(--art-rule)" : "var(--paper)",
                  )}
                  {text(110 + i * 34, 40 + j * 34, i + j + 2)}
                </g>
              );
            }),
          )}
        </>
      );
      result = `Sum $${n}$: $${count}$ of 36 equally likely outcomes, so $P=\\frac{${count}}{36}$.`;
      break;
    }
    case "conditional":
      drawing = (
        <>
          {range(n + 4).map((i) => (
            <g key={i}>
              <circle
                cx={65 + (i % 7) * 45}
                cy={85 + Math.floor(i / 7) * 65}
                r="15"
                fill={i < n ? "#b7846f" : "#839fa7"}
                opacity={i === 0 ? 0.25 : 1}
              />
              {i === 0 && line(48, 70, 82, 100)}
            </g>
          ))}
          {text(
            200,
            225,
            "Given: the first ball was red and was not replaced.",
          )}
        </>
      );
      result = `Remaining: $${n - 1}$ red, 4 blue. $P(\\text{next red})=\\frac{${n - 1}}{${n + 3}}$.`;
      break;
    case "geometric-probability": {
      const t = n / 10;
      drawing = (
        <>
          {rect(100, 25, 200, 200, "var(--paper)")}
          {poly(`100,225 ${100 + 200 * t},225 100,${225 - 200 * t}`)}
          {text(200, 248, "Unit square: x + y ≤ t")}
        </>
      );
      result = `$t=${t}$: favorable area $=\\frac12t^2=${fmt((t * t) / 2)}$.`;
      break;
    }
    case "expectation":
      drawing = (
        <>
          {rect(
            95,
            210 - (10 - n) * 17,
            70,
            (10 - n) * 17,
            "var(--accent-wash)",
          )}
          {rect(235, 210 - n * 17, 70, n * 17)}
          {text(130, 235, "$0")}
          {text(270, 235, "$10")}
          {text(130, 195 - (10 - n) * 17, `${(10 - n) * 10}%`)}
          {text(270, 195 - n * 17, `${n * 10}%`)}
        </>
      );
      result = `$E[X]=0(1-${n}/10)+10(${n}/10)=${n}$. Expected value need not be a possible outcome.`;
      break;
    case "invariants":
      drawing = (
        <>
          {line(30, 150, 370, 150)}
          {range(9).map((i) => (
            <g key={i}>
              {dot(40 + i * 40, 150, i === n ? 10 : 4)}
              {text(40 + i * 40, 182, 3 + 2 * i)}
              {i < n && (
                <path
                  d={`M${40 + i * 40} 140 q20 -55 40 0`}
                  fill="none"
                  stroke="var(--art-rule)"
                />
              )}
            </g>
          ))}
        </>
      );
      result = `After $${n}$ moves, $3+2(${n})=${3 + 2 * n}\\equiv1\\pmod2$. An even target is unreachable.`;
      break;
    case "extremal":
      drawing = (
        <>
          {range(4).map((i) => (
            <g key={i}>
              {rect(40 + i * 85, 65, 70, 125, "var(--paper)")}
              {range(Math.floor(n / 4) + (i < n % 4 ? 1 : 0)).map((j) => (
                <g key={j}>{dot(75 + i * 85, 170 - j * 25, 8)}</g>
              ))}
            </g>
          ))}
        </>
      );
      result = `At least one of four boxes contains $\\lceil${n}/4\\rceil=${Math.ceil(n / 4)}$ objects. This balanced arrangement attains the bound.`;
      break;
    case "logarithms":
      drawing = (
        <>
          {rect(140, 60, 120, 60)}
          {text(200, 98, "2 to the power")}
          {line(50, 90, 140, 90)}
          {line(260, 90, 350, 90)}
          {text(75, 70, n)}
          {text(325, 70, fmt(2 ** n))}
          {rect(140, 155, 120, 60, "var(--accent-wash)")}
          {text(200, 193, "log base 2")}
          {line(50, 185, 140, 185)}
          {line(260, 185, 350, 185)}
          {text(75, 165, fmt(2 ** n))}
          {text(325, 165, n)}
        </>
      );
      result = `$2^{${n}}=${2 ** n} \\Longleftrightarrow \\log_2(${2 ** n})=${n}$.`;
      break;
    case "trigonometry":
    case "complex": {
      const a = (n * Math.PI) / 180,
        x = 200 + 90 * Math.cos(a),
        y = 125 - 90 * Math.sin(a);
      drawing = (
        <>
          <circle
            cx="200"
            cy="125"
            r="90"
            fill="var(--paper)"
            stroke="var(--art-rule)"
          />
          {line(80, 125, 320, 125, "var(--diagram-fill)")}
          {line(200, 15, 200, 235, "var(--diagram-fill)")}
          {line(200, 125, x, y)}
          {line(x, y, x, 125, "var(--pencil)")}
          {dot(x, y, 6)}
          {id === "complex" && dot(x, 250 - y, 4)}
          {text(335, 132, id === "complex" ? "Re" : "x")}
        </>
      );
      result =
        id === "complex"
          ? `$z=2(\\cos${n}^\\circ+i\\sin${n}^\\circ)$. $|z|^2=4$; conjugation reflects across the real axis.`
          : `$\\cos${n}^\\circ\\approx${fmt(Math.cos(a))}$, $\\sin${n}^\\circ\\approx${fmt(Math.sin(a))}$. Their squares sum to 1.`;
      break;
    }
    case "trig-geometry": {
      const a = (n * Math.PI) / 180,
        x = 160 + 4 * 30 * Math.cos(a),
        y = 210 - 4 * 30 * Math.sin(a);
      drawing = (
        <>
          {poly(`160,210 310,210 ${x},${y}`)}
          {text(235, 235, 5)}
          {text((160 + x) / 2 - 15, (210 + y) / 2, 4)}
          {text(170, 195, `${n}°`)}
        </>
      );
      result = `$c^2=41-40\\cos${n}^\\circ\\approx${fmt(41 - 40 * Math.cos(a))}$. Area $=10\\sin${n}^\\circ\\approx${fmt(10 * Math.sin(a))}$.`;
      break;
    }
    case "binomial":
      drawing = (
        <>
          {range(n + 1).map((i) =>
            range(i + 1).map((j) => (
              <g key={`${i}-${j}`}>
                <text
                  x={200 + (j - i / 2) * 36}
                  y={25 + i * 26}
                  textAnchor="middle"
                  fill={i === n ? "var(--accent)" : "var(--accent)"}
                  fontWeight={i === n ? 700 : 400}
                >
                  {choose(i, j)}
                </text>
              </g>
            )),
          )}
        </>
      );
      result = `Coefficients of $(a+b)^{${n}}$ sum to $(1+1)^{${n}}=${2 ** n}$.`;
      break;
  }
  return (
    <section className="visual">
      <div className="visual-heading">
        <span>Explore the idea</span>
        <button
          className="icon-button"
          aria-label="Reset exploration"
          onClick={() => {
            setN(min);
            setPlaying(false);
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <svg
        viewBox="0 0 400 260"
        role="img"
        aria-label={`${label}: ${n}. ${prompt}`}
      >
        <title>{prompt}</title>
        {drawing}
      </svg>
      <p className="visual-result" aria-live="polite">
        <M>{result}</M>
      </p>
      <div className="visual-controls">
        <button
          className="icon-button"
          disabled={reduced}
          aria-label={playing ? "Pause animation" : "Play animation"}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <label>
          {label}: <strong>{n}</strong>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={n}
            onChange={(e) => {
              setN(Number(e.target.value));
              setPlaying(false);
            }}
          />
        </label>
      </div>
      <p className="muted small">{prompt}</p>
    </section>
  );
}
