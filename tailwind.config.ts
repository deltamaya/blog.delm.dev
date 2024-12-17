import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				IBMPlexSansSC: ['IBM Plex Sans SC', 'sans-serif'],
				JetBrainsMono: ['JetBrains Mono', 'sans-serif']
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
						code: {
							padding: '0 !important',
							color: theme('colors.red.500'),
							fontFamily: 'JetBrains Mono, monospace',
							fontWeight: theme('fontWeight.bold'),
							whiteSpace: 'pre-wrap' /* 确保 code 也自动换行 */,
							wordBreak: 'break-word'
						},
						pre: {
							fontWeight: theme('fontWeight.bold'),
							fontFamily: 'JetBrains Mono, monospace',
							whiteSpace: 'pre-wrap' /* 自动换行 */,
							wordBreak: 'break-word' /* 单词换行 */
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
