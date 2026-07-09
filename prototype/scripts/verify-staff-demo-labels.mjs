import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const prototypeDir = path.resolve(here, "..");

function read(rel) {
  return fs.readFileSync(path.join(prototypeDir, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const index = read("index.html");
const readme = read("README.md");
const demo = read("DEMO_SCRIPT.md");
const manual = read("ADMIN_MANUAL.md");

assert(index.includes("Staff Demo"), "index.html should label the in-app control tab as Staff Demo.");
assert(index.includes("Staff Control Panel"), "index.html should title the in-app control screen as Staff Control Panel.");
assert(!index.includes("<span>Admin</span>"), "index.html should not label the bottom tab Admin.");
assert(!index.includes("Admin / Transport Staff"), "index.html should not title the in-app screen Admin / Transport Staff.");

assert(readme.includes("Staff Demo"), "README should describe the in-app control surface as Staff Demo.");
assert(demo.includes("Staff Demo"), "DEMO_SCRIPT should use Staff Demo for the in-app control surface.");
assert(manual.includes("Staff Demo"), "ADMIN_MANUAL.md should distinguish Staff Demo from the separate Administrator Manual.");

console.log("Staff Demo label verification passed.");
