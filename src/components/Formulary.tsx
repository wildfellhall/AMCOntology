import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import plates from "../content/formulary.json";
import textbook from "../content/textbook-examples.json";
import sections from "../content/crash-sections.json";
import crashFormulas from "../content/crash-formulas.json";
import { formulas, lessonById } from "../data";
import { useApp } from "../context";
import { M } from "./Math";
import { Fleuron, FolioCorners, NaturalPlate } from "./Manuscript";
import { FormulaDiagram } from "./FormulaDiagram";
import "../formulary.css";
type Plate = (typeof plates)[number];
type Example = (typeof textbook.examples)[number];
const subjects = [
  "Counting & probability",
  "Algebra",
  "Number theory",
  "Geometry",
  "Advanced topics",
];
const roman = ["I", "II", "III", "IV", "V"];
function topic(id: string) {
  const d = lessonById[id]?.domain;
  return d === "Counting" || d === "Probability"
    ? subjects[0]
    : d === "AMC 12 extensions"
      ? subjects[4]
      : d === "Foundations"
        ? "Algebra"
        : (d ?? "Algebra");
}
function safeLesson(id: string) {
  return id === "starsbars"
    ? "stars-bars"
    : id === "paths"
      ? "geometric-counting"
      : id;
}
function LiveExploration({ scene }: { scene: string }) {
  const [value, setValue] = useState(
    scene === "probability" ? 15 : scene === "series" ? 5 : 3,
  );
  if (!["probability", "series", "amgm"].includes(scene)) return null;
  const probability = scene === "probability",
    series = scene === "series";
  const title = probability
    ? "Change the waiting time"
    : series
      ? "Change a convergent ratio"
      : "Move away from equality";
  const max = probability ? 60 : 9;
  const formula = probability
    ? `P=1-\\left(\\frac{60-${value}}{60}\\right)^2\\approx${(1 - Math.pow((60 - value) / 60, 2)).toFixed(4)}`
    : series
      ? `S=1+${value / 10}+(${value / 10})^2+\\cdots=\\frac1{1-${value / 10}}\\approx${(1 / (1 - value / 10)).toFixed(4)}`
      : `${value}\\cdot${10 - value}\\cdot5=${value * (10 - value) * 5}\\le125`;
  return (
    <details className="live-exploration">
      <summary>{title}</summary>
      <div className="live-exploration-body">
        <label>
          {probability
            ? "Waiting time in minutes"
            : series
              ? "Common ratio (tenths)"
              : "First factor"}
          <input
            aria-label={
              probability
                ? "Waiting time in minutes"
                : series
                  ? "Common ratio in tenths"
                  : "First factor"
            }
            type="range"
            min={probability ? 0 : 1}
            max={max}
            value={value}
            onChange={(e) => setValue(+e.target.value)}
          />
        </label>
        <svg
          viewBox="0 0 300 130"
          role="img"
          aria-label={
            probability
              ? `The meeting band for a wait of ${value} minutes`
              : series
                ? `Terms of a geometric series with ratio ${value / 10}`
                : `Three factors ${value}, ${10 - value}, and 5 with sum fifteen`
          }
        >
          {probability ? (
            <>
              <rect
                x="100"
                y="10"
                width="110"
                height="110"
                fill="var(--leaf-wash)"
                stroke="var(--accent)"
              />
              <path
                d={`M100 10H${210 - (value * 110) / 60}L100 ${120 - (value * 110) / 60}ZM${100 + (value * 110) / 60} 120H210V${10 + (value * 110) / 60}Z`}
                fill="var(--paper)"
                stroke="var(--gold)"
              />
            </>
          ) : series ? (
            Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x={20 + i * 34}
                y={115 - 100 * Math.pow(value / 10, i)}
                width="24"
                height={100 * Math.pow(value / 10, i)}
                fill="var(--gold-wash)"
                stroke="var(--gold)"
              />
            ))
          ) : (
            [value, 10 - value, 5].map((v, i) => (
              <rect
                key={i}
                x={65 + i * 65}
                y={115 - v * 10}
                width="42"
                height={v * 10}
                fill="var(--diagram-fill)"
                stroke="var(--accent)"
              />
            ))
          )}
        </svg>
        <output aria-live="polite">
          <M>{`$${formula}$`}</M>
        </output>
        <p>
          {probability
            ? "The arrival square stays fixed; the two excluded triangles shrink as the waiting time grows."
            : series
              ? "The displayed bars show the first eight terms; the formula gives the entire infinite sum, starting at one."
              : "The second factor is 10 minus the first; the third stays five. Their sum remains fifteen."}
        </p>
      </div>
    </details>
  );
}
function Study({
  plate,
  onExample,
  initialMode,
}: {
  plate: Plate;
  onExample: (id: string) => void;
  initialMode: "derivation" | "worked";
}) {
  const { go } = useApp();
  const [mode, setMode] = useState<"derivation" | "worked">(initialMode),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setReduced(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    mq.addEventListener("change", change);
    return () => mq.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(
      () => setStep((s) => Math.min(3, s + 1)),
      6500,
    );
    return () => clearInterval(timer);
  }, [playing, reduced]);
  useEffect(() => {
    if (step === 3) setPlaying(false);
  }, [step]);
  const current = plate[mode][step];
  const changeMode = (next: typeof mode) => {
    setMode(next);
    setStep(0);
    setPlaying(false);
  };
  return (
    <article className="formula-folio" aria-label={plate.title}>
      <FolioCorners />
      <header className="formula-folio-heading">
        <div>
          <p className="folio-source">
            {plate.domain} · Crash Course §{plate.section}, p.{" "}
            {plate.source.page}
          </p>
          <h2>{plate.title}</h2>
        </div>
        <span className="formula-track">
          AMC {plate.track === 12 ? "12" : "10 / 12"}
        </span>
      </header>
      <div className="formula-inscription">
        <M>{`$${plate.formula}$`}</M>
      </div>
      <p className="formula-condition">{plate.condition}</p>
      <div
        className="formula-mode"
        role="tablist"
        aria-label="Study view"
        onKeyDown={(e) => {
          if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            const next =
              e.key === "Home"
                ? "derivation"
                : e.key === "End"
                  ? "worked"
                  : mode === "derivation"
                    ? "worked"
                    : "derivation";
            changeMode(next);
            document
              .getElementById(
                next === "derivation" ? "derivation-tab" : "worked-tab",
              )
              ?.focus();
          }
        }}
      >
        <button
          id="derivation-tab"
          tabIndex={mode === "derivation" ? 0 : -1}
          role="tab"
          aria-selected={mode === "derivation"}
          aria-controls="formula-study-panel"
          onClick={() => changeMode("derivation")}
        >
          Derivation
        </button>
        <button
          id="worked-tab"
          tabIndex={mode === "worked" ? 0 : -1}
          role="tab"
          aria-selected={mode === "worked"}
          aria-controls="formula-study-panel"
          onClick={() => changeMode("worked")}
        >
          Textbook example <span>{plate.example}</span>
        </button>
      </div>
      <div
        id="formula-study-panel"
        role="tabpanel"
        aria-labelledby={
          mode === "derivation" ? "derivation-tab" : "worked-tab"
        }
      >
        {mode === "worked" && (
          <div className="formula-problem">
            <p className="folio-source">
              {plate.exampleSource.attribution} · Mastering AMC 10/12, p.{" "}
              {plate.exampleSource.page}
              {plate.exampleSource.level === "Enrichment"
                ? " · Enrichment"
                : ""}
            </p>
            <p>
              <M>{plate.prompt}</M>
            </p>
            <button
              className="text-button"
              onClick={() => onExample(plate.exampleSource.id)}
            >
              Read the source example <ArrowRight size={15} />
            </button>
          </div>
        )}
        <div className="formula-demonstration">
          <figure>
            <FormulaDiagram
              scene={plate.scene}
              step={step}
              worked={mode === "worked"}
              description={current.diagram}
            />
            <figcaption>{current.diagram}</figcaption>
          </figure>
          <div
            className="formula-explanation"
            aria-live={playing ? "off" : "polite"}
            aria-atomic="true"
          >
            <span className="formula-step-number">
              {String(step + 1).padStart(2, "0")} / 04
            </span>
            <h3>{current.title}</h3>
            <div className="formula-step-math">
              <M>{`$${current.math}$`}</M>
            </div>
            <p>{current.text}</p>
          </div>
        </div>
        <div className="formula-playback">
          <div className="playback-buttons">
            <button
              className="formula-icon-button"
              aria-label="Previous step"
              disabled={step === 0}
              onClick={() => {
                setStep((s) => s - 1);
                setPlaying(false);
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="formula-play-button"
              disabled={reduced}
              onClick={() => {
                if (step === 3) setStep(0);
                setPlaying((p) => !p);
              }}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
              {playing ? "Pause" : "Play steps"}
            </button>
            <button
              className="formula-icon-button"
              aria-label="Next step"
              disabled={step === 3}
              onClick={() => {
                setStep((s) => s + 1);
                setPlaying(false);
              }}
            >
              <ArrowRight size={18} />
            </button>
            <button
              className="formula-icon-button"
              aria-label="Restart steps"
              onClick={() => {
                setStep(0);
                setPlaying(false);
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <label className="formula-scrubber">
            <span>Step {step + 1} of 4</span>
            <input
              aria-label="Derivation or example step"
              type="range"
              min="0"
              max="3"
              value={step}
              onChange={(e) => {
                setStep(+e.target.value);
                setPlaying(false);
              }}
            />
          </label>
        </div>
        {reduced && (
          <p className="formula-motion-note">
            Reduced motion is on. Use the arrows or slider to move between
            steps.
          </p>
        )}
        <ol className="formula-step-index">
          {plate[mode].map((s, i) => (
            <li key={s.title}>
              <button
                aria-current={step === i ? "step" : undefined}
                onClick={() => {
                  setStep(i);
                  setPlaying(false);
                }}
              >
                <span>{i + 1}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="formula-marginalia">
        <div>
          <h3>Keep in mind</h3>
          <p>{plate.trap}</p>
        </div>
        <div>
          <h3>Explain the step</h3>
          <p>
            <M>{plate.check}</M>
          </p>
          <button
            className="text-button"
            aria-expanded={revealed}
            onClick={() => setRevealed((r) => !r)}
          >
            {revealed ? "Hide explanation" : "Show explanation"}
          </button>
          {revealed && (
            <p className="formula-check-answer">
              <M>{plate.answer}</M>
            </p>
          )}
        </div>
      </div>
      <LiveExploration scene={plate.scene} />
      <footer className="formula-folio-footer">
        <button
          className="text-button"
          onClick={() => go(`lesson/${safeLesson(plate.lesson)}`)}
        >
          <BookOpen size={16} /> Read the related lesson
        </button>
        <button className="text-button" onClick={() => go("practice/formula")}>
          Practice formula recognition <ArrowRight size={16} />
        </button>
      </footer>
    </article>
  );
}
function SourceExample({
  example,
  onStudy,
}: {
  example: Example;
  onStudy: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(false),
    [open, setOpen] = useState(false);
  const study = plates.find((p) => p.exampleSource.id === example.id);
  const sourceImage = (
    asset: Pick<
      Example["statement"][number],
      "src" | "width" | "height" | "page"
    >,
    i: number,
    solution = false,
  ) => (
    <img
      key={asset.src}
      src={asset.src}
      width={asset.width}
      height={asset.height}
      loading="lazy"
      alt={`${solution ? "Written solution" : "Statement and original figures"} for ${example.attribution}, page ${asset.page}${i ? ", continued" : ""}. Source facsimile.`}
    />
  );
  return (
    <article className="source-example">
      <FolioCorners />
      <header>
        <div>
          <p className="folio-source">
            Mastering AMC 10/12 · {example.chapterTitle}
          </p>
          <h2>{example.attribution}</h2>
          <p className="folio-source">
            {example.lastPage === example.page
              ? `Page ${example.page}`
              : `Pages ${example.page}–${example.lastPage}`}{" "}
            · {example.level}
          </p>
        </div>
        <button
          className="formula-icon-button source-zoom"
          aria-label={
            zoom ? "Reduce example enlargement" : "Enlarge example for reading"
          }
          aria-pressed={zoom}
          onClick={() => setZoom((z) => !z)}
        >
          {zoom ? <ZoomOut size={19} /> : <ZoomIn size={19} />}
        </button>
      </header>
      <div
        className={`source-facsimile ${zoom ? "enlarged" : ""}`}
        tabIndex={0}
        role="region"
        aria-label="Textbook statement; scroll horizontally when enlarged"
      >
        {(example.correction?.statement ?? example.statement).map((a, i) =>
          sourceImage(a, i),
        )}
      </div>
      {example.correction && (
        <>
          <figure className="source-corrected-figure">
            <div
              className={`source-figure-scroll ${zoom ? "enlarged" : ""}`}
              tabIndex={0}
              role="region"
              aria-label="Corrected diagram; scroll horizontally when enlarged"
            >
              <img
                src={example.correction.figure.src}
                width={example.correction.figure.width}
                height={example.correction.figure.height}
                style={{
                  maxWidth: zoom
                    ? "none"
                    : Math.min(640, example.correction.figure.width * 1.8),
                  width: zoom
                    ? Math.max(640, example.correction.figure.width * 2.4)
                    : "100%",
                }}
                alt={example.correction.description}
              />
            </div>
            <figcaption>
              {example.correction.kind === "reassociated"
                ? `Matching source figure · page ${example.correction.figure.page}`
                : "Diagram constructed from the problem statement"}
            </figcaption>
          </figure>
          <details className="source-correction">
            <summary>Diagram correction · view the source note</summary>
            <p>{example.correction.note}</p>
            <details>
              <summary>View the original, uncorrected excerpt</summary>
              <div
                className={`source-facsimile ${zoom ? "enlarged" : ""}`}
                tabIndex={0}
                role="region"
                aria-label="Original excerpt with the misplaced figure"
              >
                {example.statement.map((a, i) => sourceImage(a, i))}
              </div>
            </details>
          </details>
        </>
      )}
      <div className="source-actions">
        {example.solution.length > 0 && (
          <button
            className="button secondary"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide written solution" : "Reveal written solution"}
          </button>
        )}
        {study && (
          <button
            className="button secondary"
            onClick={() => onStudy(study.id)}
          >
            Explore the worked example <ArrowRight size={16} />
          </button>
        )}
        {example.videos.map((url, i) => (
          <a
            className="text-button"
            href={url}
            target="_blank"
            rel="noreferrer"
            key={url}
          >
            Video solution{example.videos.length > 1 ? ` ${i + 1}` : ""}{" "}
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
      {open && (
        <section className="source-written-solution">
          <h3>Textbook solution</h3>
          <div
            className={`source-facsimile ${zoom ? "enlarged" : ""}`}
            tabIndex={0}
            role="region"
            aria-label="Written textbook solution; scroll horizontally when enlarged"
          >
            {example.solution.map((a, i) => sourceImage(a, i, true))}
          </div>
        </section>
      )}
      {!example.solution.length && !example.videos.length && !study && (
        <p className="formula-motion-note">
          This example has no written or linked video solution in the supplied
          edition.
        </p>
      )}
      <footer>
        <p>
          Source notation and figures from Omega Learn; diagram corrections are
          marked above. Scroll sideways for long lines on small screens. Use the
          enlargement control for small print.
        </p>
        <a href={textbook.sourceUrl} target="_blank" rel="noreferrer">
          Source book <ExternalLink size={13} />
        </a>
      </footer>
    </article>
  );
}
export default function Formulary({ initialId }: { initialId?: string }) {
  const { state, go } = useApp();
  const [tab, setTab] = useState(
      initialId === "examples"
        ? "examples"
        : initialId === "sheet"
          ? "sheet"
          : "studies",
    ),
    [subject, setSubject] = useState("All subjects"),
    [query, setQuery] = useState(""),
    [level, setLevel] = useState("All source levels"),
    [chapter, setChapter] = useState("All chapters"),
    [collection, setCollection] = useState("crash");
  const [studyMode, setStudyMode] = useState<"derivation" | "worked">(
    "derivation",
  );
  const [selected, setSelected] = useState(
      plates.some((p) => p.id === initialId) ? initialId! : plates[0].id,
    ),
    [exampleId, setExampleId] = useState(textbook.examples[0].id);
  const allTracks = state.settings.track === 12;
  const allowedPlates = plates.filter((p) => allTracks || p.track === 10);
  const normalized = query.trim().toLowerCase();
  const filterSubject = (domain: string) =>
    subject === "All subjects" || subject === domain;
  const matchingPlates = allowedPlates.filter(
    (p) =>
      filterSubject(p.domain) &&
      `${p.title} ${p.formula} ${p.prompt}`.toLowerCase().includes(normalized),
  );
  const plate =
    matchingPlates.find((p) => p.id === selected) ?? matchingPlates[0];
  const quickFormulas = useMemo(() => {
    const source =
      collection === "crash"
        ? crashFormulas.map((f) => ({ ...f, lessonId: "" }))
        : formulas.map((f, i) => ({
            ...f,
            id: `course-${i}`,
            section: "",
            page: 0,
            domain: topic(f.lessonId),
            track: lessonById[f.lessonId].track,
          }));
    return source.filter(
      (f) =>
        (allTracks || f.track === 10) &&
        filterSubject(f.domain) &&
        `${f.name} ${f.tex} ${f.use} ${f.condition}`
          .toLowerCase()
          .includes(normalized),
    );
  }, [allTracks, subject, normalized, collection]);
  const matchingExamples = textbook.examples.filter(
    (e) =>
      (allTracks || !e.amc12) &&
      filterSubject(e.domain) &&
      (chapter === "All chapters" || e.chapter === +chapter) &&
      (level === "All source levels" || e.level === level) &&
      `${e.number} ${e.chapterTitle} ${e.searchText} ${e.attribution}`
        .toLowerCase()
        .includes(normalized),
  );
  const example =
    matchingExamples.find((e) => e.id === exampleId) ?? matchingExamples[0];
  const studyIndex = plate ? matchingPlates.indexOf(plate) : -1,
    exampleIndex = example ? matchingExamples.indexOf(example) : -1;
  function openExample(id: string) {
    setTab("examples");
    setSubject("All subjects");
    setChapter("All chapters");
    setLevel("All source levels");
    setQuery("");
    setExampleId(id);
    document
      .querySelector(".formulary-tabs")
      ?.scrollIntoView({ block: "start" });
  }
  function openStudy(id: string, mode: "derivation" | "worked" = "derivation") {
    setStudyMode(mode);
    setTab("studies");
    setSubject("All subjects");
    setQuery("");
    setSelected(id);
    document
      .querySelector(".formulary-tabs")
      ?.scrollIntoView({ block: "start" });
  }
  const changeTab = (value: string) => {
    setTab(value);
    setQuery("");
    setSubject("All subjects");
  };
  const total =
    tab === "studies"
      ? matchingPlates.length
      : tab === "examples"
        ? matchingExamples.length
        : quickFormulas.length;
  return (
    <div className="formulary-page">
      <header className="formulary-heading">
        <div>
          <p className="eyebrow">The mathematical formulary</p>
          <h1>Formula book</h1>
          <p>
            Derivations, worked examples, and a reference sheet drawn from the
            Omega Learn textbooks.
          </p>
          <div className="formulary-tally">
            <span>18 animated studies</span>
            <span>112 crash course formulas</span>
            <span>232 source examples</span>
          </div>
        </div>
        <NaturalPlate kind="astronomy" />
      </header>
      <Fleuron />
      <nav className="formulary-tabs" aria-label="Formula book sections">
        {[
          ["studies", "Animated studies"],
          ["sheet", "Formula sheet"],
          ["examples", "Textbook examples"],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-current={tab === value ? "page" : undefined}
            onClick={() => changeTab(value)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="formulary-toolbar">
        <label className="formulary-search">
          <span>
            Search{" "}
            {tab === "studies"
              ? "studies"
              : tab === "examples"
                ? "examples"
                : "formulas"}
          </span>
          <div>
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "examples"
                  ? "Topic, words, or example number"
                  : "A relation, idea, or use"
              }
            />
          </div>
        </label>
        <label>
          <span>Subject</span>
          <select
            aria-label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option>All subjects</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        {tab === "sheet" && (
          <label>
            <span>Reference collection</span>
            <select
              aria-label="Reference collection"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >
              <option value="crash">Crash Course · 112 formulas</option>
              <option value="course">Course index · 122 formulas</option>
            </select>
          </label>
        )}
        {tab === "examples" && (
          <>
            <label>
              <span>Chapter</span>
              <select
                aria-label="Chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
              >
                <option>All chapters</option>
                {textbook.chapters.map((c) => (
                  <option key={c.number} value={c.number}>
                    {c.number}. {c.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Source level</span>
              <select
                aria-label="Source level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {[
                  "All source levels",
                  "Textbook",
                  "AMC 10",
                  "AMC 12",
                  "Enrichment",
                ].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>
      <p className="formulary-result-count" aria-live="polite">
        {total}{" "}
        {tab === "studies"
          ? total === 1
            ? "study"
            : "studies"
          : tab === "examples"
            ? total === 1
              ? "example"
              : "examples"
            : total === 1
              ? "formula"
              : "formulas"}{" "}
        shown · AMC {allTracks ? "10 / 12" : "10"}
        {tab === "examples" ? " · Enrichment is labeled separately" : ""}
      </p>
      {total === 0 ? (
        <div className="formulary-empty">
          <h2>No matches</h2>
          <p>
            Try a broader search or another subject. AMC 12 material is
            available through the exam-track selector.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setSubject("All subjects");
              setChapter("All chapters");
              setLevel("All source levels");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : tab === "studies" && plate ? (
        <>
          <div className="formula-selector">
            <label>
              <span>Choose a study</span>
              <select
                aria-label="Choose a study"
                value={plate.id}
                onChange={(e) => setSelected(e.target.value)}
              >
                {subjects.map((s) => (
                  <optgroup key={s} label={s}>
                    {matchingPlates
                      .filter((p) => p.domain === s)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <div>
              <button
                className="formula-icon-button"
                aria-label="Previous study"
                disabled={studyIndex === 0}
                onClick={() => setSelected(matchingPlates[studyIndex - 1].id)}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                className="formula-icon-button"
                aria-label="Next study"
                disabled={studyIndex === matchingPlates.length - 1}
                onClick={() => setSelected(matchingPlates[studyIndex + 1].id)}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <Study
            key={`${plate.id}-${studyMode}`}
            plate={plate}
            initialMode={studyMode}
            onExample={openExample}
          />
          <details className="formulary-browse">
            <summary>Browse all {matchingPlates.length} studies</summary>
            <div className="formula-study-grid">
              {matchingPlates.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelected(p.id);
                    document
                      .querySelector(".formula-selector")
                      ?.scrollIntoView({ block: "start" });
                  }}
                >
                  <span className="folio-source">{p.domain}</span>
                  <strong>{p.title}</strong>
                  <M>{`$${p.formula}$`}</M>
                </button>
              ))}
            </div>
          </details>
        </>
      ) : tab === "sheet" ? (
        <div className="formula-reference">
          {[...subjects, "Strategy"].map((s, i) => {
            const group = quickFormulas.filter((f) => f.domain === s);
            return (
              group.length > 0 && (
                <section key={s}>
                  <header>
                    <span>{roman[i] ?? "VI"}</span>
                    <h2>{s}</h2>
                    <small>{group.length} relations</small>
                  </header>
                  <div className="formula-reference-grid">
                    {group.map((f) => (
                      <article key={f.id}>
                        <h3>{f.name}</h3>
                        <div className="reference-equation">
                          <M>{`$${f.tex}$`}</M>
                        </div>
                        <p>
                          {f.use.charAt(0).toUpperCase() + f.use.slice(1)}
                          {f.use.endsWith(".") ? "" : "."}
                        </p>
                        <p className="reference-condition">{f.condition}</p>
                        {f.section ? (
                          <>
                            <p className="reference-source">
                              Crash Course §{f.section} · p. {f.page}
                            </p>
                            {allowedPlates.find(
                              (p) => p.section === f.section,
                            ) && (
                              <button
                                className="text-button"
                                onClick={() =>
                                  openStudy(
                                    allowedPlates.find(
                                      (p) => p.section === f.section,
                                    )!.id,
                                  )
                                }
                              >
                                Related animated study <ArrowRight size={14} />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            className="text-button"
                            onClick={() => go(`lesson/${f.lessonId}`)}
                          >
                            Read the lesson <ArrowRight size={14} />
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )
            );
          })}
          <details className="crash-index">
            <summary>
              Crash Course source index · {sections.length} sections
            </summary>
            <p>
              Page references use the supplied 118-page edition. The Crash
              Course collection groups 112 formula entries; the separate course
              index contains 122 relations. Repeated formulas are consolidated,
              and strategy-only sections appear in this source index.
            </p>
            <ol>
              {sections.map((s) => (
                <li key={s.section}>
                  <span>§{s.section}</span>
                  <span>{s.title}</span>
                  <span>p. {s.page}</span>
                </li>
              ))}
            </ol>
          </details>
        </div>
      ) : example ? (
        <>
          <div className="formula-selector">
            <label>
              <span>Choose a textbook example</span>
              <select
                aria-label="Choose a textbook example"
                value={example.id}
                onChange={(e) => setExampleId(e.target.value)}
              >
                {matchingExamples.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.number} · {e.chapterTitle} · p. {e.page}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <button
                className="formula-icon-button"
                aria-label="Previous textbook example"
                disabled={exampleIndex === 0}
                onClick={() =>
                  setExampleId(matchingExamples[exampleIndex - 1].id)
                }
              >
                <ArrowLeft size={18} />
              </button>
              <button
                className="formula-icon-button"
                aria-label="Next textbook example"
                disabled={exampleIndex === matchingExamples.length - 1}
                onClick={() =>
                  setExampleId(matchingExamples[exampleIndex + 1].id)
                }
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <SourceExample
            key={example.id}
            example={example}
            onStudy={(id) => openStudy(id, "worked")}
          />
        </>
      ) : null}
      <footer className="formulary-colophon">
        <Fleuron />
        <p>
          Formula references: <em>Omega Learn AMC 10/12 Crash Course</em>.
          Source examples:{" "}
          <a href={textbook.sourceUrl} target="_blank" rel="noreferrer">
            <em>Mastering AMC 10/12</em>
          </a>
          . Derivations and interactive explanations were written for this
          course; source excerpts retain their original attribution.
        </p>
      </footer>
    </div>
  );
}
