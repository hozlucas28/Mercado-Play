import { themeStore } from '@/components/stores/theme'
import { THEME } from '@/constants'

import type { Theme } from '@/types'

import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

function useSwitchTheme(): [Theme, () => void] {
	const currentTheme = useStore(themeStore)

	useEffect(() => {
		let themeFromStorage = (localStorage.getItem(THEME.storageKey) as Theme) ?? THEME.default

		if (!THEME.values.includes(themeFromStorage)) {
			themeFromStorage = THEME.default
			localStorage.removeItem(THEME.storageKey)
		}

		themeStore.set(themeFromStorage)

		window.document.documentElement.classList.remove(...THEME.values)
		window.document.documentElement.classList.add(themeFromStorage)
	}, [])

	const switchTheme = () => {
		const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'
		themeStore.set(newTheme)

		window.document.documentElement.classList.remove(...THEME.values)
		window.document.documentElement.classList.add(newTheme)
	}

	return [currentTheme, switchTheme]
}

export { useSwitchTheme }
