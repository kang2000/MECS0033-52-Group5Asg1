# TransitAI UTM Demo Video Speaking Script

Video file: `transitai-full-demo-staff-report-20260703-001.mp4`
Total duration: 2 minutes 15.92 seconds
Recommended pace: natural presentation speed. If you fall behind, keep the key phrases: intent recognition, source boundary, full-day timetable, subscription filtering, staff report, resolution proof, and ETA alert.

| Time | What is shown | What to say |
|---|---|---|
| 00:00-00:10 | Home screen, phone frame, clock, bus image, main cards | "This is TransitAI UTM, a mobile-style campus transport assistant. The home screen shows the main actions: plan a trip, check timetable, view alerts, and report an issue." |
| 00:10-00:22 | Chat tab, schedule question and AI pipeline | "First, I ask when is the next bus to FKE. The system classifies it as a schedule inquiry and shows the confidence score in the AI panel." |
| 00:22-00:34 | Schedule answer card with timing and source note | "The answer gives the route, next departure, service window, frequency, time basis, and source note. This separates public route data from prototype timing estimates." |
| 00:34-00:46 | Route guidance and follow-up memory | "Next, I ask for route guidance from KTDI to P19 FKE. The assistant checks the ordered stop sequence and also supports follow-up questions using conversation memory." |
| 00:46-00:58 | Arrival ETA and bus stop detail flow | "The same chat flow can answer arrival questions and open a bus stop detail screen, showing routes, data status, facilities, and walking guidance." |
| 00:58-01:11 | Timetable search and full-day route timetable | "Now I open the timetable page and search FKE. The route result shows timing details, and tapping it opens a full-day route timetable." |
| 01:11-01:24 | Full-day timetable groups and Alerts page | "The timetable is grouped into morning, afternoon, and evening departures. Then the Alerts page shows that notifications are controlled by route subscription." |
| 01:24-01:36 | Unsubscribed delay hidden, then subscription enabled | "A delayed route that Ali has not subscribed to stays hidden. After turning on that route subscription, the delayed route becomes visible as an alert." |
| 01:36-01:48 | Feedback form and submitted issue | "Students can report unresolved transport problems. Here I submit a bus did not arrive report, and the prototype logs it for staff follow-up." |
| 01:48-02:00 | Staff Demo reported issue and controls | "In Staff Demo, the same passenger report appears under reported issues with priority, timestamp, and details. This gives staff an administrator view." |
| 02:00-02:10 | BAS A delay toggle and resolution proof trace | "Staff then mark BAS A delayed. The resolution-refutation proof derives NotifyUser ali route A delay from the delay fact, subscription fact, and knowledge-base rules." |
| 02:10-02:15.92 | Final subscribed alert with ETA | "Finally, the subscribed BAS A alert appears with ETA and route timing. This completes the AI-to-notification workflow." |

## Short Backup Version

If the lecturer asks you to shorten the narration, use this version:

"This demo shows TransitAI UTM as a campus transport assistant. It accepts natural student questions, classifies intent, retrieves route and stop knowledge, and displays grounded answers with source notes. The timetable page supports search and full-day route schedules, while the alerts page only shows delays for subscribed routes. The feedback page lets passengers report issues, and Staff Demo shows those reports for follow-up. When staff mark BAS A delayed, the resolution proof derives NotifyUser(ali, route_a, delay), and the subscribed alert appears with schedule and estimated ETA. This shows the AI concept, the transport problem-solving workflow, and the administrator process required by the rubric."
