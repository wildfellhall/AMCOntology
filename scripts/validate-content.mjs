import fs from "node:fs";
import assert from "node:assert/strict";
import katex from "katex";
const read = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`../src/content/${name}.json`, import.meta.url)),
  );
const lessons = read("lessons"),
  questions = read("questions"),
  formulaQuestions = read("formula-questions"),
  methods = read("method-questions"),
  diagnosticIds = read("diagnostic"),
  diagnostic = diagnosticIds.map((id) => questions.find((q) => q.id === id)),
  formulas = read("formulas");
assert(
  diagnostic.every(Boolean),
  "Diagnostic IDs must reference canonical course questions",
);
assert.equal(new Set(diagnosticIds).size, diagnosticIds.length);
const ids = new Set(lessons.map((l) => l.id));
const questionIds = new Set();
let mathCount = 0;
const failures = [];
function walk(value, path = "") {
  if (typeof value === "string") {
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\r]/.test(value))
      failures.push(`Control character at ${path}: ${JSON.stringify(value)}`);
    const dollars = (value.match(/\$/g) || []).length;
    if (dollars % 2)
      failures.push(`Unpaired math delimiter at ${path}: ${value}`);
    for (const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]*?)\$/g)) {
      try {
        katex.renderToString(m[1] ?? m[2], {
          throwOnError: true,
          strict: "error",
          trust: false,
          output: "htmlAndMathml",
        });
        mathCount++;
      } catch (e) {
        failures.push(`${path}: ${m[1] ?? m[2]} — ${e.message}`);
      }
    }
  } else if (Array.isArray(value))
    value.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
}
const visiting = new Set(),
  visited = new Set();
function visit(id) {
  assert(!visiting.has(id), `Cycle at ${id}`);
  if (visited.has(id)) return;
  visiting.add(id);
  const l = lessons.find((l) => l.id === id);
  for (const p of l.prerequisites) {
    assert(ids.has(p), `Missing prerequisite ${p}`);
    assert(
      lessons.find((l) => l.id === p).track <= l.track,
      `Track violation ${id}`,
    );
    visit(p);
  }
  visiting.delete(id);
  visited.add(id);
}
for (const l of lessons) {
  visit(l.id);
  assert(l.teaching.length >= (l.path === "competition" ? 2 : 3));
  if (l.path === "competition") {
    assert(l.sections.length >= 3);
    assert(l.activity?.steps.length >= 2);
    assert(l.techniques.length >= 3);
    assert(l.reference?.pages);
    const originals = l.questionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q) => q.kind !== "released");
    assert.equal(new Set(originals.map((q) => q.family)).size, 14);
    for (const q of originals) {
      assert.equal(q.optionRationales.length, 5);
      assert(q.decision && q.verification.method);
    }
  }
  assert(l.derivation.length >= 3);
  assert(l.objectives.length >= 3);
  assert(l.examples.length === 2);
  assert(l.questionIds.length === 15);
  assert(l.questionIds.every((id) => questions.some((q) => q.id === id)));
  assert(
    l.questionIds.some(
      (id) => questions.find((q) => q.id === id).source.kind === "released",
    ),
  );
}
for (const q of [...questions, ...formulaQuestions, ...methods]) {
  assert(!questionIds.has(q.id), `Duplicate ID ${q.id}`);
  questionIds.add(q.id);
  assert(ids.has(q.lessonId));
  assert(q.hints.length === 2, `Hint ladder ${q.id}`);
  assert(q.solution.length >= 2, `Solution ${q.id}`);
  if (q.kind === "matching") {
    assert(q.pairs.length === 3);
    assert(new Set(q.pairs.map((p) => p.left)).size === 3);
    assert(new Set(q.pairs.map((p) => p.right)).size === 3);
  } else {
    assert(q.options.length >= 4);
    assert(
      new Set(q.options).size === q.options.length,
      `Duplicate option ${q.id}`,
    );
    assert(
      Number.isInteger(q.answer) &&
        q.answer >= 0 &&
        q.answer < q.options.length,
    );
  }
  if (q.verification)
    assert(q.verification.parameterChecked, `Unchecked ${q.id}`);
  if (q.source.kind === "released") {
    assert(
      q.source.url.startsWith("https://live.poshenloh.com/past-contests/"),
    );
    assert(q.source.verified);
    assert(q.source.statementHash.length === 64);
  }
}
[lessons, questions, formulaQuestions, methods, diagnostic, formulas].forEach(
  (v, i) =>
    walk(
      v,
      [
        "lessons",
        "questions",
        "formulaQuestions",
        "methods",
        "diagnostic",
        "formulas",
      ][i],
    ),
);
for (const f of formulas)
  try {
    katex.renderToString(f.tex, { throwOnError: true, strict: "error" });
  } catch (e) {
    failures.push(`${f.lessonId} formula: ${e.message}`);
  }
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Validated ${lessons.length} complete lessons, an acyclic prerequisite graph, ${questionIds.size} questions/drills, and ${mathCount} TeX expressions.`,
);
