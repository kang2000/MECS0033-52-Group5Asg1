import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createSlideContext,
  ensureArtifactToolWorkspace,
  importArtifactTool,
  saveBlobToFile,
} from "/Users/kang/.codex/plugins/cache/openai-primary-runtime/presentations/26.630.12135/skills/presentations/container_tools/artifact_tool_utils.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.resolve(here, "..");
const workspace = path.join(os.tmpdir(), "codex-presentations", "transitai-utm-demo-deck");
const previewDir = path.join(workspace, "preview");
const layoutDir = path.join(workspace, "layout");
const output = path.join(prototypeDir, "TransitAI_UTM_Prototype_Demo.pptx");
const screenshots = path.join(prototypeDir, "manual_screenshots");

const W = 1280;
const H = 720;
const MAROON = "#7A0C2E";
const MAROON_D = "#54071F";
const GOLD = "#F2A900";
const INK = "#1E2330";
const MUTED = "#5B6270";
const BG = "#F6F7FA";
const LINE = "#D5DAE3";
const OK = "#138A52";
const BLACK = "#111111";
const WHITE = "#FFFFFF";

await fs.mkdir(previewDir, { recursive: true });
await fs.mkdir(layoutDir, { recursive: true });
await ensureArtifactToolWorkspace(workspace);
const artifact = await importArtifactTool(workspace);
const { Presentation, PresentationFile } = artifact;
const presentation = Presentation.create({ slideSize: { width: W, height: H } });
const ctx = createSlideContext(artifact, {
  slideSize: { width: W, height: H },
  workspaceDir: workspace,
  assetDir: path.join(workspace, "assets"),
  titleFont: "Arial",
  bodyFont: "Arial",
});

function addText(slide, opts) {
  return ctx.addText(slide, {
    typeface: "Arial",
    line: ctx.line("#00000000", 0),
    ...opts,
  });
}

function baseSlide(title, kicker = "TransitAI UTM Prototype") {
  const slide = presentation.slides.add();
  slide.background.fill = BG;
  ctx.addShape(slide, { left: 0, top: 0, width: W, height: 82, fill: MAROON });
  ctx.addShape(slide, { left: 0, top: 82, width: W, height: 6, fill: GOLD });
  addText(slide, { left: 54, top: 19, width: 830, height: 48, text: title, fontSize: 36, bold: true, color: WHITE });
  addText(slide, { left: 940, top: 30, width: 280, height: 28, text: kicker, fontSize: 16, bold: true, color: "#FFE9B0", align: "right" });
  return slide;
}

function addCard(slide, x, y, w, h, title, body, accent = MAROON) {
  ctx.addShape(slide, { geometry: "roundRect", left: x, top: y, width: w, height: h, fill: WHITE, line: ctx.line(LINE, 1) });
  ctx.addShape(slide, { left: x, top: y, width: 8, height: h, fill: accent });
  addText(slide, { left: x + 24, top: y + 18, width: w - 48, height: 32, text: title, fontSize: 24, bold: true, color: accent });
  addText(slide, { left: x + 24, top: y + 58, width: w - 48, height: h - 72, text: body, fontSize: 18, color: INK, lineSpacing: 1.16 });
}

function bullets(items) {
  return items.map((item) => `• ${item}`).join("\n");
}

async function addScreenshot(slide, file, x, y, w, h, caption = "") {
  await ctx.addImage(slide, {
    path: path.join(screenshots, file),
    left: x,
    top: y,
    width: w,
    height: h,
    fit: "contain",
    alt: caption || file,
  });
  if (caption) {
    addText(slide, { left: x, top: y + h + 6, width: w, height: 24, text: caption, fontSize: 16, color: MUTED, align: "center" });
  }
}

function addCallout(slide, text, box, target, options = {}) {
  const { accent = BLACK, fromSide = "bottom", toSide = "top" } = options;
  const label = addText(slide, {
    left: box.x,
    top: box.y,
    width: box.w,
    height: box.h,
    text,
    fontSize: options.fontSize || 20,
    bold: true,
    color: BLACK,
    fill: WHITE,
    line: ctx.line(accent, 2),
    insets: { left: 12, right: 12, top: 8, bottom: 8 },
  });
  const targetDot = ctx.addShape(slide, {
    geometry: "ellipse",
    left: target.x - 5,
    top: target.y - 5,
    width: 10,
    height: 10,
    fill: accent,
    line: ctx.line(accent, 1),
  });
  const connector = slide.shapes.connect(label, targetDot, {
    kind: "straight",
    fromSide,
    toSide,
    line: { style: "solid", fill: accent, width: 3 },
    head: { type: "arrow", width: "med", length: "med" },
  });
  connector.bringToFront?.();
  label.bringToFront?.();
  targetDot.bringToFront?.();
}

function titleSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = "#F3E0B7";
  ctx.addShape(slide, { left: 0, top: 0, width: W, height: 118, fill: "#F7D9A8" });
  ctx.addShape(slide, { left: 0, top: 118, width: 330, height: 40, fill: "#FF9A00" });
  addText(slide, { left: 380, top: 26, width: 770, height: 72, text: "TransitAI UTM Prototype", fontSize: 56, bold: true, color: "#C00000", align: "center" });
  addText(slide, { left: 74, top: 128, width: 220, height: 28, text: "www.utm.my", fontSize: 24, bold: true, color: WHITE, align: "center" });
  addText(slide, { left: 80, top: 205, width: 520, height: 110, text: "Interactive campus transport chatbot", fontSize: 42, bold: true, color: MAROON, lineSpacing: 1.06 });
  addText(slide, { left: 80, top: 338, width: 510, height: 112, text: "Demonstrates natural-language queries, route retrieval, demo-time control, and a resolution-refutation alert proof.", fontSize: 24, color: INK, lineSpacing: 1.18 });
  addCard(slide, 78, 500, 350, 110, "Prepared for", "MECS0033 Artificial Intelligence\nSection 52, Group 5", MAROON);
  addCard(slide, 462, 500, 350, 110, "Scoring focus", "Originality / Interactive Screen\nProblem Solving\nAdmin Manual", OK);
  ctx.addShape(slide, { geometry: "roundRect", left: 855, top: 190, width: 290, height: 452, fill: WHITE, line: ctx.line(MAROON, 3) });
  addText(slide, { left: 888, top: 238, width: 225, height: 100, text: "Chat\nSchedule\nRoute\nAlerts\nProof", fontSize: 32, bold: true, color: MAROON, align: "center", lineSpacing: 1.22 });
  addText(slide, { left: 895, top: 492, width: 210, height: 48, text: "No install\nNo Firebase\nNo API key", fontSize: 22, color: INK, align: "center", lineSpacing: 1.16 });
}

function rubricSlide() {
  const slide = baseSlide("How the prototype targets full marks");
  addCard(slide, 62, 128, 356, 248, "Originality / Interactive Screen", bullets([
    "Phone-style app with real input/output",
    "Intent confidence shown live",
    "RAG-style retrieval panel",
    "Resolution proof drives alerts",
    "Demo-time scenarios are controllable",
  ]), MAROON);
  addCard(slide, 462, 128, 356, 248, "Problem Solving", bullets([
    "Schedule uncertainty",
    "Route and destination confusion",
    "Arrival uncertainty",
    "Delay notification gap",
    "Feedback escalation",
  ]), OK);
  addCard(slide, 862, 128, 356, 248, "Admin Manual", bullets([
    "Separate Word deliverable",
    "Component/function map",
    "Source truth policy",
    "Step-by-step screenshots",
    "Troubleshooting and config guide",
  ]), GOLD);
  addText(slide, { left: 105, top: 455, width: 1070, height: 98, text: "The strongest demo line: this is not just a mockup. The app exposes intent recognition, retrieval, source grounding, memory, and a real resolution-refutation proof.", fontSize: 32, bold: true, color: INK, align: "center", lineSpacing: 1.1 });
}

async function firstScreenSlide() {
  const slide = baseSlide("First screen is the usable prototype");
  await addScreenshot(slide, "01-home-chat.png", 64, 116, 790, 520, "Home/chat with phone frame and AI pipeline panel.");
  addCallout(slide, "Phone time is visible", { x: 880, y: 130, w: 290, h: 58 }, { x: 433, y: 153 }, { accent: MAROON, toSide: "right" });
  addCallout(slide, "Tap quick actions", { x: 880, y: 236, w: 290, h: 58 }, { x: 286, y: 520 }, { accent: GOLD, toSide: "right" });
  addCallout(slide, "Type a free-text query", { x: 880, y: 342, w: 290, h: 62 }, { x: 385, y: 555 }, { accent: OK, toSide: "right" });
  addCallout(slide, "AI pipeline evidence", { x: 880, y: 452, w: 290, h: 62 }, { x: 622, y: 148 }, { accent: BLACK, toSide: "right" });
}

