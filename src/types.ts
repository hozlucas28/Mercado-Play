type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

type Locale = 'es'

type Page = `/${'' | 'series' | 'films' | 'latest-releases' | 'my-list'}`

type Theme = 'light' | 'dark'

type ToastsStorage = {
	displayed: string[]
}

export type { Breakpoint, Locale, Page, Theme, ToastsStorage }
