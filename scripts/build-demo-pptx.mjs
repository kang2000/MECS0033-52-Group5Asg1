import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createSlideContext,
  ensureArtifactToolWorkspace,
  importArtifactTool,
  saveBlobToFile,
} from "/Users/kang/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/artifact_tool_utils.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.resolve(here, "..");
const repoDir = path.resolve(prototypeDir, "..");
const workspace = path.join(repoDir, "outputs", "manual-presentation", "presentations", "transitai-demo");
const previewDir = path.join(workspace, "preview");
const output = path.join(prototypeDir, "TransitAI_UTM_Prototype_Demo.pptx");
const screenshots = path.join(prototypeDir, "manual_screenshots");

const W = 1280;
const H = 720;
const MAROON = "#7A0C2E";
const GOLD = "#F2A900";
const INK = "#1E2330";
const MUTED = "#5B6270";
const BG = "#F5F7FB";
const LINE = "#D9DEE8";
const OK = "#138A52";

await fs.mkdir(previewDir, { recursive: true });
await ensureArtifactToolWorkspace(workspace);
const artifact = await importArtifactTool(workspace);
const { Presentation, PresentationFile } = artifact;
const presentation = Presentation.create({ slideSize: { width: W, height: H } });
const ctx = createSlideContext(artifact, { slideSize: { width: W, height: H }, workspaceDir: workspace, assetDir: path.join(workspace, "assets") });

function slideBase(title, kicker = "TransitAI UTM Prototype") {
  const slide = presentation.slides.add();
  slide.background.fill = BG;
  ctx.addShape(slide, { left: 0, top: 0, width: W, height: 78, fill: MAROON });
  ctx.addShape(slide, { left: 0, top: 78, width: W, height: 5, fill: GOLD });
  ctx.addText(slide, { left: 52, top: 18, width: 780, height: 40, text: title, fontSize: 28, bold: true, color: "#FFFFFF" });
  ctx.addText(slide, { left: 990, top: 27, width: 230, height: 24, text: kicker, fontSize: 12, bold: true, color: "#FFE9B0", align: "right" });
  return slide;
}

function titleSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = BG;
  ctx.addShape(slide, { left: 0, top: 0, width: W, height: H, fill: "#FFFFFF" });
  ctx.addShape(slide, { left: 0, top: 0, width: 420, height: H, fill: MAROON });
  ctx.addShape(slide, { left: 420, top: 0, width: 18, height: H, fill: GOLD });
  ctx.addText(slide, { left: 70, top: 72, width: 300, height: 60, text: "TransitAI UTM", fontSize: 34, bold: true, color: "#FFFFFF" });
  ctx.addText(slide, { left: 70, top: 148, width: 290, height: 160, text: "Campus transport chatbot prototype", fontSize: 24, color: "#FFE9B0", lineSpacing: 1.14 });
  ctx.addText(slide, { left: 70, top: 560, width: 285, height: 72, text: "MECS0033-52 Artificial Intelligence\nGroup 5", fontSize: 16, color: "#FFFFFF", lineSpacing: 1.25 });
  ctx.addText(slide, { left: 505, top: 88, width: 650, height: 72, text: "Teacher-facing demo deck", fontSize: 42, bold: true, color: INK });
  ctx.addText(slide, { left: 505, top: 178, width: 640, height: 150, text: "Shows exactly how the prototype meets the rubric: interactive screen, problem solving, and administrator manual support.", fontSize: 25, color: MUTED, lineSpacing: 1.22 });
  const rows = [
    ["Interactive", "Free text, quick actions, phone UI"],
    ["AI evidence", "Intent confidence, RAG-style retrieval, proof trace"],
    ["Truthful data", "Public route labels + simulated timing boundary"],
  ];
  rows.forEach((row, i) => {
    const y = 380 + i * 72;
    ctx.addShape(slide, { left: 505, top: y, width: 610, height: 54, fill: "#F7F2E8", line: ctx.line(GOLD, 1), borderRadius: "rounded-md" });
    ctx.addText(slide, { left: 525, top: y + 12, width: 150, height: 26, text: row[0], fontSize: 17, bold: true, color: MAROON });
    ctx.addText(slide, { left: 695, top: y + 12, width: 395, height: 28, text: row[1], fontSize: 17, color: INK });
  });
}

function addCard(slide, x, y, w, h, title, body, accent = MAROON) {
  ctx.addShape(slide, { left: x, top: y, width: w, height: h, fill: "#FFFFFF", line: ctx.line(LINE, 1), borderRadius: "rounded-md" });
  ctx.addShape(slide, { left: x, top: y, width: 7, height: h, fill: accent });
  ctx.addText(slide, { left: x + 22, top: y + 16, width: w - 44, height: 28, text: title, fontSize: 19, bold: true, color: accent });
  ctx.addText(slide, { left: x + 22, top: y + 52, width: w - 44, height: h - 62, text: body, fontSize: 15, color: INK, lineSpacing: 1.18 });
}

