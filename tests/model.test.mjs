import test from "node:test";
import assert from "node:assert/strict";
import {
  freshState,
  recordAttempt,
  lessonStats,
  independentEvidence,
  selectQuestions,
  selectFormulaQuestions,
  recommendation,
  createSession,
  activeSession,
  validateBackup,
  mergeBackup,
  DAY,
} from "../src/model.ts";
const time = new Date(2026, 10, 4, 12).getTime();
const attempt = (i, overrides = {}) => ({
  id: "a" + i,
  sessionId: "s1",
  questionId: "q" + i,
  lessonId: "fractions",
  family: "family" + i,
  mode: "lesson",
  correct: true,
  assisted: false,
  skipped: false,
  confidence: "confident",
  at: time + i,
  ...overrides,
});
const lesson = (id, prerequisites = []) => ({
  id,
  prerequisites,
  track: 10,
  title: id,
});
test("fresh state has no mastery; read exposure is distinct from independent evidence", () => {
  const s = freshState();
  assert.equal(lessonStats(s, "fractions").status, "new");
  s.lessons.fractions = { read: true, lastOpened: time, notes: "" };
  assert.equal(lessonStats(s, "fractions").status, "learning");
  assert.equal(lessonStats(s, "fractions").sample, 0);
});
test("readiness requires distinct problems and families; retention requires delayed evidence", () => {
  let s = freshState();
  for (let i = 0; i < 4; i++) s = recordAttempt(s, attempt(i));
  assert.equal(lessonStats(s, "fractions").status, "ready");
  for (let i = 4; i < 6; i++)
    s = recordAttempt(s, attempt(i, { at: time + DAY + i }));
  assert.equal(lessonStats(s, "fractions").status, "secure");
  let narrow = freshState();
  for (let i = 0; i < 10; i++)
    narrow = recordAttempt(narrow, attempt(i, { family: "one-family" }));
  assert.equal(lessonStats(narrow, "fractions").ready, false);
});
test("a hinted attempt cannot become independent through a same-day retry", () => {
  let s = recordAttempt(freshState(), attempt(0, { assisted: true }));
  s = recordAttempt(s, attempt(1, { questionId: "q0", at: time + 1000 }));
  assert.equal(independentEvidence(s, "fractions").length, 0);
  assert.equal(lessonStats(s, "fractions").sample, 0);
  s = recordAttempt(s, attempt(2, { questionId: "q0", at: time + DAY }));
  assert.equal(independentEvidence(s, "fractions").length, 1);
});
test("first incorrect attempt governs same-day evidence, even after seeing the solution", () => {
  let s = recordAttempt(freshState(), attempt(0, { correct: false }));
  s = recordAttempt(s, attempt(1, { questionId: "q0" }));
  assert.equal(lessonStats(s, "fractions").correct, 0);
  assert.equal(lessonStats(s, "fractions").sample, 1);
  assert.equal(s.reviews.fractions.due, time + 15 * 60 * 1000);
});
test("formula and method drills cannot increase full-problem mastery or schedule reviews", () => {
  let s = freshState();
  for (let i = 0; i < 8; i++)
    s = recordAttempt(s, attempt(i, { mode: i % 2 ? "formula" : "method" }));
  assert.equal(lessonStats(s, "fractions").status, "new");
  assert.deepEqual(s.reviews, {});
});
test("spaced successful retrieval advances intervals; duplicate and same-day work do not", () => {
  let s = recordAttempt(freshState(), attempt(0));
  assert.equal(s.reviews.fractions.due, time + DAY);
  s = recordAttempt(s, attempt(0));
  assert.equal(s.attempts.length, 1);
  s = recordAttempt(s, attempt(1, { at: time + 1000 }));
  assert.equal(s.reviews.fractions.due, time + DAY);
  s = recordAttempt(s, attempt(2, { at: time + DAY }));
  assert.equal(s.reviews.fractions.intervalIndex, 1);
  assert.equal(s.reviews.fractions.due, time + 4 * DAY);
  s = recordAttempt(s, attempt(3, { at: time + 4 * DAY, correct: false }));
  assert.equal(s.reviews.fractions.intervalIndex, -1);
  assert.equal(s.reviews.fractions.due, time + 4 * DAY + 900000);
});
test("recommendations do not infer a prerequisite gap from missing evidence", () => {
  const ls = [lesson("fractions"), lesson("ratios", ["fractions"])];
  let s = recordAttempt(
    freshState(),
    attempt(0, { lessonId: "ratios", correct: false }),
  );
  assert.equal(recommendation(s, ls, time + 60000).lesson.id, "ratios");
  s = recordAttempt(
    s,
    attempt(1, { lessonId: "fractions", correct: false, at: time - 1000 }),
  );
  assert.equal(recommendation(s, ls, time + 60000).lesson.id, "fractions");
  assert.equal(recommendation(s, ls, time + DAY).kind, "review");
  assert.equal(recommendation(s, ls, time + DAY).lesson.id, "fractions");
});
test("selection interleaves lessons and prioritizes unseen questions without duplicating or mutating the pool", () => {
  const pool = [0, 1, 2].flatMap((n) =>
    ["a", "b"].map((id) => ({ id: id + n, lessonId: id, level: 1 })),
  );
  const original = structuredClone(pool);
  const s = freshState();
  s.attempts = [attempt(0, { questionId: "a0" })];
  const result = selectQuestions(pool, s, 4);
  assert.deepEqual(
    result.map((q) => q.lessonId),
    ["a", "b", "a", "b"],
  );
  assert.equal(new Set(result.map((q) => q.id)).size, 4);
  assert.ok(!result.some((q) => q.id === "a0"));
  assert.deepEqual(pool, original);
  assert.deepEqual(selectQuestions(pool, s, 10, []), []);
});
test("answered final question remains resumable until completion is acknowledged", () => {
  const s = freshState();
  const session = createSession("Review", "review", [{ id: "q0" }], time);
  session.answers.q0 = {
    selected: 1,
    correct: true,
    assisted: false,
    skipped: false,
    confidence: "unsure",
    at: time,
  };
  s.sessions[session.id] = session;
  assert.equal(activeSession(s)?.id, session.id);
  session.completedAt = time + 1;
  assert.equal(activeSession(s), undefined);
});
test("backups round-trip and merge attempts once, rejecting invalid question references", () => {
  let s = recordAttempt(freshState(), attempt(0));
  const parsed = validateBackup(
    JSON.parse(JSON.stringify(s)),
    new Set(["fractions"]),
    new Set(["q0"]),
  );
  assert.deepEqual(parsed, s);
  const merged = mergeBackup(s, parsed);
  assert.equal(merged.attempts.length, 1);
  const bad = structuredClone(s);
  bad.attempts[0].questionId = "unknown";
  assert.throws(() =>
    validateBackup(bad, new Set(["fractions"]), new Set(["q0"])),
  );
  assert.throws(() => validateBackup(null, new Set(), new Set()));
});
test("a successful diagnostic routes forward without claiming mastery", () => {
  const s = recordAttempt(freshState(), attempt(0, { mode: "diagnostic" }));
  const ls = [lesson("fractions"), lesson("ratios", ["fractions"])];
  assert.equal(lessonStats(s, "fractions").ready, false);
  assert.equal(recommendation(s, ls, time + 1000).lesson.id, "ratios");
});

