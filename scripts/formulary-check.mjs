import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const read = async (n) =>
  JSON.parse(await fs.readFile(`src/content/${n}.json`, "utf8"));
const plates = await read("formulary"),
  book = await read("textbook-examples");
const b = await chromium.launch(),
  context = await b.newContext({ viewport: { width: 1440, height: 1000 } }),
  p = await context.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await fs.mkdir("/tmp/amc-formulary/screens", { recursive: true });
await p.goto("http://127.0.0.1:5173/#/formulary");
await p.getByLabel("Exam track", { exact: true }).selectOption("12");
const range = p.getByRole("slider", { name: "Derivation or example step" });
const a11y = async (label) => {
  const r = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    r.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
    label,
  );
};
const noOverflow = async (label) =>
  assert.equal(
    await p.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    label,
  );
for (const plate of plates) {
  await p.getByLabel("Choose a study", { exact: true }).selectOption(plate.id);
  for (const mode of ["derivation", "worked"]) {
    await p
      .getByRole("tab", {
        name:
          mode === "derivation"
            ? "Derivation"
            : `Textbook example ${plate.example}`,
        exact: true,
      })
      .click();
    for (let i = 0; i < 4; i++) {
      if (i)
        await p.getByRole("button", { name: "Next step", exact: true }).click();
      await expect(range).toHaveValue(String(i));
      await expect(p.locator(".formula-explanation h3")).toHaveText(
        plate[mode][i].title,
      );
      await expect(p.locator(".formula-diagram")).toHaveAttribute(
        "aria-label",
        plate[mode][i].diagram,
      );
      assert.equal(
        await p.locator(".katex-error").count(),
        0,
        `${plate.id}/${mode}/${i}`,
      );
      const overflow = await p
        .locator(".formula-diagram text")
        .evaluateAll((els) =>
          els
            .filter((e) => {
              const r = e.getBoundingClientRect(),
                s = e.closest("svg").getBoundingClientRect();
              return (
                r.left < s.left - 1 ||
                r.top < s.top - 1 ||
                r.right > s.right + 1 ||
                r.bottom > s.bottom + 1
              );
            })
            .map((e) => e.textContent),
        );
      assert.deepEqual(
        overflow,
        [],
        `SVG labels outside canvas: ${plate.id}/${mode}/${i}`,
      );
    }
    await p.locator(".formula-demonstration").screenshot({
      path: `/tmp/amc-formulary/screens/${plate.id}-${mode}.png`,
      animations: "disabled",
    });
  }
  await p
    .getByRole("button", { name: "Show explanation", exact: true })
    .click();
  await expect(p.locator(".formula-check-answer")).toBeVisible();
  await p.setViewportSize({ width: 320, height: 800 });
  await noOverflow(plate.id);
  await p.setViewportSize({ width: 1440, height: 1000 });
}
await a11y("study");
await p.getByRole("tab", { name: "Derivation", exact: true }).click();
await p
  .getByRole("tab", { name: "Derivation", exact: true })
  .press("ArrowRight");
await expect(p.getByRole("tab", { name: /Textbook example/ })).toBeFocused();
await p.getByRole("button", { name: "Restart steps", exact: true }).click();
await p.clock.install();
await p.getByRole("button", { name: "Play steps", exact: true }).click();
await p.clock.runFor(6600);
await expect(range).toHaveValue("1");
await p.getByRole("button", { name: "Pause", exact: true }).click();
await p.clock.runFor(10000);
await expect(range).toHaveValue("1");
await p.emulateMedia({ reducedMotion: "reduce" });
await expect(
  p.getByRole("button", { name: "Play steps", exact: true }),
).toBeDisabled();
await p.getByRole("button", { name: "Next step", exact: true }).click();
await expect(range).toHaveValue("2");
await p.emulateMedia({ reducedMotion: "no-preference" });
for (const [id, label, expected] of [
  ["geometric-probability", "Waiting time in minutes", "1.0000"],
  ["geometric-series", "Common ratio in tenths", "10.0000"],
  ["amgm", "First factor", "45"],
]) {
  await p.getByLabel("Choose a study", { exact: true }).selectOption(id);
  await p.locator(".live-exploration summary").click();
  await p.getByRole("slider", { name: label, exact: true }).focus();
  await p.getByRole("slider", { name: label, exact: true }).press("End");
  await expect(p.locator(".live-exploration output")).toContainText(expected);
  assert.equal(await p.locator(".katex-error").count(), 0);
}
await p.getByRole("button", { name: "Formula sheet", exact: true }).click();
await expect(p.locator(".formula-reference-grid article")).toHaveCount(112);
await a11y("reference");
await p.getByLabel("Search formulas", { exact: true }).fill("Frobenius");
await expect(p.locator(".formula-reference-grid article")).toHaveCount(1);
await p.getByLabel("Search formulas", { exact: true }).fill("");
await p
  .getByLabel("Reference collection", { exact: true })
  .selectOption("course");
