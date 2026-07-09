# Troubleshooting

Use this page when the prototype does not behave as expected during demo or review.

## Quick checks

| Check | Expected result |
| --- | --- |
| Live site opens | The phone-style Home screen appears. |
| Phone clock visible | Top-right status bar shows demo time. |
| Demo time | Staff Demo should show `10:00` for the main demo. |
| AI panel visible | Right-side panel says "What the AI just did". |
| Staff Demo tab visible | Bottom navigation has Staff Demo. |

## Problems and fixes

| Problem | Likely cause | Fix |
| --- | --- | --- |
| All routes show closed | Demo/live time is outside service window. | Staff Demo -> Demo time -> choose `10:00`. |
| No delay alert appears | Ali is not subscribed to that route. | Turn on the route subscription or use BAS A. |
| BAS G delay is hidden | This is expected if Ali is not subscribed. | Explain subscription filtering. |
| Proof does not derive notification | Missing subscription or delay fact. | Make sure BAS A is subscribed and delayed. |
| Feedback report not shown in Staff Demo | Staff Demo has not been opened after submission. | Open Staff Demo again to refresh reported issues. |
| Search returns no timetable route | Search term does not match stored route/stop aliases. | Try `FKE`, `P19`, `FC`, `N24`, `CP`, `KTDI`, or `BAS G`. |
| Route guidance gives no direct route | Stored stop order does not support that direction. | Try a route where origin comes before destination, or explain interchange needed. |
| Teacher asks if ETA is real | ETA is a prototype estimate. | State the data boundary clearly. |
| Page looks stale after push | GitHub Pages cache has not refreshed. | Wait one minute and hard refresh the browser. |
| Local file has browser restrictions | Some browser features can differ under `file://`. | Use `python3 -m http.server 8000` from `prototype/`. |

## Resetting the demo

If the page state becomes confusing:

1. Refresh the browser.
2. Set demo time to `10:00`.
3. Turn BAS A subscription on.
4. Turn unrelated route subscriptions off if you want a clean alert demo.
5. Toggle BAS A delayed only when you are ready to show proof and Alerts.

## Known limitations

| Limitation | Explanation |
| --- | --- |
| No login | The prototype uses a fixed demo user, Ali. |
| No backend | Everything runs in browser memory. Refreshing resets session-only state. |
| No live shuttle feed | Timetable and ETA values are configured estimates. |
| No official push notification | Alerts appear inside the prototype only. |
| No production admin security | Staff Demo is for marking and proof demonstration. |
