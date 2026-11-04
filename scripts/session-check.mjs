import { chromium, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const read = async (name) =>
  JSON.parse(await readFile(`src/content/${name}.json`, "utf8"));
const bank = [
  ...(await read("questions")),
  ...(await read("formula-questions")),
  ...(await read("method-questions")),
];
const byId = Object.fromEntries(bank.map((q) => [q.id, q]));
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const state = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("amcontology.v1")));
const current = async () => {
  const s = await state();
  const session = Object.values(s.sessions).sort(
    (a, b) => b.createdAt - a.createdAt,
  )[0];
  return { session, q: byId[session.questionIds[session.index]] };
};
await page.goto("http://127.0.0.1:5173");
await page.locator(".skip-link").focus();
await page.keyboard.press("Enter");
await expect(page.locator("main")).toBeFocused();
assert.ok(!page.url().endsWith("#main"));
await page.getByRole("button", { name: "Start assessment" }).click();
for (let i = 0; i < 12; i++) {
  await page.locator(".options").waitFor();
  const { q } = await current();
  await page.getByRole("radio").nth(q.answer).click();
  await page.getByRole("button", { name: "Check answer" }).click();
  await page
    .getByRole("button", { name: i === 11 ? "Finish session" : "Next problem" })
    .click();
}
await page.getByRole("heading", { name: "Session results" }).waitFor();
assert.ok((await state()).diagnosticAt);
assert.equal((await state()).attempts.length, 12);
await page.getByRole("button", { name: "Back to today" }).click();
await expect(page.locator(".recommendation h2")).toHaveText(
  "Spatial geometry: nets, sections & volume",
);
await page.goto("http://127.0.0.1:5173/#/lesson/fractions");
await page.getByRole("button", { name: "Bookmark", exact: true }).click();
await page
  .getByLabel("Your explanation, in your own words")
  .fill("Find the common unit before adding.");
await page.getByRole("button", { name: "Mark as read" }).click();
await page.reload();
await expect(
  page.getByLabel("Your explanation, in your own words"),
).toHaveValue("Find the common unit before adding.");
await expect(page.getByRole("button", { name: "Lesson read" })).toBeVisible();
await page.getByRole("button", { name: "Start the 15-question set" }).click();
for (let i = 0; i < 15; i++) {
  await page.locator(".options").waitFor();
  const { q } = await current();
  if (i === 0) {
    await page.getByRole("radio").first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio").nth(1)).toBeFocused();
    await expect(page.getByRole("radio").nth(1)).toHaveAttribute(
      "aria-checked",
      "true",
    );
  }
  if (q.kind === "released") {
    const link = page.getByRole("link", { name: "Open the original problem" });
    assert.equal(await link.getAttribute("href"), q.source.url);
    assert.equal(await link.getAttribute("target"), "_blank");
  }
  await page.getByRole("radio").nth(q.answer).click();
  await page.getByRole("button", { name: "Check answer" }).click();
  if (i === 0) {
    await page.getByRole("button", { name: "Add a note" }).click();
    await page
      .getByLabel("What will you notice next time?")
      .fill("Use equivalent fractions.");
  }
  await page
    .getByRole("button", { name: i === 14 ? "Finish session" : "Next problem" })
    .click();
}
await page.getByRole("heading", { name: "Session results" }).waitFor();
const completed = await state();
assert.equal(completed.attempts.length, 27);
assert.equal(completed.notes["fractions-p1-v2"], "Use equivalent fractions.");
await page.goto("http://127.0.0.1:5173/#/notebook");
await page.getByRole("button", { name: "Notes", exact: true }).click();
await expect(
  page.getByText("Find the common unit before adding.", { exact: true }),
).toBeVisible();
await expect(page.getByRole("textbox", { name: "Question note" })).toHaveValue(
  "Use equivalent fractions.",
);
await page.getByRole("button", { name: "Bookmarks", exact: true }).click();
await expect(page.locator(".notebook-item")).toHaveCount(1);
await page.goto("http://127.0.0.1:5173/#/map");
await page.getByLabel("Exam track", { exact: true }).selectOption("12");
await page.getByLabel("Find a concept").fill("complex");
await page.locator(".graph-search-results button").filter({hasText:"Complex numbers & rotations"}).click();
await expect(page.locator(".graph-detail h2")).toHaveText(
  "Complex numbers & rotations",
);
await expect
  .poll(() => page.locator(".graph-scroll").evaluate((el) => el.scrollLeft))
  .toBeGreaterThan(500);
await page.goto("http://127.0.0.1:5173/#/practice/method");
await page.getByLabel("Set length").selectOption("5");
await page.getByRole("button", { name: "Begin practice" }).click();
for (let i = 0; i < 5; i++) {
  await page.locator(".options").waitFor();
  await page.getByRole("button", { name: "Leave this to revisit" }).click();
  await page
    .getByRole("button", { name: i === 4 ? "Finish session" : "Next problem" })
    .click();
}
await page.getByRole("heading", { name: "Session results" }).waitFor();
await page.screenshot({
  path: "/tmp/amc-qa/session-complete.png",
  fullPage: true,
});
// The production bundle must boot and render math without development-only assumptions.
const production = await context.newPage();
await production.goto("http://127.0.0.1:4174/#/lesson/complex");
await production
  .getByRole("heading", { name: "Complex numbers & rotations", exact: true })
  .waitFor();
assert.equal(await production.locator(".katex-error").count(), 0);
assert.deepEqual(errors, []);
console.log(
  "Session checks passed: diagnostic routing, 15-item completion, keyboard controls, notes, bookmarks, map search, method completion, production bundle.",
);
await browser.close();
