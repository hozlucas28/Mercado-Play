import { THEME } from '@/constants'
import type { Theme } from '@/types'

import { atom } from 'nanostores'

let themePreference = (localStorage.getItem(THEME.storageKey) as Theme) ?? THEME.default

if (!THEME.values.includes(themePreference)) {
	themePreference = THEME.default
	localStorage.removeItem(THEME.storageKey)
}

const themeStore = atom<Theme>(themePreference)

export { themeStore }
