// Local LLM Provider Manager: Chrome Built-in Prompt API, Ollama, and Local OpenAI-compatible endpoints

export class LocalLLMProvider {
  constructor(config = {}) {
    this.provider = config.provider || 'ollama'; // 'ollama' | 'chrome-builtin' | 'custom'
    this.ollamaUrl = (config.ollamaUrl || 'http://127.0.0.1:11434').replace(/\/+$/, '');
    this.ollamaModel = config.ollamaModel || 'llama3.2';
    this.customUrl = (config.customUrl || 'http://127.0.0.1:1234/v1').replace(/\/+$/, '');
    this.customModel = config.customModel || 'local-model';
    this.systemPrompt = config.systemPrompt || 'You are TabMind, an expert browser assistant. Answer accurately based on the provided tab context.';
    this.activeSession = null;
  }

  updateConfig(config) {
    if (config.provider) this.provider = config.provider;
    if (config.ollamaUrl) this.ollamaUrl = config.ollamaUrl.replace(/\/+$/, '');
    if (config.ollamaModel) this.ollamaModel = config.ollamaModel;
    if (config.customUrl) this.customUrl = config.customUrl.replace(/\/+$/, '');
    if (config.customModel) this.customModel = config.customModel;
    if (config.systemPrompt !== undefined) this.systemPrompt = config.systemPrompt;
  }

  // Verify and test connection to the selected local provider
  async testConnection() {
    if (this.provider === 'chrome-builtin') {
      return this._testChromeBuiltin();
    } else if (this.provider === 'ollama') {
      return this._testOllama();
    } else if (this.provider === 'custom') {
      return this._testCustom();
    }
    return { ok: false, message: `Unknown provider: ${this.provider}` };
  }

  async _testChromeBuiltin() {
    if (typeof globalThis.LanguageModel !== 'undefined') {
      try {
        const userLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
        const supported = ['en', 'es', 'ja', 'fr', 'de'];
        const lang = supported.includes(userLang) ? userLang : 'en';

        let availability;
        try {
          availability = await globalThis.LanguageModel.availability({
            expectedInputs: [{ type: 'text', languages: [lang] }],
            expectedOutputs: [{ type: 'text', languages: [lang] }]
          });
        } catch {
          availability = await globalThis.LanguageModel.availability();
        }
        if (availability === 'no' || availability === 'unavailable') {
          return {
            ok: false,
            provider: 'chrome-builtin',
            message: 'Chrome Built-in AI (Gemini Nano) is unavailable on this device.'
          };
        }
        if (availability === 'after-download' || availability === 'downloading') {
          return {
            ok: true,
            provider: 'chrome-builtin',
            status: 'downloading',
            message: 'Gemini Nano is available and ready to download on first prompt.'
          };
        }
        return {
          ok: true,
          provider: 'chrome-builtin',
          status: 'ready',
          message: 'Chrome Built-in AI (Gemini Nano) is ready!'
        };
      } catch (err) {
        return {
          ok: false,
          provider: 'chrome-builtin',
          message: `Built-in AI error: ${err.message}`
        };
      }
    }

    // Older Chrome origin trial fallback
    if (typeof globalThis.ai?.languageModel !== 'undefined') {
      try {
        const cap = await globalThis.ai.languageModel.capabilities();
        if (cap.available === 'no') {
          return {
            ok: false,
            provider: 'chrome-builtin',
            message: 'Chrome AI is not supported on this device/hardware.'
          };
        }
        return {
          ok: true,
          provider: 'chrome-builtin',
          status: 'ready',
          message: 'Chrome Built-in AI (Origin Trial) is available!'
        };
      } catch (err) {
        return {
          ok: false,
          provider: 'chrome-builtin',
          message: `Capabilities check error: ${err.message}`
        };
      }
    }

    return {
      ok: false,
      provider: 'chrome-builtin',
      message: 'Chrome Built-in Prompt API is not enabled. In Chrome Canary/Dev, enable chrome://flags/#optimization-guide-on-device-model and chrome://flags/#prompt-api-for-gemini-nano, or switch to Ollama.'
    };
  }

