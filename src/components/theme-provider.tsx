import { themeStore } from '@/components/stores/theme.ts'
import { useStore } from '@nanostores/react'

export const useTheme = () => {
	const currentTheme = useStore(themeStore)
	return { theme: currentTheme }
}
