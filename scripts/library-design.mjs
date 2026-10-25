import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const errors = [];
page.on("pageerror", error => errors.push(error.message));
async function go(path) {
  const response = await page.goto(base + path);
  assert.equal(response.status(), 200, path);
  await page.locator("main[aria-busy=false]").waitFor();
  await page.locator("main h1").waitFor();
}
async function noOverflow(path, width) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px overflow: ${path}`);
}
try {
  await go("/");
  for (const label of ["อะตอม", "โมเลกุล", "แก๊ส"]) {
    const button = page.getByRole("button", { name: label, exact: true });
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator(".atlas-visual-stage svg[role=img] title").count(), 1);
    const href = await page.locator(".atlas-visual-copy a").getAttribute("href");
    assert.equal((await page.request.get(base + href)).status(), 200, href);
  }
  const subjects = await page.locator(".atlas-subject").evaluateAll(nodes => nodes.map(node => ({ href: node.getAttribute("href"), title: node.querySelector("h3").textContent })));
  assert.equal(subjects.length, 7);
  for (const subject of subjects) {
    await go(subject.href);
    assert.ok(await page.locator(".story-card").count(), subject.href);
    assert.equal(await page.getByRole("button", { name: subject.title, exact: true }).getAttribute("aria-pressed"), "true");
  }
  await go("/tools/experiments");
  assert.equal(await page.locator(".experiment-card").count(), 7);
  assert.equal(await page.locator(".experiment-preview-diagram[role=img] title").count(), 7);
  const ids = await page.locator(".experiment-preview-diagram [id]").evaluateAll(nodes => nodes.map(node => node.id));
  assert.equal(new Set(ids).size, ids.length, "SVG accessible IDs must remain unique");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const path of ["/", "/discover?subject=atoms-bonds", "/discover?q=NaCl", "/read/mole-stoichiometry", "/read/redox-galvanic-cells", "/read/electrons-periodic-table", "/tools/experiments"]) {
      await go(path);
      await noOverflow(path, width);
      assert.equal(await page.locator("main h1").count(), 1, path);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go("/");
  assert.ok(await page.locator('.atlas-home-grade-shortcuts a[href="/grades/4"]').isVisible());
  assert.ok((await page.locator(".atlas-home-grade-shortcuts").boundingBox()).y < 844, "Direct grade navigation should be available in the first mobile screen");
  await page.screenshot({ path: "/tmp/chemlab-redesign-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "/tmp/chemlab-redesign-desktop.png" });
  assert.deepEqual(errors, []);
  console.log("Library design checks passed: visual controls, 7 subject routes, accessible experiment illustrations, 5 viewport widths, reduced motion, direct mobile entry, no runtime errors.");
} finally { await browser.close(); }