test("personalization survives backups while older settings stay compatible", () => {
  const old = freshState();
  assert.deepEqual(
    validateBackup(structuredClone(old), new Set(), new Set()),
    old,
  );
  const personalized = freshState();
  personalized.settings.name = "Hypatia";
  personalized.settings.accent = "plum";
  const restored = validateBackup(
    JSON.parse(JSON.stringify(personalized)),
    new Set(),
    new Set(),
  );
  assert.deepEqual(restored.settings, personalized.settings);
  for (const settings of [
    { ...personalized.settings, name: "x".repeat(41) },
    { ...personalized.settings, name: 42 },
    { ...personalized.settings, accent: "unknown" },
  ]) {
    assert.throws(() =>
      validateBackup({ ...personalized, settings }, new Set(), new Set()),
    );
  }
});

test("fresh routing starts with competition studies while reference prerequisites remain optional", () => {
  const reference = { ...lesson("reference"), path: "reference" };
  const first = { ...lesson("first", ["reference"]), path: "competition" };
  const second = { ...lesson("second", ["first"]), path: "competition" };
  assert.equal(
    recommendation(freshState(), [reference, first, second], time).lesson.id,
    "first",
  );
  const s = recordAttempt(
    freshState(),
    attempt(0, { lessonId: "first", mode: "diagnostic" }),
  );
  assert.equal(
    recommendation(s, [reference, first, second], time + 1).lesson.id,
    "second",
  );
});
test("a diagnostic and lesson attempt at the same canonical item cannot double-count evidence", () => {
  let s = recordAttempt(
    freshState(),
    attempt(0, { questionId: "canonical", mode: "diagnostic" }),
  );
  s = recordAttempt(s, attempt(1, { questionId: "canonical", mode: "lesson" }));
  assert.equal(independentEvidence(s, "fractions").length, 1);
});

test("formula multiple choice alternates directions, excludes matching, and handles a short pool", () => {
  const pool = Array.from({ length: 8 }, (_, i) => ({
    id: "q" + i,
    lessonId: "a",
    level: 1,
    kind: i < 4 ? "formula" : "definition",
  }));
  pool.push({ id: "match", lessonId: "a", level: 1, kind: "matching" });
  const state = freshState();
  state.attempts.push(attempt(0, { questionId: "q0", correct: true }));
  const selected = selectFormulaQuestions(pool, state, 5);
  assert.deepEqual(
    selected.map((q) => q.kind),
    ["formula", "definition", "formula", "definition", "formula"],
  );
  assert.equal(selected[0].id, "q1");
  assert.equal(new Set(selected.map((q) => q.id)).size, 5);
  assert.equal(selectFormulaQuestions(pool, state, 20).length, 8);
  assert.equal(
    selectFormulaQuestions(
      pool.filter((q) => q.kind === "definition"),
      state,
      5,
    ).length,
    4,
  );
  assert.equal(pool.length, 9);
});
