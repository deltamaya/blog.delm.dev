import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeKatexSvelte from 'rehype-katex-svelte';
import remarkMath from 'remark-math';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
  preprocess: [
		vitePreprocess(),
    mdsvex({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatexSvelte],
    }),
  ],
	kit: {
		adapter: adapter({
			// see below for options that can be set here
		})
	},
	extensions: ['.svelte','.md']
};

export default config;
