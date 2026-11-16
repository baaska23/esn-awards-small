// npm run dev:xcode — open the site in Safari on the Xcode iOS Simulator.
// Starts the dev server unless one is already running on the port.
// Pick a device with SIM_DEVICE="iPhone 17 Pro"; pick a page with: npm run dev:xcode -- /pc-player
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

const DEFAULT_DEVICE = "iPhone 17";
const port = process.env.PORT || "3000";
const page = (process.argv[2] || "").replace(/^\/?/, "/").replace(/\/$/, "");
const url = `http://localhost:${port}/mea${page}`;

function simctl(...args) {
  return execFileSync("xcrun", ["simctl", ...args], { encoding: "utf8" });
}

// The one named in SIM_DEVICE, else iPhone 17, else the first available iPhone.
function pickDevice() {
  const { devices } = JSON.parse(simctl("list", "devices", "available", "-j"));
  const iphones = Object.values(devices).flat().filter((d) => d.name.startsWith("iPhone"));
  const wanted = process.env.SIM_DEVICE;
  if (wanted) {
    const match = iphones.find((d) => d.name.toLowerCase() === wanted.toLowerCase());
    if (!match) {
      console.error(`No simulator named "${wanted}". Available: ${iphones.map((d) => d.name).join(", ")}`);
      process.exit(1);
    }
    return match;
  }
  return iphones.find((d) => d.name === DEFAULT_DEVICE) ?? iphones[0];
}

// The simulator window: Simulator.app on older Xcode, DeviceHub.app on newer ones.
function openSimulatorWindow() {
  const developerDir = execFileSync("xcode-select", ["-p"], { encoding: "utf8" }).trim();
  const candidates = [
    join(developerDir, "Applications", "Simulator.app"),
    join(dirname(developerDir), "Applications", "DeviceHub.app"),
  ];
  const app = candidates.find(existsSync);
  if (app) spawnSync("open", [app]);
  else console.warn("Could not find the Simulator window app; open it from Xcode → Open Developer Tool.");
}

async function serverIsUp() {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

let device;
try {
  device = pickDevice();
} catch {
  console.error("Could not list simulators. Is Xcode installed? (xcrun simctl)");
  process.exit(1);
}
if (!device) {
  console.error("No iPhone simulator is installed. Add one in Xcode → Settings → Components.");
  process.exit(1);
}

console.log(`\n  Simulator: ${device.name}\n  Opening:   ${url}\n`);
if (device.state !== "Booted") simctl("boot", device.udid);
openSimulatorWindow();
simctl("bootstatus", device.udid, "-b");

let server = null;
if (await serverIsUp()) {
  console.log(`  Dev server already running on port ${port}; reusing it.\n`);
} else {
  server = spawn("npx", ["next", "dev", "--turbopack", "-p", port], { stdio: "inherit" });
  server.on("exit", (code) => process.exit(code ?? 0));
  const deadline = Date.now() + 60_000;
  while (!(await serverIsUp())) {
    if (Date.now() > deadline) {
      console.error("Dev server did not start within 60 seconds.");
      server.kill();
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

simctl("openurl", device.udid, url);
