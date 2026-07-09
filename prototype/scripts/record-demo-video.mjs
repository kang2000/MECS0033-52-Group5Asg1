import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try {
    return localRequire("playwright");
  } catch {
    const runtimeRequire = createRequire("/Users/kang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/");
    return runtimeRequire("playwright");
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
const defaultBaseName = "transitai-full-demo";
const runStamp = process.env.TRANSITAI_VIDEO_STAMP || stamp();
const baseName = process.env.TRANSITAI_VIDEO_BASENAME || defaultBaseName;
const rawDir = path.join(outputDir, `raw-${baseName}`);
const finalVideo = path.join(outputDir, `${baseName}.webm`);
const notesFile = path.join(outputDir, `${baseName}-shot-list.txt`);
const finalFrame = path.join(outputDir, `${baseName}-final-frame.png`);
const appUrl = `file://${path.join(prototypeDir, "index.html")}`;

const VIEWPORT = { width: 1280, height: 900 };
const chromeExecutable = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WAIT_SCALE = Number(process.env.TRANSITAI_VIDEO_WAIT_SCALE || 1);
const TYPE_DELAY_MS = Number(process.env.TRANSITAI_VIDEO_TYPE_DELAY_MS || 75);

const shotList = [
  "Home: phone frame, status time, generated bus image, and main cards.",
  "Chat: schedule question, route guidance, follow-up with conversation memory.",
  "Arrival and stop detail: ETA card, source note, and bus stop screen.",
  "Timetable: search FKE and open the full-day route timetable.",
  "Alerts: delay on an unsubscribed route stays hidden, then appears after subscription.",
  "Feedback: submit an issue report.",
  "Staff Demo: show the submitted report, BAS A delay, and resolution proof trace.",
  "Alerts: subscribed BAS A delay shows scheduled and estimated times."
];

await fs.rm(rawDir, { recursive: true, force: true });
await fs.mkdir(rawDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(notesFile, shotList.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n");

if (baseName !== defaultBaseName) {
  try {
    await fs.access(finalVideo);
    throw new Error(`Refusing to overwrite existing video: ${finalVideo}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const launchOptions = {
  headless: true
};
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
        max-width: 360px;
        padding: 12px 14px;
        border-radius: 10px;
        color: #111827;
        background: rgba(255,255,255,.94);
        border: 2px solid #7a0c2e;
        box-shadow: 0 12px 28px rgba(15,23,42,.18);
        font: 700 15px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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

async function caption(text, ms = 1800) {
  console.log(`SHOT: ${text}`);
  await page.evaluate(value => {
    const el = document.getElementById("recordingCaption");
    if (el) el.textContent = value;
  }, text);
  await wait(ms);
}

async function highlight(locator, ms = 500) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate(el => el.classList.add("recording-highlight"));
  await wait(ms);
  await locator.evaluate(el => el.classList.remove("recording-highlight"));
}

async function clickCue(locator, waitMs = 900) {
  await highlight(locator);
  await locator.click();
  await wait(waitMs);
}

async function typeAndSend(text) {
  const input = page.locator("#chatInput");
  await highlight(input, 350);
  await input.click();
  await input.fill("");
  await page.keyboard.type(text, { delay: TYPE_DELAY_MS });
  await wait(450);
  await clickCue(page.locator('#chatForm button[type="submit"]'), 1400);
  await page.locator("#thread").evaluate(el => { el.scrollTop = el.scrollHeight; });
}

async function openTab(screenId, waitMs = 900) {
  await clickCue(page.locator(`.tab[data-screen="${screenId}"]`), waitMs);
  await page.locator(activeScreenSelector(screenId)).waitFor();
}

async function setDelay(routeId, checked) {
  const toggle = page.locator(`input[data-delay="${routeId}"]`);
  await toggle.scrollIntoViewIfNeeded();
  const current = await toggle.isChecked();
  if (current === checked) return;
  await highlight(toggle.locator("xpath=ancestor::label[contains(@class, 'switch')]"), 450);
  await toggle.evaluate((el, value) => {
    el.checked = value;
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, checked);
  await wait(1200);
}

async function setDemoTime10() {
  await page.locator("#demoTimeSelect").selectOption("demo|10:00|Morning class demo");
  await page.locator("#phoneTime").waitFor({ state: "visible" });
  await wait(700);
}

async function scrollActiveScreen(screenId, positions, pauseMs = 1200) {
  for (const top of positions) {
    await page.locator(`#${screenId}`).evaluate((el, y) => { el.scrollTop = y; }, top);
    await wait(pauseMs);
  }
}

try {
  await page.goto(appUrl);
  await page.waitForLoadState("load");
  await installRecordingHelpers();
  await wait(800);

  await caption("1. Home: TransitAI UTM, phone clock, bus hero, and main actions.", 2500);
  await wait(2500);

  await caption("2. Chat shows input, intent confidence, retrieval, and grounded answers.", 2200);
  await openTab("screen-chat", 1100);
  await typeAndSend("When is the next bus to FKE?");
  await caption("Schedule answer: next bus, service window, frequency, source note.", 2600);
  await wait(2300);

  await typeAndSend("How do I get from KTDI to P19 FKE?");
  await caption("Route guidance: direct route sequence plus data source.", 2400);
  await wait(2600);

  await typeAndSend("Route from KTHO?");
  await caption("Conversation memory: it reuses the previous destination for a follow-up.", 2500);
  await wait(2500);

  await caption("3. Arrival ETA and stop details are available from the same chat flow.", 2200);
  await typeAndSend("When will the next bus arrive at CP?");
  await wait(2800);
  await clickCue(page.locator('button[data-stop="p19"]').last(), 1100);
  await caption("Bus Stop Detail: routes, data status, facilities, and walking direction.", 2600);
  await wait(2500);

  await caption("4. Timetable: search a faculty or stop and open the full-day route view.", 2200);
  await openTab("screen-timetable", 1000);
  const timetableSearch = page.locator("#timetableSearch");
  await highlight(timetableSearch, 400);
  await timetableSearch.fill("FKE");
  await wait(1400);
  await clickCue(page.locator('button[data-route-timetable="route_g"]'), 1000);
  await page.locator(activeScreenSelector("screen-route-timetable")).waitFor();
  await caption("Full-day timetable: morning, afternoon, and evening departures.", 2200);
  await scrollActiveScreen("screen-route-timetable", [0, 220, 520, 760], 1300);

  await caption("5. Alerts are filtered by route subscription.", 2100);
  await openTab("screen-alerts", 1000);
  await wait(1700);
  await openTab("screen-admin", 1000);
  await caption("Trigger BAS B delay first. It is not subscribed, so it should stay hidden.", 2300);
  await setDelay("route_b", true);
  await openTab("screen-alerts", 1000);
  await page.getByText("Other delayed routes are not shown").waitFor();
  await wait(2400);
  const routeBRow = page.locator(".sub-row").filter({ hasText: "BAS B1/B2/B3" });
  await clickCue(routeBRow.getByRole("button", { name: "Off" }), 1200);
  await page.getByText("BAS B1/B2/B3").first().waitFor();
  await caption("After subscribing, the delayed route appears as a notification.", 2600);
  await wait(2200);
  await clickCue(routeBRow.getByRole("button", { name: "On" }), 800);

  await caption("6. Feedback closes the loop by logging unresolved transport issues.", 2200);
  await openTab("screen-home", 800);
  await clickCue(page.locator('.home-card[data-screen="screen-feedback"]'), 1000);
  await page.locator(activeScreenSelector("screen-feedback")).waitFor();
  await page.locator("#fbType").selectOption("Bus did not arrive");
  await page.locator("#fbText").fill("Bus did not arrive at CP during the morning class demo.");
  page.once("dialog", dialog => dialog.accept());
  await clickCue(page.getByRole("button", { name: "Submit report" }), 1100);
  await page.locator(".fb-item").first().waitFor();
  await caption("The issue is logged for transport staff follow-up.", 2300);
  await wait(1200);

  await caption("7. Staff Demo shows the submitted report before running the proof.", 2300);
  await openTab("screen-admin", 1000);
  await page.locator("#staffIssueList").getByText("Bus did not arrive at CP").waitFor();
  await page.locator("#screen-admin").evaluate(el => { el.scrollTop = 0; });
  await highlight(page.locator(".staff-issues-card"), 900);
  await caption("Reported issues shows the passenger report, priority and timestamp.", 2700);
  await setDemoTime10();
  await setDelay("route_a", true);
  await page.locator("#proofBox").getByText("NotifyUser(ali, route_a, delay)", { exact: true }).first().waitFor();
  await caption("The proof derives NotifyUser(ali, route_a, delay), so the alert is valid.", 3200);
  await scrollActiveScreen("screen-admin", [0, 260, 520, 900], 1300);
  await openTab("screen-alerts", 1000);
  await page.locator("#screen-alerts.is-active .alert").filter({ hasText: "BAS A1/A2" }).first().waitFor();
  await caption("Subscribed BAS A delay now appears with scheduled and estimated times.", 2600);
  await wait(2600);

  await caption("Demo complete: input, output, AI reasoning, timetable, feedback, staff report, proof and alerts.", 3500);
  await page.locator(".phone").screenshot({ path: finalFrame });
  await wait(1800);

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
