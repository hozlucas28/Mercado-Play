import { THEME } from '@/constants'
import type { Theme } from '@/types'

import { atom } from 'nanostores'

const themePreference = (localStorage.getItem(THEME.storageKey) ?? THEME.default) as Theme

const themeStore = atom<Theme>(THEME.values.includes(themePreference) ? themePreference : THEME.default)

export { themeStore }
