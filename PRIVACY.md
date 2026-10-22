# Privacy Policy for TabMind

*Last updated: October 21, 2026*

## Overview
**TabMind** ("we", "our", or "the extension") is a sidebar AI assistant built with a privacy-first architecture. TabMind operates **100% locally on your device**. We do not collect, track, monetize, or transmit your personal data, browser history, or page contents to any remote cloud servers.

---

## 1. Zero External Data Collection & Transmission
* **No Cloud AI / No Remote Servers**: TabMind connects exclusively to your on-device local AI runtimes:
  - **Ollama** running locally on your computer (`http://127.0.0.1:11434` or `http://localhost`)
  - **Chrome Built-in AI** (Gemini Nano via the on-device Prompt API)
  - **LM Studio / Local OpenAI-compatible server** running on your local machine (`http://127.0.0.1:1234`)
* **Zero Telemetry or Analytics**: There are no tracking scripts, analytics SDKs, Google Analytics, or third-party monitoring services embedded in the extension.
* **No Advertising or Monetization of Data**: Your data is never sold, leased, or shared with data brokers, advertisers, or any third party.

---

## 2. Information Accessed & Local Storage

### Webpage Content & Excerpts
* **Purpose**: When you ask a question or activate a skill, TabMind extracts readable text (title, headings, text paragraphs, or user-highlighted excerpts) from your active tab or chosen tabs to supply context to your local LLM model.
* **Processing**: This extraction occurs entirely in memory within your browser sandbox. The content is passed strictly to your chosen local LLM endpoint on your machine and is never transmitted over the internet.

### Local Settings & Chat History
* **Purpose**: To provide a seamless user experience, your preferences (e.g., chosen local engine, custom model names, max context size, custom skills) and conversation history are stored using Chrome's local storage APIs (`chrome.storage.local` and `chrome.storage.session`).
* **Retention**: All data remains strictly on your local disk in your Chrome user profile. You can clear your conversation history at any time using the "Clear Chat" (trash icon) or "New Chat" buttons, or delete all stored data by uninstalling the extension.

---

## 3. Chrome Permissions Use

| Permission | Purpose |
| :--- | :--- |
| `sidePanel` | Allows TabMind to render as an interactive sidebar panel alongside your web browser tabs. |
| `tabs` | Allows TabMind to identify open tab titles, favicons, and IDs so you can target or switch context between tabs. |
| `scripting` | Enables reading visible page text and user-selected excerpts to answer questions about the active tab. |
| `storage` | Stores your local model configurations, UI preferences, and custom skills on your device. |
| `host_permissions` (`<all_urls>`) | Required to read page text from web pages you choose to analyze with your local assistant. |
| `host_permissions` (`http://localhost/*`, `http://127.0.0.1/*`) | Required to communicate with your locally running AI engines (Ollama, LM Studio). |

---

## 4. Third-Party Services
TabMind does not integrate with any third-party APIs, remote AI providers (OpenAI cloud, Anthropic cloud, Google cloud endpoints), or external cloud databases.

---

## 5. Contact & Support
If you have questions, feedback, or concerns regarding this privacy policy or TabMind, please reach out via GitHub or email:
* **Developer**: TabMind Open Source Project
* **Support Email**: support@tabmind.local (or your developer account email)
* **Repository**: https://github.com/rabahmadani/tabmind
