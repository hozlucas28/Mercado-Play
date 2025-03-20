import type { Theme } from './types'

const BRAND = {
	name: 'Mercado Play',
	description:
		'Encontrá series y películas gratis en Mercado Play. Explorá cientos de películas y series sin costo alguno.',
	primaryColor: '#ffe501',
} as const

const BREAKPOINTS = {
	'2xl': 1536,
	'xl': 1280,
	'lg': 1024,
	'md': 768,
	'sm': 640,
} as const

const COMPRESS_CONFIGURATION = {
	rawPrefix: '__',

	images: {
		breakpointSep: '-',
		extsToCompress: ['png'],

		outputFormats: {
			avif: 80,
			webp: 50,
			png: 100,
		},
	},
} as const

const DEFAULT_THEME: Theme = 'dark'
const DEFAULT_THEME_STORAGE_KEY = 'ui-theme' as const

const DEFAULT_TOASTS_STORAGE_KEY = 'toasts' as const

const TOASTS_IDS = {
	UNOFFICIAL_WEB: `unofficial-website-of-${BRAND.name.toLowerCase().replaceAll(/\s/g, '-')}`,
} as const

export {
	BRAND,
	BREAKPOINTS,
	COMPRESS_CONFIGURATION,
	DEFAULT_THEME,
	DEFAULT_THEME_STORAGE_KEY,
	DEFAULT_TOASTS_STORAGE_KEY,
	TOASTS_IDS,
}
