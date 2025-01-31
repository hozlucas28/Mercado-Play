import BrandLogo from '@/components/brand-logo'
import ThemeSwitcher from '@/components/theme-switcher'
import type { Page } from '@/types'
import { Avatar, Navbar, SearchField, Separator } from 'ui'

interface AvatarProps {
	src: string
	alt: string
	initials: string
}

interface HeaderProps {
	currentPage: Page
	avatar: AvatarProps
}

function Header({ avatar, currentPage }: HeaderProps) {
	const navbarLogoProps: React.ComponentProps<typeof Navbar.Logo> = {
		'aria-label': 'Ir a la página de inicio',
		'href': '/',
	}

	const searchFieldProps: React.ComponentProps<typeof SearchField> = {
		'aria-label': 'Buscar películas, series y más',
		'placeholder': 'Buscar películas o series...',
		'name': 'query',
		'type': 'text',
		'inputMode': 'text',
		'spellCheck': 'true',
		'onChange': (value) => console.log(value),
	}

	const separatorProps: React.ComponentProps<typeof Separator> = {
		className: 'ml-1 mr-3 h-6',
		orientation: 'vertical',
	}

	const avatarProps: React.ComponentProps<typeof Avatar> = {
		src: avatar.src,
		alt: avatar.alt,
		initials: avatar.initials,
		size: 'large',
	}

	return (
		<Navbar className='min-h-fit'>
			<Navbar.Nav>
				<Navbar.Section className='h-full'>
					{/* Desktop and mobile */}
					<Navbar.Logo className='p-0 my-3 max-w-fit sm:my-0' {...navbarLogoProps}>
						<BrandLogo className='h-10 sm:h-8' />
					</Navbar.Logo>

					{/* Only mobile */}
					<SearchField className='sm:hidden' {...searchFieldProps} />

					{/* Desktop and mobile */}
					<Navbar.Item href='/' isCurrent={currentPage === '/'} rel='home'>
						Inicio
					</Navbar.Item>
					<Navbar.Item href='/series' isCurrent={currentPage === '/series'}>
						Series
					</Navbar.Item>
					<Navbar.Item href='/films' isCurrent={currentPage === '/films'}>
						Películas
					</Navbar.Item>
					<Navbar.Item href='/latest-releases' isCurrent={currentPage === '/latest-releases'}>
						Últimos lanzamientos
					</Navbar.Item>
					<Navbar.Item href='/my-list' isCurrent={currentPage === '/my-list'}>
						Mi lista
					</Navbar.Item>

					{/* Only mobile */}
					<ThemeSwitcher className='mt-auto mb-3 size-[2.75rem] sm:hidden' />
				</Navbar.Section>

				{/* Only desktop */}
				<Navbar.Section className='hidden sm:flex sm:ml-auto'>
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
				<Navbar.Logo className='my-3 p-0' {...navbarLogoProps}>
					<BrandLogo className='h-full' />
				</Navbar.Logo>

				<Navbar.Flex>
					<Navbar.Trigger />
					<Separator {...separatorProps} />
					<Avatar {...avatarProps} />
				</Navbar.Flex>
			</Navbar.Compact>
		</Navbar>
	)
}

export type { AvatarProps, HeaderProps }

export default Header
