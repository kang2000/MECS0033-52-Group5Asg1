# Data Accuracy and Scope

This page explains what the prototype data means. Use this wording during presentation to avoid overstating prototype values.

## Short explanation

TransitAI UTM uses public route names and stop sequences where available. Timetable times, arrival estimates, delay duration, walking notes, and some faculty aliases are configured prototype estimates. The prototype does not connect to a live UTM shuttle GPS feed or official live timetable API.

## Data status table

| Data shown in app | Status | How to explain it |
| --- | --- | --- |
| BAS A/B/C/D/E/F/G/H route names | Public-list aligned | Route labels are based on public UTM/DVC/KDOJ route listings where available. |
| Route stop sequences | Public-list aligned where available | Used to demonstrate route matching and ordered-stop reasoning. |
| Stop labels such as CP, KP, KDOJ, KTDI, N24, P19 | Public stop labels where available | Used as known campus shuttle stop codes in the prototype. |
| FKE mapping | Partially verified | Mapped to P19 / FKE Area because public listings include P19 and FKE-area references. Production should confirm the exact shelter. |
| FC mapping | Prototype alias | Mapped to N24 / Cluster Area for the report demo because an exact current FC shuttle stop mapping was not verified. |
| PSZ Library | Landmark only | The app identifies PSZ as a campus landmark but does not invent a direct route stop. |
| First bus / last bus / frequency | Prototype estimate | Generated from configured route operating windows and headways. |
| Next bus time | Prototype estimate | Calculated from demo/live time and configured headway. |
| ETA | Prototype estimate | Adjusted from timetable values; not live GPS. |
| Delay alert | Prototype simulation | Triggered by the Staff Demo toggle to demonstrate the proof and notification flow. |
| Walking notes | Prototype guidance | Helpful text for demo; should be verified before production use. |

## Sources recorded in the prototype

The knowledge base records these source URLs:

| Source | Purpose |
| --- | --- |
| UTM DVC Development shuttle bus schedule announcement | Public route and schedule reference. |
| KDOJ UTM Bus Schedule route list | Public route and stop sequence reference. |
| UTM JB 2025 shuttle timetable PDF | Public timetable reference checked for the prototype. |

The app source note says public route sources were checked on 2 July 2026.

## What is not included

The prototype does not include:

- Live bus GPS tracking.
- Firebase or a database backend.
- Real user accounts.
- Real staff authentication.
- Official production route management.
- Push notifications outside the page.
- Official guarantee that a bus is currently operating.

These are outside the assignment's 10 percent proof-of-concept scope.

## Why demo time exists

Without demo time, a night presentation would show all routes as closed. Staff Demo solves this by letting the presenter choose a fixed time such as `10:00`.

Use this explanation:

> The prototype can use live device time, but it defaults to demo time so the marker can repeatedly inspect active route behavior during presentation.

## How the app avoids misleading the user

| Risk | App behavior |
| --- | --- |
| User assumes ETA is official | Cards include data-source notes and time-basis labels. |
| User asks for unverified landmark route | App avoids inventing unsupported direct routes. |
| Staff delays unrelated route | Alerts only show routes subscribed by the demo user. |
| Route direction is wrong | Route guidance checks ordered stop sequence. |
