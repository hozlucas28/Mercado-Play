import type { BREAKPOINTS, COMPRESS_CONFIGURATION } from './constants'

type Breakpoint = keyof typeof BREAKPOINTS

type BreakpointWidth = (typeof BREAKPOINTS)[Breakpoint]

type CompressConfiguration = typeof COMPRESS_CONFIGURATION

type Locale = 'es'

type Page = `/${'' | 'series' | 'films' | 'latest-releases' | 'my-list'}`

type Theme = 'light' | 'dark'

type ToastsStorage = Readonly<{
	displayed: string[]
}>

export type { Breakpoint, BreakpointWidth, CompressConfiguration, Locale, Page, Theme, ToastsStorage }
