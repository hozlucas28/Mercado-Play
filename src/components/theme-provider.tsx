import { THEME } from '@/constants'
import type { Theme } from '@/types'

import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

import { themeStore } from './stores/theme'

export const useTheme = () => {
	const currentTheme = useStore(themeStore)

	useEffect(() => {
		window.document.documentElement.classList.remove(...THEME.values)
		window.document.documentElement.classList.add(currentTheme)
	}, [currentTheme])

	return {
		theme: currentTheme,
		setTheme: (newTheme: Theme) => {
			themeStore.set(newTheme)
			localStorage.setItem(THEME.storageKey, newTheme)
		},
	}
}
