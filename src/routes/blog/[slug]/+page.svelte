<script>
	import hljs from 'highlight.js';
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
	import { marked } from 'marked';
	import { criticalBlock, importantBlock, noteBlock, tipBlock, warningBlock } from '$lib/blockquote';

	function handleCopy(event) {
		const button = event.target;
		const codeBlock = button.previousElementSibling;
		const code = codeBlock.textContent;

		navigator.clipboard.writeText(code).then(() => {
			button.textContent = m.Copied();
			button.disabled = true;

			setTimeout(() => {
				button.textContent = m.Copy();
				button.disabled = false;
			}, 3000);
		});
	}

	const renderer = new marked.Renderer();

	renderer.code = ({ text, lang, escaped }) => {
		const validLang = lang && hljs.getLanguage(lang);
		const highlighted = validLang
			? hljs.highlight(text, { language: lang }).value
			: text;
		return `<div class="relative group">
				<pre><code class="hljs ${lang ? `language-${lang}` : ''}">${highlighted}</code></pre>
				<button class="copy-button hidden absolute group-hover:block top-2 right-2 bg-gray-600 text-white text-sm px-2 py-1 rounded">Copy</button>
				</div>`;
	};
	renderer.blockquote = (quote) => {
		if (quote.text.startsWith('[!TIP]')) {
			return tipBlock(quote);
		}
		if (quote.text.startsWith('[!NOTE]')) {
			return noteBlock(quote);
		}
		if (quote.text.startsWith('[!IMPORTANT]')) {
			return importantBlock(quote);
		}
		if (quote.text.startsWith('[!WARNING]')) {
			return warningBlock(quote);
		}
		if (quote.text.startsWith('[!CRITICAL]')) {
			return criticalBlock(quote);
		}
		return `<blockquote>${marked.Parser.parse(quote.tokens)}</blockquote>`;
	};
	marked.setOptions({ renderer: renderer });

	$effect(() => {
		const buttons = document.querySelectorAll('.copy-button');
		buttons.forEach(button => {
			button.textContent = m.Copy();
			if (!button.dataset.bound) {
				button.addEventListener('click', handleCopy);
				button.dataset.bound = true;
			}
		});
	});
	''.toUpperCase()
</script>

<div class="flex-grow flex justify-center items-center p-4">
	<div class="h-full w-full max-w-[48rem]">
		<h1 class="text-5xl font-bold">
			{data.metadata.title}
		</h1>
		<div class="text-base text-gray-500">
			{data.metadata.date}
			· {m.AuthoredBy(data.metadata.authors.join(', '))}
		</div>
		<div  class="text-lg text-red-500 font-bold flex flex-wrap">
			{#each data.metadata.tags as tag}
				<a href="tags/{tag.toLowerCase()}" class="mr-5 ">#{tag.toUpperCase()}</a>
				{/each}
		</div>
		{#if data.metadata.ai}
			<div class="flex flex-col bg-stone-300 rounded-xl p-5 mt-3">
				{m.AITranslated()}
			</div>
			{/if}
		<article class="prose prose-stone lg:prose-lg prose-base prose-p:!my-2 mt-10 flex-wrap">
			{@html marked(data.content)}
		</article>
	</div>
</div>
