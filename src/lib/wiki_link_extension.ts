import * as marked from 'marked';
import {getAllBlogsMeta} from '$lib/blogs';
import { languageTag } from '$lib/paraglide/runtime';

export default function wikiLinkExtension(): marked.MarkedExtension {
	return {
		extensions: [wikiLinkTokenizer()]
	};
}

function wikiLinkTokenizer():marked.TokenizerAndRendererExtension{
	const allBlogsMeta = getAllBlogsMeta();
	return {
		name: 'wikiLink',
		level: 'inline',
		start(src: string) {
			return src.indexOf('[[');
		},
		tokenizer(src: string, _tokens) {
			const match = src.match(/^\[\[([^\]]+?)\]\]/);
			if (match) {
				return {
					type: 'wikiLink',
					raw: match[0],
					text: match[1].trim()
				};
			}
		},
		renderer(token) {
			const blog=allBlogsMeta.find((blog) => blog.slug === token.text);
			if (!blog) {
				return token.raw;
			}
			return `
<div class="not-prose lg:text-xl md:text-lg flex px-3 py-2 transition-colors duration-200 border-[2px] dark:border-neutral-800 border-neutral-200 px-4 py-2"  >
	<div class="flex flex-col font-normal" >
			<a href="/blog/${token.text}" class="text-neutral-900 dark:text-neutral-100 font-bold">
							${blog.title}
				<div class="flex flex-wrap text-sm font-medium text-neutral-500">
					${blog.date.toLocaleDateString(languageTag())}
				</div>
			</a>
		<div class="flex flex-wrap text-sm font-bold text-red-500">
		${blog.tags.map((tag) => `<a href="/tags/${tag.toLowerCase()}" class="mr-3 hover:underline">#${tag.toUpperCase()}</a>`).join('')}
		</div>
	</div>
</div>
			`;
		}
	}
}