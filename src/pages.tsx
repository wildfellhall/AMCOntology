import { useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Network,
  Repeat2,
  Download,
  Upload,
  Search,
  Check,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { useApp } from "./context";
import {
  lessons,
  lessonById,
  questions,
  questionById,
  formulaQuestions,
  formulaChoiceQuestions,
  methodQuestions,
  diagnosticQuestions,
  domains,
  formulas,
  allQuestions,
} from "./data";
import {
  activeSession,
  lessonStats,
  recommendation,
  selectQuestions,
  selectFormulaQuestions,
  visibleLessons,
  validateBackup,
  mergeBackup,
} from "./model";
import { M } from "./components/Math";
import { Visual } from "./components/Visual";
import {
  SubjectSketch,
  PracticeSketch,
  FractionPreview,
} from "./components/Illustrations";
import {
  NaturalStudy,
  Fleuron,
  FolioCorners,
  IlluminatedInitial,
} from "./components/Manuscript";
import { Personalize, AppearanceControls } from "./components/Personalize";
import {
  BookmarkButton,
  Empty,
  Example,
  External,
  Status,
} from "./components/Shared";
import type { Mode } from "./types";
export function Today() {
  const { state, go, start } = useApp();
  const heading = state.settings.name?.trim()
    ? `${state.settings.name.trim()}’s study plan`
    : "Your study plan";
  const visible = visibleLessons(state, lessons),
    rec = recommendation(state, lessons),
    resume = activeSession(state);
  const due = visible.filter((l) => lessonStats(state, l.id).isDue),
    ready = visible.filter((l) => lessonStats(state, l.id).ready);
  const nextLessons = visible.slice(
    visible.findIndex((l) => l.id === rec.lesson.id),
    visible.findIndex((l) => l.id === rec.lesson.id) + 3,
  );
  const allowed = new Set(visible.map((l) => l.id));
  const practice = [
    {
      kind: "formula" as const,
      title: "Formula drill",
      description: "Choose the formula or the objective it fulfills.",
      pool: formulaChoiceQuestions.filter(
        (q) => lessonById[q.lessonId].path === "competition",
      ),
    },
    {
      kind: "method" as const,
      title: "Method selection",
      description: "Choose an approach before calculating.",
      pool: methodQuestions.filter(
        (q) => lessonById[q.lessonId].path === "competition",
      ),
    },
    {
      kind: "mixed" as const,
      title: "Mixed problems",
      description: "Solve problems from several topics.",
      pool: questions.filter(
        (q) =>
          q.kind !== "released" &&
          lessonById[q.lessonId].path === "competition",
      ),
    },
  ];
  return (
    <>
      <div className="study-heading manuscript-heading">
        <div className="manuscript-title">
          <span className="folio-label">
            AMC {state.settings.track} · A mathematical compendium
          </span>
          <h1 aria-label={heading}>
            <IlluminatedInitial letter={heading[0]} />
            <span aria-hidden="true">{heading.slice(1)}</span>
          </h1>
          <Fleuron />
          <Personalize />
        </div>
        <NaturalStudy />
      </div>
      {resume && (
        <div className="resume-banner">
          <div>
            <span className="small-label">Unfinished session</span>
            <strong>{resume.title}</strong>
            <span className="small muted">
              {Object.keys(resume.answers).length} of{" "}
              {resume.questionIds.length} answered
            </span>
          </div>
          <button className="button" onClick={() => go(`session/${resume.id}`)}>
            Resume
            <ArrowRight size={16} />
          </button>
        </div>
      )}
      <div className="study-spread">
        <section className="study-sheet recommendation">
          <FolioCorners />
          <div className="sheet-topline">
            <span>
              {rec.kind === "review" ? "Spaced review" : "Recommended lesson"}
            </span>
            <span className="sheet-page">
              No. {String(rec.lesson.number).padStart(2, "0")}
            </span>
          </div>
          <div className="sheet-content">
            <div className="sheet-lesson">
              <span className="chapter-label">{rec.lesson.domain}</span>
              <h2>{rec.lesson.title}</h2>
              <p>{rec.reason}</p>
              <div className="sheet-meta">
                <Clock3 size={14} />
                {rec.lesson.minutes} min<span>·</span>15 problems
              </div>
              <button
                className="button primary"
                onClick={() =>
                  rec.kind === "review"
                    ? start(
                        "Spaced review",
                        "review",
                        selectQuestions(
                          questions.filter((q) => q.kind !== "released"),
                          state,
                          5,
                          [rec.lesson.id],
                        ),
                      )
                    : go(`lesson/${rec.lesson.id}`)
                }
              >
                {rec.kind === "review"
                  ? "Start a short review"
                  : "Open the lesson"}
                <ArrowRight size={17} />
              </button>
              <button className="text-button" onClick={() => go("course")}>
                Browse the full course
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="sheet-exploration">
              {rec.lesson.id === "fractions" ? (
                <FractionPreview />
              ) : (
                <Visual key={rec.lesson.id} id={rec.lesson.id} />
              )}
            </div>
          </div>
          <div className="sheet-bottomline">
            <span className="proof-mark">∴</span>
            <span>
              Explanation <i>·</i> Interactive exploration <i>·</i> Worked
              examples
            </span>
            <span className="folio-number">
              {String(rec.lesson.number).padStart(2, "0")}
            </span>
          </div>
        </section>
        <aside className="study-margin">
          <div className="margin-label">Course sequence</div>
          <ol className="lesson-trail">
            {nextLessons.map((l, i) => (
              <li key={l.id} className={i === 0 ? "current" : ""}>
                <button onClick={() => go(`lesson/${l.id}`)}>
                  <span className="trail-number">
                    {String(l.number).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{l.title}</strong>
                    <small>{i === 0 ? "Recommended" : l.domain}</small>
                  </span>
                  {i === 0 && <ArrowRight size={14} />}
                </button>
              </li>
            ))}
          </ol>
          <div className="map-preview">
            <button className="map-preview-link" onClick={() => go("map")}>
              <svg viewBox="0 0 240 100" aria-hidden="true">
                <path
                  d="M18 60 60 26 111 53 159 22 212 50M18 60l46 26 47-33 57 34 44-37M60 26l4 60M159 22l9 65"
                  fill="none"
                  stroke="var(--art-rule)"
                />
                {[
                  [18, 60],
                  [60, 26],
                  [111, 53],
                  [159, 22],
                  [212, 50],
                  [64, 86],
                  [168, 87],
                ].map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === 2 ? 7 : 4}
                    fill={i === 2 ? "var(--accent)" : "var(--paper)"}
                    stroke="var(--accent)"
                  />
                ))}
              </svg>
              <span>
                Knowledge map
                <ArrowRight size={14} />
              </span>
            </button>
            <p>
              <strong>{ready.length}</strong> / {visible.length} concepts ready
            </p>
            <span className="small muted">{due.length} due for review</span>
          </div>
        </aside>
      </div>
      <section className="practice-shelf">
        <div className="section-heading">
          <h2>Practice</h2>
          <Fleuron />
          <button className="text-button" onClick={() => go("practice")}>
            All practice
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="illustrated-practice">
          {practice.map((p) => {
            const pool = p.pool.filter((q) => allowed.has(q.lessonId));
            return (
              <article
                key={p.kind}
                className={`practice-folio practice-folio-${p.kind}`}
              >
                <button
                  className="practice-folio-link"
                  onClick={() => go(`practice/${p.kind}`)}
                >
                  <PracticeSketch kind={p.kind} />
                  <span className="practice-folio-title">
                    {p.title}
                    <ArrowRight size={17} />
                  </span>
                  <span className="practice-folio-description">
                    {p.description}
                  </span>
                </button>
                <div className="practice-folio-bottom">
                  <span>{pool.length} questions</span>
                  <button
                    onClick={() =>
                      start(
                        p.title,
                        p.kind,
                        p.kind === "formula"
                          ? selectFormulaQuestions(pool, state, 5)
                          : selectQuestions(pool, state, 5),
                      )
                    }
                  >
                    Start 5<ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {!state.diagnosticAt && (
        <div className="assessment-note">
          <SubjectSketch domain="Strategy" />
          <div>
            <h3>Starting assessment</h3>
            <p>
              Sample contest connections to choose a starting study. This
              assessment is optional.
            </p>
          </div>
          <button
            className="button"
            onClick={() =>
              start(
                "Starting assessment",
                "diagnostic",
                diagnosticQuestions.filter((q) => allowed.has(q.lessonId)),
              )
            }
          >
            Start assessment
            <ArrowRight size={16} />
          </button>
        </div>
      )}
      {state.settings.anchor && (
        <p className="habit-note">
          Study reminder: <strong>{state.settings.anchor}</strong>
        </p>
      )}
    </>
  );
}
export function Course({ initialDomain }: { initialDomain?: string }) {
  const { state, go } = useApp();
  const [path, setPath] = useState("competition");
  const [search, setSearch] = useState(""),
    [domain, setDomain] = useState(
      initialDomain && domains.includes(decodeURIComponent(initialDomain))
        ? decodeURIComponent(initialDomain)
        : "All",
    );
  const courseDomains = domains.filter((d) =>
    visibleLessons(state, lessons).some(
      (l) => l.domain === d && (path === "all" || l.path === path),
    ),
  );
  const visible = visibleLessons(state, lessons).filter(
    (l) =>
      (path === "all" || l.path === path) &&
      (domain === "All" || l.domain === domain) &&
      `${l.title} ${l.summary}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <h1>The course</h1>
        <p>
          Study competition methods and their connections. Prerequisite
          references are available whenever an earlier idea needs review.
        </p>
      </div>
      <div className="tabs course-paths" aria-label="Course pathway">
        {[
          ["competition", "Competition studies"],
          ["reference", "Prerequisite reference"],
          ["all", "All lessons"],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={path === value}
            className={path === value ? "active" : ""}
            onClick={() => {
              setPath(value);
              setDomain("All");
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="subject-index" aria-label="Course topics">
        {courseDomains.map((d, i) => (
          <button
            key={d}
            className={domain === d ? "selected" : ""}
            aria-pressed={domain === d}
            onClick={() => setDomain(domain === d ? "All" : d)}
          >
            <SubjectSketch domain={d} />
            <span>
              <small>{String(i + 1).padStart(2, "0")}</small>
              {d}
            </span>
          </button>
        ))}
      </div>
      <div className="filters">
        <label className="search">
          <Search size={17} />
          <input
            aria-label="Search lessons"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the course…"
          />
        </label>
        <label className="select-label">
          Topic
          <select
            aria-label="Topic"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option>All</option>
            {domains.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      {domains
        .filter((d) => visible.some((l) => l.domain === d))
        .map((d) => (
          <section className="course-section" key={d}>
            <div className="section-heading">
              <h2>
                <span className="chapter-number">
                  {String(courseDomains.indexOf(d) + 1).padStart(2, "0")}
                </span>
                {d}
              </h2>
              <span className="small muted">
                {visible.filter((l) => l.domain === d).length}
                {visible.filter((l) => l.domain === d).length === 1
                  ? " lesson"
                  : " lessons"}
              </span>
            </div>
            <div className="lesson-list">
              {visible
                .filter((l) => l.domain === d)
                .map((l) => (
                  <button
                    key={l.id}
                    className="lesson-row"
                    onClick={() => go(`lesson/${l.id}`)}
                  >
                    <span className="lesson-number">
                      {String(l.number).padStart(2, "0")}
                    </span>
                    <span className="lesson-row-main">
                      <strong>{l.title}</strong>
                      <span>{l.summary}</span>
                    </span>
                    <span className="lesson-row-meta">
                      <Status status={lessonStats(state, l.id).status} />
                      <span className="small muted">
                        {l.minutes} min + practice
                      </span>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                ))}
            </div>
          </section>
        ))}
      {!visible.length && (
        <Empty title="No matching lessons">
          Try another term or topic. AMC 12 extensions appear when the AMC 12
          track is selected.
        </Empty>
      )}
    </>
  );
}
export function LessonPage({ id }: { id: string }) {
  const { state, setState, go, start } = useApp();
  const l = lessonById[id];
  const [derive, setDerive] = useState(1);
  if (!l)
    return (
      <Empty title="Lesson not found">Choose a lesson from the course.</Empty>
    );
  const stats = lessonStats(state, id),
    formula = formulas.find((f) => f.lessonId === id)!;
  const read = () =>
    setState((s) => ({
      ...s,
      lessons: {
        ...s.lessons,
        [id]: {
          read: true,
          lastOpened: Date.now(),
          notes: s.lessons[id]?.notes ?? "",
        },
      },
    }));
  return (
    <div className="lesson-page">
      <button className="text-button" onClick={() => go("course")}>
        <ArrowLeft size={15} />
        The course
      </button>
      <header className="lesson-header">
        <FolioCorners />
        <div className="lesson-header-art">
          <SubjectSketch domain={l.domain} />
        </div>
        <div className="eyebrow">
          {String(l.number).padStart(2, "0")} / {l.domain} ·{" "}
          {l.path === "competition"
            ? "Competition study"
            : "Prerequisite reference"}
          {l.track === 12 ? " · AMC 12" : ""}
          <BookmarkButton id={id} />
        </div>
        <h1>{l.title}</h1>
        <p className="lede">{l.summary}</p>
        <div className="lesson-metadata">
          <span>
            <Clock3 size={14} />
            {l.minutes} min + practice
          </span>
          <Status status={stats.status} />
          <span>
            {stats.sample
              ? `${stats.correct}/${stats.sample} recent independent problems correct`
              : "No independent evidence yet"}
          </span>
        </div>
      </header>
      <div className="lesson-layout">
        <article className="lesson-body">
          <div className="objectives">
            <h3>Learning objectives</h3>
            <ul>
              {l.objectives.map((o, i) => (
                <li key={i}>
                  <M>{o}</M>
                </li>
              ))}
            </ul>
          </div>
          <h2>Explanation</h2>
          {l.teaching.map((p, i) => (
            <p key={i}>
              <M>{p}</M>
            </p>
          ))}
          <Visual key={id} id={id} />
          {l.sections?.map((section) => (
            <section className="lesson-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  <M>{paragraph}</M>
                </p>
              ))}
            </section>
          ))}
          <div className="derivation">
            <h2>Derivation</h2>
            <ol className="solution-steps">
              {l.derivation.slice(0, derive).map((d, i) => (
                <li key={i}>
                  <M>{d}</M>
                </li>
              ))}
            </ol>
            <button
              className="text-button"
              onClick={() =>
                setDerive(derive < l.derivation.length ? derive + 1 : 1)
              }
            >
              {derive < l.derivation.length
                ? "Show the next connection"
                : "Start the derivation again"}
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="formula-note">
            <M>{`$${formula.tex}$`}</M>
            <p>{formula.use}</p>
            <p className="small muted">{formula.condition}</p>
          </div>
          <div className="pitfall">
            <span className="small-label">Common error</span>
            <p>
              <M>{l.pitfall}</M>
            </p>
          </div>
          <h2>Worked examples</h2>
          {l.examples.map((q, i) => (
            <Example key={q.id} question={q} index={i} />
          ))}
          {l.activity && (
            <section className="completion-task">
              <h2>Complete the reasoning</h2>
              <p>
                <M>{l.activity.prompt}</M>
              </p>
              <details>
                <summary>Compare your reasoning</summary>
                <p>
                  <M>{l.activity.answer}</M>
                </p>
                <ol className="solution-steps">
                  {l.activity.steps.map((step, index) => (
                    <li key={index}>
                      <M>{step}</M>
                    </li>
                  ))}
                </ol>
              </details>
            </section>
          )}
          <label className="note-field">
            Your explanation, in your own words
            <textarea
              placeholder="Summarize the method and when to use it."
              maxLength={20000}
              value={state.lessons[id]?.notes ?? ""}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  lessons: {
                    ...s.lessons,
                    [id]: {
                      read: s.lessons[id]?.read ?? false,
                      lastOpened: Date.now(),
                      notes: e.target.value,
                    },
                  },
                }))
              }
            />
          </label>
          <div className="lesson-finish">
            <div>
              <h2>Problem set</h2>
              <p>
                14 original problems, followed by a released AMC problem at its
                source. Start now and return whenever you need.
              </p>
            </div>
            <div className="actions">
              <button
                className="button primary"
                onClick={() =>
                  start(
                    l.title,
                    "lesson",
                    l.questionIds.map((qid) => questionById[qid]),
                  )
                }
              >
                Start the 15-question set
                <ArrowRight size={16} />
              </button>
              <button className="button" onClick={read}>
                {stats.read ? (
                  <>
                    <Check size={15} />
                    Lesson read
                  </>
                ) : (
                  "Mark as read"
                )}
              </button>
            </div>
            <p className="small muted">
              Reading records exposure. Independent problem solving and later
              retrieval build readiness.
            </p>
          </div>
        </article>
        <aside className="lesson-aside">
          {l.techniques && (
            <>
              <div className="small-label">Methods in this study</div>
              <ul className="technique-list">
                {l.techniques.map((technique) => (
                  <li key={technique}>{technique}</li>
                ))}
              </ul>
            </>
          )}
          <div className="small-label">Before this lesson</div>
          {l.prerequisites.length ? (
            <ul className="link-list">
              {l.prerequisites.map((pid) => (
                <li key={pid}>
                  <button onClick={() => go(`lesson/${pid}`)}>
                    {lessonById[pid].title}
                    <ArrowRight size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted">
              Start here. No earlier lesson required.
            </p>
          )}
          <div className="small-label">Related practice</div>
          <button
            className="aside-action"
            onClick={() =>
              start(
                `${l.title} · formula drill`,
                "formula",
                selectFormulaQuestions(
                  formulaChoiceQuestions.filter((q) => q.lessonId === id),
                  state,
                  16,
                ),
              )
            }
          >
            Formula drill
            <ArrowRight size={14} />
          </button>
          <button
            className="aside-action"
            onClick={() =>
              start(
                `${l.title} · choose a method`,
                "method",
                methodQuestions.filter((q) => q.lessonId === id),
              )
            }
          >
            Choose a method
            <ArrowRight size={14} />
          </button>
          <button className="aside-action" onClick={() => go("map")}>
            View the knowledge map
            <Network size={15} />
          </button>
          <div className="small-label">Further reading</div>
          {l.reference && (
            <p className="textbook-reference">
              {l.reference.book}
              <br />
              Chapter {l.reference.chapter}, pp. {l.reference.pages}
            </p>
          )}
          <External href="https://www.omegalearn.org/mastering-amc1012">
            Mastering AMC 10/12
          </External>
          {l.chapter && (
            <p className="small muted">
              Related material: chapter {l.chapter} in the supplied book.
            </p>
          )}
          <External
            href={`https://live.poshenloh.com/past-contests/concepts/${l.sourceConcept}`}
          >
            Related released problems
          </External>
          <p className="small muted">
            External resources are optional. Lesson text and original practice
            are included here.
          </p>
          {stats.isDue && (
            <div className="aside-review">
              <Repeat2 size={18} />
              <p>This idea is due for a return.</p>
              <button
                className="text-button"
                onClick={() =>
                  start(
                    "Return to " + l.title,
                    "review",
                    selectQuestions(
                      questions.filter((q) => q.kind !== "released"),
                      state,
                      5,
                      [id],
                    ),
                  )
                }
              >
                Try five fresh problems
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
export function Practice({ initialMode = "mixed" }: { initialMode?: string }) {
  const { state, start } = useApp();
  const [mode, setMode] = useState<Mode>(
    ["formula", "method", "review"].includes(initialMode)
      ? (initialMode as Mode)
      : "mixed",
  );
  const [domain, setDomain] = useState("All"),
    [level, setLevel] = useState("All"),
    [size, setSize] = useState(state.settings.sessionSize),
    [format, setFormat] = useState("multiple-choice"),
    [path, setPath] = useState("competition");
  const visible = visibleLessons(state, lessons),
    due = visible.filter((l) => lessonStats(state, l.id).isDue);
  const allowed = visible
    .filter(
      (l) =>
        (domain === "All" || l.domain === domain) &&
        (mode === "review" || path === "all" || l.path === path) &&
        (mode !== "review" || due.some((d) => d.id === l.id)),
    )
    .map((l) => l.id);
  const pool = (
    mode === "formula"
      ? formulaQuestions
      : mode === "method"
        ? methodQuestions
        : questions.filter((q) => q.kind !== "released")
  ).filter(
    (q) =>
      allowed.includes(q.lessonId) &&
      (mode === "formula" || level === "All" || q.level === Number(level)) &&
      (mode !== "formula" ||
        format === "All" ||
        q.kind === format ||
        (format === "multiple-choice" &&
          ["formula", "definition"].includes(q.kind))),
  );
  const types: [Mode, string, string][] = [
    ["mixed", "Mixed problems", "Choose tools across different concepts."],
    ["formula", "Formula drill", "Choose a formula or its objective."],
    ["method", "Method selection", "Choose a mathematically sound plan."],
    ["review", "Spaced review", `${due.length} concepts due for review.`],
  ];
  return (
    <>
      <div className="page-heading">
        <h1>Practice</h1>
        <p>Choose a practice type, topic, and set length.</p>
      </div>
      <div className="practice-types">
        {types.map(([m, title, description], index) => (
          <button
            key={m}
            className={mode === m ? "active" : ""}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
          >
            <span className="practice-ordinal" aria-hidden="true">
              {["I", "II", "III", "IV"][index]}
            </span>
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>
      <section className="practice-builder">
        <FolioCorners />
        <div className="practice-introduction">
          <h2>{types.find((t) => t[0] === mode)?.[1]}</h2>
          <p className="muted">
            {mode === "review"
              ? "Reviews return after 1, 3, 7, 14, and 30 days of successful spaced retrieval. A missed or supported attempt comes back sooner."
              : mode === "formula"
                ? "Given an objective, select the formula that accomplishes it. Given a formula, select the objective it fulfills."
                : mode === "method"
                  ? "Identify the structure before doing the arithmetic. Read all the plans and check their assumptions."
                  : "Unseen problems come first, with different concepts interleaved. Filter to one topic when you need focused practice."}
          </p>
        </div>
        <div
          className={`practice-filters ${mode === "formula" ? "formula-filters" : ""}`}
        >
          {mode !== "review" && (
            <label>
              Material
              <select
                aria-label="Material"
                value={path}
                onChange={(e) => {
                  setPath(e.target.value);
                  setDomain("All");
                }}
              >
                <option value="competition">Competition studies</option>
                <option value="reference">Prerequisite reference</option>
                <option value="all">All material</option>
              </select>
            </label>
          )}
          <label>
            Topic
            <select
              aria-label="Topic"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option>All</option>
              {domains
                .filter((d) => visible.some((l) => l.domain === d))
                .map((d) => (
                  <option key={d}>{d}</option>
                ))}
            </select>
          </label>
          {mode !== "formula" && (
            <label>
              Challenge
              <select
                aria-label="Challenge"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>All</option>
                <option value="1">1 · Establish the idea</option>
                <option value="2">2 · Connect the steps</option>
                <option value="3">3 · Extend the method</option>
              </select>
            </label>
          )}
          <label>
            Set length
            <select
              aria-label="Set length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              {[5, 10, 15].map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
          </label>
          {mode === "formula" && (
            <label>
              Format
              <select
                aria-label="Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="multiple-choice">
                  Both directions · multiple choice
                </option>
                <option value="formula">Objective → formula</option>
                <option value="definition">Formula → objective</option>
                <option value="matching">Matching</option>
                <option value="All">All formats</option>
              </select>
            </label>
          )}
        </div>
        {mode === "formula" && (
          <p className="formula-format-note">
            {format === "multiple-choice"
              ? "Alternates the two directions. Each question has five choices."
              : format === "formula"
                ? "Read an objective and choose one of five formulas."
                : format === "definition"
                  ? "Read a formula and choose one of five objectives."
                  : format === "matching"
                    ? "Pair each of three objectives with its formula."
                    : "Combines both multiple-choice directions with matching."}
          </p>
        )}
        {pool.length ? (
          <div className="builder-footer">
            <span className="small muted">
              {pool.length} available items · {Math.min(size, pool.length)} in
              this set
            </span>
            <button
              className="button primary"
              onClick={() =>
                start(
                  types.find((t) => t[0] === mode)![1],
                  mode,
                  mode === "formula" && format === "multiple-choice"
                    ? selectFormulaQuestions(pool, state, size)
                    : selectQuestions(pool, state, size),
                )
              }
            >
              {mode === "formula" ? "Begin formula drill" : "Begin practice"}
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <Empty
            title={
              mode === "review"
                ? "Nothing is due yet."
                : "No items match these filters."
            }
          >
            {mode === "review"
              ? "Your review queue grows from full problem-solving attempts. You can still choose any lesson or mixed practice."
              : "Try a broader topic, format, or challenge level."}
          </Empty>
        )}
      </section>
      <p className="small muted">
        Challenge levels describe the item’s steps and concepts. They are
        editorial labels, not calibrated AMC scores. Formula and method drills
        do not increase lesson mastery status.
      </p>
      {due.length > 0 && (
        <section>
          <div className="section-heading">
            <h2>Reviews due</h2>
          </div>
          {due.map((l) => (
            <div className="due-row" key={l.id}>
              <span>{l.title}</span>
              <button
                className="text-button"
                onClick={() =>
                  start(
                    `Review · ${l.title}`,
                    "review",
                    selectQuestions(
                      questions.filter((q) => q.kind !== "released"),
                      state,
                      5,
                      [l.id],
                    ),
                  )
                }
              >
                Review five
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
export function Notebook() {
  const { state, go, start, setState } = useApp();
  const [tab, setTab] = useState("Revisit");
  const latest = new Map<string, (typeof state.attempts)[number]>();
  state.attempts.forEach((a) => latest.set(a.questionId, a));
  const ids =
    tab === "Revisit"
      ? [...latest.values()]
          .filter((a) => !a.correct || a.assisted || a.skipped)
          .sort((a, b) => b.at - a.at)
          .map((a) => a.questionId)
      : tab === "Notes"
        ? Object.keys(state.notes).filter((id) => state.notes[id].trim())
        : state.bookmarks.filter((id) => questionById[id]);
  const lessonNotes = lessons.filter((l) =>
    tab === "Notes"
      ? state.lessons[l.id]?.notes.trim()
      : tab === "Bookmarks" && state.bookmarks.includes(l.id),
  );
  return (
    <>
      <div className="page-heading">
        <h1>Notebook</h1>
        <p>Review missed questions, saved notes, and bookmarks.</p>
      </div>
      <div className="tabs">
        {["Revisit", "Notes", "Bookmarks"].map((t) => (
          <button
            key={t}
            className={t === tab ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
            {t === "Revisit"
              ? ` · ${[...latest.values()].filter((a) => !a.correct || a.assisted || a.skipped).length}`
              : ""}
          </button>
        ))}
      </div>
      {!ids.length && !lessonNotes.length && (
        <Empty
          title={
            tab === "Revisit"
              ? "No questions to revisit"
              : tab === "Notes"
                ? "No notes yet"
                : "No bookmarks yet"
          }
        >
          {tab === "Revisit"
            ? "Missed and supported attempts appear here. A later independent correct response clears the item from this list."
            : tab === "Notes"
              ? "Add a note while studying a lesson or reviewing an answer."
              : "Use the bookmark icon on a lesson or question to save it."}
        </Empty>
      )}
      {lessonNotes.map((l) => (
        <article className="notebook-item" key={l.id}>
          <div className="eyebrow">
            Lesson note
            <BookmarkButton id={l.id} />
          </div>
          <h2>
            <button onClick={() => go(`lesson/${l.id}`)}>{l.title}</button>
          </h2>
          <p className="preserve-lines">
            {state.lessons[l.id]?.notes || l.summary}
          </p>
          <button className="text-button" onClick={() => go(`lesson/${l.id}`)}>
            Return to the lesson
            <ArrowRight size={15} />
          </button>
        </article>
      ))}
      {ids.map((id) => {
        const q = questionById[id];
        if (!q) return null;
        return (
          <article key={id} className="notebook-item">
            <div className="eyebrow">
              {lessonById[q.lessonId].title}
              <BookmarkButton id={id} />
            </div>
            <p className="problem-stem">
              <M>{q.stem}</M>
            </p>
            {latest.get(id)?.assisted && (
              <p className="small muted">Previously attempted with support.</p>
            )}
            <textarea
              aria-label="Question note"
              placeholder="What will you notice next time?"
              maxLength={20000}
              value={state.notes[id] ?? ""}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  notes: { ...s.notes, [id]: e.target.value },
                }))
              }
            />
            <div className="actions">
              <button
                className="text-button"
                onClick={() =>
                  start(
                    "Question review",
                    q.kind === "matching" ||
                      q.kind === "formula" ||
                      q.kind === "definition" ||
                      q.kind === "condition"
                      ? "formula"
                      : q.kind === "method"
                        ? "method"
                        : "review",
                    [q],
                  )
                }
              >
                Try again
                <ArrowRight size={15} />
              </button>
              <button
                className="text-button"
                onClick={() => go(`lesson/${q.lessonId}`)}
              >
                Review the lesson
                <BookOpen size={15} />
              </button>
            </div>
          </article>
        );
      })}
    </>
  );
}
export function Settings() {
  const { state, setState, storageError } = useApp();
  const [message, setMessage] = useState("");
  const backup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `amcontology-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Your progress backup has been downloaded.");
  };
  const restore = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      if (f.size > 20_000_000)
        throw new Error("This file is too large to be a progress backup.");
      const incoming = validateBackup(
        JSON.parse(await f.text()),
        new Set(lessons.map((l) => l.id)),
        new Set(allQuestions.map((q) => q.id)),
      );
      setState((s) => mergeBackup(s, incoming));
      setMessage(
        "Backup restored. Attempts were merged; imported notes and settings take precedence.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The backup could not be read.",
      );
    }
    e.target.value = "";
  };
  return (
    <>
      <div className="page-heading">
        <h1>Preferences</h1>
        <p>Set your exam track, practice length, and backup preferences.</p>
      </div>
      <div className="settings-section">
        <h2>Your manuscript</h2>
        <AppearanceControls />
      </div>
      <div className="settings-section">
        <h2>Course settings</h2>
        <label>
          Exam track
          <select
            value={state.settings.track}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                settings: {
                  ...s.settings,
                  track: Number(e.target.value) as 10 | 12,
                },
              }))
            }
          >
            <option value="10">
              AMC 10 · 16 competition studies + 45 references
            </option>
            <option value="12">
              AMC 12 · 18 competition studies + 50 references
            </option>
          </select>
        </label>
        <p className="small muted">
          Switching tracks preserves all progress. AMC 12 adds logarithms,
          trigonometry, complex numbers, and the binomial theorem.
        </p>
        <label>
          Default practice length
          <select
            value={state.settings.sessionSize}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                settings: {
                  ...s.settings,
                  sessionSize: Number(e.target.value),
                },
              }))
            }
          >
            {[5, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="settings-section">
        <h2>Study reminder</h2>
        <p>Optionally add a reminder to your study plan.</p>
        <label>
          Reminder text
          <input
            maxLength={300}
            placeholder="After I put my bag down, I’ll try one problem."
            value={state.settings.anchor}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                settings: { ...s.settings, anchor: e.target.value },
              }))
            }
          />
        </label>
      </div>
      <div className="settings-section">
        <h2>Progress backup</h2>
        <p>
          There is no account or cloud sync. Clearing browser data removes local
          progress. Export a backup to move between devices or keep a separate
          copy.
        </p>
        <div className="actions">
          <button className="button" onClick={backup}>
            <Download size={16} />
            Export progress
          </button>
          <label className="button upload-button">
            <Upload size={16} />
            Restore a backup
            <input
              type="file"
              accept="application/json,.json"
              onChange={restore}
            />
          </label>
        </div>
        {message && <p role="status">{message}</p>}
        {storageError && <p className="error">{storageError}</p>}
      </div>
      <div className="settings-section">
        <h2>What the progress labels mean</h2>
        <dl className="definitions">
          <dt>In progress</dt>
          <dd>You read a lesson or attempted a full problem.</dd>
          <dt>Ready to build on</dt>
          <dd>
            At least four distinct independent problems, spanning at least three
            problem families, with 80% or better accuracy among the most recent
            eight distinct problems.
          </dd>
          <dt>Retained</dt>
          <dd>
            Ready to build on, plus correct independent work on at least two
            distinct problems 20 or more hours after your first success in the
            concept.
          </dd>
        </dl>
        <p className="small muted">
          Only the first attempt at a question each calendar day supplies
          evidence. Using a hint or solution makes that attempt supported. These
          are transparent product rules, not a validated ability estimate or an
          official AMC readiness prediction.
        </p>
      </div>
    </>
  );
}
const evidence = [
  [
    "Retrieval, spacing, and interleaving",
    "The course asks for an attempt before feedback, revisits concepts after a delay, and mixes problems so students must choose the method. Benefits vary across tasks; mathematics-specific evidence for retrieval alone is less settled than a universal “testing effect” claim would suggest.",
    "https://doi.org/10.1007/s10648-026-10225-5",
    "2026 meta-analysis",
  ],
  [
    "Worked examples, then independent work",
    "Lessons reveal the steps of worked solutions before offering new problems. Support is recorded separately from independent success. The student can control the amount of explanation shown.",
    "https://doi.org/10.1007/s10648-023-09745-1",
    "Worked-example meta-analysis",
  ],
  [
    "Method selection",
    "Mixed sets and method-selection drills ask which structure fits. Interleaving is useful when distinguishing problem types matters; the app also leaves focused practice available.",
    "https://doi.org/10.1037/edu0000367",
    "Mathematics interleaving trial",
  ],
  [
    "Study habits",
    "Short sets and an optional routine anchor make beginning easier. This applies Fogg’s motivation–ability–prompt framework; it is a design choice, not a measured effect of this app.",
    "https://www.behaviormodel.org/",
    "Fogg Behavior Model",
  ],
  [
    "High standards with support",
    "Feedback treats errors as information while keeping the mathematical demand intact. Students control the next move. This draws on Yeager’s mentor-mindset work without claiming to reproduce its interventions.",
    "https://lifeandletters.la.utexas.edu/2025/03/the-mentor-mindset/",
    "UT Austin on the mentor mindset",
  ],
  [
    "Engagement through meaningful attempts",
    "Predictions, retrieval, revision, and manageable returns inform the learning cycle. FUSE is the University of Texas Fellowship Using Science of Engagement; this project is not affiliated with the fellowship.",
    "https://fuse.prc.utexas.edu/fuse-program-overview",
    "FUSE program overview",
  ],
];
export function Sources() {
  return (
    <>
      <div className="page-heading">
        <h1>Sources & approach</h1>
        <p>
          Curriculum resources, learning research, and progress definitions.
        </p>
      </div>
      <div className="reading-column">
        <h2>Course contents</h2>
        <p>
          The main course contains 18 competition studies, including two AMC 12
          extensions, alongside 50 prerequisite references. Each study includes
          explanatory sections, two worked examples, a completion task, an SVG
          exploration, 14 authored problems, and a linked released AMC problem.
          There are 388 multiple-choice formula/objective questions and 122
          matching drills, plus 236 method-selection questions, including 36 for
          the competition studies.
        </p>
        <p>
          Released statements and solutions remain at LIVE by Po-Shen Loh’s
          licensed archive. The app stores their source links, answer keys, and
          verification metadata. Some released problems connect to more than one
          lesson. Original and explicitly attributed adapted items are practice
          material, not official AMC questions or calibrated score predictors.
        </p>
        <h2>Free mathematical resources</h2>
        <ul className="resource-list">
          <li>
            <External href="https://maa.org/student-programs/amc/">
              Mathematical Association of America · AMC
            </External>
            <p>
              Official competition scope. The AMC 10 excludes trigonometry; the
              AMC 12 extends through precalculus, without calculus.
            </p>
          </li>
          <li>
            <External href="https://artofproblemsolving.com/resources">
              Art of Problem Solving · Free resources
            </External>
            <p>
              Problem archives, mathematical discussions, and reference material
              for contest preparation.
            </p>
          </li>
          <li>
            <External href="https://live.poshenloh.com/past-contests">
              LIVE by Po-Shen Loh · Released contests
            </External>
            <p>
              The source for the linked released-problem portion of each lesson
              set. Original problems are copyright the MAA.
            </p>
          </li>
          <li>
            <External href="https://www.omegalearn.org/mastering-amc1012">
              Omega Learn · Mastering AMC 10/12
            </External>
            <p>
              The supplied 686-page book and 118-page crash-course PDF informed
              coverage and sequencing. The app supplies new explanations and
              practice, with adaptations explicitly attributed.
            </p>
          </li>
        </ul>
        <h2>Learning design, with its limits</h2>
        {evidence.map(([title, body, url, label]) => (
          <article className="evidence-item" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
            <External href={url}>{label}</External>
          </article>
        ))}
        <p>
          The exact review intervals and readiness thresholds are inspectable
          design heuristics. The app has not undergone an efficacy trial, and
          its progress labels should not be read as a predicted contest score.
        </p>
        <External href="https://doi.org/10.1007/s10648-025-10035-1">
          Mathematics-specific review of spacing and retrieval
        </External>
        <h2>Privacy and ownership</h2>
        <p>
          Attempts, notes, settings, and sessions are stored locally in your
          browser. There are no accounts, analytics, or background uploads.
          Following an external resource opens that publisher’s website. Use
          Settings to export a portable progress backup.
        </p>
      </div>
    </>
  );
}
