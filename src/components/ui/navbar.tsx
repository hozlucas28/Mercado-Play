import * as React from 'react'

import { IconHamburger } from 'justd-icons'
import { LayoutGroup, motion } from 'motion/react'
import type { LinkProps } from 'react-aria-components'
import { composeRenderProps, Link } from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Button } from './button'
import { cn, useMediaQuery } from './primitive'
import { Sheet } from './sheet'

type NavbarOptions = {
	side?: 'left' | 'right'
	isSticky?: boolean
	intent?: 'navbar' | 'floating' | 'inset'
}

type NavbarContextProps = {
	open: boolean
	setOpen: (open: boolean) => void
	isCompact: boolean
	toggleNavbar: () => void
} & NavbarOptions

const NavbarContext = React.createContext<NavbarContextProps | null>(null)

function useNavbar() {
	const context = React.useContext(NavbarContext)
	if (!context) {
		throw new Error('useNavbar must be used within a Navbar.')
	}

	return context
}

interface NavbarProviderProps
	extends React.ComponentProps<'header'>,
		NavbarOptions {
	defaultOpen?: boolean
	isOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

const navbarStyles = tv({
	base: 'relative isolate flex min-h-svh w-full flex-col',
	variants: {
		intent: {
			floating: 'px-2.5 pt-2',
			navbar: '',
			inset: 'bg-secondary dark:bg-bg',
		},
	},
})

const Navbar = ({
	children,
	isOpen: openProp,
	onOpenChange: setOpenProp,
	defaultOpen = false,
	className,
	side = 'left',
	isSticky = false,
	intent = 'navbar',
	...props
}: NavbarProviderProps) => {
	const isCompact = useMediaQuery('(max-width: 1023px)')
	const [_open, _setOpen] = React.useState(defaultOpen)
	const open = openProp ?? _open

	const setOpen = React.useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			if (setOpenProp) {
				return setOpenProp?.(typeof value === 'function' ? value(open) : value)
			}

			_setOpen(value)
		},
		[setOpenProp, open]
	)

	const toggleNavbar = React.useCallback(() => {
		setOpen((open) => !open)
	}, [setOpen])

	const contextValue = React.useMemo<NavbarContextProps>(
		() => ({
			open,
			setOpen,
			isCompact,
			toggleNavbar,
			intent,
			isSticky,
			side,
		}),
		[open, setOpen, isCompact, toggleNavbar, intent, isSticky, side]
	)
	return (
		<NavbarContext.Provider value={contextValue}>
			<header
				className={navbarStyles({ intent, className })}
				data-intent={intent}
				{...props}
			>
				{children}
			</header>
		</NavbarContext.Provider>
	)
}

const navStyles = tv({
	base: [
		'group peer hidden h-[--navbar-height] w-full items-center px-4 [--navbar-height:3.5rem] lg:flex',
		'[&>div]:mx-auto [&>div]:w-full [&>div]:max-w-[1680px] [&>div]:items-center lg:[&>div]:flex',
	],
	variants: {
		isSticky: {
			true: 'sticky top-0 z-40',
		},
		intent: {
			floating:
				'mx-auto w-full max-w-7xl rounded-xl border bg-tertiary shadow-sm sm:px-4 2xl:max-w-screen-2xl',
			navbar: 'border-b bg-tertiary shadow-sm sm:px-6',
			inset: [
				'mx-auto bg-secondary dark:bg-bg sm:px-6',
				'[&>div]:mx-auto [&>div]:w-full [&>div]:items-center lg:[&>div]:flex 2xl:[&>div]:max-w-screen-2xl',
			],
		},
	},
})

interface NavbarProps extends React.ComponentProps<'div'> {
	intent?: 'navbar' | 'floating' | 'inset'
	isSticky?: boolean
	side?: 'left' | 'right'
}

const Nav = ({ className, ...props }: NavbarProps) => {
	const { isCompact, side, intent, isSticky, open, setOpen } = useNavbar()

	if (isCompact) {
		return (
			<Sheet
				isOpen={open}
				onOpenChange={setOpen}
				{...props}
			>
				<Sheet.Content
					aria-label='Compact Navbar'
					classNames={{
						content: 'text-fg [&>button]:hidden',
					}}
					data-navbar='compact'
					isStack={intent === 'floating'}
					side={side}
				>
					<Sheet.Body className='px-2 sm:px-4'>{props.children}</Sheet.Body>
				</Sheet.Content>
			</Sheet>
		)
	}

	return (
		<div
			className={navStyles({ isSticky, intent, className })}
			{...props}
		>
			<div>{props.children}</div>
		</div>
	)
}

