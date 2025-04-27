import adapter from '@sveltejs/adapter-static';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [],
	kit: {
		adapter: adapter()
	},
	extensions: ['.svelte'],
};
export default config;