import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
  preprocess: [
		vitePreprocess(),
  ],
	kit: {
		adapter: adapter({
			// see below for options that can be set here
		})
	},
	extensions: ['.svelte','.md']
};

export default config;
