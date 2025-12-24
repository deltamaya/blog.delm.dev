import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				Sans: ['-apple-system', 'Noto Sans SC', 'Noto Sans TC', 'system-ui', 'sans-serif'],
				Serif: ['IBM Plex Serif', 'Noto Sans Serif SC', 'Noto Sans Serif TC', 'serif'],
				JetBrainsMono: ['JetBrains Mono', 'consolas', 'monospace']
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						table: {
							borderCollapse: 'collapse',
							border: `1px solid ${theme('colors.neutral.300')}`,
							'.dark &': {
								border: `2px solid ${theme('colors.neutral.800')}`
							}
						},
						thead: {
							'& > tr > th': {
								color: theme('colors.neutral.900'),
								'.dark &': {
									color: theme('colors.neutral.100')
								}
							}
						},
						'thead th': {
							border: `1px solid ${theme('colors.neutral.300')}`,
							textAlign: 'center !important', // Center-align header text
							'.dark &': {
								border: `2px solid ${theme('colors.neutral.800')}`
							},
							padding: theme('padding.2') + ' !important',
						},
						'tbody td': {
							border: `1px solid ${theme('colors.neutral.300')}`,
							textAlign: 'left',
							'.dark &': {
								border: `2px solid ${theme('colors.neutral.800')}`
							},
							padding: theme('padding.2') + ' !important',
						},
						a: {
							color: theme('colors.red.600'),
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
								backgroundColor: theme('colors.neutral.900') // Slightly lighter in dark mode
							},
							borderRadius: '0px !important',
							color: theme('colors.red.600'),
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
							backgroundColor: theme('colors.neutral.900'),
							borderWidth: '2px',
							borderColor: theme('colors.neutral.800')
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
								borderColor: theme('colors.neutral.800') // 深色模式颜色
							}
						},
						// Fix strong text
						strong: {
							color: theme('colors.neutral.900'), // Explicitly set light mode color
							'.dark &': {
								color: theme('colors.neutral.100') // Light color for dark mode
							}
						},
					}
				}
			})
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography')]
} satisfies Config;
