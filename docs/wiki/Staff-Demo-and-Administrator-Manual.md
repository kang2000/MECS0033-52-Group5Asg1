# Staff Demo and Administrator Manual

This page explains the Staff Demo screen and the administrator process for maintaining the prototype. The Staff Demo screen is inside the app so the marker can trigger repeatable proof scenarios. It does not replace the separate Word administrator manual, but it supports the live demonstration.

## 1. Purpose of Staff Demo

Staff Demo is used to:

| Function | Purpose |
| --- | --- |
| Demo time control | Show morning, afternoon, evening, closed-route, or live-time states. |
| Route subscription control | Choose which routes can notify the demo user Ali. |
| Delay toggle | Mark a route delayed for the proof and Alerts workflow. |
| Resolution proof | Run the first-order proof that derives `NotifyUser(ali, route_a, delay)`. |
| Reported issues | Show passenger feedback reports submitted from the app. |

## 2. Demo time control

The app defaults to `10:00` demo time. This solves the presentation issue where the real time may be at night and all routes would appear closed.

Use Staff Demo -> Demo time to choose:

| Time option | Presentation use |
| --- | --- |
| 08:00 | Morning operating state. |
| 10:00 | Recommended main demo time. |
| 13:00 | Afternoon operating state. |
| 17:30 | Evening operating state near the end of service. |
| 20:30 | Closed route state. |
| Live device time | Shows behavior using the real current time. |

Recommendation: use `10:00` for the main demo, then briefly switch to `20:30` to prove the app can show closed service.

## 3. Route subscriptions

Subscriptions represent the logical fact:

```text
WantsRouteAlert(user, route)
```

The demo user is `Ali`. A delayed route is only visible in Alerts if Ali is subscribed to that route.

Example:

| Route state | Subscription state | Alert result |
| --- | --- | --- |
| BAS A delayed | Ali subscribed to BAS A | Alert appears. |
| BAS G delayed | Ali not subscribed to BAS G | Alert stays hidden. |
| No delayed route | Any subscription state | No active delay alert. |

This filtering is important because the app should not notify a passenger about every route on campus.

![Subscription filtering](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/07-alerts-subscription-filter.png)

## 4. Delay toggle and resolution proof

When staff toggles BAS A delayed, the app updates the route state and runs the resolution-refutation proof.

The proof uses these clauses:

| Clause | Meaning |
| --- | --- |
| P1 `WantsRouteAlert(ali, route_a)` | Ali subscribes to BAS A route alerts. |
| P2 `Delayed(route_a)` | BAS A is currently marked delayed by staff. |
| P3 `not Delayed(r) OR NeedDelayNotification(r)` | A delayed route requires a notification. |
| P4 `not WantsRouteAlert(u,r) OR not NeedDelayNotification(r) OR NotifyUser(u,r,delay)` | A subscribed user should be notified when notification is needed. |
| Negated goal `not NotifyUser(ali, route_a, delay)` | The prover assumes the opposite and derives a contradiction. |

Expected result:

```text
NotifyUser(ali, route_a, delay)
```

The proof is not just a screenshot. It is executed from `js/resolution.js` when the staff state changes.

![Resolution proof](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/11-resolution-proof.png)

## 5. Reported issues

Passenger feedback submitted through the Feedback screen appears in Staff Demo under Reported issues.

Staff should check:

| Field | Meaning |
| --- | --- |
| Issue type | Delay, crowding, stop information, or other. |
| User message | Passenger's typed description. |
| Route or stop reference | The route/stop mentioned by the user, if available. |
| Logged time | Prototype session timestamp. |

This shows the full loop from passenger report to staff review.

![Reported issues](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/10-staff-report-feed.png)

## 6. Administrator file map

| File | Role |
| --- | --- |
| `prototype/index.html` | Phone frame, screens, tabs, and app shell. |
| `prototype/css/styles.css` | Visual design and responsive layout. |
| `prototype/js/kb.js` | Routes, stops, schedules, aliases, subscriptions, delay state, and feedback state. |
| `prototype/js/intent.js` | Intent classifier cues and confidence scoring. |
| `prototype/js/retriever.js` | RAG-style retrieval over route, stop, FAQ, alert, and source text. |
| `prototype/js/resolution.js` | First-order resolution-refutation proof engine. |
| `prototype/js/chat.js` | Chat controller, message flow, response cards, and conversation memory. |
| `prototype/js/app.js` | Screen navigation, timetable, alerts, feedback, Staff Demo, and proof display. |
| `prototype/ADMIN_MANUAL.docx` | Word administrator manual for submission. |
| `prototype/TransitAI_UTM_Prototype_Demo.pptx` | Presentation slides. |
| `prototype/transitai-demo-with-face-voice-circle.mp4` | Final demo video with presenter overlay. |

## 7. Editing route data

Routes and stops are configured in `prototype/js/kb.js`.

When editing a stop:

1. Add or update the stop ID.
2. Add common aliases students may type.
3. Set a clear `status`.
4. Add a walking note.
5. Avoid claiming a mapping is official unless it has been verified.

Example stop:

```js
{
  id: "p19",
  name: "P19 / FKE Area",
  aliases: ["p19", "p19a", "fke", "electrical"],
  status: "public stop/area label with faculty alias",
  walking: "Alight at P19 for the FKE-area prototype. Confirm the exact shelter in production."
}
```

When editing a route:

1. Keep stops in travel order.
2. Set the operating start and end time.
3. Set the headway in minutes.
4. Add a source note.
5. Test route guidance in both valid and invalid directions.

Example route:

```js
{
  id: "route_g",
  name: "BAS G1/G2/G3 - KTR/KTHO/KTDI to SKT",
  stops: ["ktr", "ktho", "ktdi", "n24", "skt", "p19", "cp"],
  operating: { start: "07:00", end: "18:30" },
  headway: 20
}
```

## 8. Editing intent recognition

Intent cues are configured in `prototype/js/intent.js`.

Supported intents:

| Intent | Example |
| --- | --- |
| Schedule inquiry | "When is the next bus to FKE?" |
| Route guidance | "How do I get from KTDI to P19?" |
| Real-time arrival | "When will the next bus arrive at CP?" |
| Bus stop lookup | "Where is the FC bus stop?" |
| Alert inquiry | "Is route A delayed?" |
| Feedback | "I want to report a crowded bus." |

After changing cues, test all six intent types and confirm confidence is still displayed in the UI.

## 9. Administrator checklist before presentation

1. Open the live app.
2. Set demo time to `10:00`.
3. Ask a schedule question and confirm route timing appears.
4. Open Timetable and verify search works.
5. Ask a route guidance question and confirm ordered stops are shown.
6. Submit a feedback report.
7. Open Staff Demo and confirm the report appears.
8. Toggle BAS A delayed.
9. Confirm the proof reaches the empty clause.
10. Open Alerts and confirm only subscribed route alerts appear.
