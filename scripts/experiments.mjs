import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  reducedMotion: "reduce",
});
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (/hydration|hydrated|server rendered|didn.t match/i.test(m.text()))
    errors.push(m.text());
});
const ids = [
  "neutralization",
  "diffusion",
  "conductivity",
  "precipitation",
  "gas-pressure",
  "temperature-rate",
];
async function go(path) {
  assert.equal((await page.goto(base + path)).status(), 200, path);
  await page.locator("main[aria-busy=false]").waitFor();
  await page.locator("h1").waitFor();
}
async function play() {
  await page.getByRole("button", { name: "เริ่มทดลอง", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "เสร็จแล้ว" }).waitFor();
}
async function slider(value) {
  await page.getByRole("slider").fill(String(value));
}
function metrics() {
  return page.locator(".experiment-metrics");
}
async function save() {
  await page.getByRole("button", { name: "บันทึกผลเปรียบเทียบ" }).click();
}
try {
  await go("/tools/experiments");
  assert.equal(await page.locator(".experiment-card").count(), 8);
  await page.screenshot({
    path: "/tmp/chemlab-experiments-gallery.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: /ผสมกรด–เบสและดูสี pH/ }).click();
  await page.waitForURL("**/tools/neutralization");
  await play();
  assert.match(await metrics().innerText(), /pH 7.00/);
  await save();
  await slider(30);
  await play();
  assert.match(await metrics().innerText(), /pH 12.30/);
  await save();
  assert.equal(
    await page.locator(".experiment-records > div > div").count(),
    2,
  );
  await slider(0);
  await play();
  assert.match(await metrics().innerText(), /pH 1.00/);
  await page.getByRole("button", { name: "เริ่มใหม่", exact: true }).click();
  assert.equal(await page.locator(".experiment-records").count(), 0);
  await page.screenshot({
    path: "/tmp/chemlab-neutralization.png",
    fullPage: true,
  });
  await go("/tools/conductivity");
  await play();
  assert.match(await metrics().innerText(), /100.00/);
  await page.getByRole("combobox").selectOption("sugar");
  await play();
  assert.match(await metrics().innerText(), /ดัชนีไอออน 0.00/);
  await page.getByRole("combobox").selectOption("acid");
  await play();
  assert.match(await metrics().innerText(), /ดัชนีไอออน 1.33/);
  assert.equal(await page.locator(".experiment-ion-label").count(), 2);
  await go("/tools/precipitation");
  await slider(40);
  await play();
  assert.match(await metrics().innerText(), /AgCl 0.287 g/);
  assert.match(await metrics().innerText(), /0.00 mmol/);
  await page.getByRole("combobox").selectOption("nitrate");
  await play();
  assert.match(await metrics().innerText(), /AgCl 0.000 g/);
  await go("/tools/gas-pressure");
  await play();
  assert.match(await metrics().innerText(), /V 0.612 L/);
  assert.match(await metrics().innerText(), /2.00 atm/);
  await slider(0.5);
  await play();
  assert.match(await metrics().innerText(), /V 2.447 L/);
  await go("/tools/diffusion");
  assert.equal(
    await page.locator(".experiment-scene .experiment-jitter").count(),
    48,
  );
  await slider(55);
  await play();
  assert.equal(
    await page.locator(".experiment-scene .experiment-jitter").count(),
    48,
  );
  await go("/tools/temperature-rate");
  await play();
  assert.match(await metrics().innerText(), /0.0301 mol\/L/);
  await slider(55);
  await play();
  assert.match(await metrics().innerText(), /0.0002 mol\/L/);
  await page.screenshot({
    path: "/tmp/chemlab-temperature-rate.png",
    fullPage: true,
  });
  // Real playback must stop on pause and resume; changing controls cancels the run.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page
    .locator(".experiment-playback p")
    .filter({ hasText: "ภาพแสดงแบบเร่งเวลา" })
    .waitFor();
  await page.getByRole("button", { name: "ทดลองซ้ำ", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector("progress")?.value > 0.03,
  );
  await page.getByRole("button", { name: "หยุดชั่วคราว", exact: true }).click();
  const paused = await page.locator("progress").getAttribute("value");
  await page.waitForTimeout(200);
  assert.equal(await page.locator("progress").getAttribute("value"), paused);
  await page.getByRole("button", { name: "เล่นต่อ", exact: true }).click();
  await page.waitForFunction(
    (p) => document.querySelector("progress")?.value > Number(p),
    paused,
  );
  await slider(15);
  assert.equal(await page.locator("progress").getAttribute("value"), "0");
  await page.waitForTimeout(150);
  assert.equal(await page.locator("progress").getAttribute("value"), "0");
  await page.getByRole("button", { name: "เริ่มทดลอง", exact: true }).click();
  await page.getByRole("link", { name: /ผสมกรด–เบส/ }).click();
  await page.waitForURL("**/tools/neutralization");
  assert.equal(await page.locator("progress").getAttribute("value"), "0");
  // Every route, related article and narrow-screen scene must remain usable.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of ids) {
    await go("/tools/" + id);
    assert.ok((await page.title()).includes("ChemLab RX"));
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      id + " mobile overflow",
    );
    await play();
    const related = await page.locator(".tool-related a").getAttribute("href");
    assert.equal(
      (await page.request.get(base + related)).status(),
      200,
      related,
    );
  }
  await page.screenshot({
    path: "/tmp/chemlab-experiment-mobile.png",
    fullPage: true,
  });
  await go("/tools/experiments");
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "/tmp/chemlab-experiments-gallery-mobile.png",
    fullPage: true,
  });
  await go("/tools");
  assert.equal(await page.locator(".experiment-card").count(), 8);
  assert.equal(
    (await page.request.get(base + "/tools/not-an-experiment")).status(),
    404,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: six experiments, numerical outcomes, sample choices, comparison, reset, real play/pause/resume, control cancellation, route cleanup, reduced motion, all mobile routes, article links and gallery; no runtime errors.",
  );
} finally {
  await browser.close();
}
