# TabMind 🧠 — Local AI Tab Assistant

> **A clean, direct Chrome extension with one single purpose:** A sidebar AI assistant that interacts with your open browser tabs using **100% local, on-device LLMs**.

Zero external cloud API keys, zero tracking, and zero telemetry. Everything runs on your machine.

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

## 🚀 Quick Start & Installation

### 1. Load the Extension into Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button in the top-left.
4. Select the project folder (`tabmind`).
5. Pin **TabMind** to your Chrome toolbar and click the icon to open the side panel!

---

## ⚡ Using Skills

- **Slash Command**: Type `/` directly into the chat input to open the Skills browser.
- **Toolbar Button**: Click the **`⚡ Skills`** button inside the input dock.
- **Category & Search**: Use category pills or the search box to find any of the 40+ built-in skills.
- **Add Custom Skill**: In the Skills menu, click **`+ Add skill`** to define your own prompt template.
- **Tab Context**: Type `@` or click **`+ Tab`** to switch between the active tab and other open tabs.
