import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  BookOpen,
  Flag,
} from "lucide-react";
import { useApp } from "../context";
import { questionById, lessonById, lessons, questions } from "../data";
import { recordAttempt, recommendation, selectQuestions } from "../model";
import type { Confidence, Question } from "../types";
import { M } from "./Math";
import { BookmarkButton, External } from "./Shared";
export function SessionPage({ id }: { id: string }) {
  const { state, go, start } = useApp();
  const session = state.sessions[id];
  if (!session)
    return (
      <div className="empty">
        <h1>Session not found</h1>
        <button className="button" onClick={() => go("practice")}>
          Choose practice
        </button>
      </div>
    );
  if (session.completedAt) {
    const answers = Object.values(session.answers),
      independent = answers.filter((a) => !a.assisted && !a.skipped),
      correct = independent.filter((a) => a.correct).length;
    const rec = recommendation(state, lessons);
    const missed = [
      ...new Set(
        session.questionIds
          .filter(
            (qid) =>
              !session.answers[qid]?.correct || session.answers[qid]?.assisted,
          )
          .map((qid) => questionById[qid].lessonId),
      ),
    ];
    return (
      <div className="session-summary">
        <div className="completion-mark">
          <Check size={28} />
        </div>
        <h1>Session results</h1>
        <p>
          {session.title} · {answers.length} responses
        </p>
        <div className="summary-metrics">
          <div>
            <strong>
              {correct}/{independent.length}
            </strong>
            <span>correct without help</span>
          </div>
          <div>
            <strong>{answers.filter((a) => a.assisted).length}</strong>
            <span>supported attempts</span>
          </div>
          <div>
            <strong>{answers.filter((a) => a.skipped).length}</strong>
            <span>left to revisit</span>
          </div>
        </div>
        <p className="muted">
          {session.mode === "diagnostic"
            ? "This short check suggests a starting point. It is not an AMC score estimate or a complete measure of your knowledge."
            : session.mode === "formula" || session.mode === "method"
              ? "This practice strengthens recall and planning. Full problem solving supplies evidence for lesson readiness."
              : "Spaced review checks whether you can solve related problems after a delay."}
        </p>
        {missed.length > 0 && (
          <div className="summary-revisit">
            <h3>Lessons to review</h3>
            {missed.map((lid) => (
              <button
                key={lid}
                className="summary-link"
                onClick={() => go(`lesson/${lid}`)}
              >
                {lessonById[lid].title}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        )}
        <div className="actions">
          <button
            className="button primary"
            onClick={() => go(`lesson/${rec.lesson.id}`)}
          >
            Continue with {rec.lesson.title}
            <ArrowRight size={16} />
          </button>
          <button className="button" onClick={() => go("today")}>
            Back to today
          </button>
        </div>
        {missed.length > 0 && (
          <button
            className="text-button"
            onClick={() =>
              start(
                "Review practice",
                "review",
                selectQuestions(
                  questions.filter((q) => q.kind !== "released"),
                  state,
                  5,
                  missed,
                ),
              )
            }
          >
            Try a fresh five-question set
          </button>
        )}
      </div>
    );
  }
  const q = questionById[session.questionIds[session.index]];
  return (
    <div className="session-shell">
      <div className="session-top">
        <button className="text-button" onClick={() => go("today")}>
          <ArrowLeft size={16} />
          Save & leave
        </button>
        <span>{session.title}</span>
        <span>
          {session.index + 1} / {session.questionIds.length}
        </span>
      </div>
      <div className="progress-line">
        <i
          style={{
            width: `${(Object.keys(session.answers).length / session.questionIds.length) * 100}%`,
          }}
        />
      </div>
      <QuestionCard key={`${id}-${q.id}`} question={q} sessionId={id} />
    </div>
  );
}
function QuestionCard({
  question: q,
  sessionId,
}: {
  question: Question;
  sessionId: string;
}) {
  const { state, setState, go } = useApp();
  const session = state.sessions[sessionId],
    answer = session.answers[q.id],
    aids = session.aids[q.id] ?? { hints: 0, revealed: false };
  const [selected, setSelected] = useState<number | number[] | null>(
    answer?.selected ?? (q.kind === "matching" ? [-1, -1, -1] : null),
  );
  const [confidence, setConfidence] = useState<Confidence>(
    answer?.confidence ?? "unsure",
  );
  const [activeLeft, setActiveLeft] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const rightOrder = useMemo(() => {
    const order = (q.pairs ?? []).map((_, i) => i);
    let seed = 2166136261;
    for (const c of q.id + sessionId)
      seed = Math.imul(seed ^ c.charCodeAt(0), 16777619) >>> 0;
    for (let i = order.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, [q.id, sessionId]);
  const help = (reveal = false) =>
    setState((s) => ({
      ...s,
      sessions: {
        ...s.sessions,
        [sessionId]: {
          ...s.sessions[sessionId],
          aids: {
            ...s.sessions[sessionId].aids,
            [q.id]: {
              hints: reveal ? aids.hints : Math.min(2, aids.hints + 1),
              revealed: reveal || aids.revealed,
            },
          },
        },
      },
    }));
  const submit = (skip = false) => {
    if (answer) return;
    const now = Date.now();
    const correct =
      !skip &&
      (q.kind === "matching"
        ? Array.isArray(selected) && selected.every((v, i) => v === i)
        : selected === q.answer);
    const assisted = aids.hints > 0 || aids.revealed;
    setState((s) => {
      const next = recordAttempt(s, {
        id: `${sessionId}:${q.id}`,
        sessionId,
        questionId: q.id,
        lessonId: q.lessonId,
        family: String(q.family),
        mode: session.mode,
        correct,
        assisted,
        skipped: skip,
        confidence,
        at: now,
      });
      return {
        ...next,
        sessions: {
          ...next.sessions,
          [sessionId]: {
            ...next.sessions[sessionId],
            answers: {
              ...next.sessions[sessionId].answers,
              [q.id]: {
                selected: skip ? null : selected,
                correct,
                assisted,
                skipped: skip,
                confidence,
                at: now,
              },
            },
          },
        },
      };
    });
  };
  const next = () => {
    const end = session.index === session.questionIds.length - 1;
    setState((s) => ({
      ...s,
      diagnosticAt:
        end && session.mode === "diagnostic" ? Date.now() : s.diagnosticAt,
      sessions: {
        ...s.sessions,
        [sessionId]: {
          ...s.sessions[sessionId],
          index: end ? session.index : session.index + 1,
          completedAt: end ? Date.now() : undefined,
        },
      },
    }));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const canSubmit =
    q.kind === "matching"
      ? Array.isArray(selected) && selected.every((x) => x >= 0)
      : selected !== null;
  return (
    <>
      <div className="question-meta">
        <button
          className="text-button"
          onClick={() => go(`lesson/${q.lessonId}`)}
        >
          {lessonById[q.lessonId].title}
        </button>
        <span>
          {q.kind === "released"
            ? "Released AMC problem"
            : session.mode === "method"
              ? "Method selection"
              : q.kind === "matching"
                ? "Formula matching"
                : session.mode === "formula"
                  ? q.kind === "definition"
                    ? "Formula → objective"
                    : "Objective → formula"
                  : `Level ${q.level} of 3`}
        </span>
        <BookmarkButton id={q.id} />
      </div>
      <h1 className="question-heading">
        {session.mode === "method"
          ? "Choose a method"
          : q.kind === "matching"
            ? "Match the formulas"
            : session.mode === "formula"
              ? q.kind === "definition"
                ? "Choose the objective"
                : q.kind === "condition"
                  ? "Check the formula’s conditions"
                  : "Choose the formula"
              : "Solve the problem"}
      </h1>
      {q.context && (
        <p className="question-context">
          <M>{q.context}</M>
        </p>
      )}
      <div className="question-stem">
        <M>{q.stem}</M>
      </div>
      {q.prompt && (
        <p>
          <M>{q.prompt}</M>
        </p>
      )}
      {q.kind === "released" && q.source.url && (
        <div className="source-question">
          <External href={q.source.url}>Open the original problem</External>
          <p className="small muted">
            Read the statement and choices at the licensed source, then return
            to select its answer letter. The source opens in a new tab. Its
            solution remains available there.
          </p>
        </div>
      )}
      {q.kind === "matching" && q.pairs ? (
        <div className="matching">
          <div>
            <div className="small-label">1. Choose a use</div>
            {q.pairs.map((p, i) => (
              <button
                key={i}
                disabled={!!answer}
                className={`match-item ${activeLeft === i ? "active" : ""} ${Array.isArray(selected) && selected[i] >= 0 ? "paired" : ""}`}
                onClick={() => setActiveLeft(i)}
                aria-pressed={activeLeft === i}
              >
                <span className="choice-letter">{i + 1}</span>
                <M>{p.left}</M>
                {Array.isArray(selected) && selected[i] >= 0 && (
                  <span className="matched-letter">
                    <ArrowRight size={13} aria-hidden="true" />
                    <span>
                      {String.fromCharCode(
                        65 + rightOrder.indexOf(selected[i]),
                      )}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
          <div>
            <div className="small-label">2. Choose its formula</div>
            {rightOrder.map((v, i) => (
              <button
                key={v}
                className="match-item"
                disabled={!!answer}
                onClick={() => {
                  setSelected((prev) => {
                    const arr = Array.isArray(prev) ? [...prev] : [-1, -1, -1];
                    const old = arr.indexOf(v);
                    if (old >= 0) arr[old] = -1;
                    arr[activeLeft] = v;
                    return arr;
                  });
                  setActiveLeft((activeLeft + 1) % 3);
                }}
              >
                <span className="choice-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <M>{q.pairs![v].right}</M>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="options"
          role="radiogroup"
          aria-label="Answer choices"
          onKeyDown={(e) => {
            if (answer) return;
            const keys = [
              "ArrowDown",
              "ArrowRight",
              "ArrowUp",
              "ArrowLeft",
              "Home",
              "End",
            ];
            if (!keys.includes(e.key)) return;
            e.preventDefault();
            const current = typeof selected === "number" ? selected : 0;
            const i =
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? q.options.length - 1
                  : (current +
                      (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) +
                      q.options.length) %
                    q.options.length;
            setSelected(i);
            (e.currentTarget.children[i] as HTMLElement).focus();
          }}
        >
          {q.options.map((option, i) => (
            <button
              key={i}
              role="radio"
              tabIndex={
                selected === i || (selected === null && i === 0) ? 0 : -1
              }
              aria-checked={selected === i}
              disabled={!!answer}
              className={`option ${selected === i ? "selected" : ""} ${answer && i === q.answer ? "correct" : ""} ${answer && selected === i && !answer.correct ? "incorrect" : ""}`}
              onClick={() => setSelected(i)}
            >
              <span className="choice-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <M>{option}</M>
              {answer && i === q.answer && <Check size={18} />}
            </button>
          ))}
        </div>
      )}
      {!answer && (
        <>
          <fieldset className="confidence">
            <legend>How sure are you?</legend>
            {(["unsure", "somewhat", "confident"] as Confidence[]).map((c) => (
              <label key={c}>
                <input
                  type="radio"
                  name="confidence"
                  value={c}
                  checked={confidence === c}
                  onChange={() => setConfidence(c)}
                />
                {c === "somewhat"
                  ? "Somewhat sure"
                  : c === "confident"
                    ? "Confident"
                    : "Unsure"}
              </label>
            ))}
          </fieldset>
          <div className="actions">
            <button
              className="button primary"
              disabled={!canSubmit}
              onClick={() => submit()}
            >
              Check answer
              <ArrowRight size={16} />
            </button>
            <button className="text-button" onClick={() => submit(true)}>
              Leave this to revisit
            </button>
          </div>
        </>
      )}
      {answer && (
        <section
          className={`feedback ${answer.correct ? "positive" : ""}`}
          role="status"
        >
          <h2>
            {answer.skipped
              ? "Question skipped"
              : answer.correct
                ? answer.assisted
                  ? "Correct with assistance"
                  : "Correct"
                : "Incorrect"}
          </h2>
          <p>
            <M>
              {answer.correct
                ? answer.assisted
                  ? "Use the explanation to consolidate the method. Try a fresh problem without help when you return."
                  : "Compare the reasoning below with your own. A correct choice is most useful when you can explain it."
                : typeof answer.selected === "number" &&
                    q.optionRationales?.[answer.selected]
                  ? q.optionRationales[answer.selected]
                  : q.misconception}
            </M>
          </p>
          {answer.confidence === "confident" && !answer.correct && (
            <p className="small">
              You marked this answer as confident. Compare your steps with the
              solution below.
            </p>
          )}
          <ol className="solution-steps">
            {q.solution.map((s, i) => (
              <li key={i}>
                <M>{s}</M>
              </li>
            ))}
          </ol>
          <div className="actions">
            <button className="button primary" onClick={next}>
              {session.index === session.questionIds.length - 1
                ? "Finish session"
                : "Next problem"}
              <ArrowRight size={16} />
            </button>
            <button
              className="text-button"
              onClick={() => setShowNote(!showNote)}
            >
              <Flag size={15} />
              Add a note
            </button>
          </div>
        </section>
      )}
      {!answer && (
        <div className="help-area">
          <button
            className="text-button"
            disabled={aids.hints >= 2}
            onClick={() => help()}
          >
            <Lightbulb size={16} />
            {aids.hints ? "Next hint" : "Show hint"}
          </button>
          <button
            className="text-button"
            disabled={aids.revealed}
            onClick={() => help(true)}
          >
            <BookOpen size={16} />
            Show solution
          </button>
          {aids.hints > 0 && (
            <ol className="hint-list">
              {q.hints.slice(0, aids.hints).map((hint, i) => (
                <li key={i}>
                  <M>{hint}</M>
                </li>
              ))}
            </ol>
          )}
          {aids.revealed && (
            <ol className="solution-steps">
              {q.solution.map((s, i) => (
                <li key={i}>
                  <M>{s}</M>
                </li>
              ))}
            </ol>
          )}
          {(aids.hints > 0 || aids.revealed) && (
            <p className="small muted">
              Using a hint or solution makes this a supported attempt, which
              does not count toward independent mastery.
            </p>
          )}
        </div>
      )}
      {showNote && (
        <label className="note-field">
          What will you notice next time?
          <textarea
            value={state.notes[q.id] ?? ""}
            maxLength={20000}
            placeholder="Record the error or method to review…"
            onChange={(e) =>
              setState((s) => ({
                ...s,
                notes: { ...s.notes, [q.id]: e.target.value },
              }))
            }
          />
        </label>
      )}
      <p className="small muted provenance">
        {q.source.title}
        {q.source.kind === "original"
          ? " · Original practice; not an official AMC item."
          : ""}
        {q.source.kind === "adapted" && q.source.url && (
          <>
            {" "}
            · <External href={q.source.url}>Source problem</External>
            <br />
            {q.source.attribution}
          </>
        )}
      </p>
    </>
  );
}
