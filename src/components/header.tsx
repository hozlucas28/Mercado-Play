import ThemeSwitcher from '@/components/theme-switcher'
import { TOASTS_IDS } from '@/constants'
import type { Page } from '@/types'
import showToast from '@/utils/show-toast'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Avatar, Link, Navbar, SearchField, Separator, Toast } from 'ui'

interface AvatarProps {
	alt: string
	src: string
	initials: string
}

interface HeaderProps {
	avatar: AvatarProps
	currentPage: Page
	Brand: ReactNode
	SidebarBrand: ReactNode
}

function Header({ avatar, currentPage, Brand, SidebarBrand }: HeaderProps) {
	const navbarLogoProps: React.ComponentProps<typeof Navbar.Logo> = {
		'href': '/',
		'aria-label': 'Ir a la página de inicio',
	}

	const searchFieldProps: React.ComponentProps<typeof SearchField> = {
		'name': 'query',
		'type': 'text',
		'inputMode': 'text',
		'spellCheck': 'true',
		'placeholder': 'Buscar películas o series...',
		'aria-label': 'Buscar películas, series y más',
		'onChange': (value) => console.log(value), // TODO
	}

	const separatorProps: React.ComponentProps<typeof Separator> = {
		className: 'ml-1 mr-3 h-6',
		orientation: 'vertical',
	}

	const avatarProps: React.ComponentProps<typeof Avatar> = {
		alt: avatar.alt,
		src: avatar.src,
		size: 'large',
		initials: avatar.initials,
	}

	useEffect(() => {
		const title: string = 'Web no oficial'

		const description: () => React.ReactNode = () => (
			<span>
				Rediseño de{' '}
				<Link
					href='https://play.mercadolibre.com.ar/'
					intent='primary'
					rel='noopener noreferrer'
					target='_blank'
				>
					Mercado Play
				</Link>
				, desarrollado por{' '}
				<Link
					href='https://github.com/hozlucas28'
					intent='primary'
					rel='noopener noreferrer'
					target='_blank'
				>
					@hozlucas28
				</Link>
				.
			</span>
		)

		showToast(
			title,
			{
				id: TOASTS_IDS.UNOFFICIAL_WEB,
				description,
			},
			{
				oneTime: true,
				untilManualClose: true,
			}
		)
	}, [])

	return (
		<>
			<Navbar className='min-h-fit'>
				<Navbar.Nav>
					<Navbar.Section className='h-full'>
						{/* Desktop and mobile */}
						<Navbar.Logo
							className='my-3 max-w-fit p-0 lg:my-0'
							{...navbarLogoProps}
						>
							{Brand}
						</Navbar.Logo>

						{/* Only mobile */}
						<SearchField
							className='lg:hidden'
							{...searchFieldProps}
						/>

						{/* Desktop and mobile */}
						<Navbar.Item
							href='/'
							isCurrent={currentPage === '/'}
							rel='home'
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
							href='/my-list'
							isCurrent={currentPage === '/my-list'}
						>
							Mi lista
						</Navbar.Item>

						{/* Only mobile */}
						<ThemeSwitcher className='mt-auto mb-3 size-[2.75rem] lg:hidden' />
					</Navbar.Section>

					{/* Only desktop */}
					<Navbar.Section className='hidden lg:ml-auto lg:flex'>
						<Navbar.Flex>
							<SearchField {...searchFieldProps} />
							<ThemeSwitcher className='size-[2.5rem]' />
							<Separator {...separatorProps} />
							<Avatar {...avatarProps} />
						</Navbar.Flex>
					</Navbar.Section>
				</Navbar.Nav>

				{/* Only mobile */}
				<Navbar.Compact>
					<Navbar.Logo
						className='my-3 p-0'
						{...navbarLogoProps}
					>
						{SidebarBrand}
					</Navbar.Logo>

					<Navbar.Flex>
						<Navbar.Trigger />
						<Separator {...separatorProps} />
						<Avatar {...avatarProps} />
					</Navbar.Flex>
				</Navbar.Compact>
			</Navbar>

			<Toast />
		</>
	)
}

export type { AvatarProps, HeaderProps }

export default Header
