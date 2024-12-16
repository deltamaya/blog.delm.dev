import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				IBMPlexSansSC: ['IBM Plex Sans SC', 'sans-serif'],
				JetBrainsMono: ['JetBrains Mono', 'sans-serif'],
			},
			typography: ({theme})=>({
				DEFAULT: {
					css: {
						p: {
							color: theme('colors.stone.900'),
							lineHeight: '1.25',
						},
						li:{
							color:  theme('colors.stone.900'),
							lineHeight: '1.25' ,
						},
						a: {
							color: theme('colors.red.500'),
							textDecoration: theme('textDecoration.underline'),
							'&:hover': {
								color: theme('colors.red.700')
							}
						},
						code: {
							color:  theme('colors.red.500'),
							fontFamily:"JetBrains Mono, monospace",
							fontWeight:theme('fontWeight.bold'),
						},
						pre:{
							fontWeight:theme('fontWeight.bold'),
							fontFamily:"JetBrains Mono, monospace",
						},
						blockquote:{
							borderLeftWidth: '5px',
							borderLeftColor: theme('colors.stone.800'),
							padding:'0.25rem 1rem',
						},
						hr:{
							height: '3px',
							backgroundColor: theme('colors.stone.300')
						}
					}
				}
			})
		}
	},
	plugins: [require('@tailwindcss/typography')]
} satisfies Config;
