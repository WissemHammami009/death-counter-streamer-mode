# OBS Death Counter

A lightweight **OBS browser-source death counter** for streamers with **global hotkeys**—no browser focus required.

![Platform](https://img.shields.io/badge/Platform-Windows-blue)
![OBS](https://img.shields.io/badge/OBS-Browser%20Source-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🎮 Works while your game is focused
- ⌨️ Global keyboard shortcuts
- 📺 Real-time updates in OBS
- 💾 Automatically saves the counter
- 🖥️ Standalone Windows executable available
- 🎨 Fully customizable HTML/CSS overlay
- ⚡ Lightweight and easy to set up

---

## 🚀 Quick Start (Windows)

Download the latest **Death Counter.exe** from the **Releases** page.

1. Download **Death Counter.exe** from the latest release.
2. Launch the executable.
3. The local server will automatically start.
4. Open **OBS Studio** and add a **Browser Source**.
5. Use the following URL:

```
http://127.0.0.1:3000
```

No installation or Node.js runtime is required.

---

## 🎥 OBS Setup

1. Open **OBS Studio**.
2. Add a new **Browser Source**.
3. Set the URL to:

```
http://127.0.0.1:3000
```

Recommended settings:

- Width: **500**
- Height: **180**
- FPS: **60**

> **Note:** The application (or `npm start` when running from source) must remain running while using the Browser Source.

---

## ⌨️ Global Hotkeys

| Key | Action |
|------|--------|
| `=` | Increase deaths |
| `Numpad +` | Increase deaths |
| `-` | Decrease deaths |
| `F10` | Reset counter |

The hotkeys work globally, allowing you to update the counter while your game remains focused.

---

## 💾 Persistent Storage

The current counter is automatically saved to:

```
counter.json
```

When the application is restarted, the previous counter value is restored automatically.

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/image%201.png" alt="Overlay Preview" width="47%">
  <img src="screenshots/image%20OBS.png" alt="OBS Preview" width="47%">
</p>

---

## 🛠️ Development

If you want to modify or contribute to the project:

Clone the repository:

```bash
git clone https://github.com/wissemhammami009/death-counter-streamer-mode.git
cd death-counter-streamer-mode
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

The local server will be available at:

```
http://127.0.0.1:3000
```

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
├── screenshots/
│   ├── image 1.png
│   └── image OBS.png
│
├── server.js
├── counter.json
├── package.json
├── LICENSE
└── README.md
```

---

## 🎨 Customization

The overlay is built using standard web technologies.

- Edit **public/style.css** to customize the appearance.
- Edit **public/index.html** to change the layout.
- Edit **public/script.js** to add animations or additional functionality.
- Modify **server.js** to customize keyboard shortcuts or application behavior.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome.

If you have an idea for an improvement, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.