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

function stamp() {
  return new Date().toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "-");
}

const { chromium } = loadPlaywright();

const here = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.resolve(here, "..");
const outputDir = path.join(prototypeDir, "output", "playwright");
const runStamp = process.env.TRANSITAI_VIDEO_STAMP || stamp();
const baseName = process.env.TRANSITAI_VIDEO_BASENAME || `transitai-staff-report-demo-${runStamp}`;
const rawDir = path.join(outputDir, `raw-${baseName}`);
const finalVideo = path.join(outputDir, `${baseName}.webm`);
const notesFile = path.join(outputDir, `${baseName}-shot-list.txt`);
const finalFrame = path.join(outputDir, `${baseName}-final-frame.png`);
const appUrl = `file://${path.join(prototypeDir, "index.html")}`;

const VIEWPORT = { width: 1280, height: 900 };
const chromeExecutable = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WAIT_SCALE = Number(process.env.TRANSITAI_VIDEO_WAIT_SCALE || 0.62);
const TYPE_DELAY_MS = Number(process.env.TRANSITAI_VIDEO_TYPE_DELAY_MS || 92);

const shotList = [
  "Home screen and phone-style prototype frame.",
  "Chat: typed schedule question and grounded response.",
  "Timetable: search FKE and open the full-day route timetable.",
  "Feedback: submit a passenger report.",
  "Staff Demo: show the submitted report in Reported issues.",
  "Staff Demo: toggle BAS A delay and show the resolution proof trace.",
  "Alerts: show the subscribed route alert with scheduled and estimated ETA."
];

