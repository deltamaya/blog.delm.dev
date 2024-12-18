import fs from 'fs';
import path from 'path';
import { languageTag } from '$lib/paraglide/runtime';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { blockquoteHandler } from '$lib/blockquote.js';
import { headingHandler } from '$lib/heading.js';
import { marked } from 'marked';
import { katexHandler } from '$lib/katex';

export function load({ params }) {
	const { slug } = params;
	const filePath = path.resolve(`content/${languageTag()}/${slug}.md`);
	const content = fs.readFileSync(filePath, 'utf-8');
	const data = matter(content);
	const headings: { depth: number; text: string; id: string }[] = [];

	const renderer = new marked.Renderer();

	renderer.code = ({ text, lang }) => {
		const validLang = lang && hljs.getLanguage(lang);
		const highlighted = validLang ? hljs.highlight(text, { language: lang }).value : text;
		return `<div class="relative group">
				<pre><code class="hljs ${lang ? `language-${lang}` : ''} !bg-neutral-800">${highlighted}</code></pre>
				<button class="copy-button hidden absolute group-hover:block top-2 right-2 bg-neutral-500 text-white text-sm px-2 py-1 rounded">Copy</button>
				</div>`;
	};
	renderer.blockquote =blockquoteHandler;
	renderer.heading = (heading) => headingHandler(heading, headings);
  renderer.text = katexHandler

	marked.setOptions({ renderer: renderer});
	const innerHtml = marked(data.content);
	return {
		content: innerHtml,
		metadata: data.data,
		headings: headings
	};
}
