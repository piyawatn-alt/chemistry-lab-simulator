import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  acceptDownloads: true,
});
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (/hydration|hydrated|server rendered/i.test(m.text()))
    errors.push(m.text());
});
async function go(path) {
  assert.equal((await page.goto(base + path)).status(), 200, path);
  await page.locator("main[aria-busy=false]").waitFor();
}
async function download(button) {
  const pending = page.waitForEvent("download");
  await button.click();
  return await pending;
}
try {
  await go("/journal");
  await page.getByText("ยังไม่มีผลจำลองที่กดบันทึก", { exact: true }).waitFor();
  assert.equal(await page.locator(".journal-reflections article").count(), 0);
  assert.ok(
    await page
      .getByRole("button", { name: "ส่งออกเอกสาร Markdown" })
      .isDisabled(),
  );
  await go("/");
  assert.equal(await page.locator("h1").count(), 1);
  await page
    .getByRole("link", { name: "สำรวจเคมีสู่เภสัช", exact: true })
    .click();
  await page.waitForURL("**/pharmacy");
  assert.equal(await page.locator(".pharma-drug").count(), 2);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".pharma-drug img")].every(
      (i) => i.complete && i.naturalWidth > 0,
    ),
  );
  await page.screenshot({
    path: "/tmp/chemlab-pharmacy-desktop.png",
    fullPage: true,
  });
  await go("/tools/ionization");
  assert.match(await page.getByTestId("ionized").innerText(), /50.00/);
  assert.match(await page.getByTestId("solubility").innerText(), /2.00/);
  await page.getByRole("button", { name: "pH = pKa + 1", exact: true }).click();
  assert.match(await page.getByTestId("ionized").innerText(), /90.91/);
  assert.match(await page.getByTestId("solubility").innerText(), /11.00/);
  await page.getByRole("button", { name: "เก็บผลในสมุดการเรียนรู้" }).click();
  await page.getByRole("button", { name: "เบสอ่อน B", exact: true }).click();
  assert.match(await page.getByTestId("ionized").innerText(), /9.09/);
  assert.match(await page.getByTestId("solubility").innerText(), /1.10/);
  await page.getByRole("button", { name: "เก็บผลในสมุดการเรียนรู้" }).click();
  const csv = await download(
    page.getByRole("button", { name: "ส่งออกข้อมูลกราฟ CSV" }),
  );
  const rows = readFileSync(await csv.path(), "utf8")
    .trim()
    .split("\n");
  assert.equal(rows.length, 58);
  assert.ok(
    rows.some((r) =>
      r.startsWith("4.5,4.5,base,50.000000,50.000000,2.0000000"),
    ),
  );
  await page.screenshot({
    path: "/tmp/chemlab-ionization-desktop.png",
    fullPage: true,
  });
  await go("/journal");
  assert.equal(await page.locator("tbody tr").count(), 2);
  assert.match(await page.locator("tbody").innerText(), /90.91%/);
  assert.match(await page.locator("tbody").innerText(), /9.09%/);
  await page
    .getByLabel("ชื่อผู้จัดทำ", { exact: true })
    .fill("ข้อมูลตัวอย่างสำหรับทดสอบระบบ");
  await page
    .getByLabel("บทบาทที่ฉันทำจริง", { exact: true })
    .fill("ทดสอบเปลี่ยนตัวแปรและตรวจตัวเลขบนหน้าจอ");
  await page
    .getByLabel("เครื่องมือและความช่วยเหลือที่ใช้", { exact: true })
    .fill("ทดสอบด้วย Playwright; ไม่ใช่ข้อมูลผู้ใช้จริง");
  await page
    .getByLabel("ชื่อประเด็นที่ศึกษา", { exact: true })
    .fill("เปรียบเทียบกรดกับเบสที่ pH เดียวกัน");
  await page
    .getByLabel("สิ่งที่สังเกตและข้อมูลที่ได้", { exact: true })
    .fill("ที่ pH 5.5 และ pKa 4.5 รูปไอออนของกรดอ่อน 90.91% ส่วนเบสอ่อน 9.09%");
  await page
    .getByLabel("ข้อจำกัดและสิ่งที่ยังสรุปไม่ได้", { exact: true })
    .fill("เป็นสารสมมติ ยังไม่บอกการดูดซึมของยา");
  await page
    .getByRole("button", { name: "บันทึกการเรียนรู้", exact: true })
    .click();
  assert.equal(await page.locator(".journal-reflections article").count(), 1);
  const md = await download(
    page.getByRole("button", { name: "ส่งออกเอกสาร Markdown" }),
  );
  const markdown = readFileSync(await md.path(), "utf8");
  assert.match(markdown, /90.91%/);
  assert.match(markdown, /Playwright/);
  assert.match(markdown, /ยังไม่บอกการดูดซึม/);
  const data = await download(
    page.getByRole("button", { name: "สำรองข้อมูล JSON" }),
  );
  const j = JSON.parse(readFileSync(await data.path(), "utf8"));
  assert.equal(j.snapshots.length, 2);
  assert.equal(j.reflections.length, 1);
  assert.equal(j.profile.name, "ข้อมูลตัวอย่างสำหรับทดสอบระบบ");
  await page.reload();
  await page.locator("main[aria-busy=false]").waitFor();
  await page.getByRole("button", { name: "แก้ไขบันทึก", exact: true }).click();
  await page
    .getByLabel("สิ่งที่สังเกตและข้อมูลที่ได้", { exact: true })
    .fill("แก้ไขบันทึก: สัดส่วนเปลี่ยนสวนทางกันเมื่อใช้ pKa ของคู่กรด");
  await page.getByRole("button", { name: "เก็บการแก้ไข", exact: true }).click();
  assert.equal(await page.locator(".journal-reflections article").count(), 1);
  assert.match(
    await page.locator(".journal-reflections article").innerText(),
    /แก้ไขบันทึก:/,
  );
  await page.emulateMedia({ media: "print" });
  assert.ok(await page.locator(".journal-profile-print").isVisible());
  assert.match(
    await page.locator(".journal-profile-print").innerText(),
    /ทดสอบเปลี่ยนตัวแปร/,
  );
  await page.pdf({
    path: "/tmp/chemlab-journal-test.pdf",
    format: "A4",
    printBackground: true,
  });
  assert.ok(statSync("/tmp/chemlab-journal-test.pdf").size > 5000);
  await page.emulateMedia({ media: "screen" });
  for (const path of ["/pharmacy", "/tools/ionization", "/journal"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(path);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path + " mobile overflow",
    );
    if (path === "/pharmacy")
      await page.screenshot({
        path: "/tmp/chemlab-pharmacy-mobile.png",
        fullPage: true,
      });
  }
  await page.getByRole("button", { name: "ลบบันทึก", exact: true }).click();
  assert.equal(await page.locator(".journal-reflections article").count(), 0);
  await page.getByLabel("นำเข้าข้อมูล JSON", { exact: true }).setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(j)),
  });
  await page.getByText(/นำเข้าข้อมูลแล้ว รวมบันทึก/).waitFor();
  assert.equal(await page.locator(".journal-reflections article").count(), 1);
  assert.equal(await page.locator("tbody tr").count(), 2);
  await page.getByLabel("นำเข้าข้อมูล JSON", { exact: true }).setInputFiles({
    name: "wrong.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await page.getByText(/นำเข้าไม่ได้:/).waitFor();
  assert.equal(await page.locator(".journal-reflections article").count(), 1);
  // Corrupt and blocked browser storage must not create evidence or block editing/export.
  const ctx = await browser.newContext();
  await ctx.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  const blocked = await ctx.newPage();
  await blocked.goto(base + "/journal");
  await blocked.locator(".journal-storage-alert").waitFor();
  await blocked
    .getByLabel("ชื่อประเด็นที่ศึกษา", { exact: true })
    .fill("ทดสอบเมื่อเบราว์เซอร์เก็บข้อมูลไม่ได้");
  await blocked
    .getByLabel("สิ่งที่สังเกตและข้อมูลที่ได้", { exact: true })
    .fill("ยังเขียนบันทึกและส่งออกจากหน้านี้ได้");
  await blocked
    .getByRole("button", { name: "บันทึกการเรียนรู้", exact: true })
    .click();
  assert.equal(
    await blocked.locator(".journal-reflections article").count(),
    1,
  );
  assert.ok(
    await blocked.getByRole("button", { name: "สำรองข้อมูล JSON" }).isEnabled(),
  );
  await ctx.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: chemistry-to-pharmacy hub, loaded structures, acid/base fractions, relative solubility, CSV, actual snapshot persistence, authored reflections/edit/delete, Markdown/JSON exports, printable attribution, PDF, three mobile routes and blocked storage; no runtime/hydration errors.",
  );
} catch (e) {
  console.log("Runtime errors:", errors);
  console.log(
    "Form labels:",
    await page.locator(".journal-reflection-form label").allTextContents(),
  );
  throw e;
} finally {
  await browser.close();
}
