import { chromium, expect } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const lessons = JSON.parse(await readFile("src/content/lessons.json", "utf8"));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await mkdir("/tmp/amc-qa", { recursive: true });
await page.goto("http://127.0.0.1:5173");
await page.getByRole("heading", { name: /Your study plan/ }).waitFor();
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "/tmp/amc-qa/home-desktop.png", fullPage: true });
await page.getByRole("button", { name: "The course", exact: true }).click();
await expect(page.locator(".lesson-row")).toHaveCount(16);
await page.getByLabel("Exam track", { exact: true }).selectOption("12");
await expect(page.locator(".lesson-row")).toHaveCount(18);
await page.getByRole("button", {name: "Prerequisite reference", exact: true}).click();
await expect(page.locator(".lesson-row")).toHaveCount(50);
await page.getByRole("button", {name: "All lessons", exact: true}).click();
await expect(page.locator(".lesson-row")).toHaveCount(lessons.length);
const mathErrors = [];
for (const l of lessons) {
  await page.goto(`http://127.0.0.1:5173/#/lesson/${l.id}`);
  await page.getByRole("heading", { name: l.title, exact: true }).waitFor();
  await page.locator(".visual input").focus();
  await page.locator(".visual input").press("End");
  await page.getByRole("button", { name: "Show the next connection" }).click();
  await page.getByRole("button", { name: "Show the next connection" }).click();
  for (const example of await page.locator(".example").all()) {
    while (
      await example
        .getByRole("button", { name: "Reveal the next step" })
        .count()
    )
      await example
        .getByRole("button", { name: "Reveal the next step" })
        .click();
  }
  const e = await page.locator(".katex-error").allTextContents();
  if (e.length) mathErrors.push({ id: l.id, e });
  if (["fractions", "triangle-area", "complex"].includes(l.id))
    await page.screenshot({
      path: `/tmp/amc-qa/lesson-${l.id}.png`,
      fullPage: true,
    });
}
assert.deepEqual(mathErrors, []);
assert.deepEqual(errors, []);
await page.goto("http://127.0.0.1:5173/#/map");
await page.getByRole("heading", { name: "Your knowledge map" }).waitFor();
assert.equal(await page.locator(".graph-node").count(), lessons.length);
await page.screenshot({ path: "/tmp/amc-qa/map-desktop.png", fullPage: true });
await page.goto("http://127.0.0.1:5173/#/lesson/fractions");
await page.getByRole("button", { name: "Start the 15-question set" }).click();
await page.getByRole("button", { name: "Show hint" }).click();
await page.getByRole("radio").first().click();
await page.getByRole("button", { name: "Check answer" }).click();
assert.ok(await page.locator(".feedback").isVisible());
const saved = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("amcontology.v1")),
);
assert.equal(saved.attempts[0].assisted, true);
await page.reload();
await page.locator(".feedback").waitFor();
await page.getByRole("button", { name: "Next problem" }).click();
await page.getByRole("button", { name: "Save & leave" }).click();
await page.getByRole("button", { name: "Resume", exact: true }).click();
await page.getByRole("heading", { name: "Solve the problem" }).waitFor();
await page.screenshot({
  path: "/tmp/amc-qa/question-desktop.png",
  fullPage: true,
});
await page.goto("http://127.0.0.1:5173/#/practice/formula");
await page.getByLabel("Format", { exact: true }).selectOption("matching");
await page.getByRole("button", { name: "Begin formula drill" }).click();
await page.locator(".matching").waitFor();
const matchState = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("amcontology.v1")),
);
const matchSession = Object.values(matchState.sessions).sort(
  (a, b) => b.createdAt - a.createdAt,
)[0];
const matchQuestion = JSON.parse(
  await readFile("src/content/formula-questions.json", "utf8"),
).find((q) => q.id === matchSession.questionIds[0]);
for (let i = 0; i < 3; i++) {
  await page.locator(".matching>div").nth(0).locator("button").nth(i).click();
  const formula = matchQuestion.pairs[i].right.slice(1, -1);
  const buttons = page.locator(".matching>div").nth(1).locator("button");
  const texts = await buttons.locator("annotation").allTextContents();
  await buttons.nth(texts.indexOf(formula)).click();
}
await page.getByRole("button", { name: "Check answer" }).click();
await page.getByRole("heading", { name: "Correct" }).waitFor();
await page.screenshot({
  path: "/tmp/amc-qa/matching-desktop.png",
  fullPage: true,
});
await page.goto("http://127.0.0.1:5173/#/settings");
const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Export progress" }).click();
const download = await downloadPromise;
await download.saveAs("/tmp/amc-qa/progress.json");
await page
  .locator("input[type=file]")
  .setInputFiles("/tmp/amc-qa/progress.json");
await page.getByRole("status").filter({ hasText: "Backup restored" }).waitFor();
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  deviceScaleFactor: 1,
});
mobile.on("pageerror", (e) => errors.push(e.message));
for (const route of [
  "today",
  "course",
  "lesson/fractions",
  "map",
  "practice/formula",
  "notebook",
  "settings",
  "sources",
]) {
  await mobile.goto("http://127.0.0.1:5173/#/" + route);
  await mobile.locator("h1").waitFor();
  await mobile.evaluate(() => document.fonts.ready);
  const overflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  );
  assert.equal(overflow, false, `Mobile overflow at ${route}`);
  await mobile.screenshot({
    path: "/tmp/amc-qa/mobile-" + route.replaceAll("/", "-") + ".png",
    fullPage: true,
  });
}
await mobile.getByRole("button", { name: "Open navigation" }).click();
await mobile.getByRole("button", { name: "The course", exact: true }).click();
await mobile
  .getByRole("heading", { name: "The course", exact: true })
  .waitFor();
assert.deepEqual(errors, []);
console.log(
  "Browser checks passed: 68 lessons, math rendering, track filters, graph, hints, answering, resume, matching, backup/restore, 8 mobile routes, navigation.",
);
await browser.close();
