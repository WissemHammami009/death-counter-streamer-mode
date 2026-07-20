# OBS Death Counter

A lightweight **OBS browser-source death counter** for streamers with **global hotkeys**—no browser focus required.

![Platform](https://img.shields.io/badge/Platform-Windows-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![OBS](https://img.shields.io/badge/OBS-Browser%20Source-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🎮 Works while your game is focused
- ⌨️ Global keyboard shortcuts
- 📺 Real-time updates in OBS
- 💾 Automatically saves the counter
- 🎨 Fully customizable HTML/CSS overlay
- ⚡ Lightweight and easy to set up

---

## 📦 Installation

Clone the repository or download the latest release.

```bash
git clone https://github.com/wissemhammami009/death-counter-streamer-mode.git
cd death-counter-streamer-mode
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

The server will start at:

```
http://127.0.0.1:3000
```

---

## 🎥 OBS Setup

1. Open **OBS Studio**
2. Add a **Browser Source**
3. Set the URL to:

```
http://127.0.0.1:3000
```

Suggested settings:

- Width: **500**
- Height: **180**
- FPS: **60**

Leave the Node.js application running while streaming.

---

## ⌨️ Global Hotkeys

| Key | Action |
|------|--------|
| `=` | Increase deaths |
| `Numpad +` | Increase deaths |
| `-` | Decrease deaths |
| `F10` | Reset counter |

These shortcuts work **without focusing the browser**, allowing you to update the counter while playing.

---

## 💾 Persistent Storage

The counter is automatically saved to:

```
counter.json
```

Closing and reopening the application preserves the current death count.


---

## 📁 Project Structure

```
death-counter-streamer-mode/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── counter.json
├── package.json
└── README.md
```


---
## 📸 Screenshots

<p align="center">
  <img src="screenshots/image%201.png" alt="Overlay Preview" width="47%">
  <img src="screenshots/image%20OBS.png" alt="OBS Preview" width="47%">
</p>


---

## 🎨 Customization

The overlay is built with standard web technologies.

- Edit **public/style.css** to customize the appearance.
- Edit **public/index.html** to modify the layout.
- Edit **public/script.js** to add animations or additional functionality.

---

## 📄 License

This project is licensed under the MIT License.