async function scheduleSlide() {
  const slide = baseSlide("Schedule demo works at any presentation time");
  await addScreenshot(slide, "02-schedule-demo-time.png", 62, 116, 790, 520, "Schedule card after tapping Next bus.");
  addCallout(slide, "Intent + confidence", { x: 880, y: 126, w: 292, h: 60 }, { x: 445, y: 180 }, { accent: MAROON, toSide: "right" });
  addCallout(slide, "Time basis shows demo clock", { x: 880, y: 236, w: 292, h: 72 }, { x: 420, y: 430 }, { accent: GOLD, toSide: "right" });
  addCallout(slide, "Source note protects data truth", { x: 880, y: 370, w: 292, h: 78 }, { x: 370, y: 575 }, { accent: OK, toSide: "right" });
  addText(slide, { left: 878, top: 548, width: 320, height: 70, text: "Demo line: route/sequence is public-list aligned; timing and ETA are simulated POC data.", fontSize: 20, bold: true, color: INK, lineSpacing: 1.12 });
}

async function routeSlide() {
  const slide = baseSlide("Route guidance uses ordered stop sequences");
  await addScreenshot(slide, "03-route-guidance.png", 62, 116, 790, 520, "Route query from KTDI to P19/FKE.");
  addCallout(slide, "Free-text route request", { x: 876, y: 130, w: 300, h: 62 }, { x: 420, y: 202 }, { accent: MAROON, toSide: "right" });
  addCallout(slide, "BAS G recommendation", { x: 876, y: 248, w: 300, h: 62 }, { x: 318, y: 390 }, { accent: OK, toSide: "right" });
  addCallout(slide, "Stop sequence is shown", { x: 876, y: 366, w: 300, h: 62 }, { x: 365, y: 468 }, { accent: GOLD, toSide: "right" });
  addText(slide, { left: 870, top: 538, width: 330, height: 82, text: "Directional check: the route is valid only when origin appears before destination in the sequence.", fontSize: 20, bold: true, color: INK, lineSpacing: 1.12 });
}

async function arrivalStopSlide() {
  const slide = baseSlide("Arrival and bus-stop screens answer different user needs");
  await addScreenshot(slide, "04-arrival-simulated.png", 58, 122, 548, 366, "Arrival query.");
  await addScreenshot(slide, "05-bus-stop-detail.png", 678, 122, 548, 366, "Bus-stop detail query.");
  addCallout(slide, "ETA is labelled simulated", { x: 86, y: 528, w: 290, h: 64 }, { x: 238, y: 313 }, { accent: MAROON, fromSide: "top", toSide: "bottom" });
  addCallout(slide, "Data status prevents overclaiming", { x: 708, y: 528, w: 360, h: 64 }, { x: 850, y: 287 }, { accent: OK, fromSide: "top", toSide: "bottom" });
}

async function staffTimeSlide() {
  const slide = baseSlide("Staff Demo makes the presentation repeatable");
  await addScreenshot(slide, "06-admin-demo-time-control.png", 62, 112, 790, 526, "Staff Demo time and delay controls.");
  addCallout(slide, "Choose 10:00 for normal service", { x: 880, y: 126, w: 310, h: 72 }, { x: 365, y: 265 }, { accent: GOLD, toSide: "right" });
  addCallout(slide, "Toggle BAS A delayed", { x: 880, y: 256, w: 310, h: 64 }, { x: 470, y: 345 }, { accent: MAROON, toSide: "right" });
  addCallout(slide, "Proof trace appears below", { x: 880, y: 378, w: 310, h: 64 }, { x: 370, y: 585 }, { accent: BLACK, toSide: "right" });
  addText(slide, { left: 882, top: 530, width: 315, height: 58, text: "This solves the night-demo problem: current time no longer controls what the marker sees.", fontSize: 20, bold: true, color: INK, lineSpacing: 1.1 });
}

