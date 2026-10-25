// TabMind - Sidepanel Controller (Per-Tab Isolated Chat & Skills System)

import { TabManager } from './tab-manager.js';
import { LocalLLMProvider } from './llm-provider.js';
import { renderMarkdown } from './markdown-renderer.js';

// Built-in Default Skills (Full Chrome Skills Catalog)
const DEFAULT_SKILLS = [
  // --- Understand ---
  {
    id: 'skill-summarize-text',
    category: 'understand',
    icon: '📝',
    name: 'Summarize as text',
    description: 'Finds the core argument and identifies key takeaways from a webpage.',
    instructions: 'Find the core argument and identify key takeaways from this webpage in a concise, well-structured summary.'
  },
  {
    id: 'skill-explain-simply',
    category: 'understand',
    icon: '👶',
    name: 'Explain simply',
    description: 'Simplifies complex text, using analogies suited for a kindergarten level.',
    instructions: 'Simplify this complex text using clear, intuitive analogies suited for a beginner / kindergarten level. Keep it easy to understand.'
  },
  {
    id: 'skill-create-outline',
    category: 'understand',
    icon: '🏗️',
    name: 'Create an outline',
    description: 'Develops a framework to organize the main ideas and supporting points for an essay.',
    instructions: 'Develop a structured hierarchical outline organizing the main ideas, sections, and supporting points of this page.'
  },
  {
    id: 'skill-action-items',
    category: 'understand',
    icon: '✅',
    name: 'Action items',
    description: 'Scans text for tasks and generates a list of actions, owners, and status.',
    instructions: 'Scan this page for tasks, instructions, or deliverables and generate a clear checklist of action items with owners and status.'
  },
  {
    id: 'skill-quotes',
    category: 'understand',
    icon: '💬',
    name: 'Quotes',
    description: 'Highlights notable statements from a text and explains why each matters.',
    instructions: 'Extract the most notable, impactful quotes and statements from this text and explain why each matters.'
  },
  {
    id: 'skill-build-timeline',
    category: 'understand',
    icon: '⏳',
    name: 'Build timeline',
    description: 'Identifies dates to build a chronological sequence of events.',
    instructions: 'Identify all dates, milestones, and chronological sequences on this page to build a structured timeline of events.'
  },
  {
    id: 'skill-opposing-view',
    category: 'understand',
    icon: '🤺',
    name: 'Opposing view',
    description: 'Notes the valid points of an argument and builds a respectful counter-argument.',
    instructions: 'Identify the main arguments presented on this page, acknowledge their valid points, and construct a thoughtful, respectful counter-argument.'
  },
  {
    id: 'skill-summarize-table',
    category: 'understand',
    icon: '📊',
    name: 'Summarize as table',
    description: 'Extracts recurring data from text to create a clean and organized tabular format.',
    instructions: 'Extract recurring data, comparisons, and structured entities from this page to create a clean, formatted Markdown table.'
  },
  {
    id: 'skill-check-reading-level',
    category: 'understand',
    icon: '🎓',
    name: 'Check reading level',
    description: 'Estimates the grade level of content to help determine the intended audience.',
    instructions: 'Estimate the reading grade level and reading ease of this content, and explain the target audience profile.'
  },
  {
    id: 'skill-executive-summary',
    category: 'understand',
    icon: '👔',
    name: 'Executive summary',
    description: 'Condenses text by front-loading results and cutting content for a scannable overview.',
    instructions: 'Write an executive summary by front-loading bottom-line results, key takeaways, and decisions in a scannable bulleted overview.'
  },
  {
    id: 'skill-whats-in-this',
    category: 'understand',
    icon: '📝',
    name: "What's in this?",
    description: 'Creates an infographic for breaking down a recipe or product.',
    instructions: 'Break down the ingredients, components, materials, or features described on this page into a clear breakdown.'
  },

  // --- Research ---
  {
    id: 'skill-research-company',
    category: 'research',
    icon: '🏢',
    name: 'Research a company',
    description: 'Compiles business facts, market position, and news to develop speaking points.',
    instructions: 'Compile business facts, mission, market position, key offerings, and recent news about this company into speaking points.'
  },
  {
    id: 'skill-prep-meeting',
    category: 'research',
    icon: '💼',
    name: 'Prep for meeting',
    description: 'Extracts agenda items and documents to review while anticipating meeting questions.',
    instructions: 'Extract key agenda topics, review materials, and anticipated questions to thoroughly prep for a meeting on this subject.'
  },
  {
    id: 'skill-prep-today',
    category: 'research',
    icon: '🌅',
    name: 'Prep for today',
    description: 'Highlights meeting prep, tight transitions, and focused work from your calendar.',
    instructions: 'Review the tasks, schedule, and priorities mentioned on this page and summarize key prep items and focused goals.'
  },
  {
    id: 'skill-generate-citations',
    category: 'research',
    icon: '🔖',
    name: 'Generate citations',
    description: 'Locates info to automatically format bibliographic references in APA, MLA, and Chicago styles.',
    instructions: 'Locate all bibliographic metadata on this page (author, title, date, publisher, URL) and format citations in APA, MLA, and Chicago styles.'
  },
  {
    id: 'skill-check-job-fit',
    category: 'research',
    icon: '🧤',
    name: 'Check job fit',
    description: 'Compares a candidate to job requirements to find gaps and an alignment score.',
    instructions: 'Analyze the job requirements and qualifications on this page, identify key skills needed, and create an evaluation checklist with gap analysis.'
  },
  {
    id: 'skill-weekly-work-review',
    category: 'research',
    icon: '🏁',
    name: 'Weekly work review',
    description: 'Analyzes recent tasks to highlight wins, identify blockers, and set priorities.',
    instructions: 'Analyze the work items, issues, or progress described on this page to highlight wins, flag blockers, and outline priority next steps.'
  },

  // --- Shopping ---
  {
    id: 'skill-buying-advice',
    category: 'shopping',
    icon: '🤔',
    name: 'Buying advice',
    description: 'Evaluates product specifications and common complaints to provide buy / no-buy advice.',
    instructions: 'Evaluate this product specifications, pros, and common user complaints to give honest, objective buy or no-buy advice.'
  },
  {
    id: 'skill-summarize-reviews',
    category: 'shopping',
    icon: '⭐',
    name: 'Summarize reviews',
    description: 'Scans customer feedback to identify praise and complaints and overall trust level.',
    instructions: 'Scan customer reviews and feedback on this page to identify top praise, common complaints, and overall consensus/trust level.'
  },
  {
    id: 'skill-identify-specs',
    category: 'shopping',
    icon: '📏',
    name: 'Identify specs',
    description: 'Gathers technical details, highlighting what matters most and noting missing information.',
    instructions: 'Gather all technical specifications, highlight the most important metrics, and note any missing critical information.'
  },
  {
    id: 'skill-price-per-unit',
    category: 'shopping',
    icon: '🏷️',
    name: 'Price per unit',
    description: 'Factors in total costs, including shipping fees, to calculate a true cost.',
    instructions: 'Calculate the true cost or effective price per unit, factoring in package quantities, shipping fees, and discounts.'
  },
  {
    id: 'skill-check-returns',
    category: 'shopping',
    icon: '↩️',
    name: 'Check returns',
    description: 'Gathers refund details like deadlines, restocking fees, and return-shipping costs.',
    instructions: 'Extract all return and refund policy details: return deadlines, restocking fees, condition rules, and return shipping costs.'
  },
  {
    id: 'skill-sizing-help',
    category: 'shopping',
    icon: '👕',
    name: 'Sizing help',
    description: 'Uses customer feedback to determine if an item runs small, large, or true to size.',
    instructions: 'Analyze sizing charts, measurements, and customer feedback on this page to determine if this item runs small, large, or true to size.'
  },
  {
    id: 'skill-check-warranty',
    category: 'shopping',
    icon: '🛡️',
    name: 'Check warranty',
    description: 'Gathers product-protection info like covered defects, exclusions, and the claim process.',
    instructions: 'Extract warranty and protection details: coverage duration, covered defects, exclusions, and step-by-step claim instructions.'
  },
  {
    id: 'skill-rate-as-gift',
    category: 'shopping',
    icon: '🎁',
    name: 'Rate as gift',
    description: 'Assesses if something would make a good gift based on things like brand and quality.',
    instructions: 'Assess whether this product would make a good gift, identifying ideal recipients, pros/cons as a present, and a gift rating.'
  },
  {
    id: 'skill-compare-tabs',
    category: 'shopping',
    icon: '🆚',
    name: 'Compare open tabs',
    description: 'Analyzes multiple product pages to find the best value.',
    instructions: 'Analyze and compare the products across all currently open tabs to evaluate value, feature differences, and price-to-performance.'
  },
  {
    id: 'skill-gift-concierge',
    category: 'shopping',
    icon: '🛎️',
    name: 'Gift concierge',
    description: 'Assists with picking the ultimate gift.',
    instructions: 'Act as a gift concierge: evaluate this item uniqueness, recipient appeal, and suggest complementary gift ideas.'
  },
  {
    id: 'skill-shop-clothes',
    category: 'shopping',
    icon: '👕',
    name: 'Shop for clothes & accessories',
    description: 'Get promos, reviews, and size advice when shopping for clothes and accessories.',
    instructions: 'Extract available promos, material quality details, fit advice, and customer sentiment for this apparel item.'
  },

  // --- Writing ---
  {
    id: 'skill-draft-email',
    category: 'writing',
    icon: '📧',
    name: 'Draft a professional email',
    description: 'Converts content into a structured email with a subject line and action items.',
    instructions: 'Convert the content of this page into a concise, professional email with a subject line, clear context, and action items.'
  },
  {
    id: 'skill-suggest-replies',
    category: 'writing',
    icon: '🚦',
    name: 'Suggest replies',
    description: 'Analyzes tone to offer three replies: a quick note, full answer, and diplomatic response.',
    instructions: 'Analyze the tone and content on this page and generate three response options: a quick note, a comprehensive answer, and a diplomatic reply.'
  },
  {
    id: 'skill-translate-text',
    category: 'writing',
    icon: '🌐',
    name: 'Translate text',
    description: 'Converts text to a target language, adapting idioms while preserving context.',
    instructions: 'Translate the key text from this page, adapting idioms and cultural expressions while preserving the original context.'
  },
  {
    id: 'skill-correct-grammar',
    category: 'writing',
    icon: '🩹',
    name: 'Correct grammar',
    description: 'Fixes grammar, spelling, and punctuation while keeping the original tone and voice.',
    instructions: 'Review and correct all grammar, spelling, and punctuation errors in this text while preserving its voice and tone.'
  },
  {
    id: 'skill-shorten-text',
    category: 'writing',
    icon: '🗜️',
    name: 'Shorten text',
    description: 'Cuts word count by half, removing filler and redundancy while keeping the meaning.',
    instructions: 'Cut the word count of this content by roughly 50%, removing filler, redundancy, and fluff while keeping the core meaning.'
  },
  {
    id: 'skill-friendly-tone',
    category: 'writing',
    icon: '🤝',
    name: 'Rewrite with a friendly tone',
    description: 'Softens language with transitions and turns commands into polite requests.',
    instructions: 'Rewrite this content with a warm, friendly, and approachable tone, turning abrupt commands into polite requests.'
  },
  {
    id: 'skill-find-synonyms',
    category: 'writing',
    icon: '🎯',
    name: 'Find synonyms',
    description: 'Suggests word choices from casual to academic while explaining best fit.',
    instructions: 'Identify key vocabulary choices on this page and suggest nuanced synonyms from casual to academic, explaining best fits.'
  },
  {
    id: 'skill-explain-slang',
    category: 'writing',
    icon: '🧢',
    name: 'Explain slang or jargon',
    description: 'Decodes informal terms and their origins while advising on usage and alternatives.',
    instructions: 'Decode any slang, colloquialisms, or specialized industry jargon on this page, explaining origins and clearer alternatives.'
  },

  // --- Learning ---
  {
    id: 'skill-flashcards',
    category: 'learning',
    icon: '📇',
    name: 'Learn with flashcards',
    description: 'Generates 15 concise, self-contained questions to help study.',
    instructions: 'Generate 15 concise, self-contained Q&A flashcards based on this page to help study and test recall.'
  },
  {
    id: 'skill-make-quiz',
    category: 'learning',
    icon: '❓',
    name: 'Make a quiz',
    description: 'Tests your knowledge with a mix of questions and detailed explanations.',
    instructions: 'Create a 5-question multiple choice and conceptual quiz based on this page, including answer keys and detailed explanations.'
  },
  {
    id: 'skill-deep-questions',
    category: 'learning',
    icon: '🪞',
    name: 'Deep questions',
    description: 'Generates open-ended prompts designed to challenge assumptions.',
    instructions: 'Generate thoughtful, open-ended questions based on this material designed to challenge assumptions and provoke deep critical thought.'
  },
  {
    id: 'skill-study-guide',
    category: 'learning',
    icon: '🗺️',
    name: 'Study guide',
    description: 'Condenses material into essential concepts and suggests study aids.',
    instructions: 'Condense this page into a comprehensive study guide featuring key definitions, core concepts, and summary takeaways.'
  },
  {
    id: 'skill-break-it-down',
    category: 'learning',
    icon: '👩‍🏫',
    name: 'Break it down',
    description: 'Breaks down foundational concepts step-by-step, using examples to build understanding.',
    instructions: 'Break down the foundational concepts step-by-step, using clear progressive examples to build intuition from first principles.'
  },

  // --- Fun ---
  {
    id: 'skill-hype-it-up',
    category: 'fun',
    icon: '📣',
    name: 'Hype it up!',
    description: 'Offers encouragement to the user by highlighting their traits and past wins.',
    instructions: 'Deliver high-energy enthusiasm, celebration, and motivational hype about the subject or achievement on this page!'
  },
  {
    id: 'skill-fun-facts',
    category: 'fun',
    icon: '🥂',
    name: 'Fun facts',
    description: 'Provides trivia and suggests how to use them in conversation.',
    instructions: 'Extract surprising, fun facts and trivia from this page, along with clever conversation starters to share them.'
  },
  {
    id: 'skill-in-character',
    category: 'fun',
    icon: '🎭',
    name: 'Explain something in character',
    description: 'Transforms text to match the vocabulary and speech patterns of a character.',
    instructions: 'Explain the main concept of this page in the voice, vocabulary, and distinct speech mannerisms of a pirate, detective, or historical figure.'
  },
  {
    id: 'skill-dramatize',
    category: 'fun',
    icon: '🎬',
    name: 'Dramatize content',
    description: 'Elevates the stakes of a story by applying epic language suited for a movie trailer.',
    instructions: 'Dramatize the content of this page using intense, epic language suited for a blockbuster movie trailer voiceover!'
  },

  // --- Food & Recipes ---
  {
    id: 'skill-protein-max',
    category: 'understand',
    icon: '💪',
    name: 'Protein max',
    description: 'Modifies a recipe by suggesting high-protein substitutions.',
    instructions: 'Analyze any recipe or meal on this page and suggest high-protein substitutions and additions to maximize protein content.'
  },
  {
    id: 'skill-meal-planner',
    category: 'understand',
    icon: '🍽️',
    name: 'Meal planner',
    description: 'Creates an infographic timeline and prep list for multiple recipes.',
    instructions: 'Create an organized prep timeline, cooking schedule, and unified grocery list for the meal or recipe on this page.'
  },
  {
    id: 'skill-make-grocery-list',
    category: 'understand',
    icon: '📋',
    name: 'Make grocery list',
    description: 'Normalizes recipe quantities and categorizes ingredients by supermarket section.',
    instructions: 'Extract all ingredients from this page, normalize quantities, and categorize them by supermarket aisle (produce, pantry, dairy, etc.).'
  }
];