  async _testOllama() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        return {
          ok: false,
          provider: 'ollama',
          message: `Ollama returned HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      const models = (data.models || []).map((m) => m.name);
      const hasSelectedModel = models.some(
        (m) => m === this.ollamaModel || m.startsWith(`${this.ollamaModel}:`)
      );

      return {
        ok: true,
        provider: 'ollama',
        models,
        activeModel: this.ollamaModel,
        hasModel: hasSelectedModel,
        message: hasSelectedModel
          ? `Connected to Ollama with model "${this.ollamaModel}"`
          : `Connected to Ollama, but model "${this.ollamaModel}" is not in installed list: [${models.slice(0, 4).join(', ')}]`
      };
    } catch (err) {
      return {
        ok: false,
        provider: 'ollama',
        message: `Cannot reach Ollama at ${this.ollamaUrl}. Make sure Ollama is running ('ollama serve'). Error: ${err.message}`
      };
    }
  }

  async _testCustom() {
    try {
      const response = await fetch(`${this.customUrl}/models`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        return {
          ok: false,
          provider: 'custom',
          message: `Local server returned HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      const models = (data.data || []).map((m) => m.id);

      return {
        ok: true,
        provider: 'custom',
        models,
        activeModel: this.customModel,
        message: `Connected to local server at ${this.customUrl}. ${models.length} model(s) detected.`
      };
    } catch (err) {
      return {
        ok: false,
        provider: 'custom',
        message: `Cannot connect to ${this.customUrl}. Make sure your local server (LM Studio, llama.cpp, etc.) is running. Error: ${err.message}`
      };
    }
  }

  // Format tab context and conversation into unified prompt
  buildPrompt(contextData, conversationHistory, userMessage) {
    let contextBlock = '';

    if (contextData?.isMultiTab) {
      contextBlock = `### ALL OPEN TABS CONTEXT (${contextData.accessibleCount} tabs available):\n`;
      contextData.tabsData.forEach((tab, index) => {
        contextBlock += `\n--- Tab #${index + 1}: ${tab.title} ---\nURL: ${tab.url}\n`;
        if (tab.selection) {
          contextBlock += `User Selected Excerpt:\n"${tab.selection}"\n`;
        }
        contextBlock += `Page Content:\n${tab.content}\n`;
      });
    } else if (contextData) {
      contextBlock = `### CURRENT TAB CONTEXT:\n`;
      contextBlock += `Page Title: ${contextData.title || 'Untitled'}\n`;
      contextBlock += `URL: ${contextData.url || ''}\n`;
      if (contextData.description) {
        contextBlock += `Meta Description: ${contextData.description}\n`;
      }
      if (contextData.headings && contextData.headings.length > 0) {
        contextBlock += `Key Headings:\n${contextData.headings.map((h) => `- ${h}`).join('\n')}\n`;
      }
      if (contextData.selection) {
        contextBlock += `\n### USER HIGHLIGHTED TEXT ON PAGE:\n"${contextData.selection}"\n(Focus on this highlighted passage if asked)\n`;
      }
      contextBlock += `\n### PAGE CONTENT:\n${contextData.content || '(No readable body text found on page)'}\n`;
    }

    return { contextBlock, userMessage };
  }

  // Stream completions from the active local provider
  async *streamChat({ contextData, conversationHistory = [], userMessage, signal, onDownloadProgress }) {
    // Filter out UI dividers/tab-switches so only real conversational turns reach the model
    const cleanHistory = conversationHistory.filter(
      (m) => m && (m.role === 'user' || m.role === 'assistant')
    );

    const { contextBlock } = this.buildPrompt(contextData, cleanHistory, userMessage);

    if (this.provider === 'chrome-builtin') {
      yield* this._streamChromeBuiltin(contextBlock, cleanHistory, userMessage, signal, onDownloadProgress);
    } else if (this.provider === 'ollama') {
      yield* this._streamOllama(contextBlock, cleanHistory, userMessage, signal);
    } else if (this.provider === 'custom') {
      yield* this._streamCustom(contextBlock, cleanHistory, userMessage, signal);
    } else {
      throw new Error(`Unsupported local provider: ${this.provider}`);
    }
  }

  async *_streamChromeBuiltin(contextBlock, conversationHistory, userMessage, signal, onDownloadProgress) {
    let session = null;
    try {
      const fullSystemPrompt = `${this.systemPrompt}\n\n${contextBlock}`;

      if (typeof globalThis.LanguageModel !== 'undefined') {
        const userLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
        const supported = ['en', 'es', 'ja', 'fr', 'de'];
        const lang = supported.includes(userLang) ? userLang : 'en';

        const monitorFn = (monitor) => {
          if (onDownloadProgress && monitor?.addEventListener) {
            monitor.addEventListener('downloadprogress', (e) => {
              const percent = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
              onDownloadProgress(percent);
            });
          }
        };

        try {
          session = await globalThis.LanguageModel.create({
            expectedInputs: [{ type: 'text', languages: [lang] }],
            expectedOutputs: [{ type: 'text', languages: [lang] }],
            initialPrompts: [{ role: 'system', content: fullSystemPrompt }],
            monitor: monitorFn
          });
        } catch {
          // Fallback if older API syntax expects options without expectedInputs/expectedOutputs
          session = await globalThis.LanguageModel.create({
            initialPrompts: [{ role: 'system', content: fullSystemPrompt }],
            monitor: monitorFn
          });
        }
      } else if (typeof globalThis.ai?.languageModel !== 'undefined') {
        session = await globalThis.ai.languageModel.create({
          systemPrompt: fullSystemPrompt
        });
      } else {
        throw new Error('Chrome Built-in Prompt API is not supported in this browser. Please select Ollama or LM Studio in settings.');
      }

      this.activeSession = session;

      // Build conversation turn
      let promptText = '';
      if (conversationHistory.length > 0) {
        const recent = conversationHistory.slice(-4);
        promptText = recent.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n') + '\n\n';
      }
      promptText += `User: ${userMessage}\nAssistant:`;

      // Streaming chunks in Chrome Prompt API
      const stream = session.promptStreaming(promptText, { signal });
      let previousText = '';
      for await (const chunk of stream) {
        if (signal?.aborted) break;
        // In some Chrome Prompt API versions chunk is cumulative, in others it is delta.
        // If cumulative, yield difference.
        if (chunk.startsWith(previousText)) {
          const delta = chunk.slice(previousText.length);
          previousText = chunk;
          yield delta;
        } else {
          yield chunk;
        }
      }
    } finally {
      if (session?.destroy) {
        try {
          session.destroy();
        } catch {}
      }
      this.activeSession = null;
    }
  }

  async *_streamOllama(contextBlock, conversationHistory, userMessage, signal) {
    const messages = [];

    // System prompt with tab context
    const fullSystemPrompt = `${this.systemPrompt}\n\n${contextBlock}`;
    messages.push({ role: 'system', content: fullSystemPrompt });

    // History (keep last 6 turns for context efficiency)
    conversationHistory.slice(-6).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    // Current message
    messages.push({ role: 'user', content: userMessage });

    const response = await fetch(`${this.ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.ollamaModel,
        messages,
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama request failed (${response.status}): ${errText || response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        if (signal?.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            const token = parsed?.message?.content || '';
            if (token) {
              yield token;
            }
          } catch (e) {
            console.warn('Failed to parse Ollama chunk:', trimmed);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async *_streamCustom(contextBlock, conversationHistory, userMessage, signal) {
    const messages = [];
    const fullSystemPrompt = `${this.systemPrompt}\n\n${contextBlock}`;
    messages.push({ role: 'system', content: fullSystemPrompt });

    conversationHistory.slice(-6).forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    messages.push({ role: 'user', content: userMessage });

    const response = await fetch(`${this.customUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify({
        model: this.customModel,
        messages,
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Local server request failed (${response.status}): ${errText || response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        if (signal?.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '').trim();
          if (dataStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataStr);
            const token = parsed?.choices?.[0]?.delta?.content || '';
            if (token) {
              yield token;
            }
          } catch (e) {
            // Ignore parse errors on malformed SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
