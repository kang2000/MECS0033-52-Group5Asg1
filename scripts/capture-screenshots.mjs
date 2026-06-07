import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire("/Users/kang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/");
const { chromium } = require("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.resolve(here, "..");
const outDir = path.join(prototypeDir, "manual_screenshots");
const url = `file://${path.join(prototypeDir, "index.html")}`;

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

async function fresh() {
  await page.goto(url);
  await page.waitForLoadState("load");
  await page.waitForTimeout(250);
}

async function snap(name) {
  await page.locator(".stage").screenshot({ path: path.join(outDir, `${name}.png`) });
}

await fresh();
await snap("01-home-chat");

await fresh();
await page.getByRole("button", { name: "🕑 Next bus" }).click();
await page.waitForTimeout(350);
await snap("02-schedule-demo-time");

await fresh();
await page.getByRole("button", { name: "🧭 Route guidance" }).click();
await page.waitForTimeout(350);
await snap("03-route-guidance");

await fresh();
await page.getByRole("button", { name: "⏱️ Arrival" }).click();
await page.waitForTimeout(350);
await snap("04-arrival-simulated");

await fresh();
await page.getByRole("button", { name: "📍 Bus stop" }).click();
await page.waitForTimeout(350);
await snap("05-bus-stop-detail");

await fresh();
await page.getByRole("button", { name: /Staff Demo/ }).click();
await page.waitForTimeout(350);
await snap("06-admin-demo-time-control");

await page.locator('input[data-delay="route_a"]').evaluate(el => {
  el.checked = true;
  el.dispatchEvent(new Event("change", { bubbles: true }));
});
await page.waitForTimeout(350);
await page.evaluate(() => {
  document.querySelector(".demo-time").style.display = "none";
  document.getElementById("routeAdmin").style.display = "none";
  document.querySelector("#screen-admin .screen-help").style.display = "none";
  const proof = document.getElementById("proofBox");
  proof.style.overflow = "visible";
  proof.style.maxHeight = "none";
  document.getElementById("screen-admin").scrollTop = 0;
});
await page.waitForTimeout(150);
await snap("07-resolution-proof");
await page.evaluate(() => {
  document.querySelector(".tabbar").style.display = "none";
});
await page.locator("#proofBox").screenshot({ path: path.join(outDir, "07b-resolution-proof-box.png") });
await page.evaluate(() => {
  document.querySelector(".tabbar").style.display = "flex";
});

await page.getByRole("button", { name: /Alerts/ }).click();
await page.waitForTimeout(350);
await snap("08-alerts-after-proof");

await fresh();
await page.getByRole("button", { name: /Feedback/ }).click();
await page.locator("#fbText").fill("Bus did not arrive at CP during the morning demo.");
page.once("dialog", dialog => dialog.accept());
await page.getByRole("button", { name: "Submit report" }).click();
await page.waitForTimeout(350);
await snap("09-feedback-log");

await browser.close();

const files = (await fs.readdir(outDir)).filter(file => file.endsWith(".png")).sort();
console.log(JSON.stringify({ outDir, files }, null, 2));
