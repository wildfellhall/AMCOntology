import { chromium, expect } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const read = async (n) =>
  JSON.parse(await readFile(`src/content/${n}.json`, "utf8"));
const lessons = await read("lessons"),
  studies = lessons.filter((l) => l.path === "competition");
const active = [
  ...(await read("questions")),
  ...(await read("formula-questions")),
  ...(await read("method-questions")),
];
const legacy = await read("legacy-questions"),
  byId = Object.fromEntries([...active, ...legacy].map((q) => [q.id, q]));
const browser = await chromium.launch(),
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await mkdir("/tmp/amc-rigor/screens", { recursive: true });
await page.goto("http://127.0.0.1:5173/");
await expect(page.locator(".recommendation h2")).toHaveText(
  "Algebraic transformations & hidden structure",
);
await page.getByLabel("Exam track", { exact: true }).selectOption("12");
const saved = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("amcontology.v1")));
const session = async () =>
  Object.values((await saved()).sessions).sort(
    (a, b) => b.createdAt - a.createdAt,
  )[0];
async function assertFormula() {
  await page
    .locator(".session-shell, .question-stage, .matching, .options")
    .first()
    .waitFor();
  const s = await session();
  assert.equal(s.mode, "formula");
  assert.ok(
    s.questionIds.every((id) =>
      ["formula", "definition", "matching", "condition"].includes(
        byId[id].kind,
      ),
    ),
  );
  assert.equal(
    await page
      .getByRole("heading", { name: "Solve the problem", exact: true })
      .count(),
    0,
  );
  return s;
}
for (const l of studies) {
  await page.goto(`http://127.0.0.1:5173/#/lesson/${l.id}`);
  await expect(page.locator(".lesson-section")).toHaveCount(3);
  await expect(page.locator(".completion-task")).toBeVisible();
  const input = page.locator(".visual input");
  const initial = await input.inputValue();
  await input.focus();
  await input.press("End");
  assert.notEqual(await input.inputValue(), initial, l.id);
  assert.equal(await page.locator(".katex-error").count(), 0, l.id);
  assert.ok(
    (await page.locator(".visual svg[role=img]").getAttribute("aria-label"))
      .length > 30,
    l.id,
  );
  await page
    .locator(".visual")
    .screenshot({ path: `/tmp/amc-rigor/screens/${l.id}.png` });
  await page
    .getByRole("button", { name: "Reset exploration", exact: true })
    .click();
  assert.equal(await input.inputValue(), initial);
  await page.setViewportSize({ width: 320, height: 800 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    `320px overflow: ${l.id}`,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
}
await page.goto("http://127.0.0.1:5173/#/practice/formula");
for (const format of [
  "multiple-choice",
  "All",
  "formula",
  "definition",
  "matching",
]) {
  await page.goto("http://127.0.0.1:5173/#/practice/formula");
  await page.getByLabel("Format", { exact: true }).selectOption(format);
  await page.getByRole("button", { name: "Begin formula drill" }).click();
  const s = await assertFormula();
  if (format === "multiple-choice") {
    assert.ok(
      s.questionIds.every((id) =>
        ["formula", "definition"].includes(byId[id].kind),
      ),
    );
    assert.equal(new Set(s.questionIds.map((id) => byId[id].kind)).size, 2);
  }
  if (format !== "All" && format !== "multiple-choice")
    assert.ok(s.questionIds.every((id) => byId[id].kind === format));
}
await page.goto("http://127.0.0.1:5173/#/today");
await page
  .locator(".practice-folio-formula")
  .getByRole("button", { name: /Start 5/ })
  .click();
await assertFormula();
await page.goto("http://127.0.0.1:5173/#/lesson/polynomial-structure");
await page.getByRole("button", { name: "Formula drill", exact: true }).click();
const formulaSession = await assertFormula();
assert.equal(formulaSession.questionIds.length, 16);
await page.getByRole("button", { name: "Bookmark", exact: true }).click();
await page.goto("http://127.0.0.1:5173/#/notebook");
await page.getByRole("button", { name: "Bookmarks", exact: true }).click();
await page.getByRole("button", { name: "Try again", exact: true }).click();
await assertFormula();
for (const mode of ["mixed", "method"]) {
  await page.goto(`http://127.0.0.1:5173/#/practice/${mode}`);
  await expect(page.getByLabel("Material", { exact: true })).toHaveValue(
    "competition",
  );
  await page
    .getByRole("button", { name: "Begin practice", exact: true })
    .click();
  const s = await session();
  assert.equal(s.mode, mode);
  assert.ok(
    s.questionIds.every((id) =>
      studies.some((l) => l.id === byId[id].lessonId),
    ),
  );
}
const methodSession = await session(),
  method = byId[methodSession.questionIds[0]];
const wrong = (method.answer + 1) % method.options.length;
await page.getByRole("radio").nth(wrong).click();
await page.getByRole("button", { name: "Check answer" }).click();
await expect(page.locator(".feedback")).toContainText(
  method.optionRationales[wrong],
);
await page.goto("http://127.0.0.1:5173/#/map");
const boxes = await page.locator(".graph-node").evaluateAll((nodes) =>
  nodes.map((n) => ({
    y: n.getBBox().y + n.transform.baseVal[0].matrix.f,
    h: n.getBBox().height,
  })),
);
const mapHeight = await page
  .locator(".graph-scroll svg")
  .evaluate((el) => el.viewBox.baseVal.height);
assert.ok(boxes.every((b) => b.y + b.h < mapHeight));
await page.getByLabel("Find a concept").fill("Spatial geometry");
await page.locator(".graph-search-results button").click();
await expect(page.locator(".graph-detail")).toContainText(
  "Cavalieri comparison",
);
// A historical calculation remains loadable under its old ID; new drills never select it.
const old = legacy.find((q) => q.kind === "application");
const backup = await saved();
backup.notes[old.id] = "Historical calculation note";
backup.bookmarks.push(old.id);
await page.goto("http://127.0.0.1:5173/#/settings");
await page.locator("input[type=file]").setInputFiles({
  name: "legacy-progress.json",
  mimeType: "application/json",
  buffer: Buffer.from(JSON.stringify(backup)),
});
await page.getByRole("status").filter({ hasText: "Backup restored" }).waitFor();
assert.equal((await saved()).notes[old.id], "Historical calculation note");
await page.goto("http://127.0.0.1:5173/#/lesson/probability-states");
await page.getByRole("button", { name: "Start the 15-question set" }).click();
const practiceSession = await session();
assert.ok(
  practiceSession.questionIds.includes("probability-states-released-2023b21"),
);
assert.equal(byId["probability-states-q10"].source.kind, "adapted");
await page.goto("http://127.0.0.1:5173/#/today");
await page.screenshot({
  path: "/tmp/amc-rigor/screens/home.png",
  fullPage: true,
});
await page.goto("http://127.0.0.1:5173/#/course");
await page.screenshot({
  path: "/tmp/amc-rigor/screens/course.png",
  fullPage: true,
});
await page.goto("http://127.0.0.1:5173/#/lesson/probability-states");
await page.screenshot({
  path: "/tmp/amc-rigor/screens/probability-lesson.png",
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: "/tmp/amc-rigor/screens/probability-mobile.png",
  fullPage: true,
});
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload();
await expect(
  page.getByRole("button", { name: "Play animation" }),
).toBeDisabled();
assert.deepEqual(errors, []);
console.log(
  "Competition checks passed: 18 study explorations and 320px layouts; five formula formats and all new-session entry points; core practice defaults; contextual method feedback; full graph bounds; canonical diagnostics and legacy backup references.",
);
await browser.close();
