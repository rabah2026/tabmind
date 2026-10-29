# TabMind 🧠 — Local AI Tab Assistant

<p align="center">
  <a href="https://chromewebstore.google.com/detail/tabmind-local-ai-tab-assi/hnphfoholpninokgckbkdbbpmhffdkla">
    <img src="https://img.shields.io/badge/Chrome%20Web%20Store-Available%20Now-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Available in the Chrome Web Store" />
  </a>
  <a href="https://chromewebstore.google.com/detail/tabmind-local-ai-tab-assi/hnphfoholpninokgckbkdbbpmhffdkla">
    <img src="https://img.shields.io/chrome-web-store/v/hnphfoholpninokgckbkdbbpmhffdkla?style=for-the-badge&logo=googlechrome&logoColor=white&color=blue" alt="Chrome Web Store Version" />
  </a>
  <a href="https://chromewebstore.google.com/detail/tabmind-local-ai-tab-assi/hnphfoholpninokgckbkdbbpmhffdkla">
    <img src="https://img.shields.io/chrome-web-store/users/hnphfoholpninokgckbkdbbpmhffdkla?style=for-the-badge&color=green" alt="Chrome Web Store Users" />
  </a>
  <a href="https://github.com/rabah2026/tabmind/blob/main/PRIVACY.md">
    <img src="https://img.shields.io/badge/Privacy-100%25%20On--Device-success?style=for-the-badge&logo=shield" alt="100% Local & Private" />
  </a>
</p>

> **A clean, direct Chrome extension with one single purpose:** A sidebar AI assistant that interacts with your open browser tabs using **100% local, on-device LLMs**.

Zero external cloud API keys, zero tracking, and zero telemetry. Everything runs on your machine.

---

## 🚀 Quick Start & Installation

### Option 1: Install from Chrome Web Store (Recommended)

Get the latest stable release directly with automatic updates:

👉 [**Add TabMind to Chrome (Chrome Web Store)**](https://chromewebstore.google.com/detail/tabmind-local-ai-tab-assi/hnphfoholpninokgckbkdbbpmhffdkla)

---

### Option 2: Load Unpacked from Source (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/rabah2026/tabmind.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left.
5. Select the `tabmind` directory.
6. Pin **TabMind** to your Chrome toolbar and click the icon to open the side panel!

---

## ✨ Features

- **🎯 Per-Tab Isolated Sessions**: Each tab gets its own clean, independent sidebar session. Opening a new tab gives you a fresh start automatically, without clutter from previous tabs.
- **⚡ Full Chrome Skills Catalog (`/` Command)**: Reuse over 40+ specialized prompt templates categorized by function:
  - **Understand**: *Summarize as text*, *Explain simply*, *Create an outline*, *Action items*, *Quotes*, *Build timeline*, *Opposing view*, *Summarize as table*, *Check reading level*, *Executive summary*, *What's in this?*, *Protein max*, *Meal planner*, *Make grocery list*.
  - **Research**: *Research a company*, *Prep for meeting*, *Prep for today*, *Generate citations*, *Check job fit*, *Weekly work review*.
  - **Shopping**: *Buying advice*, *Summarize reviews*, *Identify specs*, *Price per unit*, *Check returns*, *Sizing help*, *Check warranty*, *Rate as gift*, *Compare open tabs*, *Gift concierge*, *Shop for clothes & accessories*.
  - **Writing**: *Draft a professional email*, *Suggest replies*, *Translate text*, *Correct grammar*, *Shorten text*, *Rewrite with a friendly tone*, *Find synonyms*, *Explain slang or jargon*.
  - **Learning**: *Learn with flashcards*, *Make a quiz*, *Deep questions*, *Study guide*, *Break it down*.
  - **Fun**: *Hype it up!*, *Fun facts*, *Explain something in character*, *Dramatize content*.
- **🔍 Search & Filter Skills**: Instant search bar and category tabs (`All`, `Understand`, `Research`, `Shopping`, `Writing`, `Learning`, `Fun`, `Your skills`).
- **➕ Custom Skills**: Create, edit, and delete your own custom skills with specific instructions via the **"Add skill"** dialog.
- **🟣 Gemini Nano Out-of-the-Box (Default)**: Uses Chrome's built-in Prompt API by default with zero external server setup. When enabled, your first question automatically triggers Chrome to download local model weights (~2–3.5 GB) with real-time percentage progress displayed in chat.
- **🌐 Supported Languages**: Optimized for English (`en`), with native multilingual support for Spanish (`es`), Japanese (`ja`), French (`fr`), and German (`de`).
- **🚀 First-Time Interactive Onboarding**: A 3-step quick tour guides new users through private on-device intelligence, Gemini Nano capabilities, and command shortcuts. Re-open anytime with the `?` Help button.
- **🔒 100% Local & Private**: No data leaves your computer. Supports Chrome Built-in AI, Ollama, and LM Studio.
- **📑 Tab Auto-Tracking**: Automatically detects the active tab or type `@` to switch target tabs.
- **✨ Highlighted Text Awareness**: When you highlight text on a webpage, TabMind detects the excerpt for targeted questions.
- **🎨 Native Chrome Side Panel Aesthetic**: Matches Chrome's clean Ask Gemini interface with dark and light mode support.

---

## ⚡ Using Skills

- **Slash Command**: Type `/` directly into the chat input to open the Skills browser.
- **Toolbar Button**: Click the **`⚡ Skills`** button inside the input dock.
- **Category & Search**: Use category pills or the search box to find any of the 40+ built-in skills.
- **Add Custom Skill**: In the Skills menu, click **`+ Add skill`** to define your own prompt template.
- **Tab Context**: Type `@` or click **`+ Tab`** to switch between the active tab and other open tabs.


---

## 🛠️ Gemini Nano Verification & Windows Setup Guide

If you are setting up TabMind on a new Windows device:

### 1. Windows Launch Fix (If Flags Are Hidden in UI)
If Chrome hides experimental flags under `chrome://flags`:
1. Close all Chrome windows.
2. Press `Win + R`, paste the command below, and press Enter:
   ```cmd
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --enable-features=OptimizationGuideOnDeviceModel,PromptAPIForGeminiNano
   ```

### 2. How to Verify Gemini Nano Is Connected
You can confirm that Chrome Built-in AI is active and connected using any of these 3 methods:

* **Method A: In-App 1-Click Ping (Easiest)**
  - In TabMind sidebar, click the **Gear (⚙️)** icon in the top header.
  - Scroll down and click **🔌 Ping Engine**.
  - If connected, you will see a green checkmark: `✔ Chrome Built-in AI (Gemini Nano) is ready!` (or `ready to download on first prompt`).

* **Method B: Chrome Developer Console**
  - Press `F12` on any webpage and go to the **Console** tab.
  - Run:
    ```javascript
    await LanguageModel.availability();
    ```
  - Output meanings:
    - `'readily'` → Connected and weights downloaded! Ready for instant inference.
    - `'after-download'` → Connected! Submitting your first query will trigger the one-time background download.
    - `'no'` → Features not enabled or disk space < 22 GB.

* **Method C: Chrome Internal Dashboard**
  - Navigate to `chrome://on-device-internals` in your URL bar.
  - Click **Model Status** to see the exact downloaded model path and real-time inference capability.
