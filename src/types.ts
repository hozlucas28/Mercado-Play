type Locale = 'es'

type Page = `/${'' | 'series' | 'films' | 'latest-releases' | 'my-list'}`

type Theme = 'light' | 'dark'

type ToastsStorage = {
	displayed: string[]
}

export type { Locale, Page, Theme, ToastsStorage }
