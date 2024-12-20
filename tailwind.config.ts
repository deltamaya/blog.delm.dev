import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
Sans: [
  '-apple-system',
	  'IBM Plex Sans SC',
  'IBM Plex Sans',
  'Inter',
  'Noto Sans SC',
  'system-ui',
  'sans-serif',
],

				JetBrainsMono: ['JetBrains Mono', 'consolas','monospace']
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						a: {
							color: theme('colors.red.500'),
							textDecoration: theme('textDecoration.underline'),
							'&:hover': {
								color: theme('colors.red.700')
							}
						},
						'pre code': {
							backgroundColor: theme('colors.neutral.800'),
							padding: '0px !important'
						},
						code: {
							padding: '3px !important',
							backgroundColor: theme('colors.neutral.100'),
							borderRadius: '3px',
							color: theme('colors.red.500'),
							fontFamily: 'JetBrains Mono, monospace',
							fontWeight: theme('fontWeight.bold'),
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word'
						},
						pre: {
							fontWeight: theme('fontWeight.bold'),
							fontFamily: 'JetBrains Mono, monospace',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word'
						},
						'.info-block p': {
							margin: '0 !important'
						},
						blockquote: {
							borderLeftWidth: '5px',
							padding: '0.25rem 1rem'
						},
						hr: {
							height: '3px',
							backgroundColor: theme('colors.neutral.200')
						}
					}
				}
			})
		}
	},
	plugins: [require('@tailwindcss/typography')]
} satisfies Config;
