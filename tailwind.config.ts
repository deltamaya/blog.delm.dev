import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				Sans: ['-apple-system', 'Inter', 'Noto Sans SC', 'Noto Sans TC', 'system-ui', 'sans-serif'],
				JetBrainsMono: ['JetBrains Mono', 'consolas', 'monospace']
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
							backgroundColor: theme('colors.neutral.300') + ' !important',
							padding: '0px !important'
						},
						code: {
							padding: '2px !important',
							marginLeft: '3px',
							marginRight: '3px',
							backgroundColor: theme('colors.neutral.100'),
							'.dark &': {
								backgroundColor: theme('colors.neutral.800'), // Slightly lighter in dark mode
							},
							borderRadius: '0px !important',
							color: theme('colors.red.400'),
							fontFamily: 'JetBrains Mono, monospace',
							fontWeight: theme('fontWeight.bold'),
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word'
						},
						pre: {
							borderRadius: '0px !important',
							fontWeight: theme('fontWeight.bold'),
							fontFamily: 'JetBrains Mono, monospace',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							backgroundColor: theme('colors.neutral.800'),
						},
						'.info-block p': {
							margin: '0 !important'
						},
						blockquote: {
							borderLeftWidth: '5px',
							padding: '0.25rem 1rem',
							'.dark &': {
								color: theme('colors.neutral.100') // Slightly lighter in dark mode
							}
						},
						hr: {
							height: '2px',
							'.dark &': {
								borderColor: theme('colors.neutral.800'), // 深色模式颜色
							},
						},
						// Fix strong text
						strong: {
							color: theme('colors.neutral.900'), // Explicitly set light mode color
							'.dark &': {
								color: theme('colors.neutral.100') // Light color for dark mode
							}
						},
						// Fix headings (h1, h2, h3, etc.)
						h1: {
							color: theme('colors.neutral.900'),
							'.dark &': {
								color: theme('colors.neutral.100')
							}
						},
						h2: {
							color: theme('colors.neutral.900'),
							'.dark &': {
								color: theme('colors.neutral.100')
							}
						},
						h3: {
							color: theme('colors.neutral.900'),
							'.dark &': {
								color: theme('colors.neutral.100')
							}
						},
						h4: {
							color: theme('colors.neutral.900'),
							'.dark &': {
								color: theme('colors.neutral.100')
							}
						},
						h5: {
							color: theme('colors.neutral.900'),
							'.dark &': {
								color: theme('colors.neutral.100')
							}
						},
						h6: {
							color: theme('colors.neutral.900'),
							'.dark &': {
								color: theme('colors.neutral.100')
							}
						}
					}
				}
			})
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography')],
} satisfies Config;
