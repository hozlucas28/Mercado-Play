'use client'

import { DEFAULT_THEME, DEFAULT_THEME_STORAGE_KEY } from '@/constants'
import type { Theme } from '@/types'
import { IconMoon, IconSun } from 'justd-icons'
import { useEffect, useState, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from 'ui'

interface ThemeSwitcherProps extends ComponentProps<typeof Button> {
	defaultTheme?: Theme
	storageKey?: string
}

function ThemeSwitcher({
	defaultTheme = DEFAULT_THEME,
	storageKey = DEFAULT_THEME_STORAGE_KEY,
	...props
}: ThemeSwitcherProps) {
	const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)

	const darkTheme: Theme = 'dark'
	const lightTheme: Theme = 'light'

	useEffect(() => {
		const savedTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme
		setCurrentTheme(savedTheme)

		document.documentElement.classList[savedTheme === darkTheme ? 'add' : 'remove'](darkTheme)
	}, [])

	const handleSwitchTheme = () => {
		const newTheme = currentTheme === lightTheme ? darkTheme : lightTheme
		setCurrentTheme(newTheme)

		document.documentElement.classList[newTheme === darkTheme ? 'add' : 'remove'](darkTheme)
		localStorage.setItem(storageKey, newTheme)
	}

	return (
		<Button
			intent='outline'
			aria-label='Cambiar tema'
			onPress={handleSwitchTheme}
			size='square-petite'
			{...props}
		>
			<IconSun
				className={twMerge(
					'h-[1.2rem] w-[1.2rem] transition-all',
					currentTheme === darkTheme ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
				)}
			/>
			<IconMoon
				className={twMerge(
					'absolute h-[1.2rem] w-[1.2rem] transition-all',
					currentTheme === darkTheme ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
				)}
			/>
		</Button>
	)
}

export type { ThemeSwitcherProps }

export default ThemeSwitcher
