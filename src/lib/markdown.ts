import { marked, type Tokens } from 'marked';
import hljs from 'highlight.js';
import katex from 'katex';

export interface Heading {
    depth: number;
    text: string;
    id: string;
}

// ---------- KaTeX extension ----------
function inlineKatex(): marked.TokenizerAndRendererExtension {
    return {
        name: 'inlineKatex',
        level: 'inline',
        start(src) {
            return src.indexOf('$');
        },
        tokenizer(src) {
            const match = src.match(/^\$+([^$\n]+?)\$+/);
            if (match) return { type: 'inlineKatex', raw: match[0], text: match[1].trim() };
        },
        renderer(token) {
            return katex.renderToString(token.text, { throwOnError: false, displayMode: false });
        },
    };
}

function blockKatex(): marked.TokenizerAndRendererExtension {
    return {
        name: 'blockKatex',
        level: 'block',
        start(src) {
            return src.indexOf('$$');
        },
        tokenizer(src) {
            const match = src.match(/^\$\$([^$]+?)\$\$/);
            if (match) return { type: 'blockKatex', raw: match[0], text: match[1].trim() };
        },
        renderer(token) {
            return katex.renderToString(token.text, { throwOnError: false, displayMode: true });
        },
    };
}

// ---------- Blockquote handler ----------
function renderBlockquote(quote: Tokens.Blockquote): string {
    const inner = marked.Parser.parse(quote.tokens);

    if (quote.text.startsWith('[!TIP]')) {
        const text = inner.replace('[!TIP]', '');
        return `<div class="info-block border-l-[5px] border-green-700 px-[1rem] py-[0.25rem] my-5">
<div class="flex text-green-800 dark:text-green-600 items-center font-bold">
<svg viewBox="0 0 16 16" aria-hidden="true" height="20" width="20" class="fill-current mr-2 mb-1"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>
Tip</div>${text}</div>`;
    }
    if (quote.text.startsWith('[!NOTE]')) {
        const text = inner.replace('[!NOTE]', '');
        return `<div class="info-block border-l-[5px] border-blue-700 px-[1rem] py-[0.25rem] my-5">
<div class="flex text-blue-800 dark:text-blue-600 items-center font-bold">
<svg viewBox="0 0 16 16" aria-hidden="true" height="20" width="20" class="fill-current mr-2 mb-1"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>
Note</div><div>${text}</div></div>`;
    }
    if (quote.text.startsWith('[!IMPORTANT]')) {
        const text = inner.replace('[!IMPORTANT]', '');
        return `<div class="info-block border-l-[5px] border-purple-700 px-[1rem] py-[0.25rem] my-5 font-bold">
<div class="flex text-purple-800 dark:text-purple-600 items-center font-bold">
<svg viewBox="0 0 16 16" aria-hidden="true" height="20" width="20" class="fill-current mr-2 mb-1"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
Important</div>${text}</div>`;
    }
    if (quote.text.startsWith('[!WARNING]')) {
        const text = inner.replace('[!WARNING]', '');
        return `<div class="info-block border-l-[5px] border-yellow-600 px-[1rem] py-[0.25rem] my-5 font-bold">
<div class="flex text-yellow-600 items-center font-bold">
<svg viewBox="0 0 16 16" aria-hidden="true" height="20" width="20" class="fill-current mr-2 mb-1"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>
Warning</div>${text}</div>`;
    }
    if (quote.text.startsWith('[!CRITICAL]')) {
        const text = inner.replace('[!CRITICAL]', '');
        return `<div class="info-block border-l-[5px] border-red-600 px-[1rem] py-[0.25rem] my-5 font-bold">
<div class="flex text-red-600 items-center font-bold">
<svg viewBox="0 0 16 16" aria-hidden="true" height="20" width="20" class="fill-current mr-2 mb-1"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>
Critical</div>${text}</div>`;
    }
    return `<blockquote>${inner}</blockquote>`;
}

// ---------- 模块加载时只初始化一次 marked ----------
let markedInitialized = false;

function ensureMarkedInitialized() {
    if (markedInitialized) return;
    markedInitialized = true;
    marked.use({ extensions: [inlineKatex(), blockKatex()] });
}

// ---------- Main renderer ----------
export function renderMarkdown(rawContent: string): { html: string; headings: Heading[] } {
    ensureMarkedInitialized();

    const headings: Heading[] = [];
    const renderer = new marked.Renderer();

    renderer.code = ({ text, lang }) => {
        const validLang = lang && hljs.getLanguage(lang);
        const highlighted = validLang ? hljs.highlight(text, { language: lang! }).value : text;
        return `<div class="relative group">
  <pre><code class="hljs ${lang ? `language-${lang}` : ''} !bg-neutral-900">${highlighted}</code></pre>
  <button class="copy-button opacity-0 absolute group-hover:opacity-100 top-2 right-2 bg-neutral-900 border border-neutral-700 dark:border-neutral-800 text-white text-sm px-2 py-1 transition-opacity duration-200 font-sans">Copy</button>
</div>`;
    };

    renderer.image = ({ href, title, text }) => {
        const src = href.startsWith('/') || href.startsWith('http') ? href : `/${href}`;
        const titleAttr = title ? ` title="${title}"` : '';
        return `<figure class="justify-center flex flex-col my-5"><img class="!my-0" src="${src}" alt="${text}"${titleAttr} /><figcaption class="self-center text-base dark:text-neutral-400 text-neutral-600 !mt-2">${text}</figcaption></figure>`;
    };

    renderer.blockquote = renderBlockquote;

    renderer.heading = ({ text: headingText, depth, tokens }) => {
        const id = headingText.toLowerCase().replace(/\s+/g, '-').replaceAll('"', '');
        headings.push({ depth, text: headingText, id });
        return `<h${depth} id="${id}">${marked.Parser.parseInline(tokens)}</h${depth}>`;
    };

    const html = marked.parse(rawContent, { renderer }) as string;
    return { html, headings };
}
