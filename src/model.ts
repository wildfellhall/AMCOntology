import type { State, Attempt, Lesson, Question, Session, Mode } from "./types";
export const STORAGE_KEY = "amcontology.v1";
export const DAY = 86_400_000;
const INTERVALS = [1, 3, 7, 14, 30];
const fullModes = new Set<Mode>(["lesson", "mixed", "review", "diagnostic"]);
export function freshState(): State {
  return {
    version: 1,
    settings: { track: 10, sessionSize: 10, anchor: "" },
    attempts: [],
    lessons: {},
    reviews: {},
    sessions: {},
    notes: {},
    bookmarks: [],
  };
}
export function dayKey(at: number) {
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
export function independentEvidence(state: State, lessonId: string) {
  const seen = new Set<string>();
  return state.attempts.filter((a) => {
    if (a.lessonId !== lessonId || !fullModes.has(a.mode)) return false;
    const key = a.questionId + ":" + dayKey(a.at);
    if (seen.has(key)) return false;
    seen.add(key);
    return !a.assisted && !a.skipped;
  });
}
export function lessonStats(state: State, id: string, now = Date.now()) {
  const raw = state.attempts.filter(
    (a) => a.lessonId === id && fullModes.has(a.mode),
  );
  const evidence = independentEvidence(state, id);
  const byQuestion = new Map<string, Attempt>();
  evidence.forEach((a) => byQuestion.set(a.questionId, a));
  const latest = [...byQuestion.values()]
    .sort((a, b) => b.at - a.at)
    .slice(0, 8);
  const correct = latest.filter((a) => a.correct).length;
  const accuracy = latest.length ? correct / latest.length : null;
  const families = new Set(latest.map((a) => a.family)).size;
  const ready =
    latest.length >= 4 && families >= 3 && accuracy !== null && accuracy >= 0.8;
  const firstSuccess = evidence.find((a) => a.correct)?.at ?? Infinity;
  const delayed = new Set(
    evidence
      .filter((a) => a.correct && a.at - firstSuccess >= 20 * 60 * 60 * 1000)
      .map((a) => a.questionId),
  ).size;
  const secure = ready && delayed >= 2;
  const status = secure
    ? "secure"
    : ready
      ? "ready"
      : raw.length || state.lessons[id]?.read
        ? "learning"
        : "new";
  return {
    status,
    ready,
    secure,
    accuracy,
    correct,
    sample: latest.length,
    families,
    delayed,
    attempts: raw.length,
    assisted: raw.filter((a) => a.assisted).length,
    due: state.reviews[id]?.due ?? null,
    isDue: !!state.reviews[id] && state.reviews[id].due <= now,
    diagnosticReady: evidence.some((a) => a.mode === "diagnostic" && a.correct),
    last: raw.at(-1),
    read: !!state.lessons[id]?.read,
  };
}
export function recordAttempt(state: State, attempt: Attempt): State {
  if (state.attempts.some((a) => a.id === attempt.id)) return state;
  const next = {
    ...state,
    attempts: [...state.attempts, attempt],
    reviews: { ...state.reviews },
  };
  if (!fullModes.has(attempt.mode)) return next;
  const old = state.reviews[attempt.lessonId];
  // First evidence per question per calendar day governs scheduling; retrying cannot push review away.
  const duplicate = state.attempts.some(
    (a) =>
      a.questionId === attempt.questionId &&
      dayKey(a.at) === dayKey(attempt.at) &&
      fullModes.has(a.mode),
  );
  if (duplicate) return next;
  if (!attempt.correct || attempt.assisted || attempt.skipped) {
    next.reviews[attempt.lessonId] = {
      due: attempt.at + 15 * 60 * 1000,
      intervalIndex: -1,
      lastReviewedAt: attempt.at,
    };
  } else if (!old || attempt.at - old.lastReviewedAt >= 20 * 60 * 60 * 1000) {
    const i = Math.min((old?.intervalIndex ?? -1) + 1, INTERVALS.length - 1);
    next.reviews[attempt.lessonId] = {
      due: attempt.at + INTERVALS[i] * DAY,
      intervalIndex: i,
      lastReviewedAt: attempt.at,
    };
  }
  return next;
}
export function visibleLessons(state: State, lessons: Lesson[]) {
  return lessons.filter((l) => l.track <= state.settings.track);
}
export function prerequisitesReady(state: State, lesson: Lesson) {
  return lesson.prerequisites.every((id) => {
    const s = lessonStats(state, id);
    return s.ready || s.diagnosticReady || (s.read && s.correct >= 2);
  });
}
export function recommendation(
  state: State,
  lessons: Lesson[],
  now = Date.now(),
) {
  const visible = visibleLessons(state, lessons);
  const due = visible
    .filter((l) => lessonStats(state, l.id, now).isDue)
    .sort((a, b) => state.reviews[a.id].due - state.reviews[b.id].due);
  if (due.length)
    return {
      lesson: due[0],
      kind: "review",
      reason:
        "This concept is due for spaced review. Try five problems without reopening the lesson.",
    };
  const gap = visible
    .filter((l) => {
      const s = lessonStats(state, l.id);
      return s.last && (!s.last.correct || s.last.assisted) && !s.ready;
    })
    .sort(
      (a, b) =>
        (lessonStats(state, b.id).last?.at ?? 0) -
        (lessonStats(state, a.id).last?.at ?? 0),
    )[0];
  if (gap) {
    const prereq = gap.prerequisites
      .map((id) => visible.find((l) => l.id === id))
      .find(
        (l) =>
          l &&
          lessonStats(state, l.id).last &&
          !prerequisitesReady(state, { ...gap, prerequisites: [l.id] }),
      );
    if (prereq)
      return {
        lesson: prereq,
        kind: "lesson",
        reason: `This is a prerequisite for ${gap.title.toLowerCase()}, where your recent work showed a gap.`,
      };
    return {
      lesson: gap,
      kind: "lesson",
      reason:
        "Your recent attempts suggest reviewing this lesson before another problem set.",
    };
  }
  const next =
    visible.find(
      (l) =>
        l.path === "competition" &&
        !lessonStats(state, l.id).ready &&
        !lessonStats(state, l.id).diagnosticReady &&
        l.prerequisites.every((id) => {
          const prerequisite = visible.find((p) => p.id === id);
          return (
            prerequisite?.path !== "competition" ||
            lessonStats(state, id).ready ||
            lessonStats(state, id).diagnosticReady
          );
        }),
    ) ??
    visible.find(
      (l) =>
        !lessonStats(state, l.id).ready &&
        !lessonStats(state, l.id).diagnosticReady &&
        prerequisitesReady(state, l),
    ) ??
    visible.find((l) => !lessonStats(state, l.id).secure) ??
    visible[0];
  return {
    lesson: next,
    kind: "lesson",
    reason:
      next.path === "competition"
        ? "Study the competition methods here. Prerequisite references are available alongside the lesson when you need them."
        : next.prerequisites.length
          ? "Your prerequisite work suggests this lesson is an appropriate next step."
          : "Start with this foundation, or take the assessment to check your current skills.",
  };
}
export function selectQuestions(
  pool: Question[],
  state: State,
  count: number,
  lessonIds?: string[],
) {
  const allowed = lessonIds ? new Set(lessonIds) : null;
  const history = new Map<string, { at: number; correct: boolean }>();
  state.attempts.forEach((a) => history.set(a.questionId, a));
  const candidates = pool.filter((q) => !allowed || allowed.has(q.lessonId));
  const rank = (q: Question) => {
    const h = history.get(q.id);
    return !h ? 0 : !h.correct ? 1 : 2;
  };
  candidates.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (history.get(a.id)?.at ?? 0) - (history.get(b.id)?.at ?? 0) ||
      a.level - b.level ||
      a.id.localeCompare(b.id),
  );
  // Round-robin across concepts preserves method selection in mixed sessions.
  const buckets = new Map<string, Question[]>();
  for (const q of candidates) {
    if (!buckets.has(q.lessonId)) buckets.set(q.lessonId, []);
    buckets.get(q.lessonId)!.push(q);
  }
  const result: Question[] = [];
  while (result.length < Math.min(count, candidates.length))
    for (const bucket of buckets.values()) {
      if (bucket.length && result.length < count) result.push(bucket.shift()!);
    }
  return result;
}
export function selectFormulaQuestions(
  pool: Question[],
  state: State,
  count: number,
) {
  // Alternate the two multiple-choice directions, preserving unseen-first
  // selection within each direction. Matching remains an explicit format.
  const forward = selectQuestions(
    pool.filter((q) => q.kind === "formula"),
    state,
    count,
  );
  const reverse = selectQuestions(
    pool.filter((q) => q.kind === "definition"),
    state,
    count,
  );
  const result: Question[] = [];
  while (result.length < count && (forward.length || reverse.length)) {
    if (forward.length) result.push(forward.shift()!);
    if (result.length < count && reverse.length) result.push(reverse.shift()!);
  }
  return result;
}
export function createSession(
  title: string,
  mode: Mode,
  questions: Question[],
  now = Date.now(),
): Session {
  return {
    id: `s-${now}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    mode,
    questionIds: questions.map((q) => q.id),
    index: 0,
    createdAt: now,
    answers: {},
    aids: {},
  };
}
export function activeSession(state: State) {
  return Object.values(state.sessions)
    .filter((s) => !s.completedAt)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
}
export function validateBackup(
  value: unknown,
  lessonIds: Set<string>,
  questionIds: Set<string>,
): State {
  const s = value as State;
  const fail = () => {
    throw new Error("This file is not a valid AMCOntology progress backup.");
  };
  if (
    !s ||
    typeof s !== "object" ||
    s.version !== 1 ||
    ![10, 12].includes(s.settings?.track) ||
    ![5, 10, 15].includes(s.settings?.sessionSize) ||
    typeof s.settings?.anchor !== "string" ||
    s.settings.anchor.length > 300
  )
    fail();
  if (
    !Array.isArray(s.attempts) ||
    s.attempts.length > 100000 ||
    !Array.isArray(s.bookmarks)
  )
    fail();
  if (
    s.settings.name !== undefined &&
    (typeof s.settings.name !== "string" || s.settings.name.length > 40)
  )
    fail();
  if (
    s.settings.accent !== undefined &&
    !["blue", "plum", "graphite"].includes(s.settings.accent)
  )
    fail();
  const allowedModes = new Set([
    "lesson",
    "mixed",
    "review",
    "diagnostic",
    "formula",
    "method",
  ]);
  for (const a of s.attempts)
    if (
      !a ||
      !questionIds.has(a.questionId) ||
      !lessonIds.has(a.lessonId) ||
      typeof a.id !== "string" ||
      typeof a.sessionId !== "string" ||
      typeof a.family !== "string" ||
      !allowedModes.has(a.mode) ||
      !["unsure", "somewhat", "confident"].includes(a.confidence) ||
      !Number.isFinite(a.at) ||
      a.at < 0 ||
      typeof a.correct !== "boolean" ||
      typeof a.assisted !== "boolean" ||
      typeof a.skipped !== "boolean"
    )
      fail();
  for (const field of ["lessons", "reviews", "sessions", "notes"] as const)
    if (!s[field] || typeof s[field] !== "object" || Array.isArray(s[field]))
      fail();
  for (const [id, l] of Object.entries(s.lessons))
    if (
      !lessonIds.has(id) ||
      typeof l.read !== "boolean" ||
      !Number.isFinite(l.lastOpened) ||
      typeof l.notes !== "string" ||
      l.notes.length > 20000
    )
      fail();
  for (const [id, r] of Object.entries(s.reviews))
    if (
      !lessonIds.has(id) ||
      !Number.isFinite(r.due) ||
      !Number.isFinite(r.lastReviewedAt) ||
      !Number.isInteger(r.intervalIndex) ||
      r.intervalIndex < -1 ||
      r.intervalIndex > 4
    )
      fail();
  for (const [id, note] of Object.entries(s.notes))
    if (!questionIds.has(id) || typeof note !== "string" || note.length > 20000)
      fail();
  if (s.bookmarks.some((id) => !lessonIds.has(id) && !questionIds.has(id)))
    fail();
  for (const [id, session] of Object.entries(s.sessions)) {
    if (
      !session ||
      session.id !== id ||
      typeof session.title !== "string" ||
      session.title.length > 200 ||
      !allowedModes.has(session.mode) ||
      !Number.isFinite(session.createdAt) ||
      !Number.isInteger(session.index) ||
      !Array.isArray(session.questionIds) ||
      session.questionIds.length < 1 ||
      session.questionIds.length > 100 ||
      session.index < 0 ||
      session.index >= session.questionIds.length ||
      session.questionIds.some((q) => !questionIds.has(q)) ||
      !session.answers ||
      !session.aids
    )
      fail();
    for (const [qid, a] of Object.entries(session.answers))
      if (
        !session.questionIds.includes(qid) ||
        !a ||
        typeof a.correct !== "boolean" ||
        typeof a.assisted !== "boolean" ||
        typeof a.skipped !== "boolean" ||
        !Number.isFinite(a.at) ||
        !["unsure", "somewhat", "confident"].includes(a.confidence) ||
        !(
          a.selected === null ||
          Number.isInteger(a.selected) ||
          (Array.isArray(a.selected) && a.selected.every(Number.isInteger))
        )
      )
        fail();
    for (const [qid, a] of Object.entries(session.aids))
      if (
        !session.questionIds.includes(qid) ||
        !a ||
        !Number.isInteger(a.hints) ||
        a.hints < 0 ||
        a.hints > 2 ||
        typeof a.revealed !== "boolean"
      )
        fail();
  }
  return structuredClone(s);
}
export function mergeBackup(current: State, incoming: State): State {
  const attempts = new Map(current.attempts.map((a) => [a.id, a]));
  incoming.attempts.forEach((a) => attempts.set(a.id, a));
  return {
    ...current,
    settings: incoming.settings,
    attempts: [...attempts.values()].sort((a, b) => a.at - b.at),
    lessons: { ...current.lessons, ...incoming.lessons },
    reviews: { ...current.reviews, ...incoming.reviews },
    sessions: { ...current.sessions, ...incoming.sessions },
    notes: { ...current.notes, ...incoming.notes },
    bookmarks: [...new Set([...current.bookmarks, ...incoming.bookmarks])],
    diagnosticAt:
      Math.max(current.diagnosticAt ?? 0, incoming.diagnosticAt ?? 0) ||
      undefined,
  };
}
