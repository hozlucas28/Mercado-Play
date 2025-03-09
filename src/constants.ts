import type { Theme } from './types'

const BRAND_NAME: string = 'Mercado Play'

const DEFAULT_THEME: Theme = 'dark'
const DEFAULT_THEME_STORAGE_KEY: string = 'ui-theme'

const DEFAULT_TOASTS_STORAGE_KEY: string = 'toasts'

const TOASTS_IDS = {
	UNOFFICIAL_WEB: `unofficial-website-of-${BRAND_NAME.toLowerCase().replaceAll(' ', '-')}`,
} as const

export {
	BRAND_NAME,
	DEFAULT_THEME,
	DEFAULT_THEME_STORAGE_KEY,
	DEFAULT_TOASTS_STORAGE_KEY,
	TOASTS_IDS,
}
