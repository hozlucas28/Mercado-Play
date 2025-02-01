import { DEFAULT_THEME, DEFAULT_THEME_STORAGE_KEY } from '@/constants'
import type { Theme } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'

type ThemeProviderState = {
	theme: Theme
	setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
	theme: DEFAULT_THEME,
	setTheme: () => null,
}

const ThemeProviderContext = createContext(initialState)

type ThemeProviderProps = {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

export function ThemeProvider({
	children,
	defaultTheme = DEFAULT_THEME,
	storageKey = DEFAULT_THEME_STORAGE_KEY,
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState(() => (localStorage.getItem(storageKey) as Theme) || DEFAULT_THEME)

	useEffect(() => {
		const darkTheme: Theme = 'dark'
		const lightTheme: Theme = 'light'
		window.document.documentElement.classList.remove(lightTheme, darkTheme)
		window.document.documentElement.classList.add(theme)
	}, [theme])

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme)
			setTheme(theme)
		},
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)
	if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

	return context
}
