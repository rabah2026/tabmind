# Chrome Web Store Listing — TabMind - Local AI Tab Assistant

> Last Updated: 2026-10-21

## Store Listing

**Extension Name** [REQUIRED]
TabMind - Local AI Tab Assistant

**Short Description** [REQUIRED]
<!-- Max 132 characters. Current: 124 characters -->
Sidebar AI assistant using 100% local LLMs (Ollama, Gemini Nano) to analyze, summarize, and query open tabs with zero cloud tracking.

**Detailed Description** [REQUIRED]
TabMind is a private, on-device AI sidebar assistant that interacts with your open browser tabs using local large language models. No cloud APIs, no subscriptions, and zero data leakage.

Transform how you browse, read, research, and work with tabs while keeping 100% of your data on your computer.

KEY FEATURES

• 100% Local & Private AI: Runs entirely on your hardware using Ollama (Llama 3.2, Mistral, Qwen), Chrome Built-in AI (Gemini Nano via Prompt API), or LM Studio. No text or browsing data ever leaves your machine.
• Smart Tab Context: Ask questions, get explanations, extract action items, or generate takeaways from your active tab or across all open tabs in your window.
• Context Continuity: Switch between tabs or select open tabs directly from the command dock. Clear centered context dividers keep track of your multi-tab research flow without losing conversation history.
• 40+ Built-in Chrome Skills: Instant one-click workflows across Understand, Research, Learning, Food & Recipes, and Fun categories.
• Custom Skill Creator: Build and save your own reusable custom AI prompts with distinct instructions.
• Rich Markdown & Formatted Tables: Responses render with headers, lists, code syntax blocks with one-click copy, and organized data comparison tables.
• One-Click Export: Download your conversation history as a clean, structured Markdown (.md) document anytime.
• Bespoke Linear & Raycast Obsidian Design: High-contrast, keyboard-friendly command interface built for focused productivity.

HOW TO USE TABMIND

1. Open any webpage in Chrome.
2. Click the TabMind icon in your Chrome toolbar or press your extension shortcut to open the side panel.
3. Chat naturally with your tab, select a quick action tile, or trigger one of the 40+ skills from the skills menu.
4. Switch target tabs from the bottom context dock to cross-reference multiple pages in a single continuous thread.
5. Export your research summary to a Markdown file with a single click.

LOCAL ENGINES SUPPORTED

• Ollama: Native integration with auto-model detection (Llama 3.2, Gemma 2, Mistral, Qwen 2.5, Phi 3, DeepSeek, and more).
• Chrome Built-in AI: Direct on-device Gemini Nano inference using Chrome's Prompt API.
• Local OpenAI Endpoints: Connect to LM Studio, LocalAI, or vLLM running on localhost.

PRIVACY & DATA SAFETY

TabMind was built from day one on a strict zero-telemetry principle. It has no external analytics, no user tracking, no advertising, and no remote servers. All prompt processing happens locally on your computer.

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Provides a local AI assistant in the browser sidebar to query, summarize, and analyze open tab contents without transmitting data off-device.

**Primary Language** [REQUIRED]
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|---|---|---|---|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 PNG | ✅ Ready | `store_assets/screenshot-1-overview.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 PNG | ✅ Ready | `store_assets/screenshot-2-context-switch.png` |
| Screenshot 3 [RECOMMENDED] | 1280×800 PNG | ✅ Ready | `store_assets/screenshot-3-skills-catalog.png` |
| Screenshot 4 | 1280×800 PNG | ✅ Ready | `store_assets/screenshot-4-local-engines.png` |
| Small Promo Tile [RECOMMENDED] | 440×280 PNG | ✅ Ready | `store_assets/promo-small-440x280.png` |
| Marquee Promo Tile | 1400×560 PNG | ✅ Ready | `store_assets/promo-marquee-1400x560.png` |

---

## Permissions Justification

| Permission | Type | Justification |
| :--- | :--- | :--- |
| `sidePanel` | permissions | Required to render the assistant interface as a persistent Chrome side panel alongside open web pages without obstructing user browsing. |
| `tabs` | permissions | Required to access tab metadata (title, URL, favicon) so the user can see and select open tabs to supply context to the local AI. |
| `scripting` | permissions | Required to safely extract visible body text, headings, and user-highlighted excerpts from the active tab upon user prompt submission. |
| `storage` | permissions | Required to persist user settings (local AI provider, model names, max context size, custom skills) and tab chat history locally on device. |
| `<all_urls>` | host_permissions | Required to extract page text from web pages that the user requests assistance on across arbitrary domains. |
| `http://localhost/*` | host_permissions | Required to send local inference requests to local LLM servers (e.g. Ollama on port 11434, LM Studio on port 1234). |
| `http://127.0.0.1/*` | host_permissions | Required to send local inference requests to local loopback endpoints for on-device models. |

---

## Privacy & Data Use

**Does the extension collect user data?** No

All data processing, model inference, and storage occur 100% locally on the user's computer. No user data or browsing content is transmitted to any external server or third party.

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
| :--- | :--- | :--- | :--- | :--- |
| Personally identifiable info | No | No | None | No |
| Health info | No | No | None | No |
| Financial info | No | No | None | No |
| Authentication info | No | No | None | No |
| Personal communications | No | No | None | No |
| Location | No | No | None | No |
| Web history | No | No | None | No |
| User activity | No | No | None | No |
| Website content | No (processed in memory locally) | No (stays on device) | Local AI tab analysis | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Privacy Policy

**Privacy Policy URL** [REQUIRED]
https://github.com/rabah2026/tabmind/blob/master/PRIVACY.md

---

## Distribution

**Visibility**: Public
**Regions**: All regions

---

## Developer Info

**Publisher Name**: TabMind
**Contact Email**: support@tabmind.local
**Support URL**: https://github.com/rabah2026/tabmind/issues
**Homepage URL**: https://github.com/rabah2026/tabmind

---

## Version History

| Version | Date | Changes | Status |
| :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-10-21 | Initial release with Ollama & Gemini Nano local AI support, 40+ Chrome skills, custom skills, and tab context switching. | Draft |