async function addScreenshot(slide, file, x, y, w, h, caption) {
  await ctx.addImage(slide, { path: path.join(screenshots, file), left: x, top: y, width: w, height: h, fit: "contain", alt: caption });
  if (caption) ctx.addText(slide, { left: x, top: y + h + 6, width: w, height: 22, text: caption, fontSize: 11, color: MUTED, align: "center" });
}

function bullets(items) {
  return items.map(item => `• ${item}`).join("\n");
}

function rubricSlide() {
  const slide = slideBase("Rubric fit: high-score evidence");
  addCard(slide, 70, 125, 350, 205, "Originality / Interactive Screen", bullets([
    "Phone-frame app with real inputs and outputs",
    "Intent confidence visible to marker",
    "RAG-style source panel",
    "Resolution proof is tied to the report logic",
  ]), MAROON);
  addCard(slide, 465, 125, 350, 205, "Problem Solving", bullets([
    "Schedule uncertainty",
    "Route confusion",
    "Arrival uncertainty",
    "Delay notification gap",
    "Feedback / escalation",
  ]), OK);
  addCard(slide, 860, 125, 350, 205, "Admin Manual", bullets([
    "Component/function map",
    "Data-source truth policy",
    "Configuration guide",
    "Screenshots and troubleshooting",
  ]), GOLD);
  ctx.addText(slide, { left: 90, top: 410, width: 1100, height: 100, text: "Main scoring risk reduced: the prototype now clearly labels what is public route data and what is simulated POC behavior. The demo-time control prevents night presentation from making every route look closed.", fontSize: 28, bold: true, color: INK, lineSpacing: 1.14, align: "center" });
}

function truthSlide() {
  const slide = slideBase("Data truth policy");
  const rows = [
    ["Public route listing aligned", "BAS A/B/C/D/E/F/G/H labels and public stop sequences"],
    ["Public stop labels", "CP, KTDI, KTHO, KTR, KDOJ, N24, P19, T02, T08, V01, etc."],
    ["Prototype mappings", "FC → N24 / Cluster Area; FKE → P19 / FKE Area"],
    ["Simulated POC data", "Next departure, operating hours, headway, live arrival ETA, delay status"],
  ];
  rows.forEach((row, i) => {
    const y = 135 + i * 95;
    ctx.addShape(slide, { left: 80, top: y, width: 1120, height: 72, fill: "#FFFFFF", line: ctx.line(LINE, 1), borderRadius: "rounded-md" });
    ctx.addText(slide, { left: 105, top: y + 14, width: 280, height: 26, text: row[0], fontSize: 18, bold: true, color: i < 2 ? OK : GOLD });
    ctx.addText(slide, { left: 410, top: y + 14, width: 750, height: 44, text: row[1], fontSize: 18, color: INK });
  });
  ctx.addText(slide, { left: 85, top: 555, width: 1090, height: 70, text: "Presentation wording: “Route names and stop sequences follow public UTM/KDOJ listings where available. Timetable/ETA values are simulated because no live verified feed is connected to this 10% POC.”", fontSize: 20, bold: true, color: MAROON, lineSpacing: 1.18 });
}

async function overviewSlide() {
  const slide = slideBase("Prototype first screen");
  await addScreenshot(slide, "01-home-chat.png", 72, 120, 760, 540, "Home/chat, quick actions and AI pipeline panel.");
  addCard(slide, 875, 145, 315, 160, "What to point out", bullets([
    "Phone status time now visible",
    "No install, no backend",
    "Input and output shown immediately",
  ]), MAROON);
  addCard(slide, 875, 335, 315, 180, "AI visibility", bullets([
    "Intent recognition",
    "Knowledge retrieval",
    "Grounded response",
    "Source note",
  ]), GOLD);
}

async function studentFlowsSlide() {
  const slide = slideBase("Student flows: schedule, route, arrival");
  await addScreenshot(slide, "02-schedule-demo-time.png", 55, 118, 360, 255, "Schedule: demo time + source note");
  await addScreenshot(slide, "03-route-guidance.png", 460, 118, 360, 255, "Route: BAS G stop sequence");
  await addScreenshot(slide, "04-arrival-simulated.png", 865, 118, 360, 255, "Arrival: simulated ETA");
  ctx.addText(slide, { left: 95, top: 445, width: 1090, height: 86, text: "The marker sees the real problem being solved: students can ask natural questions instead of searching static notices. Each answer states the data source and simulation boundary.", fontSize: 27, bold: true, color: INK, align: "center", lineSpacing: 1.15 });
}

