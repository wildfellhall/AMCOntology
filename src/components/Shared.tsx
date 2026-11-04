import { ArrowUpRight, Bookmark, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context";
import { M } from "./Math";
import type { Question } from "../types";
export function External({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="external">
      {children}
      <ArrowUpRight size={14} />
    </a>
  );
}
export function BookmarkButton({ id }: { id: string }) {
  const { state, setState } = useApp();
  const saved = state.bookmarks.includes(id);
  return (
    <button
      className={`icon-button ${saved ? "saved" : ""}`}
      aria-label={saved ? "Remove bookmark" : "Bookmark"}
      aria-pressed={saved}
      onClick={() =>
        setState((s) => ({
          ...s,
          bookmarks: saved
            ? s.bookmarks.filter((b) => b !== id)
            : [...s.bookmarks, id],
        }))
      }
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
export function Status({ status }: { status: string }) {
  return (
    <span className={`status status-${status}`}>
      <i />
      {(
        {
          new: "Not started",
          learning: "In progress",
          ready: "Ready to build on",
          secure: "Retained",
        } as Record<string, string>
      )[status] ?? status}
    </span>
  );
}
export function Example({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const [step, setStep] = useState(0);
  return (
    <article className="example">
      <div className="eyebrow">Worked example {index + 1}</div>
      <p className="problem-stem">
        <M>{question.stem}</M>
      </p>
      <p className="muted small">
        Before revealing a step, choose a possible first move.
      </p>
      <ol className="solution-steps">
        {question.solution.slice(0, step).map((s, i) => (
          <li key={i}>
            <M>{s}</M>
          </li>
        ))}
      </ol>
      <button
        className="text-button"
        onClick={() => setStep(step >= question.solution.length ? 0 : step + 1)}
      >
        {step >= question.solution.length
          ? "Cover the solution"
          : "Reveal the next step"}
        <ChevronRight size={16} />
      </button>
    </article>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
