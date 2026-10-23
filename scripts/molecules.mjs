import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(
    (process.env.TEST_BASE_URL || "http://127.0.0.1:3000") + "/explorer",
  );
  await page.locator("main[aria-busy=false]").waitFor();
  for (const [name, total, visible, highlight] of [
    ["แอลกอฮอล์", 9, 4, 2],
    ["กรดคาร์บอกซิลิก", 8, 5, 4],
    ["เอสเทอร์", 14, 6, 3],
    ["เอไมด์", 9, 6, 5],
  ]) {
    await page
      .locator(".tabs")
      .getByRole("button", { name: new RegExp(name) })
      .click();
    await page.waitForFunction(
      (n) => document.querySelectorAll(".diagram-atom").length === n,
      visible,
    );
    await page
      .getByRole("button", { name: "แสดง H ทุกอะตอม", exact: true })
      .click();
    await page.waitForFunction(
      (n) => document.querySelectorAll(".diagram-atom").length === n,
      total,
    );
    await page
      .getByRole("button", { name: "แสดง H ทุกอะตอม", exact: true })
      .click();
    await page
      .getByRole("button", { name: "ดูส่วนที่สำคัญ", exact: true })
      .click();
    assert.equal(await page.locator(".atom-halo").count(), highlight);
    await page.getByRole("button", { name: "ลองหาเอง", exact: true }).click();
    assert.equal(await page.locator(".atom-halo").count(), 0);
    await page.getByRole("button", { name: "คาร์บอน c1", exact: true }).click();
    await page
      .locator(".diagram-explanation")
      .getByText(/ลองอีกนิด/)
      .waitFor();
    await page
      .getByRole("button", { name: "ออกซิเจน o1", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await page.getByText("หาหมู่ฟังก์ชันเจอแล้ว!", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "ดูใหม่ทีละขั้น", exact: true })
      .click();
    assert.equal(
      await page
        .locator(".visual-steps button")
        .first()
        .getAttribute("aria-pressed"),
      "true",
    );
  }
  await page
    .locator(".tabs")
    .getByRole("button", { name: /กรดคาร์บอกซิลิก/ })
    .click();
  await page
    .getByRole("button", { name: "พันธะคู่ C กับ O", exact: true })
    .click();
  await page
    .locator(".diagram-explanation")
    .getByText(/อิเล็กตรอนร่วมพันธะ 2 คู่/)
    .waitFor();
  await page
    .getByRole("button", { name: "ดูส่วนที่สำคัญ", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("main > div")).opacity === "1",
  );
  await page.screenshot({ path: "/tmp/molecule-desktop.png", fullPage: true });
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `overflow ${width}`,
    );
    await page
      .getByRole("button", { name: "ออกซิเจน o1", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "ออกซิเจน o1", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    if (width === 390)
      await page.screenshot({
        path: "/tmp/molecule-mobile.png",
        fullPage: true,
      });
  }
  await page.getByRole("button", { name: "เริ่มใหม่", exact: true }).click();
  await page
    .locator(".molecule-stage-header")
    .getByText("เอทานอล (Ethanol)", { exact: true })
    .waitFor();
  assert.equal(
    await page
      .locator(".visual-steps button")
      .first()
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all four molecule diagrams, hydrogen visibility, group highlighting, correct/incorrect challenge, keyboard interaction, double-bond explanation, restart, and responsive layouts.",
  );
} finally {
  await browser.close();
}
