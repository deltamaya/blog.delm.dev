import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	kit: {
		adapter: adapter({ precompress: true, fallback: '404.html' })
	},

	extensions: ['.svelte','.md'],
	preprocess:[]
};
export default config;
