# OBS Death Counter

## Install

1. Install Node.js.
2. Open this folder in Command Prompt or PowerShell.
3. Run:

   npm install
   npm start

## Add it to OBS

1. Add a **Browser Source**.
2. Use this URL:

   http://127.0.0.1:3000

3. Suggested size: 500 × 160.
4. Leave the Node.js window running while streaming.

## Global shortcuts

- `=` or numeric keypad `+`: add one death
- `-`: remove one death
- `F10`: reset to zero

The counter is stored in `counter.json`, so restarting the program keeps the latest value.

## Game/admin note

If a game is running as Administrator, Windows may block input hooks from a
normal process. In that case, launch Command Prompt or PowerShell as
Administrator before running `npm start`.