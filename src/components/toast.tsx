import { scrollbarWidth as getScrollbarWidth } from '@/utils/scrollbar-width'

import { useStore } from '@nanostores/react'
import type { ToasterProps } from 'sonner'
import { Toast as PrimitiveToast } from 'ui'

import { underlaysStore } from './stores/underlays'

function Toast(props: ToasterProps) {
	const underlays = useStore(underlaysStore)

	const hasUnderlays = Object.values(underlays).some((bool) => bool)
	const scrollbarWidth = getScrollbarWidth()

	const offset = 24
	const mobileOffset = 16

	return (
		<PrimitiveToast
			className={hasUnderlays ? `animate-[fade-out_200ms_forwards]` : 'animate-[fade-in_200ms_forwards]'}
			toastOptions={{
				classNames: {
					toast: `transition-colors! ease-in-out! has-data-description:**:data-icon:mt-[3.5px] has-data-description:**:data-icon:mb-auto`,
					title: 'text-base text-balance',
					description: 'text-sm text-pretty',
					icon: 'mx-0! w-fit! **:m-0!',
				},
			}}
			offset={{
				top: offset,
				right: hasUnderlays ? `${offset + scrollbarWidth}px` : `${offset}px`,
				bottom: offset,
				left: offset,
			}}
			mobileOffset={{
				top: mobileOffset,
				right: hasUnderlays ? `${mobileOffset + scrollbarWidth}px` : `${mobileOffset}px`,
				bottom: mobileOffset,
				left: mobileOffset,
			}}
			containerAriaLabel='Notificaciones'
			closeButton
			{...props}
		/>
	)
}

export default Toast
