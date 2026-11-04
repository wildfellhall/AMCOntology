import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const results = [];
async function audit(route) {
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.push({
    route,
    violations: report.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
}
for (const route of [
  "today",
  "course",
  "lesson/fractions",
  "lesson/algebra-transformations",
  "lesson/probability-states",
  "lesson/coordinate-lattice",
  "map",
  "practice/formula",
  "notebook",
  "settings",
  "sources",
]) {
  await page.goto("http://127.0.0.1:5173/#/" + route);
  await page.locator("h1").waitFor();
  await audit(route);
}
await page.goto("http://127.0.0.1:5173/#/lesson/fractions");
await page.getByRole("button", { name: "Start the 15-question set" }).click();
await page.locator(".options").waitFor();
await audit("question");
await page.getByRole("radio").first().click();
await audit("selected-answer");
await page.getByRole("button", { name: "Check answer" }).click();
await page.locator(".feedback").waitFor();
await audit("answer-feedback");
await page.goto("http://127.0.0.1:5173/#/practice/formula");
await page.getByLabel("Format", { exact: true }).selectOption("matching");
await page.getByRole("button", { name: "Begin formula drill" }).click();
await page.locator(".matching").waitFor();
await audit("matching");
await page.setViewportSize({ width: 390, height: 844 });
await audit("matching-mobile");
assert.equal(
  await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  ),
  false,
);
await page.screenshot({
  path: "/tmp/amc-qa/matching-mobile.png",
  fullPage: true,
});
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:5173/#/lesson/fractions");
await page.locator(".visual").waitFor();
assert.equal(
  await page.getByRole("button", { name: "Play animation" }).isDisabled(),
  true,
);
await mkdir("/tmp/amc-qa", { recursive: true });
await writeFile(
  "/tmp/amc-qa/accessibility.json",
  JSON.stringify(results, null, 2),
);
const failures = results.filter((r) => r.violations.length);
console.log(
  failures.length
    ? JSON.stringify(failures, null, 2)
    : `No automated WCAG A/AA violations in ${results.length} checked page states. Reduced-motion check passed.`,
);
await browser.close();
if (failures.length) process.exitCode = 1;