const Trigger = ({
	className,
	onPress,
	...props
}: React.ComponentProps<typeof Button>) => {
	const { toggleNavbar } = useNavbar()
	return (
		<Button
			appearance='plain'
			aria-label={props['aria-label'] || 'Toggle Navbar'}
			className={className}
			data-sidebar='trigger'
			onPress={(event) => {
				onPress?.(event)
				toggleNavbar()
			}}
			size='square-petite'
			{...props}
		>
			<IconHamburger />
			<span className='sr-only'>Toggle Navbar</span>
		</Button>
	)
}

const Section = ({ className, ...props }: React.ComponentProps<'div'>) => {
	const { isCompact } = useNavbar()
	const id = React.useId()
	return (
		<LayoutGroup id={id}>
			<div
				className={cn(
					'flex',
					isCompact ? 'flex-col gap-y-4' : 'flex-row items-center gap-x-3',
					className
				)}
				data-slot='navbar-section'
				{...props}
			>
				{props.children}
			</div>
		</LayoutGroup>
	)
}

const navItemStyles = tv({
	base: [
		'relative flex cursor-pointer items-center gap-x-2 px-2 text-muted-fg outline-none transition-colors lg:text-sm forced-colors:transform-none forced-colors:outline-0 forced-colors:disabled:text-[GrayText] [&>[data-slot=icon]]:-mx-0.5',
		'hover:text-fg focus:text-fg focus-visible:outline-1 focus-visible:outline-primary pressed:text-fg',
		'disabled:cursor-default disabled:opacity-60',
		'[&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:shrink-0',
	],
	variants: {
		isCurrent: {
			true: 'text-fg',
		},
	},
})

interface ItemProps extends LinkProps {
	isCurrent?: boolean
}

const Item = ({ className, isCurrent, ...props }: ItemProps) => {
	const { intent, isCompact } = useNavbar()
	return (
		<Link
			aria-current={isCurrent ? 'page' : undefined}
			className={composeRenderProps(className, (className, ...renderProps) =>
				navItemStyles({ ...renderProps, isCurrent, className })
			)}
			slot='navbar-item'
			{...props}
		>
			{(values) => (
				<>
					{typeof props.children === 'function'
						? props.children(values)
						: props.children}

					{(isCurrent || values.isCurrent) &&
						!isCompact &&
						intent !== 'floating' && (
							<motion.span
								className='absolute inset-x-2 bottom-[calc(var(--navbar-height)*-0.33)] h-0.5 rounded-full bg-fg'
								layoutId='current-indicator'
							/>
						)}
				</>
			)}
		</Link>
	)
}

const Logo = ({ className, ...props }: LinkProps) => {
	return (
		<Link
			className={cn(
				'flex items-center gap-x-2 px-2 py-4 text-fg focus:outline-none focus-visible:outline-1 focus-visible:outline-primary lg:mr-4 lg:px-0 lg:py-0',
				className
			)}
			{...props}
		/>
	)
}

const Flex = ({ className, ...props }: React.ComponentProps<'div'>) => {
	return (
		<div
			className={cn('flex items-center gap-2 sm:gap-3', className)}
			{...props}
		/>
	)
}

const compactStyles = tv({
	base: 'flex justify-between bg-tertiary peer-has-[[data-intent=floating]]:border lg:hidden',
	variants: {
		intent: {
			floating: 'h-12 rounded-lg border px-3.5',
			inset: 'h-14 px-4',
			navbar: 'h-14 border-b px-4',
		},
	},
})

const Compact = ({ className, ...props }: React.ComponentProps<'div'>) => {
	const { intent } = useNavbar()
	return (
		<div
			className={compactStyles({ intent, className })}
			{...props}
		/>
	)
}

const insetStyles = tv({
	base: 'grow',
	variants: {
		intent: {
			floating: '',
			inset:
				'bg-tertiary lg:rounded-lg lg:shadow-sm lg:ring-1 lg:ring-dark/5 lg:dark:ring-light/10',
			navbar: '',
		},
	},
})

const Inset = ({ className, ...props }: React.ComponentProps<'div'>) => {
	const { intent } = useNavbar()
	return (
		<main
			className={cn(
				'flex flex-1 flex-col',
				intent === 'inset' && 'pb-2 lg:px-2',
				className
			)}
			data-intent={intent}
		>
			<div className={insetStyles({ intent, className })}>{props.children}</div>
		</main>
	)
}

Navbar.Nav = Nav
Navbar.Inset = Inset
Navbar.Compact = Compact
Navbar.Flex = Flex
Navbar.Trigger = Trigger
Navbar.Logo = Logo
Navbar.Item = Item
Navbar.Section = Section

export { Navbar }