await expect(p.locator(".formula-reference-grid article")).toHaveCount(122);
await p
  .getByLabel("Reference collection", { exact: true })
  .selectOption("crash");
await p.setViewportSize({ width: 320, height: 800 });
await noOverflow("formula sheet");
await p.getByLabel("Search formulas", { exact: true }).fill("Heron");
await p.screenshot({
  path: "/tmp/amc-formulary/screens/reference-mobile.png",
  fullPage: true,
});
await p.setViewportSize({ width: 1440, height: 1000 });
await p.getByRole("button", { name: "Textbook examples", exact: true }).click();
await expect(
  p.getByLabel("Choose a textbook example", { exact: true }).locator("option"),
).toHaveCount(232);
for (const e of book.examples) {
  await p
    .getByLabel("Choose a textbook example", { exact: true })
    .selectOption(e.id);
  const imgs = p.locator(
    ".source-example > .source-facsimile img, .source-corrected-figure img",
  );
  await expect(imgs).toHaveCount(e.statement.length + (e.correction ? 1 : 0));
  if (e.correction) {
    await expect(p.locator(".source-corrected-figure img")).toHaveAttribute(
      "alt",
      e.correction.description,
    );
    await expect(
      p.locator(".source-example > .source-facsimile img"),
    ).toHaveAttribute("src", e.correction.statement[0].src);
    await expect(
      p.locator(`img[src="${e.statement[0].src}"]`),
    ).not.toBeVisible();
  }
  await imgs.first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      imgs.evaluateAll((es) =>
        es.every((i) => i.complete && i.naturalWidth > 0),
      ),
    )
    .toBe(true);
}
await p
  .getByLabel("Choose a textbook example", { exact: true })
  .selectOption("example-1.2");
await p
  .getByRole("button", { name: "Reveal written solution", exact: true })
  .click();
await expect(p.locator(".source-written-solution img")).toHaveCount(2);
await a11y("source and solution");
await p.screenshot({
  path: "/tmp/amc-formulary/screens/source-solution.png",
  fullPage: true,
});
await p
  .getByRole("button", { name: "Explore the worked example", exact: true })
  .click();
await expect(p.locator(".formula-folio h2")).toHaveText(
  "Circular arrangements",
);
await p.getByRole("tab", { name: "Textbook example 1.2", exact: true }).click();
await p
  .getByRole("button", { name: "Read the source example", exact: true })
  .click();
await expect(
  p.getByLabel("Choose a textbook example", { exact: true }),
).toHaveValue("example-1.2");
await p.getByLabel("Chapter", { exact: true }).selectOption("34");
await expect(
  p.getByLabel("Choose a textbook example", { exact: true }).locator("option"),
).toHaveCount(8);
await p
  .getByLabel("Search examples", { exact: true })
  .fill("not-a-mathematical-example");
await expect(
  p.getByRole("heading", { name: "No matches", exact: true }),
).toBeVisible();
await p.getByRole("button", { name: "Clear filters", exact: true }).click();
await p
  .getByLabel("Choose a textbook example", { exact: true })
  .selectOption("example-35.1");
await p
  .getByText("Diagram correction · view the source note", { exact: true })
  .click();
await expect(p.locator(".source-correction > p")).toContainText("page 499");
await p
  .getByText("View the original, uncorrected excerpt", { exact: true })
  .click();
await expect(
  p.locator('img[src="/textbook/example-35.1-1.svg"]'),
).toBeVisible();
await a11y("corrected source with original comparison");
await p
  .getByText("View the original, uncorrected excerpt", { exact: true })
  .click();
await p.screenshot({
  path: "/tmp/amc-formulary/screens/corrected-source.png",
  fullPage: true,
});
await p.setViewportSize({ width: 320, height: 800 });
await noOverflow("source");
await p
  .getByRole("button", { name: "Enlarge example for reading", exact: true })
  .click();
await noOverflow("zoomed source");
assert(
  await p
    .locator(".source-facsimile")
    .first()
    .evaluate((e) => e.scrollWidth > e.clientWidth),
);
await a11y("mobile zoomed source");
await p.screenshot({
  path: "/tmp/amc-formulary/screens/source-mobile.png",
  fullPage: true,
});
await p.setViewportSize({ width: 1440, height: 1000 });
await p.getByLabel("Exam track", { exact: true }).selectOption("10");
assert(
  (await p
    .getByLabel("Choose a textbook example", { exact: true })
    .locator("option")
    .count()) < 232,
);
await p.getByRole("button", { name: "Animated studies", exact: true }).click();
await p
  .getByRole("button", { name: "Practice formula recognition", exact: true })
  .click();
await expect(p).toHaveURL(/#\/practice\/formula/);
assert.deepEqual(errors, []);
await b.close();
console.log(
  "Formulary passed: 18 studies × 8 steps, 112 source formulas, 122 course relations, 232 source examples, playback, keyboard, filters, cross-links, mobile, reduced motion, 23 diagram corrections, and five accessibility states.",
);
