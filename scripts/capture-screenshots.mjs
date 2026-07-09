import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try {
    return localRequire("playwright");
  } catch {
    const searchPaths = (process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean);
    for (const moduleDir of searchPaths) {
      try {
        return createRequire(path.join(moduleDir, "package.json"))("playwright");
      } catch {
        // Continue searching configured module paths.
      }
    }
    throw new Error("Playwright is required. Install it locally or set NODE_PATH to a directory containing Playwright.");
  }
}

const { chromium } = loadPlaywright();

const here = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.resolve(here, "..");
const outDir = path.join(prototypeDir, "manual_screenshots");
const url = `file://${path.join(prototypeDir, "index.html")}`;

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1
});

async function fresh() {
  await page.goto(url);
  await page.waitForLoadState("load");
  await page.waitForSelector(".stage");
  await page.waitForTimeout(300);
}

async function show(screenId) {
  await page.evaluate(id => window.App.showScreen(id), screenId);
  await page.waitForTimeout(250);
}

async function snap(name) {
  await page.locator(".stage").screenshot({ path: path.join(outDir, `${name}.png`) });
}

async function setDelay(routeId, checked = true) {
  await show("screen-admin");
  await page.locator(`input[data-delay="${routeId}"]`).evaluate((el, on) => {
    el.checked = on;
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, checked);
  await page.waitForTimeout(350);
}

await fresh();
await snap("01-home-overview");

await fresh();
await show("screen-chat");
await page.locator('.qa[data-q="When is the next bus to FKE?"]').click();
await page.waitForTimeout(450);
await snap("02-chat-schedule");

await fresh();
await show("screen-timetable");
await page.locator("#timetableSearch").fill("FKE");
await page.waitForTimeout(350);
await snap("03-timetable-search");

await page.locator('[data-route-timetable="route_g"]').click();
await page.waitForTimeout(350);
await snap("04-route-timetable-detail");
await page.locator("#screen-route-timetable").evaluate(el => { el.scrollTop = 455; });
await page.waitForTimeout(250);
await snap("04b-route-timetable-times");

await fresh();
await show("screen-chat");
await page.locator('.qa[data-q="How do I get from KTDI to P19 FKE?"]').click();
await page.waitForTimeout(450);
await snap("05-route-guidance");

await fresh();
await show("screen-chat");
await page.locator('.qa[data-q="Where is the FC bus stop?"]').click();
await page.waitForTimeout(450);
await snap("06-bus-stop-detail");

await fresh();
await setDelay("route_g", true);
await show("screen-alerts");
await snap("07-alerts-subscription-filter");

await fresh();
await setDelay("route_a", true);
await show("screen-alerts");
await snap("08-alerts-after-proof");

await fresh();
await show("screen-feedback");
await page.locator("#fbType").selectOption({ label: "Bus did not arrive" });
await page.locator("#fbText").fill("Bus did not arrive at CP during the morning class demo.");
page.once("dialog", dialog => dialog.accept());
await page.getByRole("button", { name: "Submit report" }).click();
await page.waitForTimeout(350);
await snap("09-feedback-submission");

await show("screen-admin");
await page.locator("#screen-admin").evaluate(el => { el.scrollTop = 0; });
await page.waitForTimeout(250);
await snap("10-staff-report-feed");

await setDelay("route_a", true);
await page.locator("#proofBox").evaluate(el => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(250);
await snap("11-resolution-proof");
await page.locator("#proofBox").screenshot({ path: path.join(outDir, "11b-resolution-proof-box.png") });

await browser.close();

const files = (await fs.readdir(outDir)).filter(file => file.endsWith(".png")).sort();
console.log(JSON.stringify({ outDir, files }, null, 2));
