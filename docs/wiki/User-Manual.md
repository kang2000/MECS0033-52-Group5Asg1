# User Manual

This manual explains how a passenger or student uses the TransitAI UTM prototype. The app is designed to feel like a mobile campus transport assistant inside a phone frame.

Live app: https://kang2000.github.io/MECS0033-52-Group5Asg1/

## 1. Open the app

Use one of these methods:

| Method | Steps |
| --- | --- |
| Live website | Open `https://kang2000.github.io/MECS0033-52-Group5Asg1/` in a browser. |
| Local file | Open `prototype/index.html` directly in Chrome. |
| Local server | Run `python3 -m http.server 8000` inside `prototype/`, then open `http://localhost:8000`. |

The app starts at demo time `10:00` so timetable features work during presentation even if the real current time is at night.

## 2. Home screen

The Home screen provides the main entry points:

| Button | Purpose |
| --- | --- |
| Plan Your Trip | Opens Chat so the user can ask route and arrival questions. |
| Bus Timetable | Opens searchable route timetables. |
| Service Alerts | Shows subscribed route alerts. |
| Report an Issue | Opens the feedback form. |

The bottom navigation bar has Home, Chat, Timetable, Alerts, and Staff Demo tabs.

![Home screen](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/01-home-overview.png)

## 3. Ask timetable questions in Chat

Open Chat and type a transport question.

Example:

```text
When is the next bus to FKE?
```

The app replies with a schedule card. The card shows:

| Field | Meaning |
| --- | --- |
| Arriving in | Estimated time until the next bus. |
| Scheduled | Scheduled next departure time from the configured timetable. |
| Estimated ETA | Adjusted ETA when the route is delayed. |
| Service window | First and last operating time for that route. |
| Frequency | Headway between buses. |
| Time basis | Whether the result uses demo time or live device time. |
| Route data | Source boundary for route and timetable information. |

The right-side panel, "What the AI just did", shows the AI pipeline: intent recognition, retrieval, response generation, and data source.

![Schedule answer](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/02-chat-schedule.png)

## 4. Use Bus Timetable

Open Bus Timetable from Home or the bottom tab.

Use the search box to filter by:

| Search type | Example |
| --- | --- |
| Faculty alias | `FKE`, `FC` |
| Stop code | `P19`, `N24`, `CP`, `KTDI` |
| Route label | `BAS A`, `BAS G` |
| Residential college | `KDOJ`, `KTR`, `KP` |

Tap a route card to open the full-day timetable. The route detail page shows route direction, first bus, last bus, frequency, route stops, and all departures grouped into morning, afternoon, and evening.

![Timetable search](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/03-timetable-search.png)

![Full-day route timetable](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/04b-route-timetable-times.png)

## 5. Ask for route guidance

Use route guidance when the user knows the origin and destination.

Example:

```text
How do I get from KTDI to P19 FKE?
```

The app checks ordered route stops. This matters because a route is only valid when the origin appears before the destination in the stored route sequence.

The answer includes:

| Output | Meaning |
| --- | --- |
| Recommended route | The route that serves the requested direction. |
| Board at | The origin stop. |
| Alight at | The destination stop. |
| Stop sequence | Ordered route stops used by the route engine. |
| Next from origin | Next configured departure from the boarding stop. |

![Route guidance](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/05-route-guidance.png)

## 6. View bus stop details

Ask a stop question such as:

```text
Where is the FC bus stop?
```

The app opens Bus Stop Detail. This page shows:

| Section | Meaning |
| --- | --- |
| Bus stop | Stored stop name and landmark note. |
| Routes serving this stop | Routes that include the stop. |
| Data status | Whether the mapping is public, verified, or prototype-mapped. |
| Facilities nearby | Useful nearby categories. |
| Walking direction | Short guidance note. |

![Bus Stop Detail](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/06-bus-stop-detail.png)

## 7. Check service alerts

Open Alerts from the bottom navigation.

Alerts are filtered by subscription. The demo user is `Ali`. If Ali is not subscribed to a delayed route, the route delay stays hidden. This prevents the app from notifying the user about every route on campus.

When BAS A is delayed and Ali is subscribed, the alert shows:

| Alert field | Meaning |
| --- | --- |
| Delayed route | Route affected by the staff delay toggle. |
| Boarding point | First stop for the route alert. |
| Scheduled | Original scheduled departure. |
| Estimated ETA | Delay-adjusted estimate. |
| Service window | Daily operating window. |
| Frequency | Configured route headway. |

![Alerts](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/08-alerts-after-proof.png)

## 8. Submit feedback

Open Report an Issue from Home or the Feedback screen.

Use it when the passenger wants to report:

| Issue type | Example |
| --- | --- |
| Delay | Bus did not arrive at the expected time. |
| Crowding | Bus is too full. |
| Stop information | Stop location or route mapping seems unclear. |
| Other | Any transport issue not covered above. |

After submission, the report is saved inside the prototype session and appears in Staff Demo under Reported issues.

![Feedback](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/09-feedback-submission.png)

## 9. Understand the AI panel

The right-side panel is important for grading because it shows the AI concept, not only the UI.

| Panel item | What it proves |
| --- | --- |
| Intent recognition | The app classifies the user's question into one of the supported intents. |
| Confidence | The app exposes how confident it is in the detected intent. |
| Knowledge retrieval | The app retrieves route, stop, FAQ, or source chunks. |
| Response generation | The app creates a grounded answer card. |
| Data source | The answer states where the information came from and which values are estimates. |

## 10. Good questions to try

```text
When is the next bus to FKE?
How do I get from KTDI to P19 FKE?
What about from KTHO?
When will the next bus arrive at CP?
Where is the FC bus stop?
Is route A delayed?
I want to report a crowded bus.
```
