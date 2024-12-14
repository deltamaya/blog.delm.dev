import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
        IBMPlexSansSC: ['IBM Plex Sans SC', 'sans-serif'], // 定义新的字体家族
      },
		}
	},

	plugins: []
} satisfies Config;
