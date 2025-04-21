import { useSwitchTheme } from '@/components/hooks/use-switch-theme'
import { Button } from 'ui'

import { IconMoon, IconSun } from '@intentui/icons'
import clsx from 'clsx'
import type { ComponentProps } from 'react'

function ThemeSwitcher({
	className,
	...props
}: Omit<ComponentProps<typeof Button>, 'children' | 'aria-label' | 'onPress'>) {
	const [theme, switchTheme] = useSwitchTheme()

	return (
		<Button
			className={clsx(className, 'transition-shadow')}
			size='square-petite'
			intent='outline'
			aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
			onPress={switchTheme}
			{...props}
		>
			<IconSun
				className={`size-[1.2rem] transition-[scale,_rotate,_opacity] ${theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
			/>
			<IconMoon
				className={`absolute size-[1.2rem] transition-[scale,_rotate,_opacity] ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}`}
			/>
		</Button>
	)
}

export default ThemeSwitcher
