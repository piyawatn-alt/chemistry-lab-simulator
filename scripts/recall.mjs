import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH, args:["--no-sandbox"]});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const base=process.env.TEST_BASE_URL||"http://127.0.0.1:3000";
const errors=[];page.on("pageerror",error=>errors.push(error.message));
async function go(path){const response=await page.goto(base+path);assert.equal(response.status(),200,path);await page.locator("main[aria-busy=false]").waitFor();await page.locator("main h1").waitFor();}
try {
  await go("/");
  assert.equal(await page.locator('meta[name="author"]').getAttribute("content"),"ปิยวัฒน์ นิ่มน้อย");
  await page.locator(".clarity-creator").getByRole("heading",{name:"ปิยวัฒน์ นิ่มน้อย",exact:true}).waitFor();
  await go("/about");await page.locator(".about-creator").getByText("ปิยวัฒน์ นิ่มน้อย",{exact:true}).waitFor();
  assert.ok((await page.locator(".about-creator").innerText()).includes("โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย สตูล"));
  await go("/discover");const links=await page.locator(".story-card-art").evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")));assert.equal(links.length,24);
  let mnemonics=0,formulas=0;
  for(const link of links){
    await go(link);
    assert.equal(await page.locator(".reader-thinking-path li").count(),3,link);
    assert.ok((await page.locator("#chapter-overview").innerText()).length>100,link);
    const recall=page.locator("#memory-guide");assert.equal(await recall.count(),1);
    const count=await recall.locator(".recall-memory-card").count();assert.ok(count>=2,link);mnemonics+=count;
    formulas+=await recall.locator(".recall-formula-card").count();
    for(const card of await recall.locator(".recall-memory-card").all())assert.ok((await card.locator(".recall-boundary").innerText()).length>30);
    const example=recall.locator(".recall-worked-example").first();if(await example.count()){await example.locator("summary").click();assert.equal(await example.getAttribute("open"),"");assert.ok((await example.locator("ol li").count())>=2);}
    const idList=await page.locator("[id]").evaluateAll(nodes=>nodes.map(node=>node.id));assert.equal(new Set(idList).size,idList.length,link);
    assert.ok((await page.locator("footer .creator-credit").innerText()).includes("ปิยวัฒน์ นิ่มน้อย"));
  }
  assert.ok(formulas>=50);assert.ok(mnemonics>=48);
  await go("/formulas");assert.equal(await page.locator(".formula-library-result").count(),12);
  await page.getByRole("button",{name:/แสดงอีก/}).click();assert.equal(await page.locator(".formula-library-result").count(),24);
  await page.getByRole("button",{name:"คำช่วยจำ",exact:true}).click();assert.equal(await page.locator(".formula-library-result.result-formula").count(),0);
  await page.getByRole("textbox",{name:"ค้นหาสูตรและคำช่วยจำ"}).fill("แอโนด");
  await page.locator(".formula-library-result.result-memory").first().waitFor();assert.ok((await page.locator(".formula-library-grid").innerText()).includes("แอโนด"));
  assert.equal(new URL(page.url()).searchParams.get("q"),"แอโนด");
  await go("/formulas?type=formula&q=pH&grade=5");await page.locator(".formula-library-result.result-formula").first().waitFor();
  assert.equal(await page.locator('.formula-library-context a[href="/read/small-groups-big-difference"]').count(),0,"pH must not match the English word Phenol");
  await page.locator(".formula-library-source-link").first().click();await page.waitForURL(/\/read\/[^#]+#formula-/);await page.locator("main[aria-busy=false]").waitFor();
  const anchor=new URL(page.url()).hash;assert.ok(anchor.startsWith("#formula-"));await page.locator(anchor).waitFor();
  await go("/formulas?q=ไม่มีสูตรนี้แน่นอน987654");await page.getByRole("heading",{name:"ยังไม่พบสูตรหรือคำช่วยจำที่ตรงกัน"}).waitFor();
  await page.getByRole("button",{name:"ล้างตัวกรองทั้งหมด"}).click();await page.locator(".formula-library-result").first().waitFor();
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:950});
    for(const path of ["/","/formulas","/formulas?type=memory&subject=organic","/about","/read/acids-bases-ph","/read/mole-stoichiometry"]){await go(path);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}px overflow ${path}`);}
  }
  await go("/");await page.screenshot({path:"/tmp/chemlab-clarity-home.png",fullPage:true});
  await go("/formulas");await page.screenshot({path:"/tmp/chemlab-formula-library.png",fullPage:true});
  await page.setViewportSize({width:390,height:844});await go("/read/acids-bases-ph");await page.screenshot({path:"/tmp/chemlab-clarity-reader-mobile.png"});
  assert.deepEqual(errors,[]);console.log(`PASS: creator attribution,24 chapter overviews,${formulas} formula references,${mnemonics} bounded mnemonics,worked examples,unique anchors,shareable hub filters,source links,4 viewport widths and no runtime errors.`);
} finally {await browser.close();}
