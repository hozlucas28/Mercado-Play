import { THEME } from '@/constants'
import type { Theme } from '@/types'

import { atom } from 'nanostores'

let themePreference: Theme = THEME.default

if (typeof window !== 'undefined') {
	const storedTheme = localStorage.getItem(THEME.storageKey) as Theme
	THEME.values.includes(storedTheme) ? (themePreference = storedTheme) : localStorage.removeItem(THEME.storageKey)
}

const themeStore = atom<Theme>(themePreference)

export { themeStore }
