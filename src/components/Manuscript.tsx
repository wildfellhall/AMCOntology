import { useState } from "react";
import { useApp } from "../context";

type Study = "astronomy" | "botany" | "optics";
const circlePoint = (a: number, r: number) => [
  Math.sin(a) * r,
  -Math.cos(a) * r,
];

function Star({ x, y, size = 6 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${-size} Q1 -1 ${size} 0 Q1 1 0 ${size} Q-1 1 ${-size} 0 Q-1 -1 0 ${-size}Z`}
        fill="var(--gold-wash)"
        stroke="var(--gold)"
      />
      <circle r="1" fill="var(--gold)" />
    </g>
  );
}
function Leaf({
  x,
  y,
  angle = 0,
  size = 1,
}: {
  x: number;
  y: number;
  angle?: number;
  size?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}
      stroke="var(--botanical)"
      strokeWidth=".8"
    >
      <path
        d="M0 0C-15-6-20-21-12-37C-9-31 1-28 5-16C8-8 4-3 0 0Z"
        fill="var(--leaf-wash)"
      />
      <path
        d="M0 0Q-8-16-12-35M-4-10l-9-5m7 0 7-5m-9-1-6-5m4 0 4-6"
        fill="none"
      />
    </g>
  );
}
export function BotanicalSprig({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <g transform={mirrored ? "translate(460 0) scale(-1 1)" : undefined}>
      <path
        d="M179 247C104 249 73 202 94 162C119 117 89 90 62 99C30 110 45 154 64 142C77 134 66 117 59 124M100 220C63 228 28 210 34 183C41 154 63 161 60 176M96 164C125 150 138 113 126 87"
        stroke="var(--botanical)"
        fill="none"
        strokeWidth="1.2"
      />
      {[
        [137, 245, 65, 0.8],
        [113, 235, 30, 1],
        [91, 213, -10, 1],
        [87, 188, -35, 0.85],
        [96, 161, 65, 0.85],
        [101, 138, 40, 0.68],
        [91, 113, -20, 0.7],
        [62, 213, -50, 0.8],
        [39, 194, -50, 0.65],
        [122, 122, 30, 0.65],
        [127, 97, -10, 0.65],
      ].map(([x, y, angle, size], i) => (
        <Leaf key={i} x={x} y={y} angle={angle} size={size} />
      ))}
      <path
        d="M178 247c-16-14-21-31-10-35 15-6 23 16 8 17-7 0-9-8-5-10M124 85c-2-10-15-16-19-7-3 7 5 11 8 7"
        fill="none"
        stroke="var(--gold)"
      />
      <Star x={49} y={78} size={5} />
      <Star x={149} y={147} size={4} />
    </g>
  );
}
function Armillary() {
  return (
    <>
      <BotanicalSprig />
      <BotanicalSprig mirrored />
      <g
        transform="translate(230 117)"
        stroke="var(--engraving)"
        fill="none"
        strokeWidth=".9"
      >
        <circle r="88" />
        <circle r="83" />
        <circle r="77" stroke="var(--gold)" />
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * Math.PI) / 36;
          const [x1, y1] = circlePoint(a, i % 6 === 0 ? 79 : 83);
          const [x2, y2] = circlePoint(a, 88);
          return (
            <path
              key={i}
              d={`M${x1} ${y1}L${x2} ${y2}`}
              strokeWidth={i % 6 === 0 ? 1 : 0.5}
            />
          );
        })}
        <g transform="rotate(-27)">
          <ellipse rx="34" ry="82" />
          <ellipse rx="39" ry="82" stroke="var(--gold)" />
          <path d="M0-98V98" />
          <path d="M-4-94h8M-4 94h8" />
          <ellipse rx="82" ry="25" fill="var(--gold-wash)" fillOpacity=".2" />
          <ellipse rx="82" ry="20" />
          {Array.from({ length: 21 }, (_, i) => {
            const x = (i - 10) * 7;
            return (
              <path
                key={i}
                d={`M${x} ${Math.sqrt(1 - (x * x) / 6724) * 20}l1 5`}
                strokeWidth=".5"
              />
            );
          })}
        </g>
        <ellipse rx="75" ry="52" transform="rotate(33)" />
        <path d="M-87-13Q0-25 87-13M-87-9Q0-21 87-9" stroke="var(--gold)" />
        <circle r="20" fill="var(--paper)" />
        <ellipse rx="8" ry="20" />
        <path d="M-20 0h40M-17-10q17 6 34 0M-17 10q17-6 34 0" />
        <path
          d="M-9-16-3-10-7-3l7 5 4 10 7-5-2-10 5-9M-15 4l6 2 1 10"
          stroke="var(--botanical)"
        />
        <path
          d="M-4 89v15h8V89M-14 104h28l-3 7h-22ZM-8 111c5 13 5 15-6 23h28c-11-8-11-10-6-23M-17 134h34l8 7h-50Z"
          fill="var(--gold-wash)"
        />
        <path
          d="M-6 113v15M-3 114v12M0 114v12M3 114v12M6 113v15M-19 137h38"
          strokeWidth=".5"
        />
        <path d="M-63-63-83-84M62 63l16 18" strokeDasharray="2 3" />
      </g>
      <Star x={118} y={39} />
      <Star x={332} y={27} size={8} />
      <Star x={371} y={62} size={4} />
      <Star x={92} y={56} size={3} />
      <path
        d="M356 99a15 15 0 1 1-14-23 13 13 0 0 0 14 23Z"
        fill="var(--gold-wash)"
        stroke="var(--gold)"
      />
      <path
        d="M143 265q87-10 174 0M161 270q69-7 138 0"
        fill="none"
        stroke="var(--gold)"
        strokeWidth=".65"
      />
    </>
  );
}
function BotanicalGeometry() {
  return (
    <>
      <BotanicalSprig />
      <BotanicalSprig mirrored />
      <g transform="translate(230 109)" fill="none" strokeWidth=".85">
        <circle r="81" stroke="var(--gold)" />
        <circle r="87" stroke="var(--art-rule)" />
        <path
          d={Array.from({ length: 6 }, (_, i) => {
            const [x, y] = circlePoint((i * 2 * Math.PI) / 5, 81);
            return `${i ? "L" : "M"}${x} ${y}`;
          }).join(" ")}
          stroke="var(--gold)"
        />
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 72})`}>
            <path
              d="M0 0C-62-23-49-81-13-70C-7-87 20-88 29-72C60-58 35-18 0 0Z"
              fill="var(--petal-wash)"
              stroke="var(--pencil)"
            />
            {[-18, -9, 0, 9, 18].map((x, j) => (
              <path
                key={j}
                d={`M${x / 5} -10Q${x * 1.2} -34 ${x} ${-58 - Math.abs(x) / 2}`}
                stroke="var(--pencil)"
                opacity=".45"
              />
            ))}
            <path d="M0 0V-81" stroke="var(--gold)" strokeDasharray="2 4" />
          </g>
        ))}
        <circle r="15" fill="var(--gold-wash)" stroke="var(--gold)" />
        {Array.from({ length: 18 }, (_, i) => {
          const a = i * 2.4,
            r = 2.7 * Math.sqrt(i);
          return (
            <circle
              key={i}
              cx={Math.cos(a) * r}
              cy={Math.sin(a) * r}
              r=".8"
              fill="var(--gold)"
            />
          );
        })}
        <path
          d="M0 89c-16 27 6 48-2 70"
          stroke="var(--botanical)"
          strokeWidth="1.5"
        />
        <Leaf x={-3} y={131} angle={-45} size={1.2} />
        <Leaf x={-1} y={145} angle={83} size={1.1} />
        <path d="M0-25a25 25 0 0 1 23.78 17.27" stroke="var(--engraving)" />
        <text x="28" y="-28" className="plate-annotation">
          72°
        </text>
      </g>
      <text x="335" y="109" className="plate-annotation">
        360° / 5
      </text>
      <path d="M330 115q-11 4-17-9" stroke="var(--pencil)" fill="none" />
    </>
  );
}
function OpticsGeometry() {
  return (
    <>
      <BotanicalSprig />
      <BotanicalSprig mirrored />
      <g fill="none" stroke="var(--engraving)" strokeWidth=".9">
        <path d="M145 218H332M158 221h160M245 46V216" stroke="var(--gold)" />
        <path d="M242 46h6v172h-6Z" fill="var(--gold-wash)" />
        {Array.from({ length: 23 }, (_, i) => (
          <path
            key={i}
            d={`M245 ${50 + i * 7}l${i % 4 === 0 ? 9 : 5} 0`}
            strokeWidth=".5"
          />
        ))}
        <path
          d="M171 76 245 150 173 222"
          stroke="var(--pencil)"
          strokeWidth="1.2"
        />
        <path
          d="M245 150V240"
          strokeDasharray="3 4"
          transform="rotate(90 245 150)"
        />
        <path
          d="M218 150a27 27 0 0 1 8-19M226 171a28 28 0 0 1-9-21"
          stroke="var(--gold)"
        />
        <path d="M171 76H245M245 150 171 76v74Z" strokeDasharray="2 4" />
        <path d="M171 137h13v13" stroke="var(--art-rule)" />
        <circle cx="160" cy="65" r="13" fill="var(--paper)" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <path
              key={i}
              d={`M${160 + 17 * Math.cos(a)} ${65 + 17 * Math.sin(a)}l${5 * Math.cos(a)} ${5 * Math.sin(a)}`}
              stroke="var(--gold)"
            />
          );
        })}
        <path
          d="M153 61q7-5 14 0m-14 8q7 5 14 0M152 65h16"
          stroke="var(--gold)"
        />
        <path d="M159 226q14-18 28 0-14 17-28 0Z" />
        <circle cx="173" cy="226" r="5" />
        <circle cx="173" cy="226" r="2" fill="var(--engraving)" />
        <path
          d="M232 218q-7 12-18 16h61q-14-7-18-16M209 234h71v5h-71Z"
          fill="var(--gold-wash)"
        />
      </g>
      <text x="151" y="169" className="plate-annotation">
        equal angles
      </text>
      <Star x={337} y={43} />
      <Star x={124} y={34} size={5} />
    </>
  );
}
export function NaturalPlate({
  kind = "astronomy",
  className = "",
}: {
  kind?: Study;
  className?: string;
}) {
  return (
    <svg
      className={`natural-plate ${className}`}
      viewBox="0 0 460 280"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "astronomy" ? (
        <Armillary />
      ) : kind === "botany" ? (
        <BotanicalGeometry />
      ) : (
        <OpticsGeometry />
      )}
    </svg>
  );
}
const studies = {
  astronomy: {
    label: "Astronomy",
    caption: "Celestial circles & angular measure",
    lesson: "circles",
  },
  botany: {
    label: "Botany",
    caption: "Fivefold symmetry · 360° ÷ 5 = 72°",
    lesson: "polygons",
  },
  optics: {
    label: "Optics",
    caption: "Reflection & equal angles",
    lesson: "angles",
  },
};
export function NaturalStudy() {
  const [kind, setKind] = useState<Study>("astronomy");
  const { go } = useApp();
  return (
    <figure className="natural-study">
      <NaturalPlate kind={kind} />
      <div className="natural-study-choices" aria-label="Illustrated studies">
        {(Object.keys(studies) as Study[]).map((k) => (
          <button
            key={k}
            aria-label={studies[k].label}
            aria-pressed={kind === k}
            onClick={() => setKind(k)}
          >
            {studies[k].label}
          </button>
        ))}
      </div>
      <figcaption aria-live="polite">
        <button onClick={() => go(`lesson/${studies[kind].lesson}`)}>
          {studies[kind].caption}
          <span aria-hidden="true"> ↗</span>
        </button>
      </figcaption>
    </figure>
  );
}
export function Fleuron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`fleuron ${className}`}
      viewBox="0 0 360 34"
      fill="none"
      stroke="currentColor"
      strokeWidth=".85"
      aria-hidden="true"
    >
      <path d="M0 17h122m116 0h122M21 21h95m128 0h95M180 28V6m0 15c-26-30-39-10-24-7 8 1 12-6 6-9m18 16c26-30 39-10 24-7-8 1-12-6-6-9M170 23c-16-15-30-6-39-5-10 0-12-8-6-9m65 14c16-15 30-6 39-5 10 0 12-8 6-9" />
      <path d="m180 2 5 7-5 6-5-6Z" fill="var(--gold-wash)" />
      <circle cx="180" cy="26" r="2" fill="currentColor" />
      <path d="M145 24q35 8 70 0M133 19l-4 5-4-5m102 0 4 5 4-5" />
    </svg>
  );
}
export function FolioCorners() {
  return (
    <div className="folio-corners" aria-hidden="true">
      {[0, 1, 2, 3].map((n) => (
        <svg
          key={n}
          viewBox="0 0 80 80"
          fill="none"
          stroke="var(--gold)"
          strokeWidth=".8"
        >
          <path d="M3 72V3h69M8 56V8h48M13 40V13h27M4 62c19 0 22-12 15-17-9-7-17 6-10 10m53-51c0 19-12 22-17 15-7-9 6-17 10-10M14 14c24 6 26 19 14 24-9 3-15-4-10-10 5-5 14 1 7 5" />
          <path
            d="M20 20c3-9 13-10 22-4-11 0-12 7-22 4Zm0 0c-9 3-10 13-4 22 0-11 7-12 4-22Z"
            fill="var(--leaf-wash)"
            stroke="var(--botanical)"
          />
          <path
            d="m11 65 3 4-3 4-3-4Zm54-54 4 3 4-3-4-3Z"
            fill="var(--gold-wash)"
          />
        </svg>
      ))}
    </div>
  );
}
export function IlluminatedInitial({ letter }: { letter: string }) {
  return (
    <span className="illuminated-initial" aria-hidden="true">
      <svg viewBox="0 0 88 96" fill="none">
        <path d="M8 5h72v86H8Z" fill="var(--gold-wash)" stroke="var(--gold)" />
        <path d="M12 9h64v78H12Z" stroke="var(--gold)" strokeWidth=".6" />
        <path
          d="M18 80c38-6 52-40 43-58-6-13-23-9-22 1 1 9 14 10 13 2M18 65c23-7 44-36 43-47M20 21c-15 27-10 56 7 66"
          stroke="var(--botanical)"
        />
        <g stroke="var(--botanical)" fill="var(--leaf-wash)">
          <path d="M24 76c-14-15-1-22 0 0m10-8c-1-21 13-15 0 0m10-9c4-18 17-11 0 0m8-9c8-18 19-7 0 0M22 35c16-8 13-16 0 0" />
        </g>
        <path d="m17 13 4 4-4 4-4-4Zm50 62 4 4-4 4-4-4Z" fill="var(--pencil)" />
      </svg>
      <span>{letter}</span>
    </span>
  );
}
