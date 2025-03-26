import { useSwitchTheme } from '@/components/hooks/use-switch-theme'
import { Button } from 'ui'

import { IconMoon, IconSun } from 'justd-icons'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

function ThemeSwitcher(props: Omit<ComponentProps<typeof Button>, 'children' | 'aria-label' | 'onPress'>) {
	const [currentTheme, switchTheme] = useSwitchTheme()

	return (
		<Button
			size='square-petite'
			intent='outline'
			aria-label='Cambiar tema'
			onPress={switchTheme}
			{...props}
		>
			<IconSun
				className={twMerge(
					'h-[1.2rem] w-[1.2rem] transition-all',
					currentTheme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
				)}
			/>
			<IconMoon
				className={twMerge(
					'absolute h-[1.2rem] w-[1.2rem] transition-all',
					currentTheme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
				)}
			/>
		</Button>
	)
}

export default ThemeSwitcher
