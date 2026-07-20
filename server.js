const express = require("express");
const fs = require("fs");
const path = require("path");
const { uIOhook, UiohookKey } = require("uiohook-napi");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "counter.json");

// Main keyboard "=" key and numeric keypad "+" key.
// Numeric fallbacks correspond to libuiohook VC_EQUALS and VC_ADD.
const EQUAL_KEY = UiohookKey.Equal ?? UiohookKey.Equals ?? 13;
const NUMPAD_PLUS_KEY = UiohookKey.NumpadAdd ?? UiohookKey.Add ?? 14;
const MINUS_KEY = UiohookKey.Minus ?? 12;
const RESET_KEY = UiohookKey.F10;

let counter = loadCounter();
const clients = new Set();
const pressedKeys = new Set();

function loadCounter() {
  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Number.isInteger(saved.counter) && saved.counter >= 0
      ? saved.counter
      : 0;
  } catch {
    return 0;
  }
}

function saveCounter() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ counter }, null, 2));
}

function broadcast() {
  const payload = `data: ${JSON.stringify({ counter })}\n\n`;

  for (const client of clients) {
    client.write(payload);
  }
}

function changeCounter(amount) {
  counter = Math.max(0, counter + amount);
  saveCounter();
  broadcast();
  console.log(`Deaths: ${counter}`);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.add(res);
  res.write(`data: ${JSON.stringify({ counter })}\n\n`);

  req.on("close", () => {
    clients.delete(res);
  });
});

app.get("/api/counter", (_req, res) => {
  res.json({ counter });
});

app.post("/api/increment", (_req, res) => {
  changeCounter(1);
  res.json({ counter });
});

app.post("/api/decrement", (_req, res) => {
  changeCounter(-1);
  res.json({ counter });
});

app.post("/api/reset", (_req, res) => {
  counter = 0;
  saveCounter();
  broadcast();
  res.json({ counter });
});

uIOhook.on("keydown", event => {
  // Prevent one physical key press from repeating rapidly while held.
  if (pressedKeys.has(event.keycode)) return;
  pressedKeys.add(event.keycode);

  const isEqualOrPlus =
    event.keycode === EQUAL_KEY ||
    event.keycode === NUMPAD_PLUS_KEY;

  if (isEqualOrPlus) {
    changeCounter(1);
  } else if (event.keycode === MINUS_KEY) {
    changeCounter(-1);
  } else if (event.keycode === RESET_KEY) {
    counter = 0;
    saveCounter();
    broadcast();
    console.log("Deaths reset to 0");
  }
});

uIOhook.on("keyup", event => {
  pressedKeys.delete(event.keycode);
});

process.on("SIGINT", () => {
  uIOhook.stop();
  process.exit(0);
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Death Counter running at http://127.0.0.1:${PORT}`);
  console.log("Global shortcuts:");
  console.log("  = or numpad + : increment");
  console.log("  -             : decrement");
  console.log("  F10           : reset");
});

uIOhook.start();