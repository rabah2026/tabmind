// TabMind - Background Service Worker (Manifest V3)

// Configure the side panel to open when the action icon is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error('Failed to set panel behavior:', err));

// Fallback listener for action click (in case setPanelBehavior is not supported)
chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.windowId) {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (err) {
      console.error('Error opening side panel:', err);
    }
  }
});

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set initial default settings in storage
    const defaults = {
      provider: 'chrome-builtin', // 'chrome-builtin' (Gemini Nano default), 'ollama', 'custom'
      ollamaUrl: 'http://127.0.0.1:11434',
      ollamaModel: 'llama3.2',
      customUrl: 'http://127.0.0.1:1234/v1',
      customModel: 'local-model',
      maxContextChars: 12000,
      systemPrompt: 'You are TabMind, a helpful and precise browser assistant. Answer user queries accurately using the provided tab content.'
    };
    await chrome.storage.local.set(defaults);
  }
});
