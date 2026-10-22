// Tab Manager: extracts and monitors opened tabs and their content

export class TabManager {
  constructor(onTabChange) {
    this.onTabChange = onTabChange;
    this.activeTabId = null;
    this.initListeners();
  }

  initListeners() {
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      this.activeTabId = activeInfo.tabId;
      if (this.onTabChange) {
        const tab = await this.getTab(activeInfo.tabId);
        this.onTabChange(tab);
      }
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tabId === this.activeTabId) {
        if (this.onTabChange) {
          this.onTabChange(tab);
        }
      }
    });
  }

  async getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      this.activeTabId = tab.id;
    }
    return tab || null;
  }

  async getTab(tabId) {
    try {
      return await chrome.tabs.get(tabId);
    } catch {
      return null;
    }
  }

  async getAllOpenTabs() {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      return tabs || [];
    } catch (err) {
      console.error('Failed to query open tabs:', err);
      return [];
    }
  }

  isRestrictedUrl(url) {
    if (!url) return true;
    const restrictedPrefixes = [
      'chrome://',
      'chrome-extension://',
      'edge://',
      'about:',
      'view-source:',
      'chrome-search://',
      'https://chrome.google.com/webstore',
      'https://chromewebstore.google.com'
    ];
    return restrictedPrefixes.some((prefix) => url.startsWith(prefix));
  }

  async extractContentFromTab(tabId, maxChars = 12000) {
    const tab = await this.getTab(tabId);
    if (!tab) {
      return { error: 'Tab no longer exists or was closed.' };
    }

    if (this.isRestrictedUrl(tab.url)) {
      return {
        isRestricted: true,
        title: tab.title || 'System Tab',
        url: tab.url,
        error: 'Chrome security prevents extensions from reading system pages (chrome://, Web Store, etc.). Please switch to a regular web tab.'
      };
    }

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: (limit) => {
          // Check for active user selection on the page
          const selection = window.getSelection()?.toString()?.trim() || '';

          // Meta description
          const metaDesc =
            document.querySelector('meta[name="description"]')?.getAttribute('content') ||
            document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
            '';

          // Outline headings (h1, h2)
          const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
            .map((h) => `${h.tagName}: ${h.innerText.trim()}`)
            .filter((h) => h.length > 4)
            .slice(0, 15);

          // Clean body content
          const clone = document.body ? document.body.cloneNode(true) : null;
          if (!clone) {
            return {
              title: document.title,
              url: window.location.href,
              selection,
              description: metaDesc,
              headings,
              content: '',
              truncated: false,
              wordCount: 0
            };
          }

          // Remove noisy, non-readable elements
          const noisySelectors = [
            'script',
            'style',
            'noscript',
            'svg',
            'iframe',
            'object',
            'embed',
            'nav',
            'footer',
            'aside',
            'dialog',
            '[role="banner"]',
            '[role="navigation"]',
            '[aria-hidden="true"]',
            '.ad',
            '.ads',
            '.cookie-banner',
            '.newsletter-signup'
          ];
          clone.querySelectorAll(noisySelectors.join(', ')).forEach((el) => el.remove());

          // Extract text and collapse multiple whitespace/newlines
          let rawText = clone.innerText || clone.textContent || '';
          rawText = rawText
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

          const wordCount = rawText ? rawText.split(/\s+/).length : 0;
          const isTruncated = rawText.length > limit;
          const content = isTruncated ? rawText.substring(0, limit) + '\n\n[... Remaining page content truncated for context size ...]' : rawText;

          return {
            title: document.title,
            url: window.location.href,
            description: metaDesc,
            selection,
            headings,
            content,
            truncated: isTruncated,
            wordCount
          };
        },
        args: [maxChars]
      });

      if (!results || !results[0] || !results[0].result) {
        return { error: 'Could not extract page text from this tab.' };
      }

      return results[0].result;
    } catch (err) {
      console.error(`Script execution failed on tab ${tabId}:`, err);
      return {
        error: `Could not access page content: ${err.message || 'Permission denied or page loading'}`
      };
    }
  }

  async extractContentFromAllTabs(maxCharsPerTab = 3000) {
    const tabs = await this.getAllOpenTabs();
    const readableTabs = tabs.filter((t) => !this.isRestrictedUrl(t.url));

    if (readableTabs.length === 0) {
      return {
        error: 'No accessible web tabs found. Open some regular web pages first.'
      };
    }

    const summaries = [];
    for (const tab of readableTabs) {
      try {
        const data = await this.extractContentFromTab(tab.id, maxCharsPerTab);
        if (!data.error) {
          summaries.push({
            id: tab.id,
            title: tab.title,
            url: tab.url,
            content: data.content,
            selection: data.selection
          });
        }
      } catch {
        // Skip inaccessible tabs
      }
    }

    return {
      totalTabs: tabs.length,
      accessibleCount: summaries.length,
      tabsData: summaries
    };
  }
}
