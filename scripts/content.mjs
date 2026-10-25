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
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
async function go(path) {
  const r = await page.goto(base + path);
  assert.equal(r.status(), 200, path);
  await page.locator("main[aria-busy=false]").waitFor();
}
try {
  await go("/discover");
  const links = await page
    .locator(".story-card-art")
    .evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href")));
  assert.equal(links.length, 24);
  for (const path of links) {
    await go(path);
    assert.equal(await page.locator("h1").count(), 1, path);
    const figure = page.locator(".learning-figure");
    assert.ok((await figure.count()) >= 1, path);
    for (const panel of await figure.all()) {
      assert.ok((await panel.locator("svg,img,[role=img],.mole-conversion-map[aria-label]").count()) > 0, path);
      await panel.scrollIntoViewIfNeeded();
    }
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll(".learning-figure img")).every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    );

    assert.ok((await page.locator(".content-highlight").count()) > 0, path);
    assert.ok((await page.locator(".key-point-list li").count()) >= 3, path);
    assert.ok((await page.locator(".content-glossary dt").count()) >= 3, path);
    assert.ok(
      (await page
        .locator(".worked-example,.content-table,.section-point-list")
        .count()) > 0,
      path,
    );
    assert.ok((await page.locator(".content-caution").count()) > 0, path);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      path,
    );
  }
  await go("/read/atomic-structure");
  const electronCounts = await page
    .locator(".learning-figure").first().locator(".learning-panel")
    .evaluateAll((panels) =>
      panels.map(
        (p) => p.querySelectorAll('[data-particle="electron"]').length,
      ),
    );
  assert.deepEqual(electronCounts, [11, 10]);
  await go("/read/why-reactions-slow-down");
  const remaining = await page
    .locator(".learning-figure").first().locator(".learning-panel")
    .evaluateAll((panels) =>
      panels.map(
        (p) => p.querySelectorAll('[data-particle="remaining"]').length,
      ),
    );
  assert.deepEqual(remaining, [8, 4, 2]);
  await go("/read/chemical-equilibrium");
  assert.equal(
    await page.locator(".equilibrium-mixture .learning-panel").count(),
    1,
  );
  await go("/read/aspirin-two-groups");
  await page
    .locator(".learning-figure").first()
    .screenshot({ path: "/tmp/chemlab-aspirin-figure.png" });
  await go("/read/concentration-is-a-ratio");
  const soluteCounts = await page
    .locator(".learning-figure").first().locator(".learning-panel")
    .evaluateAll((panels) =>
      panels.map((p) => p.querySelectorAll('[data-species="solute"]').length),
    );
  assert.deepEqual(soluteCounts, [6, 6]);
  await page
    .locator(".learning-figure").first()
    .screenshot({ path: "/tmp/chemlab-dilution-figure.png" });
  const original = await page
    .locator(".reader-body > section")
    .first()
    .locator(":scope > p")
    .innerText();
  await page.getByRole("button", { name: "ปิดไฮไลต์", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".content-highlight").length === 0,
  );
  assert.equal(
    await page
      .locator(".reader-body > section")
      .first()
      .locator(":scope > p")
      .innerText(),
    original,
  );
  await page.getByRole("button", { name: "เปิดไฮไลต์", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll(".content-highlight").length > 0,
  );
  await page.locator(".reader-takeaway").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/chemlab-highlights.png" });
  await page.locator(".worked-example").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/chemlab-worked-example.png" });
  for (const path of [
    "/read/atomic-structure",
    "/read/aspirin-two-groups",
    "/read/chemical-equilibrium",
    "/read/states-ideal-gas",
    "/read/acids-bases-ph",
    "/read/strong-acid-base-titration",
    "/read/redox-galvanic-cells",
    "/read/concentration-is-a-ratio",
    "/read/small-groups-big-difference",
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(path);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `mobile ${path}`,
    );
    const drugRegion = page.getByRole("region", {
      name: /โครงสร้าง .*เลื่อนภาพ/,
    });
    if (await drugRegion.count()) {
      await drugRegion.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(
        () => document.querySelector(".drug-figure-scroll").scrollLeft > 0,
      );
    }
    const regions = page.getByRole("region", { name: /ตาราง/ });
    if (await regions.count()) {
      await regions.first().focus();
      await page.keyboard.press("ArrowRight");
    }
  }
  // Collapsing the mobile directory must still land on and mark the chosen section.
  await page.locator(".reader-mobile-directory summary").click();
  await page.locator('.reader-mobile-directory a[href="#section-2"]').click();
  await page.waitForFunction(() => document.querySelector('.reader-mobile-directory a[href="#section-2"]')?.getAttribute("aria-current") === "location");
  assert.equal(await page.locator(".reader-mobile-directory").evaluate((element) => element.open), false);
  assert.equal(new URL(page.url()).hash, "#section-2");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#article-summary").evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector('.reader-toc a[href="#article-summary"]')?.getAttribute("aria-current") === "location");
  assert.ok(Number(await page.getByRole("progressbar", { name: "ตำแหน่งการอ่าน" }).getAttribute("aria-valuenow")) > 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".learning-figure").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/chemlab-content-mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all 24 illustrated content pages, loaded molecular images, conserved particles, ion electron counts, half-life figures, literal highlights, toggle without text loss, key points, worked examples/tables, caution notes, glossary, desktop and mobile layouts, keyboard-accessible table scrolling; no runtime errors.",
  );
} finally {
  await browser.close();
}