async function proofSlide() {
  const slide = baseSlide("Resolution proof is the originality highlight");
  await addScreenshot(slide, "07b-resolution-proof-box.png", 82, 122, 360, 520, "Proof trace crop.");
  addCard(slide, 500, 130, 620, 124, "What is being proven", "NotifyUser(ali, route_a, delay) follows from Ali's subscription, the delayed route fact, and the report's notification rules.", OK);
  addCard(slide, 500, 292, 620, 140, "Why it is logically tied to app state", "The derivation only runs when route_a is marked delayed and Ali is subscribed. It does not fire from a decorative button alone.", MAROON);
  addCard(slide, 500, 470, 620, 116, "Presenter line", "This matches the report's Figure 5.2 resolution-refutation example and drives the Alerts screen.", GOLD);
  addCallout(slide, "P1-P4 + negated goal", { x: 120, y: 126, w: 260, h: 58 }, { x: 190, y: 276 }, { accent: BLACK });
  addCallout(slide, "Empty clause", { x: 120, y: 574, w: 240, h: 56 }, { x: 205, y: 516 }, { accent: OK, fromSide: "top", toSide: "bottom" });
}

async function alertsFeedbackSlide() {
  const slide = baseSlide("Alerts and feedback close the service loop");
  await addScreenshot(slide, "08-alerts-after-proof.png", 60, 122, 545, 374, "Alerts after proof-triggered delay.");
  await addScreenshot(slide, "09-feedback-log.png", 680, 122, 545, 374, "Feedback report log.");
  addCallout(slide, "Proof creates alert", { x: 92, y: 536, w: 270, h: 58 }, { x: 236, y: 262 }, { accent: MAROON, fromSide: "top", toSide: "bottom" });
  addCallout(slide, "User can report wrong data", { x: 724, y: 536, w: 340, h: 58 }, { x: 872, y: 324 }, { accent: OK, fromSide: "top", toSide: "bottom" });
  addText(slide, { left: 145, top: 630, width: 990, height: 46, text: "Problem solving is not only answering questions; the prototype also handles disruption and escalation.", fontSize: 25, bold: true, color: INK, align: "center" });
}

function dataTruthSlide() {
  const slide = baseSlide("Data truth statement for Q&A");
  addCard(slide, 76, 132, 520, 140, "Safe claim", "Route labels and many stop sequences are aligned to public UTM/DVC/KDOJ listings where available.", OK);
  addCard(slide, 684, 132, 520, 140, "Do not overclaim", "Current operation, timetable, ETA, headway, delay state, and walking notes are simulated because no live verified feed is connected.", MAROON);
  addCard(slide, 76, 326, 520, 150, "Sources checked", "UTM DVC Development shuttle page\nKDOJ UTM Bus Schedule route list\nUTM JB 2025 shuttle timetable PDF", GOLD);
  addCard(slide, 684, 326, 520, 150, "Known caveat", "Some public effective-date fields are historical. The prototype therefore uses them only as public route/sequence references, not proof of current live operation.", BLACK);
  addText(slide, { left: 120, top: 560, width: 1040, height: 58, text: "This wording is what keeps the prototype truthful while still demonstrating the AI solution clearly.", fontSize: 28, bold: true, color: INK, align: "center" });
}

function closeSlide() {
  const slide = baseSlide("Presentation checklist");
  addCard(slide, 94, 130, 500, 390, "Before presenting", bullets([
    "Open prototype/index.html or localhost:8000",
    "Staff Demo -> Demo time -> 10:00",
    "Use quick actions for repeatable flows",
    "Keep AI pipeline panel visible",
    "Say timing and ETA are simulated",
  ]), MAROON);
  addCard(slide, 690, 130, 500, 390, "Show these scoring moments", bullets([
    "Schedule card: intent + time basis",
    "Route card: BAS G sequence",
    "Staff Demo: toggle BAS A delayed",
    "Proof trace: empty clause",
    "Alerts: notification appears",
    "Word manual: separate deliverable",
  ]), OK);
  addText(slide, { left: 118, top: 596, width: 1045, height: 48, text: "Submit this PPT, ADMIN_MANUAL.docx, and the prototype folder together.", fontSize: 28, bold: true, color: MAROON, align: "center" });
}

titleSlide();
rubricSlide();
await firstScreenSlide();
await scheduleSlide();
await routeSlide();
await arrivalStopSlide();
await staffTimeSlide();
await proofSlide();
await alertsFeedbackSlide();
dataTruthSlide();
closeSlide();

for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const stem = `slide-${String(i + 1).padStart(2, "0")}`;
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await saveBlobToFile(preview, path.join(previewDir, `${stem}.png`));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(layoutDir, `${stem}.layout.json`), await layout.text());
}

const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
await saveBlobToFile(montage, path.join(previewDir, "deck-montage.webp"));

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(output);
console.log(JSON.stringify({ output, slideCount: presentation.slides.count, previewDir, layoutDir }, null, 2));
