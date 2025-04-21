import type { ComponentProps } from 'react'

function IconDeviceDesktopDown(props: ComponentProps<'svg'>) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'
			data-slot='icon'
			{...props}
		>
			<path
				stroke='none'
				d='M0 0h24v24H0z'
				fill='none'
			/>
			<path d='M13.5 16h-9.5a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v7.5' />
			<path d='M7 20h5' />
			<path d='M9 16v4' />
			<path d='M19 16v6' />
			<path d='M22 19l-3 3l-3 -3' />
		</svg>
	)
}

export { IconDeviceDesktopDown }