// DOM Elements
const elements = {
  // Top Header
  newChatBtn: document.getElementById('newChatBtn'),
  exportChatBtn: document.getElementById('exportChatBtn'),
  clearChatBtn: document.getElementById('clearChatBtn'),
  settingsBtn: document.getElementById('settingsBtn'),

  // Chat Area
  chatContainer: document.getElementById('chatContainer'),
  emptyState: document.getElementById('emptyState'),
  suggestedPromptsList: document.getElementById('suggestedPromptsList'),
  messagesList: document.getElementById('messagesList'),

  // Bottom Context Bar
  privacyNotice: document.getElementById('privacyNotice'),
  dismissNoticeBtn: document.getElementById('dismissNoticeBtn'),
  tabContextPill: document.getElementById('tabContextPill'),
  tabFavicon: document.getElementById('tabFavicon'),
  tabDefaultIcon: document.getElementById('tabDefaultIcon'),
  tabPillText: document.getElementById('tabPillText'),
  tabSwitcherTrigger: document.getElementById('tabSwitcherTrigger'),
  detachTabBtn: document.getElementById('detachTabBtn'),
  refreshContextBtn: document.getElementById('refreshContextBtn'),

  // Active Skill Pill
  activeSkillPillRow: document.getElementById('activeSkillPillRow'),
  activeSkillName: document.getElementById('activeSkillName'),
  clearSkillBtn: document.getElementById('clearSkillBtn'),

  // Highlighted Selection & Restricted Pages
  selectionPill: document.getElementById('selectionPill'),
  selectionQuote: document.getElementById('selectionQuote'),
  clearSelectionBtn: document.getElementById('clearSelectionBtn'),
  restrictedPill: document.getElementById('restrictedPill'),

  // Input & Tools
  chatForm: document.getElementById('chatForm'),
  userInput: document.getElementById('userInput'),
  skillsMenuBtn: document.getElementById('skillsMenuBtn'),
  atMentionBtn: document.getElementById('atMentionBtn'),
  modelSelectorPill: document.getElementById('modelSelectorPill'),
  modelStatusDot: document.getElementById('modelStatusDot'),
  modelNameText: document.getElementById('modelNameText'),
  sendBtn: document.getElementById('sendBtn'),
  stopBtn: document.getElementById('stopBtn'),

  // Tab Switcher Popover
  tabDropdownMenu: document.getElementById('tabDropdownMenu'),
  closeDropdownBtn: document.getElementById('closeDropdownBtn'),
  dropdownItemsList: document.getElementById('dropdownItemsList'),
  dynamicTabList: document.getElementById('dynamicTabList'),

  // Skills Popover & Add Skill Modal
  skillsDropdownMenu: document.getElementById('skillsDropdownMenu'),
  closeSkillsMenuBtn: document.getElementById('closeSkillsMenuBtn'),
  openAddSkillModalBtn: document.getElementById('openAddSkillModalBtn'),
  skillsItemsList: document.getElementById('skillsItemsList'),
  skillSearchInput: document.getElementById('skillSearchInput'),
  skillsCategoryBar: document.getElementById('skillsCategoryBar'),
  addSkillModalBackdrop: document.getElementById('addSkillModalBackdrop'),
  addSkillForm: document.getElementById('addSkillForm'),
  skillNameInput: document.getElementById('skillNameInput'),
  skillInstructionsInput: document.getElementById('skillInstructionsInput'),
  cancelAddSkillBtn: document.getElementById('cancelAddSkillBtn'),
  saveSkillBtn: document.getElementById('saveSkillBtn'),

  // Settings Drawer
  settingsDrawer: document.getElementById('settingsDrawer'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  providerRadios: document.querySelectorAll('input[name="providerOption"]'),
  ollamaFields: document.getElementById('ollamaFields'),
  chromeBuiltinFields: document.getElementById('chromeBuiltinFields'),
  customFields: document.getElementById('customFields'),
  ollamaUrlInput: document.getElementById('ollamaUrlInput'),
  ollamaModelInput: document.getElementById('ollamaModelInput'),
  ollamaModelSelect: document.getElementById('ollamaModelSelect'),
  fetchOllamaModelsBtn: document.getElementById('fetchOllamaModelsBtn'),
  customUrlInput: document.getElementById('customUrlInput'),
  customModelInput: document.getElementById('customModelInput'),
  maxCharsRange: document.getElementById('maxCharsRange'),
  maxCharsDisplay: document.getElementById('maxCharsDisplay'),
  testConnectionBtn: document.getElementById('testConnectionBtn'),
  testResult: document.getElementById('testResult'),

  // Onboarding & Help
  helpBtn: document.getElementById('helpBtn'),
  onboardingModalBackdrop: document.getElementById('onboardingModalBackdrop'),
  skipOnboardingBtn: document.getElementById('skipOnboardingBtn'),
  onboardingBackBtn: document.getElementById('onboardingBackBtn'),
  onboardingNextBtn: document.getElementById('onboardingNextBtn'),
  onboardingDots: document.querySelectorAll('.onboarding-dot'),
  onboardingSteps: document.querySelectorAll('.onboarding-step')
};

// Application State
let appSettings = {
  provider: 'chrome-builtin',
  ollamaUrl: 'http://127.0.0.1:11434',
  ollamaModel: 'llama3.2',
  customUrl: 'http://127.0.0.1:1234/v1',
  customModel: 'local-model',
  maxContextChars: 12000,
  systemPrompt: 'You are TabMind, a helpful and precise browser assistant. Answer user queries accurately using the provided tab context.'
};

let currentActiveTabId = null;
let currentTargetTabId = 'active'; // 'active' | 'all' | 'none' | numeric tabId
let conversationHistory = [];
let chatHistoryByTab = {};
let currentTabContext = null;
let currentAbortController = null;
let customSkills = [];
let activeSkill = null;
let currentSkillCategory = 'all';
let currentSkillSearchQuery = '';

const tabManager = new TabManager(async (updatedTab) => {
  await handlePhysicalTabSwitch(updatedTab);
});

// Clean up chat memory when tabs are closed in browser
chrome.tabs.onRemoved.addListener(async (closedTabId) => {
  if (chatHistoryByTab[closedTabId]) {
    delete chatHistoryByTab[closedTabId];
    await chrome.storage.local.set({ chatHistoryByTab });
  }
});

const llmProvider = new LocalLLMProvider(appSettings);

// Onboarding State & Flow
let currentOnboardingStep = 1;

function setOnboardingStep(step) {
  currentOnboardingStep = Math.max(1, Math.min(3, step));
  elements.onboardingSteps.forEach((el) => {
    el.classList.toggle('active', parseInt(el.dataset.step, 10) === currentOnboardingStep);
  });
  elements.onboardingDots.forEach((el) => {
    el.classList.toggle('active', parseInt(el.dataset.step, 10) === currentOnboardingStep);
  });

  if (currentOnboardingStep === 1) {
    if (elements.onboardingBackBtn) elements.onboardingBackBtn.style.display = 'none';
    if (elements.onboardingNextBtn) elements.onboardingNextBtn.textContent = 'Next →';
  } else if (currentOnboardingStep === 2) {
    if (elements.onboardingBackBtn) elements.onboardingBackBtn.style.display = 'inline-block';
    if (elements.onboardingNextBtn) elements.onboardingNextBtn.textContent = 'Next →';
  } else {
    if (elements.onboardingBackBtn) elements.onboardingBackBtn.style.display = 'inline-block';
    if (elements.onboardingNextBtn) elements.onboardingNextBtn.textContent = 'Get Started 🚀';
  }
}

function openOnboarding(step = 1) {
  setOnboardingStep(step);
  if (elements.onboardingModalBackdrop) {
    elements.onboardingModalBackdrop.inert = false;
    elements.onboardingModalBackdrop.classList.add('open');
  }
}

async function closeOnboarding(markCompleted = true) {
  if (elements.onboardingModalBackdrop) {
    elements.onboardingModalBackdrop.classList.remove('open');
    elements.onboardingModalBackdrop.inert = true;
  }
  if (markCompleted) {
    await chrome.storage.local.set({ hasSeenOnboarding: true });
  }
}

async function checkFirstTimeOnboarding() {
  const { hasSeenOnboarding } = await chrome.storage.local.get(['hasSeenOnboarding']);
  if (!hasSeenOnboarding) {
    openOnboarding(1);
  }
}

// Initialization
async function init() {
  await loadSettings();
  await loadCustomSkills();
  await loadAllTabChats();

  const activeTab = await tabManager.getActiveTab();
  if (activeTab) {
    currentActiveTabId = activeTab.id;
    currentTargetTabId = 'active';
    conversationHistory = chatHistoryByTab[activeTab.id] || [];
  } else {
    conversationHistory = [];
  }

  await updateTabDisplay();
  renderMessages();

  setupEventListeners();
  renderSkillsDropdown();
  await updateModelPillBadge();
  await checkFirstTimeOnboarding();
}

// Settings Persistence
async function loadSettings() {
  const stored = await chrome.storage.local.get([
    'provider',
    'ollamaUrl',
    'ollamaModel',
    'customUrl',
    'customModel',
    'maxContextChars',
    'systemPrompt',
    'hidePrivacyNotice'
  ]);

  appSettings = { ...appSettings, ...stored };
  llmProvider.updateConfig(appSettings);
  applySettingsToUI();

  if (stored.hidePrivacyNotice) {
    elements.privacyNotice.style.display = 'none';
  }
}

function applySettingsToUI() {
  elements.providerRadios.forEach((radio) => {
    radio.checked = radio.value === appSettings.provider;
  });
  updateProviderFieldVisibility(appSettings.provider);

  elements.ollamaUrlInput.value = appSettings.ollamaUrl || 'http://127.0.0.1:11434';
  elements.ollamaModelInput.value = appSettings.ollamaModel || 'llama3.2';
  elements.customUrlInput.value = appSettings.customUrl || 'http://127.0.0.1:1234/v1';
  elements.customModelInput.value = appSettings.customModel || 'local-model';
  elements.maxCharsRange.value = appSettings.maxContextChars || 12000;
  updateMaxCharsLabel(elements.maxCharsRange.value);
}

function updateProviderFieldVisibility(provider) {
  elements.ollamaFields.style.display = provider === 'ollama' ? 'block' : 'none';
  elements.chromeBuiltinFields.style.display = provider === 'chrome-builtin' ? 'block' : 'none';
  elements.customFields.style.display = provider === 'custom' ? 'block' : 'none';
}

function updateMaxCharsLabel(val) {
  elements.maxCharsDisplay.textContent = `${Number(val).toLocaleString()} chars`;
}

async function updateModelPillBadge() {
  let displayName = 'Auto';
  if (appSettings.provider === 'ollama') {
    displayName = appSettings.ollamaModel || 'Ollama';
  } else if (appSettings.provider === 'chrome-builtin') {
    displayName = 'Gemini Nano';
  } else if (appSettings.provider === 'custom') {
    displayName = appSettings.customModel || 'Local';
  }

  if (displayName.length > 13) {
    displayName = displayName.slice(0, 11) + '…';
  }
  elements.modelNameText.textContent = displayName;

  const status = await llmProvider.testConnection();
  if (status.ok) {
    elements.modelStatusDot.className = 'model-status-dot';
    elements.modelSelectorPill.title = `Connected: ${status.message || displayName}`;
  } else {
    elements.modelStatusDot.className = 'model-status-dot error';
    elements.modelSelectorPill.title = `Offline: ${status.message || 'Cannot reach local model'}`;
  }
}

// Per-Tab Chat History Persistence
async function loadAllTabChats() {
  const { chatHistoryByTab: stored = {} } = await chrome.storage.local.get('chatHistoryByTab');
  chatHistoryByTab = stored;
}

async function saveAllTabChats() {
  if (currentActiveTabId) {
    chatHistoryByTab[currentActiveTabId] = conversationHistory;
  }
  await chrome.storage.local.set({ chatHistoryByTab });
}

// Physical Browser Tab Switch (user clicks/opens a different tab in Chrome)
// -> Keeps clean new chat for unopened tabs, restores chat for previously visited tabs. NO divider line added.
async function handlePhysicalTabSwitch(newTab) {
  if (!newTab?.id) return;
  if (newTab.id === currentActiveTabId) {
    await updateTabDisplay();
    return;
  }

  // 1. Save outgoing tab's conversation
  if (currentActiveTabId) {
    chatHistoryByTab[currentActiveTabId] = conversationHistory;
    await saveAllTabChats();
  }

  // 2. Set new active tab
  currentActiveTabId = newTab.id;
  currentTargetTabId = 'active';

  // 3. Load this tab's chat (or empty if it's a new tab!)
  conversationHistory = chatHistoryByTab[newTab.id] || [];

  // 4. Render this tab's chat
  renderMessages();
  await updateTabDisplay();
}

// In-Menu Target Switch (user explicitly selects a different tab / all tabs from bottom menu)
// -> Preserves current chat and inserts centered divider line mentioning the new tab context!
async function handleMenuTargetSwitch(newTargetId, specificTab = null) {
  if (String(currentTargetTabId) === String(newTargetId)) {
    return;
  }

  currentTargetTabId = newTargetId;

  let targetTab = specificTab;
  if (!targetTab && (newTargetId === 'active' || !isNaN(Number(newTargetId)))) {
    const lookupId = newTargetId === 'active' ? currentActiveTabId : Number(newTargetId);
    targetTab = lookupId ? await tabManager.getTab(lookupId) : await tabManager.getActiveTab();
  }

  // If there are existing messages in this tab's chat, append the centered divider line
  if (conversationHistory.length > 0) {
    let label = '';
    let icon = '📄';
    let isEmoji = true;

    if (newTargetId === 'all') {
      const tabs = await tabManager.getAllOpenTabs();
      label = `Switched context to: All open tabs (${tabs.length} tabs)`;
      icon = '🌐';
    } else if (newTargetId === 'none') {
      label = 'Switched context to: General chat (No tab attached)';
      icon = '💬';
    } else if (newTargetId === 'active') {
      const activeTab = await tabManager.getActiveTab();
      label = `Switched context to: Current tab ("${activeTab?.title || 'Active Tab'}")`;
      if (activeTab?.favIconUrl && !activeTab.favIconUrl.startsWith('chrome://')) {
        icon = activeTab.favIconUrl;
        isEmoji = false;
      }
    } else if (targetTab) {
      label = `Switched context to: "${targetTab.title || 'Untitled Tab'}"`;
      if (targetTab.favIconUrl && !targetTab.favIconUrl.startsWith('chrome://')) {
        icon = targetTab.favIconUrl;
        isEmoji = false;
      }
    }

    if (label) {
      const lastMsg = conversationHistory[conversationHistory.length - 1];
      if (!lastMsg || lastMsg.role !== 'tab-switch' || lastMsg.content !== label) {
        const dividerMsg = {
          role: 'tab-switch',
          content: label,
          icon,
          isEmoji,
          timestamp: Date.now()
        };
        conversationHistory.push(dividerMsg);
        await saveAllTabChats();
        appendMessageElement('tab-switch', dividerMsg.content, conversationHistory.length - 1, dividerMsg);
        scrollToBottom();
      }
    }
  }

  await updateTabDisplay();
}

// Tab Context Display & Extraction
async function updateTabDisplay() {
  elements.restrictedPill.style.display = 'none';
  elements.selectionPill.style.display = 'none';

  if (currentTargetTabId === 'none') {
    elements.tabFavicon.style.display = 'none';
    elements.tabDefaultIcon.style.display = 'inline';
    elements.tabDefaultIcon.textContent = '💬';
    elements.tabPillText.textContent = 'General chat (No tab attached)';
    currentTabContext = null;
    return;
  }

  if (currentTargetTabId === 'all') {
    elements.tabFavicon.style.display = 'none';
    elements.tabDefaultIcon.style.display = 'inline';
    elements.tabDefaultIcon.textContent = '🌐';
    elements.tabPillText.textContent = 'Sharing all open tabs in window';
    currentTabContext = { isMultiTab: true };
    return;
  }

  let tab = null;
  if (currentTargetTabId === 'active') {
    tab = await tabManager.getActiveTab();
  } else {
    tab = await tabManager.getTab(Number(currentTargetTabId));
  }

  if (!tab) {
    elements.tabFavicon.style.display = 'none';
    elements.tabDefaultIcon.style.display = 'inline';
    elements.tabDefaultIcon.textContent = '📄';
    elements.tabPillText.textContent = 'No tab active';
    currentTabContext = null;
    return;
  }

  currentActiveTabId = tab.id;

  // Favicon
  if (tab.favIconUrl && !tab.favIconUrl.startsWith('chrome://')) {
    elements.tabFavicon.src = tab.favIconUrl;
    elements.tabFavicon.style.display = 'inline';
    elements.tabDefaultIcon.style.display = 'none';
  } else {
    elements.tabFavicon.style.display = 'none';
    elements.tabDefaultIcon.style.display = 'inline';
    elements.tabDefaultIcon.textContent = '📄';
  }

  const cleanTitle = tab.title ? `Sharing "${tab.title}"` : 'Sharing active tab';
  elements.tabPillText.textContent = cleanTitle;

  // Extract content from page
  const data = await tabManager.extractContentFromTab(tab.id, appSettings.maxContextChars);

  if (data.isRestricted) {
    elements.restrictedPill.style.display = 'block';
    currentTabContext = null;
    return;
  }

  if (data.error) {
    elements.tabPillText.textContent = `Sharing "${tab.title || 'Tab'}" (${data.error})`;
    currentTabContext = null;
    return;
  }

  currentTabContext = data;

  // Highlighted text excerpt
  if (data.selection && data.selection.length > 0) {
    elements.selectionPill.style.display = 'flex';
    elements.selectionQuote.textContent = `"${data.selection}"`;
  }
}

// Open Tabs Menu Popover
async function populateTabsMenu() {
  elements.dynamicTabList.innerHTML = '';
  const tabs = await tabManager.getAllOpenTabs();

  tabs.forEach((tab) => {
    const btn = document.createElement('button');
    btn.className = `palette-item ${String(tab.id) === String(currentTargetTabId) ? 'active' : ''}`;
    btn.dataset.tabId = tab.id;

    const shortTitle = tab.title ? (tab.title.length > 35 ? tab.title.slice(0, 32) + '...' : tab.title) : 'Untitled';
    let iconHtml = '<span class="palette-item-icon">📄</span>';
    if (tab.favIconUrl && !tab.favIconUrl.startsWith('chrome://')) {
      iconHtml = `<img src="${tab.favIconUrl}" class="context-favicon" style="margin-right:4px;">`;
    }

    btn.innerHTML = `
      ${iconHtml}
      <div class="palette-item-info">
        <span class="palette-item-title">${escapeHtml(shortTitle)}</span>
        <small class="palette-item-sub">${tab.url ? new URL(tab.url).hostname : ''}</small>
      </div>
    `;

    btn.addEventListener('click', async () => {
      closeTabMenu();
      await handleMenuTargetSwitch(tab.id, tab);
    });

    elements.dynamicTabList.appendChild(btn);
  });
}

function openTabMenu() {
  closeSkillsMenu();
  populateTabsMenu();
  elements.tabDropdownMenu.style.display = 'flex';
}

function closeTabMenu() {
  elements.tabDropdownMenu.style.display = 'none';
}

// Skills Management & Dropdown
async function loadCustomSkills() {
  const { storedCustomSkills = [] } = await chrome.storage.local.get('storedCustomSkills');
  customSkills = storedCustomSkills;
}

async function saveCustomSkills() {
  await chrome.storage.local.set({ storedCustomSkills: customSkills });
}

function getAllSkills() {
  return [...DEFAULT_SKILLS, ...customSkills];
}

function renderSkillsDropdown() {
  elements.skillsItemsList.innerHTML = '';
  const allSkills = getAllSkills();

  const filtered = allSkills.filter((skill) => {
    // Category filter
    const isCustom = !DEFAULT_SKILLS.some((ds) => ds.id === skill.id);
    if (currentSkillCategory === 'custom' && !isCustom) return false;
    if (currentSkillCategory !== 'all' && currentSkillCategory !== 'custom' && skill.category !== currentSkillCategory) return false;

    // Search query filter
    if (currentSkillSearchQuery) {
      const q = currentSkillSearchQuery.toLowerCase();
      const matchName = (skill.name || '').toLowerCase().includes(q);
      const matchDesc = (skill.description || '').toLowerCase().includes(q);
      const matchInst = (skill.instructions || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchInst) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.padding = '18px 12px';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.color = 'var(--text-muted)';
    emptyMsg.style.fontSize = '12px';
    emptyMsg.textContent = 'No skills found matching this category or search.';
    elements.skillsItemsList.appendChild(emptyMsg);
    return;
  }

  filtered.forEach((skill) => {
    const isCustom = !DEFAULT_SKILLS.some((ds) => ds.id === skill.id);
    const wrapper = document.createElement('div');
    wrapper.className = 'skill-item';

    const selectBtn = document.createElement('button');
    selectBtn.className = 'skill-item-content';
    selectBtn.type = 'button';
    selectBtn.innerHTML = `
      <span class="item-icon">${skill.icon || '⚡'}</span>
      <div class="item-content">
        <span class="item-title">${escapeHtml(skill.name)}</span>
        <small class="item-desc">${escapeHtml(skill.description || skill.instructions.slice(0, 60) + '...')}</small>
      </div>
    `;

    selectBtn.addEventListener('click', () => {
      applySkill(skill);
      closeSkillsMenu();
    });

    wrapper.appendChild(selectBtn);

    // If custom skill, show delete icon
    if (isCustom) {
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-skill-btn';
      delBtn.type = 'button';
      delBtn.title = 'Delete skill';
      delBtn.innerHTML = '🗑';
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        customSkills = customSkills.filter((s) => s.id !== skill.id);
        await saveCustomSkills();
        renderSkillsDropdown();
      });
      wrapper.appendChild(delBtn);
    }

    elements.skillsItemsList.appendChild(wrapper);
  });
}

function openSkillsMenu() {
  closeTabMenu();
  renderSkillsDropdown();
  elements.skillsDropdownMenu.style.display = 'flex';
}

function closeSkillsMenu() {
  elements.skillsDropdownMenu.style.display = 'none';
}

function applySkill(skill) {
  activeSkill = skill;
  elements.activeSkillPillRow.style.display = 'flex';
  elements.activeSkillName.textContent = skill.name;

  // Execute skill directly on current tab
  handleSendMessage(skill.instructions);
}

// Add Custom Skill Modal Dialog Helpers
function openAddSkillModal() {
  closeSkillsMenu();
  elements.addSkillModalBackdrop.inert = false;
  elements.addSkillModalBackdrop.classList.add('open');
  elements.skillNameInput.value = '';
  elements.skillInstructionsInput.value = '';
  elements.skillNameInput.focus();
}

function closeAddSkillModal() {
  elements.skillsMenuBtn.focus();
  elements.addSkillModalBackdrop.classList.remove('open');
  elements.addSkillModalBackdrop.inert = true;
}

// Message Rendering
function renderMessages() {
  elements.messagesList.innerHTML = '';
  if (conversationHistory.length === 0) {
    elements.emptyState.style.display = 'flex';
    return;
  }

  elements.emptyState.style.display = 'none';

  conversationHistory.forEach((msg, idx) => {
    appendMessageElement(msg.role, msg.content, idx, msg);
  });

  scrollToBottom();
}

function appendMessageElement(role, content, index, extra = {}) {
  // Centered Context Switch Divider
  if (role === 'tab-switch') {
    const divider = document.createElement('div');
    divider.className = 'chat-tab-divider';
    divider.dataset.index = index;

    const iconHtml = extra.isEmoji === false && extra.icon
      ? `<img src="${extra.icon}" class="divider-favicon" alt="" onerror="this.style.display='none';">`
      : `<span class="divider-icon">${extra.icon || '📄'}</span>`;

    divider.innerHTML = `
      <div class="divider-line"></div>
      <div class="divider-badge" title="${escapeHtml(content)}">
        ${iconHtml}
        <span class="divider-text">${escapeHtml(content)}</span>
      </div>
      <div class="divider-line"></div>
    `;

    elements.messagesList.appendChild(divider);
    return divider;
  }

  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${role}`;
  wrapper.dataset.index = index;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (role === 'assistant') {
    bubble.innerHTML = renderMarkdown(content);
  } else {
    bubble.textContent = content;
  }
  wrapper.appendChild(bubble);

  if (role === 'assistant' && content) {
    const actions = document.createElement('div');
    actions.className = 'msg-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-msg-btn';
    copyBtn.type = 'button';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(content);
      copyBtn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.querySelector('span').textContent = 'Copy';
      }, 1500);
    });

    actions.appendChild(copyBtn);
    wrapper.appendChild(actions);
  }

  elements.messagesList.appendChild(wrapper);
  setupCodeCopyButtons(bubble);
  return wrapper;
}

function setupCodeCopyButtons(container) {
  container.querySelectorAll('.copy-code-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code-block-wrapper')?.querySelector('code')?.innerText || '';
      if (code) {
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 1500);
      }
    });
  });
}

function scrollToBottom() {
  elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
}

// Chat Submission & Streaming Execution
async function handleSendMessage(text) {
  const query = (text || elements.userInput.value).trim();
  if (!query) return;

  closeTabMenu();
  closeSkillsMenu();
  elements.userInput.value = '';
  adjustTextareaHeight();
  elements.emptyState.style.display = 'none';

  // Append user message
  const userMsgIndex = conversationHistory.length;
  conversationHistory.push({ role: 'user', content: query });
  appendMessageElement('user', query, userMsgIndex);
  scrollToBottom();

  // Assistant placeholder bubble
  const assistantMsgIndex = conversationHistory.length;
  const assistantWrapper = document.createElement('div');
  assistantWrapper.className = 'msg-wrapper assistant';
  assistantWrapper.dataset.index = assistantMsgIndex;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = `
    <div class="typing-indicator">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  assistantWrapper.appendChild(bubble);
  elements.messagesList.appendChild(assistantWrapper);
  scrollToBottom();

  // Prepare context data
  let contextPayload = currentTabContext;
  if (currentTargetTabId === 'all') {
    elements.tabPillText.textContent = 'Reading all open tabs...';
    contextPayload = await tabManager.extractContentFromAllTabs(Math.min(3000, Math.floor(appSettings.maxContextChars / 3)));
    elements.tabPillText.textContent = `Sharing all tabs (${contextPayload.accessibleCount || 0} analyzed)`;
  } else if (!currentTabContext && currentTargetTabId !== 'none') {
    await updateTabDisplay();
    contextPayload = currentTabContext;
  }

  // Abort controller
  currentAbortController = new AbortController();
  setGeneratingUI(true);

  let fullResponseText = '';
  try {
    const stream = llmProvider.streamChat({
      contextData: contextPayload,
      conversationHistory: conversationHistory.slice(0, -1),
      userMessage: query,
      signal: currentAbortController.signal,
      onDownloadProgress: (percent) => {
        bubble.innerHTML = `<span style="font-size: 12px; color: var(--accent-blue);">Downloading Gemini Nano: ${percent}%</span>`;
      }
    });

    let isFirstChunk = true;
    for await (const chunk of stream) {
      if (isFirstChunk) {
        bubble.innerHTML = '';
        isFirstChunk = false;
      }
      fullResponseText += chunk;
      bubble.innerHTML = renderMarkdown(fullResponseText);
      setupCodeCopyButtons(bubble);
      scrollToBottom();
    }

    if (!fullResponseText && !currentAbortController.signal.aborted) {
      fullResponseText = '(Empty response received from local LLM)';
      bubble.textContent = fullResponseText;
    }

    conversationHistory.push({ role: 'assistant', content: fullResponseText });
    await saveAllTabChats();

    // Copy action
    const actions = document.createElement('div');
    actions.className = 'msg-actions';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-msg-btn';
    copyBtn.type = 'button';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(fullResponseText);
      copyBtn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.querySelector('span').textContent = 'Copy';
      }, 1500);
    });
    actions.appendChild(copyBtn);
    assistantWrapper.appendChild(actions);

  } catch (err) {
    if (err.name === 'AbortError') {
      if (fullResponseText) {
        fullResponseText += '\n\n*(Generation stopped)*';
        bubble.innerHTML = renderMarkdown(fullResponseText);
        conversationHistory.push({ role: 'assistant', content: fullResponseText });
        await saveAllTabChats();
      } else {
        bubble.textContent = 'Generation stopped by user.';
      }
    } else {
      console.error('Local LLM generation failed:', err);
      bubble.innerHTML = `
        <strong>⚠️ Local AI Error:</strong><br/>
        ${err.message || 'Unknown error communicating with local LLM.'}<br/><br/>
        <small>Tip: Verify your local server is running (e.g. <code>ollama serve</code>) or click the model badge to check settings.</small>
      `;
    }
  } finally {
    setGeneratingUI(false);
    currentAbortController = null;
    scrollToBottom();
  }
}

