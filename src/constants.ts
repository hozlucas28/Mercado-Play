import type { Breakpoint, Theme } from './types'

const BRAND_NAME: string = 'Mercado Play'

const BREAKPOINTS: Record<Breakpoint, number> = {
	'sm': 640,
	'md': 768,
	'lg': 1024,
	'xl': 1280,
	'2xl': 1536,
} as const

const DEFAULT_THEME: Theme = 'dark'
const DEFAULT_THEME_STORAGE_KEY: string = 'ui-theme'

const DEFAULT_TOASTS_STORAGE_KEY: string = 'toasts'

const TOASTS_IDS = {
	UNOFFICIAL_WEB: `unofficial-website-of-${BRAND_NAME.toLowerCase().replaceAll(/\s/g, '-')}`,
} as const

export {
	BRAND_NAME,
	BREAKPOINTS,
	DEFAULT_THEME,
	DEFAULT_THEME_STORAGE_KEY,
	DEFAULT_TOASTS_STORAGE_KEY,
	TOASTS_IDS,
}
