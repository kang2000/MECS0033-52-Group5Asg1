from math import atan2, cos, hypot, pi, sin
from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont


BASE = Path(__file__).resolve().parents[1]
SRC = BASE / "manual_screenshots"
OUT = BASE / "manual_screenshots_annotated"

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


BODY_FONT = font(17)


def arrow(draw, start, end, width=2, gap=26):
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dist = hypot(dx, dy)
    if dist > gap + 8:
        tip = (end[0] - dx / dist * gap, end[1] - dy / dist * gap)
    else:
        tip = end
    draw.line([start, tip], fill=BLACK, width=width)
    angle = atan2(end[1] - start[1], end[0] - start[0])
    length = 14
    spread = pi / 7
    points = [
        tip,
        (tip[0] - length * cos(angle - spread), tip[1] - length * sin(angle - spread)),
        (tip[0] - length * cos(angle + spread), tip[1] - length * sin(angle + spread)),
    ]
    draw.polygon(points, fill=BLACK)


def anchor_for(box, target):
    x, y, w, h = box
    tx, ty = target
    if tx < x:
        return (x, max(y + 8, min(y + h - 8, ty)))
    if tx > x + w:
        return (x + w, max(y + 8, min(y + h - 8, ty)))
    if ty < y:
        return (max(x + 8, min(x + w - 8, tx)), y)
    if ty > y + h:
        return (max(x + 8, min(x + w - 8, tx)), y + h)
    return (x + w // 2, y + h // 2)


def callout(draw, number, text, box, target):
    x, y, w = box
    label = f"{number}. {text}"
    wrapped = "\n".join(wrap(label, width=max(16, int(w / 8.5))))
    bbox = draw.multiline_textbbox((0, 0), wrapped, font=BODY_FONT, spacing=4)
    h = bbox[3] - bbox[1] + 28
    rect = (x, y, w, h)
    draw.rounded_rectangle([x, y, x + w, y + h], radius=10, fill=WHITE, outline=BLACK, width=3)
    draw.multiline_text((x + 13, y + 12), wrapped, fill=BLACK, font=BODY_FONT, spacing=4)
    arrow(draw, anchor_for(rect, target), target)


ANNOTATIONS = {
    "01-home-overview.png": [
        (1, "demo clock is visible in the phone status bar", (24, 48, 238), (586, 57)),
        (2, "home cards start each user workflow", (24, 440, 238), (313, 497)),
        (3, "AI pipeline panel stays visible for originality evidence", (1014, 28, 240), (998, 58)),
    ],
    "02-chat-schedule.png": [
        (1, "query is classified and confidence is shown", (1012, 74, 248), (760, 121)),
        (2, "answer includes timetable, first bus, last bus and frequency", (22, 332, 248), (312, 405)),
        (3, "source note separates route data from configured timing", (1012, 256, 248), (998, 292)),
    ],
    "03-timetable-search.png": [
        (1, "search filters by route, stop or faculty alias", (22, 118, 248), (330, 237)),
        (2, "route card shows next bus, service window and frequency", (22, 352, 248), (312, 347)),
        (3, "tap a route card to open the full-day timetable", (1012, 344, 248), (580, 318)),
    ],
    "04-route-timetable-detail.png": [
        (1, "summary shows next bus, first bus, last bus and frequency", (22, 186, 248), (476, 324)),
        (2, "ordered stop line confirms route direction", (22, 478, 248), (332, 522)),
        (3, "scroll down to view every departure for the day", (1012, 632, 248), (628, 681)),
    ],
    "04b-route-timetable-times.png": [
        (1, "morning group shows each departure slot", (22, 126, 248), (330, 242)),
        (2, "next bus is highlighted", (1012, 278, 248), (603, 316)),
        (3, "afternoon and evening groups continue below", (1012, 452, 248), (602, 612)),
    ],
    "05-route-guidance.png": [
        (1, "route answer shows origin and destination", (22, 84, 248), (382, 194)),
        (2, "direct route recommendation includes ordered stops", (22, 356, 248), (452, 242)),
        (3, "AI panel records intent and retrieved KB chunks", (1012, 92, 248), (760, 122)),
    ],
    "06-bus-stop-detail.png": [
        (1, "stop detail page opens from a chat request", (22, 104, 248), (420, 194)),
        (2, "data status states what is verified or prototype-mapped", (22, 432, 248), (324, 529)),
        (3, "walking guidance stays cautious", (22, 650, 248), (310, 714)),
    ],
    "07-alerts-subscription-filter.png": [
        (1, "unsubscribed route delays stay hidden", (22, 190, 248), (324, 342)),
        (2, "subscription rows control which routes can notify Ali", (1012, 420, 248), (606, 464)),
    ],
    "08-alerts-after-proof.png": [
        (1, "subscribed BAS A delay becomes a visible alert", (22, 198, 248), (572, 328)),
        (2, "ETA, scheduled time, service window and frequency are shown", (1012, 300, 248), (630, 374)),
        (3, "subscription is ON only for the monitored route", (1012, 598, 248), (642, 625)),
    ],
    "09-feedback-submission.png": [
        (1, "student selects the issue type", (22, 198, 248), (482, 268)),
        (2, "details are logged after submit", (22, 498, 248), (322, 510)),
        (3, "this entry will appear in Staff Control Panel", (1012, 450, 248), (468, 542)),
    ],
    "10-staff-report-feed.png": [
        (1, "staff can change demo time before presenting", (1012, 228, 248), (555, 277)),
        (2, "submitted passenger report appears here for follow-up", (22, 410, 248), (310, 421)),
        (3, "route controls still show next/ETA, service window and frequency", (1012, 588, 248), (487, 623)),
    ],
    "11-resolution-proof.png": [
        (1, "proof trace lists clauses and derived resolvents", (22, 238, 248), (334, 426)),
        (2, "empty clause proves NotifyUser(ali, route_a, delay)", (22, 598, 248), (334, 680)),
        (3, "the Staff Demo tab drives this report Figure 5.2 proof", (1012, 592, 248), (620, 763)),
    ],
}

PROOF_CROP = "11b-resolution-proof-box.png"


def annotate(file_name):
    image = Image.open(SRC / file_name).convert("RGB")
    draw = ImageDraw.Draw(image)
    for number, text, box, target in ANNOTATIONS[file_name]:
        callout(draw, number, text, box, target)
    OUT.mkdir(parents=True, exist_ok=True)
    image.save(OUT / file_name)


def crop_proof_box():
    image = Image.open(SRC / "11-resolution-proof.png").convert("RGB")
    proof_box = image.crop((322, 128, 632, 710))
    proof_box.save(OUT / PROOF_CROP)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.png"):
        old.unlink()
    for file_name in ANNOTATIONS:
        annotate(file_name)
    crop_proof_box()
    print(OUT)


if __name__ == "__main__":
    main()
