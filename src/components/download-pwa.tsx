import Brand from '@/components/brand.astro'
import { usePWA } from '@/components/hooks/use-pwa'
import { Button } from 'ui'
import { IconDeviceDesktopDown, IconDeviceTabletDown } from './icons'

import clsx from 'clsx'
import { type ComponentProps } from 'react'

function DownloadPWA({ children, className, ...props }: Omit<ComponentProps<typeof Button>, 'aria-label' | 'onPress'>) {
	const [isInstalledPWA, installPWA] = usePWA()

	return (
		!isInstalledPWA && (
			<Button
				className={clsx(className, 'transition-shadow')}
				size='square-petite'
				intent='outline'
				aria-label={children ? `Instalar la aplicación de "${Brand.name}"` : undefined}
				onPress={installPWA}
				{...props}
			>
				<>
					<IconDeviceTabletDown
						className='lg:hidden'
						aria-hidden
					/>
					<IconDeviceDesktopDown
						className='hidden lg:block'
						aria-hidden
					/>
					{children}
				</>
			</Button>
		)
	)
}

export default DownloadPWA
