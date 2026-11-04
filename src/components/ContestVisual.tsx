import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { M } from "./Math";
export const contestVisualIds = new Set([
  "algebra-transformations",
  "polynomial-structure",
]);
export function ContestVisual({ id }: { id: string }) {
  const algebra = id === "algebra-transformations";
  const min = algebra ? 3 : 2,
    max = algebra ? 7 : 10,
    initial = algebra ? 3 : 4;
  const [n, setN] = useState(initial),
    [playing, setPlaying] = useState(false);
  const reduced =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setInterval(
      () => setN((value) => (value === max ? min : value + 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [playing, reduced, max, min]);
  const t = (n + Math.sqrt(n * n - 4)) / 2;
  const a = (2 ** n - (-1) ** n) / 3,
    b = (2 ** n + 2 * (-1) ** n) / 3;
  const y0 = 195 - 150 / (2 ** n + 1),
    yLeft = 195 - (150 * ((-1) ** n + 1)) / (2 ** n + 1);
  const heading = algebra
    ? "Symmetry without solving"
    : "A high power, a linear remainder";
  return (
    <div className="visual contest-visual">
      <div className="visual-heading">{heading}</div>
      <svg
        viewBox="0 0 420 245"
        role="img"
        aria-label={
          algebra
            ? `Two reciprocal roots have sum ${n}, sum of squares ${n * n - 2}, and sum of cubes ${n ** 3 - 3 * n}.`
            : `The remainder of x to power ${n} on division by x squared minus x minus 2 is ${a}x plus ${b}. It agrees with the power at -1 and 2.`
        }
      >
        {algebra ? (
          <>
            <path className="figure-axis" d="M35 118h350" fill="none" />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i}>
                <path d={`M${35 + i * 43} 113v10`} stroke="var(--art-rule)" />
                <text x={35 + i * 43} y="143" textAnchor="middle">
                  {i}
                </text>
              </g>
            ))}
            <circle cx={35 + 43 * t} cy="118" r="6" fill="var(--accent)" />
            <circle cx={35 + 43 / t} cy="118" r="6" fill="var(--pencil)" />
            <text x={35 + 43 * t} y="90" textAnchor="middle">
              t ≈ {t.toFixed(2)}
            </text>
            <text x="71" y="65" textAnchor="middle">
              1/t ≈ {(1 / t).toFixed(2)}
            </text>
            <path
              d={`M${35 + 43 / t} 108 71 75`}
              stroke="var(--pencil)"
              fill="none"
            />
            <path
              d={`M${35 + 43 / t} 158v10H${35 + 43 * t}v-10`}
              stroke="var(--gold)"
              fill="none"
            />
            <text x="210" y="204" textAnchor="middle">
              t + 1/t = {n}; t · (1/t) = 1
            </text>
          </>
        ) : (
          <>
            <path
              className="figure-axis"
              d={`M44 ${y0}h330M158.333 210V30`}
              fill="none"
            />
            <path
              d={`M75 ${yLeft} 325 45`}
              stroke="var(--accent)"
              fill="none"
              strokeWidth="1.6"
            />
            <circle cx="75" cy={yLeft} r="5" fill="var(--pencil)" />
            <circle cx="325" cy="45" r="5" fill="var(--pencil)" />
            <path
              d={`M75 ${yLeft}V${y0}M325 45V${y0}`}
              stroke="var(--art-rule)"
              strokeDasharray="3 4"
            />
            <text x="75" y="222" textAnchor="middle">
              −1
            </text>
            <text x="325" y="222" textAnchor="middle">
              2
            </text>
            <text x="84" y={yLeft - 12}>
              R(−1) = {(-1) ** n}
            </text>
            <text x="239" y="34">
              R(2) = {2 ** n}
            </text>
            <text x="165" y="60">
              R(x) = {a}x + {b}
            </text>
            <text x="210" y="241" textAnchor="middle">
              Two values determine an affine remainder.
            </text>
          </>
        )}
      </svg>
      <p className="visual-result" aria-live="polite">
        <M>
          {algebra
            ? String.raw`$t^2+t^{-2}=${n * n - 2},\quad t^3+t^{-3}=${n ** 3 - 3 * n}$`
            : String.raw`$x^{${n}}\equiv ${a}x+${b}\pmod{x^2-x-2}$`}
        </M>
      </p>
      <p className="small">
        {algebra
          ? "Predict the cubic sum before moving the slider. The two roots change, but their product remains one."
          : "Predict the next two coefficients. Multiplication by x sends (A, B) to (A + B, 2A). The drawing rescales as the values grow."}
      </p>
      <div className="visual-controls">
        <label>
          {algebra ? "Sum of the reciprocal pair" : "Exponent"}
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={n}
            onChange={(event) => {
              setPlaying(false);
              setN(Number(event.target.value));
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
