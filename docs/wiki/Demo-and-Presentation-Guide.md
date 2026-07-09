# Demo and Presentation Guide

This guide is for the live presentation or recorded demo.

## Preparation

1. Open the live app: https://kang2000.github.io/MECS0033-52-Group5Asg1/
2. Keep the right-side "What the AI just did" panel visible.
3. Set Staff Demo -> Demo time to `10:00`.
4. Reset route delays if needed.
5. Make sure BAS A subscription is on for Ali.

## Two-minute demo script

### 0:00 - 0:15: Introduce the app

Say:

```text
TransitAI UTM is a campus shuttle chatbot prototype. It demonstrates intent recognition, knowledge retrieval, conversation memory, and a logic proof for delay alerts. It is fully browser-based and does not need Firebase or API keys.
```

Show:

- Home screen.
- Phone clock.
- Main actions.
- AI pipeline panel.

### 0:15 - 0:35: Show schedule answer

Action:

```text
Ask: When is the next bus to FKE?
```

Say:

```text
The app classifies the query as a schedule inquiry, retrieves route and stop data, then shows next bus timing, service window, first and last bus, and the source boundary.
```

Point to:

- Intent confidence.
- Scheduled time.
- Service window.
- Frequency.
- Data-source note.

### 0:35 - 0:55: Show full-day timetable

Action:

1. Open Bus Timetable.
2. Search `FKE`.
3. Open BAS G.
4. Scroll to the departure grid.

Say:

```text
The timetable page behaves like a real transport app. It supports route search and shows the full-day timetable grouped into morning, afternoon, and evening departures.
```

### 0:55 - 1:15: Show route guidance

Action:

```text
Ask: How do I get from KTDI to P19 FKE?
```

Say:

```text
The route engine checks ordered stop sequence, so the answer is directional. It only recommends a route when the origin comes before the destination.
```

### 1:15 - 1:30: Show bus stop detail

Action:

```text
Ask: Where is the FC bus stop?
```

Say:

```text
The app opens a bus stop detail page. It also states the data status, so prototype-only mappings are not presented as official facts.
```

### 1:30 - 1:45: Show feedback to staff

Action:

1. Open Feedback.
2. Submit a short report.
3. Open Staff Demo.

Say:

```text
Passenger reports are logged for staff review. This connects the user-facing app with the administrator workflow.
```

### 1:45 - 2:15: Show delay proof and alert

Action:

1. In Staff Demo, toggle BAS A delayed.
2. Show the proof trace.
3. Open Alerts.

Say:

```text
This is the AI logic highlight. The staff delay creates the Delayed(route_a) fact. Since Ali is subscribed to BAS A, the resolution-refutation engine derives NotifyUser(ali, route_a, delay). The Alerts page then shows the subscribed BAS A delay with scheduled and estimated times.
```

Point to:

- P1 to P4 clauses.
- Negated goal.
- Empty clause.
- BAS A alert card.

## Rubric mapping

| Rubric item | Evidence to show |
| --- | --- |
| Originality / Interactive Screen | Phone-style interface, natural language chat, AI pipeline panel, timetable search, Staff Demo proof. |
| Problem Solving | Route planning, next bus timing, stop lookup, delay alerts, subscription filtering, feedback reports. |
| Admin Manual | Word manual, wiki pages, screenshot-guided staff workflow, configuration notes. |

## Common lecturer questions

| Question | Good answer |
| --- | --- |
| Is this connected to real buses? | No. It is a proof-of-concept. Route names and stop sequences use public sources where available; ETA and timetable values are configured estimates. |
| Why is there Staff Demo inside the app? | It makes the proof and alert workflow repeatable during marking. The separate Word manual remains the formal administrator manual. |
| What is the AI part? | Intent recognition, RAG-style retrieval, conversation memory, and a first-order resolution-refutation proof engine. |
| Can the proof misfire? | The proof requires both subscription and delay facts. If either fact is missing, the alert should not appear. |
