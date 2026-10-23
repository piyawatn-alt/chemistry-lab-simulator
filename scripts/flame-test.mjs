import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
try {
  assert.equal((await page.goto(base + "/tools/flame-test")).status(), 200);
  const status = page.locator(".flame-status");
  await page
    .getByRole("button", { name: "นำสารเข้าเปลวไฟ", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector(".flame-stage")?.dataset.phase === "heating",
  );
  assert.equal(
    await page.locator(".flame-sample-grid button:disabled").count(),
    6,
  );
  await page.waitForFunction(
    () => document.querySelector(".flame-stage")?.dataset.phase === "result",
  );
  assert.match(await status.innerText(), /NaCl → เหลืองสว่าง/);
  for (const [formula, color] of [
    ["KCl", "ม่วงอ่อน"],
    ["LiCl", "แดงเข้ม"],
    ["CaCl₂", "ส้มแดง"],
    ["SrCl₂", "แดงสด"],
    ["CuCl₂", "เขียวอมฟ้า"],
  ]) {
    await page
      .locator(".flame-sample-grid button")
      .filter({ has: page.locator("strong", { hasText: formula }) })
      .click();
    assert.match(await status.innerText(), /พร้อมทดลอง/);
    await page
      .getByRole("button", { name: "นำสารเข้าเปลวไฟ", exact: true })
      .click();
    await page.waitForFunction(
      () => document.querySelector(".flame-stage")?.dataset.phase === "result",
    );
    assert.ok((await status.innerText()).includes(color));
  }
  assert.equal(await page.locator(".flame-history-items > div").count(), 6);
  await page.screenshot({
    path: "/tmp/chemlab-flame-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "ทดลองซ้ำ", exact: true }).click();
  await page.getByRole("button", { name: "เริ่มใหม่", exact: true }).click();
  await page.waitForTimeout(2000);
  assert.match(await status.innerText(), /พร้อมทดลอง/);
  assert.equal(await page.locator(".flame-history-items > div").count(), 0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".flame-dance")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page
    .getByRole("button", { name: "นำสารเข้าเปลวไฟ", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelector(".flame-stage")?.dataset.phase === "result",
  );
  await page.screenshot({
    path: "/tmp/chemlab-flame-mobile.png",
    fullPage: true,
  });
  assert.equal(
    (await page.goto(base + "/read/electrons-periodic-table")).status(),
    200,
  );
  await page.goto(base + "/tools");
  await page.getByRole("link").filter({ hasText: "เริ่มทดลองจำลอง" }).click();
  await page.waitForURL("**/tools/flame-test");
  assert.deepEqual(errors, []);
  console.log(
    "Flame test: six sample results, comparison, reset cancellation, reduced motion, mobile, related article and discovery passed.",
  );
} finally {
  await browser.close();
}
