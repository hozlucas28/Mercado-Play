'use client'

import type { Theme } from '@/types'
import { IconMoon, IconSun } from 'justd-icons'
import { useEffect, useState, type ComponentProps } from 'react'
import { Button, cn } from 'ui'

const _defaultTheme: Theme = 'dark'
const _defaultStorageKey: string = 'ui-theme'

interface ThemeSwitcherProps extends ComponentProps<typeof Button> {
	defaultTheme?: Theme
	storageKey?: string
}

function ThemeSwitcher({
	defaultTheme = _defaultTheme,
	storageKey = _defaultStorageKey,
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
		<Button appearance='outline' size='square-petite' aria-label='Cambiar tema' onPress={handleSwitchTheme} {...props}>
			<IconSun
				className={cn(
					'h-[1.2rem] w-[1.2rem] transition-all',
					currentTheme === darkTheme ? 'opacity-0 scale-0 -rotate-90' : 'opacity-100 scale-100 rotate-0'
				)}
			/>
			<IconMoon
				className={cn(
					'absolute h-[1.2rem] w-[1.2rem] transition-all',
					currentTheme === darkTheme ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-90'
				)}
			/>
		</Button>
	)
}

export type { ThemeSwitcherProps }

export default ThemeSwitcher

export { _defaultStorageKey as 'defaultStorageKey', _defaultTheme as 'defaultTheme' }
