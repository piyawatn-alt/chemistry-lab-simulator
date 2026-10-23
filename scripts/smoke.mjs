import { chromium } from "playwright";
import assert from "node:assert/strict";

// Start npm run dev (or npm start after building) before running this script.
// CHROMIUM_PATH can point to a system Chromium; otherwise install via npx playwright install chromium.
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  headless: true,
  args: ["--no-sandbox"],
});
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const go = async (path) => {
  const r = await page.goto(base + path);
  assert.equal(r.status(), 200);
  await page.locator("main[aria-busy=false]").waitFor();
  await page.locator("h1").waitFor();
};
const progress = () =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("chemlab-rx:progress:v1")),
  );
try {
  await go("/");
  assert.equal(
    await page.locator(".stat-card strong").first().innerText(),
    "0 / 6 บทเรียน",
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("main > div")).opacity === "1",
  );
  await page.screenshot({ path: "/tmp/chemlab-desktop.png", fullPage: true });
  await page.getByRole("link", { name: "เริ่มเรียนเลย", exact: true }).click();
  await page.getByRole("button", { name: "ม.5", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".course-card").length === 2,
  );
  assert.equal(await page.locator(".course-card").count(), 2);
  await page
    .getByRole("textbox", { name: "ค้นหาบทเรียน" })
    .fill("หมู่ฟังก์ชัน");
  await page.locator(".search-results a").click();
  await page
    .getByRole("heading", { name: "รู้จักหมู่ฟังก์ชัน", exact: true })
    .first()
    .waitFor();
  await page.getByRole("button", { name: "ไปฝึกด้วยกัน" }).click();
  assert.equal(
    await page.getByRole("button", { name: "ไปทดลองอิสระ" }).isDisabled(),
    true,
  );
  await page.locator("details summary").click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "ไปทดลองอิสระ" }).click();
  await page.getByRole("button", { name: /กรดคาร์บอกซิลิก/ }).click();
  await page.getByRole("button", { name: "ตรวจสอบความเข้าใจ" }).click();
  await page.getByRole("radio").nth(0).check();
  await page.getByRole("button", { name: "ตรวจคำตอบ" }).click();
  await page.getByText("ยังไม่ถูก ลองทบทวนอีกนิด", { exact: true }).waitFor();
  assert.equal((await progress()).scores.organic, 0);
  await page.getByRole("button", { name: "ลองอีกครั้ง" }).click();
  await page.getByRole("radio").nth(2).check();
  await page.getByRole("button", { name: "ตรวจคำตอบ" }).click();
  await page
    .getByText("ถูกต้อง! เข้าใจเพิ่มขึ้นอีกขั้นแล้ว", { exact: true })
    .waitFor();
  assert.equal((await progress()).scores.organic, 100);
  assert.ok((await progress()).completed.includes("organic"));
  await page.reload();
  await page.locator("main[aria-busy=false]").waitFor();
  await page.locator("h1").waitFor();
  assert.equal((await progress()).scores.organic, 100);
  await go("/progress");
  await page.getByText("เรียนจบแล้ว", { exact: true }).last().waitFor();
  await go("/explorer");
  for (const label of ["แอลกอฮอล์", "กรดคาร์บอกซิลิก", "เอสเทอร์", "เอไมด์"])
    await page.getByRole("button", { name: new RegExp(label) }).click();
  assert.equal((await progress()).explored.length, 4);
  await go("/lessons/kinetics");
  await page.locator(".lesson-steps button").nth(2).click();
  const before = await page.locator(".result-line").innerText();
  await page.getByRole("slider", { name: "ค่าคงที่อัตรา" }).focus();
  await page.keyboard.press("ArrowRight");
  assert.notEqual(await page.locator(".result-line").innerText(), before);
  await page.getByRole("button", { name: "คืนค่าเริ่มต้น" }).click();
  assert.equal(await page.locator(".result-line").innerText(), before);
  for (const route of [
    "/",
    "/lessons",
    "/labs",
    "/quizzes",
    "/progress",
    "/builder",
    "/drugs",
    "/about",
    "/lessons/moles",
    "/explorer",
  ]) {
    await go(route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Desktop overflow: ${route}`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go("/");
  await page.getByRole("button", { name: "เปิดเมนู" }).click();
  await page
    .locator("nav")
    .getByRole("link", { name: "บทเรียน", exact: true })
    .click();
  await page.getByRole("button", { name: "ม.6", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".course-card").length === 2,
  );
  assert.equal(await page.locator(".course-card").count(), 2);
  for (const route of [
    "/",
    "/lessons",
    "/labs",
    "/quizzes",
    "/progress",
    "/builder",
    "/drugs",
    "/about",
    "/lessons/organic",
    "/explorer",
  ]) {
    await go(route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Mobile overflow: ${route}`,
    );
  }
  await go("/");
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("main > div")).opacity === "1",
  );
  await page.screenshot({ path: "/tmp/chemlab-mobile.png", fullPage: true });
  await go("/progress");
  await page.getByRole("button", { name: "ล้างความก้าวหน้า" }).click();
  await page.getByRole("button", { name: "ยกเลิก", exact: true }).click();
  assert.equal((await progress()).scores.organic, 100);
  await page.getByRole("button", { name: "ล้างความก้าวหน้า" }).click();
  await page.getByRole("button", { name: "ยืนยันลบความก้าวหน้า" }).click();
  assert.deepEqual((await progress()).completed, []);
  await page.reload();
  await page
    .getByText(
      "ยังไม่มีกิจกรรม เริ่มบทเรียนแรก แล้วกลับมาดูเส้นทางของคุณที่นี่",
      { exact: true },
    )
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: search, grade filtering, guided flow, wrong/correct quiz, reload persistence, explorer tracking, live graph/reset, 20 route/viewport checks, mobile navigation, confirmed progress reset; no runtime errors.",
  );
} finally {
  await browser.close();
}
