// Safe, lightweight markdown renderer with Table, Link, List & Code support

export function renderMarkdown(markdownText) {
  if (!markdownText) return '';

  // Escape HTML to prevent injection
  const escapeHtml = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // First extract code blocks to protect them from inline parsing
  const codeBlocks = [];
  let text = markdownText.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const id = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({ lang: lang || 'text', code: escapeHtml(code.trimEnd()) });
    return id;
  });

  // Escape remaining text
  text = escapeHtml(text);

  // Markdown Tables (| col1 | col2 |)
  const tableRegex = /((?:^|\n)\|[^\n]+\|\r?\n\|[-:\s|]+\|\r?\n(?:\|[^\n]+\|\r?\n?)+)/g;
  text = text.replace(tableRegex, (match) => {
    const lines = match
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.startsWith('|') && l.endsWith('|'));
    if (lines.length < 2) return match;

    const parseRow = (line) =>
      line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

    const headerCols = parseRow(lines[0]);
    const alignLine = parseRow(lines[1]);
    const alignments = alignLine.map((a) => {
      if (a.startsWith(':') && a.endsWith(':')) return 'center';
      if (a.endsWith(':')) return 'right';
      return 'left';
    });

    let html = '<div class="table-container"><table class="md-table"><thead><tr>';
    headerCols.forEach((col, i) => {
      const align = alignments[i] || 'left';
      html += `<th style="text-align: ${align}">${col}</th>`;
    });
    html += '</tr></thead><tbody>';

    for (let r = 2; r < lines.length; r++) {
      const rowCols = parseRow(lines[r]);
      html += '<tr>';
      rowCols.forEach((col, i) => {
        const align = alignments[i] || 'left';
        html += `<td style="text-align: ${align}">${col}</td>`;
      });
      html += '</tr>';
    }

    html += '</tbody></table></div>';
    return '\n\n' + html + '\n\n';
  });

  // Headers (# H1, ## H2, ### H3)
  text = text.replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
  text = text.replace(/^## (.*$)/gim, '<h3 class="md-h3">$1</h3>');
  text = text.replace(/^# (.*$)/gim, '<h2 class="md-h2">$1</h2>');

  // Blockquotes
  text = text.replace(/^\> (.*$)/gim, '<blockquote class="md-quote">$1</blockquote>');

  // Links: [text](url)
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
  );

  // Bold and Italic
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^\*\n]+)\*/g, '<em>$1</em>');
  text = text.replace(/_([^_\n]+)_/g, '<em>$1</em>');

  // Inline code
  text = text.replace(/`([^`\n]+)`/g, '<code class="md-inline-code">$1</code>');

  // Lists: Unordered (- or *)
  text = text.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="md-li">$1</li>');
  text = text.replace(/(<li class="md-li">.*<\/li>(\n|$))+/g, '<ul class="md-ul">$&</ul>');

  // Lists: Ordered (1. 2. etc.)
  text = text.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="md-oli">$2</li>');
  text = text.replace(/(<li class="md-oli">.*<\/li>(\n|$))+/g, '<ol class="md-ol">$&</ol>');

  // Paragraphs: split by double newlines, join non-block elements with <p>
  const parts = text.split(/\n{2,}/);
  text = parts
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      if (/^<(h\d|ul|ol|blockquote|div|pre|table)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p class="md-p">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    const codeHtml = `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang">${block.lang}</span>
          <button class="copy-code-btn" type="button" aria-label="Copy code">Copy</button>
        </div>
        <pre><code class="language-${block.lang}">${block.code}</code></pre>
      </div>`;
    text = text.replace(`__CODE_BLOCK_${index}__`, codeHtml);
  });

  return text;
}
