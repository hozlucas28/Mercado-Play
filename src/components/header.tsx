import { useSwitchTheme } from '@/components/hooks/use-switch-theme'
import { underlaysStore } from '@/components/stores/underlays'
import ThemeSwitcher from '@/components/theme-switcher'
import Toast from '@/components/toast'
import { BRAND, TOASTS } from '@/constants'
import type { Page } from '@/types'
import { scrollbarWidth as getScrollbarWidth } from '@/utils/scrollbar-width'
import { uniqueLocalExec } from '@/utils/unique-local-exec'
import { Avatar, Button, CommandMenu, Link, Menu, Navbar, SearchField, Separator } from 'ui'

import { IconChevronLgDown, IconMoon, IconSearch, IconSun } from '@intentui/icons'
import { useStore } from '@nanostores/react'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface AvatarProps {
	alt: string
	src: string
	initials: string
}

interface HeaderProps {
	avatar: AvatarProps
	currentPage: Page
	DesktopBrand: ReactNode
	MobileBrand: ReactNode
}

function Header({ avatar, currentPage, DesktopBrand, MobileBrand }: HeaderProps) {
	const [menu, setMenu] = useState(false)
	const [commandMenu, setCommandMenu] = useState(false)

	const $menu = useRef<HTMLButtonElement>(null)
	const $commandMenu = useRef<HTMLDivElement>(null)

	const [theme, setTheme] = useSwitchTheme()

	const underlays = useStore(underlaysStore)

	const scrollbarWidth = getScrollbarWidth()

	const navbarLogoProps: ComponentProps<typeof Navbar.Logo> = {
		'href': '/',
		'aria-label': `Ir a la página de inicio de "${BRAND.name}"`,
	}

	const searchFieldProps: ComponentProps<typeof SearchField> = {
		'name': 'query',
		'type': 'search',
		'inputMode': 'search',
		'placeholder': 'Buscar películas o series...',
		'aria-label': 'Buscar películas, series y más',
		'onChange': (value) => console.log(value), // TODO
	}

	const separatorProps: ComponentProps<typeof Separator> = {
		className: 'mx-2 h-6 max-[65.625rem]:lg:mx-0.5 transition-colors ease-in-out',
		orientation: 'vertical',
	}

	const avatarProps: ComponentProps<typeof Avatar> = {
		size: 'large',
		shape: 'square',
		alt: avatar.alt,
		src: avatar.src,
		initials: avatar.initials,
	}

	useEffect(() => {
		const description: () => ReactNode = () => (
			<>
				Rediseño de{' '}
				<Link
					intent='primary'
					href='https://play.mercadolibre.com.ar/'
					rel='noopener noreferrer'
					target='_blank'
				>
					Mercado Play
				</Link>
				, desarrollado por{' '}
				<Link
					intent='primary'
					href='https://github.com/hozlucas28'
					rel='noopener noreferrer'
					target='_blank'
				>
					@hozlucas28
				</Link>
				.
			</>
		)

		const uniqueToast = uniqueLocalExec(
			(id, setExecuted) => {
				return toast('Web no oficial', {
					id,
					description,
					duration: Infinity,
					onDismiss: setExecuted,
				})
			},
			{
				id: TOASTS.ids.unofficialWeb,
				localStorageID: TOASTS.storageKey,
			}
		)

		if (uniqueToast) uniqueToast()

		const searchParams = new URLSearchParams(document.location.search)

		const origin = searchParams.get('origin') ?? ''
		if (origin === '404') {
			toast.error('La página a la que has intentado ingresar no existe', {
				description: 'Te hemos redirigido a la página principal.',
				duration: 8000,
			})

			searchParams.delete('origin')
			window.history.replaceState(null, '', `?${searchParams.toString()}`)
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const viewportWidth: number = entry.contentRect.width + scrollbarWidth

				if (viewportWidth >= 1024) {
					setMenu(false)
					underlaysStore.setKey('menu', false)
					underlaysStore.setKey('sideNavbar', false)
				} else if (viewportWidth >= 769) {
					underlaysStore.setKey('sideNavbar', false)
				} else {
					setMenu(false)
					underlaysStore.setKey('menu', false)
				}
			}
		})

		observer.observe(document.documentElement)
	}, [])

	return (
		<>
			<Navbar
				className='fixed z-10 [animation:remove-padding_linear_both] [animation-range:0_32px] [animation-timeline:scroll()] *:transition-colors *:ease-in-out xl:animate-none'
				style={{
					paddingRight: Object.values(underlays).some((bool) => bool)
						? `calc(var(--spacing) * 2.5 + ${scrollbarWidth}px)`
						: '',
				}}
				intent='floating'
				isOpen={underlays.sideNavbar}
				onOpenChange={(isOpen) => underlaysStore.setKey('sideNavbar', isOpen)}
			>
				<Navbar.Nav className='[animation:remove-border_linear_both] [animation-range:0_32px] [animation-timeline:scroll()] xl:animate-none'>
					<Navbar.Section className='h-full min-h-fit'>
						{/* Desktop and mobile */}
						<Navbar.Logo
							className='max-w-fit px-0'
							{...navbarLogoProps}
						>
							{DesktopBrand}
						</Navbar.Logo>

						{/* Only for mobile */}
						<SearchField
							className='mb-4 sm:min-md:hidden'
							{...searchFieldProps}
						/>

						{/* Desktop and mobile */}
						<Navbar.Item
							href='/'
							isCurrent={currentPage === '/'}
						>
							Inicio
						</Navbar.Item>
						<Navbar.Item
							href='/series'
							isCurrent={currentPage === '/series'}
						>
							Series
						</Navbar.Item>
						<Navbar.Item
							href='/films'
							isCurrent={currentPage === '/films'}
						>
							Películas
						</Navbar.Item>
						<Navbar.Item
							href='/latest-releases'
							isCurrent={currentPage === '/latest-releases'}
						>
							Últimos lanzamientos
						</Navbar.Item>
						<Navbar.Item
							className='mb-auto sm:min-md:mb-0'
							href='/my-list'
							isCurrent={currentPage === '/my-list'}
						>
							Mi lista
						</Navbar.Item>

						{/* Only for mobile */}
						<ThemeSwitcher className='mt-8 mb-1 size-[2.5rem] sm:mb-4 sm:min-md:hidden' />
					</Navbar.Section>

					{/* Only for desktop */}
					<Navbar.Section className='ml-auto max-md:hidden sm:max-[50rem]:gap-x-2 max-[65.625rem]:lg:gap-x-2'>
						{/* Only for "md" breakpoint */}
						<Menu
							isOpen={menu}
							onOpenChange={(isOpen) => {
								setMenu(isOpen)
								underlaysStore.setKey('menu', isOpen)
							}}
						>
							<Button
								className='group hidden size-10 md:max-lg:flex'
								intent='outline'
								aria-label='Más opciones'
								ref={$menu}
							>
								<IconChevronLgDown className='group-pressed:rotate-180 decoration-200 transition-transform' />
							</Button>
							<Menu.Content
								className='hidden *:cursor-pointer md:max-lg:grid'
								placement='bottom'
								showArrow
							>
								<Menu.Item
									onAction={() => {
										setCommandMenu(true)
										underlaysStore.setKey('commandMenu', true)
									}}
								>
									<IconSearch />
									<Menu.Label ref={$commandMenu}>Buscar películas o series</Menu.Label>
								</Menu.Item>
								<Menu.Item onAction={setTheme}>
									<figure
										className='relative *:absolute *:transition-all'
										data-slot='icon'
										aria-hidden
									>
										<IconSun
											className={theme === 'dark' ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}
										/>
										<IconMoon
											className={theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
										/>
									</figure>

									<Menu.Label aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}>
										Cambiar tema
									</Menu.Label>
								</Menu.Item>
							</Menu.Content>
						</Menu>

						{/* Only for breakpoints after "lg" */}
						<SearchField
							className='max-lg:hidden'
							{...searchFieldProps}
						/>
						<ThemeSwitcher className='size-10 max-lg:hidden' />

						<Separator {...separatorProps} />
						<Avatar {...avatarProps} />
					</Navbar.Section>
				</Navbar.Nav>

				{/* Only for mobile */}
				<Navbar.Compact className='[animation:remove-border_linear_both] [animation-range:0_32px] [animation-timeline:scroll()] xl:animate-none'>
					<Navbar.Logo
						className='p-0'
						{...navbarLogoProps}
					>
						{MobileBrand}
					</Navbar.Logo>

					<Navbar.Flex ref={$commandMenu}>
						<Navbar.Trigger />
						<Separator {...separatorProps} />
						<Avatar
							className='size-8 *:size-8'
							{...avatarProps}
						/>
					</Navbar.Flex>
				</Navbar.Compact>

				{/* Backdrop */}
				<span className='absolute inset-0 -z-10 mx-auto h-[calc(var(--navbar-height)+0.5rem)] w-full max-w-[calc(var(--container-7xl)+0.5rem)] [animation:fade-in_linear_both] rounded-xl bg-neutral-900 blur-xl [--navbar-height:3.5rem] [animation-range:0_32px] [animation-timeline:scroll()] md:h-[calc(var(--navbar-height)+1rem)] md:max-w-[calc(var(--container-7xl)+1rem)] 2xl:max-w-(--breakpoint-2xl)' />
			</Navbar>

			{/* Only for "md" breakpoint */}
			<CommandMenu
				classNames={{
					overlay: 'data-exiting:pointer-events-none data-exiting:animate-[fade-out_200ms_forwards]!',
				}}
				aria-label='Buscador'
				isOpen={commandMenu}
				isBlurred
				onOpenChange={(isOpen) => {
					setCommandMenu(isOpen)
					underlaysStore.setKey('commandMenu', isOpen)
				}}
			>
				<CommandMenu.Search
					inputMode={searchFieldProps.inputMode}
					placeholder={searchFieldProps.placeholder}
					aria-label={searchFieldProps['aria-label']}
				/>
				<CommandMenu.List className='[&_div[role="menuitem"]]:cursor-pointer!'>
					<CommandMenu.Section title='Películas'>
						<CommandMenu.Item textValue='Black Sails'>Black Sails</CommandMenu.Item>
					</CommandMenu.Section>
					<CommandMenu.Section title='Series'>
						<CommandMenu.Item textValue='Interestelar'>Interestelar</CommandMenu.Item>
						<CommandMenu.Item textValue='Yellowstone'>Yellowstone</CommandMenu.Item>
					</CommandMenu.Section>
				</CommandMenu.List>
			</CommandMenu>

			<Toast />
		</>
	)
}

export type { AvatarProps }

export default Header
