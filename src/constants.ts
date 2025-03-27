const BRAND = {
	name: 'Mercado Play',
	description:
		'Encontrá películas y series en Mercado Play, rediseñado por @hozlucas28. Explorá cientos de películas y series sin costo alguno.',
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

const THEME = {
	default: 'dark',
	storageKey: 'ui-theme',
	values: ['light', 'dark'],
} as const

const TOASTS = {
	storageKey: 'toasts',

	ids: {
		unofficialWeb: `unofficial-website-of-${BRAND.name.toLowerCase().replaceAll(/\s/g, '-')}`,
	},
} as const

export { BRAND, BREAKPOINTS, COMPRESS_CONFIGURATION, THEME, TOASTS }
