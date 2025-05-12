import fs from 'fs';
import path from 'path';
import { languageTag } from '$lib/paraglide/runtime';
import matter from 'gray-matter';
import hljs from 'highlight.js';
import { blockquoteHandler } from '$lib/blockquote.js';
import { headingHandler } from '$lib/heading.js';
import { marked } from 'marked';
import KatexExtension from '$lib/katex_extension';

export async function load({ params }) {
	const { slug } = params;
	const filePath = path.resolve(`content/${languageTag()}/${slug}.md`);
	const content = fs.readFileSync(filePath, 'utf-8');
	const data = matter(content);
	const headings: { depth: number; text: string; id: string }[] = [];

	const renderer = new marked.Renderer();
	marked.use(KatexExtension({}));
	renderer.code = ({ text, lang }) => {
		const validLang = lang && hljs.getLanguage(lang);
		const highlighted = validLang ? hljs.highlight(text, { language: lang }).value : text;
		return `<div class="relative group">
				<pre><code class="hljs ${lang ? `language-${lang}` : ''} !bg-neutral-900">${highlighted}</code></pre>
				<button class="copy-button opacity-0 absolute group-hover:opacity-100 top-2 right-2 bg-neutral-900 border-[1px] border-neutral-700 dark:border-neutral-800 text-white text-sm px-2 py-1 transition-opacity duration-200">Copy</button>
				</div>`;
	};
	renderer.image = function ({ href, title, text }) {
		let staticPath=''
		if(href.startsWith('/')||href.startsWith('http://')||href.startsWith('https://')){
			staticPath = href
		}else{
			staticPath=`/${href}`
		}
		const titleAttr = title ? ` title="${title}"` : '';
		return `<figure class="justify-center flex flex-col my-5"><img class="!my-0" src="${staticPath}" alt="${text}"${titleAttr} /><figcaption class="self-center text-sm dark:text-neutral-400 text-neutral-600 !mt-2">${text}</figcaption></figure>`;
	};
	renderer.blockquote = blockquoteHandler;
	renderer.heading = (heading) => headingHandler(heading, headings);
	marked.setOptions({ renderer: renderer });
	const innerHtml = marked(data.content);

	return {
		content: innerHtml,
		metadata: data.data,
		headings: headings
	};
}
