const express = require("express");
const fs = require("fs");
const path = require("path");
const { uIOhook, UiohookKey } = require("uiohook-napi");

const app = express();
const PORT = 3000;

/*
 * pkg stores bundled files inside a read-only snapshot.
 *
 * __dirname:
 * - Normal Node.js: actual project folder
 * - Packaged app: internal pkg snapshot folder
 *
 * process.execPath:
 * - Packaged app: path to death-counter.exe
 */
const isPackaged = Boolean(process.pkg);

const PUBLIC_FOLDER = path.join(__dirname, "public");

const WRITABLE_FOLDER = isPackaged
  ? path.dirname(process.execPath)
  : __dirname;

const DATA_FILE = path.join(WRITABLE_FOLDER, "counter.json");

// Main keyboard "=" key and numeric keypad "+" key.
const EQUAL_KEY =
  UiohookKey.Equal ??
  UiohookKey.Equals ??
  13;

const NUMPAD_PLUS_KEY =
  UiohookKey.NumpadAdd ??
  UiohookKey.Add ??
  14;

const MINUS_KEY =
  UiohookKey.Minus ??
  12;

const RESET_KEY = UiohookKey.F10;

let counter = loadCounter();

const clients = new Set();
const pressedKeys = new Set();

/**
 * Create the counter file when it does not exist.
 */
function createCounterFile() {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ counter: 0 }, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Unable to create counter.json:", error.message);
  }
}

/**
 * Load the saved counter value.
 */
function loadCounter() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      createCounterFile();
      return 0;
    }

    const fileContent = fs.readFileSync(DATA_FILE, "utf8");
    const savedData = JSON.parse(fileContent);

    if (
      Number.isInteger(savedData.counter) &&
      savedData.counter >= 0
    ) {
      return savedData.counter;
    }

    return 0;
  } catch (error) {
    console.error("Unable to load counter.json:", error.message);
    return 0;
  }
}

/**
 * Save the current counter value.
 */
function saveCounter() {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ counter }, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Unable to save counter:", error.message);
  }
}

/**
 * Send the current counter value to every connected browser source.
 */
function broadcast() {
  const payload = `data: ${JSON.stringify({ counter })}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

/**
 * Increase or decrease the counter.
 */
function changeCounter(amount) {
  counter = Math.max(0, counter + amount);

  saveCounter();
  broadcast();

  console.log(`Deaths: ${counter}`);
}

/**
 * Reset the counter.
 */
function resetCounter() {
  counter = 0;

  saveCounter();
  broadcast();

  console.log("Deaths reset to 0");
}

/*
 * Express configuration
 */
app.use(express.json());

app.use(
  express.static(PUBLIC_FOLDER, {
    index: "index.html"
  })
);

/*
 * Explicit root route.
 *
 * This prevents "Cannot GET /" when running the packaged executable.
 */
app.get("/", (_req, res) => {
  const indexFile = path.join(PUBLIC_FOLDER, "index.html");

  if (!fs.existsSync(indexFile)) {
    console.error(`index.html was not found at: ${indexFile}`);

    return res.status(500).send(`
      <h1>OBS Death Counter</h1>
      <p>The interface files could not be found.</p>
      <p>Rebuild the executable and make sure public/**/* is included in pkg assets.</p>
    `);
  }

  return res.sendFile(indexFile);
});

/*
 * Server-Sent Events connection.
 */
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  clients.add(res);

  res.write(
    `data: ${JSON.stringify({ counter })}\n\n`
  );

  const heartbeat = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(res);
    res.end();
  });
});

/*
 * API routes
 */
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
  resetCounter();
  res.json({ counter });
});

/*
 * Global keyboard shortcuts
 */
uIOhook.on("keydown", event => {
  // Avoid repeated changes while the key is held down.
  if (pressedKeys.has(event.keycode)) {
    return;
  }

  pressedKeys.add(event.keycode);

  const isIncrementKey =
    event.keycode === EQUAL_KEY ||
    event.keycode === NUMPAD_PLUS_KEY;

  if (isIncrementKey) {
    changeCounter(1);
    return;
  }

  if (event.keycode === MINUS_KEY) {
    changeCounter(-1);
    return;
  }

  if (event.keycode === RESET_KEY) {
    resetCounter();
  }
});

uIOhook.on("keyup", event => {
  pressedKeys.delete(event.keycode);
});

/*
 * Graceful shutdown
 */
function shutdown() {
  console.log("\nStopping Death Counter...");

  try {
    uIOhook.stop();
  } catch (error) {
    console.error("Unable to stop keyboard hook:", error.message);
  }

  for (const client of clients) {
    try {
      client.end();
    } catch {
      // Ignore clients that are already disconnected.
    }
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", error => {
  console.error("Unexpected application error:", error);
});

process.on("unhandledRejection", error => {
  console.error("Unhandled promise rejection:", error);
});

/*
 * Start server
 */
app.listen(PORT, "127.0.0.1", () => {
  console.log("----------------------------------------");
  console.log("OBS Death Counter");
  console.log("----------------------------------------");
  console.log(`URL: http://127.0.0.1:${PORT}`);
  console.log(`Public folder: ${PUBLIC_FOLDER}`);
  console.log(`Counter file: ${DATA_FILE}`);
  console.log(`Packaged: ${isPackaged ? "Yes" : "No"}`);
  console.log("");
  console.log("Global shortcuts:");
  console.log("  = or Numpad + : Increase");
  console.log("  -             : Decrease");
  console.log("  F10           : Reset");
  console.log("----------------------------------------");
});

try {
  uIOhook.start();
} catch (error) {
  console.error("Unable to start global keyboard hooks:");
  console.error(error);
  process.exit(1);
}