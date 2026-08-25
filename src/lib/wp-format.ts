/**
 * Parses raw Gutenberg/WordPress article content, converting markdown headings,
 * callout prompts, video links, checkmark lists, and raw paragraphs into clean HTML.
 */
export function formatArticleContent(raw: string | null | undefined): string {
  if (!raw) return "";

  // Normalize line endings
  let text = raw.replace(/\r\n/g, "\n");

  // Clean leading/trailing quotes or stray characters from bulk imports
  text = text.replace(/^["'\s)]+/, "").replace(/["'\s]+$/, "");

  // Convert markdown headings (must be at start of line)
  text = text.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  text = text.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  text = text.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  text = text.replace(/^#\s+(.+)$/gm, "<h2>$1</h2>");

  // Convert horizontal dividers
  text = text.replace(/^---+$/gm, '<hr class="my-8 border-neutral-200" />');

  // Convert Prompt blocks
  text = text.replace(
    /(?:✨\s*)?Prompt:\s*([\s\S]*?)(?=(?:\n\n###|\n\n##|\n\n<h|$))/gi,
    '<div class="my-6 p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-lg"><div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2"><span class="inline-block h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span> ✨ AI Prompt Used</div><p class="text-sm font-mono leading-relaxed text-neutral-200">$1</p></div>\n\n'
  );

  // Convert Video links into interactive action callouts
  text = text.replace(
    /(?:Watch the Video Now:\s*|Here is Generated Content[^:\n]*:\s*)(https?:\/\/[^\s<]+)/gi,
    '<div class="my-6 p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between flex-wrap gap-3"><div class="flex items-center gap-2.5 font-semibold text-neutral-900 text-sm"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">▶</span> Generated AI Video Output</div><a href="$1" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-orange-600 transition">Watch Video ↗</a></div>'
  );

  // Convert Checkmark lists: Results:✅ item 1 ✅ item 2
  text = text.replace(/(?:Results:\s*)?((?:✅[^\n✅]+)+)/g, (match: string, itemsStr: string) => {
    const items = itemsStr.split("✅").map((s: string) => s.trim()).filter(Boolean);
    if (!items.length) return match;
    const listHtml = items
      .map(
        (it: string) =>
          `<li class="flex items-start gap-2.5 text-neutral-800 text-sm"><span class="text-emerald-500 font-bold flex-none">✓</span><span>${it}</span></li>`
      )
      .join("\n");
    return `<ul class="my-4 space-y-2 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">${listHtml}</ul>`;
  });

  // Convert bold and italic markdown if not inside HTML tags
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

  // Wrap loose text blocks in <p> if not already wrapped in block-level HTML tags
  const blocks = text.split(/\n\s*\n/);
  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (/^<(h[1-6]|p|div|ul|ol|table|blockquote|section|article|hr|details|figure)/i.test(trimmed)) {
      return trimmed;
    }
    return `<p class="leading-relaxed text-neutral-700 my-4">${trimmed}</p>`;
  });

  return formattedBlocks.filter(Boolean).join("\n\n");
}
