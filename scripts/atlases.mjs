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
}
try {
  await go("/discover");
  const links = await page.locator(".story-card-art").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
  assert.equal(links.length, 24);
  let total = 0;
  for (const link of links) {
    await go(link);
    const atlas = page.locator("#visual-reference .visual-atlas");
    assert.equal(await atlas.count(), 1, link);
    const count = Number(await atlas.getAttribute("data-panel-count"));
    assert.ok(count >= 3, `Each chapter needs distinct explanatory panels: ${link}`);
    total += count;
    await atlas.getByRole("button", { name: /ดูครบทั้ง/ }).click();
    assert.equal(await atlas.locator(".atlas-inline-content .visual-atlas-card").count(), count, link);
    for (const card of await atlas.locator(".atlas-inline-content .visual-atlas-card").all()) {
      assert.ok((await card.locator("svg[role=img],img[alt]").count()) > 0, `Meaningful diagram required: ${link}`);
      assert.ok((await card.locator("h3").innerText()).length > 0);
    }
    await atlas.getByRole("button", { name: "เปิดเต็มจอ", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    assert.equal(await dialog.locator(".visual-atlas-card").count(), count);
    assert.ok((await dialog.getAttribute("aria-labelledby"))?.length);
    const ids = await dialog.locator("[id]").evaluateAll(nodes => nodes.map(node => node.id));
    assert.equal(new Set(ids).size, ids.length, "Unique accessible diagram IDs inside each sheet");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
    await page.waitForFunction(() => getComputedStyle(document.body).overflow !== "hidden");
    await page.waitForFunction(() => document.querySelector(".atlas-expand-button") === document.activeElement);
  }
  assert.ok(total >= 96, "A substantial set of chapter-specific explanatory panels");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const link of links) {
      await go(link);
      await page.locator(".atlas-show-all").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}: ${link}`);
      await page.locator(".atlas-expand-button").click();
      const dialog = page.getByRole("dialog");
      assert.equal(await dialog.evaluate(node => node.scrollWidth > node.clientWidth), false, `Dialog overflow ${width}: ${link}`);
      await dialog.getByRole("button", { name: "ปิดภาพเต็มจอ" }).click();
    }
  }
  await go("/read/small-groups-big-difference");
  await page.locator(".atlas-expand-button").click();
  await page.screenshot({ path: "/tmp/chemlab-functional-atlas-mobile.png" });
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.locator(".atlas-expand-button").click();
  await page.screenshot({ path: "/tmp/chemlab-functional-atlas-desktop.png" });
  assert.deepEqual(errors, []);
  console.log(`PASS: ${links.length} chapter sheets, ${total} explanatory panels, expand/collapse, full-screen dialogs, Escape/focus restoration, mobile/tablet widths and no runtime errors.`);
} finally { await browser.close(); }
