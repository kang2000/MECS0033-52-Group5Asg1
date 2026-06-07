# TransitAI UTM — A Web-Based Chatbot for Campus Transport Information

**MECS0033-52 · Artificial Intelligence · Assignment 1 · Group 5**

This repository contains Group 5's submission for the MECS0033 AI assignment: a
design report plus a working, browser-based prototype of **TransitAI UTM**, a
campus-transport chatbot for Universiti Teknologi Malaysia (UTM).

The prototype demonstrates the AI techniques described in the report —
**intent recognition**, a **knowledge base** with **RAG-style retrieval**,
**conversation memory**, and a **first-order resolution–refutation inference
engine** that fires shuttle-delay alerts.

---

## Repository contents

| Path | Description |
|------|-------------|
| `prototype/` | The interactive, self-contained web prototype (open and run — see below) |
| `Group5Asg1.docx` | Full design report (the main written deliverable) |
| `01 Project_AI_20242025_1_ODL.pdf` | The assignment brief / project specification |
| `TransitAI UTM (Responses).xlsx` | Survey responses gathered during requirements analysis |
| `transitai_ui_navigation_flow.png` | UI navigation-flow diagram used in the report |
| `transitai_resolution_refutation_tree.png` | Resolution–refutation proof tree (report Figure 5.2) |

> The `outputs/` and `prototype/docx_render/` folders hold locally generated
> build artifacts (presentation previews, intermediate renders) and are
> intentionally excluded from version control via `.gitignore`.

---

## Quick start — run the prototype

No install, no accounts, no API keys, no build step. Everything (including the
knowledge base) is embedded in the page.

**Option A — just open it:**
Double-click `prototype/index.html`, or drag it into Chrome.

**Option B — local server (recommended for a clean demo):**
```bash
cd prototype
python3 -m http.server 8000
# then open http://localhost:8000
```

The app defaults to **10:00 demo time** so schedule cards show active service
during a presentation even at night. Change this in **Staff Demo → Demo time**,
or switch to **Live device time**.

See [`prototype/README.md`](prototype/README.md) for a 60-second feature tour,
[`prototype/DEMO_SCRIPT.md`](prototype/DEMO_SCRIPT.md) for the scripted
walkthrough and rubric mapping, and
[`prototype/ADMIN_MANUAL.md`](prototype/ADMIN_MANUAL.md) for the administrator
manual and component map.

---

## How the prototype works

The prototype is plain HTML/CSS/JavaScript with no dependencies. The AI pipeline
lives in `prototype/js/`:

| File | Responsibility |
|------|----------------|
| `js/kb.js` | Knowledge base — routes, stops, schedules, FAQs + helpers |
| `js/intent.js` | Intent classifier (6 intents + confidence) |
| `js/retriever.js` | RAG-style token-overlap retrieval |
| `js/resolution.js` | First-order resolution–refutation engine |
| `js/chat.js` | Conversation controller + session memory |
| `js/app.js` | Screen routing, Staff Demo panel, Alerts / Feedback / Stop detail |

The right-hand **"What the AI just did"** panel exposes the live pipeline during
a conversation: *intent → retrieval → response → data source*.

---

## Disclaimer

This is an academic **proof-of-concept**. Public route names and sequences were
aligned to UTM/KDOJ route listings where available; timetable times, arrival
ETAs, walking notes, and any missing faculty/landmark mappings are clearly
labelled **prototype simulations** rather than official live shuttle data.

---

## Group 5

MECS0033-52 — Artificial Intelligence, 2024/2025.