await fs.mkdir(outputDir, { recursive: true });
await fs.rm(rawDir, { recursive: true, force: true });
await fs.mkdir(rawDir, { recursive: true });
await fs.writeFile(notesFile, shotList.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n");

try {
  await fs.access(finalVideo);
  throw new Error(`Refusing to overwrite existing video: ${finalVideo}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const launchOptions = { headless: true };
try {
  await fs.access(chromeExecutable);
  launchOptions.executablePath = chromeExecutable;
} catch {
  // Use Playwright's bundled Chromium when available.
}

const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  recordVideo: {
    dir: rawDir,
    size: VIEWPORT
  }
});

const page = await context.newPage();
page.setDefaultTimeout(15000);
const wait = ms => page.waitForTimeout(Math.round(ms * WAIT_SCALE));

function activeScreenSelector(id) {
  return `#${id}.screen.is-active`;
}

async function installRecordingHelpers() {
  await page.addStyleTag({
    content: `
      .recording-caption {
        position: fixed;
        left: 24px;
        top: 48px;
        z-index: 99999;
        max-width: 380px;
        padding: 12px 14px;
        border-radius: 10px;
        color: #111827;
        background: rgba(255,255,255,.95);
        border: 2px solid #7a0c2e;
        box-shadow: 0 12px 28px rgba(15,23,42,.18);
        font: 750 15px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .recording-highlight {
        outline: 4px solid #c60000 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 8px rgba(198,0,0,.18) !important;
      }
    `
  });
  await page.evaluate(() => {
    const caption = document.createElement("div");
    caption.id = "recordingCaption";
    caption.className = "recording-caption";
    caption.textContent = "TransitAI UTM prototype demo";
    document.body.appendChild(caption);
  });
}

async function caption(text, ms = 1500) {
  console.log(`SHOT: ${text}`);
  await page.evaluate(value => {
    const el = document.getElementById("recordingCaption");
    if (el) el.textContent = value;
  }, text);
  await wait(ms);
}

async function highlight(locator, ms = 450) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate(el => el.classList.add("recording-highlight"));
  await wait(ms);
  await locator.evaluate(el => el.classList.remove("recording-highlight"));
}

async function clickCue(locator, waitMs = 760) {
  await highlight(locator);
  await locator.click();
  await wait(waitMs);
}

async function typeHuman(locator, text) {
  await highlight(locator, 300);
  await locator.click();
  await locator.fill("");
  await page.keyboard.type(text, { delay: TYPE_DELAY_MS });
}

async function typeAndSend(text) {
  const input = page.locator("#chatInput");
  await typeHuman(input, text);
  await wait(260);
  await clickCue(page.locator('#chatForm button[type="submit"]'), 1000);
  await page.locator("#thread").evaluate(el => { el.scrollTop = el.scrollHeight; });
}

async function openTab(screenId, waitMs = 760) {
  await clickCue(page.locator(`.tab[data-screen="${screenId}"]`), waitMs);
  await page.locator(activeScreenSelector(screenId)).waitFor();
}

async function setDelay(routeId, checked) {
  const toggle = page.locator(`input[data-delay="${routeId}"]`);
  await toggle.scrollIntoViewIfNeeded();
  const current = await toggle.isChecked();
  if (current === checked) return;
  await highlight(toggle.locator("xpath=ancestor::label[contains(@class, 'switch')]"), 420);
  await toggle.evaluate((el, value) => {
    el.checked = value;
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, checked);
  await wait(950);
}

async function scrollActiveScreen(screenId, positions, pauseMs = 850) {
  for (const top of positions) {
    await page.locator(`#${screenId}`).evaluate((el, y) => { el.scrollTop = y; }, top);
    await wait(pauseMs);
  }
}

try {
  await page.goto(appUrl);
  await page.waitForLoadState("load");
  await installRecordingHelpers();
  await wait(500);

  await caption("1. Home: TransitAI UTM mobile prototype and main actions.", 1500);

  await caption("2. Chat: type a real schedule question and see a grounded answer.", 1350);
  await openTab("screen-chat", 800);
  await typeAndSend("When is the next bus to FKE?");
  await caption("The answer includes schedule, ETA logic, and a data-source note.", 1900);

  await caption("3. Timetable: search a stop/faculty and open the full-day route.", 1350);
  await openTab("screen-timetable", 760);
  await typeHuman(page.locator("#timetableSearch"), "FKE");
  await wait(850);
  await clickCue(page.locator('button[data-route-timetable="route_g"]'), 760);
  await page.locator(activeScreenSelector("screen-route-timetable")).waitFor();
  await caption("Full-day timetable shows morning, afternoon, and evening departures.", 1600);
  await scrollActiveScreen("screen-route-timetable", [0, 320, 650], 800);

  await caption("4. Feedback: submit a passenger report before opening Staff Demo.", 1400);
  await openTab("screen-home", 650);
  await clickCue(page.locator('.home-card[data-screen="screen-feedback"]'), 760);
  await page.locator(activeScreenSelector("screen-feedback")).waitFor();
  await page.locator("#fbType").selectOption("Bus did not arrive");
  await typeHuman(page.locator("#fbText"), "Bus did not arrive at CP during the morning class demo.");
  page.once("dialog", dialog => dialog.accept());
  await clickCue(page.getByRole("button", { name: "Submit report" }), 860);
  await page.locator(".fb-item").first().waitFor();
  await caption("The issue is logged for transport staff follow-up.", 1300);

  await caption("5. Staff Demo: the submitted report appears in Reported issues.", 1500);
  await openTab("screen-admin", 760);
  await page.locator("#staffIssueList").getByText("Bus did not arrive at CP").waitFor();
  await highlight(page.locator(".staff-issues-card"), 850);
  await caption("Staff can see the report type, priority, time, and details.", 1800);

  await caption("6. Staff Demo: mark BAS A delayed to run the proof engine.", 1400);
  await setDelay("route_a", true);
  await page.locator("#proofBox").getByText("NotifyUser(ali, route_a, delay)", { exact: true }).first().waitFor();
  await caption("The proof derives NotifyUser(ali, route_a, delay).", 1900);
  await scrollActiveScreen("screen-admin", [0, 520, 920], 900);

  await caption("7. Alerts: the subscribed route now shows scheduled and estimated ETA.", 1400);
  await openTab("screen-alerts", 760);
  await page.locator("#alertList").getByText("Estimated ETA").waitFor();
  await highlight(page.locator(".alert-active"), 750);
  await caption("Demo complete: report visible in Staff Demo, proof trace, and ETA alert.", 2100);
  await page.locator(".phone").screenshot({ path: finalFrame });

  const video = page.video();
  await context.close();
  const rawVideo = await video.path();
  await fs.copyFile(rawVideo, finalVideo);
  await fs.rm(rawDir, { recursive: true, force: true });
  await browser.close();

  const stat = await fs.stat(finalVideo);
  console.log(JSON.stringify({
    video: finalVideo,
    notes: notesFile,
    finalFrame,
    bytes: stat.size
  }, null, 2));
} catch (error) {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
  throw error;
}