function setGeneratingUI(isGenerating) {
  elements.sendBtn.style.display = isGenerating ? 'none' : 'flex';
  elements.stopBtn.style.display = isGenerating ? 'flex' : 'none';
  elements.userInput.disabled = isGenerating;
  if (!isGenerating) {
    elements.userInput.focus();
  }
}

function adjustTextareaHeight() {
  elements.userInput.style.height = 'auto';
  elements.userInput.style.height = `${Math.min(elements.userInput.scrollHeight, 120)}px`;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Export current chat to a formatted Markdown file
function exportCurrentChat() {
  if (conversationHistory.length === 0) {
    alert('No chat messages to export in current tab.');
    return;
  }

  const tabTitle = currentTabContext?.title || 'Chat';
  const cleanTitle = tabTitle.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `TabMind-${cleanTitle}-${dateStr}.md`;

  let md = `# TabMind Chat Export\n\n`;
  md += `* **Date:** ${new Date().toLocaleString()}\n`;
  if (currentTabContext?.title) {
    md += `* **Tab:** ${currentTabContext.title}\n`;
  }
  if (currentTabContext?.url) {
    md += `* **URL:** ${currentTabContext.url}\n`;
  }
  md += `* **Engine:** ${appSettings.provider} (${appSettings.ollamaModel || appSettings.customModel || 'Gemini Nano'})\n\n`;
  md += `---\n\n`;

  conversationHistory.forEach((msg) => {
    if (msg.role === 'tab-switch') {
      md += `\n> ─── 🔄 ${msg.content} ───\n\n`;
    } else if (msg.role === 'user') {
      md += `### 👤 User\n\n${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      md += `### 🤖 Assistant\n\n${msg.content}\n\n`;
    }
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Event Listeners
function setupEventListeners() {
  // Dismiss Privacy Notice
  elements.dismissNoticeBtn.addEventListener('click', async () => {
    elements.privacyNotice.style.display = 'none';
    await chrome.storage.local.set({ hidePrivacyNotice: true });
  });

  // Tab Context Pill Click
  elements.tabContextPill.addEventListener('click', (e) => {
    if (e.target.closest('#detachTabBtn')) return;
    if (elements.tabDropdownMenu.style.display === 'flex') {
      closeTabMenu();
    } else {
      openTabMenu();
    }
  });

  // Detach tab button
  elements.detachTabBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await handleMenuTargetSwitch('none');
  });

  // Refresh context button
  elements.refreshContextBtn.addEventListener('click', async () => {
    await updateTabDisplay();
  });

  // Dismiss Selection
  elements.clearSelectionBtn.addEventListener('click', () => {
    elements.selectionPill.style.display = 'none';
    if (currentTabContext) {
      currentTabContext.selection = '';
    }
  });

  // Dismiss Skill Pill
  elements.clearSkillBtn.addEventListener('click', () => {
    activeSkill = null;
    elements.activeSkillPillRow.style.display = 'none';
  });

  // Tab Menu Dropdown static options
  elements.dropdownItemsList.addEventListener('click', async (e) => {
    const item = e.target.closest('.palette-item, .dropdown-item');
    if (!item) return;
    const tabId = item.dataset.tabId;
    if (tabId) {
      closeTabMenu();
      await handleMenuTargetSwitch(tabId);
    }
  });

  elements.closeDropdownBtn.addEventListener('click', closeTabMenu);

  // + Tab Tool Button
  elements.atMentionBtn.addEventListener('click', () => {
    if (elements.tabDropdownMenu.style.display === 'flex') {
      closeTabMenu();
    } else {
      openTabMenu();
    }
  });

  // Skills Menu Tool Button
  elements.skillsMenuBtn.addEventListener('click', () => {
    if (elements.skillsDropdownMenu.style.display === 'flex') {
      closeSkillsMenu();
    } else {
      openSkillsMenu();
    }
  });

  elements.closeSkillsMenuBtn.addEventListener('click', closeSkillsMenu);

  // Skills Category Filtering
  elements.skillsCategoryBar.addEventListener('click', (e) => {
    const pill = e.target.closest('.palette-cat-chip, .skill-cat-pill');
    if (!pill) return;
    elements.skillsCategoryBar.querySelectorAll('.palette-cat-chip, .skill-cat-pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    currentSkillCategory = pill.dataset.cat || 'all';
    renderSkillsDropdown();
  });

  // Skills Search Box
  elements.skillSearchInput.addEventListener('input', (e) => {
    currentSkillSearchQuery = e.target.value.trim();
    renderSkillsDropdown();
  });

  // Add Skill Modal Triggers
  elements.openAddSkillModalBtn.addEventListener('click', openAddSkillModal);
  elements.cancelAddSkillBtn.addEventListener('click', closeAddSkillModal);

  // Add Skill Form Submit
  elements.addSkillForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = elements.skillNameInput.value.trim();
    const instructions = elements.skillInstructionsInput.value.trim();

    if (!name || !instructions) return;

    const newSkill = {
      id: `custom-skill-${Date.now()}`,
      name,
      description: instructions.length > 45 ? instructions.slice(0, 42) + '...' : instructions,
      instructions
    };

    customSkills.push(newSkill);
    await saveCustomSkills();
    renderSkillsDropdown();
    closeAddSkillModal();

    // Automatically apply the new skill
    applySkill(newSkill);
  });

  // Input typing: Detect '/' for skills, '@' for tabs
  elements.userInput.addEventListener('input', () => {
    adjustTextareaHeight();
    const val = elements.userInput.value;
    if (val.endsWith('/')) {
      openSkillsMenu();
    } else if (val.endsWith('@')) {
      openTabMenu();
    }
  });

  elements.userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Chat Form Submit
  elements.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // Stop Generation Button
  elements.stopBtn.addEventListener('click', () => {
    if (currentAbortController) {
      currentAbortController.abort();
    }
  });

  // New Chat Button (+)
  elements.newChatBtn?.addEventListener('click', async () => {
    conversationHistory = [];
    currentTargetTabId = 'active';
    await saveAllTabChats();
    renderMessages();
    await updateTabDisplay();
  });

  // Export Chat Button
  elements.exportChatBtn?.addEventListener('click', () => {
    exportCurrentChat();
  });

  // Clear Chat Button (Trash)
  elements.clearChatBtn.addEventListener('click', async () => {
    if (conversationHistory.length === 0) return;
    conversationHistory = [];
    await saveAllTabChats();
    renderMessages();
  });

  // Suggested Prompts / Action Tiles Clicks in Empty State
  elements.suggestedPromptsList.addEventListener('click', (e) => {
    const tile = e.target.closest('.action-tile, .suggestion-pill');
    if (tile && tile.dataset.prompt) {
      handleSendMessage(tile.dataset.prompt);
    }
  });

  // Close menus on outside click
  document.addEventListener('click', (e) => {
    if (
      elements.skillsDropdownMenu.style.display === 'flex' &&
      !e.target.closest('#skillsDropdownMenu') &&
      !e.target.closest('#skillsMenuBtn')
    ) {
      closeSkillsMenu();
    }
    if (
      elements.tabDropdownMenu.style.display === 'flex' &&
      !e.target.closest('#tabDropdownMenu') &&
      !e.target.closest('#tabContextPill') &&
      !e.target.closest('#atMentionBtn')
    ) {
      closeTabMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSkillsMenu();
      closeTabMenu();
      closeAddSkillModal();
    }
  });

  // Model Badge Click opens settings
  elements.modelSelectorPill.addEventListener('click', openSettingsDrawer);

  // Settings Drawer Helper Functions
  function openSettingsDrawer() {
    elements.settingsDrawer.inert = false;
    elements.settingsDrawer.classList.add('open');
    elements.closeSettingsBtn.focus();
  }

  function closeSettingsDrawer() {
    elements.settingsBtn.focus();
    elements.settingsDrawer.classList.remove('open');
    elements.settingsDrawer.inert = true;
    elements.testResult.style.display = 'none';
  }

  elements.settingsBtn.addEventListener('click', openSettingsDrawer);
  elements.closeSettingsBtn.addEventListener('click', closeSettingsDrawer);

  // Provider Radio Switch
  elements.providerRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      updateProviderFieldVisibility(e.target.value);
    });
  });

  // Range Slider
  elements.maxCharsRange.addEventListener('input', (e) => {
    updateMaxCharsLabel(e.target.value);
  });

  // Fetch Ollama Models
  elements.fetchOllamaModelsBtn.addEventListener('click', async () => {
    elements.fetchOllamaModelsBtn.textContent = 'Checking...';
    try {
      const url = elements.ollamaUrlInput.value.trim().replace(/\/+$/, '');
      const resp = await fetch(`${url}/api/tags`);
      const data = await resp.json();
      const models = (data.models || []).map((m) => m.name);

      if (models.length > 0) {
        elements.ollamaModelSelect.innerHTML = '';
        models.forEach((m) => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          elements.ollamaModelSelect.appendChild(opt);
        });
        elements.ollamaModelSelect.value = models[0];
        elements.ollamaModelInput.value = models[0];
        elements.ollamaModelSelect.style.display = 'block';
        elements.ollamaModelInput.style.display = 'none';
        elements.fetchOllamaModelsBtn.textContent = 'Detected!';
      } else {
        alert('No models found in Ollama. Pull one: `ollama pull llama3.2`');
        elements.fetchOllamaModelsBtn.textContent = 'Detect Models';
      }
    } catch (err) {
      alert(`Could not connect to Ollama: ${err.message}`);
      elements.fetchOllamaModelsBtn.textContent = 'Detect Models';
    }
  });

  elements.ollamaModelSelect.addEventListener('change', (e) => {
    elements.ollamaModelInput.value = e.target.value;
  });

  // Test Connection Button
  elements.testConnectionBtn.addEventListener('click', async () => {
    elements.testResult.style.display = 'block';
    elements.testResult.className = 'test-result';
    elements.testResult.textContent = 'Testing connection...';

    const selectedProvider = Array.from(elements.providerRadios).find((r) => r.checked)?.value || 'ollama';
    const tempConfig = {
      provider: selectedProvider,
      ollamaUrl: elements.ollamaUrlInput.value.trim(),
      ollamaModel: elements.ollamaModelInput.value.trim(),
      customUrl: elements.customUrlInput.value.trim(),
      customModel: elements.customModelInput.value.trim()
    };

    llmProvider.updateConfig(tempConfig);
    const result = await llmProvider.testConnection();

    if (result.ok) {
      elements.testResult.className = 'test-result success';
      elements.testResult.textContent = `✅ ${result.message}`;
    } else {
      elements.testResult.className = 'test-result error';
      elements.testResult.textContent = `❌ ${result.message}`;
    }
  });

  // Save Settings Button
  elements.saveSettingsBtn.addEventListener('click', async () => {
    const selectedProvider = Array.from(elements.providerRadios).find((r) => r.checked)?.value || 'ollama';
    const newSettings = {
      provider: selectedProvider,
      ollamaUrl: elements.ollamaUrlInput.value.trim(),
      ollamaModel: elements.ollamaModelInput.value.trim(),
      customUrl: elements.customUrlInput.value.trim(),
      customModel: elements.customModelInput.value.trim(),
      maxContextChars: Number(elements.maxCharsRange.value)
    };

    appSettings = { ...appSettings, ...newSettings };
    llmProvider.updateConfig(appSettings);
    await chrome.storage.local.set(newSettings);

    closeSettingsDrawer();

    await updateModelPillBadge();
    await updateTabDisplay();
  });

  // Onboarding & Help Guide
  elements.helpBtn?.addEventListener('click', () => openOnboarding(1));
  elements.skipOnboardingBtn?.addEventListener('click', () => closeOnboarding(true));
  elements.onboardingBackBtn?.addEventListener('click', () => setOnboardingStep(currentOnboardingStep - 1));
  elements.onboardingNextBtn?.addEventListener('click', () => {
    if (currentOnboardingStep < 3) {
      setOnboardingStep(currentOnboardingStep + 1);
    } else {
      closeOnboarding(true);
    }
  });
  elements.onboardingDots?.forEach((dot) => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.dataset.step, 10);
      if (step) setOnboardingStep(step);
    });
  });
}

// Start
init();
