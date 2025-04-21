import { themeStore } from '@/components/stores/theme.ts'
import { BRAND, THEME } from '@/constants.ts'
import type { Theme } from '@/types'
import { useStore } from '@nanostores/react'

function useSwitchTheme(): [Theme, () => void] {
	const theme = useStore(themeStore)

	const switchTheme = () => {
		const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'

		const documentClassList = document.documentElement.classList

		documentClassList.remove(theme)
		documentClassList.add(newTheme)

		const $head = document.head

		$head.querySelector('meta[name="theme-color"]')?.setAttribute('content', BRAND.themeColors[newTheme])

		localStorage.setItem(THEME.storageKey, newTheme)

		themeStore.set(newTheme)
	}

	return [theme, switchTheme]
}

export { useSwitchTheme }
