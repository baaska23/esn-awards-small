// npm run dev:phone — start the dev server on the local network and print a QR code
// so a phone on the same Wi-Fi can open the site.
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
import qrcode from "qrcode-terminal";

const port = process.env.PORT || "3000";

// First non-internal IPv4 address, preferring Wi-Fi/Ethernet (en0, en1, …).
function lanAddress() {
  const candidates = Object.entries(networkInterfaces())
    .flatMap(([name, addrs]) => (addrs ?? []).map((a) => ({ name, ...a })))
    .filter((a) => a.family === "IPv4" && !a.internal);
  candidates.sort((a, b) => Number(!a.name.startsWith("en")) - Number(!b.name.startsWith("en")));
  return candidates[0]?.address;
}

const ip = lanAddress();
if (!ip) {
  console.error("No local network address found. Are you connected to Wi-Fi?");
  process.exit(1);
}

const url = `http://${ip}:${port}/mea`;
console.log(`\n  Open on your phone (same Wi-Fi):  ${url}\n`);
qrcode.generate(url, { small: true });

const child = spawn("npx", ["next", "dev", "--turbopack", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  // Lets next.config.ts allow dev requests coming from the phone's view of this address.
  env: { ...process.env, DEV_ORIGIN: ip },
});
child.on("exit", (code) => process.exit(code ?? 0));
