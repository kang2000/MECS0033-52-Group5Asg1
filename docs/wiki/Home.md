# TransitAI UTM Wiki

TransitAI UTM is a browser-based proof-of-concept for a campus shuttle chatbot at Universiti Teknologi Malaysia. It demonstrates the AI workflow from the assignment report: intent recognition, a knowledge base, RAG-style retrieval, conversation memory, and a first-order resolution-refutation proof for route-delay alerts.

Live prototype: https://kang2000.github.io/MECS0033-52-Group5Asg1/

Source repository: https://github.com/kang2000/MECS0033-52-Group5Asg1

## What the app does

| Area | What the user can do |
| --- | --- |
| Home | Start route planning, timetable lookup, alerts, or feedback from a phone-style app screen. |
| Chat | Ask natural language questions such as "When is the next bus to FKE?" or "How do I get from KTDI to P19?" |
| Bus Timetable | Search routes by route name, stop, or faculty alias, then open a full-day timetable. |
| Route Guidance | Get a route recommendation based on ordered route stops. |
| Bus Stop Detail | View routes serving a stop, data status, facilities, and walking notes. |
| Alerts | See delay notifications only for routes the demo user is subscribed to. |
| Feedback | Submit a passenger issue report for staff review. |
| Staff Demo | Set demo time, manage route subscriptions, trigger route delays, view feedback, and run the logic proof. |

## Wiki pages

- [User Manual](User-Manual.md): passenger-facing steps for using the prototype.
- [Staff Demo and Administrator Manual](Staff-Demo-and-Administrator-Manual.md): staff controls, route subscriptions, delay proof, feedback review, and configuration notes.
- [Data Accuracy and Scope](Data-Accuracy-and-Scope.md): which data is public-list aligned and which data is a prototype estimate.
- [Demo and Presentation Guide](Demo-and-Presentation-Guide.md): short script for presenting the app to the lecturer.
- [Troubleshooting](Troubleshooting.md): common issues and fixes.

## Recommended first demo path

1. Open the live prototype.
2. Confirm the phone clock shows demo time `10:00`.
3. Open Chat and ask: `When is the next bus to FKE?`
4. Open Bus Timetable, search `FKE`, and open the BAS G route timetable.
5. Ask: `How do I get from KTDI to P19 FKE?`
6. Open Feedback, submit a report, then show it in Staff Demo.
7. In Staff Demo, toggle BAS A1/A2 delayed and show the resolution proof.
8. Open Alerts and show the subscribed BAS A delay notification.

## Important data note

This is an academic prototype. Public route names and stop sequences are aligned to UTM/DVC/KDOJ route listings where available. Timetable values, ETA, delay duration, walking notes, and unresolved faculty mappings are configured prototype estimates. Do not present those values as official live shuttle data.

![Home screen](https://kang2000.github.io/MECS0033-52-Group5Asg1/manual_screenshots_annotated/01-home-overview.png)