async function adminTimeSlide() {
  const slide = slideBase("Staff Demo time control");
  await addScreenshot(slide, "06-admin-demo-time-control.png", 78, 120, 650, 505, "Staff Demo controls with fixed demo time.");
  addCard(slide, 780, 140, 350, 145, "Why it was added", "At night, live device time makes route cards show “closed now.” Demo time gives repeatable morning/lunch/evening/night scenarios.", MAROON);
  addCard(slide, 780, 318, 350, 145, "How to demo", "Use 10:00 for normal service. Use 20:30 only when intentionally showing closed-service behavior.", GOLD);
}

async function proofSlide() {
  const slide = slideBase("Originality highlight: resolution proof");
  await addScreenshot(slide, "07b-resolution-proof-box.png", 90, 115, 350, 560, "Proof trace crop");
  addCard(slide, 500, 140, 620, 150, "What it proves", "From P1 WantsRouteAlert(ali, route_a), P2 Delayed(route_a), and rules P3/P4, the engine derives NotifyUser(ali, route_a, delay).", OK);
  addCard(slide, 500, 325, 620, 150, "Why it is not just UI", "Unification and resolution are computed by resolution.js. The proof only runs when the user is subscribed and the route is actually marked delayed in app state.", MAROON);
  addCard(slide, 500, 510, 620, 110, "Demo line", "“This proof matches Figure 5.2 in our report and drives the Alerts screen.”", GOLD);
}

async function alertsFeedbackSlide() {
  const slide = slideBase("Staff Demo outcome: alerts and feedback");
  await addScreenshot(slide, "08-alerts-after-proof.png", 78, 122, 500, 360, "Alerts after proof-triggered delay");
  await addScreenshot(slide, "09-feedback-log.png", 700, 122, 500, 360, "Feedback escalation log");
  ctx.addText(slide, { left: 115, top: 560, width: 1050, height: 55, text: "These two screens close the loop for both user pain points: proactive delay notification and staff follow-up when information is wrong or incomplete.", fontSize: 24, bold: true, color: INK, align: "center" });
}

function architectureSlide() {
  const slide = slideBase("Architecture shown in the POC");
  const labels = [
    ["User input", "Typed query or quick action"],
    ["Intent", "classify() + confidence"],
    ["Retriever", "Top KB chunks + source note"],
    ["Response", "Grounded answer card"],
    ["Staff proof", "Resolution derives NotifyUser"],
  ];
  labels.forEach((l, i) => {
    const x = 70 + i * 235;
    ctx.addShape(slide, { left: x, top: 185, width: 190, height: 145, fill: "#FFFFFF", line: ctx.line(LINE, 1), borderRadius: "rounded-md" });
    ctx.addText(slide, { left: x + 16, top: 210, width: 158, height: 30, text: l[0], fontSize: 20, bold: true, color: MAROON, align: "center" });
    ctx.addText(slide, { left: x + 18, top: 255, width: 154, height: 55, text: l[1], fontSize: 15, color: INK, align: "center", lineSpacing: 1.14 });
    if (i < labels.length - 1) {
      ctx.addText(slide, { left: x + 197, top: 232, width: 45, height: 45, text: "→", fontSize: 34, bold: true, color: GOLD, align: "center" });
    }
  });
  ctx.addText(slide, { left: 105, top: 440, width: 1065, height: 90, text: "The side panel exposes the same pipeline live during the demo, so the grader can see the AI concept rather than only a static app screen.", fontSize: 28, bold: true, color: INK, align: "center", lineSpacing: 1.15 });
}

function closingSlide() {
  const slide = slideBase("Demo checklist");
  addCard(slide, 95, 130, 495, 390, "Before presenting", bullets([
    "Open prototype/index.html or serve prototype folder at localhost:8000",
    "Staff Demo -> Demo time -> 10:00",
    "Keep the AI pipeline panel visible",
    "Say timing/ETA are simulated POC data",
    "Use BAS G example for KTDI to P19/FKE",
  ]), MAROON);
  addCard(slide, 690, 130, 495, 390, "Scoring moments", bullets([
    "Schedule card: source + time basis",
    "Route card: stop sequence",
    "Staff Demo: toggle BAS A delayed",
    "Proof trace: empty clause",
    "Alerts: notification appears",
    "Manual: Word file has full process",
  ]), OK);
  ctx.addText(slide, { left: 120, top: 585, width: 1040, height: 46, text: "Final message: a reliable local POC with transparent data boundaries is stronger than a fragile live API demo.", fontSize: 24, bold: true, color: MAROON, align: "center" });
}

titleSlide();
rubricSlide();
truthSlide();
await overviewSlide();
await studentFlowsSlide();
await adminTimeSlide();
await proofSlide();
await alertsFeedbackSlide();
architectureSlide();
closingSlide();

for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await saveBlobToFile(preview, path.join(previewDir, `slide-${String(i + 1).padStart(2, "0")}.png`));
}

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(output);
console.log(JSON.stringify({ output, slideCount: presentation.slides.count, previewDir }, null, 2));
