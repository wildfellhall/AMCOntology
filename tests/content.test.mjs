import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (name) =>
  JSON.parse(
    readFileSync(
      new URL("../src/content/" + name + ".json", import.meta.url),
      "utf8",
    ),
  );
const lessons = read("lessons"),
  questions = read("questions"),
  drills = read("formula-questions"),
  formulas = read("formulas");
const exact = (q) =>
  q.verification.exact.includes("/")
    ? q.verification.exact.split("/").reduce((a, b) => Number(a) / Number(b))
    : Number(q.verification.exact);
const node = (id) =>
  questions.filter((q) => q.lessonId === id && q.kind !== "released");
const family = (id, n) => node(id).filter((q) => q.family === `${id}-${n}`);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
test("AMC 10 formula drills never introduce AMC 12 formulas as choices or matching pairs", () => {
  const advanced = new Set(
    formulas
      .filter((f) => lessons.find((l) => l.id === f.lessonId).track === 12)
      .map((f) => "$" + f.tex + "$"),
  );
  for (const q of drills.filter(
    (q) => lessons.find((l) => l.id === q.lessonId).track === 10,
  )) {
    for (const text of [...q.options, ...(q.pairs?.map((p) => p.right) ?? [])])
      assert.ok(!advanced.has(text), q.id);
  }
});
test("equal-distance average speed keys satisfy total distance / total time", () => {
  for (const q of family("rates", 1)) {
    const [, a, b] = q.stem.match(/at \$(\d+)\$ and \$(\d+)\$/);
    close(exact(q), 200 / (100 / +a + 100 / +b));
  }
});
test("triangle angle and Heron items describe possible triangles", () => {
  for (const q of family("angles", 6)) {
    const exterior = Number(q.stem.match(/is \$(\d+)/)[1]);
    const base = 180 - exterior;
    assert.ok(base > 0 && 2 * base < 180);
    close(exact(q), 180 - 2 * base);
  }
  for (const q of family("triangle-area", 3)) {
    const [a, b, c] = q.stem
      .match(/sides \$([\d, ]+)/)[1]
      .split(",")
      .map(Number);
    const h2 = b * b - ((a * a + b * b - c * c) / (2 * a)) ** 2;
    assert.ok(h2 > 0);
    close(exact(q), (a * Math.sqrt(h2)) / 2);
  }
});
test("restricted binary string and circular assignment keys agree with exhaustive enumeration", () => {
  for (const f of [1, 4, 5])
    for (const q of family("recurrence", f)) {
      const n = Number(q.stem.match(/\$(\d+)/)[1]);
      let count = 0;
      for (let bits = 0; bits < 2 ** n; bits++) {
        const s = bits.toString(2).padStart(n, "0");
        if (
          f === 4
            ? !s.includes("111")
            : !s.includes("11") &&
              (f !== 5 || !(s[0] === "1" && s.at(-1) === "1"))
        )
          count++;
      }
      close(exact(q), count);
    }
});
test("capped stars-and-bars keys agree with direct lattice counting", () => {
  for (const q of family("stars-bars", 6)) {
    const n = Number(q.stem.match(/sum to \$(\d+)/)[1]),
      cap = Number(q.stem.match(/most \$(\d+)/)[1]);
    let count = 0;
    for (let x = 0; x <= cap; x++)
      for (let y = 0; y <= cap; y++) {
        const z = n - x - y;
        if (z >= 0 && z <= cap) count++;
      }
    close(exact(q), count);
  }
});
test("binomial constant-term keys agree with polynomial multiplication", () => {
  for (const q of family("binomial", 4)) {
    const n = Number(q.stem.match(/\^([\d]+)\$/)[1]);
    let p = new Map([[0, 1]]);
    for (let k = 0; k < n; k++) {
      const next = new Map();
      for (const [e, c] of p) {
        for (const d of [2, -1]) next.set(e + d, (next.get(e + d) ?? 0) + c);
      }
      p = next;
    }
    close(exact(q), p.get(0) ?? 0);
  }
});

test("active formula drills contain recognition, meaning, or matching only; legacy calculations remain addressable", () => {
  assert.equal(drills.length, 510);
  assert.ok(
    drills.every((q) =>
      ["formula", "definition", "matching", "condition"].includes(q.kind),
    ),
  );
  const legacy = read("legacy-questions");
  assert.equal(legacy.filter((q) => q.kind === "application").length, 250);
  const active = new Set(
    [...questions, ...drills, ...read("method-questions")].map((q) => q.id),
  );
  assert.ok(legacy.every((q) => !active.has(q.id)));
});
test("diagnostic uses canonical problems and every competition study has usable method drills", () => {
  const ids = read("diagnostic"),
    methods = read("method-questions");
  assert.equal(ids.length, 15);
  assert.ok(ids.every((id) => questions.some((q) => q.id === id)));
  assert.equal(
    ids.filter(
      (id) =>
        lessons.find(
          (l) => l.id === questions.find((q) => q.id === id).lessonId,
        ).track === 10,
    ).length,
    12,
  );
  for (const l of lessons.filter((l) => l.path === "competition")) {
    assert.equal(methods.filter((q) => q.lessonId === l.id).length, 2);
    assert.equal(drills.filter((q) => q.lessonId === l.id).length, 20);
  }
});
test("competition parity-state probability agrees with direct occupancy counting", () => {
  let good = 0;
  for (let mask = 0; mask < 3 ** 9; mask++) {
    let value = mask,
      counts = [0, 0, 0];
    for (let j = 0; j < 9; j++) {
      counts[value % 3]++;
      value = Math.floor(value / 3);
    }
    if (counts.every((n) => n % 2 === 1)) good++;
  }
  close(
    exact(questions.find((q) => q.id === "probability-states-q10")),
    good / 3 ** 9,
  );
});
test("cyclic quadrilateral and circumradius examples have valid independent coordinate realizations", () => {
  const b = { x: 18 / 5, y: 24 / 5 },
    d = { x: 5 / 2, y: (-5 * Math.sqrt(3)) / 2 };
  close(Math.hypot(b.x, b.y), 6);
  close(Math.hypot(b.x - 10, b.y), 8);
  close(Math.hypot(d.x, d.y), 5);
  close(Math.hypot(d.x - 10, d.y), 5 * Math.sqrt(3));
  close(Math.hypot(b.x - d.x, b.y - d.y), 4 + 3 * Math.sqrt(3));
  close(exact(questions.find((q) => q.id === "circle-synthesis-q11")), 65 / 8);
});

test("concrete objective drills work in both directions with five distinct choices", () => {
  const forward = drills.filter((q) => q.id.endsWith("-objective-formula"));
  assert.equal(forward.length, 72);
  for (const q of forward) {
    const reverse = drills.find(
      (r) => r.id === q.id.replace("-objective-formula", "-formula-objective"),
    );
    assert.ok(reverse, q.id);
    assert.equal(q.options[q.answer], reverse.context);
    assert.equal(reverse.options[reverse.answer], q.context);
    for (const item of [q, reverse]) {
      assert.equal(item.options.length, 5);
      assert.equal(new Set(item.options).size, 5);
      assert.equal(item.optionRationales.length, 5);
      assert.ok(item.optionRationales.every(Boolean));
    }
  }
});
