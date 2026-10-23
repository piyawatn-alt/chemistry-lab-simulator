import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
async function go(path) {
  const r = await page.goto(base + path);
  assert.equal(r.status(), 200, path);
  await page.locator("main[aria-busy=false]").waitFor();
  await page.locator("h1").waitFor();
}
try {
  await go("/");
  assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
  assert.ok(!(await page.locator("nav").innerText()).includes("บทเรียน"));
  await page.screenshot({
    path: "/tmp/chemlab-knowledge-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("textbox", { name: "ค้นหาเรื่องที่สงสัย" })
    .fill("แอสไพริน");
  await page
    .locator(".journal-search-results")
    .getByRole("link")
    .first()
    .click();
  await page
    .getByRole("heading", {
      name: "แอสไพรินหนึ่งโมเลกุล มีอะไรให้เคมีเล่าบ้าง?",
      exact: true,
    })
    .waitFor();
  await page.waitForFunction(() => document.title.includes("แอสไพริน"));
  assert.ok((await page.title()).includes("แอสไพริน"));
  await page
    .locator(".reader-meta")
    .getByRole("button", { name: "เก็บไว้อ่าน", exact: true })
    .click();
  await page.reload();
  await page.locator("main[aria-busy=false]").waitFor();
  await page
    .getByRole("button", { name: "บันทึกไว้อ่านแล้ว", exact: true })
    .waitFor();
  await go("/saved");
  assert.equal(await page.locator(".story-card").count(), 1);
  await page.getByRole("button", { name: /นำออกจากรายการอ่าน:/ }).click();
  await page
    .getByText("ชั้นหนังสือเล็ก ๆ ยังว่างอยู่", { exact: true })
    .waitFor();
  await go("/discover");
  assert.equal(await page.locator(".story-card").count(), 8);
  await page
    .getByRole("button", { name: "เคมีกับเภสัชศาสตร์", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelectorAll(".story-card").length === 2,
  );
  await page
    .getByRole("textbox", { name: "ค้นหาในคลังความรู้" })
    .fill("ไม่มีเรื่องนี้แน่นอน");
  await page
    .getByRole("heading", { name: "ยังไม่พบเรื่องนี้ในคลัง" })
    .waitFor();
  await page.getByRole("button", { name: "กลับไปดูทุกเรื่อง" }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".story-card").length === 8,
  );
  await go("/read/why-reactions-slow-down");
  await page.locator(".reader-tool-invite a").click();
  await page
    .getByRole("heading", { level: 1, name: "ค่อย ๆ เปลี่ยนไป มากแค่ไหน?" })
    .waitFor();
  const before = await page.locator(".result-line").innerText();
  await page.getByRole("slider", { name: "ค่าคงที่อัตรา" }).focus();
  await page.keyboard.press("ArrowRight");
  assert.notEqual(await page.locator(".result-line").innerText(), before);
  await page.getByRole("button", { name: "คืนค่าเริ่มต้น" }).click();
  assert.equal(await page.locator(".result-line").innerText(), before);
  const routes = [
    "/",
    "/discover",
    "/saved",
    "/tools",
    "/explorer",
    "/tools/kinetics",
    "/about",
    "/topics/medicine",
    "/topics/everyday",
    "/read/small-groups-big-difference",
    "/read/aspirin-two-groups",
    "/read/paracetamol-chemistry",
  ];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of routes) {
      await go(path);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${width} overflow ${path}`,
      );
    }
  }
  await go("/");
  await page.getByRole("button", { name: "เปิดเมนู" }).click();
  await page
    .locator("nav")
    .getByRole("link", { name: "สำรวจความรู้", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "ตามความสงสัยของคุณไป", exact: true })
    .waitFor();
  await go("/");
  await page.screenshot({
    path: "/tmp/chemlab-knowledge-mobile.png",
    fullPage: true,
  });
  await go("/lessons/organic");
  assert.ok(page.url().endsWith("/read/small-groups-big-difference"));
  await go("/labs");
  assert.ok(page.url().endsWith("/tools"));
  await go("/quizzes");
  assert.ok(page.url().endsWith("/discover"));
  await go("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "chemlab-rx:progress:v1",
      '{"completed":["organic"],"scores":{"organic":100}}',
    ),
  );
  await page.reload();
  await page.locator("main[aria-busy=false]").waitFor();
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("chemlab-rx:progress:v1")).scores
          .organic,
    ),
    100,
  );
  await page.evaluate(() =>
    localStorage.setItem("chemlab-rx:reading-list:v1", "broken json"),
  );
  await go("/saved");
  await page
    .getByText("ชั้นหนังสือเล็ก ๆ ยังว่างอยู่", { exact: true })
    .waitFor();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked");
    };
  });
  await go("/read/small-groups-big-difference");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked");
    };
  });
  await page.getByRole("button", { name: "เก็บไว้อ่าน", exact: true }).click();
  await page
    .getByRole("alert")
    .getByText(/บันทึกไว้ในเครื่องไม่ได้/)
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: knowledge navigation, search/filter/empty state, article metadata, saved reading persistence/removal, tools, mobile navigation, 24 responsive route checks, legacy redirects, preserved old data, corrupt/blocked storage; no runtime errors.",
  );
} finally {
  await browser.close();
}
