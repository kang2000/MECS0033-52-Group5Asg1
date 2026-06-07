# TransitAI UTM — Interactive Prototype

A self-contained, browser-based **proof-of-concept** for *TransitAI UTM — A
Web-Based Chatbot for Campus Transport Information* (MECS0033-52, Group 5).

It demonstrates the AI solution from the design report: **intent recognition**,
a **knowledge base** with **RAG-style retrieval**, **conversation memory**, and
a working **resolution-refutation inference engine** that fires delay alerts.

> ⚠️ This is a prototype. Public route names/sequences were aligned to UTM/KDOJ
> route listings where available. Timetable times, arrival ETA, walking notes,
> and missing faculty/landmark mappings are clearly labelled **prototype
> simulations** rather than official live shuttle data.

---

## How to run

**Option A — just open it (no install):**
Double-click `index.html`, or drag it into Chrome. Everything (including the
knowledge base) is embedded, so it works straight from disk.

**Option B — local server (recommended for a clean demo):**
```bash
cd prototype
python3 -m http.server 8000
# then open http://localhost:8000
```

No accounts, no API keys, no Firebase, no build step.

The app defaults to **10:00 demo time** so schedule cards show active service
during presentation even if you present at night. Change this in
**Staff Demo → Demo time** or switch to **Live device time**.

---

## What to try (60-second tour)

1. **Schedule** — tap “🕑 Next bus” or type *“When is the next bus to FKE?”*
2. **Route guidance** — *“How do I get from KTDI to P19 FKE?”*
3. **Arrival (simulated)** — *“When will the next bus arrive at CP?”*
4. **Bus stop** — *“Where is the FC bus stop?”* (opens Bus Stop Detail)
5. **Demo time** — open **🛠️ Staff Demo**, switch between 08:00, 10:00, 13:00,
   17:30, 20:30, or live time, then repeat a schedule query.
6. **Delay alert + logic proof** — open the **🛠️ Staff Demo** tab, toggle
   *BAS A1/A2 — KP to Lingkaran Ilmu* to **delayed**. The **resolution-refutation proof**
   runs (matching report Figure 5.2) and the subscribed user is notified — see
   the **🔔 Alerts** tab.
7. **Feedback** — open **📝 Feedback**, submit a report.

The right-hand **“What the AI just did”** panel shows the live pipeline:
intent → retrieval → response → data source.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell (phone frame) + all screens |
| `css/styles.css` | UTM-themed mobile-app styling |
| `js/kb.js` | Knowledge base (routes, stops, schedules, FAQs) + helpers |
| `js/intent.js` | Intent classifier (6 intents + confidence) |
| `js/retriever.js` | RAG-style token-overlap retrieval |
| `js/resolution.js` | First-order resolution-refutation engine |
| `js/chat.js` | Conversation controller + session memory |
| `js/app.js` | Screen routing, Staff Demo panel, Alerts/Feedback/Stop |
| `ADMIN_MANUAL.md` / `admin_manual.html` | Administrator manual |
| `ADMIN_MANUAL.docx` | Word administrator manual for teacher submission |
| `TransitAI_UTM_Prototype_Demo.pptx` | Presentation deck with screenshots |
| `DEMO_SCRIPT.md` | Scripted walkthrough + rubric mapping |
| `manual_screenshots/*.png` | Rendered app screenshots used in the manual/deck |

See **ADMIN_MANUAL.md** for the component map and how to edit the data.
