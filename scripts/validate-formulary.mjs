import fs from "node:fs";
import assert from "node:assert/strict";
import katex from "katex";
const read = (n) =>
  JSON.parse(fs.readFileSync(`src/content/${n}.json`, "utf8"));
const plates = read("formulary"),
  references = read("crash-formulas"),
  book = read("textbook-examples"),
  sections = read("crash-sections"),
  lessons = read("lessons");
assert.equal(plates.length, 18);
assert.equal(references.length, 112);
assert.equal(book.examples.length, 232);
assert.equal(sections.length, 116);
const ids = new Set(lessons.map((l) => l.id)),
  exampleIds = new Set(book.examples.map((e) => e.id));
let math = 0;
function tex(s) {
  katex.renderToString(s, {
    throwOnError: true,
    strict: "error",
    trust: false,
  });
  math++;
}
function prose(v) {
  if (typeof v === "string") {
    assert(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v), v);
    assert.equal((v.match(/\$/g) || []).length % 2, 0);
    for (const m of v.matchAll(/\$([^$]+)\$/g)) tex(m[1]);
  } else if (v && typeof v === "object") Object.values(v).forEach(prose);
}
for (const p of plates) {
  assert(ids.has(p.lesson), p.lesson);
  assert(exampleIds.has(p.exampleSource.id));
  assert(
    sections.some((s) => s.section === p.section && s.page <= p.source.page),
  );
  tex(p.formula);
  prose(p);
  for (const mode of ["derivation", "worked"]) {
    assert.equal(p[mode].length, 4);
    for (const step of p[mode]) {
      tex(step.math);
      assert(step.text.length > 0);
      assert(step.diagram.length > 8);
    }
  }
}
for (const f of references) {
  tex(f.tex);
  prose(f);
  assert(f.page > 0 && f.page <= 118);
  assert(sections.some((s) => s.section === f.section));
  assert(f.condition.length > 0);
}
const assets = new Set();
for (const e of book.examples) {
  assert(e.statement.length > 0);
  assert.equal(e.chapter, Number(e.number.split(".")[0]));
  const correction = e.correction;
  if (correction) {
    assert(correction.description.length > 30);
    assert(correction.note.length > 40);
    assert(["reassociated", "constructed"].includes(correction.kind));
  }
  for (const a of [
    ...e.statement,
    ...e.solution,
    ...(correction ? [...correction.statement, correction.figure] : []),
  ]) {
    assert(a.width > 0 && a.height > 0);
    assert(a.page >= 1 && a.page <= 686);
    const file = `public${a.src}`;
    assert(fs.existsSync(file), file);
    const svg = fs.readFileSync(file, "utf8");
    assert(svg.includes("<svg"));
    assert(svg.includes("<path") || svg.includes("<image"));
    assert(
      !/<script|<foreignObject|(?:xlink:)?href=["\']https?:/.test(svg),
      file,
    );
    assets.add(a.src);
  }
  for (const v of e.videos)
    assert(/^https:\/\/(youtu\.be|www\.youtube\.com)\//.test(v));
}
assert.equal(book.examples.filter((e) => e.correction).length, 23);
assert.equal(assets.size, 354);
assert.equal(new Set(plates.map((p) => p.id)).size, plates.length);
assert.equal(exampleIds.size, book.examples.length);
console.log(
  `Formulary: ${plates.length} studies, ${references.length} references, ${book.examples.length} examples, ${assets.size} SVG excerpts; ${math} TeX expressions rendered.`,
);
